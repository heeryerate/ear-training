import React from 'react';

import { DifficultyLevel } from '../data/chords';
import {
  getScaleDisplayName,
  getScaleTypesByCategory,
  getScaleTypesByDifficulty,
  ScaleCategory,
  ScaleType,
} from '../data/scales';

interface ScaleSelectionPanelProps {
  selectedScales: Set<ScaleType>;
  onToggleScale: (scaleType: ScaleType) => void;
  onToggleCategory: (scaleTypes: ScaleType[]) => void;
  disabled: boolean;
  difficulty: DifficultyLevel;
}

const ScaleSelectionPanel: React.FC<ScaleSelectionPanelProps> = ({
  selectedScales,
  onToggleScale,
  onToggleCategory,
  disabled,
  difficulty,
}) => {
  const scaleTypesByCategory = getScaleTypesByCategory();
  const availableScaleTypes = getScaleTypesByDifficulty(difficulty);
  const categoryOrder: ScaleCategory[] = [
    'tonic-major',
    'tonic-minor',
    'dominant',
    'symmetrical-outside-colors',
  ];

  const isCategoryAllSelected = (scaleTypes: ScaleType[]): boolean => {
    return scaleTypes.every(scaleType => selectedScales.has(scaleType));
  };

  const handleCategoryToggle = (scaleTypes: ScaleType[]) => {
    onToggleCategory(scaleTypes);
  };

  return (
    <div className="scale-selection-panel">
      <h2>🎵 Scale Selection</h2>

      <div className="scale-selector">
        {categoryOrder.map(category => {
          const allScaleTypes = scaleTypesByCategory[category];
          // Filter to only show scales available at current difficulty level
          const scaleTypes = allScaleTypes.filter(scaleType =>
            availableScaleTypes.includes(scaleType)
          );
          if (scaleTypes.length === 0) return null;

          const allSelected = isCategoryAllSelected(scaleTypes);

          return (
            <div key={category} className="scale-category-group">
              <div className="scale-category-header">
                <h3 className="scale-category-title">
                  {category
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <button
                  className={`category-select-all ${allSelected ? 'selected' : ''}`}
                  onClick={() => handleCategoryToggle(scaleTypes)}
                  disabled={disabled}
                  title={allSelected ? 'Deselect all' : 'Select all'}
                >
                  {allSelected ? '✓' : '☐'}
                </button>
              </div>
              <div className="scale-buttons">
                {scaleTypes.map(scaleType => (
                  <button
                    key={scaleType}
                    className={`scale-button ${selectedScales.has(scaleType) ? 'selected' : ''}`}
                    onClick={() => onToggleScale(scaleType)}
                    disabled={disabled}
                  >
                    {getScaleDisplayName(scaleType)}
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

export default ScaleSelectionPanel;
