import { useState } from 'react';

import { DifficultyLevel } from '../data/chords';
import { getScaleTypesByDifficulty, ScaleType } from '../data/scales';

interface UseScalePracticeSelectionReturn {
  selectedKeys: Set<string>;
  selectedScales: Set<ScaleType>;
  difficulty: DifficultyLevel;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectedScales: React.Dispatch<React.SetStateAction<Set<ScaleType>>>;
  toggleKey: (key: string) => void;
  toggleScale: (scaleType: ScaleType) => void;
  toggleScaleCategory: (scaleTypes: ScaleType[]) => void;
  handleDifficultyChange: (newDifficulty: DifficultyLevel) => void;
}

// Default scales for intermediate and professional
const getDefaultScales = (level: DifficultyLevel): ScaleType[] => {
  if (level === 'entry') {
    return ['major', 'minor'];
  }
  // For intermediate and professional: major, minor, pentatonic-major, pentatonic-minor, dorian
  return ['major', 'minor', 'pentatonic-major', 'pentatonic-minor', 'dorian'];
};

export const useScalePracticeSelection =
  (): UseScalePracticeSelectionReturn => {
    const [difficulty, setDifficulty] = useState<DifficultyLevel>('entry');
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
      new Set(['C', 'G'])
    );
    const [selectedScales, setSelectedScales] = useState<Set<ScaleType>>(
      new Set<ScaleType>(getDefaultScales('entry'))
    );

    // Toggle key selection
    const toggleKey = (key: string) => {
      const newSelectedKeys = new Set(selectedKeys);
      if (newSelectedKeys.has(key)) {
        newSelectedKeys.delete(key);
      } else {
        newSelectedKeys.add(key);
      }
      setSelectedKeys(newSelectedKeys);
    };

    // Toggle scale selection
    const toggleScale = (scaleType: ScaleType) => {
      const newSelectedScales = new Set(selectedScales);
      if (newSelectedScales.has(scaleType)) {
        newSelectedScales.delete(scaleType);
      } else {
        newSelectedScales.add(scaleType);
      }
      setSelectedScales(newSelectedScales);
    };

    // Toggle all scales in a category
    const toggleScaleCategory = (scaleTypes: ScaleType[]) => {
      const newSelectedScales = new Set(selectedScales);
      const allSelected = scaleTypes.every(scaleType =>
        newSelectedScales.has(scaleType)
      );

      if (allSelected) {
        // Deselect all in category
        scaleTypes.forEach(scaleType => newSelectedScales.delete(scaleType));
      } else {
        // Select all in category
        scaleTypes.forEach(scaleType => newSelectedScales.add(scaleType));
      }
      setSelectedScales(newSelectedScales);
    };

    // Handle difficulty change - filter selected scales and set default keys
    const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
      setDifficulty(newDifficulty);

      // Filter scales
      const availableScales = getScaleTypesByDifficulty(newDifficulty);

      // For intermediate and professional, always set default scales
      // For entry, always reset to defaults (Major, Minor)
      if (
        newDifficulty === 'intermediate' ||
        newDifficulty === 'professional'
      ) {
        const defaultScales = getDefaultScales(newDifficulty);
        const validDefaultScales = defaultScales.filter(scale =>
          availableScales.includes(scale)
        );
        setSelectedScales(new Set(validDefaultScales));
      } else {
        // Entry level: always reset to defaults (Major, Minor)
        const defaultScales = getDefaultScales(newDifficulty);
        const validDefaultScales = defaultScales.filter(scale =>
          availableScales.includes(scale)
        );
        setSelectedScales(new Set(validDefaultScales));
      }

      // Set default keys based on difficulty (all keys are always visible)
      let defaultKeys: string[];
      switch (newDifficulty) {
        case 'entry':
          defaultKeys = ['C', 'G'];
          break;
        case 'intermediate':
          defaultKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
          break;
        case 'professional':
          defaultKeys = [
            'C',
            'Db',
            'D',
            'Eb',
            'E',
            'F',
            'Gb',
            'G',
            'Ab',
            'A',
            'Bb',
            'B',
          ];
          break;
        default:
          defaultKeys = [
            'C',
            'Db',
            'D',
            'Eb',
            'E',
            'F',
            'Gb',
            'G',
            'Ab',
            'A',
            'Bb',
            'B',
          ];
      }
      setSelectedKeys(new Set(defaultKeys));
    };

    return {
      selectedKeys,
      selectedScales,
      difficulty,
      setSelectedKeys,
      setSelectedScales,
      toggleKey,
      toggleScale,
      toggleScaleCategory,
      handleDifficultyChange,
    };
  };
