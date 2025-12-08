import { GrooveType } from './grooves';

// Define which subdivisions (1-8) should play each drum part
// Subdivisions: 1, 2, 3, 4, 5, 6, 7, 8 (eighth notes in 4/4)
export interface GroovePattern {
  hiHat: number[]; // Subdivisions where hi-hat plays
  snare: number[]; // Subdivisions where snare plays
  kick: number[]; // Subdivisions where kick plays
  metronome?: number[]; // Subdivisions where metronome click plays (optional)
}

export const groovePatterns: Record<GrooveType, GroovePattern> = {
  // Daily Warm-up
  'metronome-2-4': {
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8], // All eighth notes
    snare: [3, 7], // Beats 2 and 4 (subdivisions 3 and 7)
    kick: [1, 5], // Beats 1 and 3 (subdivisions 1 and 5)
    metronome: [3, 7], // Metronome click on 2 & 4
  },
  'subdivisions-switching': {
    // Alternates between quarter notes, eighth notes, and triplets
    // For now, use eighth note pattern, will cycle in code
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8],
    snare: [3, 7], // Beats 2 and 4
    kick: [1, 5], // Beats 1 and 3
  },
  // Groove Rotation
  swing: {
    // Swing feel: hi-hat on swung 8ths
    // The swing timing is handled by Tone.Transport.swing
    // Hi-hat plays on all subdivisions, but timing is swung
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8],
    snare: [3, 7], // Beats 2 and 4
    kick: [1, 5], // Beats 1 and 3
  },
  bossa: {
    // Classic bossa nova pattern: syncopated kick pattern with rim click on 2 & 4
    // Traditional bossa has kick on 1, then syncopated pattern
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8], // Continuous 8th note pattern
    snare: [3, 7], // Rim click on beats 2 and 4 (softer than backbeat)
    kick: [1, 4, 6, 8], // Kick on 1, then syncopated pattern (1, 2&, 3&, 4&)
  },
  funk: {
    // Classic funk groove: syncopated kick with ghost notes on snare
    // Hi-hat typically plays all 8ths with accents
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8], // All 8ths with dynamic accents
    snare: [3, 5, 7], // Backbeat on 2 & 4, plus ghost note on 3&
    kick: [1, 2, 6, 7], // Classic funk kick: 1, 1&, 3&, 4
  },
  shuffle: {
    // Shuffle groove: swung 8ths with emphasis on triplet subdivisions
    // Timing is swung (handled in code), pattern emphasizes on-beats
    hiHat: [1, 3, 5, 7], // On-beats only (swing timing applied)
    snare: [3, 7], // Beats 2 and 4
    kick: [1, 5], // Beats 1 and 3
  },
  'modal-straight-8ths': {
    // Modal jazz straight 8ths: clean, even pattern
    // Often played with ride cymbal, but we'll use hi-hat
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8], // All 8ths, even feel
    snare: [3, 7], // Light backbeat on 2 & 4
    kick: [1, 5], // Beats 1 and 3
  },
  // Rhythmic Vocabulary
  charleston: {
    // Classic Charleston rhythm: kick on 1, snare on 2&
    // This is the signature Charleston pattern
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8], // Continuous 8th note pattern
    snare: [4], // The "Charleston" - snare on 2&
    kick: [1, 5], // Kick on beats 1 and 3
  },
  anticipations: {
    // Anticipations: notes that lead into the beat
    // Creates forward momentum by playing before the downbeat
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8], // Continuous pattern
    snare: [2, 6], // Anticipating beats 2 and 4 (on 1& and 3&)
    kick: [8, 4], // Anticipating beats 1 and 3 (on 4& and 2&)
  },
  'backbeat-accents': {
    // Backbeat accents: strong emphasis on beats 2 & 4
    // Classic rock/pop pattern with heavy snare accents
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8], // All 8ths
    snare: [3, 7], // Strong accents on beats 2 and 4
    kick: [1, 5], // Beats 1 and 3
  },
  'off-beat-stabs': {
    // Off-beat stabs: sharp, staccato accents on the "and" beats
    // Creates syncopation and rhythmic interest
    hiHat: [1, 2, 3, 4, 5, 6, 7, 8], // Continuous pattern
    snare: [2, 4, 6, 8], // Stabs on all off-beats (and's)
    kick: [1, 3, 5, 7], // Kick on on-beats for contrast
  },
};

// Get pattern for a groove type
export const getGroovePattern = (grooveType: GrooveType): GroovePattern => {
  return groovePatterns[grooveType];
};
