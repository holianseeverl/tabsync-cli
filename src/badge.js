// badge.js — assign/remove/filter badge decorators on sessions

const VALID_BADGES = ['new', 'updated', 'important', 'review', 'done'];

function isValidBadge(badge) {
  return VALID_BADGES.includes(badge);
}

function setBadge(sessions, id, badge) {
  if (!isValidBadge(badge)) throw new Error(`Invalid badge: ${badge}`);
  return sessions.map(s => s.id === id ? { ...s, badge } : s);
}

function clearBadge(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, badge: undefined } : s);
}

function setBadgeByName(sessions, name, badge) {
  if (!isValidBadge(badge)) throw new Error(`Invalid badge: ${badge}`);
  return sessions.map(s => s.name === name ? { ...s, badge } : s);
}

function filterByBadge(sessions, badge) {
  return sessions.filter(s => s.badge === badge);
}

function getBadge(sessions, id) {
  const session = sessions.find(s => s.id === id);
  return session ? session.badge || null : null;
}

function listBadges() {
  return [...VALID_BADGES];
}

module.exports = { isValidBadge, setBadge, clearBadge, setBadgeByName, filterByBadge, getBadge, listBadges };
