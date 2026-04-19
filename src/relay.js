// relay.js — forward sessions to another machine/profile via a relay config

function isValidRelay(relay) {
  return typeof relay === 'string' && relay.trim().length > 0;
}

function setRelay(session, relay) {
  if (!isValidRelay(relay)) throw new Error('Invalid relay target');
  return { ...session, relay: relay.trim() };
}

function clearRelay(session) {
  const s = { ...session };
  delete s.relay;
  return s;
}

function setRelayByName(sessions, name, relay) {
  return sessions.map(s => s.name === name ? setRelay(s, relay) : s);
}

function getRelay(session) {
  return session.relay || null;
}

function filterByRelay(sessions, relay) {
  return sessions.filter(s => s.relay === relay);
}

function listRelayTargets(sessions) {
  const targets = new Set(sessions.map(s => s.relay).filter(Boolean));
  return [...targets].sort();
}

function groupByRelay(sessions) {
  return sessions.reduce((acc, s) => {
    const key = s.relay || '__none__';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
}

module.exports = {
  isValidRelay,
  setRelay,
  clearRelay,
  setRelayByName,
  getRelay,
  filterByRelay,
  listRelayTargets,
  groupByRelay,
};
