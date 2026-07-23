import React, { useState, useEffect, useRef, useCallback } from 'react';
import LogSheet from './components/LogSheet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarketingPage from './components/MarketingPage';
import AuthPage from './components/AuthPage';

const CITIES = [
  "Chicago, IL",
  "Atlanta, GA",
  "Dallas, TX",
  "Milwaukee, WI",
  "New York, NY",
  "Los Angeles, CA",
  "Seattle, WA",
  "Miami, FL",
  "Houston, TX",
  "Denver, CO",
  "Phoenix, AZ",
  "San Francisco, CA",
  "Boston, MA",
  "Indianapolis, IN",
  "Charlotte, NC"
];

// Custom Autocomplete Combobox Selector for locations
const CitySelector = ({ label, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch(value);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filteredCities = CITIES.filter(city => 
    city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="form-group" style={{ position: 'relative' }} ref={dropdownRef}>
      <label>{label}</label>
      <div className="input-with-icon">
        <span className="input-icon">📍</span>
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '38px' }}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required
        />
      </div>
      {isOpen && (
        <ul className="autocomplete-dropdown">
          {filteredCities.map((city) => (
            <li
              key={city}
              onClick={() => {
                onChange(city);
                setSearch(city);
                setIsOpen(false);
              }}
            >
              {city}
            </li>
          ))}
          {filteredCities.length === 0 && (
            <li style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', cursor: 'default', fontSize: '12px' }}>
              No local match (will search online)
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const getLocalDateTimeString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const App = () => {
  // Router State & Navigation
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const navigate = useCallback((to) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Authentication & Profile States
  const [currentUser, setCurrentUser] = useState(null);

  // Form State
  const [currentLocation, setCurrentLocation] = useState('Chicago, IL');
  const [pickupLocation, setPickupLocation] = useState('Atlanta, GA');
  const [dropoffLocation, setDropoffLocation] = useState('Dallas, TX');
  const [cycleHours, setCycleHours] = useState('45.0');
  const [startTime, setStartTime] = useState(getLocalDateTimeString());

  // UI & History States
  const [activeView, setActiveView] = useState('plan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tripData, setTripData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isDarkLog, setIsDarkLog] = useState(true);
  const [savedTrips, setSavedTrips] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Workspace management state
  const [currentWorkspace, setCurrentWorkspace] = useState('Personal Fleet');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  // Top Nav indicators state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // AI Assistant drawer state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI compliance assistant. Ask me questions about FMCSA shift limits, 34-hour restarts, or rest break intervals.' }
  ]);
  const [aiInput, setAiInput] = useState('');

  // Map Refs
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Fetch saved trips history list
  const fetchTripHistory = useCallback(async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/history/?user_id=${currentUser.user_id}`);
      if (response.ok) {
        const data = await response.json();
        setSavedTrips(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }, [currentUser]);

  // 1. Initial LocalStorage check for logged in user
  useEffect(() => {
    const savedDriver = localStorage.getItem('hos_driver');
    if (savedDriver) {
      try {
        const userObj = JSON.parse(savedDriver);
        setCurrentUser(userObj);
      } catch (_e) {
        localStorage.removeItem('hos_driver');
      }
    }
  }, []);

  // 2. Fetch Trip History when User logs in
  useEffect(() => {
    if (currentUser) {
      fetchTripHistory();
    }
  }, [currentUser, fetchTripHistory]);

  // 2b. Sync activeView to current path
  useEffect(() => {
    if (currentPath === '/app' || currentPath === '/app/') {
      setActiveView('plan');
    } else if (currentPath === '/app/logs') {
      setActiveView('logs');
    } else if (currentPath === '/app/history') {
      setActiveView('history');
    }
  }, [currentPath]);

  // 2c. Route Guard & Redirect Protection
  useEffect(() => {
    const isAppPath = currentPath.startsWith('/app');
    if (isAppPath && !currentUser) {
      navigate('/login');
    } else if (currentUser && currentPath === '/login') {
      navigate('/app');
    }
  }, [currentPath, currentUser, navigate]);

  // 3. Initialize Map when logged in and container is ready
  useEffect(() => {
    if (currentUser && mapRef.current && !mapInstanceRef.current && currentPath.startsWith('/app')) {
      const mapInst = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInst);
      mapInstanceRef.current = mapInst;
    }
    return () => {
      // Cleanup only if leaving the /app dashboard area
      if (mapInstanceRef.current && !window.location.pathname.startsWith('/app')) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentUser, currentPath]);

  // 3b. Handle Leaflet invalid size issues on tab switch
  useEffect(() => {
    if (activeView === 'plan' && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeView]);

  // 4. Draw route features on map when tripData updates
  useEffect(() => {
    if (!tripData || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear previous vector paths
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
        layer.remove();
      }
    });

    try {
      // Draw deadhead dashed line
      const deadheadLayer = L.geoJSON(tripData.routes.deadhead.geometry, {
        style: { color: '#64748b', weight: 4, dashArray: '6, 8', opacity: 0.7 }
      }).addTo(map);

      // Draw loaded solid neon cyan line
      const loadedLayer = L.geoJSON(tripData.routes.loaded.geometry, {
        style: { color: '#00e5ff', weight: 5, opacity: 0.9 }
      }).addTo(map);

      const locs = tripData.locations;

      const addStopMarker = (lat, lon, fillColor, label, popupInfo) => {
        const marker = L.circleMarker([lat, lon], {
          radius: 9,
          fillColor: fillColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        }).addTo(map);
        marker.bindPopup(`<strong style="color:${fillColor}">${label}</strong><br/>${popupInfo}`);
      };

      addStopMarker(locs.current.lat, locs.current.lon, '#8b5cf6', 'Origin', locs.current.name);
      addStopMarker(locs.pickup.lat, locs.pickup.lon, '#10b981', 'Pickup (Shipper)', locs.pickup.name);
      addStopMarker(locs.dropoff.lat, locs.dropoff.lon, '#ef4444', 'Dropoff (Receiver)', locs.dropoff.name);

      let elapsedDeadhead = 0;
      let elapsedLoaded = 0;
      const totalDeadhead = tripData.routes.deadhead.duration_hours;
      const totalLoaded = tripData.routes.loaded.duration_hours;

      tripData.timeline.forEach((event, idx) => {
        if (event.status === 'OFF' || (event.status === 'ON' && event.activity.includes('Fuel'))) {
          let coords = null;
          
          if (event.activity.includes('Before Loading') || event.activity.includes('Loading')) {
            coords = [locs.pickup.lat, locs.pickup.lon];
          } else if (event.activity.includes('Before Unloading') || event.activity.includes('Unloading') || event.activity.includes('Post-trip')) {
            coords = [locs.dropoff.lat, locs.dropoff.lon];
          } else {
            if (elapsedLoaded > 0) {
              const pct = Math.min(elapsedLoaded / totalLoaded, 1.0);
              coords = getCoordinateAtPercent(tripData.routes.loaded.geometry, pct);
            } else if (elapsedDeadhead > 0) {
              const pct = Math.min(elapsedDeadhead / totalDeadhead, 1.0);
              coords = getCoordinateAtPercent(tripData.routes.deadhead.geometry, pct);
            } else {
              coords = [locs.current.lat, locs.current.lon];
            }
          }

          if (coords) {
            let color = '#f59e0b';
            if (event.status === 'OFF') {
              color = event.activity.includes('Restart') ? '#7c2d12' : '#0ea5e9';
            }
            
            const marker = L.circleMarker(coords, {
              radius: 7,
              fillColor: color,
              color: '#ffffff',
              weight: 1.5,
              opacity: 1,
              fillOpacity: 0.9
            }).addTo(map);
            
            marker.bindPopup(`<strong>Stop ${idx + 1}: ${event.activity}</strong><br/>Time: ${formatTime(event.start_time)}<br/>Duration: ${event.duration_hours} hrs`);
          }
        } else if (event.status === 'D') {
          if (event.activity.includes('Deadhead')) {
            elapsedDeadhead += event.duration_hours;
          } else {
            elapsedLoaded += event.duration_hours;
          }
        }
      });

      const group = L.featureGroup([deadheadLayer, loadedLayer]);
      map.fitBounds(group.getBounds(), { padding: [30, 30] });

    } catch (e) {
      console.error("Map layer rendering error:", e);
    }
  }, [tripData, currentPath]);

  // Interpolate coordinate at fractional distance along line
  const getCoordinateAtPercent = (geometry, percent) => {
    if (!geometry || !geometry.coordinates || geometry.coordinates.length === 0) return null;
    const coords = geometry.coordinates;
    const index = Math.min(
      Math.floor(percent * coords.length),
      coords.length - 1
    );
    const [lon, lat] = coords[index];
    return [lat, lon];
  };

  // Helper to format ISO time
  const formatTime = (isoStr) => {
    const dt = new Date(isoStr);
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + 
           dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };



  // AI compliance Chatbot handler
  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    const userMsg = { sender: 'user', text: aiInput };
    setAiMessages(prev => [...prev, userMsg]);
    const prompt = aiInput.toLowerCase();
    setAiInput('');

    setTimeout(() => {
      let replyText = "I am auditing the route logs according to the FMCSA §395 regulations. Can I clarify driving shift rules, rest breaks, or recap clocks?";
      if (prompt.includes('34') || prompt.includes('restart') || prompt.includes('reset')) {
        replyText = "Under FMCSA §395.3, a commercial property driver can restart their rolling 70-hour cycle clock by taking at least 34 consecutive hours of off-duty/sleeper berth rest.";
      } else if (prompt.includes('11') || prompt.includes('drive') || prompt.includes('limit')) {
        replyText = "Property-carrying drivers are restricted to a maximum of 11 hours of driving time within a shift, following 10 consecutive hours off-duty.";
      } else if (prompt.includes('14') || prompt.includes('shift') || prompt.includes('duty')) {
        replyText = "Driving is not permitted beyond the 14th consecutive hour after coming on-duty. Rest or off-duty periods during the shift do NOT extend this 14-hour clock.";
      } else if (prompt.includes('30') || prompt.includes('break') || prompt.includes('rest')) {
        replyText = "A 30-minute consecutive rest break is mandatory after 8 hours of driving. Taking an off-duty or sleeper berth rest satisfies this requirement.";
      } else if (prompt.includes('recap') || prompt.includes('70') || prompt.includes('8 day')) {
        replyText = "The 70-hour / 8-day cycle rule limits active duty hours to 70 in any rolling 8-day window. Cumulative daily shift hours are added to verify cycle compliance.";
      } else if (prompt.includes('fuel')) {
        replyText = "Fueling stops are auto-scheduled in our route itineraries at least once every 1,000 miles, satisfying the 30-minute mandatory break window.";
      }
      setAiMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    }, 500);
  };

  // Auth: logout handler
  const handleLogout = () => {
    localStorage.removeItem('hos_driver');
    setCurrentUser(null);
    setTripData(null);
    setSavedTrips([]);
    setError('');
    navigate('/');
  };

  // Plan trip submit API handler
  const handlePlanTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTripData(null);
    setSaveSuccess(false);
    setActiveTab(0);

    try {
      const response = await fetch(`${API_BASE_URL}/api/plan-trip/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_location: currentLocation,
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          current_cycle_hours: parseFloat(cycleHours),
          start_time: startTime
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error encountered.');
      }

      setTripData(data);
    } catch (err) {
      setError(err.message || 'Could not connect to the backend server API.');
    } finally {
      setLoading(false);
    }
  };

  // Save current trip to database
  const handleSaveTrip = async () => {
    if (!currentUser || !tripData) return;
    setSaveLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/save/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          current_location: currentLocation,
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          cycle_hours: parseFloat(cycleHours),
          start_time: startTime,
          response_json: tripData
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save trip.');
      }

      setSaveSuccess(true);
      fetchTripHistory(); // refresh sidebar list
    } catch (err) {
      alert("Error saving trip: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Load past trip back into dashboard
  const handleLoadPastTrip = (pastTrip) => {
    setCurrentLocation(pastTrip.current_location);
    setPickupLocation(pastTrip.pickup_location);
    setDropoffLocation(pastTrip.dropoff_location);
    setCycleHours(pastTrip.cycle_hours.toString());
    setStartTime(pastTrip.start_time);
    setTripData(pastTrip.response_json);
    setSaveSuccess(true); // already saved
    setActiveTab(0);
    navigate('/app');
  };

  // Summary variables
  const totalDistance = tripData 
    ? (tripData.routes.deadhead.distance_miles + tripData.routes.loaded.distance_miles).toFixed(0) + " mi" 
    : "-";
  const totalDriveTime = tripData 
    ? (tripData.routes.deadhead.duration_hours + tripData.routes.loaded.duration_hours).toFixed(1) + " hrs" 
    : "-";
  const totalStops = tripData 
    ? tripData.timeline.filter(e => e.status === 'OFF' || e.activity.includes('Fuel')).length + " Stops" 
    : "-";
  const totalLogs = tripData 
    ? tripData.daily_logs.length + " Sheets" 
    : "-";

  // RENDER SEPARATE VIEWS BASED ON URL PATH
  if (currentPath === '/login') {
    return (
      <AuthPage 
        navigate={navigate} 
        onAuthSuccess={(user) => { 
          setCurrentUser(user); 
          navigate('/app'); 
        }} 
      />
    );
  }

  if (currentPath.startsWith('/app')) {
    if (!currentUser) {
      // Guard will redirect to /login in useEffect, but return placeholder while loading
      return <div className="loader-container"><div className="spinner"></div></div>;
    }

    return (
      <div className="app-layout">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          {/* Workspace Selector */}
          <div className="workspace-selector">
            <div className="workspace-btn" onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}>
              <span>🏢 {currentWorkspace}</span>
              <span style={{ fontSize: '10px' }}>▼</span>
            </div>
            {isWorkspaceOpen && (
              <ul className="workspace-dropdown">
                <li className="workspace-dropdown-item" onClick={() => { setCurrentWorkspace('Personal Fleet'); setIsWorkspaceOpen(false); }}>
                  🏢 Personal Fleet
                </li>
                <li className="workspace-dropdown-item" onClick={() => { setCurrentWorkspace('Spotter Logistics'); setIsWorkspaceOpen(false); }}>
                  🏢 Spotter Logistics
                </li>
                <li className="workspace-dropdown-item" onClick={() => { setCurrentWorkspace('Global Carrier Co'); setIsWorkspaceOpen(false); }}>
                  🏢 Global Carrier Co
                </li>
              </ul>
            )}
          </div>

          <div className="sidebar-logo" style={{ marginBottom: '20px' }}>
            <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>⚡ HOS Planner</h1>
            <p>FMCSA §395 PROPERTY CARRIER</p>
          </div>

          <ul className="sidebar-nav">
            <li 
              className={`sidebar-nav-item ${activeView === 'plan' ? 'active' : ''}`}
              onClick={() => navigate('/app')}
            >
              <span className="sidebar-nav-icon">🗺️</span>
              <span>Plan Trip</span>
            </li>
            <li 
              className={`sidebar-nav-item ${activeView === 'logs' ? 'active' : ''}`}
              onClick={() => navigate('/app/logs')}
            >
              <span className="sidebar-nav-icon">📋</span>
              <span>Daily Logs</span>
            </li>
            <li 
              className={`sidebar-nav-item ${activeView === 'history' ? 'active' : ''}`}
              onClick={() => navigate('/app/history')}
            >
              <span className="sidebar-nav-icon">🕒</span>
              <span>Saved Trips</span>
            </li>
          </ul>

          <div className="sidebar-footer">
            <div className="user-badge">
              <div className="user-name-display">
                👤 <strong>{currentUser.username}</strong>
              </div>
              <button className="btn-logout" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Top Navigation */}
          <header className="top-nav-bar">
            <div className="top-nav-left">
              <span className="breadcrumb-parent">Dashboard</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">
                {activeView === 'plan' ? 'Plan Trip' : activeView === 'logs' ? 'Daily Logs' : 'Saved Trips'}
              </span>
            </div>
            
            <div className="top-nav-right">
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search logs..." />
              </div>
              
              <button className="top-nav-btn notification-btn" onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}>
                🔔
                <span className="badge-count">2</span>
              </button>
              {isNotificationsOpen && (
                <div className="notification-popover">
                  <h4>Notifications</h4>
                  <div className="notification-item">🚨 <strong>Shift Alert</strong>: Rest break required in 2.5 hours.</div>
                  <div className="notification-item">✅ <strong>Trip Saved</strong>: Route Chicago to Dallas successfully synced.</div>
                </div>
              )}
              
              <button className="top-nav-btn ai-btn" onClick={() => setIsAiOpen(true)}>
                🤖 Ask AI
              </button>
              
              <div className="profile-menu-container">
                <div className="avatar-bubble" onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}>
                  {currentUser.username[0].toUpperCase()}
                </div>
                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-item" onClick={() => { navigate('/app'); setIsProfileOpen(false); }}>⚙️ Workspace Settings</div>
                    <div className="profile-dropdown-item" style={{ borderTop: '1px solid #fafafa' }} onClick={handleLogout}>🚪 Log Out</div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div style={{ display: activeView === 'plan' ? 'block' : 'none' }} className="view-container">
            {/* Stats Row */}
            {tripData && (
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-value">{totalDistance}</div>
                  <div className="stat-label">Total Distance</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--color-secondary)' }}>{totalDriveTime}</div>
                  <div className="stat-label">Total Drive Hours</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--status-on)' }}>{totalStops}</div>
                  <div className="stat-label">Scheduled Stops</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'var(--status-drive)' }}>{totalLogs}</div>
                  <div className="stat-label">Daily Log Sheets</div>
                </div>
              </div>
            )}

            {/* Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Inputs Panel & Timeline Itinerary */}
              <div className="control-column">
                <div className="glass-card">
                  <div className="card-header">
                    <h2><span>1.</span> Trip Parameters</h2>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handlePlanTrip}>
                      <CitySelector 
                        label="Current Location"
                        value={currentLocation}
                        onChange={setCurrentLocation}
                        placeholder="Type city or coords..."
                      />
                      <CitySelector 
                        label="Pickup Location"
                        value={pickupLocation}
                        onChange={setPickupLocation}
                        placeholder="Type city or coords..."
                      />
                      <CitySelector 
                        label="Dropoff Location"
                        value={dropoffLocation}
                        onChange={setDropoffLocation}
                        placeholder="Type city or coords..."
                      />
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
                        <div className="form-group">
                          <label>Cycle Used (Hrs)</label>
                          <div className="input-with-icon">
                            <span className="input-icon">⏱️</span>
                            <input 
                              type="number" 
                              step="0.1" 
                              min="0" 
                              max="70" 
                              className="form-input" 
                              style={{ paddingLeft: '38px' }}
                              value={cycleHours} 
                              onChange={(e) => setCycleHours(e.target.value)} 
                              required 
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Start Date & Time</label>
                          <input 
                            type="datetime-local" 
                            className="form-input" 
                            value={startTime} 
                            onChange={(e) => setStartTime(e.target.value)} 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="btn-save-container">
                        <button type="submit" className="btn-primary" disabled={loading} style={{ margin: 0 }}>
                          {loading ? 'Simulating...' : 'Calculate Route'}
                        </button>
                        {tripData && (
                          <button 
                            type="button" 
                            onClick={handleSaveTrip} 
                            className="btn-secondary-action" 
                            disabled={saveLoading || saveSuccess}
                          >
                            {saveLoading ? 'Saving...' : saveSuccess ? '✓ Saved' : '💾 Save Trip'}
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Timeline Panel */}
                <div className="glass-card" style={{ flex: 1 }}>
                  <div className="card-header">
                    <h2><span>2.</span> Driver's Schedule Itinerary</h2>
                  </div>
                  <div className="card-body">
                    {loading && (
                      <div className="loader-container">
                        <div className="spinner"></div>
                        <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '12px' }}>
                          Calculating optimal HOS route...
                        </p>
                      </div>
                    )}
                    {error && (
                      <div style={{ color: '#ef4444', padding: '12px', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 'bold' }}>
                        ⚠️ {error}
                      </div>
                    )}
                    {!tripData && !loading && !error && (
                      <div className="empty-state">
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H9.75M8.25 21h8.25c1.243 0 2.25-1.007 2.25-2.25V5.25C18.75 4.007 17.743 3 16.5 3H7.5C6.257 3 5.25 4.007 5.25 5.25v13.5C5.25 19.993 6.257 21 7.5 21z" />
                        </svg>
                        <p>Calculate a route to visualize driver schedule timeline instructions.</p>
                      </div>
                    )}
                    {tripData && (
                      <div className="timeline-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '14px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>
                          <div>Deadhead: <span style={{ color: 'var(--color-text-main)' }}>{tripData.routes.deadhead.distance_miles} mi</span></div>
                          <div>Loaded: <span style={{ color: 'var(--color-text-main)' }}>{tripData.routes.loaded.distance_miles} mi</span></div>
                        </div>
                        {tripData.timeline.map((event, idx) => (
                          <div className="timeline-item" key={`event-${idx}`}>
                            <div className={`timeline-badge badge-${event.status.toLowerCase()}`}>
                              {event.status}
                            </div>
                            <div className="timeline-content">
                              <div className="timeline-meta">
                                <span>{formatTime(event.start_time)}</span>
                                <span>{event.duration_hours} hrs</span>
                              </div>
                              <div className="timeline-activity">{event.activity}</div>
                              <div className="timeline-location">📍 {event.location}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Map Panel */}
              <div className="display-column">
                <div className="glass-card">
                  <div className="card-header">
                    <h2><span>3.</span> Interactive Route Map</h2>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div ref={mapRef} className="map-container"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: activeView === 'logs' ? 'block' : 'none' }} className="view-container">
            {/* Daily Logs Card */}
            <div className="glass-card">
              <div className="card-header" style={{ paddingBottom: 0, borderBottom: 'none' }}>
                <h2><span>📊</span> Driver's Daily Log Sheets</h2>
                
                {tripData && (
                  <div className="log-toggle-container">
                    <span>Classic Paper</span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={isDarkLog} 
                        onChange={() => setIsDarkLog(!isDarkLog)} 
                      />
                      <span className="slider"></span>
                    </label>
                    <span>Sleek Dark Grid</span>
                  </div>
                )}
              </div>
              
              {tripData ? (
                <>
                  <div className="tabs-header">
                    {tripData.daily_logs.map((log, idx) => (
                      <button
                        key={`tab-${idx}`}
                        className={`tab-btn ${activeTab === idx ? 'active' : ''}`}
                        onClick={() => setActiveTab(idx)}
                      >
                        Day {idx + 1} ({new Date(log.date).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })})
                      </button>
                    ))}
                  </div>
                  <div className="card-body" style={{ background: isDarkLog ? '#090d16' : '#ffffff', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', border: isDarkLog ? 'none' : '1px solid var(--border-color)', borderTop: 'none' }}>
                    <LogSheet 
                      day={tripData.daily_logs[activeTab]} 
                      locations={tripData.locations}
                      isDarkTheme={isDarkLog}
                    />
                  </div>
                </>
              ) : (
                <div className="card-body">
                  <div className="empty-state">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                    </svg>
                    <p>Daily HOS log grids will render here once the trip is simulated. Please plan a trip in the Plan Trip tab first.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: activeView === 'history' ? 'block' : 'none' }} className="view-container">
            {/* History Panel */}
            <div className="glass-card">
              <div className="card-header">
                <h2><span>🕒</span> Your Saved Trips History</h2>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>{savedTrips.length} Saved Trips</span>
              </div>
              <div className="card-body">
                {savedTrips.length === 0 ? (
                  <div className="empty-state">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No saved trips in your profile yet. Plan a trip and save it to see it here.</p>
                  </div>
                ) : (
                  <div className="history-list" style={{ maxHeight: 'none' }}>
                    {savedTrips.map((trip) => (
                      <div 
                        key={trip.id} 
                        className="history-item" 
                        onClick={() => handleLoadPastTrip(trip)}
                        style={{ padding: '20px', gap: '8px' }}
                      >
                        <div className="history-item-route" style={{ fontSize: '16px' }}>
                          📍 {trip.current_location} ➜ {trip.dropoff_location}
                        </div>
                        <div style={{ display: 'flex', gap: '15px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                          <div>Pickup: <strong style={{ color: 'var(--color-text-main)' }}>{trip.pickup_location}</strong></div>
                          <div>Initial Cycle: <strong style={{ color: 'var(--color-text-main)' }}>{trip.cycle_hours} hrs</strong></div>
                        </div>
                        <div className="history-item-meta" style={{ marginTop: '5px' }}>
                          <span>Start: {formatTime(trip.start_time)}</span>
                          <span className="history-item-date">Saved on {new Date(trip.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* AI compliance assistant drawer */}
        {isAiOpen && (
          <>
            <div className="ai-drawer-overlay" onClick={() => setIsAiOpen(false)}></div>
            <div className={`ai-drawer ${isAiOpen ? 'open' : ''}`}>
              <div className="ai-drawer-header">
                <h3>🤖 AI Compliance Assistant</h3>
                <button onClick={() => setIsAiOpen(false)}>✕</button>
              </div>
              <div className="ai-drawer-body">
                {aiMessages.map((msg, i) => (
                  <div key={i} className={`ai-msg ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <form className="ai-drawer-footer" onSubmit={handleAiSend}>
                <input 
                  type="text" 
                  placeholder="Ask about 11h driving clock, 34h restart..." 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </>
        )}
      </div>
    );
  }

  // DEFAULT: RENDER MARKETING PUBLIC EXPERIENCE
  return (
    <MarketingPage 
      currentPath={currentPath} 
      navigate={navigate} 
      isAuthenticated={!!currentUser} 
    />
  );
};

export default App;
