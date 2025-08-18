import './App.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import EarTrainingApp from './components/EarTrainingApp';
import Menu from './components/Menu';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/ear-training" element={<EarTrainingApp />} />
    </Routes>
  );
}

export default App;
