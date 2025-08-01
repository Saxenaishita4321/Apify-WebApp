import React from 'react';
import './ActorSelector.css';

const ActorSelector = ({ actors, onSelect, onBack, user }) => {
  return (
    <div className="actor-selector-container">
      <div className="actor-selector-card">
        <div className="card-header">
          <h2>🎭 Select an Actor</h2>
          <p>Available actors for {user.username}</p>
        </div>

        {actors.length === 0 ? (
          <p className="no-actors-message">No actors available.</p>
        ) : (
          <ul className="actor-list">
            {actors.map((actor) => (
              <li key={actor.id} className="actor-item">
                <button onClick={() => onSelect(actor)} className="actor-button">
                  <h3>{actor.title || actor.name}</h3>
                  <p>{actor.description}</p>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="action-buttons">
          <button onClick={onBack} className="back-button">
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActorSelector;

