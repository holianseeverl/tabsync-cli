// blocklist.js — block URLs or domains from being saved in sessions

const BLOCKLIST_KEY = 'blocklist';

function getBlocklist(session) {
  return session[BLOCKLIST_KEY] || [];
}

function addToBlocklist(session, pattern) {
  if (!pattern || typeof pattern !== 'string') throw new Error('Invalid pattern');
  const list = getBlocklist(session);
  if (list.includes(pattern)) return session;
  return { ...session, [BLOCKLIST_KEY]: [...list, pattern] };
}

function removeFromBlocklist(session, pattern) {
  const list = getBlocklist(session);
  return { ...session, [BLOCKLIST_KEY]: list.filter(p => p !== pattern) };
}

function clearBlocklist(session) {
  return { ...session, [BLOCKLIST_KEY]: [] };
}

function isBlocked(session, url) {
  if (!url) return false;
  return getBlocklist(session).some(pattern => url.includes(pattern));
}

function filterBlockedTabs(session) {
  const tabs = (session.tabs || []).filter(tab => !isBlocked(session, tab.url));
  return { ...session, tabs };
}

function addToBlocklistByName(sessions, name, pattern) {
  return sessions.map(s => s.name === name ? addToBlocklist(s, pattern) : s);
}

module.exports = {
  getBlocklist,
  addToBlocklist,
  removeFromBlocklist,
  clearBlocklist,
  isBlocked,
  filterBlockedTabs,
  addToBlocklistByName
};
