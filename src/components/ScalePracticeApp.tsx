import './ScalePracticeApp.css';

import React from 'react';
import { Link } from 'react-router-dom';

function ScalePracticeApp() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Navigation Bar */}
        <div className="nav-bar">
          <div className="nav-spacer"></div>
          <Link to="/" className="return-button">
            ← Back to Home
          </Link>
        </div>

        <div className="hero-section">
          <div className="hero-header">
            <h1>🎼 Scale Practice Center</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button className="tab-button active">🎯 Practice</button>
          <button className="tab-button">📊 Progress</button>
          <button className="tab-button">⚙️ Settings</button>
        </div>

        {/* Main Content */}
        <div className="scale-practice-container">
          <div className="scale-practice-panel">
            <h2>🎵 Scale Practice</h2>
            <div className="placeholder-content">
              <div className="placeholder-icon">🎹</div>
              <h3>Coming Soon</h3>
              <p>Scale practice features are under development.</p>
              <div className="placeholder-features">
                <div className="feature-item">• Major Scales</div>
                <div className="feature-item">• Minor Scales</div>
                <div className="feature-item">• Pentatonic Scales</div>
                <div className="feature-item">• Tempo Control</div>
                <div className="feature-item">• Progress Tracking</div>
                <div className="feature-item">• Metronome</div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ScalePracticeApp;
