export type PracticeModeType = 'regular' | 'pattern';

// Parse pattern input (e.g., "1 2 3 5" -> [1, 2, 3, 5])
export const parsePattern = (patternStr: string): number[] => {
  return patternStr
    .trim()
    .split(/\s+/)
    .map(s => parseInt(s, 10))
    .filter(n => !isNaN(n) && n > 0 && n <= 13);
};

// Derive practice mode from pattern input: if pattern is empty/invalid, use regular mode
export const getPracticeModeType = (
  isPatternModeEnabled: boolean,
  patternInput: string
): PracticeModeType => {
  if (!isPatternModeEnabled) {
    return 'regular';
  }
  const pattern = parsePattern(patternInput);
  return pattern.length > 0 ? 'pattern' : 'regular';
};
