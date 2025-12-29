import React from 'react';

import { ChordType } from '../data/chords';

interface PracticeSession {
  date: string;
  chord: string;
  duration: number;
  selectedKeys: string[];
  selectedChords: ChordType[];
}

interface ChordPracticeProgressProps {
  practiceSessions: PracticeSession[];
}

const ChordPracticeProgress: React.FC<ChordPracticeProgressProps> = ({
  practiceSessions,
}) => {
  // Calculate total practice time
  const totalPracticeTime = practiceSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  // Calculate stats for keys and chords
  const keyStats: Record<string, number> = {};
  const chordStats: Record<string, number> = {};

  practiceSessions.forEach(session => {
    // Count time for each key in this session
    session.selectedKeys.forEach(key => {
      keyStats[key] = (keyStats[key] || 0) + session.duration;
    });
    // Count time for each chord in this session
    session.selectedChords.forEach(chord => {
      chordStats[chord] = (chordStats[chord] || 0) + session.duration;
    });
  });

  // Calculate percentages
  const keyPercentages = Object.entries(keyStats)
    .map(([key, time]) => ({
      key,
      percentage: totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const chordPercentages = Object.entries(chordStats)
    .map(([chord, time]) => ({
      chord,
      percentage: totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="chord-practice-container">
      <div className="chord-practice-panel progress-panel">
        <h2>📊 Practice Progress</h2>

        {/* Statistics Summary */}
        <div className="progress-summary">
          <div className="stat-card">
            <div className="stat-label">Total Sessions</div>
            <div className="stat-value">{practiceSessions.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Practice Time</div>
            <div className="stat-value">
              {Math.floor(totalPracticeTime / 60)}m {totalPracticeTime % 60}s
            </div>
          </div>
        </div>

        {/* Stats Panels */}
        <div className="stats-panels">
          <div className="stats-panel">
            <h3>Practice Time by Key</h3>
            {keyPercentages.length > 0 ? (
              <div className="stats-list">
                {keyPercentages.map(({ key, percentage }) => (
                  <div key={key} className="stat-item">
                    <div className="stat-label">{key}</div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="progress-percentage">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No practice data yet.</p>
            )}
          </div>

          <div className="stats-panel">
            <h3>Practice Time by Chord</h3>
            {chordPercentages.length > 0 ? (
              <div className="stats-list">
                {chordPercentages.map(({ chord, percentage }) => (
                  <div key={chord} className="stat-item">
                    <div className="stat-label">{chord}</div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="progress-percentage">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No practice data yet.</p>
            )}
          </div>
        </div>

        {/* Recent Practice Sessions */}
        <div className="history-section">
          <h3>Recent Practice Sessions</h3>
          {practiceSessions.length > 0 ? (
            <div className="history-list">
              {practiceSessions.slice(0, 10).map((session, index) => (
                <div key={index} className="history-item">
                  <div className="history-chord">{session.chord}</div>
                  <div className="history-keys">
                    Keys: {session.selectedKeys.join(', ')}
                  </div>
                  <div className="history-chords">
                    Chords: {session.selectedChords.join(', ')}
                  </div>
                  <div className="history-meta">
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                    <span>
                      {Math.floor(session.duration / 60)}m{' '}
                      {session.duration % 60}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No practice sessions yet. Start practicing!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChordPracticeProgress;
