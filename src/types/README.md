# TypeScript Type Definitions

## Overview

The `types/` directory contains TypeScript type definitions that provide type safety and structure for the Ear Training App. These types define the data structures used throughout the application.

## Core Types

### **Note**

- **Purpose**: Represents a musical note with display information
- **Structure**:
  ```typescript
  interface Note {
    note: string; // Scientific notation (e.g., "C4")
    name: string; // Display name (e.g., "C")
  }
  ```

### **Chord**

- **Purpose**: Represents a musical chord with its components
- **Structure**:
  ```typescript
  interface Chord {
    name: string; // Chord name (e.g., "C Major")
    notes: string[]; // Array of note names (e.g., ["C4", "E4", "G4"])
    roman: string; // Roman numeral (e.g., "I", "IV", "V")
  }
  ```

### **ChordProgression**

- **Purpose**: Represents a sequence of chords for practice
- **Structure**:
  ```typescript
  interface ChordProgression {
    name: string; // Progression identifier (e.g., "I-IV-V-I")
    description: string; // Human-readable description
    chords: Chord[]; // Array of chords in sequence
  }
  ```

### **NoteStats**

- **Purpose**: Tracks user performance for individual notes
- **Structure**:
  ```typescript
  interface NoteStats {
    correct: number; // Number of correct identifications
    incorrect: number; // Number of incorrect identifications
  }
  ```

### **KeyCenter**

- **Purpose**: Represents a musical key with its properties
- **Structure**:
  ```typescript
  interface KeyCenter {
    key: string; // Key identifier (e.g., "C", "F#")
    name: string; // Full name (e.g., "C Major")
    tonic: string; // Root note (e.g., "C4")
  }
  ```

### **ActiveTab**

- **Purpose**: Defines available application tabs
- **Type**: `'exercise' | 'stats' | 'settings'`

## Type Usage

### **Data Layer**

- `Chord`, `ChordProgression`, `KeyCenter` - Used in data utilities
- `Note` - Used for note calculations and display

### **State Management**

- `NoteStats` - Tracks user performance
- `ActiveTab` - Manages UI navigation

### **Component Props**

- All types used as props for type-safe component communication
- Ensures consistent data structure across components

## Type Safety Benefits

- **Compile-time Validation**: Catches type errors during development
- **IntelliSense Support**: Better IDE autocomplete and documentation
- **Refactoring Safety**: Ensures changes propagate correctly
- **API Consistency**: Guarantees consistent data structures
