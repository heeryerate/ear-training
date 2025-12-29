import './Menu.css';

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../contexts/UserContext';
import { Auth } from './Auth/Auth';

const Menu: React.FC = () => {
  const { user, logout, loading } = useUser();
  const [showAuth, setShowAuth] = useState(false);
  const authContainerRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Close auth window when user successfully logs in
  useEffect(() => {
    if (user) {
      setShowAuth(false);
    }
  }, [user]);

  // Close auth window when clicking outside (on backdrop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authContainerRef.current &&
        !authContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.menu-auth-button')
      ) {
        setShowAuth(false);
      }
    };

    if (showAuth) {
      // Small delay to prevent immediate close when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showAuth]);

  if (loading) {
    return (
      <div className="menu-container">
        <div className="menu-content">
          <div style={{ color: 'white', textAlign: 'center' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-content">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '20px',
          }}
        >
          <h1 className="menu-title">🎵 JazzUp Apps</h1>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {user ? (
              <>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  {user.email}
                </span>
                <button onClick={handleLogout} className="menu-logout-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuth(!showAuth)}
                  className="menu-auth-button"
                >
                  Sign In / Sign Up
                </button>
                {showAuth && (
                  <div className="auth-inline-container" ref={authContainerRef}>
                    <Auth />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <p className="menu-description">
          Discover our suite of musical learning applications
          {user && (
            <span
              style={{
                display: 'block',
                marginTop: '8px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              Your progress is being saved automatically
            </span>
          )}
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
              &copy; 2025 JazzUp. All rights reserved.
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
