import React from 'react';

import {
  getAvailableScaleTypes,
  getScaleDisplayName,
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
  const scaleTypes = getAvailableScaleTypes();

  return (
    <div className="scale-selection-panel">
      <h2>🎵 Scale Selection</h2>

      <div className="scale-selector">
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
    </div>
  );
};

export default ScaleSelectionPanel;
