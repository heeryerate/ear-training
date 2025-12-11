import { useRef } from 'react';

import { ChordType } from '../data/chords';

interface UseChordPracticeRandomizationReturn {
  getNextCombination: (
    excludePrevious: boolean,
    previousKey: string | null,
    previousChordType: ChordType | null
  ) => { key: string; chord: ChordType } | null;
  updateShuffledCombinations: () => void;
  resetCombinationIndex: () => void;
}

// Fisher-Yates shuffle function
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useChordPracticeRandomization = (
  selectedKeys: Set<string>,
  selectedChords: Set<ChordType>
): UseChordPracticeRandomizationReturn => {
  // Shuffle-and-cycle randomization refs
  const shuffledCombinationsRef = useRef<
    Array<{ key: string; chord: ChordType }>
  >([]);
  const combinationIndexRef = useRef<number>(0);
  const lastSelectionHashRef = useRef<string>('');

  // Generate and shuffle combinations when selections change
  const updateShuffledCombinations = () => {
    if (selectedKeys.size === 0 || selectedChords.size === 0) {
      shuffledCombinationsRef.current = [];
      combinationIndexRef.current = 0;
      return;
    }

    const keysArray = Array.from(selectedKeys);
    const chordsArray = Array.from(selectedChords);
    const selectionHash = `${keysArray.sort().join(',')}|${chordsArray.sort().join(',')}`;

    // Only regenerate if selections changed
    if (selectionHash !== lastSelectionHashRef.current) {
      const allCombinations: Array<{ key: string; chord: ChordType }> = [];
      keysArray.forEach(key => {
        chordsArray.forEach(chord => {
          allCombinations.push({ key, chord });
        });
      });

      shuffledCombinationsRef.current = shuffleArray(allCombinations);
      combinationIndexRef.current = 0;
      lastSelectionHashRef.current = selectionHash;
    }
  };

  // Get next combination from shuffled array (with cycle)
  const getNextCombination = (
    excludePrevious: boolean = false,
    previousKey: string | null,
    previousChordType: ChordType | null
  ): { key: string; chord: ChordType } | null => {
    updateShuffledCombinations();

    if (shuffledCombinationsRef.current.length === 0) return null;

    // If we've cycled through all combinations, reshuffle
    if (combinationIndexRef.current >= shuffledCombinationsRef.current.length) {
      shuffledCombinationsRef.current = shuffleArray(
        shuffledCombinationsRef.current
      );
      combinationIndexRef.current = 0;
    }

    // Get available combinations (excluding previous if needed)
    let availableCombinations = shuffledCombinationsRef.current;
    if (excludePrevious && previousKey && previousChordType) {
      availableCombinations = shuffledCombinationsRef.current.filter(
        combo =>
          !(combo.key === previousKey && combo.chord === previousChordType)
      );
      // If filtering leaves nothing, use all combinations
      if (availableCombinations.length === 0) {
        availableCombinations = shuffledCombinationsRef.current;
      }
    }

    // Find next combination from current index
    let attempts = 0;
    while (attempts < availableCombinations.length) {
      const combo =
        availableCombinations[
          (combinationIndexRef.current + attempts) %
            availableCombinations.length
        ];
      combinationIndexRef.current++;
      if (
        !excludePrevious ||
        !(combo.key === previousKey && combo.chord === previousChordType)
      ) {
        return combo;
      }
      attempts++;
    }

    // Fallback: just get next from shuffled array
    const combo =
      shuffledCombinationsRef.current[
        combinationIndexRef.current % shuffledCombinationsRef.current.length
      ];
    combinationIndexRef.current++;
    return combo;
  };

  const resetCombinationIndex = () => {
    combinationIndexRef.current = 0;
  };

  return {
    getNextCombination,
    updateShuffledCombinations,
    resetCombinationIndex,
  };
};
