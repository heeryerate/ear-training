import './Menu.css';

import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <div className="menu-container">
      <div className="menu-content">
        <h1 className="menu-title">🎵 GaleTone Apps</h1>
        <p className="menu-description">
          Discover our suite of musical learning applications
        </p>

        <div className="menu-items">
          <Link to="/ear-training" className="menu-item">
            <div className="menu-item-thumbnail">
              <div className="thumbnail-content">
                <div className="thumbnail-icon">🎼</div>
                <div className="thumbnail-preview">
                  <div className="preview-note">C</div>
                  <div className="preview-chord">Am</div>
                  <div className="preview-progress">85%</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Ear Training</h3>
              <p>Master musical ear training with interactive exercises</p>
              <div className="menu-item-status">
                <span className="status-badge status-active">Active</span>
                <span className="status-features">
                  Note Recognition • Chord Progressions • Progress Tracking
                </span>
              </div>
            </div>
            <div className="menu-item-arrow">→</div>
          </Link>

          <Link to="/scale-practice" className="menu-item">
            <div className="menu-item-thumbnail">
              <div className="thumbnail-content">
                <div className="thumbnail-icon">🎹</div>
                <div className="thumbnail-preview">
                  <div className="preview-scale">C Major</div>
                  <div className="preview-keys">♯♯♯</div>
                  <div className="preview-tempo">120 BPM</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Scale Practice</h3>
              <p>Master musical scales with interactive practice sessions</p>
              <div className="menu-item-status">
                <span className="status-badge status-active">Active</span>
                <span className="status-features">
                  18 Scale Types • All 12 Keys • Visual Feedback • Progress
                  Tracking
                </span>
              </div>
            </div>
            <div className="menu-item-arrow">→</div>
          </Link>

          <Link to="/chord-practice" className="menu-item">
            <div className="menu-item-thumbnail">
              <div className="thumbnail-content">
                <div className="thumbnail-icon">🎸</div>
                <div className="thumbnail-preview">
                  <div className="preview-chord">C Major</div>
                  <div className="preview-voicing">1-3-5</div>
                  <div className="preview-progression">I-IV-V</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Chord Practice</h3>
              <p>
                Master chord progressions and voicings with interactive practice
              </p>
              <div className="menu-item-status">
                <span className="status-badge status-development">
                  In Development
                </span>
                <span className="status-features">
                  Major Chords • Minor Chords • Seventh Chords • Progressions
                </span>
              </div>
            </div>
            <div className="menu-item-arrow">→</div>
          </Link>

          <Link to="/rhythm-practice" className="menu-item">
            <div className="menu-item-thumbnail">
              <div className="thumbnail-content">
                <div className="thumbnail-icon">🥁</div>
                <div className="thumbnail-preview">
                  <div className="preview-beat">4/4 Time</div>
                  <div className="preview-pattern">♩ ♩ ♩ ♩</div>
                  <div className="preview-tempo">120 BPM</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Rhythm Practice</h3>
              <p>Master rhythm patterns and timing with interactive practice</p>
              <div className="menu-item-status">
                <span className="status-badge status-development">
                  In Development
                </span>
                <span className="status-features">
                  Basic Beats • Time Signatures • Syncopation • Groove Training
                </span>
              </div>
            </div>
            <div className="menu-item-arrow">→</div>
          </Link>
        </div>

        <div className="menu-footer">
          <div className="footer-content">
            <div className="footer-icon">🚀</div>
            <p>More apps coming soon...</p>
          </div>

          <div className="footer-bottom">
            <p className="footer-inline">
              &copy; 2025 GaleTone. All rights reserved. ·{' '}
              <a href="mailto:gale051108@gmail.com" className="email-link">
                Contact me
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
