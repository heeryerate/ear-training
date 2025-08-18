# Musical Data and Utilities

## Overview

The `data/` directory contains musical data definitions and utility functions for chord progressions, key centers, and note calculations. These utilities provide the musical foundation for the ear training exercises.

## Files

### **chordProgressions.ts**

- **Purpose**: Chord progression definitions and transposition utilities
- **Public API**:
  - `chordProgressions: Record<string, ChordProgression>` - Available progressions
  - `transposeProgression(progression: string, key: string): ChordProgression` - Transpose to key
- **Key Invariants**:
  - All progressions must have valid chord structures
  - Transposition must preserve musical relationships
- **Call Flow**: Select progression → Transpose to key → Return chord array

### **keyCenters.ts**

- **Purpose**: Musical key definitions and note calculation utilities
- **Public API**:
  - `keyCenters: KeyCenter[]` - Available musical keys
  - `getDiatonicNotes(key: string): string[]` - Get scale notes for key
  - `getNoteDisplayName(note: string): string` - Format note for display
- **Key Invariants**:
  - All keys must have valid tonic notes
  - Diatonic notes must follow proper scale patterns
- **Call Flow**: Select key → Calculate scale → Return note array

## Musical Data Structure

### Chord Progressions

```typescript
interface ChordProgression {
  name: string; // e.g., "I-IV-V-I"
  description: string; // Human-readable description
  chords: Chord[]; // Array of chords in progression
}
```

### Key Centers

```typescript
interface KeyCenter {
  key: string; // e.g., "C", "F#"
  name: string; // e.g., "C Major", "F# Major"
  tonic: string; // Root note e.g., "C4"
}
```

## Utility Functions

### Transposition Logic

- **Input**: Progression name + target key
- **Process**: Calculate interval from original key to target key
- **Output**: Transposed chord progression with new note names

### Scale Calculation

- **Input**: Key name (e.g., "C", "F#")
- **Process**: Apply major scale pattern to tonic note
- **Output**: Array of diatonic notes in that key

## Data Validation

- **Chord Validation**: Ensures all chords have valid note structures
- **Key Validation**: Verifies key names are valid musical keys
- **Note Validation**: Confirms note names follow musical notation
