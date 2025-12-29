import { useEffect, useRef, useState } from 'react';

import { useUser } from '../contexts/UserContext';
import { UserData, userDataService } from '../services/userDataService';

/**
 * Unified data sync hook that handles:
 * - Loading data from Firebase (when logged in) or localStorage (when not)
 * - Saving data to Firebase (when logged in) or localStorage (when not)
 * - Migrating data from localStorage to Firebase when user logs in
 * - Debouncing saves to avoid excessive API calls
 */
export const useDataSync = <K extends keyof UserData>(
  dataKey: K,
  defaultValue: UserData[K]
) => {
  const { user } = useUser();
  const [data, setData] = useState<UserData[K]>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Load data on mount and when user/auth changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (user) {
          // Load from Firebase
          const userData = await userDataService.getUserData(user.uid);
          if (userData && userData[dataKey]) {
            setData(userData[dataKey] as UserData[K]);
          } else {
            // Try to migrate from localStorage
            const localData = localStorage.getItem(`local_${dataKey}`);
            if (localData) {
              try {
                const parsed = JSON.parse(localData);
                setData(parsed);
                // Migrate to Firebase
                await userDataService.updateUserDataField(
                  user.uid,
                  dataKey,
                  parsed
                );
                // Clear localStorage after successful migration
                localStorage.removeItem(`local_${dataKey}`);
              } catch (e) {
                console.error(
                  `Error migrating ${dataKey} from localStorage:`,
                  e
                );
                setData(defaultValue);
              }
            } else {
              setData(defaultValue);
            }
          }
        } else {
          // Load from localStorage
          const localData = localStorage.getItem(`local_${dataKey}`);
          if (localData) {
            try {
              setData(JSON.parse(localData));
            } catch (e) {
              console.error(`Error loading ${dataKey} from localStorage:`, e);
              setData(defaultValue);
            }
          } else {
            setData(defaultValue);
          }
        }
      } catch (error) {
        console.error(`Error loading ${dataKey}:`, error);
        setData(defaultValue);
      } finally {
        setLoading(false);
        isInitialLoadRef.current = false;
      }
    };

    loadData();
  }, [user, dataKey]);

  // Save data with debouncing
  const saveData = async (newData: UserData[K]) => {
    setData(newData);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce saves (wait 1 second after last change)
    saveTimeoutRef.current = setTimeout(async () => {
      setSyncing(true);
      try {
        if (user) {
          // Save to Firebase
          await userDataService.updateUserDataField(user.uid, dataKey, newData);
        } else {
          // Save to localStorage
          localStorage.setItem(`local_${dataKey}`, JSON.stringify(newData));
        }
      } catch (error) {
        console.error(`Error saving ${dataKey}:`, error);
        // Fallback to localStorage if Firebase fails
        try {
          localStorage.setItem(`local_${dataKey}`, JSON.stringify(newData));
        } catch (e) {
          console.error(`Error saving ${dataKey} to localStorage:`, e);
        }
      } finally {
        setSyncing(false);
      }
    }, 1000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    setData: saveData,
    loading,
    syncing,
  };
};
