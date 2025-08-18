import { ChordProgression } from '../types';
import { getSemitonesFromC, transposeNote } from './keyCenters';

// Base progressions in C major
const baseProgressions: { [key: string]: ChordProgression } = {
  'I-IV-V-I': {
    name: 'I-IV-V-I',
    description: 'Classic major progression',
    chords: [
      { name: 'C Major (I)', notes: ['C4', 'E4', 'G4'], roman: 'I' },
      { name: 'F Major (IV)', notes: ['F4', 'A4', 'C5'], roman: 'IV' },
      { name: 'G Major (V)', notes: ['G4', 'B4', 'D5'], roman: 'V' },
      { name: 'C Major (I)', notes: ['C4', 'E4', 'G4'], roman: 'I' },
    ],
  },
  'ii-V-I': {
    name: 'ii-V-I',
    description: 'Jazz turnaround progression',
    chords: [
      { name: 'D minor (ii)', notes: ['D4', 'F4', 'A4'], roman: 'ii' },
      { name: 'G Major (V)', notes: ['G4', 'B4', 'D5'], roman: 'V' },
      { name: 'C Major (I)', notes: ['C4', 'E4', 'G4'], roman: 'I' },
    ],
  },
  'V-I': {
    name: 'V-I',
    description: 'Simple cadence',
    chords: [
      { name: 'G Major (V)', notes: ['G4', 'B4', 'D5'], roman: 'V' },
      { name: 'C Major (I)', notes: ['C4', 'E4', 'G4'], roman: 'I' },
    ],
  },
  'iii-vi-ii-V-I': {
    name: 'iii-vi-ii-V-I',
    description: 'Extended jazz progression',
    chords: [
      { name: 'E minor (iii)', notes: ['E4', 'G4', 'B4'], roman: 'iii' },
      { name: 'A minor (vi)', notes: ['A4', 'C5', 'E5'], roman: 'vi' },
      { name: 'D minor (ii)', notes: ['D4', 'F4', 'A4'], roman: 'ii' },
      { name: 'G Major (V)', notes: ['G4', 'B4', 'D5'], roman: 'V' },
      { name: 'C Major (I)', notes: ['C4', 'E4', 'G4'], roman: 'I' },
    ],
  },
};

// Function to get chord name in a specific key
const getChordNameInKey = (originalName: string, key: string): string => {
  if (key === 'C') return originalName;

  // Extract the base chord info and transpose
  const chordMap: { [key: string]: string } = {
    C: key,
    D: transposeNote('D4', getSemitonesFromC(key)).replace('4', ''),
    E: transposeNote('E4', getSemitonesFromC(key)).replace('4', ''),
    F: transposeNote('F4', getSemitonesFromC(key)).replace('4', ''),
    G: transposeNote('G4', getSemitonesFromC(key)).replace('4', ''),
    A: transposeNote('A4', getSemitonesFromC(key)).replace('4', ''),
    B: transposeNote('B4', getSemitonesFromC(key)).replace('4', ''),
  };

  let newName = originalName;
  for (const [oldNote, newNote] of Object.entries(chordMap)) {
    newName = newName.replace(new RegExp(oldNote, 'g'), newNote);
  }

  return newName;
};

// Function to transpose a chord progression to a specific key
export const transposeProgression = (
  progressionKey: string,
  targetKey: string
): ChordProgression => {
  const baseProgression = baseProgressions[progressionKey];
  if (!baseProgression)
    throw new Error(`Unknown progression: ${progressionKey}`);

  const semitones = getSemitonesFromC(targetKey);

  return {
    ...baseProgression,
    chords: baseProgression.chords.map(chord => ({
      ...chord,
      name: getChordNameInKey(chord.name, targetKey),
      notes: chord.notes.map(note => transposeNote(note, semitones)),
    })),
  };
};

export const getAvailableProgressions = (): string[] => {
  return Object.keys(baseProgressions);
};

export { baseProgressions };
