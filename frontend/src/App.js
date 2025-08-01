import React, { useState, useEffect } from 'react';
import './App.css';
import ApiKeyForm from './components/ApiKeyForm';
import ActorSelector from './components/ActorSelector';
import ActorRunner from './components/ActorRunner';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [user, setUser] = useState(null);
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [currentStep, setCurrentStep] = useState('api-key'); // 'api-key', 'actor-selection', 'actor-runner'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  const handleApiKeySubmit = async (key) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/verify-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await response.json();

      if (response.ok) {
        setApiKey(key);
        setUser(data.user);
        setCurrentStep('actor-selection');
        await fetchActors(key);
      } else {
        setError(data.error || 'Invalid API key');
      }
    } catch (err) {
      setError('Failed to connect to server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchActors = async (key) => {
    try {
      const response = await fetch(`${API_BASE_URL}/actors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await response.json();

      if (response.ok) {
        setActors(data.actors);
      } else {
        setError(data.error || 'Failed to fetch actors');
      }
    } catch (err) {
      setError('Failed to fetch actors');
    }
  };

  const handleActorSelect = (actor) => {
    setSelectedActor(actor);
    setCurrentStep('actor-runner');
  };

  const handleBack = () => {
    if (currentStep === 'actor-runner') {
      setCurrentStep('actor-selection');
      setSelectedActor(null);
    } else if (currentStep === 'actor-selection') {
      setCurrentStep('api-key');
      setApiKey('');
      setUser(null);
      setActors([]);
    }
    setError('');
  };

  const handleReset = () => {
    setApiKey('');
    setUser(null);
    setActors([]);
    setSelectedActor(null);
    setCurrentStep('api-key');
    setError('');
  };

  return (
    <div className="App">
      <Header user={user} onReset={handleReset} />
      
      <main className="main-content">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        {currentStep === 'api-key' && (
          <ApiKeyForm onSubmit={handleApiKeySubmit} loading={loading} />
        )}
        
        {currentStep === 'actor-selection' && (
          <ActorSelector 
            actors={actors} 
            onSelect={handleActorSelect}
            onBack={handleBack}
            user={user}
          />
        )}
        
        {currentStep === 'actor-runner' && selectedActor && (
          <ActorRunner 
            actor={selectedActor}
            apiKey={apiKey}
            onBack={handleBack}
            apiBaseUrl={API_BASE_URL}
          />
        )}
      </main>
    </div>
  );
}

export default App;
