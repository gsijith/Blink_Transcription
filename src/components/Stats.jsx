import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import '../styles/stats.css';

function Stats({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats">
        <div className="loading">Loading stats...</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-icon">📱</div>
        <div className="stat-content">
          <div className="stat-value">{stats.phoneNumbers?.active || 0}</div>
          <div className="stat-label">Active Numbers</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📧</div>
        <div className="stat-content">
          <div className="stat-value">{stats.summary?.totalTranscriptions || 0}</div>
          <div className="stat-label">Transcriptions</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">✉️</div>
        <div className="stat-content">
          <div className="stat-value">{stats.summary?.totalSmsSent || 0}</div>
          <div className="stat-label">SMS Sent</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🔧</div>
        <div className="stat-content">
          <div className="stat-value">{stats.summary?.totalExtensions || 0}</div>
          <div className="stat-label">Extensions</div>
        </div>
      </div>
    </div>
  );
}

export default Stats;