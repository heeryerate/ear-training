import React from 'react';

import {
  ChordCategory,
  ChordType,
  DifficultyLevel,
  getCategoryDisplayName,
  getChordDisplayName,
  getChordTypesByCategory,
  getChordTypesByDifficulty,
} from '../data/chords';

interface ChordSelectionPanelProps {
  selectedChords: Set<ChordType>;
  onToggleChord: (chordType: ChordType) => void;
  onToggleCategory: (chordTypes: ChordType[]) => void;
  disabled: boolean;
  difficulty: DifficultyLevel;
}

const ChordSelectionPanel: React.FC<ChordSelectionPanelProps> = ({
  selectedChords,
  onToggleChord,
  onToggleCategory,
  disabled,
  difficulty,
}) => {
  const chordTypesByCategory = getChordTypesByCategory();
  const availableChordTypes = getChordTypesByDifficulty(difficulty);
  const categoryOrder: ChordCategory[] = [
    'major-family',
    'minor-family',
    'dominant-family',
    'diminished-family',
  ];

  const isCategoryAllSelected = (chordTypes: ChordType[]): boolean => {
    return chordTypes.every(chordType => selectedChords.has(chordType));
  };

  const handleCategoryToggle = (chordTypes: ChordType[]) => {
    onToggleCategory(chordTypes);
  };

  return (
    <div className="chord-selection-panel">
      <h2>🎵 Chord Selection</h2>

      <div className="chord-selector">
        {categoryOrder.map(category => {
          const allChordTypes = chordTypesByCategory[category];
          // Filter to only show chords available at current difficulty level
          const chordTypes = allChordTypes.filter(chordType =>
            availableChordTypes.includes(chordType)
          );
          if (chordTypes.length === 0) return null;

          const allSelected = isCategoryAllSelected(chordTypes);

          return (
            <div key={category} className="chord-category-group">
              <div className="chord-category-header">
                <h3 className="chord-category-title">
                  {getCategoryDisplayName(category)}
                </h3>
                <button
                  className={`category-select-all ${allSelected ? 'selected' : ''}`}
                  onClick={() => handleCategoryToggle(chordTypes)}
                  disabled={disabled}
                  title={allSelected ? 'Deselect all' : 'Select all'}
                >
                  {allSelected ? '✓' : '☐'}
                </button>
              </div>
              <div className="chord-buttons">
                {chordTypes.map(chordType => (
                  <button
                    key={chordType}
                    className={`chord-button ${selectedChords.has(chordType) ? 'selected' : ''}`}
                    onClick={() => onToggleChord(chordType)}
                    disabled={disabled}
                  >
                    {getChordDisplayName(chordType)}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChordSelectionPanel;
