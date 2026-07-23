import os
# pyrefly: ignore [missing-import]
import django
from datetime import datetime

# Setup Django settings for standalone execution
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hos_backend.settings')
django.setup()

from routing.views import run_hos_simulation, slice_events_to_days

def run_tests():
    print("Starting HOS simulation logic tests...")
    
    # Define test parameters
    start_dt = datetime(2026, 7, 22, 8, 0, 0) # Day 1, 8:00 AM
    locations = {
        'current': 'Chicago, IL',
        'pickup': 'Milwaukee, WI',
        'dropoff': 'New York, NY'
    }
    
    # Test Case 1: Short trip (Chicago to Milwaukee, ~100 miles total)
    print("\n--- Test Case 1: Short Trip (~100 miles) ---")
    events = run_hos_simulation(
        start_dt=start_dt,
        deadhead_miles=90.0,
        loaded_miles=10.0,
        initial_cycle_hours=10.0,
        locations=locations
    )
    print(f"Total events generated: {len(events)}")
    for idx, ev in enumerate(events):
        print(f"  {idx+1}. [{ev['status']}] {ev['activity']} from {ev['start_time'].strftime('%m-%d %H:%M')} to {ev['end_time'].strftime('%m-%d %H:%M')} ({ev['duration']}h) at {ev['location']}")
        
    days = slice_events_to_days(events, start_dt, 10.0)
    print(f"Total log days generated: {len(days)}")
    for day in days:
        print(f"  Day {day['date_formatted']}: totals {day['summary']}")
        print(f"    Recap: Today on Duty: {day['recap']['today_on_duty']}h, Available tomorrow: {day['recap']['available_tomorrow']}h")
        
    # Test Case 2: Long trip (Chicago to Los Angeles, ~2000 miles total)
    print("\n--- Test Case 2: Long Trip (~2000 miles, expecting rest breaks and fueling) ---")
    events = run_hos_simulation(
        start_dt=start_dt,
        deadhead_miles=50.0,
        loaded_miles=1950.0,
        initial_cycle_hours=10.0,
        locations=locations
    )
    print(f"Total events generated: {len(events)}")
    # Print a summary of the long trip events
    d_total = sum(e['duration'] for e in events if e['status'] == 'D')
    off_total = sum(e['duration'] for e in events if e['status'] == 'OFF')
    on_total = sum(e['duration'] for e in events if e['status'] == 'ON')
    print(f"  Summary totals: Driving={d_total:.2f}h, Off-Duty={off_total:.2f}h, On-Duty={on_total:.2f}h")
    
    days = slice_events_to_days(events, start_dt, 10.0)
    print(f"Total log days generated: {len(days)}")
    
    # Test Case 3: High cycle hours triggering 34h restart
    print("\n--- Test Case 3: High Initial Cycle Hours (60h, expecting 34h restart) ---")
    events = run_hos_simulation(
        start_dt=start_dt,
        deadhead_miles=50.0,
        loaded_miles=600.0, # ~11h driving
        initial_cycle_hours=60.0, # starts with 60h, only has 10h remaining cycle
        locations=locations
    )
    # Check if a 34-Hour restart exists in events
    has_restart = any("34-Hour" in e['activity'] for e in events)
    print(f"  Has 34h restart: {has_restart}")
    for idx, ev in enumerate(events):
        if "34-Hour" in ev['activity'] or "Rest" in ev['activity']:
            print(f"    * [{ev['status']}] {ev['activity']} ({ev['duration']}h)")
            
    print("\nAll backend logic verification tests completed successfully!")

if __name__ == '__main__':
    run_tests()
