import os
# pyrefly: ignore [missing-import]
import django
import json
from datetime import datetime

# Setup Django standalone settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hos_backend.settings')
django.setup()

# pyrefly: ignore [missing-import]
from django.test import Client
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User
from routing.models import Trip

def run_integration_tests():
    print("Starting Auth & History Endpoints Integration Tests...")
    
    # Initialize Django test client
    client = Client()
    
    # Clean up previous test users to ensure a fresh test
    User.objects.filter(username="test_driver_bob").delete()
    
    # 1. Test Sign Up
    print("\n--- Testing User Signup (/api/auth/signup/) ---")
    signup_data = {
        "username": "test_driver_bob",
        "email": "bob@example.com",
        "password": "securepassword123"
    }
    response = client.post(
        "/api/auth/signup/",
        data=json.dumps(signup_data),
        content_type="application/json"
    )
    print(f"Status Code: {response.status_code}")
    res_json = response.json()
    print(f"Response: {res_json}")
    
    assert response.status_code == 200
    assert "user_id" in res_json
    assert res_json["username"] == "test_driver_bob"
    user_id = res_json["user_id"]
    
    # 2. Test Sign Up Duplicate Username (should fail)
    print("\n--- Testing Signup Duplicate Username (Expecting 400 Error) ---")
    response_dup = client.post(
        "/api/auth/signup/",
        data=json.dumps(signup_data),
        content_type="application/json"
    )
    print(f"Status Code: {response_dup.status_code}")
    print(f"Response: {response_dup.json()}")
    assert response_dup.status_code == 400
    
    # 3. Test Login
    print("\n--- Testing User Login (/api/auth/login/) ---")
    login_data = {
        "username": "test_driver_bob",
        "password": "securepassword123"
    }
    response_login = client.post(
        "/api/auth/login/",
        data=json.dumps(login_data),
        content_type="application/json"
    )
    print(f"Status Code: {response_login.status_code}")
    res_login_json = response_login.json()
    print(f"Response: {res_login_json}")
    
    assert response_login.status_code == 200
    assert res_login_json["user_id"] == user_id
    
    # 4. Test Login Invalid Password (should fail)
    print("\n--- Testing Login with Invalid Password (Expecting 401 Error) ---")
    bad_login_data = {
        "username": "test_driver_bob",
        "password": "wrongpassword"
    }
    response_bad_login = client.post(
        "/api/auth/login/",
        data=json.dumps(bad_login_data),
        content_type="application/json"
    )
    print(f"Status Code: {response_bad_login.status_code}")
    print(f"Response: {response_bad_login.json()}")
    assert response_bad_login.status_code == 401
    
    # 5. Test Save Trip
    print("\n--- Testing Save Trip (/api/trips/save/) ---")
    mock_trip_results = {
        "locations": {
            "current": {"name": "Chicago, IL", "lat": 41.8781, "lon": -87.6298},
            "pickup": {"name": "Atlanta, GA", "lat": 33.7490, "lon": -84.3880},
            "dropoff": {"name": "Dallas, TX", "lat": 32.7767, "lon": -96.7970}
        },
        "routes": {
            "deadhead": {"distance_miles": 500.0, "duration_hours": 9.09, "geometry": {"type": "LineString", "coordinates": []}},
            "loaded": {"distance_miles": 800.0, "duration_hours": 14.54, "geometry": {"type": "LineString", "coordinates": []}}
        },
        "timeline": [],
        "daily_logs": []
    }
    save_data = {
        "user_id": user_id,
        "current_location": "Chicago, IL",
        "pickup_location": "Atlanta, GA",
        "dropoff_location": "Dallas, TX",
        "cycle_hours": 45.0,
        "start_time": "2026-07-22T08:00",
        "response_json": mock_trip_results
    }
    response_save = client.post(
        "/api/trips/save/",
        data=json.dumps(save_data),
        content_type="application/json"
    )
    print(f"Status Code: {response_save.status_code}")
    res_save_json = response_save.json()
    print(f"Response: {res_save_json}")
    
    assert response_save.status_code == 200
    assert res_save_json["success"] is True
    
    # 6. Test Fetch Trip History
    print("\n--- Testing Fetch Trip History (/api/trips/history/) ---")
    response_hist = client.get(f"/api/trips/history/?user_id={user_id}")
    print(f"Status Code: {response_hist.status_code}")
    res_hist_json = response_hist.json()
    print(f"History list length: {len(res_hist_json)}")
    print(f"First saved trip route: {res_hist_json[0]['current_location']} -> {res_hist_json[0]['dropoff_location']}")
    
    assert response_hist.status_code == 200
    assert len(res_hist_json) == 1
    assert res_hist_json[0]["current_location"] == "Chicago, IL"
    
    print("\nAll Auth & History API integration tests completed successfully!")

if __name__ == '__main__':
    run_integration_tests()
