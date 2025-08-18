# Application Source Code

## Overview

The `src/` directory contains the main application source code for the Ear Training App. This is a React TypeScript application with a focus on audio synthesis and musical education.

## Structure

```
src/
├── App.tsx                    # Main application component
├── App.css                    # Main application styles
├── index.tsx                  # Application entry point
├── index.css                  # Global styles
├── components/                # React UI components
├── data/                      # Musical data and utilities
└── types/                     # TypeScript type definitions
```

## Key Files

### **App.tsx** (Main Component)

- **Purpose**: Application orchestrator and state management
- **Public API**: Main React component with no props
- **Key Invariants**:
  - Audio context must be initialized before playback
  - Exercise state must be consistent
- **Call Flow**:
  - Initializes audio engine on mount
  - Manages exercise state and statistics
  - Coordinates between components

### **index.tsx** (Entry Point)

- **Purpose**: Application bootstrap and React rendering
- **Public API**: Renders App component to DOM
- **Key Invariants**: Must be called after DOM is ready
- **Call Flow**: ReactDOM.render() → App component

## State Management

The application uses React hooks for state management:

- **Global State**: Managed in App.tsx (audio, exercise state, statistics)
- **Local State**: Component-specific state in individual components
- **State Flow**: Props down, events up pattern

## Audio Integration

- **Tone.js**: Web audio synthesis library
- **Piano Sampler**: Realistic piano sounds for exercises
- **Mobile Support**: Audio context initialization on user interaction
- **Resource Management**: Proper cleanup of audio resources
