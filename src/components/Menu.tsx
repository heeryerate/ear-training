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
              <h3>Ear Training App</h3>
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
              <h3>Scale Practice App</h3>
              <p>Master musical scales with interactive practice sessions</p>
              <div className="menu-item-status">
                <span className="status-badge status-development">
                  In Development
                </span>
                <span className="status-features">
                  Major Scales • Minor Scales • Pentatonic • Metronome
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
        </div>
      </div>
    </div>
  );
};

export default Menu;
