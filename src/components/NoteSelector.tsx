import React from 'react';

import { getNoteDisplayName } from '../data/keyCenters';
import { Note } from '../types';

interface NoteSelectorProps {
  allNotes: Note[];
  selectedNotes: Set<string>;
  selectedKey: string;
  onToggleNote: (note: string) => void;
  disabled: boolean;
}

const NoteSelector: React.FC<NoteSelectorProps> = ({
  allNotes,
  selectedNotes,
  selectedKey,
  onToggleNote,
  disabled,
}) => {
  return (
    <div className="note-selection-panel">
      <h2>🎼 Note Selection</h2>

      <div className="note-selection">
        <div className="note-buttons">
          {allNotes.map(({ note }) => (
            <button
              key={note}
              className={`note-button ${selectedNotes.has(note) ? 'selected' : ''}`}
              onClick={() => onToggleNote(note)}
              disabled={disabled}
            >
              {getNoteDisplayName(note, selectedKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteSelector;
