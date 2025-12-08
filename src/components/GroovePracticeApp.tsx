import './GroovePracticeApp.css';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

import { getGroovePattern } from '../data/groovePatterns';
import {
  getAvailableGrooveTypes,
  getGroove,
  GrooveType,
} from '../data/grooves';
import GroovePracticePanel from './GroovePracticePanel';
import GrooveSelectionPanel from './GrooveSelectionPanel';

type ActiveTab = 'practice' | 'progress' | 'settings';

function GroovePracticeApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');

  // Groove selection (multiple selection)
  const [selectedGrooves, setSelectedGrooves] = useState<Set<GrooveType>>(
    new Set<GrooveType>(['metronome-2-4'])
  );

  // Practice state
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentGrooveType, setCurrentGrooveType] = useState<GrooveType | null>(
    null
  );
  const [currentBeat, setCurrentBeat] = useState<number | null>(null);
  const [currentSubdivision, setCurrentSubdivision] = useState<number | null>(
    null
  );
  const [bpm, setBpm] = useState(120);

  // Progress tracking
  const [practiceSessions, setPracticeSessions] = useState<
    Array<{
      date: string;
      groove: string;
      grooveType: GrooveType | null;
      duration: number;
      selectedGrooves: GrooveType[];
      grooveDurations?: Partial<Record<GrooveType, number>>; // Time spent on each groove
    }>
  >([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionGrooveDurations, setSessionGrooveDurations] = useState<
    Partial<Record<GrooveType, number>>
  >({});
  const [currentGrooveStartTime, setCurrentGrooveStartTime] = useState<
    number | null
  >(null);

  // Audio context and loops
  const [metronomeLoop, setMetronomeLoop] = useState<Tone.Loop | null>(null);
  const [hiHatSound, setHiHatSound] = useState<Tone.Noise | null>(null);
  const [snareSound, setSnareSound] = useState<Tone.Noise | null>(null);
  const [kickSound, setKickSound] = useState<Tone.Oscillator | null>(null);
  const [metronomeSound, setMetronomeSound] = useState<Tone.Oscillator | null>(
    null
  );
  const [playbackTimeout, setPlaybackTimeout] = useState<number | null>(null);

  // Mobile-friendly audio initialization
  const initializeAudio = async () => {
    try {
      await Tone.start();
      console.log(`Audio context initialized: ${Tone.context.state}`);
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  };

  // Update BPM dynamically
  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.bpm.value = bpm;
    }
  }, [bpm, isPlaying]);

  // Toggle groove selection
  const toggleGroove = (grooveType: GrooveType) => {
    const newSelectedGrooves = new Set(selectedGrooves);
    if (newSelectedGrooves.has(grooveType)) {
      newSelectedGrooves.delete(grooveType);
    } else {
      newSelectedGrooves.add(grooveType);
    }
    setSelectedGrooves(newSelectedGrooves);
  };

  // Play groove with metronome
  const playGroove = async (
    grooveType: GrooveType,
    trackTime: boolean = false
  ): Promise<void> => {
    // Stop any existing metronome first
    stopMetronome();
    setIsPlaying(false);

    await initializeAudio();

    setIsPlaying(true);
    setCurrentBeat(null);
    setCurrentSubdivision(null);

    // Set BPM
    Tone.Transport.bpm.value = bpm;

    // Set swing for swing groove (0 = straight, 1 = full triplet swing)
    // Typical swing is around 0.6-0.7
    if (grooveType === 'swing' || grooveType === 'shuffle') {
      Tone.Transport.swing = 0.65; // Strong swing feel
    } else {
      Tone.Transport.swing = 0; // Straight eighth notes
    }

    // Create realistic drum sounds using Tone.js synthesis

    // Hi-hat: White noise with high-pass filter and quick decay
    const hiHatNoise = new Tone.Noise('white');
    const hiHatFilter = new Tone.Filter({
      frequency: 10000,
      type: 'highpass',
    });
    const hiHatEnvelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.05,
      sustain: 0,
      release: 0.02,
    });
    hiHatNoise.connect(hiHatFilter);
    hiHatFilter.connect(hiHatEnvelope);
    hiHatEnvelope.toDestination();
    hiHatNoise.start(); // Start noise generator

    // Snare: Pink noise with bandpass filter
    const snareNoise = new Tone.Noise('pink');
    const snareFilter = new Tone.Filter({
      frequency: 8000,
      type: 'bandpass',
      Q: 1,
    });
    const snareEnvelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.15,
      sustain: 0,
      release: 0.1,
    });
    snareNoise.connect(snareFilter);
    snareFilter.connect(snareEnvelope);
    snareEnvelope.toDestination();
    snareNoise.start(); // Start noise generator

    // Kick: Low frequency oscillator with pitch sweep
    const kickOsc = new Tone.Oscillator({
      frequency: 60,
      type: 'sine',
    });
    const kickEnvelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.3,
      sustain: 0,
      release: 0.1,
    });
    const kickFreqEnvelope = new Tone.FrequencyEnvelope({
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
      release: 0.1,
      baseFrequency: 60,
      octaves: 2,
    });
    kickFreqEnvelope.connect(kickOsc.frequency);
    kickOsc.connect(kickEnvelope);
    kickEnvelope.toDestination();

    // Metronome: Clean click sound
    const metronomeOsc = new Tone.Oscillator({
      frequency: 1000,
      type: 'sine',
    });
    const metronomeEnvelope = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.05,
      sustain: 0,
      release: 0.02,
    });
    metronomeOsc.connect(metronomeEnvelope);
    metronomeEnvelope.toDestination();

    // Store references for cleanup
    setHiHatSound(hiHatNoise as any);
    setSnareSound(snareNoise as any);
    setKickSound(kickOsc);
    setMetronomeSound(metronomeOsc);

    // Get the pattern for this groove type
    const pattern = getGroovePattern(grooveType);

    // Calculate swing timing offset for off-beat notes (subdivisions 2, 4, 6, 8)
    // In straight 8ths: off-beat plays at time + 0.5 beat (halfway through the beat)
    // In swing (triplet feel): off-beat plays at time + 2/3 beat
    // So the delay is: (2/3 - 1/2) = 1/6 of a beat
    const isSwingGroove = grooveType === 'swing' || grooveType === 'shuffle';
    const beatDuration = Tone.Time('4n').toSeconds(); // Duration of one beat
    const swingOffset = isSwingGroove ? beatDuration / 6 : 0; // Delay off-beats by 1/6 beat

    // Create metronome loop for eighth note subdivisions
    let beatCount = 0;
    let subdivisionCount = 0;
    const loop = new Tone.Loop(time => {
      subdivisionCount = (subdivisionCount % 8) + 1;
      // Beat 1-4 correspond to subdivisions 1, 3, 5, 7 (quarter notes)
      // Subdivisions 2, 4, 6, 8 are the "and" beats (eighth notes)
      const isQuarterNote = subdivisionCount % 2 === 1;
      const isOffBeat = subdivisionCount % 2 === 0;

      // Calculate actual play time with swing offset for off-beats
      const playTime =
        isOffBeat && isSwingGroove
          ? time + Tone.Time('8n').toSeconds() * swingOffset
          : time;

      if (isQuarterNote) {
        beatCount = Math.floor((subdivisionCount - 1) / 2) + 1;
        setCurrentBeat(beatCount);
        setCurrentSubdivision(null);
      } else {
        setCurrentSubdivision(subdivisionCount);
      }

      // Play hi-hat based on pattern
      if (pattern.hiHat.includes(subdivisionCount)) {
        hiHatEnvelope.triggerAttackRelease(0.05, playTime);
      }

      // Play snare based on pattern
      if (pattern.snare.includes(subdivisionCount)) {
        snareEnvelope.triggerAttackRelease(0.2, playTime);
      }

      // Play kick based on pattern
      if (pattern.kick.includes(subdivisionCount)) {
        kickFreqEnvelope.triggerAttackRelease(0.3, playTime);
        kickOsc.start(playTime);
        kickEnvelope.triggerAttackRelease(0.3, playTime);
        kickOsc.stop(playTime + 0.4);
      }

      // Play metronome click if specified in pattern
      if (pattern.metronome?.includes(subdivisionCount)) {
        metronomeOsc.start(playTime);
        metronomeEnvelope.triggerAttackRelease(0.05, playTime);
        metronomeOsc.stop(playTime + 0.1);
      }
    }, '8n').start(0); // Eighth note loop for subdivisions

    setMetronomeLoop(loop);

    // Start transport
    Tone.Transport.start();

    // Get groove duration
    const groove = getGroove(grooveType);
    const duration = (groove.defaultDuration || 1) * 60; // Duration in seconds

    // Track when this groove started playing
    const grooveStartTime = Date.now();
    setCurrentGrooveStartTime(grooveStartTime);

    // Return promise that resolves when duration is reached
    return new Promise<void>(resolve => {
      const timeoutId = window.setTimeout(() => {
        stopMetronome();
        setIsPlaying(false);
        setCurrentBeat(null);
        setCurrentSubdivision(null);
        setPlaybackTimeout(null);

        // Record time spent on this groove
        if (trackTime) {
          const groovePlayTime = Math.floor(
            (Date.now() - grooveStartTime) / 1000
          );
          if (groovePlayTime > 0) {
            setSessionGrooveDurations(prev => ({
              ...prev,
              [grooveType]: (prev[grooveType] || 0) + groovePlayTime,
            }));
          }
        }

        resolve();
      }, duration * 1000);
      setPlaybackTimeout(timeoutId);
    });
  };

  // Stop metronome
  const stopMetronome = () => {
    // Clear playback timeout if exists
    if (playbackTimeout !== null) {
      clearTimeout(playbackTimeout);
      setPlaybackTimeout(null);
    }

    Tone.Transport.stop();
    Tone.Transport.cancel();

    if (metronomeLoop) {
      metronomeLoop.stop();
      metronomeLoop.dispose();
      setMetronomeLoop(null);
    }
    if (hiHatSound) {
      hiHatSound.stop();
      hiHatSound.dispose();
      setHiHatSound(null);
    }
    if (snareSound) {
      snareSound.stop();
      snareSound.dispose();
      setSnareSound(null);
    }
    if (kickSound) {
      kickSound.stop();
      kickSound.dispose();
      setKickSound(null);
    }
    if (metronomeSound) {
      metronomeSound.stop();
      metronomeSound.dispose();
      setMetronomeSound(null);
    }
    setCurrentBeat(null);
    setCurrentSubdivision(null);
  };

  // Start practice session
  const startPractice = async () => {
    if (selectedGrooves.size === 0) return;

    setIsPracticeMode(true);

    const groovesArray = Array.from(selectedGrooves);

    // Pick a random groove
    const randomGroove =
      groovesArray[Math.floor(Math.random() * groovesArray.length)];

    // Set new groove and play it directly
    setCurrentGrooveType(randomGroove);
    // Start session timer
    setSessionStartTime(Date.now());
    setSessionGrooveDurations({});
    // Wait for groove to finish playing (track time for practice mode)
    await playGroove(randomGroove, true);
  };

  // Play next random groove
  const playNextGroove = async () => {
    if (selectedGrooves.size === 0) return;

    // Stop current groove if playing
    if (isPlaying) {
      stopMetronome();
      setIsPlaying(false);
    }

    const groovesArray = Array.from(selectedGrooves);

    // Filter out the current groove if it exists
    const availableGrooves = groovesArray.filter(
      groove => groove !== currentGrooveType
    );

    // If no other grooves available (only one option), use it anyway
    const groovesToUse =
      availableGrooves.length > 0 ? availableGrooves : groovesArray;

    // Pick a random groove
    const randomGroove =
      groovesToUse[Math.floor(Math.random() * groovesToUse.length)];

    // Set new groove and play it directly
    setCurrentGrooveType(randomGroove);
    await playGroove(randomGroove, true);
  };

  // Stop practice
  const stopPractice = () => {
    // Stop metronome
    stopMetronome();

    setIsPracticeMode(false);
    setCurrentGrooveType(null);
    setIsPlaying(false);

    // End session and record
    if (sessionStartTime) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      if (duration > 0) {
        const lastGroove =
          currentGrooveType !== null
            ? getGroove(currentGrooveType).name
            : 'Practice Session';
        const newSession: {
          date: string;
          groove: string;
          grooveType: GrooveType | null;
          duration: number;
          selectedGrooves: GrooveType[];
          grooveDurations?: Partial<Record<GrooveType, number>>;
        } = {
          date: new Date().toISOString(),
          groove: lastGroove,
          grooveType: currentGrooveType,
          duration,
          selectedGrooves: Array.from(selectedGrooves),
        };

        if (Object.keys(sessionGrooveDurations).length > 0) {
          newSession.grooveDurations = { ...sessionGrooveDurations };
        }

        setPracticeSessions(prev => [newSession, ...prev]);
      }
      setSessionStartTime(null);
      setSessionGrooveDurations({});
      setCurrentGrooveStartTime(null);
    }
  };

  // Repeat current groove
  const repeatGroove = async () => {
    if (!currentGrooveType) return;

    // Stop current groove if playing
    if (isPlaying) {
      stopMetronome();
      setIsPlaying(false);
    }

    // Restart the same groove (track time if in practice mode)
    await playGroove(currentGrooveType, isPracticeMode);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMetronome();
    };
  }, []);

  // Calculate total practice time
  const totalPracticeTime = practiceSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  // Calculate stats for grooves based on actual time spent
  const grooveStats: Record<string, number> = {};

  practiceSessions.forEach(session => {
    if (
      session.grooveDurations &&
      Object.keys(session.grooveDurations).length > 0
    ) {
      // Use actual time spent on each groove
      Object.entries(session.grooveDurations).forEach(([groove, time]) => {
        if (time && time > 0) {
          grooveStats[groove] = (grooveStats[groove] || 0) + time;
        }
      });
    } else if (session.selectedGrooves.length > 0) {
      // Fallback: distribute time evenly among selected grooves
      const timePerGroove = session.duration / session.selectedGrooves.length;
      session.selectedGrooves.forEach(groove => {
        grooveStats[groove] = (grooveStats[groove] || 0) + timePerGroove;
      });
    }
  });

  // Calculate percentages and format time
  const groovePercentages = Object.entries(grooveStats)
    .map(([groove, time]) => ({
      groove,
      time,
      percentage: totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="App">
      <header className="App-header">
        {/* Navigation Bar */}
        <div className="nav-bar">
          <div className="nav-spacer"></div>
          <Link to="/" className="return-button">
            ← Back to Home
          </Link>
        </div>

        <div className="hero-section">
          <div className="hero-header">
            <h1>🥁 Groove Practice Center</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button mobile-only ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          <button
            className={`tab-button ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            🎯 Practice
          </button>
          <button
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            📊 Progress
          </button>
        </div>

        {activeTab === 'practice' ? (
          <div className="panels-container">
            {/* Desktop: Side-by-side layout */}
            <div className="left-panel desktop-only">
              <GrooveSelectionPanel
                selectedGrooves={selectedGrooves}
                onToggleGroove={toggleGroove}
                disabled={isPracticeMode}
              />
            </div>

            {/* Practice Interface - Full width on mobile */}
            <div className="right-panel">
              <GroovePracticePanel
                currentGrooveType={currentGrooveType}
                isPracticeMode={isPracticeMode}
                isPlaying={isPlaying}
                currentBeat={currentBeat}
                currentSubdivision={currentSubdivision}
                bpm={bpm}
                onBpmChange={setBpm}
                onStartPractice={startPractice}
                onStopPractice={stopPractice}
                onRepeatGroove={repeatGroove}
                onNextGroove={playNextGroove}
                selectedGrooves={selectedGrooves}
              />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="settings-container">
            <div className="settings-panel">
              <h2>⚙️ Practice Settings</h2>
              <p>Configure your groove selection preferences.</p>

              <GrooveSelectionPanel
                selectedGrooves={selectedGrooves}
                onToggleGroove={toggleGroove}
                disabled={isPracticeMode}
              />
            </div>
          </div>
        ) : (
          <div className="groove-practice-container">
            <div className="groove-practice-panel">
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
                    {Math.floor(totalPracticeTime / 60)}m{' '}
                    {totalPracticeTime % 60}s
                  </div>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="stats-panels">
                <div className="stats-panel">
                  <h3>Practice Time by Groove</h3>
                  {groovePercentages.length > 0 ? (
                    <div className="stats-list">
                      {groovePercentages.map(({ groove, time, percentage }) => (
                        <div key={groove} className="stat-item">
                          <div className="stat-item-info">
                            <div className="stat-label">
                              {getGroove(groove as GrooveType).name}
                            </div>
                            <div className="stat-time">
                              {Math.floor(time / 60)}m {Math.floor(time % 60)}s
                            </div>
                          </div>
                          <div className="stat-bar-wrapper">
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
                        <div className="history-groove">{session.groove}</div>
                        <div className="history-grooves">
                          Grooves:{' '}
                          {session.selectedGrooves
                            .map(g => getGroove(g).name)
                            .join(', ')}
                        </div>
                        <div className="history-meta">
                          <span>
                            {new Date(session.date).toLocaleDateString()}
                          </span>
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
        )}
      </header>
    </div>
  );
}

export default GroovePracticeApp;
