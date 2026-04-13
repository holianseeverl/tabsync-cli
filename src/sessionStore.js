'use strict';

const fs = require('fs');
const path = require('path');
const { isValidSession } = require('./session');

const DEFAULT_STORE_PATH = path.join(
  process.env.HOME || process.env.USERPROFILE || '.',
  '.tabsync',
  'sessions.json'
);

/**
 * Reads all sessions from the store file.
 * @param {string} storePath
 * @returns {Array<object>}
 */
function loadSessions(storePath = DEFAULT_STORE_PATH) {
  if (!fs.existsSync(storePath)) {
    return [];
  }
  const raw = fs.readFileSync(storePath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('Store file is corrupted: expected a JSON array');
  }
  return parsed.filter(isValidSession);
}

/**
 * Writes the full sessions array to the store file.
 * @param {Array<object>} sessions
 * @param {string} storePath
 */
function saveSessions(sessions, storePath = DEFAULT_STORE_PATH) {
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(storePath, JSON.stringify(sessions, null, 2), 'utf8');
}

/**
 * Appends a single session to the store.
 * @param {object} session
 * @param {string} storePath
 */
function addSession(session, storePath = DEFAULT_STORE_PATH) {
  if (!isValidSession(session)) {
    throw new Error('Cannot add an invalid session object');
  }
  const existing = loadSessions(storePath);
  existing.push(session);
  saveSessions(existing, storePath);
}

/**
 * Removes a session by id from the store.
 * @param {string} id
 * @param {string} storePath
 * @returns {boolean} true if a session was removed
 */
function removeSession(id, storePath = DEFAULT_STORE_PATH) {
  const existing = loadSessions(storePath);
  const filtered = existing.filter((s) => s.id !== id);
  if (filtered.length === existing.length) return false;
  saveSessions(filtered, storePath);
  return true;
}

module.exports = { loadSessions, saveSessions, addSession, removeSession, DEFAULT_STORE_PATH };
