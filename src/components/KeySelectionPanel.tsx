import React from 'react';

import { keyCenters } from '../data/keyCenters';
import { KeyCenter } from '../types';

interface KeySelectionPanelProps {
  selectedKeys: Set<string>;
  onToggleKey: (key: string) => void;
  disabled: boolean;
}

const KeySelectionPanel: React.FC<KeySelectionPanelProps> = ({
  selectedKeys,
  onToggleKey,
  disabled,
}) => {
  return (
    <div className="key-selection-panel">
      <h2>🎼 Key Selection</h2>

      <div className="key-selector">
        <div className="key-buttons">
          {keyCenters.map((keyCenter: KeyCenter) => (
            <button
              key={keyCenter.key}
              className={`key-button ${selectedKeys.has(keyCenter.key) ? 'selected' : ''}`}
              onClick={() => onToggleKey(keyCenter.key)}
              disabled={disabled}
            >
              {keyCenter.key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeySelectionPanel;
