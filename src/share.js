// share.js — generate and parse shareable session links/codes

const { createSession, isValidSession } = require('./session');

/**
 * Encode a session to a base64 share string
 * @param {object} session
 * @returns {string}
 */
function encodeSession(session) {
  if (!isValidSession(session)) {
    throw new Error('Cannot encode invalid session');
  }
  const json = JSON.stringify(session);
  return Buffer.from(json, 'utf8').toString('base64');
}

/**
 * Decode a base64 share string back to a session object
 * @param {string} code
 * @returns {object}
 */
function decodeSession(code) {
  if (typeof code !== 'string' || code.trim() === '') {
    throw new Error('Invalid share code');
  }
  let json;
  try {
    json = Buffer.from(code.trim(), 'base64').toString('utf8');
  } catch (e) {
    throw new Error('Failed to decode share code');
  }
  let session;
  try {
    session = JSON.parse(json);
  } catch (e) {
    throw new Error('Share code contains invalid JSON');
  }
  if (!isValidSession(session)) {
    throw new Error('Decoded data is not a valid session');
  }
  return session;
}

/**
 * Generate a shareable URL using a custom base URL
 * @param {object} session
 * @param {string} baseUrl
 * @returns {string}
 */
function generateShareUrl(session, baseUrl = 'https://tabsync.app/import') {
  const code = encodeSession(session);
  return `${baseUrl}?session=${encodeURIComponent(code)}`;
}

/**
 * Extract and decode a session from a share URL
 * @param {string} url
 * @returns {object}
 */
function decodeShareUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    throw new Error('Invalid URL provided');
  }
  const code = parsed.searchParams.get('session');
  if (!code) {
    throw new Error('No session parameter found in URL');
  }
  return decodeSession(decodeURIComponent(code));
}

module.exports = { encodeSession, decodeSession, generateShareUrl, decodeShareUrl };
