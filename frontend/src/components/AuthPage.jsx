import React, { useState } from 'react';
import '../marketing.css';

export default function AuthPage({ navigate, onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = authMode === 'login' 
      ? 'http://localhost:8000/api/auth/login/' 
      : 'http://localhost:8000/api/auth/signup/';

    const payload = authMode === 'login'
      ? { username, password }
      : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      // Save driver session in LocalStorage
      const userObj = {
        user_id: data.user_id,
        username: data.username
      };
      localStorage.setItem('hos_driver', JSON.stringify(userObj));
      onAuthSuccess(userObj);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-page-card">
        <div className="auth-page-header">
          <div 
            className="m-logo" 
            style={{ justifyContent: 'center', marginBottom: '20px', fontSize: '24px' }}
            onClick={() => navigate('/')}
          >
            ⚡ HOS Planner
          </div>
          <h2>{authMode === 'login' ? 'Sign in to HOS App' : 'Create driver account'}</h2>
          <p>{authMode === 'login' ? 'Enter credentials to access your routes logs' : 'Register details to track HOS compliance'}</p>
        </div>

        {error && (
          <div className="auth-error" style={{ fontSize: '13px', padding: '12px', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@example.com"
                  required
                />
              </div>
            </div>
          )}
          <div className="form-group">
            <label>{authMode === 'login' ? 'Driver Username' : 'Driver Name (Username)'}</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="driver_bob"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Secure Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '38px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '16px' }} disabled={loading}>
            {loading ? 'Authenticating...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-page-toggle">
          {authMode === 'login' ? "Don't have an account yet?" : "Already have an account?"}
          <button 
            className="auth-page-toggle-btn"
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
              setError('');
            }}
          >
            {authMode === 'login' ? 'Register Now' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
