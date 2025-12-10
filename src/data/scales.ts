import { DifficultyLevel } from './chords';
import {
  getDiatonicNotes,
  getNoteDisplayName,
  getSemitonesFromC,
  keyCenters,
  transposeNote,
} from './keyCenters';

export type ScaleType =
  | 'major' // Ionian
  | 'minor' // Aeolian
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian'
  | 'pentatonic-major'
  | 'pentatonic-minor'
  | 'major-blues'
  | 'minor-blues'
  | 'major-bebop'
  | 'dominant-bebop'
  | 'diminished'
  | 'whole-tone'
  | 'altered'
  | 'harmonic-minor'
  | 'melodic-minor'
  | 'lydian-dominant'
  | 'mixolydian-flat6'
  | 'lydian-augmented'
  | 'half-whole-diminished'
  | 'whole-half-diminished'
  | 'blues-scale'
  | 'neapolitan-minor'
  | 'neapolitan-major'
  | 'double-harmonic-major'
  | 'hungarian-minor';

export interface Scale {
  name: string;
  type: ScaleType;
  notes: string[];
}

// Minor scale pattern: W-H-W-W-H-W-W (whole, half, whole, whole, half, whole, whole)
// Natural minor scale intervals from tonic: 0, 2, 3, 5, 7, 8, 10 semitones
const getNaturalMinorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');

  const tonic = keyCenter.tonic;
  const minorIntervals = [0, 2, 3, 5, 7, 8, 10]; // Semitones from tonic

  return minorIntervals.map(interval => transposeNote(tonic, interval));
};

// Mode scales (Dorian, Phrygian, Lydian, Mixolydian, Locrian)
const getDorianNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 3, 5, 7, 9, 10]; // Dorian mode
  return intervals.map(interval => transposeNote(tonic, interval));
};

const getPhrygianNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 1, 3, 5, 7, 8, 10]; // Phrygian mode
  return intervals.map(interval => transposeNote(tonic, interval));
};

const getLydianNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 6, 7, 9, 11]; // Lydian mode
  return intervals.map(interval => transposeNote(tonic, interval));
};

const getMixolydianNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 5, 7, 9, 10]; // Mixolydian mode
  return intervals.map(interval => transposeNote(tonic, interval));
};

const getLocrianNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 1, 3, 5, 6, 8, 10]; // Locrian mode
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Lydian Dominant (4th mode of melodic minor): intervals [0, 2, 4, 6, 7, 9, 10]
const getLydianDominantNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 6, 7, 9, 10]; // Lydian Dominant
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Mixolydian ♭6 (5th mode of melodic minor): intervals [0, 2, 4, 5, 7, 8, 10]
const getMixolydianFlat6Notes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 5, 7, 8, 10]; // Mixolydian ♭6
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Lydian Augmented (3rd mode of melodic minor): intervals [0, 2, 4, 6, 8, 9, 11]
const getLydianAugmentedNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 6, 8, 9, 11]; // Lydian Augmented
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Half-Whole Diminished (octatonic): intervals [0, 1, 3, 4, 6, 7, 9, 10]
const getHalfWholeDiminishedNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 1, 3, 4, 6, 7, 9, 10]; // Half-Whole Diminished
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Whole-Half Diminished (octatonic): intervals [0, 2, 3, 5, 6, 8, 9, 11]
const getWholeHalfDiminishedNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 3, 5, 6, 8, 9, 11]; // Whole-Half Diminished
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Blues Scale (classic 6-note): intervals [0, 3, 5, 6, 7, 10]
const getBluesScaleNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 3, 5, 6, 7, 10]; // Blues Scale
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Neapolitan Minor: intervals [0, 1, 3, 5, 7, 8, 11]
const getNeapolitanMinorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 1, 3, 5, 7, 8, 11]; // Neapolitan Minor
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Neapolitan Major: intervals [0, 1, 3, 5, 7, 9, 11]
const getNeapolitanMajorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 1, 3, 5, 7, 9, 11]; // Neapolitan Major
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Double Harmonic Major (Byzantine): intervals [0, 1, 4, 5, 7, 8, 11]
const getDoubleHarmonicMajorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 1, 4, 5, 7, 8, 11]; // Double Harmonic Major
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Hungarian Minor: intervals [0, 2, 3, 6, 7, 8, 11]
const getHungarianMinorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 3, 6, 7, 8, 11]; // Hungarian Minor
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Pentatonic scales
const getPentatonicMajorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 7, 9]; // Pentatonic Major
  return intervals.map(interval => transposeNote(tonic, interval));
};

const getPentatonicMinorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 3, 5, 7, 10]; // Pentatonic Minor
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Blues scales
const getMajorBluesNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 3, 4, 7, 9]; // Major Blues
  return intervals.map(interval => transposeNote(tonic, interval));
};

const getMinorBluesNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 3, 5, 6, 7, 10]; // Minor Blues
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Bebop scales
const getMajorBebopNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 5, 7, 8, 9, 11]; // Major Bebop (8 notes)
  return intervals.map(interval => transposeNote(tonic, interval));
};

const getDominantBebopNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 5, 7, 9, 10, 11]; // Dominant Bebop (8 notes)
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Diminished and Whole Tone scales
const getDiminishedNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 3, 5, 6, 8, 9, 11]; // Diminished (whole-half) (8 notes)
  return intervals.map(interval => transposeNote(tonic, interval));
};

const getWholeToneNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 2, 4, 6, 8, 10]; // Whole Tone (6 notes)
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Altered scale
const getAlteredNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');
  const tonic = keyCenter.tonic;
  const intervals = [0, 1, 3, 4, 6, 8, 10]; // Altered scale (super Locrian)
  return intervals.map(interval => transposeNote(tonic, interval));
};

// Harmonic minor scale: natural minor with raised 7th
// Intervals: 0, 2, 3, 5, 7, 8, 11 semitones
const getHarmonicMinorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');

  const tonic = keyCenter.tonic;
  const harmonicMinorIntervals = [0, 2, 3, 5, 7, 8, 11]; // Semitones from tonic

  return harmonicMinorIntervals.map(interval => transposeNote(tonic, interval));
};

// Melodic minor scale: natural minor with raised 6th and 7th ascending
// For now, using ascending form: 0, 2, 3, 5, 7, 9, 11 semitones
const getMelodicMinorNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');

  const tonic = keyCenter.tonic;
  const melodicMinorIntervals = [0, 2, 3, 5, 7, 9, 11]; // Semitones from tonic

  return melodicMinorIntervals.map(interval => transposeNote(tonic, interval));
};

// Get major scale notes (calculated from intervals to ensure proper octave)
const getMajorScaleNotes = (key: string): string[] => {
  const keyCenter = keyCenters.find(k => k.key === key);
  if (!keyCenter) return getDiatonicNotes('C');

  const tonic = keyCenter.tonic;
  // Major scale intervals: 0, 2, 4, 5, 7, 9, 11 semitones from root
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];

  return majorIntervals.map(interval => transposeNote(tonic, interval));
};

// Get scale notes for a given key and scale type
export const getScaleNotes = (key: string, scaleType: ScaleType): string[] => {
  switch (scaleType) {
    case 'major':
      return getMajorScaleNotes(key);
    case 'minor':
      return getNaturalMinorNotes(key);
    case 'dorian':
      return getDorianNotes(key);
    case 'phrygian':
      return getPhrygianNotes(key);
    case 'lydian':
      return getLydianNotes(key);
    case 'mixolydian':
      return getMixolydianNotes(key);
    case 'locrian':
      return getLocrianNotes(key);
    case 'pentatonic-major':
      return getPentatonicMajorNotes(key);
    case 'pentatonic-minor':
      return getPentatonicMinorNotes(key);
    case 'major-blues':
      return getMajorBluesNotes(key);
    case 'minor-blues':
      return getMinorBluesNotes(key);
    case 'major-bebop':
      return getMajorBebopNotes(key);
    case 'dominant-bebop':
      return getDominantBebopNotes(key);
    case 'diminished':
      return getDiminishedNotes(key);
    case 'whole-tone':
      return getWholeToneNotes(key);
    case 'altered':
      return getAlteredNotes(key);
    case 'harmonic-minor':
      return getHarmonicMinorNotes(key);
    case 'melodic-minor':
      return getMelodicMinorNotes(key);
    case 'lydian-dominant':
      return getLydianDominantNotes(key);
    case 'mixolydian-flat6':
      return getMixolydianFlat6Notes(key);
    case 'lydian-augmented':
      return getLydianAugmentedNotes(key);
    case 'half-whole-diminished':
      return getHalfWholeDiminishedNotes(key);
    case 'whole-half-diminished':
      return getWholeHalfDiminishedNotes(key);
    case 'blues-scale':
      return getBluesScaleNotes(key);
    case 'neapolitan-minor':
      return getNeapolitanMinorNotes(key);
    case 'neapolitan-major':
      return getNeapolitanMajorNotes(key);
    case 'double-harmonic-major':
      return getDoubleHarmonicMajorNotes(key);
    case 'hungarian-minor':
      return getHungarianMinorNotes(key);
    default:
      return getMajorScaleNotes(key);
  }
};

// Get the appropriate key context for enharmonic spelling
// For flat-preference scales, use a flat key if the current key is sharp
const getKeyContextForScale = (key: string, scaleType: ScaleType): string => {
  // Scales that should use flats for proper spelling
  // These scales naturally contain flat intervals (b3, b6, b7, etc.)
  const flatPreferenceScales: ScaleType[] = [
    'minor', // Natural minor (Aeolian) - has b3, b6, b7
    'dorian', // Has b3, b7
    'phrygian', // Has b2, b3, b6, b7
    'locrian', // Has b2, b3, b5, b6, b7
    'pentatonic-minor', // Has b3, b7
    'minor-blues', // Has b3, b5, b7
    'harmonic-minor', // Has b3, b6
    'melodic-minor', // Has b3 (ascending form)
    'diminished', // Has b3, b5, b6
    'whole-tone', // Symmetric scale, but flats are more common
    'altered', // Has b2, b3, b5, b6, b7
    'lydian-dominant', // Has b7
    'mixolydian-flat6', // Has b6, b7
  ];

  // If scale doesn't prefer flats, use the actual key
  if (!flatPreferenceScales.includes(scaleType)) {
    return key;
  }

  // For flat-preference scales, determine the appropriate key context
  // Flat keys: F, Bb, Eb, Ab, Db, Gb
  // Sharp keys: G, D, A, E, B
  // C is neutral (uses sharps in mapping but is considered neutral)
  const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
  const sharpKeys = ['G', 'D', 'A', 'E', 'B'];

  // If the key is already a flat key, use it
  if (flatKeys.includes(key)) {
    return key;
  }

  // If the key is C, use F (a flat key) for flat-preference scales
  if (key === 'C') {
    return 'F';
  }

  // For sharp keys with flat-preference scales, use the relative minor's parallel major
  // This ensures proper flat notation
  // G -> Bb, D -> F, A -> C (but C uses F), E -> G (but G uses Bb), B -> D (but D uses F)
  const sharpToFlatKeyMap: { [key: string]: string } = {
    G: 'Bb', // G minor's relative major is Bb
    D: 'F', // D minor's relative major is F
    A: 'F', // A minor's relative major is C, but C uses F for flats
    E: 'Bb', // E minor's relative major is G, but G uses Bb for flats
    B: 'F', // B minor's relative major is D, but D uses F for flats
  };

  return sharpToFlatKeyMap[key] || 'F'; // Default to F if mapping not found
};

// Get proper enharmonic spelling for a note based on scale type
// Some scales prefer flats for proper musical spelling
const getNoteNameForScale = (
  note: string,
  key: string,
  scaleType: ScaleType
): string => {
  // Get the appropriate key context for this scale type
  const keyContext = getKeyContextForScale(key, scaleType);
  return getNoteDisplayName(note, keyContext);
};

// Get scale notes from root to root+1 octave (for display purposes)
export const getScaleNotesWithOctave = (
  key: string,
  scaleType: ScaleType
): string[] => {
  const scaleNotes = getScaleNotes(key, scaleType);
  if (scaleNotes.length === 0) return [];

  // Get the root note (first note of the scale)
  const rootNote = scaleNotes[0];
  // Calculate the octave note (root + 12 semitones)
  const octaveNote = transposeNote(rootNote, 12);

  // Return scale notes plus the octave note
  return [...scaleNotes, octaveNote];
};

// Get scale note display names with proper enharmonic spelling
// Returns only the scale notes (without the octave note)
export const getScaleNoteDisplayNames = (
  key: string,
  scaleType: ScaleType
): string[] => {
  const scaleNotes = getScaleNotes(key, scaleType);
  return scaleNotes.map(note => getNoteNameForScale(note, key, scaleType));
};

// Convert a note to match its display name (for audio playback)
// Maps sharp notes to flat notes when the display uses flats
const convertNoteToDisplaySpelling = (
  note: string,
  displayName: string
): string => {
  // Mapping from sharp to flat notation
  const sharpToFlat: { [key: string]: string } = {
    'A#': 'Bb',
    'D#': 'Eb',
    'G#': 'Ab',
    'C#': 'Db',
    'F#': 'Gb',
  };

  // Extract note name without octave
  const noteName = note.replace(/\d+$/, '');
  const octave = note.match(/\d+$/)?.[0] || '4';

  // If the display name is different from the note name, convert
  // For example: note is "A#4", display is "Bb" -> convert to "Bb4"
  if (noteName !== displayName) {
    // Check if we need to convert from sharp to flat
    if (sharpToFlat[noteName] === displayName) {
      return `${displayName}${octave}`;
    }
    // Check if we need to convert from flat to sharp (less common)
    const flatToSharp: { [key: string]: string } = {
      Bb: 'A#',
      Eb: 'D#',
      Ab: 'G#',
      Db: 'C#',
      Gb: 'F#',
    };
    if (flatToSharp[noteName] === displayName) {
      return `${displayName}${octave}`;
    }
  }

  // Return note with display name if they differ (for natural notes that might have different octaves)
  // Otherwise return original note
  return note;
};

// Get scale notes for audio playback, matching the display spelling
export const getScaleNotesForAudio = (
  key: string,
  scaleType: ScaleType
): string[] => {
  const scaleNotes = getScaleNotes(key, scaleType);
  const displayNames = getScaleNoteDisplayNames(key, scaleType);

  return scaleNotes.map((note, index) =>
    convertNoteToDisplaySpelling(note, displayNames[index])
  );
};

// Get scale name for display
export const getScaleName = (key: string, scaleType: ScaleType): string => {
  const scaleTypeNames: Record<ScaleType, string> = {
    major: 'Major (Ionian)',
    minor: 'Minor (Aeolian)',
    dorian: 'Dorian',
    phrygian: 'Phrygian',
    lydian: 'Lydian',
    mixolydian: 'Mixolydian',
    locrian: 'Locrian',
    'pentatonic-major': 'Pentatonic Major',
    'pentatonic-minor': 'Pentatonic Minor',
    'major-blues': 'Major Blues',
    'minor-blues': 'Minor Blues',
    'major-bebop': 'Major Bebop',
    'dominant-bebop': 'Dominant Bebop',
    diminished: 'Diminished',
    'whole-tone': 'Whole Tone',
    altered: 'Altered',
    'harmonic-minor': 'Harmonic Minor',
    'melodic-minor': 'Melodic Minor',
    'lydian-dominant': 'Lydian Dominant',
    'mixolydian-flat6': 'Mixolydian ♭6',
    'lydian-augmented': 'Lydian Augmented',
    'half-whole-diminished': 'Half-Whole Diminished',
    'whole-half-diminished': 'Whole-Half Diminished',
    'blues-scale': 'Blues Scale',
    'neapolitan-minor': 'Neapolitan Minor',
    'neapolitan-major': 'Neapolitan Major',
    'double-harmonic-major': 'Double Harmonic Major',
    'hungarian-minor': 'Hungarian Minor',
  };
  return `${key} ${scaleTypeNames[scaleType]}`;
};

// Get all available scale types
export const getAvailableScaleTypes = (): ScaleType[] => {
  return [
    'major',
    'minor',
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'locrian',
    'pentatonic-major',
    'pentatonic-minor',
    'major-blues',
    'minor-blues',
    'major-bebop',
    'dominant-bebop',
    'diminished',
    'whole-tone',
    'altered',
    'harmonic-minor',
    'melodic-minor',
    'lydian-dominant',
    'mixolydian-flat6',
    'lydian-augmented',
    'half-whole-diminished',
    'whole-half-diminished',
    'blues-scale',
    'neapolitan-minor',
    'neapolitan-major',
    'double-harmonic-major',
    'hungarian-minor',
  ];
};

// Get scale display name (for selection buttons)
export const getScaleDisplayName = (scaleType: ScaleType): string => {
  const scaleTypeNames: Record<ScaleType, string> = {
    major: 'Major (Ionian)',
    minor: 'Minor (Aeolian)',
    dorian: 'Dorian',
    phrygian: 'Phrygian',
    lydian: 'Lydian',
    mixolydian: 'Mixolydian',
    locrian: 'Locrian',
    'pentatonic-major': 'Pentatonic Major',
    'pentatonic-minor': 'Pentatonic Minor',
    'major-blues': 'Major Blues',
    'minor-blues': 'Minor Blues',
    'major-bebop': 'Major Bebop',
    'dominant-bebop': 'Dominant Bebop',
    diminished: 'Diminished',
    'whole-tone': 'Whole Tone',
    altered: 'Altered',
    'harmonic-minor': 'Harmonic Minor',
    'melodic-minor': 'Melodic Minor',
    'lydian-dominant': 'Lydian Dominant',
    'mixolydian-flat6': 'Mixolydian ♭6',
    'lydian-augmented': 'Lydian Augmented',
    'half-whole-diminished': 'Half-Whole Diminished',
    'whole-half-diminished': 'Whole-Half Diminished',
    'blues-scale': 'Blues Scale',
    'neapolitan-minor': 'Neapolitan Minor',
    'neapolitan-major': 'Neapolitan Major',
    'double-harmonic-major': 'Double Harmonic Major',
    'hungarian-minor': 'Hungarian Minor',
  };
  return scaleTypeNames[scaleType];
};

// Scale category type
export type ScaleCategory =
  | 'tonic-major'
  | 'tonic-minor'
  | 'dominant'
  | 'symmetrical-outside-colors';

// Get scale category based on musical function
export const getScaleCategory = (scaleType: ScaleType): ScaleCategory => {
  // Tonic Major: scales that work over major tonality
  const tonicMajorScales: ScaleType[] = [
    'major',
    'lydian',
    'pentatonic-major',
    'major-blues',
    'major-bebop',
    'lydian-augmented',
    'neapolitan-major',
    'double-harmonic-major',
  ];

  // Tonic Minor: scales that work over minor tonality
  const tonicMinorScales: ScaleType[] = [
    'minor',
    'dorian',
    'phrygian',
    'pentatonic-minor',
    'minor-blues',
    'harmonic-minor',
    'melodic-minor',
    'locrian',
    'neapolitan-minor',
    'hungarian-minor',
    'blues-scale',
  ];

  // Dominant: scales that work over dominant chords
  const dominantScales: ScaleType[] = [
    'mixolydian',
    'dominant-bebop',
    'altered',
    'lydian-dominant',
    'mixolydian-flat6',
  ];

  // Symmetrical / Outside Colors: symmetric scales and outside sounds
  const symmetricalScales: ScaleType[] = [
    'diminished',
    'whole-tone',
    'half-whole-diminished',
    'whole-half-diminished',
  ];

  if (tonicMajorScales.includes(scaleType)) return 'tonic-major';
  if (tonicMinorScales.includes(scaleType)) return 'tonic-minor';
  if (dominantScales.includes(scaleType)) return 'dominant';
  if (symmetricalScales.includes(scaleType))
    return 'symmetrical-outside-colors';
  return 'tonic-major'; // Default fallback
};

// Get all available scale types grouped by category
export const getScaleTypesByCategory = (): Record<
  ScaleCategory,
  ScaleType[]
> => {
  const allTypes = getAvailableScaleTypes();
  const grouped: Record<ScaleCategory, ScaleType[]> = {
    'tonic-major': [],
    'tonic-minor': [],
    dominant: [],
    'symmetrical-outside-colors': [],
  };

  allTypes.forEach(type => {
    const category = getScaleCategory(type);
    grouped[category].push(type);
  });

  return grouped;
};

// Get scale types by difficulty level
export const getScaleTypesByDifficulty = (
  difficulty: DifficultyLevel
): ScaleType[] => {
  const entryScales: ScaleType[] = [
    'major',
    'minor',
    'pentatonic-major',
    'pentatonic-minor',
    'dorian',
  ];

  const intermediateScales: ScaleType[] = [
    ...entryScales,
    'mixolydian',
    'lydian',
    'phrygian',
    'locrian',
    'major-blues',
    'minor-blues',
    'harmonic-minor',
    'melodic-minor',
  ];

  const professionalScales: ScaleType[] = [
    ...intermediateScales,
    'major-bebop',
    'dominant-bebop',
    'diminished',
    'whole-tone',
    'altered',
    'lydian-dominant',
    'mixolydian-flat6',
    'lydian-augmented',
    'half-whole-diminished',
    'whole-half-diminished',
    'blues-scale',
    'neapolitan-minor',
    'neapolitan-major',
    'double-harmonic-major',
    'hungarian-minor',
  ];

  switch (difficulty) {
    case 'entry':
      return entryScales;
    case 'intermediate':
      return intermediateScales;
    case 'professional':
      return professionalScales;
    default:
      return professionalScales;
  }
};
