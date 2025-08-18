# UI Components

## Overview

The `components/` directory contains React UI components that provide the user interface for the Ear Training App. Each component is focused on a specific aspect of the application.

## Components

### **NoteSelector.tsx**

- **Purpose**: Visual note selection interface for ear training exercises
- **Public API**:
  - `selectedNotes: Set<string>` - Currently selected notes
  - `onNoteToggle: (note: string) => void` - Note selection callback
- **Key Invariants**:
  - Selected notes must be valid musical notes
  - Visual state must match internal state
- **Call Flow**: User clicks note → onNoteToggle → App updates state

### **ExercisePanel.tsx**

- **Purpose**: Main interface for ear training exercises
- **Public API**:
  - `isExerciseMode: boolean` - Exercise state
  - `currentNote: string | null` - Note to identify
  - `score: number` - Current score
  - `onStartExercise: () => void` - Start exercise callback
  - `onAnswerSubmit: (note: string) => void` - Submit answer callback
- **Key Invariants**:
  - Exercise must be in valid state before starting
  - Answer validation must be consistent
- **Call Flow**: Start → Play note → User answers → Validate → Update stats

### **ChordProgressionPanel.tsx**

- **Purpose**: Chord progression selection and playback interface
- **Public API**:
  - `selectedProgression: string` - Current progression
  - `selectedKey: string` - Current key
  - `onProgressionChange: (progression: string) => void` - Progression callback
  - `onKeyChange: (key: string) => void` - Key callback
  - `onPlay: () => void` - Playback callback
- **Key Invariants**:
  - Progression and key must be valid combinations
  - Playback state must be managed properly
- **Call Flow**: Select progression/key → Transpose → Play chords

## Component Communication

Components communicate through props and callbacks:

- **Parent-Child**: App.tsx passes state and callbacks to components
- **Event Handling**: Components emit events through callback props
- **State Updates**: App.tsx manages all shared state

## Styling

- **CSS Modules**: Each component has associated CSS file
- **Responsive Design**: Mobile-friendly touch interfaces
- **Accessibility**: Keyboard navigation and screen reader support
