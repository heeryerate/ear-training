import React from 'react';

import { getScaleDisplayName, ScaleType } from '../data/scales';

interface PracticeSession {
  date: string;
  scale: string;
  duration: number;
  selectedKeys: string[];
  selectedScales: ScaleType[];
}

interface ScalePracticeProgressProps {
  practiceSessions: PracticeSession[];
}

const ScalePracticeProgress: React.FC<ScalePracticeProgressProps> = ({
  practiceSessions,
}) => {
  // Calculate total practice time
  const totalPracticeTime = practiceSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  // Calculate stats for keys and scales
  const keyStats: Record<string, number> = {};
  const scaleStats: Record<string, number> = {};

  practiceSessions.forEach(session => {
    // Count time for each key in this session
    session.selectedKeys.forEach(key => {
      keyStats[key] = (keyStats[key] || 0) + session.duration;
    });
    // Count time for each scale in this session
    session.selectedScales.forEach(scale => {
      scaleStats[scale] = (scaleStats[scale] || 0) + session.duration;
    });
  });

  // Calculate percentages
  const keyPercentages: Array<{ key: string; percentage: number }> =
    Object.entries(keyStats)
      .map(([key, time]) => ({
        key,
        percentage:
          totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

  const scalePercentages: Array<{ scale: string; percentage: number }> =
    Object.entries(scaleStats)
      .map(([scale, time]) => ({
        scale: getScaleDisplayName(scale as ScaleType),
        percentage:
          totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="scale-practice-container">
      <div className="scale-practice-panel">
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
                    <div className="stat-bar-container">
                      <div
                        className="stat-bar"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="stat-value">{percentage.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-stats">No practice data yet.</p>
            )}
          </div>

          <div className="stats-panel">
            <h3>Practice Time by Scale</h3>
            {scalePercentages.length > 0 ? (
              <div className="stats-list">
                {scalePercentages.map(({ scale, percentage }) => (
                  <div key={scale} className="stat-item">
                    <div className="stat-label">{scale}</div>
                    <div className="stat-bar-container">
                      <div
                        className="stat-bar"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="stat-value">{percentage.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-stats">No practice data yet.</p>
            )}
          </div>
        </div>

        {/* Practice History */}
        <div className="practice-history">
          <h3>Recent Practice Sessions</h3>
          {practiceSessions.length > 0 ? (
            <div className="history-list">
              {practiceSessions.slice(0, 10).map((session, index) => (
                <div key={index} className="history-item">
                  <div className="history-keys">
                    <span className="history-label">Keys: </span>
                    {session.selectedKeys.join(', ')}
                  </div>
                  <div className="history-scales">
                    <span className="history-label">Scales: </span>
                    {session.selectedScales.join(', ')}
                  </div>
                  <div className="history-meta">
                    <div className="history-duration">
                      {Math.floor(session.duration / 60)}m{' '}
                      {session.duration % 60}s
                    </div>
                    <div className="history-date">
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-history">
              No practice sessions yet. Start practicing!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScalePracticeProgress;
