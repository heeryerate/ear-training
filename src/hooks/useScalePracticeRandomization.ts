import { useRef } from 'react';

import { ScaleType } from '../data/scales';

interface UseScalePracticeRandomizationReturn {
  getNextCombination: (
    excludeCurrent: boolean,
    currentKey: string | null,
    currentScaleType: ScaleType | null
  ) => { key: string; scale: ScaleType } | null;
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

export const useScalePracticeRandomization = (
  selectedKeys: Set<string>,
  selectedScales: Set<ScaleType>
): UseScalePracticeRandomizationReturn => {
  // Shuffle-and-cycle randomization refs
  const shuffledCombinationsRef = useRef<
    Array<{ key: string; scale: ScaleType }>
  >([]);
  const combinationIndexRef = useRef<number>(0);
  const lastSelectionHashRef = useRef<string>('');

  // Generate and shuffle combinations when selections change
  const updateShuffledCombinations = () => {
    if (selectedKeys.size === 0 || selectedScales.size === 0) {
      shuffledCombinationsRef.current = [];
      combinationIndexRef.current = 0;
      return;
    }

    const keysArray = Array.from(selectedKeys);
    const scalesArray = Array.from(selectedScales);
    const selectionHash = `${keysArray.sort().join(',')}|${scalesArray.sort().join(',')}`;

    // Only regenerate if selections changed
    if (selectionHash !== lastSelectionHashRef.current) {
      const allCombinations: Array<{ key: string; scale: ScaleType }> = [];
      keysArray.forEach(key => {
        scalesArray.forEach(scale => {
          allCombinations.push({ key, scale });
        });
      });

      shuffledCombinationsRef.current = shuffleArray(allCombinations);
      combinationIndexRef.current = 0;
      lastSelectionHashRef.current = selectionHash;
    }
  };

  // Get next combination from shuffled array (with cycle)
  const getNextCombination = (
    excludeCurrent: boolean = false,
    currentKey: string | null,
    currentScaleType: ScaleType | null
  ): { key: string; scale: ScaleType } | null => {
    updateShuffledCombinations();

    if (shuffledCombinationsRef.current.length === 0) return null;

    // If we've cycled through all combinations, reshuffle
    if (combinationIndexRef.current >= shuffledCombinationsRef.current.length) {
      shuffledCombinationsRef.current = shuffleArray(
        shuffledCombinationsRef.current
      );
      combinationIndexRef.current = 0;
    }

    // Get available combinations (excluding current if needed)
    let availableCombinations = shuffledCombinationsRef.current;
    if (excludeCurrent && currentKey && currentScaleType) {
      availableCombinations = shuffledCombinationsRef.current.filter(
        combo => !(combo.key === currentKey && combo.scale === currentScaleType)
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
        !excludeCurrent ||
        !(combo.key === currentKey && combo.scale === currentScaleType)
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
