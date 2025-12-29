import { useEffect, useState } from 'react';

import { useUser } from '../contexts/UserContext';
import { UserData, userDataService } from '../services/userDataService';

export const useUserData = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data when user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setLoading(true);
        const data = await userDataService.getUserData(user.uid);

        // If no Firebase data, try to migrate from localStorage
        if (!data) {
          const localDataKeys = [
            'local_tunesMetadata',
            'local_scalePracticeSessions',
            'local_chordPracticeSessions',
            'local_sightReadingSessions',
            'local_groovePracticeSessions',
            'local_earTrainingStats',
          ];

          const migratedData: Partial<UserData> = {};
          let hasLocalData = false;

          for (const key of localDataKeys) {
            const localValue = localStorage.getItem(key);
            if (localValue) {
              try {
                const parsed = JSON.parse(localValue);
                const dataKey = key.replace('local_', '') as keyof UserData;
                (migratedData as any)[dataKey] = parsed;
                hasLocalData = true;
              } catch (e) {
                console.error(`Error parsing ${key}:`, e);
              }
            }
          }

          if (hasLocalData) {
            // Save migrated data to Firebase
            await userDataService.saveUserData(user.uid, migratedData);
            // Clear localStorage after successful migration
            localDataKeys.forEach(key => localStorage.removeItem(key));
            setUserData(migratedData as UserData);
          } else {
            setUserData(null);
          }
        } else {
          setUserData(data);
        }

        setLoading(false);
      } else {
        setUserData(null);
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Save user data
  const saveUserData = async (data: Partial<UserData>) => {
    if (!user) {
      console.warn('Cannot save data: user not logged in');
      return;
    }

    try {
      await userDataService.saveUserData(user.uid, data);
      // Update local state
      setUserData(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  // Update specific field
  const updateField = async <K extends keyof UserData>(
    field: K,
    value: UserData[K]
  ) => {
    if (!user) {
      console.warn('Cannot update data: user not logged in');
      return;
    }

    try {
      await userDataService.updateUserDataField(user.uid, field, value);
      // Update local state
      setUserData(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  // Merge data (useful for arrays)
  const mergeUserData = async (data: Partial<UserData>) => {
    if (!user) {
      console.warn('Cannot merge data: user not logged in');
      return;
    }

    try {
      await userDataService.mergeUserData(user.uid, data);
      // Update local state
      setUserData(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error merging user data:', error);
      throw error;
    }
  };

  return {
    userData,
    loading,
    saveUserData,
    updateField,
    mergeUserData,
  };
};
