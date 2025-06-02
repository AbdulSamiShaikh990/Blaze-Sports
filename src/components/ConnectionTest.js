import React, { useState, useEffect } from 'react';
import { testConnection } from '../config/api';

const ConnectionTest = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await testConnection();
        setMessage(response.message);
        setError('');
      } catch (err) {
        setError('Failed to connect to backend');
        setMessage('');
      }
    };

    checkConnection();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Backend Connection Test</h2>
      {message && (
        <div style={{ color: 'green', margin: '10px 0' }}>
          <strong>Success!</strong> {message}
        </div>
      )}
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default ConnectionTest; 