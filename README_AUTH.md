# Authentication Setup Guide

This app now includes Firebase Authentication for user login and data persistence.

## Setup Instructions

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Authentication:
     - Go to Authentication > Sign-in method
     - Enable "Email/Password" provider

2. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click the web icon (</>) to add a web app
   - Copy the Firebase configuration object

3. **Set Environment Variables**
   - Create a `.env` file in the root directory
   - Add your Firebase config:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. **Enable Firestore Database**
   - Go to Firestore Database in Firebase Console
   - Click "Create database"
   - Start in test mode (for development)
   - Choose a location for your database

5. **Set Firestore Security Rules** (for production)
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

## Features

- **User Authentication**: Sign up and sign in with email/password
- **Data Persistence**: All user progress is saved to Firebase Firestore
- **Automatic Sync**: Data syncs automatically when logged in
- **Offline Support**: Falls back to localStorage when not logged in

## Data Stored

The following data is saved per user:
- Tunes Library: Familiarity ratings for each tune
- Scale Practice: Practice sessions and progress
- Chord Practice: Practice sessions and progress
- Sight Reading: Practice sessions and scores
- Ear Training: Stats and confusion pairs
- Groove Practice: Practice sessions

## Usage

1. Click "Sign In / Sign Up" on the main menu
2. Create an account or sign in
3. Your progress will be automatically saved
4. Data syncs across devices when logged in

