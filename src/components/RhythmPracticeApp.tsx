import './RhythmPracticeApp.css';

import React from 'react';
import { Link } from 'react-router-dom';

function RhythmPracticeApp() {
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
            <h1>🥁 Rhythm Practice Center</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button className="tab-button active">🎯 Practice</button>
          <button className="tab-button">📊 Progress</button>
          <button className="tab-button">⚙️ Settings</button>
        </div>

        {/* Main Content */}
        <div className="rhythm-practice-container">
          <div className="rhythm-practice-panel">
            <h2>🎵 Rhythm Practice</h2>
            <p>
              Master rhythm patterns and timing with interactive practice
              sessions. Develop your sense of groove, practice different time
              signatures, and improve your rhythmic accuracy.
            </p>

            <div className="placeholder-content">
              <div className="placeholder-icon">🥁</div>
              <h3>Coming Soon</h3>
              <p>Rhythm practice features are under development.</p>
              <div className="placeholder-features">
                <div className="feature-item">• Basic Beats</div>
                <div className="feature-item">• Time Signatures</div>
                <div className="feature-item">• Syncopation</div>
                <div className="feature-item">• Drum Patterns</div>
                <div className="feature-item">• Metronome</div>
                <div className="feature-item">• Groove Training</div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default RhythmPracticeApp;
