import './App.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import EarTrainingApp from './components/EarTrainingApp';
import Menu from './components/Menu';
import ScalePracticeApp from './components/ScalePracticeApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/ear-training" element={<EarTrainingApp />} />
      <Route path="/scale-practice" element={<ScalePracticeApp />} />
    </Routes>
  );
}

export default App;
