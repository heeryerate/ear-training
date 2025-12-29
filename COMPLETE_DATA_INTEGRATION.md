# Complete Data Integration Guide

## Overview

This document explains how user data caching and sync works across all apps in JazzUp.

## Data Storage Architecture

### Two-Tier Storage System

1. **When User is Logged In**:
   - **Primary**: Firebase Firestore (Cloud Database)
   - **Location**: `users/{userId}` document
   - **Benefits**: Syncs across devices, persistent, secure
   - **Fallback**: If Firebase fails, falls back to localStorage

2. **When User is Not Logged In**:
   - **Primary**: Browser localStorage
   - **Keys**: Prefixed with `local_` (e.g., `local_scalePracticeSessions`)
   - **Benefits**: Works offline, no account needed
   - **Migration**: Automatically migrates to Firebase when user logs in

## Where Data is Saved

### Firebase Firestore Structure

```
users/
  {userId}/
    tunesMetadata: { ... }              // Tunes Library ratings
    scalePracticeSessions: [ ... ]      // Scale practice history
    chordPracticeSessions: [ ... ]      // Chord practice history
    sightReadingSessions: [ ... ]       // Sight reading history
    groovePracticeSessions: [ ... ]     // Groove practice history
    earTrainingStats: { ... }           // Ear training statistics
    lastUpdated: Timestamp              // Auto-updated timestamp
```

### localStorage Structure (when not logged in)

```
local_tunesMetadata: JSON string
local_scalePracticeSessions: JSON string
local_chordPracticeSessions: JSON string
local_sightReadingSessions: JSON string
local_groovePracticeSessions: JSON string
local_earTrainingStats: JSON string
```

## How It Works

### 1. Data Loading Flow

```
User Opens App
    ↓
Is User Logged In?
    ↓                    ↓
   YES                  NO
    ↓                    ↓
Load from Firebase    Load from localStorage
    ↓                    ↓
If no Firebase data,    Use local data
check localStorage
    ↓
Migrate localStorage → Firebase
```

### 2. Data Saving Flow

```
User Makes Changes
    ↓
Is User Logged In?
    ↓                    ↓
   YES                  NO
    ↓                    ↓
Save to Firebase      Save to localStorage
(debounced 1s)        (immediate)
    ↓
If Firebase fails,
fallback to localStorage
```

### 3. Automatic Migration

When a user logs in for the first time:
1. App checks Firebase for existing data
2. If no Firebase data exists, checks localStorage
3. If localStorage data exists, migrates it to Firebase
4. Clears localStorage after successful migration
5. Future saves go directly to Firebase

## Integration Status

### ✅ Fully Integrated
- **Tunes Library**: Familiarity ratings sync automatically

### 🔄 Partially Integrated (Needs Completion)
- **Scale Practice**: Practice sessions need integration
- **Chord Practice**: Practice sessions need integration
- **Sight Reading**: Practice sessions need integration
- **Groove Practice**: Practice sessions need integration
- **Ear Training**: Stats need integration

## Implementation Example

### For Practice Sessions

```typescript
// In your component
const { user } = useUser();
const { userData, mergeUserData } = useUserData();

// Load sessions
const [practiceSessions, setPracticeSessions] = useState(() => {
  if (user && userData?.scalePracticeSessions) {
    return userData.scalePracticeSessions;
  }
  const saved = localStorage.getItem('local_scalePracticeSessions');
  return saved ? JSON.parse(saved) : [];
});

// Sync when userData loads
useEffect(() => {
  if (user && userData?.scalePracticeSessions) {
    setPracticeSessions(userData.scalePracticeSessions);
  }
}, [user, userData]);

// Save sessions
useEffect(() => {
  if (practiceSessions.length > 0) {
    if (user) {
      mergeUserData({ scalePracticeSessions: practiceSessions });
    } else {
      localStorage.setItem(
        'local_scalePracticeSessions',
        JSON.stringify(practiceSessions)
      );
    }
  }
}, [practiceSessions, user, mergeUserData]);
```

## Firebase Setup Required

1. **Create Firebase Project**: https://console.firebase.google.com/
2. **Enable Firestore**: Create database in test mode
3. **Set Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
4. **Add Config to `.env`**:
```
REACT_APP_FIREBASE_API_KEY=your-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Benefits

1. **Seamless Experience**: Works with or without login
2. **Cross-Device Sync**: When logged in, data syncs across all devices
3. **Offline Support**: localStorage works offline
4. **Automatic Migration**: No data loss when logging in
5. **Secure**: User data is isolated and protected

## Next Steps

To complete integration for all apps, update each app's practice session state management to use the pattern shown above.

