// history.js — track session open/close history events

const { v4: uuidv4 } = require('uuid');

/**
 * @typedef {Object} HistoryEntry
 * @property {string} id
 * @property {string} sessionId
 * @property {string} sessionName
 * @property {'opened'|'closed'|'imported'|'exported'} action
 * @property {string} timestamp
 */

function createHistoryEntry(sessionId, sessionName, action) {
  if (!sessionId || !sessionName || !action) {
    throw new Error('sessionId, sessionName, and action are required');
  }
  const validActions = ['opened', 'closed', 'imported', 'exported'];
  if (!validActions.includes(action)) {
    throw new Error(`Invalid action: ${action}. Must be one of ${validActions.join(', ')}`);
  }
  return {
    id: uuidv4(),
    sessionId,
    sessionName,
    action,
    timestamp: new Date().toISOString(),
  };
}

function addHistoryEntry(history, sessionId, sessionName, action) {
  const entry = createHistoryEntry(sessionId, sessionName, action);
  return [...history, entry];
}

function getHistoryForSession(history, sessionId) {
  return history.filter((e) => e.sessionId === sessionId);
}

function clearHistory(history, sessionId) {
  if (sessionId) {
    return history.filter((e) => e.sessionId !== sessionId);
  }
  return [];
}

function filterHistoryByAction(history, action) {
  return history.filter((e) => e.action === action);
}

function getRecentHistory(history, limit = 10) {
  return [...history]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

module.exports = {
  createHistoryEntry,
  addHistoryEntry,
  getHistoryForSession,
  clearHistory,
  filterHistoryByAction,
  getRecentHistory,
};
