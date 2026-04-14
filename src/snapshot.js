const { createSession } = require('./session');

/**
 * Creates a snapshot of the current sessions list with a timestamp label.
 * @param {Array} sessions - Array of session objects
 * @param {string} label - Optional label for the snapshot
 * @returns {Object} snapshot object
 */
function createSnapshot(sessions, label = '') {
  if (!Array.isArray(sessions)) {
    throw new Error('sessions must be an array');
  }
  return {
    label: label || `snapshot-${Date.now()}`,
    createdAt: new Date().toISOString(),
    sessions: sessions.map(s => ({ ...s })),
  };
}

/**
 * Restores sessions from a snapshot.
 * @param {Object} snapshot - A snapshot object
 * @returns {Array} array of sessions
 */
function restoreSnapshot(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.sessions)) {
    throw new Error('Invalid snapshot: missing sessions array');
  }
  return snapshot.sessions.map(s => ({ ...s }));
}

/**
 * Lists all snapshots with their labels and creation dates.
 * @param {Array} snapshots - Array of snapshot objects
 * @returns {Array} summary array
 */
function listSnapshots(snapshots) {
  if (!Array.isArray(snapshots)) return [];
  return snapshots.map((snap, index) => ({
    index,
    label: snap.label,
    createdAt: snap.createdAt,
    sessionCount: Array.isArray(snap.sessions) ? snap.sessions.length : 0,
  }));
}

/**
 * Finds a snapshot by label.
 * @param {Array} snapshots
 * @param {string} label
 * @returns {Object|null}
 */
function findSnapshotByLabel(snapshots, label) {
  if (!Array.isArray(snapshots)) return null;
  return snapshots.find(s => s.label === label) || null;
}

module.exports = { createSnapshot, restoreSnapshot, listSnapshots, findSnapshotByLabel };
