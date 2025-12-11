import {
  getScaleNoteDisplayNames,
  getScaleNotesForAudio,
  ScaleType,
} from '../data/scales';

// Generate pattern sequences from scale notes
export const generatePatternSequences = (
  key: string,
  scaleType: ScaleType,
  pattern: number[]
): string[][] => {
  if (pattern.length === 0) return [];

  const scaleNotes = getScaleNotesForAudio(key, scaleType);
  const sequences: string[][] = [];

  // For each scale degree (1-7, then back to 1 for octave)
  for (let startDegree = 0; startDegree < scaleNotes.length; startDegree++) {
    const sequence: string[] = [];
    for (const patternDegree of pattern) {
      // Convert 1-based pattern degree to 0-based index
      // patternDegree is relative to the starting degree (1 = start, 2 = start+1, etc.)
      const targetDegree = startDegree + patternDegree - 1;
      const noteIndex = targetDegree % scaleNotes.length;
      const octaveOffset = Math.floor(targetDegree / scaleNotes.length);

      // Get the base note
      let note = scaleNotes[noteIndex];

      // Adjust octave if needed
      if (octaveOffset > 0) {
        note = note.replace(/(\d+)$/, match => {
          return String(parseInt(match) + octaveOffset);
        });
      }
      sequence.push(note);
    }
    sequences.push(sequence);
  }

  return sequences;
};

// Generate display sequences for pattern mode
export const generatePatternDisplaySequences = (
  key: string,
  scaleType: ScaleType,
  pattern: number[]
): Array<Array<{ note: string; octave: number }>> => {
  const scaleNoteDisplayNames = getScaleNoteDisplayNames(key, scaleType);
  const displaySequences: Array<Array<{ note: string; octave: number }>> = [];
  for (
    let startDegree = 0;
    startDegree < scaleNoteDisplayNames.length;
    startDegree++
  ) {
    const sequence: Array<{ note: string; octave: number }> = [];
    for (const patternDegree of pattern) {
      const targetDegree = startDegree + patternDegree - 1;
      const noteIndex = targetDegree % scaleNoteDisplayNames.length;
      const octaveOffset = Math.floor(
        targetDegree / scaleNoteDisplayNames.length
      );

      // Get the base note name (without octave)
      const noteName = scaleNoteDisplayNames[noteIndex];

      // Add octave indicator if beyond first octave
      sequence.push({ note: noteName, octave: octaveOffset });
    }
    displaySequences.push(sequence);
  }
  return displaySequences;
};
