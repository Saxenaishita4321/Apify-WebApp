import React from 'react';
import './Header.css';

const Header = ({ user, onReset }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <span className="apify-logo">🕷️</span>
            Apify Runner
          </h1>
          <p className="app-subtitle">Execute actors dynamically with ease</p>
        </div>
        
        {user && (
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <div className="username">{user.username}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <button 
              className="reset-button"
              onClick={onReset}
              title="Reset and logout"
            >
              🔄 Reset
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
