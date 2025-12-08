import './App.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ChordPracticeApp from './components/ChordPracticeApp';
import EarTrainingApp from './components/EarTrainingApp';
import GroovePracticeApp from './components/GroovePracticeApp';
import Menu from './components/Menu';
import ScalePracticeApp from './components/ScalePracticeApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/ear-training" element={<EarTrainingApp />} />
      <Route path="/scale-practice" element={<ScalePracticeApp />} />
      <Route path="/chord-practice" element={<ChordPracticeApp />} />
      <Route path="/groove-practice" element={<GroovePracticeApp />} />
    </Routes>
  );
}

export default App;
