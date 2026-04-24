/**
 * resonance.js
 * Tracks how well a session "resonates" with the user — a subjective alignment score
 * combining mood, energy, intent, and priority into a single resonance value.
 */

const VALID_RESONANCE = ['low', 'medium', 'high', 'peak'];
const RESONANCE_ORDER = { low: 0, medium: 1, high: 2, peak: 3 };

/**
 * Returns true if the given resonance level is valid.
 */
function isValidResonance(level) {
  return VALID_RESONANCE.includes(level);
}

/**
 * Sets the resonance level on a session.
 */
function setResonance(session, level) {
  if (!isValidResonance(level)) {
    throw new Error(`Invalid resonance level: "${level}". Must be one of: ${VALID_RESONANCE.join(', ')}`);
  }
  return { ...session, resonance: level };
}

/**
 * Clears the resonance level from a session.
 */
function clearResonance(session) {
  const updated = { ...session };
  delete updated.resonance;
  return updated;
}

/**
 * Sets resonance on a session matched by name.
 */
function setResonanceByName(sessions, name, level) {
  return sessions.map(s => s.name === name ? setResonance(s, level) : s);
}

/**
 * Gets the resonance level of a session, or null if unset.
 */
function getResonance(session) {
  return session.resonance || null;
}

/**
 * Filters sessions by a specific resonance level.
 */
function filterByResonance(sessions, level) {
  if (!isValidResonance(level)) {
    throw new Error(`Invalid resonance level: "${level}"`);
  }
  return sessions.filter(s => s.resonance === level);
}

/**
 * Filters sessions at or above a minimum resonance level.
 */
function filterByMinResonance(sessions, minLevel) {
  if (!isValidResonance(minLevel)) {
    throw new Error(`Invalid resonance level: "${minLevel}"`);
  }
  const min = RESONANCE_ORDER[minLevel];
  return sessions.filter(s => s.resonance && RESONANCE_ORDER[s.resonance] >= min);
}

/**
 * Sorts sessions by resonance level (descending by default).
 */
function sortByResonance(sessions, ascending = false) {
  return [...sessions].sort((a, b) => {
    const ra = RESONANCE_ORDER[a.resonance] ?? -1;
    const rb = RESONANCE_ORDER[b.resonance] ?? -1;
    return ascending ? ra - rb : rb - ra;
  });
}

module.exports = {
  isValidResonance,
  setResonance,
  clearResonance,
  setResonanceByName,
  getResonance,
  filterByResonance,
  filterByMinResonance,
  sortByResonance,
  VALID_RESONANCE,
};
