import React from 'react';

import {
  getCategoryDisplayName,
  getGrooveDisplayName,
  getGroovesByCategory,
  GrooveCategory,
  GrooveType,
} from '../data/grooves';

interface GrooveSelectionPanelProps {
  selectedGrooves: Set<GrooveType>;
  onToggleGroove: (grooveType: GrooveType) => void;
  disabled: boolean;
}

const GrooveSelectionPanel: React.FC<GrooveSelectionPanelProps> = ({
  selectedGrooves,
  onToggleGroove,
  disabled,
}) => {
  const groovesByCategory = getGroovesByCategory();
  const categoryOrder: GrooveCategory[] = [
    'daily-warm-up',
    'groove-rotation',
    'rhythmic-vocabulary',
  ];

  return (
    <div className="groove-selection-panel">
      <h2>🎵 Groove Selection</h2>

      <div className="groove-selector">
        {categoryOrder.map(category => (
          <div key={category} className="groove-category-group">
            <h3>{getCategoryDisplayName(category)}</h3>
            <div className="groove-buttons">
              {groovesByCategory[category].map(grooveType => (
                <button
                  key={grooveType}
                  className={`groove-button ${selectedGrooves.has(grooveType) ? 'selected' : ''}`}
                  onClick={() => onToggleGroove(grooveType)}
                  disabled={disabled}
                >
                  {getGrooveDisplayName(grooveType)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrooveSelectionPanel;
