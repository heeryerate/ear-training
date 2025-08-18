import './App.css';

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Menu from './components/Menu';
import EarTrainingApp from './components/EarTrainingApp';

function App() {
  const location = useLocation();
  
  // If we're at the root path and in production (custom domain), show the menu
  // If we're at /ear-training, show the ear training app
  // If we're in development, show the menu at root and ear training at /ear-training
  
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/ear-training" element={<EarTrainingApp />} />
      {/* Fallback for any other routes */}
      <Route path="*" element={<Menu />} />
    </Routes>
  );
}

export default App;
