import React from 'react';

import {
  getScaleDisplayName,
  getScaleTypesByCategory,
  ScaleCategory,
  ScaleType,
} from '../data/scales';

interface ScaleSelectionPanelProps {
  selectedScales: Set<ScaleType>;
  onToggleScale: (scaleType: ScaleType) => void;
  disabled: boolean;
}

const ScaleSelectionPanel: React.FC<ScaleSelectionPanelProps> = ({
  selectedScales,
  onToggleScale,
  disabled,
}) => {
  const scaleTypesByCategory = getScaleTypesByCategory();
  const categoryOrder: ScaleCategory[] = [
    'tonic-major',
    'tonic-minor',
    'dominant',
    'symmetrical-outside-colors',
  ];

  return (
    <div className="scale-selection-panel">
      <h2>🎵 Scale Selection</h2>

      <div className="scale-selector">
        {categoryOrder.map(category => (
          <div key={category} className="scale-category-group">
            <h3>
              {category
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <div className="scale-buttons">
              {scaleTypesByCategory[category].map(scaleType => (
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
        ))}
      </div>
    </div>
  );
};

export default ScaleSelectionPanel;
