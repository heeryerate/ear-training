import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';

export type FamiliarityLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface UserData {
  // Tunes Library
  tunesMetadata?: Record<string, { familiarity?: FamiliarityLevel }>;
  // Scale Practice
  scalePracticeSessions?: Array<{
    date: string;
    scale: string;
    duration: number;
    selectedKeys: string[];
    selectedScales: string[];
  }>;
  // Chord Practice
  chordPracticeSessions?: Array<{
    date: string;
    chord: string;
    duration: number;
    selectedKeys: string[];
    selectedChords: string[];
  }>;
  // Sight Reading
  sightReadingSessions?: Array<{
    date: string;
    duration: number;
    score: number;
    totalAttempts: number;
    selectedKeys: string[];
    clef: string;
  }>;
  // Ear Training
  earTrainingStats?: Record<
    string,
    {
      correct: number;
      incorrect: number;
      confusionPairs?: Record<string, number>;
    }
  >;
  // Groove Practice
  groovePracticeSessions?: Array<{
    date: string;
    groove: string;
    duration: number;
  }>;
  // Last updated timestamp
  lastUpdated?: any;
}

export const userDataService = {
  // Get user data from Firestore
  async getUserData(userId: string): Promise<UserData | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Save user data to Firestore
  async saveUserData(userId: string, data: Partial<UserData>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const existingData = await this.getUserData(userId);

      await setDoc(
        userDocRef,
        {
          ...existingData,
          ...data,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  // Update specific field in user data
  async updateUserDataField(
    userId: string,
    field: keyof UserData,
    value: any
  ): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      // Use setDoc with merge: true to create document if it doesn't exist
      await setDoc(
        userDocRef,
        {
          [field]: value,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },

  // Merge data with existing (useful for arrays)
  async mergeUserData(userId: string, data: Partial<UserData>): Promise<void> {
    try {
      const existingData = await this.getUserData(userId);
      await this.saveUserData(userId, {
        ...existingData,
        ...data,
      });
    } catch (error) {
      console.error('Error merging user data:', error);
      throw error;
    }
  },
};
