export interface Note {
  note: string;
  name: string;
}

export interface Chord {
  name: string;
  notes: string[];
  roman: string;
}

export interface ChordProgression {
  name: string;
  description: string;
  chords: Chord[];
}

export interface NoteStats {
  correct: number;
  incorrect: number;
}

export interface KeyCenter {
  key: string;
  name: string;
  tonic: string;
}

export type ActiveTab = 'exercise' | 'stats' | 'settings';
