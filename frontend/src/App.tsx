import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { getApps } from './utils/helper';

const App: React.FC = () => {
  // CurrentApp must be capitalized to be used as a JSX tag.
  // TypeScript expects getApps() to return a React.ComponentType.
  const CurrentApp = getApps();

  return (
    <Router>
      <CurrentApp />
    </Router>
  );
};

export default App;