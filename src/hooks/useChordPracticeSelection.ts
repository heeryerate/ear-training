import { useState } from 'react';

import {
  ChordType,
  DifficultyLevel,
  getChordTypesByDifficulty,
} from '../data/chords';

interface UseChordPracticeSelectionReturn {
  selectedKeys: Set<string>;
  selectedChords: Set<ChordType>;
  difficulty: DifficultyLevel;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectedChords: React.Dispatch<React.SetStateAction<Set<ChordType>>>;
  toggleKey: (key: string) => void;
  toggleChord: (chordType: ChordType) => void;
  toggleChordCategory: (chordTypes: ChordType[]) => void;
  handleDifficultyChange: (newDifficulty: DifficultyLevel) => void;
}

// Default chords for intermediate and professional
const getDefaultChords = (level: DifficultyLevel): ChordType[] => {
  if (level === 'entry') {
    return ['major', 'minor'];
  }
  // For intermediate and professional: major, major-7th, minor, minor-7th, dominant-7th
  return ['major', 'major-7th', 'minor', 'minor-7th', 'dominant-7th'];
};

export const useChordPracticeSelection =
  (): UseChordPracticeSelectionReturn => {
    const [difficulty, setDifficulty] = useState<DifficultyLevel>('entry');
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
      new Set(['C', 'G'])
    );
    const [selectedChords, setSelectedChords] = useState<Set<ChordType>>(
      new Set<ChordType>(getDefaultChords('entry'))
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

    // Toggle chord selection
    const toggleChord = (chordType: ChordType) => {
      const newSelectedChords = new Set(selectedChords);
      if (newSelectedChords.has(chordType)) {
        newSelectedChords.delete(chordType);
      } else {
        newSelectedChords.add(chordType);
      }
      setSelectedChords(newSelectedChords);
    };

    // Toggle all chords in a category
    const toggleChordCategory = (chordTypes: ChordType[]) => {
      const newSelectedChords = new Set(selectedChords);
      const allSelected = chordTypes.every(chordType =>
        newSelectedChords.has(chordType)
      );

      if (allSelected) {
        // Deselect all in category
        chordTypes.forEach(chordType => newSelectedChords.delete(chordType));
      } else {
        // Select all in category
        chordTypes.forEach(chordType => newSelectedChords.add(chordType));
      }
      setSelectedChords(newSelectedChords);
    };

    // Handle difficulty change - filter selected chords and set default keys
    const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
      setDifficulty(newDifficulty);

      // Filter chords
      const availableChords = getChordTypesByDifficulty(newDifficulty);

      // For intermediate and professional, always set default chords
      // For entry, always reset to defaults (Major, Minor)
      if (
        newDifficulty === 'intermediate' ||
        newDifficulty === 'professional'
      ) {
        const defaultChords = getDefaultChords(newDifficulty);
        const validDefaultChords = defaultChords.filter(chord =>
          availableChords.includes(chord)
        );
        setSelectedChords(new Set(validDefaultChords));
      } else {
        // Entry level: always reset to defaults (Major, Minor)
        const defaultChords = getDefaultChords(newDifficulty);
        const validDefaultChords = defaultChords.filter(chord =>
          availableChords.includes(chord)
        );
        setSelectedChords(new Set(validDefaultChords));
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
      selectedChords,
      difficulty,
      setSelectedKeys,
      setSelectedChords,
      toggleKey,
      toggleChord,
      toggleChordCategory,
      handleDifficultyChange,
    };
  };
