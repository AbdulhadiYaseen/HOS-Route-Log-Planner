import json
import re
import math
import requests
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from routing.models import Trip

# Custom User-Agent header as required by Nominatim usage guidelines
USER_AGENT = "HOS-Trip-Planner-Sppotter-Assessment/1.0 (abdulhadi.yaseen@example.com)"

# Dictionary of major mock locations to ensure offline compatibility
MOCK_CITIES = {
    'chicago': (41.8781, -87.6298, 'Chicago, IL'),
    'atlanta': (33.7490, -84.3880, 'Atlanta, GA'),
    'dallas': (32.7767, -96.7970, 'Dallas, TX'),
    'milwaukee': (43.0389, -87.9065, 'Milwaukee, WI'),
    'new york': (40.7128, -74.0060, 'New York, NY'),
    'los angeles': (34.0522, -118.2437, 'Los Angeles, CA'),
    'seattle': (47.6062, -122.3321, 'Seattle, WA'),
    'miami': (25.7617, -80.1918, 'Miami, FL'),
    'houston': (29.7604, -95.3698, 'Houston, TX'),
    'denver': (39.7392, -104.9903, 'Denver, CO'),
    'phoenix': (33.4484, -112.0740, 'Phoenix, AZ'),
    'san francisco': (37.7749, -122.4194, 'San Francisco, CA'),
    'boston': (42.3601, -71.0589, 'Boston, MA'),
    'indianapolis': (39.7684, -86.1581, 'Indianapolis, IN'),
    'charlotte': (35.2271, -80.8431, 'Charlotte, NC'),
}

def parse_coordinates(location_name):
    """
    Parses latitude and longitude from strings like '41.8781, -87.6298'
    """
    pattern = r'^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$'
    match = re.match(pattern, location_name)
    if match:
        return float(match.group(1)), float(match.group(2))
    return None

def haversine_distance(coord1, coord2):
    """
    Computes the great circle distance in meters between two coordinates.
    """
    R = 6371000  # Earth's radius in meters
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def geocode_location(location_name):
    """
    Geocodes a location name using OSM Nominatim, with robust local mocks.
    """
    # 1. Parse coordinate inputs
    coords = parse_coordinates(location_name)
    if coords:
        return coords[0], coords[1], f"Coords ({coords[0]:.4f}, {coords[1]:.4f})"
        
    # 2. Predefined mock matches (case-insensitive substring)
    name_clean = location_name.lower().strip()
    for city_key, city_coords in MOCK_CITIES.items():
        if city_key in name_clean:
            return city_coords
            
    # 3. Live Nominatim request
    url = "https://nominatim.openstreetmap.org/search"
    headers = {"User-Agent": USER_AGENT}
    params = {
        "q": location_name,
        "format": "json",
        "limit": 1
    }
    try:
        response = requests.get(url, headers=headers, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data:
                return float(data[0]["lat"]), float(data[0]["lon"]), data[0]["display_name"]
    except Exception as e:
        print(f"Nominatim error, using fallback for '{location_name}': {e}")
        
    # 4. Safety Fallback: Default to Chicago to avoid crashing
    return 41.8781, -87.6298, f"{location_name} (Fallback Chicago, IL)"

def get_osrm_route(start_coords, end_coords):
    """
    Fetches route from OSRM, with a fallback straight-line (Haversine) router.
    """
    start_lat, start_lon = start_coords
    end_lat, end_lon = end_coords
    
    # 1. Try Live OSRM
    url = f"http://router.project-osrm.org/route/v1/driving/{start_lon},{start_lat};{end_lon},{end_lat}"
    params = {
        "overview": "full",
        "geometries": "geojson"
    }
    try:
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data and data.get("routes"):
                route = data["routes"][0]
                return {
                    "distance_meters": route["distance"],
                    "duration_seconds": route["duration"],
                    "geometry": route["geometry"]
                }
    except Exception as e:
        print(f"OSRM error, falling back to Haversine routing: {e}")
        
    # 2. Fallback: Scale straight-line distance by 1.25 (typical highway winding factor)
    dist_meters = haversine_distance(start_coords, end_coords) * 1.25
    # Assumed speed of 55 mph (24.5872 meters/second)
    duration_seconds = dist_meters / 24.5872
    
    return {
        "distance_meters": dist_meters,
        "duration_seconds": duration_seconds,
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [start_lon, start_lat],
                [end_lon, end_lat]
            ]
        }
    }

def run_hos_simulation(start_dt, deadhead_miles, loaded_miles, initial_cycle_hours, locations):
    """
    Simulates Hours of Service (HOS) for a truck driver.
    """
    current_time = start_dt
    cycle_hours = initial_cycle_hours
    
    remaining_deadhead_drive = deadhead_miles / 55.0
    remaining_loaded_drive = loaded_miles / 55.0
    
    # HOS state
    driving_in_shift = 0.0
    duty_in_shift = 0.0
    since_last_break = 0.0
    distance_since_fuel = 0.0
    
    events = []
    
    def add_event(status, duration_hours, description, location):
        nonlocal current_time
        start = current_time
        end = current_time + timedelta(hours=duration_hours)
        events.append({
            'status': status,
            'start_time': start,
            'end_time': end,
            'duration': duration_hours,
            'activity': description,
            'location': location
        })
        current_time = end
        return start, end

    # 1. Pre-trip inspection (always starts the shift)
    add_event('ON', 0.25, "Pre-trip Inspection", locations['current'])
    duty_in_shift += 0.25
    cycle_hours += 0.25
    
    # Helper to simulate a driving leg
    def simulate_driving(remaining_drive_hours, leg_name, start_loc, end_loc):
        nonlocal driving_in_shift, duty_in_shift, since_last_break, distance_since_fuel, cycle_hours
        
        while remaining_drive_hours > 0.001:
            max_drive_11 = 11.0 - driving_in_shift
            max_drive_14 = 14.0 - duty_in_shift
            max_drive_8 = 8.0 - since_last_break
            max_drive_70 = 70.0 - cycle_hours
            
            # Fuel distance
            fuel_miles_rem = 1000.0 - distance_since_fuel
            max_drive_fuel = fuel_miles_rem / 55.0
            
            # Check if any daily clock is already expired
            if max_drive_11 <= 0 or max_drive_14 <= 0:
                add_event('OFF', 10.0, "10-Hour Daily Rest Break", start_loc)
                driving_in_shift = 0.0
                duty_in_shift = 0.0
                since_last_break = 0.0
                continue
                
            if max_drive_8 <= 0:
                add_event('OFF', 0.5, "30-Minute Rest Break", start_loc)
                since_last_break = 0.0
                duty_in_shift += 0.5
                continue
                
            if max_drive_70 <= 0:
                add_event('OFF', 34.0, "34-Hour Cycle Restart", start_loc)
                cycle_hours = 0.0
                driving_in_shift = 0.0
                duty_in_shift = 0.0
                since_last_break = 0.0
                continue
                
            if max_drive_fuel <= 0:
                add_event('ON', 0.5, "Fueling Stop", start_loc)
                distance_since_fuel = 0.0
                duty_in_shift += 0.5
                cycle_hours += 0.5
                continue
            
            # Find the next limiting event
            limits = [
                (max_drive_11, '11_limit'),
                (max_drive_14, '14_limit'),
                (max_drive_8, '8_limit'),
                (max_drive_70, '70_limit'),
                (max_drive_fuel, 'fuel_limit')
            ]
            min_limit, min_reason = min(limits, key=lambda x: x[0])
            
            step_hours = remaining_drive_hours
            limit_reason = None
            
            if min_limit < step_hours:
                step_hours = min_limit
                limit_reason = min_reason
            
            # Perform drive
            miles_driven = step_hours * 55.0
            add_event('D', step_hours, f"Driving - {leg_name} ({miles_driven:.1f} mi)", start_loc)
            
            driving_in_shift += step_hours
            duty_in_shift += step_hours
            since_last_break += step_hours
            cycle_hours += step_hours
            distance_since_fuel += miles_driven
            remaining_drive_hours -= step_hours
            
            # Act on the limit
            if limit_reason == '11_limit' or limit_reason == '14_limit':
                add_event('OFF', 10.0, "10-Hour Daily Rest Break", start_loc)
                driving_in_shift = 0.0
                duty_in_shift = 0.0
                since_last_break = 0.0
            elif limit_reason == '8_limit':
                add_event('OFF', 0.5, "30-Minute Rest Break", start_loc)
                since_last_break = 0.0
                duty_in_shift += 0.5
            elif limit_reason == '70_limit':
                add_event('OFF', 34.0, "34-Hour Cycle Restart", start_loc)
                cycle_hours = 0.0
                driving_in_shift = 0.0
                duty_in_shift = 0.0
                since_last_break = 0.0
            elif limit_reason == 'fuel_limit':
                add_event('ON', 0.5, "Fueling Stop", start_loc)
                distance_since_fuel = 0.0
                duty_in_shift += 0.5
                cycle_hours += 0.5

    # Run deadhead drive
    simulate_driving(remaining_deadhead_drive, "Deadhead", locations['current'], locations['pickup'])
    
    # Loading
    if duty_in_shift + 1.0 > 14.0:
        add_event('OFF', 10.0, "10-Hour Daily Rest Break (Before Loading)", locations['pickup'])
        driving_in_shift = 0.0
        duty_in_shift = 0.0
        since_last_break = 0.0
    
    add_event('ON', 1.0, "Loading Cargo", locations['pickup'])
    duty_in_shift += 1.0
    cycle_hours += 1.0
    
    # Run loaded drive
    simulate_driving(remaining_loaded_drive, "Loaded", locations['pickup'], locations['dropoff'])
    
    # Unloading
    if duty_in_shift + 1.0 > 14.0:
        add_event('OFF', 10.0, "10-Hour Daily Rest Break (Before Unloading)", locations['dropoff'])
        driving_in_shift = 0.0
        duty_in_shift = 0.0
        since_last_break = 0.0
        
    add_event('ON', 1.0, "Unloading Cargo", locations['dropoff'])
    duty_in_shift += 1.0
    cycle_hours += 1.0
    
    # Post-trip inspection
    if duty_in_shift + 0.25 > 14.0:
        add_event('OFF', 10.0, "10-Hour Daily Rest Break (Before Post-trip)", locations['dropoff'])
        driving_in_shift = 0.0
        duty_in_shift = 0.0
        since_last_break = 0.0
        
    add_event('ON', 0.25, "Post-trip Inspection", locations['dropoff'])
    duty_in_shift += 0.25
    cycle_hours += 0.25
    
    return events

def slice_events_to_days(events, start_dt, initial_cycle_hours):
    """
    Slices a continuous timeline of events into 24-hour calendar days.
    """
    day_1_midnight = datetime(start_dt.year, start_dt.month, start_dt.day)
    
    prefix_duration = (start_dt - day_1_midnight).total_seconds() / 3600.0
    all_events = []
    if prefix_duration > 0:
        all_events.append({
            'status': 'OFF',
            'start_time': day_1_midnight,
            'end_time': start_dt,
            'duration': prefix_duration,
            'activity': "Off Duty (Prior to Trip)",
            'location': events[0]['location'] if events else "Origin"
        })
        
    all_events.extend(events)
    
    last_end = all_events[-1]['end_time']
    last_midnight = datetime(last_end.year, last_end.month, last_end.day) + timedelta(days=1)
    suffix_duration = (last_midnight - last_end).total_seconds() / 3600.0
    if suffix_duration > 0:
        all_events.append({
            'status': 'OFF',
            'start_time': last_end,
            'end_time': last_midnight,
            'duration': suffix_duration,
            'activity': "Off Duty (Post Trip)",
            'location': all_events[-1]['location']
        })
        
    days_list = []
    total_days = int((last_midnight - day_1_midnight).days)
    
    on_duty_history = [initial_cycle_hours / 7.0] * 7
    
    for day_idx in range(total_days):
        day_start = day_1_midnight + timedelta(days=day_idx)
        day_end = day_start + timedelta(days=1)
        
        day_events = []
        off_duty_hours = 0.0
        sleeper_berth_hours = 0.0
        driving_hours = 0.0
        on_duty_hours = 0.0
        remarks = []
        
        for ev in all_events:
            ev_start = ev['start_time']
            ev_end = ev['end_time']
            
            overlap_start = max(ev_start, day_start)
            overlap_end = min(ev_end, day_end)
            
            if overlap_start < overlap_end:
                dur = (overlap_end - overlap_start).total_seconds() / 3600.0
                start_min = int((overlap_start - day_start).total_seconds() / 60.0)
                end_min = int((overlap_end - day_start).total_seconds() / 60.0)
                
                status = ev['status']
                day_events.append({
                    'start_minute': start_min,
                    'end_minute': end_min,
                    'status': status,
                    'duration_hours': round(dur, 2),
                    'activity': ev['activity'],
                    'location': ev['location']
                })
                
                if status == 'OFF':
                    off_duty_hours += dur
                elif status == 'SB':
                    sleeper_berth_hours += dur
                elif status == 'D':
                    driving_hours += dur
                elif status == 'ON':
                    on_duty_hours += dur
                
                # Record changes of duty status inside this day
                if ev_start >= day_start and ev_start < day_end:
                    time_str = ev_start.strftime("%I:%M %p")
                    remarks.append(f"{time_str}: {ev['activity']} at {ev['location']}")
        
        today_on_duty = driving_hours + on_duty_hours
        on_duty_history.append(today_on_duty)
        
        a_val = sum(on_duty_history[-7:])
        b_val = max(0.0, 70.0 - a_val)
        c_val = sum(on_duty_history[-8:])
        
        days_list.append({
            'date': day_start.strftime("%Y-%m-%d"),
            'date_formatted': day_start.strftime("%B %d, %Y"),
            'events': day_events,
            'summary': {
                'off_duty': round(off_duty_hours, 2),
                'sleeper_berth': round(sleeper_berth_hours, 2),
                'driving': round(driving_hours, 2),
                'on_duty': round(on_duty_hours, 2),
                'total': round(off_duty_hours + sleeper_berth_hours + driving_hours + on_duty_hours, 2)
            },
            'recap': {
                'today_on_duty': round(today_on_duty, 2),
                'total_7_days': round(a_val, 2),
                'available_tomorrow': round(b_val, 2),
                'total_8_days': round(c_val, 2)
            },
            'remarks': remarks
        })
        
    return days_list

@csrf_exempt
@require_POST
def plan_trip(request):
    """
    Plan trip endpoint: geocodes locations, routes driving legs, runs HOS simulation.
    """
    try:
        body = json.loads(request.body)
        current_loc = body.get('current_location')
        pickup_loc = body.get('pickup_location')
        dropoff_loc = body.get('dropoff_location')
        cycle_used = float(body.get('current_cycle_hours', 0.0))
        start_time_str = body.get('start_time')
        
        if not current_loc or not pickup_loc or not dropoff_loc:
            return JsonResponse({'error': 'Missing required location fields.'}, status=400)
            
        if start_time_str:
            try:
                if 'T' in start_time_str:
                    start_dt = datetime.strptime(start_time_str[:16], "%Y-%m-%dT%H:%M")
                else:
                    start_dt = datetime.strptime(start_time_str[:16], "%Y-%m-%d %H:%M")
            except ValueError:
                start_dt = datetime.now()
        else:
            start_dt = datetime.now()
            
        # Geocode locations (with automatic fallback dictionary)
        current_geo = geocode_location(current_loc)
        pickup_geo = geocode_location(pickup_loc)
        dropoff_geo = geocode_location(dropoff_loc)
        
        current_lat, current_lon, current_name = current_geo
        pickup_lat, pickup_lon, pickup_name = pickup_geo
        dropoff_lat, dropoff_lon, dropoff_name = dropoff_geo
        
        # Route Leg 1 (Current to Pickup)
        route_1 = get_osrm_route((current_lat, current_lon), (pickup_lat, pickup_lon))
        # Route Leg 2 (Pickup to Dropoff)
        route_2 = get_osrm_route((pickup_lat, pickup_lon), (dropoff_lat, dropoff_lon))
        
        if not route_1 or not route_2:
            return JsonResponse({'error': 'Routing service failed. Please try again later.'}, status=500)
            
        dist_meters_1 = route_1['distance_meters']
        dist_meters_2 = route_2['distance_meters']
        
        # Convert meters to miles
        deadhead_miles = dist_meters_1 * 0.000621371
        loaded_miles = dist_meters_2 * 0.000621371
        
        locations = {
            'current': current_name,
            'pickup': pickup_name,
            'dropoff': dropoff_name
        }
        
        # Run HOS Simulation
        raw_events = run_hos_simulation(start_dt, deadhead_miles, loaded_miles, cycle_used, locations)
        
        # Slice into 24 hour daily logs
        daily_logs = slice_events_to_days(raw_events, start_dt, cycle_used)
        
        # Format events for client JSON response
        formatted_events = []
        for ev in raw_events:
            formatted_events.append({
                'status': ev['status'],
                'start_time': ev['start_time'].isoformat(),
                'end_time': ev['end_time'].isoformat(),
                'duration_hours': round(ev['duration'], 2),
                'activity': ev['activity'],
                'location': ev['location']
            })
            
        response_data = {
            'locations': {
                'current': {'name': current_name, 'lat': current_lat, 'lon': current_lon},
                'pickup': {'name': pickup_name, 'lat': pickup_lat, 'lon': pickup_lon},
                'dropoff': {'name': dropoff_name, 'lat': dropoff_lat, 'lon': dropoff_lon}
            },
            'routes': {
                'deadhead': {
                    'distance_miles': round(deadhead_miles, 2),
                    'duration_hours': round(deadhead_miles / 55.0, 2),
                    'geometry': route_1['geometry']
                },
                'loaded': {
                    'distance_miles': round(loaded_miles, 2),
                    'duration_hours': round(loaded_miles / 55.0, 2),
                    'geometry': route_2['geometry']
                }
            },
            'timeline': formatted_events,
            'daily_logs': daily_logs
        }
        
        return JsonResponse(response_data)
        
    except Exception as e:
        print(f"API Exception: {e}")
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_POST
def signup_user(request):
    """
    Registers a new driver profile.
    """
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        
        if not username or not password or not email:
            return JsonResponse({'error': 'Email, driver name, and password are required.'}, status=400)
            
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Driver name already exists.'}, status=400)
            
        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({
            'user_id': user.id,
            'username': user.username,
            'message': 'Signup successful!'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_POST
def login_user(request):
    """
    Logs in an existing driver.
    """
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({'error': 'Username and password are required.'}, status=400)
            
        user = authenticate(username=username, password=password)
        if user is not None:
            return JsonResponse({
                'user_id': user.id,
                'username': user.username,
                'message': 'Login successful!'
            })
        else:
            return JsonResponse({'error': 'Invalid username or password.'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_POST
def save_trip(request):
    """
    Saves a planned trip route for a specific logged-in driver.
    """
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        current_location = data.get('current_location')
        pickup_location = data.get('pickup_location')
        dropoff_location = data.get('dropoff_location')
        cycle_hours = float(data.get('cycle_hours', 0.0))
        start_time = data.get('start_time')
        response_json = data.get('response_json')
        
        if not user_id:
            return JsonResponse({'error': 'User ID is required.'}, status=400)
            
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist.'}, status=404)
            
        if isinstance(response_json, dict):
            response_json_str = json.dumps(response_json)
        else:
            response_json_str = str(response_json)
            
        trip = Trip.objects.create(
            user=user,
            current_location=current_location,
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            cycle_hours=cycle_hours,
            start_time=start_time,
            response_json=response_json_str
        )
        
        return JsonResponse({
            'success': True,
            'trip_id': trip.id,
            'message': 'Trip saved to your profile successfully!'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def get_trip_history(request):
    """
    Fetches the history of saved trips for a driver.
    """
    try:
        user_id = request.GET.get('user_id')
        if not user_id:
            return JsonResponse({'error': 'User ID query parameter is required.'}, status=400)
            
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist.'}, status=404)
            
        trips = Trip.objects.filter(user=user).order_by('-created_at')
        
        history = []
        for trip in trips:
            try:
                resp_data = json.loads(trip.response_json)
            except Exception:
                resp_data = {}
                
            history.append({
                'id': trip.id,
                'current_location': trip.current_location,
                'pickup_location': trip.pickup_location,
                'dropoff_location': trip.dropoff_location,
                'cycle_hours': trip.cycle_hours,
                'start_time': trip.start_time,
                'created_at': trip.created_at.isoformat(),
                'response_json': resp_data
            })
            
        return JsonResponse(history, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
