# Data Storage Guide

## Overview

This app uses a **hybrid storage system** that automatically syncs data between:
- **Firebase Firestore** (when user is logged in) - Cloud storage, syncs across devices
- **localStorage** (when user is not logged in) - Local browser storage

## Where Data is Saved

### When Logged In (Firebase Firestore)
- **Location**: Firebase Firestore Database
- **Collection**: `users`
- **Document ID**: User's Firebase UID
- **Structure**: Single document per user containing all their data

### When Not Logged In (localStorage)
- **Location**: Browser's localStorage
- **Keys**: Prefixed with `local_` (e.g., `local_scalePracticeSessions`)
- **Format**: JSON strings

## Data Migration

When a user logs in:
1. App loads data from Firebase (if exists)
2. If no Firebase data exists, checks localStorage
3. If localStorage data exists, migrates it to Firebase
4. Clears localStorage after successful migration

## Data Structure

All user data is stored in a single Firestore document:

```typescript
{
  // Tunes Library
  tunesMetadata: {
    "autumn-leaves": { familiarity: 4 },
    "blue-bossa": { familiarity: 3 },
    // ...
  },
  
  // Scale Practice Sessions
  scalePracticeSessions: [
    {
      date: "2025-01-15T10:30:00Z",
      scale: "C Major",
      duration: 300, // seconds
      selectedKeys: ["C", "D"],
      selectedScales: ["major", "minor"]
    },
    // ...
  ],
  
  // Chord Practice Sessions
  chordPracticeSessions: [
    {
      date: "2025-01-15T11:00:00Z",
      chord: "C Major",
      duration: 240,
      selectedKeys: ["C"],
      selectedChords: ["major", "minor"]
    },
    // ...
  ],
  
  // Sight Reading Sessions
  sightReadingSessions: [
    {
      date: "2025-01-15T12:00:00Z",
      duration: 180,
      score: 85,
      totalAttempts: 20,
      selectedKeys: ["C"],
      clef: "treble"
    },
    // ...
  ],
  
  // Ear Training Stats
  earTrainingStats: {
    "C": { correct: 10, incorrect: 2, confusionPairs: { "C#": 1 } },
    // ...
  },
  
  // Groove Practice Sessions
  groovePracticeSessions: [
    {
      date: "2025-01-15T13:00:00Z",
      groove: "swing",
      duration: 600
    },
    // ...
  ],
  
  lastUpdated: Timestamp // Firebase server timestamp
}
```

## How to Use

### For Developers

1. **Use `useDataSync` hook** for simple data:
```typescript
const { data, setData, loading, syncing } = useDataSync('tunesMetadata', {});
```

2. **Use `usePracticeSessions` hook** for practice sessions:
```typescript
const { sessions, addSession, clearSessions } = usePracticeSessions('scalePracticeSessions');
```

3. **Data is automatically saved**:
   - When logged in: Saves to Firebase (debounced by 1 second)
   - When not logged in: Saves to localStorage immediately

### For Users

1. **Sign up/Login**: Your data will be saved to the cloud and sync across devices
2. **Use without login**: Data is saved locally in your browser
3. **Login later**: Your local data will be automatically migrated to the cloud

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Set up security rules (see README_AUTH.md)
4. Add your Firebase config to `.env` file

## Security

- Users can only access their own data
- Firestore security rules enforce user isolation
- All data is encrypted in transit
- Passwords are hashed by Firebase Auth

