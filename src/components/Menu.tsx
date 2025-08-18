import './Menu.css';

import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <div className="menu-container">
      <div className="menu-content">
        <h1 className="menu-title">🎵 GaleTone Apps</h1>
        <p className="menu-description">
          Welcome! Choose an app to get started.
        </p>

        <div className="menu-items">
          <Link to="/ear-training" className="menu-item">
            <div className="menu-item-icon">🎼</div>
            <div className="menu-item-content">
              <h3>Ear Training on Key Center</h3>
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
