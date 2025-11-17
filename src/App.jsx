import React, { useState, useEffect } from 'react';
import { isAuthenticated, logout } from './services/auth';
import Login from './components/Login';
import PhoneNumberForm from './components/PhoneNumberForm';
import PhoneNumberList from './components/PhoneNumberList';
import Stats from './components/Stats';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const isLoggedIn = isAuthenticated();
      setAuthenticated(isLoggedIn);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show dashboard if authenticated
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>📱 SMS Phone Number Manager</h1>
            <p>Manage phone numbers for voicemail transcription notifications</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="container">
        <Stats refreshKey={refreshKey} />
        <PhoneNumberForm onSuccess={handleUpdate} />
        <PhoneNumberList refreshKey={refreshKey} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}

export default App;