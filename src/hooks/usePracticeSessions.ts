import { useCallback } from 'react';

import { useDataSync } from './useDataSync';
import { UserData } from '../services/userDataService';

type PracticeSessionType =
  | 'scalePracticeSessions'
  | 'chordPracticeSessions'
  | 'sightReadingSessions'
  | 'groovePracticeSessions';

/**
 * Hook for managing practice sessions with automatic sync
 */
export const usePracticeSessions = (sessionType: PracticeSessionType) => {
  const {
    data: sessions,
    setData: setSessions,
    loading,
    syncing,
  } = useDataSync<PracticeSessionType>(sessionType, []);

  const addSession = useCallback(
    (session: any) => {
      const currentSessions = (sessions as any[]) || [];
      setSessions([
        ...currentSessions,
        session,
      ] as UserData[PracticeSessionType]);
    },
    [sessions, setSessions]
  );

  const clearSessions = useCallback(() => {
    setSessions([] as UserData[PracticeSessionType]);
  }, [setSessions]);

  return {
    sessions: (sessions as any[]) || [],
    addSession,
    clearSessions,
    loading,
    syncing,
  };
};
