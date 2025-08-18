import './ChordPracticeApp.css';

import React from 'react';
import { Link } from 'react-router-dom';

function ChordPracticeApp() {
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
            <h1>🎸 Chord Practice Center</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button className="tab-button active">🎯 Practice</button>
          <button className="tab-button">📊 Progress</button>
          <button className="tab-button">⚙️ Settings</button>
        </div>

        {/* Main Content */}
        <div className="chord-practice-container">
          <div className="chord-practice-panel">
            <h2>🎵 Chord Practice</h2>
            <p>
              Master chord progressions and voicings with interactive practice
              sessions. Learn common chord patterns, practice transitions, and
              improve your harmonic skills.
            </p>

            <div className="placeholder-content">
              <div className="placeholder-icon">🎸</div>
              <h3>Coming Soon</h3>
              <p>Chord practice features are under development.</p>
              <div className="placeholder-features">
                <div className="feature-item">• Major Chords</div>
                <div className="feature-item">• Minor Chords</div>
                <div className="feature-item">• Seventh Chords</div>
                <div className="feature-item">• Chord Progressions</div>
                <div className="feature-item">• Voice Leading</div>
                <div className="feature-item">• Practice Modes</div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default ChordPracticeApp;
