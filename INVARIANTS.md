# Application Invariants

## Overview

This document defines cross-cutting rules and invariants that must be maintained across the entire Ear Training App. These rules ensure consistency, reliability, and maintainability.

## 🏷️ Naming Conventions

### **Files and Directories**

- **Components**: PascalCase (e.g., `NoteSelector.tsx`, `ExercisePanel.tsx`)
- **Utilities**: camelCase (e.g., `chordProgressions.ts`, `keyCenters.ts`)
- **Types**: PascalCase (e.g., `NoteStats`, `ChordProgression`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_KEY`, `MAX_SCORE`)

### **Variables and Functions**

- **Variables**: camelCase (e.g., `selectedNotes`, `currentNote`)
- **Functions**: camelCase (e.g., `playChordProgression`, `getDiatonicNotes`)
- **Boolean variables**: Start with `is`, `has`, `can` (e.g., `isPlaying`, `hasAudio`)

### **Musical Notation**

- **Note names**: Scientific notation (e.g., `C4`, `F#3`, `Bb5`)
- **Chord names**: Standard notation (e.g., `C Major`, `F# Minor`)
- **Key names**: Single letter with optional sharp/flat (e.g., `C`, `F#`, `Bb`)

## ⚠️ Error Handling

### **Audio Context Errors**

```typescript
// REQUIRED: Always wrap audio operations in try-catch
try {
  await Tone.start();
  console.log(`Audio context initialized: ${Tone.context.state}`);
} catch (error) {
  console.error('Error initializing audio:', error);
  // Show user-friendly error message
}
```

### **Component Error Boundaries**

- **REQUIRED**: Wrap audio-dependent components in error boundaries
- **REQUIRED**: Graceful degradation when audio fails
- **REQUIRED**: User-friendly error messages for audio issues

### **Data Validation**

```typescript
// REQUIRED: Validate musical data before use
if (!isValidKey(key)) {
  throw new Error(`Invalid key: ${key}`);
}
if (!isValidNote(note)) {
  throw new Error(`Invalid note: ${note}`);
}
```

### **State Consistency**

- **REQUIRED**: Audio context must be initialized before any playback
- **REQUIRED**: Exercise state must be valid before starting
- **REQUIRED**: Component props must be validated

## 📝 Logging Standards

### **Log Levels**

- **ERROR**: Audio failures, data validation errors, critical state issues
- **WARN**: Performance issues, deprecated API usage
- **INFO**: Audio initialization, exercise state changes, user actions
- **DEBUG**: Detailed audio operations, state transitions

### **Log Format**

```typescript
// REQUIRED: Include context in all logs
console.log(
  `Playing ${chord.name}: ${chord.notes.join(', ')} at time ${chordStartTime}`
);
console.error('Error initializing audio:', error);
console.info(`Exercise started with note: ${currentNote}`);
```

### **Audio Logging**

- **REQUIRED**: Log all audio context state changes
- **REQUIRED**: Log note/chord playback with timing
- **REQUIRED**: Log audio resource cleanup

## 🔄 Async/Threading Rules

### **Audio Context Management**

```typescript
// REQUIRED: Initialize audio context on user interaction
const initializeAudio = async () => {
  try {
    await Tone.start();
    console.log(`Audio context initialized: ${Tone.context.state}`);
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};
```

### **Resource Cleanup**

```typescript
// REQUIRED: Clean up audio resources in useEffect cleanup
useEffect(() => {
  const newPiano = new Tone.Sampler({...});
  setPiano(newPiano);

  return () => {
    newPiano.dispose(); // REQUIRED: Clean up audio resources
  };
}, []);
```

### **State Updates**

- **REQUIRED**: Use React hooks for state management
- **REQUIRED**: Avoid direct DOM manipulation
- **REQUIRED**: Batch related state updates

### **Async Operations**

- **REQUIRED**: Handle all async operations with try-catch
- **REQUIRED**: Show loading states during async operations
- **REQUIRED**: Cancel async operations on component unmount

## 🎵 Musical Data Invariants

### **Note Validation**

- **REQUIRED**: All notes must be in scientific notation (e.g., `C4`, `F#3`)
- **REQUIRED**: Note names must be valid musical notes
- **REQUIRED**: Octave numbers must be within valid range (0-8)

### **Chord Validation**

- **REQUIRED**: All chords must have at least 2 notes
- **REQUIRED**: Chord notes must be harmonically related
- **REQUIRED**: Chord names must match their note content

### **Key Validation**

- **REQUIRED**: All keys must have valid tonic notes
- **REQUIRED**: Diatonic scales must follow proper patterns
- **REQUIRED**: Transposition must preserve musical relationships

## 🎯 Performance Invariants

### **Audio Performance**

- **REQUIRED**: Load audio samples on demand
- **REQUIRED**: Dispose unused audio resources
- **REQUIRED**: Limit concurrent audio playback
- **REQUIRED**: Use appropriate audio buffer sizes

### **React Performance**

- **REQUIRED**: Minimize unnecessary re-renders
- **REQUIRED**: Use React.memo for expensive components
- **REQUIRED**: Optimize useEffect dependencies
- **REQUIRED**: Avoid inline function creation in render

### **Memory Management**

- **REQUIRED**: Clean up event listeners
- **REQUIRED**: Dispose audio resources
- **REQUIRED**: Clear timeouts and intervals
- **REQUIRED**: Avoid memory leaks in async operations

## 🔒 Security Invariants

### **User Input Validation**

- **REQUIRED**: Validate all user inputs
- **REQUIRED**: Sanitize musical data before processing
- **REQUIRED**: Prevent XSS in user-generated content

### **Audio Security**

- **REQUIRED**: Only load audio from trusted sources
- **REQUIRED**: Validate audio file formats
- **REQUIRED**: Handle audio loading errors gracefully

## 📱 Mobile Compatibility

### **Touch Interactions**

- **REQUIRED**: Support touch events for all interactions
- **REQUIRED**: Provide adequate touch targets (min 44px)
- **REQUIRED**: Handle touch event conflicts

### **Audio on Mobile**

- **REQUIRED**: Initialize audio on user interaction
- **REQUIRED**: Handle audio context suspension
- **REQUIRED**: Provide audio feedback for interactions

## 🧪 Testing Invariants

### **Test Coverage**

- **REQUIRED**: Test all error handling paths
- **REQUIRED**: Test audio initialization and cleanup
- **REQUIRED**: Test state consistency
- **REQUIRED**: Test mobile interactions

### **Mocking**

- **REQUIRED**: Mock Tone.js for unit tests
- **REQUIRED**: Mock audio context for testing
- **REQUIRED**: Test error scenarios

## 📋 Code Quality

### **TypeScript**

- **REQUIRED**: Use strict TypeScript configuration
- **REQUIRED**: Define interfaces for all data structures
- **REQUIRED**: Avoid `any` type usage
- **REQUIRED**: Use proper type guards

### **Code Organization**

- **REQUIRED**: Single responsibility principle
- **REQUIRED**: Clear separation of concerns
- **REQUIRED**: Consistent file structure
- **REQUIRED**: Meaningful variable and function names
