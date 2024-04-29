import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const ws = new WebSocket('ws://localhost:3000');
  console.log('ws', ws)
  ws.onopen = function(event) {
    console.log('WebSocket connection opened!');
    // You can send initial messages to the server after connection
  };
  
  ws.onmessage = function(event) {
    console.log('Message received from server:', event.data);
    // Process messages received from the server (update UI, etc.)
  };
  
  ws.onclose = function(event) {
    console.log('WebSocket connection closed!');
    // Handle disconnection (reconnect logic, etc.)
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
