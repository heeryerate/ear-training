import { getNoteDisplayName, keyCenters, transposeNote } from './keyCenters';

export type ChordType =
  | 'major'
  | 'minor'
  | 'dominant-7th'
  | 'major-7th'
  | 'minor-7th'
  | 'diminished'
  | 'augmented'
  | 'sus2'
  | 'sus4'
  | 'diminished-7th'
  | 'half-diminished-7th'
  | 'augmented-7th'
  | 'minor-major-7th'
  | 'dominant-9th'
  | 'major-9th'
  | 'minor-9th'
  | 'major-6th'
  | 'major-6-9'
  | 'minor-6th'
  | 'dominant-13th'
  | 'dominant-7-sharp11'
  | 'half-diminished-flat9'
  | 'dominant-7-flat9'
  | 'dominant-7-sharp9'
  | 'dominant-7-flat5'
  | 'dominant-7-sharp5'
  | 'minor-11th'
  | 'major-11th'
  | 'minor-13th'
  | 'major-13th'
  | 'dominant-7-flat9-sharp11'
  | 'augmented-major-7th';

export interface Chord {
  name: string;
  type: ChordType;
  notes: string[];
}

// Get chord notes for a given key and chord type
// Intervals are in semitones from the root
const getMajorChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Major: 1, 3, 5 (0, 4, 7 semitones)
  return [0, 4, 7].map(interval => transposeNote(tonic, interval));
};

const getMinorChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Minor: 1, b3, 5 (0, 3, 7 semitones)
  return [0, 3, 7].map(interval => transposeNote(tonic, interval));
};

const getDominant7thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 7th: 1, 3, 5, b7 (0, 4, 7, 10 semitones)
  return [0, 4, 7, 10].map(interval => transposeNote(tonic, interval));
};

const getMajor7thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Major 7th: 1, 3, 5, 7 (0, 4, 7, 11 semitones)
  return [0, 4, 7, 11].map(interval => transposeNote(tonic, interval));
};

const getMinor7thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Minor 7th: 1, b3, 5, b7 (0, 3, 7, 10 semitones)
  return [0, 3, 7, 10].map(interval => transposeNote(tonic, interval));
};

const getDiminishedChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Diminished: 1, b3, b5 (0, 3, 6 semitones)
  return [0, 3, 6].map(interval => transposeNote(tonic, interval));
};

const getAugmentedChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Augmented: 1, 3, #5 (0, 4, 8 semitones)
  return [0, 4, 8].map(interval => transposeNote(tonic, interval));
};

const getSus2ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Sus2: 1, 2, 5 (0, 2, 7 semitones)
  return [0, 2, 7].map(interval => transposeNote(tonic, interval));
};

const getSus4ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Sus4: 1, 4, 5 (0, 5, 7 semitones)
  return [0, 5, 7].map(interval => transposeNote(tonic, interval));
};

const getDiminished7thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Diminished 7th: 1, b3, b5, bb7 (0, 3, 6, 9 semitones)
  return [0, 3, 6, 9].map(interval => transposeNote(tonic, interval));
};

const getHalfDiminished7thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Half-diminished 7th: 1, b3, b5, b7 (0, 3, 6, 10 semitones)
  return [0, 3, 6, 10].map(interval => transposeNote(tonic, interval));
};

const getAugmented7thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Augmented 7th: 1, 3, #5, b7 (0, 4, 8, 10 semitones)
  return [0, 4, 8, 10].map(interval => transposeNote(tonic, interval));
};

const getMinorMajor7thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Minor Major 7th: 1, b3, 5, 7 (0, 3, 7, 11 semitones)
  return [0, 3, 7, 11].map(interval => transposeNote(tonic, interval));
};

const getDominant9thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 9th: 1, 3, 5, b7, 9 (0, 4, 7, 10, 14 semitones)
  return [0, 4, 7, 10, 14].map(interval => transposeNote(tonic, interval));
};

const getMajor9thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Major 9th: 1, 3, 5, 7, 9 (0, 4, 7, 11, 14 semitones)
  return [0, 4, 7, 11, 14].map(interval => transposeNote(tonic, interval));
};

const getMinor9thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Minor 9th: 1, b3, 5, b7, 9 (0, 3, 7, 10, 14 semitones)
  return [0, 3, 7, 10, 14].map(interval => transposeNote(tonic, interval));
};

const getMajor6thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Major 6th: 1, 3, 5, 6 (0, 4, 7, 9 semitones)
  return [0, 4, 7, 9].map(interval => transposeNote(tonic, interval));
};

const getMajor6_9ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Major 6/9: 1, 3, 5, 6, 9 (0, 4, 7, 9, 14 semitones)
  return [0, 4, 7, 9, 14].map(interval => transposeNote(tonic, interval));
};

const getMinor6thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Minor 6th: 1, b3, 5, 6 (0, 3, 7, 9 semitones)
  return [0, 3, 7, 9].map(interval => transposeNote(tonic, interval));
};

const getDominant13thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 13th: 1, 3, 5, b7, 9, 13 (0, 4, 7, 10, 14, 21 semitones)
  return [0, 4, 7, 10, 14, 21].map(interval => transposeNote(tonic, interval));
};

const getDominant7Sharp11ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 7#11: 1, 3, 5, b7, #11 (0, 4, 7, 10, 18 semitones)
  return [0, 4, 7, 10, 18].map(interval => transposeNote(tonic, interval));
};

const getHalfDiminishedFlat9ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Half-diminished ♭9: 1, b3, b5, b7, b9 (0, 3, 6, 10, 13 semitones)
  return [0, 3, 6, 10, 13].map(interval => transposeNote(tonic, interval));
};

const getDominant7Flat9ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 7♭9: 1, 3, 5, b7, b9 (0, 4, 7, 10, 13 semitones)
  return [0, 4, 7, 10, 13].map(interval => transposeNote(tonic, interval));
};

const getDominant7Sharp9ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 7♯9: 1, 3, 5, b7, #9 (0, 4, 7, 10, 15 semitones)
  return [0, 4, 7, 10, 15].map(interval => transposeNote(tonic, interval));
};

const getDominant7Flat5ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 7♭5: 1, 3, b5, b7 (0, 4, 6, 10 semitones)
  return [0, 4, 6, 10].map(interval => transposeNote(tonic, interval));
};

const getDominant7Sharp5ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 7♯5: 1, 3, #5, b7 (0, 4, 8, 10 semitones)
  return [0, 4, 8, 10].map(interval => transposeNote(tonic, interval));
};

const getMinor11thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Minor 11th: 1, b3, 5, b7, 9, 11 (0, 3, 7, 10, 14, 17 semitones)
  return [0, 3, 7, 10, 14, 17].map(interval => transposeNote(tonic, interval));
};

const getMajor11thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Major 11th: 1, 3, 5, 7, 9, 11 (0, 4, 7, 11, 14, 17 semitones)
  return [0, 4, 7, 11, 14, 17].map(interval => transposeNote(tonic, interval));
};

const getMinor13thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Minor 13th: 1, b3, 5, b7, 9, 13 (0, 3, 7, 10, 14, 21 semitones)
  return [0, 3, 7, 10, 14, 21].map(interval => transposeNote(tonic, interval));
};

const getMajor13thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Major 13th: 1, 3, 5, 7, 9, 13 (0, 4, 7, 11, 14, 21 semitones)
  return [0, 4, 7, 11, 14, 21].map(interval => transposeNote(tonic, interval));
};

const getDominant7Flat9Sharp11ChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Dominant 7♭9♯11: 1, 3, 5, b7, b9, #11 (0, 4, 7, 10, 13, 18 semitones)
  return [0, 4, 7, 10, 13, 18].map(interval => transposeNote(tonic, interval));
};

const getAugmentedMajor7thChordNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return [];

  const tonic = keyCenter.tonic;
  // Augmented Major 7th: 1, 3, #5, 7 (0, 4, 8, 11 semitones)
  return [0, 4, 8, 11].map(interval => transposeNote(tonic, interval));
};

// Get chord notes for a given key and chord type
export const getChordNotes = (key: string, chordType: ChordType): string[] => {
  switch (chordType) {
    case 'major':
      return getMajorChordNotes(key);
    case 'minor':
      return getMinorChordNotes(key);
    case 'dominant-7th':
      return getDominant7thChordNotes(key);
    case 'major-7th':
      return getMajor7thChordNotes(key);
    case 'minor-7th':
      return getMinor7thChordNotes(key);
    case 'diminished':
      return getDiminishedChordNotes(key);
    case 'augmented':
      return getAugmentedChordNotes(key);
    case 'sus2':
      return getSus2ChordNotes(key);
    case 'sus4':
      return getSus4ChordNotes(key);
    case 'diminished-7th':
      return getDiminished7thChordNotes(key);
    case 'half-diminished-7th':
      return getHalfDiminished7thChordNotes(key);
    case 'augmented-7th':
      return getAugmented7thChordNotes(key);
    case 'minor-major-7th':
      return getMinorMajor7thChordNotes(key);
    case 'dominant-9th':
      return getDominant9thChordNotes(key);
    case 'major-9th':
      return getMajor9thChordNotes(key);
    case 'minor-9th':
      return getMinor9thChordNotes(key);
    case 'major-6th':
      return getMajor6thChordNotes(key);
    case 'major-6-9':
      return getMajor6_9ChordNotes(key);
    case 'minor-6th':
      return getMinor6thChordNotes(key);
    case 'dominant-13th':
      return getDominant13thChordNotes(key);
    case 'dominant-7-sharp11':
      return getDominant7Sharp11ChordNotes(key);
    case 'half-diminished-flat9':
      return getHalfDiminishedFlat9ChordNotes(key);
    case 'dominant-7-flat9':
      return getDominant7Flat9ChordNotes(key);
    case 'dominant-7-sharp9':
      return getDominant7Sharp9ChordNotes(key);
    case 'dominant-7-flat5':
      return getDominant7Flat5ChordNotes(key);
    case 'dominant-7-sharp5':
      return getDominant7Sharp5ChordNotes(key);
    case 'minor-11th':
      return getMinor11thChordNotes(key);
    case 'major-11th':
      return getMajor11thChordNotes(key);
    case 'minor-13th':
      return getMinor13thChordNotes(key);
    case 'major-13th':
      return getMajor13thChordNotes(key);
    case 'dominant-7-flat9-sharp11':
      return getDominant7Flat9Sharp11ChordNotes(key);
    case 'augmented-major-7th':
      return getAugmentedMajor7thChordNotes(key);
    default:
      return getMajorChordNotes(key);
  }
};

// Get chord name for display
export const getChordName = (key: string, chordType: ChordType): string => {
  const chordTypeNames: { [key in ChordType]: string } = {
    major: 'Major',
    minor: 'Minor',
    'dominant-7th': 'Dominant 7th',
    'major-7th': 'Major 7th',
    'minor-7th': 'Minor 7th',
    diminished: 'Diminished',
    augmented: 'Augmented',
    sus2: 'Sus2',
    sus4: 'Sus4',
    'diminished-7th': 'Diminished 7th',
    'half-diminished-7th': 'Half-diminished 7th',
    'augmented-7th': 'Augmented 7th',
    'minor-major-7th': 'Minor Major 7th',
    'dominant-9th': 'Dominant 9th',
    'major-9th': 'Major 9th',
    'minor-9th': 'Minor 9th',
    'major-6th': 'Major 6th',
    'major-6-9': 'Major 6/9',
    'minor-6th': 'Minor 6th',
    'dominant-13th': 'Dominant 13th',
    'dominant-7-sharp11': 'Dominant 7#11',
    'half-diminished-flat9': 'Half-diminished ♭9',
    'dominant-7-flat9': 'Dominant 7♭9',
    'dominant-7-sharp9': 'Dominant 7♯9',
    'dominant-7-flat5': 'Dominant 7♭5',
    'dominant-7-sharp5': 'Dominant 7♯5',
    'minor-11th': 'Minor 11th',
    'major-11th': 'Major 11th',
    'minor-13th': 'Minor 13th',
    'major-13th': 'Major 13th',
    'dominant-7-flat9-sharp11': 'Dominant 7♭9♯11',
    'augmented-major-7th': 'Augmented Major 7th',
  };

  return `${key} ${chordTypeNames[chordType]}`;
};

// Get display name for chord type
export const getChordDisplayName = (chordType: ChordType): string => {
  const chordTypeNames: { [key in ChordType]: string } = {
    major: 'Major',
    minor: 'Minor',
    'dominant-7th': 'Dominant 7th',
    'major-7th': 'Major 7th',
    'minor-7th': 'Minor 7th',
    diminished: 'Diminished',
    augmented: 'Augmented',
    sus2: 'Sus2',
    sus4: 'Sus4',
    'diminished-7th': 'Diminished 7th',
    'half-diminished-7th': 'Half-diminished 7th',
    'augmented-7th': 'Augmented 7th',
    'minor-major-7th': 'Minor Major 7th',
    'dominant-9th': 'Dominant 9th',
    'major-9th': 'Major 9th',
    'minor-9th': 'Minor 9th',
    'major-6th': 'Major 6th',
    'major-6-9': 'Major 6/9',
    'minor-6th': 'Minor 6th',
    'dominant-13th': 'Dominant 13th',
    'dominant-7-sharp11': 'Dominant 7#11',
    'half-diminished-flat9': 'Half-diminished ♭9',
    'dominant-7-flat9': 'Dominant 7♭9',
    'dominant-7-sharp9': 'Dominant 7♯9',
    'dominant-7-flat5': 'Dominant 7♭5',
    'dominant-7-sharp5': 'Dominant 7♯5',
    'minor-11th': 'Minor 11th',
    'major-11th': 'Major 11th',
    'minor-13th': 'Minor 13th',
    'major-13th': 'Major 13th',
    'dominant-7-flat9-sharp11': 'Dominant 7♭9♯11',
    'augmented-major-7th': 'Augmented Major 7th',
  };

  return chordTypeNames[chordType];
};

// Chord category type
export type ChordCategory =
  | 'major-family'
  | 'minor-family'
  | 'dominant-family'
  | 'diminished-family';

// Get chord category based on intervals
export const getChordCategory = (chordType: ChordType): ChordCategory => {
  // Major-family: Major, Major 7th, Major 6th, Major 9th, Major 6/9,
  // Major 11th, Major 13th, Augmented Major 7th
  const majorFamilyChords: ChordType[] = [
    'major',
    'major-7th',
    'major-6th',
    'major-9th',
    'major-6-9',
    'major-11th',
    'major-13th',
    'augmented-major-7th',
  ];

  // Minor-family: Minor, Minor 7th, Minor 6th, Minor 9th, Minor Major 7th,
  // Minor 11th, Minor 13th
  const minorFamilyChords: ChordType[] = [
    'minor',
    'minor-7th',
    'minor-6th',
    'minor-9th',
    'minor-major-7th',
    'minor-11th',
    'minor-13th',
  ];

  // Dominant-family: Dominant 7th, Dominant 9th, Dominant 13th, Dominant 7#11,
  // Sus4, Sus2, Augmented, Augmented 7th, Dominant 7♭9, Dominant 7♯9,
  // Dominant 7♭5, Dominant 7♯5, Dominant 7♭9♯11
  const dominantFamilyChords: ChordType[] = [
    'dominant-7th',
    'dominant-9th',
    'dominant-13th',
    'dominant-7-sharp11',
    'sus4',
    'sus2',
    'augmented',
    'augmented-7th',
    'dominant-7-flat9',
    'dominant-7-sharp9',
    'dominant-7-flat5',
    'dominant-7-sharp5',
    'dominant-7-flat9-sharp11',
  ];

  // Diminished / Half-diminished family: Diminished, Diminished 7th,
  // Half-diminished 7th, Half-diminished ♭9
  const diminishedFamilyChords: ChordType[] = [
    'diminished',
    'diminished-7th',
    'half-diminished-7th',
    'half-diminished-flat9',
  ];

  if (majorFamilyChords.includes(chordType)) return 'major-family';
  if (minorFamilyChords.includes(chordType)) return 'minor-family';
  if (dominantFamilyChords.includes(chordType)) return 'dominant-family';
  if (diminishedFamilyChords.includes(chordType)) return 'diminished-family';
  return 'major-family'; // Default fallback
};

// Get all available chord types grouped by category
export const getChordTypesByCategory = (): Record<
  ChordCategory,
  ChordType[]
> => {
  const allTypes = getAvailableChordTypes();
  const grouped: Record<ChordCategory, ChordType[]> = {
    'major-family': [],
    'minor-family': [],
    'dominant-family': [],
    'diminished-family': [],
  };

  allTypes.forEach(chordType => {
    const category = getChordCategory(chordType);
    grouped[category].push(chordType);
  });

  return grouped;
};

// Difficulty levels for chord selection
export type DifficultyLevel = 'entry' | 'intermediate' | 'professional';

// Get chord types by difficulty level
export const getChordTypesByDifficulty = (
  difficulty: DifficultyLevel
): ChordType[] => {
  const entryChords: ChordType[] = [
    'major',
    'minor',
    'dominant-7th',
    'major-7th',
    'minor-7th',
  ];

  const intermediateChords: ChordType[] = [
    ...entryChords,
    'diminished',
    'augmented',
    'sus2',
    'sus4',
    'diminished-7th',
    'half-diminished-7th',
    'augmented-7th',
    'minor-major-7th',
    'dominant-9th',
    'major-9th',
    'minor-9th',
    'major-6th',
    'major-6-9',
    'minor-6th',
  ];

  const professionalChords: ChordType[] = [
    ...intermediateChords,
    'dominant-13th',
    'dominant-7-sharp11',
    'half-diminished-flat9',
    'dominant-7-flat9',
    'dominant-7-sharp9',
    'dominant-7-flat5',
    'dominant-7-sharp5',
    'minor-11th',
    'major-11th',
    'minor-13th',
    'major-13th',
    'dominant-7-flat9-sharp11',
    'augmented-major-7th',
  ];

  switch (difficulty) {
    case 'entry':
      return entryChords;
    case 'intermediate':
      return intermediateChords;
    case 'professional':
      return professionalChords;
    default:
      return professionalChords;
  }
};

// Get all available chord types
export const getAvailableChordTypes = (): ChordType[] => {
  return [
    'major',
    'minor',
    'dominant-7th',
    'major-7th',
    'minor-7th',
    'diminished',
    'augmented',
    'sus2',
    'sus4',
    'diminished-7th',
    'half-diminished-7th',
    'augmented-7th',
    'minor-major-7th',
    'dominant-9th',
    'major-9th',
    'minor-9th',
    'major-6th',
    'major-6-9',
    'minor-6th',
    'dominant-13th',
    'dominant-7-sharp11',
    'half-diminished-flat9',
    'dominant-7-flat9',
    'dominant-7-sharp9',
    'dominant-7-flat5',
    'dominant-7-sharp5',
    'minor-11th',
    'major-11th',
    'minor-13th',
    'major-13th',
    'dominant-7-flat9-sharp11',
    'augmented-major-7th',
  ];
};

// Get category display name
export const getCategoryDisplayName = (category: ChordCategory): string => {
  const names: Record<ChordCategory, string> = {
    'major-family': 'Major-family',
    'minor-family': 'Minor-family',
    'dominant-family': 'Dominant-family',
    'diminished-family': 'Diminished / Half-diminished family',
  };
  return names[category];
};

// Get chord note display names (with proper enharmonic spelling)
export const getChordNoteDisplayNames = (
  key: string,
  chordType: ChordType
): string[] => {
  const notes = getChordNotes(key, chordType);
  // Use the key context for proper enharmonic spelling
  return notes.map(note => getNoteDisplayName(note, key));
};

// Get chord notes for audio playback (matching display spelling)
// For now, we'll use the same notes as display since chords don't have
// the same enharmonic complexity as scales
export const getChordNotesForAudio = (
  key: string,
  chordType: ChordType
): string[] => {
  return getChordNotes(key, chordType);
};
