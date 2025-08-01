import React, { useState } from 'react';
import './ApiKeyForm.css';

const ApiKeyForm = ({ onSubmit, loading }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="api-key-form-container">
      <div className="api-key-card">
        <div className="card-header">
          <h2>🔐 Connect to Apify</h2>
          <p>Enter your Apify API key to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="api-key-form">
          <div className="input-group">
            <label htmlFor="apiKey">API Key</label>
            <div className="input-wrapper">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Apify API key..."
                className="api-key-input"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowKey(!showKey)}
                disabled={loading}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || !apiKey.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              <>
                <span>🚀</span>
                Connect
              </>
            )}
          </button>
        </form>
        
        <div className="help-text">
          <p>
            Don't have an API key? 
            <a 
              href="https://console.apify.com/account#/integrations" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Get one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyForm;
