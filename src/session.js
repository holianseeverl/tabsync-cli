/**
 * Session module — defines the structure and helpers for tab sessions
 */

'use strict';

const { randomUUID } = require('crypto');

/**
 * Creates a new session object
 * @param {string} name - Human-readable session name
 * @param {Array<{title: string, url: string}>} tabs - List of tabs
 * @returns {object} session
 */
function createSession(name, tabs = []) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Session name must be a non-empty string');
  }

  const validatedTabs = tabs.map((tab, index) => {
    if (!tab.url || typeof tab.url !== 'string') {
      throw new Error(`Tab at index ${index} is missing a valid url`);
    }
    return {
      title: tab.title || tab.url,
      url: tab.url,
    };
  });

  return {
    id: randomUUID(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    tabs: validatedTabs,
  };
}

/**
 * Validates that a plain object looks like a session
 * @param {object} obj
 * @returns {boolean}
 */
function isValidSession(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.createdAt === 'string' &&
    Array.isArray(obj.tabs)
  );
}

module.exports = { createSession, isValidSession };
