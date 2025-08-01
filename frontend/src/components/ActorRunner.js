import React, { useState } from 'react';
import './ActorRunner.css';

const ActorRunner = ({ apiKey, onBack, apiBaseUrl }) => {
  const [url, setUrl] = useState('https://httpbin.org/post');
  const [method, setMethod] = useState('POST');
  const [body, setBody] = useState('');
  const [contentType, setContentType] = useState('application/json');
  const [result, setResult] = useState(null);
  const [inputSchema, setInputSchema] = useState(null);
  const [runLoading, setRunLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRun = async () => {
    setRunLoading(true);
    setError('');
    setResult(null);
    setInputSchema(null);
    try {
      let parsedBody = body;
      if (contentType === 'application/json' && body) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          setError('Invalid JSON body');
          setRunLoading(false);
          return;
        }
      }
      const response = await fetch(`${apiBaseUrl}/run-generic-actor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, url, method, body: parsedBody, contentType })
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.results);
        setInputSchema(data.inputSchema);
        setError('');
      } else {
        setError(data.error || 'Failed to run actor');
        setInputSchema(data.inputSchema || null);
        setResult(null);
      }
    } catch (err) {
      setError('Network error: Failed to connect to server. Please check if the backend is running.');
    } finally {
      setRunLoading(false);
    }
  };

  return (
    <div className="actor-runner-container">
      <div className="actor-runner-card">
        <div className="card-header">
          <h2>⚙️ Generic HTTP Request Actor</h2>
          <p className="actor-description">
            Run a generic HTTP request using your Apify API key. Specify the URL, HTTP method, request body, and content type.
          </p>
        </div>
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        <div className="input-form">
          <h3>📝 Configuration</h3>
          <div className="form-fields">
            <div className="input-group">
              <label htmlFor="url">URL</label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="input-field"
                placeholder="Enter URL..."
                disabled={runLoading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="method">HTTP Method</label>
              <select
                id="method"
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="input-field"
                disabled={runLoading}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
                <option value="HEAD">HEAD</option>
                <option value="OPTIONS">OPTIONS</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="body">Body (JSON or text)</label>
              <textarea
                id="body"
                value={body}
                onChange={e => setBody(e.target.value)}
                className="input-field textarea-field"
                rows={4}
                placeholder="Enter request body..."
                disabled={runLoading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="contentType">Content-Type</label>
              <input
                id="contentType"
                type="text"
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                className="input-field"
                placeholder="e.g. application/json"
                disabled={runLoading}
              />
            </div>
          </div>
          <div className="action-buttons">
            <button
              onClick={handleRun}
              disabled={runLoading}
              className="run-button"
            >
              {runLoading ? (
                <>
                  <span className="spinner"></span>
                  Running Actor...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Run Actor
                </>
              )}
            </button>
            <button
              onClick={onBack}
              className="back-button"
              disabled={runLoading}
            >
              ⬅ Back
            </button>
          </div>
        </div>
        {inputSchema && (
          <div className="result-section">
            <h3>📦 Input Schema Used</h3>
            <pre className="result-json">{JSON.stringify(inputSchema, null, 2)}</pre>
          </div>
        )}
        {result && (
          <div className="result-section">
            <h3>✅ Execution Result</h3>
            <pre className="result-json">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorRunner;

