import { KeyCenter } from '../types';

export const keyCenters: KeyCenter[] = [
  { key: 'C', name: 'C Major', tonic: 'C4' },
  { key: 'Db', name: 'Db Major', tonic: 'C#4' },
  { key: 'D', name: 'D Major', tonic: 'D4' },
  { key: 'Eb', name: 'Eb Major', tonic: 'D#4' },
  { key: 'E', name: 'E Major', tonic: 'E4' },
  { key: 'F', name: 'F Major', tonic: 'F4' },
  { key: 'Gb', name: 'Gb Major', tonic: 'F#4' },
  { key: 'G', name: 'G Major', tonic: 'G4' },
  { key: 'Ab', name: 'Ab Major', tonic: 'G#4' },
  { key: 'A', name: 'A Major', tonic: 'A4' },
  { key: 'Bb', name: 'Bb Major', tonic: 'A#4' },
  { key: 'B', name: 'B Major', tonic: 'B4' },
];

// Helper function to transpose a note by semitones
export const transposeNote = (baseNote: string, semitones: number): string => {
  const noteMap = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const octaveRegex = /(\d+)$/;
  const octaveMatch = baseNote.match(octaveRegex);
  const octave = octaveMatch ? parseInt(octaveMatch[1]) : 4;
  const noteWithoutOctave = baseNote.replace(octaveRegex, '');

  const baseIndex = noteMap.indexOf(noteWithoutOctave);
  if (baseIndex === -1) return baseNote;

  let newIndex = (baseIndex + semitones) % 12;
  let newOctave = octave;

  // Handle octave changes
  if (baseIndex + semitones >= 12) {
    newOctave += Math.floor((baseIndex + semitones) / 12);
  } else if (baseIndex + semitones < 0) {
    newOctave += Math.floor((baseIndex + semitones) / 12);
    newIndex = newIndex < 0 ? newIndex + 12 : newIndex;
  }

  return `${noteMap[newIndex]}${newOctave}`;
};

// Get semitone offset from C for a given key
export const getSemitonesFromC = (key: string): number => {
  const keyMap: { [key: string]: number } = {
    C: 0,
    Db: 1,
    D: 2,
    Eb: 3,
    E: 4,
    F: 5,
    Gb: 6,
    G: 7,
    Ab: 8,
    A: 9,
    Bb: 10,
    B: 11,
  };
  return keyMap[key] || 0;
};

// Audio note mapping (using sharps for Tone.js compatibility)
// All notes use sharp notation for audio playback
const audioKeyScaleNotes: { [key: string]: string[] } = {
  C: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'], // C major (no accidentals)
  Db: ['C#4', 'D#4', 'F4', 'F#4', 'G#4', 'A#4', 'C4'], // Db major (audio equivalents)
  D: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#4'], // D major (2 sharps: F#, C#)
  Eb: ['D#4', 'F4', 'G4', 'G#4', 'A#4', 'C4', 'D4'], // Eb major (audio equivalents)
  E: ['E4', 'F#4', 'G#4', 'A4', 'B4', 'C#4', 'D#4'], // E major (4 sharps: F#, C#, G#, D#)
  F: ['F4', 'G4', 'A4', 'A#4', 'C4', 'D4', 'E4'], // F major (audio: A#4 for Bb)
  Gb: ['F#4', 'G#4', 'A#4', 'B4', 'C#4', 'D#4', 'F4'], // Gb major (audio equivalents)
  G: ['G4', 'A4', 'B4', 'C4', 'D4', 'E4', 'F#4'], // G major (1 sharp: F#)
  Ab: ['G#4', 'A#4', 'C4', 'C#4', 'D#4', 'F4', 'G4'], // Ab major (audio equivalents)
  A: ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4'], // A major (3 sharps: F#, C#, G#)
  Bb: ['A#4', 'C4', 'D4', 'D#4', 'F4', 'G4', 'A4'], // Bb major (audio equivalents)
  B: ['B4', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A#4'], // B major (5 sharps: F#, C#, G#, D#, A#)
};

// Get the seven diatonic notes for a given major key (for audio playback)
export const getDiatonicNotes = (key: string): string[] => {
  return audioKeyScaleNotes[key] || audioKeyScaleNotes['C'];
};

// Complete chromatic note mapping for each key context
// Flat keys use flat notation, sharp keys use sharp notation
const chromaticNoteMapping: { [key: string]: { [note: string]: string } } = {
  // Sharp keys (use sharps)
  G: {
    C4: 'C',
    'C#4': 'C#',
    D4: 'D',
    'D#4': 'D#',
    E4: 'E',
    F4: 'F',
    'F#4': 'F#',
    G4: 'G',
    'G#4': 'G#',
    A4: 'A',
    'A#4': 'A#',
    B4: 'B',
  },
  D: {
    C4: 'C',
    'C#4': 'C#',
    D4: 'D',
    'D#4': 'D#',
    E4: 'E',
    F4: 'F',
    'F#4': 'F#',
    G4: 'G',
    'G#4': 'G#',
    A4: 'A',
    'A#4': 'A#',
    B4: 'B',
  },
  A: {
    C4: 'C',
    'C#4': 'C#',
    D4: 'D',
    'D#4': 'D#',
    E4: 'E',
    F4: 'F',
    'F#4': 'F#',
    G4: 'G',
    'G#4': 'G#',
    A4: 'A',
    'A#4': 'A#',
    B4: 'B',
  },
  E: {
    C4: 'C',
    'C#4': 'C#',
    D4: 'D',
    'D#4': 'D#',
    E4: 'E',
    F4: 'F',
    'F#4': 'F#',
    G4: 'G',
    'G#4': 'G#',
    A4: 'A',
    'A#4': 'A#',
    B4: 'B',
  },
  B: {
    C4: 'C',
    'C#4': 'C#',
    D4: 'D',
    'D#4': 'D#',
    E4: 'E',
    F4: 'F',
    'F#4': 'F#',
    G4: 'G',
    'G#4': 'G#',
    A4: 'A',
    'A#4': 'A#',
    B4: 'B',
  },

  // Flat keys (use flats)
  F: {
    C4: 'C',
    'C#4': 'Db',
    D4: 'D',
    'D#4': 'Eb',
    E4: 'E',
    F4: 'F',
    'F#4': 'Gb',
    G4: 'G',
    'G#4': 'Ab',
    A4: 'A',
    'A#4': 'Bb',
    B4: 'B',
  },
  Bb: {
    C4: 'C',
    'C#4': 'Db',
    D4: 'D',
    'D#4': 'Eb',
    E4: 'E',
    F4: 'F',
    'F#4': 'Gb',
    G4: 'G',
    'G#4': 'Ab',
    A4: 'A',
    'A#4': 'Bb',
    B4: 'B',
  },
  Eb: {
    C4: 'C',
    'C#4': 'Db',
    D4: 'D',
    'D#4': 'Eb',
    E4: 'E',
    F4: 'F',
    'F#4': 'Gb',
    G4: 'G',
    'G#4': 'Ab',
    A4: 'A',
    'A#4': 'Bb',
    B4: 'B',
  },
  Ab: {
    C4: 'C',
    'C#4': 'Db',
    D4: 'D',
    'D#4': 'Eb',
    E4: 'E',
    F4: 'F',
    'F#4': 'Gb',
    G4: 'G',
    'G#4': 'Ab',
    A4: 'A',
    'A#4': 'Bb',
    B4: 'B',
  },
  Db: {
    C4: 'C',
    'C#4': 'Db',
    D4: 'D',
    'D#4': 'Eb',
    E4: 'E',
    F4: 'F',
    'F#4': 'Gb',
    G4: 'G',
    'G#4': 'Ab',
    A4: 'A',
    'A#4': 'Bb',
    B4: 'B',
  },
  Gb: {
    C4: 'C',
    'C#4': 'Db',
    D4: 'D',
    'D#4': 'Eb',
    E4: 'E',
    F4: 'F',
    'F#4': 'Gb',
    G4: 'G',
    'G#4': 'Ab',
    A4: 'A',
    'A#4': 'Bb',
    B4: 'B',
  },

  // C major (neutral - use natural note names)
  C: {
    C4: 'C',
    'C#4': 'C#',
    D4: 'D',
    'D#4': 'D#',
    E4: 'E',
    F4: 'F',
    'F#4': 'F#',
    G4: 'G',
    'G#4': 'G#',
    A4: 'A',
    'A#4': 'A#',
    B4: 'B',
  },
};

// Get the correct display name for a note in a given key context
export const getNoteDisplayName = (note: string, key: string): string => {
  const keyMapping = chromaticNoteMapping[key];
  if (!keyMapping) {
    // Fallback: remove octave number and return note name
    return note.replace(/\d+$/, '');
  }

  // Normalize note to octave 4 for lookup (mapping only has octave 4)
  const normalizedNote = note.replace(/\d+$/, '4');

  if (keyMapping[normalizedNote]) {
    return keyMapping[normalizedNote];
  }

  // Fallback: remove octave number and return note name
  return note.replace(/\d+$/, '');
};
