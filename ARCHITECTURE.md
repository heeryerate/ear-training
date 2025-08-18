# Architecture Overview

## System Design

The Ear Training App follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │  Business Logic │    │   Data Layer    │
│  (Components)   │◄──►│   (App.tsx)     │◄──►│   (Data Utils)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Tone.js Audio  │    │  State Mgmt     │    │  Musical Data   │
│   Synthesis     │    │  (React Hooks)  │    │  (Chords/Keys)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Design Patterns

### 1. **State Management Pattern**

- **Centralized State**: Main application state in `App.tsx`
- **Local Component State**: UI-specific state in individual components
- **State Flow**: Props down, events up pattern

### 2. **Audio Management Pattern**

- **Singleton Audio Context**: Single Tone.js instance managed by App
- **Audio Initialization**: Lazy loading with mobile-friendly user interaction
- **Resource Management**: Proper disposal of audio resources

### 3. **Data Flow Pattern**

```
User Action → Component → App State → Audio Engine → User Feedback
```

## Core Modules

### **App.tsx** (Main Controller)

- **Purpose**: Application orchestrator and state management
- **Key Responsibilities**:
  - Audio context initialization and management
  - Exercise state coordination
  - Statistics tracking
  - Component communication

### **Components Layer**

- **NoteSelector**: Note selection and visualization
- **ExercisePanel**: Ear training exercise interface
- **ChordProgressionPanel**: Chord progression playback and selection

### **Data Layer**

- **chordProgressions.ts**: Chord progression definitions and transposition
- **keyCenters.ts**: Musical key definitions and note calculations
- **types/index.ts**: TypeScript type definitions

## Key Invariants

1. **Audio Context**: Must be initialized before any audio playback
2. **State Consistency**: Exercise state must be valid before starting
3. **Resource Cleanup**: Audio resources must be disposed properly
4. **Mobile Compatibility**: Audio requires user interaction on mobile

## Call Flows

### Exercise Flow

```
User clicks "Start Exercise"
→ App generates random note
→ Audio engine plays note
→ User selects answer
→ App validates and updates stats
→ UI shows feedback
```

### Chord Progression Flow

```
User selects progression + key
→ App transposes progression to key
→ Audio engine plays chords sequentially
→ UI shows progression info
```

### Audio Initialization Flow

```
User interaction (click/touch)
→ Tone.start() called
→ Audio context becomes running
→ Piano sampler loads
→ Ready for playback
```

## Performance Considerations

- **Lazy Audio Loading**: Audio samples loaded on demand
- **State Optimization**: Minimal re-renders through proper state structure
- **Memory Management**: Proper cleanup of audio resources
- **Mobile Optimization**: Touch-friendly interface and audio handling

## Extension Points

- **New Exercise Types**: Add to ExercisePanel component
- **Additional Instruments**: Extend audio engine with new samplers
- **Advanced Statistics**: Extend stats tracking in App.tsx
- **Custom Progressions**: Add to chordProgressions.ts data
