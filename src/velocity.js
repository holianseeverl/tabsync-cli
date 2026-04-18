// velocity: tracks how many tabs are added/removed over time

function recordVelocity(session, action) {
  if (!['add', 'remove'].includes(action)) throw new Error('Invalid action: ' + action);
  const entry = { action, timestamp: Date.now() };
  session.velocity = session.velocity || [];
  session.velocity.push(entry);
  return session;
}

function recordVelocityByName(sessions, name, action) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error('Session not found: ' + name);
  return recordVelocity(session, action);
}

function getVelocity(session) {
  return session.velocity || [];
}

function clearVelocity(session) {
  session.velocity = [];
  return session;
}

function computeRate(session, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const entries = (session.velocity || []).filter(e => now - e.timestamp <= windowMs);
  const adds = entries.filter(e => e.action === 'add').length;
  const removes = entries.filter(e => e.action === 'remove').length;
  return { adds, removes, net: adds - removes, total: entries.length };
}

function sortByVelocity(sessions, windowMs) {
  return [...sessions].sort((a, b) => {
    const ra = computeRate(a, windowMs).total;
    const rb = computeRate(b, windowMs).total;
    return rb - ra;
  });
}

module.exports = { recordVelocity, recordVelocityByName, getVelocity, clearVelocity, computeRate, sortByVelocity };
