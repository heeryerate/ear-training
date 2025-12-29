import './TunesLibraryApp.css';

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  DifficultyLevel,
  FamiliarityLevel,
  FormType,
  HarmonicLogicType,
  standardTunes,
  Tune,
} from '../data/tunes';

type ActiveTab = 'library' | 'progress' | 'settings';

interface TuneMetadata {
  familiarity?: FamiliarityLevel;
}

type TuneWithMetadata = Tune & {
  familiarity?: FamiliarityLevel;
};

// Fuzzy search helper function
const fuzzyMatch = (text: string, query: string): boolean => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) return true;

  // If query is very short, use simple includes
  if (query.length <= 2) {
    return textLower.includes(queryLower);
  }

  // Fuzzy matching: check if all query characters appear in order
  let textIndex = 0;
  for (let i = 0; i < queryLower.length; i++) {
    const char = queryLower[i];
    const foundIndex = textLower.indexOf(char, textIndex);
    if (foundIndex === -1) {
      // Character not found, but allow for typos (skip one character)
      // Try finding the next character
      if (i < queryLower.length - 1) {
        const nextChar = queryLower[i + 1];
        const nextFoundIndex = textLower.indexOf(nextChar, textIndex);
        if (nextFoundIndex !== -1) {
          textIndex = nextFoundIndex + 1;
          i++; // Skip current character
          continue;
        }
      }
      return false;
    }
    textIndex = foundIndex + 1;
  }
  return true;
};

// Calculate similarity score for ranking
const calculateSimilarity = (text: string, query: string): number => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match gets highest score
  if (textLower === queryLower) return 100;
  if (textLower.startsWith(queryLower)) return 90;
  if (textLower.includes(queryLower)) return 80;

  // Calculate character overlap
  let matches = 0;
  let textIndex = 0;
  for (let i = 0; i < queryLower.length; i++) {
    const char = queryLower[i];
    const foundIndex = textLower.indexOf(char, textIndex);
    if (foundIndex !== -1) {
      matches++;
      textIndex = foundIndex + 1;
    }
  }

  return (matches / queryLower.length) * 70;
};

// Progress Stats Component
const ProgressStats = ({ tunes }: { tunes: TuneWithMetadata[] }) => {
  // Calculate weighted progress based on familiarity
  // 0 stars = 0%, 1 star = 20%, 2 stars = 40%, 3 stars = 60%, 4 stars = 80%, 5 stars = 100%
  const getFamiliarityWeight = (
    familiarity: FamiliarityLevel | undefined
  ): number => {
    return (familiarity ?? 0) * 20;
  };

  // Calculate category stats with familiarity weighting
  const calculateCategoryStats = (
    getCategory: (tune: TuneWithMetadata) => string
  ) => {
    const stats: Record<
      string,
      { total: number; weighted: number; count: number }
    > = {};

    tunes.forEach(tune => {
      const category = getCategory(tune);
      if (!stats[category]) {
        stats[category] = { total: 0, weighted: 0, count: 0 };
      }
      stats[category].total += 1;
      stats[category].count += 1;
      stats[category].weighted += getFamiliarityWeight(tune.familiarity);
    });

    return Object.entries(stats).map(([category, data]) => ({
      category,
      count: data.count,
      total: data.total,
      percentage: (data.count / tunes.length) * 100,
      progressPercentage: data.total > 0 ? data.weighted / data.total : 0,
    }));
  };

  const formStats = calculateCategoryStats(tune => tune.form).sort(
    (a, b) => b.progressPercentage - a.progressPercentage
  );

  const harmonicStats = calculateCategoryStats(tune => tune.harmonicLogic).sort(
    (a, b) => b.progressPercentage - a.progressPercentage
  );

  const styleStats = calculateCategoryStats(tune => tune.style).sort(
    (a, b) => b.progressPercentage - a.progressPercentage
  );

  const difficultyStats = calculateCategoryStats(tune => tune.difficulty).sort(
    (a, b) => b.progressPercentage - a.progressPercentage
  );

  // Overall progress (average of all tunes' familiarity)
  const overallProgress =
    tunes.length > 0
      ? tunes.reduce(
          (sum, tune) => sum + getFamiliarityWeight(tune.familiarity),
          0
        ) / tunes.length
      : 0;

  const ratedCount = tunes.filter(tune => (tune.familiarity ?? 0) > 0).length;
  const masteredCount = tunes.filter(tune => tune.familiarity === 5).length;

  return (
    <div className="progress-content">
      {/* Overall Stats */}
      <div className="progress-summary">
        <div className="stat-card">
          <div className="stat-label">Total Tunes</div>
          <div className="stat-value">{tunes.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rated Tunes</div>
          <div className="stat-value">{ratedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mastered (5★)</div>
          <div className="stat-value">{masteredCount}</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-label">Overall Progress</div>
          <div className="stat-value">{overallProgress.toFixed(1)}%</div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="stats-panels">
        <div className="stats-panel">
          <h3>Progress by Form</h3>
          {formStats.length > 0 ? (
            <div className="stats-list">
              {formStats.map(
                ({ category, count, percentage, progressPercentage }) => (
                  <div key={category} className="stat-item">
                    <div className="stat-header">
                      <div className="stat-label">{category}</div>
                      <div className="stat-count">{count} tunes</div>
                    </div>
                    <div className="progress-bars">
                      <div className="progress-bar-group">
                        <div className="progress-bar-label">Repertoire</div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill repertoire"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="progress-bar-group">
                        <div className="progress-bar-label">Progress</div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill progress"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {progressPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </div>

        <div className="stats-panel">
          <h3>Progress by Harmonic Logic</h3>
          {harmonicStats.length > 0 ? (
            <div className="stats-list">
              {harmonicStats.map(
                ({ category, count, percentage, progressPercentage }) => (
                  <div key={category} className="stat-item">
                    <div className="stat-header">
                      <div className="stat-label">{category}</div>
                      <div className="stat-count">{count} tunes</div>
                    </div>
                    <div className="progress-bars">
                      <div className="progress-bar-group">
                        <div className="progress-bar-label">Repertoire</div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill repertoire"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="progress-bar-group">
                        <div className="progress-bar-label">Progress</div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill progress"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {progressPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </div>

        <div className="stats-panel">
          <h3>Progress by Style</h3>
          {styleStats.length > 0 ? (
            <div className="stats-list">
              {styleStats.map(
                ({ category, count, percentage, progressPercentage }) => (
                  <div key={category} className="stat-item">
                    <div className="stat-header">
                      <div className="stat-label">{category}</div>
                      <div className="stat-count">{count} tunes</div>
                    </div>
                    <div className="progress-bars">
                      <div className="progress-bar-group">
                        <div className="progress-bar-label">Repertoire</div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill repertoire"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="progress-bar-group">
                        <div className="progress-bar-label">Progress</div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill progress"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {progressPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </div>

        <div className="stats-panel">
          <h3>Progress by Difficulty</h3>
          {difficultyStats.length > 0 ? (
            <div className="stats-list">
              {difficultyStats.map(
                ({ category, count, percentage, progressPercentage }) => (
                  <div key={category} className="stat-item">
                    <div className="stat-header">
                      <div className="stat-label">{category}</div>
                      <div className="stat-count">{count} tunes</div>
                    </div>
                    <div className="progress-bars">
                      <div className="progress-bar-group">
                        <div className="progress-bar-label">Repertoire</div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill repertoire"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="progress-bar-group">
                        <div className="progress-bar-label">Progress</div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill progress"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {progressPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="empty-state">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

function TunesLibraryApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');
  const [selectedTune, setSelectedTune] = useState<TuneWithMetadata | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<
    DifficultyLevel | 'all'
  >('all');
  const [familiarityFilter, setFamiliarityFilter] = useState<
    FamiliarityLevel | 'all'
  >('all');
  const [formFilter, setFormFilter] = useState<FormType | 'all'>('all');
  const [harmonicFilter, setHarmonicFilter] = useState<
    HarmonicLogicType | 'all'
  >('all');
  const [sortBy, setSortBy] = useState<
    'title' | 'composer' | 'difficulty' | 'familiarity' | 'form' | 'harmonic'
  >('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // Star rating component
  const StarRating = ({
    rating,
    onRatingChange,
    interactive = false,
  }: {
    rating: FamiliarityLevel | undefined;
    onRatingChange?: (rating: FamiliarityLevel) => void;
    interactive?: boolean;
  }) => {
    const stars = [1, 2, 3, 4, 5] as const;
    const currentRating = rating || 0;

    const handleClick = (star: number) => {
      if (interactive && onRatingChange) {
        const newRating =
          currentRating === star ? 0 : (star as FamiliarityLevel);
        onRatingChange(newRating);
      }
    };

    return (
      <div className="star-rating">
        {stars.map(star => (
          <span
            key={star}
            className={`star ${star <= currentRating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => handleClick(star)}
            onKeyDown={e => {
              if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleClick(star);
              }
            }}
            tabIndex={interactive ? 0 : -1}
            role={interactive ? 'button' : undefined}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            ★
          </span>
        ))}
        {currentRating === 0 && !interactive && (
          <span className="no-rating">No rating</span>
        )}
      </div>
    );
  };

  // Load tune metadata from localStorage
  const [tuneMetadata, setTuneMetadata] = useState<
    Record<string, TuneMetadata>
  >(() => {
    const saved = localStorage.getItem('tunesMetadata');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage when metadata changes
  useEffect(() => {
    localStorage.setItem('tunesMetadata', JSON.stringify(tuneMetadata));
  }, [tuneMetadata]);

  // Merge tunes with metadata
  const tunesWithMetadata = useMemo((): TuneWithMetadata[] => {
    return standardTunes.map(tune => {
      const metadata = tuneMetadata[tune.id];
      const result: TuneWithMetadata = {
        ...tune,
      };
      if (metadata?.familiarity) {
        result.familiarity = metadata.familiarity;
      }
      return result;
    });
  }, [tuneMetadata]);

  // Helper function to check if tune matches filters
  const matchesFilters = (tune: TuneWithMetadata): boolean => {
    // Search filter with fuzzy matching
    if (searchQuery) {
      const matchesTitle = fuzzyMatch(tune.title, searchQuery);
      const matchesComposer = tune.composer
        ? fuzzyMatch(tune.composer, searchQuery)
        : false;
      if (!matchesTitle && !matchesComposer) return false;
    }

    // Difficulty filter
    if (difficultyFilter !== 'all' && tune.difficulty !== difficultyFilter)
      return false;

    // Familiarity filter
    if (familiarityFilter !== 'all') {
      const tuneRating = tune.familiarity ?? 0;
      if (familiarityFilter === 0) {
        if (tuneRating !== 0) return false;
      } else if (tuneRating !== familiarityFilter) {
        return false;
      }
    }

    // Form filter
    if (formFilter !== 'all' && tune.form !== formFilter) return false;

    // Harmonic filter
    if (harmonicFilter !== 'all' && tune.harmonicLogic !== harmonicFilter)
      return false;

    return true;
  };

  // Filter and sort tunes with fuzzy search ranking
  const filteredTunes = useMemo(() => {
    const filtered = tunesWithMetadata.filter(matchesFilters);

    // If there's a search query, sort by relevance (similarity score)
    if (searchQuery) {
      return filtered.sort((a, b) => {
        const scoreA = Math.max(
          calculateSimilarity(a.title, searchQuery),
          a.composer ? calculateSimilarity(a.composer, searchQuery) : 0
        );
        const scoreB = Math.max(
          calculateSimilarity(b.title, searchQuery),
          b.composer ? calculateSimilarity(b.composer, searchQuery) : 0
        );
        return scoreB - scoreA; // Higher score first
      });
    }

    return filtered;
  }, [
    tunesWithMetadata,
    searchQuery,
    difficultyFilter,
    familiarityFilter,
    formFilter,
    harmonicFilter,
  ]);

  // Helper function to get sort value
  const getSortValue = (tune: TuneWithMetadata): string | number => {
    switch (sortBy) {
      case 'title':
        return tune.title.toLowerCase();
      case 'composer':
        return (tune.composer || '').toLowerCase();
      case 'difficulty':
        const difficultyOrder: Record<DifficultyLevel, number> = {
          entry: 1,
          intermediate: 2,
          professional: 3,
        };
        return difficultyOrder[tune.difficulty];
      case 'familiarity':
        return tune.familiarity ?? 0;
      case 'form':
        return tune.form;
      case 'harmonic':
        return tune.harmonicLogic;
      default:
        return '';
    }
  };

  // Sort filtered tunes (only if not searching, as search already sorts by relevance)
  const sortedAndFilteredTunes = useMemo(() => {
    // If searching, filteredTunes is already sorted by relevance from fuzzy search
    if (searchQuery) {
      return filteredTunes;
    }

    // Otherwise, apply user's sort preference
    const sorted = [...filteredTunes].sort((a, b) => {
      const aVal = getSortValue(a);
      const bVal = getSortValue(b);
      const comparison =
        typeof aVal === 'string'
          ? aVal.localeCompare(bVal as string)
          : (aVal as number) - (bVal as number);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredTunes, sortBy, sortOrder, searchQuery]);

  const setFamiliarity = (tuneId: string, level: FamiliarityLevel) => {
    setTuneMetadata(prev => ({
      ...prev,
      [tuneId]: {
        ...prev[tuneId],
        familiarity: level,
      },
    }));
  };

  // Count active filters
  const activeFilterCount =
    (difficultyFilter !== 'all' ? 1 : 0) +
    (familiarityFilter !== 'all' ? 1 : 0) +
    (formFilter !== 'all' ? 1 : 0) +
    (harmonicFilter !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setFamiliarityFilter('all');
    setFormFilter('all');
    setHarmonicFilter('all');
  };

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
            <h1>🎵 Tunes Library</h1>
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
            className={`tab-button ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            📚 Library
          </button>
          <button
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            📊 Progress
          </button>
        </div>

        {activeTab === 'library' ? (
          <div className="tunes-library-container">
            <div className="tunes-library-panel">
              <h2>Your Tunes Collection</h2>
              <p>
                Browse and practice your favorite tunes (
                {sortedAndFilteredTunes.length} of {standardTunes.length} tunes)
              </p>

              {/* Search and Filters */}
              <div className="search-filters">
                <div className="controls-container">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="🔍 Search by title or composer..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="filters-sort-row">
                    <div className="filter-group">
                      <select
                        value={difficultyFilter}
                        onChange={e =>
                          setDifficultyFilter(
                            e.target.value as DifficultyLevel | 'all'
                          )
                        }
                        className="filter-select"
                      >
                        <option value="all">All Difficulty</option>
                        <option value="entry">Entry</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <select
                        value={familiarityFilter}
                        onChange={e =>
                          setFamiliarityFilter(
                            e.target.value === 'all'
                              ? 'all'
                              : (Number.parseInt(
                                  e.target.value,
                                  10
                                ) as FamiliarityLevel)
                          )
                        }
                        className="filter-select"
                      >
                        <option value="all">All Familiarity</option>
                        <option value="0">No rating</option>
                        <option value="1">1 star</option>
                        <option value="2">2 stars</option>
                        <option value="3">3 stars</option>
                        <option value="4">4 stars</option>
                        <option value="5">5 stars</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <select
                        value={formFilter}
                        onChange={e =>
                          setFormFilter(e.target.value as FormType | 'all')
                        }
                        className="filter-select"
                      >
                        <option value="all">All Form</option>
                        <option value="32-bar">32-bar</option>
                        <option value="AABA">AABA</option>
                        <option value="ABAC">ABAC</option>
                        <option value="modal">Modal</option>
                        <option value="non-functional">Non-functional</option>
                        <option value="blues">Blues</option>
                        <option value="ballad">Ballad</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <select
                        value={harmonicFilter}
                        onChange={e =>
                          setHarmonicFilter(
                            e.target.value as HarmonicLogicType | 'all'
                          )
                        }
                        className="filter-select"
                      >
                        <option value="all">All Harmonic</option>
                        <option value="functional">Functional</option>
                        <option value="long sections">Long Sections</option>
                        <option value="fast changes">Fast Changes</option>
                        <option value="modal">Modal</option>
                        <option value="chromatic">Chromatic</option>
                      </select>
                    </div>

                    <div className="sort-group">
                      <select
                        value={sortBy}
                        onChange={e =>
                          setSortBy(
                            e.target.value as
                              | 'title'
                              | 'composer'
                              | 'difficulty'
                              | 'familiarity'
                              | 'form'
                              | 'harmonic'
                          )
                        }
                        className="filter-select"
                      >
                        <option value="title">Sort: Title</option>
                        <option value="composer">Sort: Composer</option>
                        <option value="difficulty">Sort: Difficulty</option>
                        <option value="familiarity">Sort: Familiarity</option>
                        <option value="form">Sort: Form</option>
                        <option value="harmonic">Sort: Harmonic</option>
                      </select>
                      <button
                        onClick={() =>
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                        }
                        className="sort-order-btn"
                        title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                      >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                    </div>

                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="clear-filters-btn"
                        title="Clear all filters"
                      >
                        Clear ({activeFilterCount})
                      </button>
                    )}

                    <div className="view-toggle-group">
                      <button
                        onClick={() => setViewMode('card')}
                        className={`view-toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
                        title="Card view"
                      >
                        ▦
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        title="List view"
                      >
                        ☰
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {!selectedTune && (
                <div className="tunes-list">
                  {sortedAndFilteredTunes.length > 0 ? (
                    viewMode === 'card' ? (
                      <div className="tunes-grid">
                        {sortedAndFilteredTunes.map(tune => (
                          <div
                            key={tune.id}
                            className="tune-card"
                            onClick={() => setSelectedTune(tune)}
                          >
                            <div className="tune-header">
                              <div className="tune-title">{tune.title}</div>
                            </div>
                            {tune.composer && (
                              <div className="tune-composer">
                                by {tune.composer}
                              </div>
                            )}
                            <div className="tune-categorization">
                              <div className="categorization-item">
                                <span className="label">Form:</span>
                                <span className="value">{tune.form}</span>
                              </div>
                              <div className="categorization-item">
                                <span className="label">Harmonic:</span>
                                <span className="value">
                                  {tune.harmonicLogic}
                                </span>
                              </div>
                              <div className="categorization-item">
                                <span className="label">Tempo:</span>
                                <span className="value">
                                  {tune.tempoPressure}
                                </span>
                              </div>
                              <div className="categorization-item">
                                <span className="label">Style:</span>
                                <span className="value">{tune.style}</span>
                              </div>
                            </div>
                            <div className="tune-meta">
                              <span
                                className={`difficulty-badge difficulty-${tune.difficulty}`}
                              >
                                {tune.difficulty}
                              </span>
                              <div
                                onClick={e => e.stopPropagation()}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                  }
                                }}
                              >
                                <StarRating
                                  rating={tune.familiarity}
                                  onRatingChange={rating =>
                                    setFamiliarity(tune.id, rating)
                                  }
                                  interactive={true}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="tunes-list-view">
                        {sortedAndFilteredTunes.map(tune => (
                          <div
                            key={tune.id}
                            className="tune-list-item"
                            onClick={() => setSelectedTune(tune)}
                          >
                            <div className="tune-list-main">
                              <div className="tune-list-title-section">
                                <div className="tune-list-title">
                                  {tune.title}
                                </div>
                                {tune.composer && (
                                  <div className="tune-list-composer">
                                    by {tune.composer}
                                  </div>
                                )}
                              </div>
                              <div className="tune-list-meta">
                                <span
                                  className={`difficulty-badge difficulty-${tune.difficulty}`}
                                >
                                  {tune.difficulty}
                                </span>
                                <div
                                  onClick={e => e.stopPropagation()}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.stopPropagation();
                                    }
                                  }}
                                >
                                  <StarRating
                                    rating={tune.familiarity}
                                    onRatingChange={rating =>
                                      setFamiliarity(tune.id, rating)
                                    }
                                    interactive={true}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="tune-list-categorization">
                              <span className="tune-list-tag">{tune.form}</span>
                              <span className="tune-list-tag">
                                {tune.harmonicLogic}
                              </span>
                              <span className="tune-list-tag">
                                {tune.tempoPressure}
                              </span>
                              <span className="tune-list-tag">
                                {tune.style}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="empty-state">
                      No tunes found matching your filters.
                    </p>
                  )}
                </div>
              )}

              {selectedTune && (
                <div className="tune-details-expanded">
                  <div className="tune-details-header">
                    <button
                      className="return-details-btn"
                      onClick={() => setSelectedTune(null)}
                      aria-label="Return to library"
                    >
                      ← Back to Library
                    </button>
                    <div className="tune-details-title-section">
                      <h3>{selectedTune.title}</h3>
                      {selectedTune.composer && (
                        <p className="tune-details-composer">
                          by {selectedTune.composer}
                        </p>
                      )}
                    </div>
                    <button
                      className="close-details-btn"
                      onClick={() => setSelectedTune(null)}
                      aria-label="Close details"
                    >
                      ×
                    </button>
                  </div>

                  <div className="tune-details-content">
                    <div className="tune-quick-info">
                      <div className="quick-info-item">
                        <span className="quick-info-label">Form:</span>
                        <span className="quick-info-value">
                          {selectedTune.form}
                        </span>
                      </div>
                      <div className="quick-info-item">
                        <span className="quick-info-label">Harmonic:</span>
                        <span className="quick-info-value">
                          {selectedTune.harmonicLogic}
                        </span>
                      </div>
                      <div className="quick-info-item">
                        <span className="quick-info-label">Tempo:</span>
                        <span className="quick-info-value">
                          {selectedTune.tempoPressure}
                        </span>
                      </div>
                      <div className="quick-info-item">
                        <span className="quick-info-label">Style:</span>
                        <span className="quick-info-value">
                          {selectedTune.style}
                        </span>
                      </div>
                      <div className="quick-info-item">
                        <span className="quick-info-label">Difficulty:</span>
                        <span
                          className={`difficulty-badge difficulty-${selectedTune.difficulty}`}
                        >
                          {selectedTune.difficulty}
                        </span>
                      </div>
                      <div className="quick-info-item">
                        <span className="quick-info-label">Familiarity:</span>
                        <StarRating
                          rating={selectedTune.familiarity}
                          onRatingChange={rating =>
                            setFamiliarity(selectedTune.id, rating)
                          }
                          interactive={true}
                        />
                      </div>
                    </div>

                    {selectedTune.description && (
                      <div className="tune-details-section">
                        <h4>About This Tune</h4>
                        <p className="tune-description">
                          {selectedTune.description}
                        </p>
                      </div>
                    )}

                    {selectedTune.recommendedListening &&
                      selectedTune.recommendedListening.length > 0 && (
                        <div className="tune-details-section">
                          <h4>Recommended Listening</h4>
                          <ul className="recommended-listening">
                            {selectedTune.recommendedListening.map(
                              (recording, index) => {
                                const searchQuery = `${recording.artist} ${selectedTune.title}${recording.album ? ` ${recording.album}` : ''}`;
                                const youtubeUrl =
                                  recording.youtubeUrl ||
                                  `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
                                return (
                                  <li key={index} className="recording-item">
                                    <div className="recording-info">
                                      <span className="recording-artist">
                                        {recording.artist}
                                      </span>
                                      {recording.album && (
                                        <span className="recording-album">
                                          {' '}
                                          {recording.album}
                                          {recording.year &&
                                            ` (${recording.year})`}
                                        </span>
                                      )}
                                    </div>
                                    <a
                                      href={youtubeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="youtube-link"
                                      title={
                                        recording.youtubeUrl
                                          ? 'Listen on YouTube'
                                          : 'Search on YouTube'
                                      }
                                    >
                                      <span>▶</span>
                                      <span>
                                        {recording.youtubeUrl
                                          ? 'Listen'
                                          : 'Search'}
                                      </span>
                                    </a>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      )}

                    {(selectedTune.leadSheetUrl || selectedTune.title) && (
                      <div className="tune-details-section">
                        <h4>Lead Sheet</h4>
                        <div className="lead-sheet-container">
                          {selectedTune.leadSheetUrl ? (
                            <a
                              href={selectedTune.leadSheetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="lead-sheet-link"
                            >
                              <span className="lead-sheet-icon">🎼</span>
                              <span>View Lead Sheet</span>
                              {selectedTune.leadSheetSource && (
                                <span className="lead-sheet-source">
                                  {' '}
                                  ({selectedTune.leadSheetSource})
                                </span>
                              )}
                            </a>
                          ) : (
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(
                                `${selectedTune.title} jazz lead sheet`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="lead-sheet-link search-link"
                            >
                              <span className="lead-sheet-icon">🔍</span>
                              <span>Search Lead Sheet</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="settings-container">
            <div className="settings-panel">
              <h2>⚙️ Library Settings</h2>
              <p>Configure your tunes library preferences.</p>
            </div>
          </div>
        ) : (
          <div className="tunes-library-container">
            <div className="tunes-library-panel">
              <h2>📊 Practice Progress</h2>
              <p>Track your progress learning tunes</p>
              <ProgressStats tunes={tunesWithMetadata} />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default TunesLibraryApp;
