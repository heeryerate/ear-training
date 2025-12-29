# Restart Dev Server to Load .env

## The Problem
The error shows `key=your-api-key` which means environment variables from `.env` are not being loaded.

## The Solution
**React apps only load `.env` files when the dev server starts.** You must restart the server after creating or updating `.env`.

## Steps to Fix

1. **Stop the current dev server**:
   - In the terminal where `npm start` is running
   - Press `Ctrl + C` (or `Cmd + C` on Mac)
   - Or I've already stopped it for you

2. **Restart the dev server**:
   ```bash
   npm start
   ```

3. **Check the browser console**:
   - After the app loads, open browser console (F12)
   - You should see: `🔧 Firebase Config Status: { apiKeyLoaded: true, ... }`
   - If you see `apiKeyLoaded: false`, the .env file isn't being read

4. **Verify .env file**:
   - Make sure `.env` is in the project root (same folder as `package.json`)
   - Make sure all variables start with `REACT_APP_`
   - No spaces around the `=` sign
   - No quotes around values

## After Restart

Once restarted:
1. Try logging in again
2. Rate a tune in Tunes Library
3. Check Firestore - you should see data appear
4. Check browser console for the debug message

## Common Issues

- **Still seeing "your-api-key"**: 
  - Make sure you restarted the server
  - Check .env file is in the right location
  - Check .env file has no syntax errors

- **"Cannot find module" errors**:
  - Run `npm install` first
  - Then `npm start`

