import './App.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ChordPracticeApp from './components/ChordPracticeApp';
import EarTrainingApp from './components/EarTrainingApp';
import Menu from './components/Menu';
import RhythmPracticeApp from './components/RhythmPracticeApp';
import ScalePracticeApp from './components/ScalePracticeApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/ear-training" element={<EarTrainingApp />} />
      <Route path="/scale-practice" element={<ScalePracticeApp />} />
      <Route path="/chord-practice" element={<ChordPracticeApp />} />
      <Route path="/rhythm-practice" element={<RhythmPracticeApp />} />
    </Routes>
  );
}

export default App;
