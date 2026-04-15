// shareCmd.js — CLI handlers for share/receive commands

const { encodeSession, decodeSession, generateShareUrl, decodeShareUrl } = require('../share');
const { loadSessions, saveSessions, addSession } = require('../sessionStore');

/**
 * Handle: tabsync share <sessionName> [--url]
 */
async function handleShare(sessionName, options = {}, filePath = 'sessions.json') {
  const sessions = await loadSessions(filePath);
  const session = sessions.find(s => s.name === sessionName);
  if (!session) {
    console.error(`Session "${sessionName}" not found.`);
    return;
  }
  if (options.url) {
    const url = generateShareUrl(session, options.baseUrl);
    console.log(`Share URL:\n${url}`);
  } else {
    const code = encodeSession(session);
    console.log(`Share code for "${sessionName}":\n${code}`);
  }
}

/**
 * Handle: tabsync receive <code|url>
 */
async function handleReceive(input, options = {}, filePath = 'sessions.json') {
  let session;
  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      session = decodeShareUrl(input);
    } else {
      session = decodeSession(input);
    }
  } catch (err) {
    console.error(`Failed to decode: ${err.message}`);
    return;
  }

  const sessions = await loadSessions(filePath);
  const exists = sessions.some(s => s.id === session.id || s.name === session.name);
  if (exists && !options.force) {
    console.error(`A session with the same name or ID already exists. Use --force to overwrite.`);
    return;
  }

  const filtered = exists ? sessions.filter(s => s.id !== session.id && s.name !== session.name) : sessions;
  const updated = addSession(filtered, session);
  await saveSessions(filePath, updated);
  console.log(`Session "${session.name}" imported successfully.`);
}

module.exports = { handleShare, handleReceive };
