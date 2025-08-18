import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu: React.FC = () => {
  return (
    <div className="menu-container">
      <div className="menu-content">
        <h1 className="menu-title">🎵 Galetone Apps</h1>
        <p className="menu-description">
          Welcome to the Galetone application suite. Choose an app to get started.
        </p>
        
        <div className="menu-items">
          <Link to="/ear-training" className="menu-item">
            <div className="menu-item-icon">🎼</div>
            <div className="menu-item-content">
              <h3>Ear Training App</h3>
              <p>Master musical ear training with interactive exercises for note recognition, chord progressions, and more.</p>
              <div className="menu-item-features">
                • Note Recognition • Chord Progressions • Progress Tracking • Mobile-Friendly
              </div>
            </div>
            <div className="menu-item-arrow">→</div>
          </Link>
        </div>
        
        <div className="menu-footer">
          <p>More apps coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
