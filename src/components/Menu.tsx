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
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Ear Training</h3>
              <div className="menu-item-status">
                <span className="status-badge status-active">Active</span>
                <span className="status-features">
                  Master note recognition and chord progressions
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
                  <div className="preview-scale">G Lydian</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Scale Practice</h3>
              <div className="menu-item-status">
                <span className="status-badge status-active">Active</span>
                <span className="status-features">
                  Practice scales with customizable BPM and pattern exercises
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
                  <div className="preview-chord">D7</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Chord Practice</h3>
              <div className="menu-item-status">
                <span className="status-badge status-active">Active</span>
                <span className="status-features">
                  Master chord voicings with adjustable tempo and smart practice
                  modes
                </span>
              </div>
            </div>
            <div className="menu-item-arrow">→</div>
          </Link>

          <Link to="/groove-practice" className="menu-item">
            <div className="menu-item-thumbnail">
              <div className="thumbnail-content">
                <div className="thumbnail-icon">🥁</div>
                <div className="thumbnail-preview">
                  <div className="preview-beat">3/4 Time</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Groove Practice</h3>
              <div className="menu-item-status">
                <span className="status-badge status-development">
                  In Development
                </span>
                <span className="status-features">
                  Develop rhythm and timing with diverse grooves
                </span>
              </div>
            </div>
            <div className="menu-item-arrow">→</div>
          </Link>

          <Link to="/sight-reading" className="menu-item">
            <div className="menu-item-thumbnail">
              <div className="thumbnail-content">
                <div className="thumbnail-icon">📖</div>
                <div className="thumbnail-preview">
                  <div className="preview-note preview-clef">𝄞</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Sight Reading</h3>
              <div className="menu-item-status">
                <span className="status-badge status-development">
                  In Development
                </span>
                <span className="status-features">
                  Improve sight reading skills with treble and bass clef
                </span>
              </div>
            </div>
            <div className="menu-item-arrow">→</div>
          </Link>

          <Link to="/tunes-library" className="menu-item">
            <div className="menu-item-thumbnail">
              <div className="thumbnail-content">
                <div className="thumbnail-icon">🎵</div>
                <div className="thumbnail-preview">
                  <div className="preview-note">🎼</div>
                </div>
              </div>
            </div>
            <div className="menu-item-content">
              <h3>Tunes Library</h3>
              <div className="menu-item-status">
                <span className="status-badge status-development">
                  In Development
                </span>
                <span className="status-features">
                  Build and practice your collection of favorite tunes
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
              &copy; 2025 GaleTone. All rights reserved.
            </p>
            <p className="footer-inline">
              <a href="mailto:gale051108@gmail.com" className="email-link">
                Contact me
              </a>
              {' · '}
              <a
                href="https://buymeacoffee.com/gale051108x"
                className="coffee-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                ☕ Buy me a coffee
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
