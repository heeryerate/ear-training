import './App.css';

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import EarTrainingApp from './components/EarTrainingApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/ear-training" element={<EarTrainingApp />} />
    </Routes>
  );
}

export default App;
