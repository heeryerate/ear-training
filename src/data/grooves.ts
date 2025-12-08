export type GrooveCategory =
  | 'daily-warm-up'
  | 'groove-rotation'
  | 'rhythmic-vocabulary';

export type GrooveType =
  // Daily Warm-up
  | 'metronome-2-4'
  | 'subdivisions-switching'
  // Groove Rotation
  | 'swing'
  | 'bossa'
  | 'funk'
  | 'shuffle'
  | 'modal-straight-8ths'
  // Rhythmic Vocabulary
  | 'charleston'
  | 'anticipations'
  | 'backbeat-accents'
  | 'off-beat-stabs';

export interface Groove {
  type: GrooveType;
  name: string;
  category: GrooveCategory;
  description: string;
  defaultDuration?: number; // in minutes
}

// Groove definitions
export const grooves: Record<GrooveType, Groove> = {
  'metronome-2-4': {
    type: 'metronome-2-4',
    name: 'Metronome on 2 & 4',
    category: 'daily-warm-up',
    description: 'Practice with metronome clicking on beats 2 and 4',
    defaultDuration: 5,
  },
  'subdivisions-switching': {
    type: 'subdivisions-switching',
    name: 'Subdivisions Switching',
    category: 'daily-warm-up',
    description: 'Switch between different rhythmic subdivisions',
    defaultDuration: 5,
  },
  swing: {
    type: 'swing',
    name: 'Swing',
    category: 'groove-rotation',
    description: 'Classic swing groove with triplet feel',
  },
  bossa: {
    type: 'bossa',
    name: 'Bossa',
    category: 'groove-rotation',
    description: 'Bossa nova rhythm pattern',
  },
  funk: {
    type: 'funk',
    name: 'Funk',
    category: 'groove-rotation',
    description: 'Funk groove with syncopated rhythms',
  },
  shuffle: {
    type: 'shuffle',
    name: 'Shuffle',
    category: 'groove-rotation',
    description: 'Shuffle rhythm with swung eighth notes',
  },
  'modal-straight-8ths': {
    type: 'modal-straight-8ths',
    name: 'Modal Straight 8ths',
    category: 'groove-rotation',
    description: 'Straight eighth note groove in modal style',
  },
  charleston: {
    type: 'charleston',
    name: 'Charleston',
    category: 'rhythmic-vocabulary',
    description: 'Charleston rhythm pattern',
  },
  anticipations: {
    type: 'anticipations',
    name: 'Anticipations',
    category: 'rhythmic-vocabulary',
    description: 'Practice anticipating beats and downbeats',
  },
  'backbeat-accents': {
    type: 'backbeat-accents',
    name: 'Backbeat Accents',
    category: 'rhythmic-vocabulary',
    description: 'Accent patterns on beats 2 and 4',
  },
  'off-beat-stabs': {
    type: 'off-beat-stabs',
    name: 'Off-beat Stabs',
    category: 'rhythmic-vocabulary',
    description: 'Staccato accents on off-beats',
  },
};

// Get all groove types
export const getAvailableGrooveTypes = (): GrooveType[] => {
  return Object.keys(grooves) as GrooveType[];
};

// Get groove by type
export const getGroove = (type: GrooveType): Groove => {
  return grooves[type];
};

// Get groove display name
export const getGrooveDisplayName = (type: GrooveType): string => {
  return grooves[type].name;
};

// Get grooves by category
export const getGroovesByCategory = (): Record<
  GrooveCategory,
  GrooveType[]
> => {
  const allTypes = getAvailableGrooveTypes();
  const grouped: Record<GrooveCategory, GrooveType[]> = {
    'daily-warm-up': [],
    'groove-rotation': [],
    'rhythmic-vocabulary': [],
  };

  allTypes.forEach(type => {
    const category = grooves[type].category;
    grouped[category].push(type);
  });

  return grouped;
};

// Get category display name
export const getCategoryDisplayName = (category: GrooveCategory): string => {
  const names: Record<GrooveCategory, string> = {
    'daily-warm-up': 'Daily Warm-up',
    'groove-rotation': 'Groove Rotation',
    'rhythmic-vocabulary': 'Rhythmic Vocabulary',
  };
  return names[category];
};
