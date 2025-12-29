# Complete User Data Caching Guide

## How It Works

### Data Storage Locations

1. **When Logged In**: Data is saved to **Firebase Firestore**
   - Collection: `users`
   - Document ID: User's Firebase UID
   - Path: `users/{userId}`
   - Syncs automatically across all devices

2. **When Not Logged In**: Data is saved to **Browser localStorage**
   - Keys prefixed with `local_` (e.g., `local_scalePracticeSessions`)
   - Stored as JSON strings
   - Only available on the current browser/device

### Automatic Data Migration

When a user logs in for the first time:
1. App checks Firebase for existing data
2. If no Firebase data exists, checks localStorage
3. If localStorage data exists, automatically migrates to Firebase
4. Clears localStorage after successful migration
5. All future saves go directly to Firebase

## What Data is Saved

### ✅ Tunes Library
- **Field**: `tunesMetadata`
- **Data**: Familiarity ratings (0-5 stars) for each tune
- **Format**: `{ "tune-id": { familiarity: 4 }, ... }`

### ✅ Scale Practice
- **Field**: `scalePracticeSessions`
- **Data**: Practice session history
- **Format**: Array of sessions with date, scale, duration, selected keys/scales

### ✅ Chord Practice
- **Field**: `chordPracticeSessions`
- **Data**: Practice session history
- **Format**: Array of sessions with date, chord, duration, selected keys/chords

### ✅ Sight Reading
- **Field**: `sightReadingSessions`
- **Data**: Practice session history with scores
- **Format**: Array of sessions with date, duration, score, attempts, keys, clef

### ✅ Groove Practice
- **Field**: `groovePracticeSessions`
- **Data**: Practice session history
- **Format**: Array of sessions with date, groove, duration

### ✅ Ear Training
- **Field**: `earTrainingStats`
- **Data**: Statistics for each note
- **Format**: `{ "C": { correct: 10, incorrect: 2, confusionPairs: {...} }, ... }`

## How to Set Up Firebase

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Follow the setup wizard

### Step 2: Enable Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider

### Step 3: Enable Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (for development)
4. Choose a location

### Step 4: Set Security Rules
Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 5: Get Firebase Config
1. Go to **Project Settings** > **General**
2. Scroll to **Your apps**
3. Click the web icon (</>) to add a web app
4. Copy the configuration

### Step 6: Add to .env File
Create a `.env` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Data Flow

### Saving Data
```
User Action (e.g., rate a tune, complete practice)
    ↓
Update Local State
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

### Loading Data
```
App Starts / User Logs In
    ↓
Is User Logged In?
    ↓                    ↓
   YES                  NO
    ↓                    ↓
Load from Firebase    Load from localStorage
    ↓
If no Firebase data,
check localStorage
    ↓
Migrate localStorage → Firebase
```

## Benefits

1. **Works Offline**: localStorage works without internet
2. **Cross-Device Sync**: When logged in, data syncs across all devices
3. **No Data Loss**: Automatic migration when logging in
4. **Secure**: User data is isolated and protected
5. **Automatic**: No manual save buttons needed

## Testing

1. **Test Without Login**: Use the app, data saves to localStorage
2. **Test With Login**: Sign up, data saves to Firebase
3. **Test Migration**: Use app without login, then log in - data should migrate
4. **Test Sync**: Log in on different device - data should appear

## Troubleshooting

### Data Not Syncing
- Check Firebase config in `.env` file
- Verify Firestore is enabled
- Check browser console for errors
- Verify user is logged in

### Data Not Loading
- Check if user is logged in
- Check browser localStorage
- Check Firebase console for data
- Clear browser cache and try again

### Migration Not Working
- Check browser console for errors
- Verify Firebase permissions
- Check network connection
- Try logging out and back in

