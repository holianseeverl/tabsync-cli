// stakeholder.js — track stakeholders associated with sessions

const VALID_ROLES = ['owner', 'reviewer', 'contributor', 'observer'];

function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

function addStakeholder(session, name, role = 'observer') {
  if (!name || typeof name !== 'string') throw new Error('Stakeholder name required');
  if (!isValidRole(role)) throw new Error(`Invalid role: ${role}. Must be one of: ${VALID_ROLES.join(', ')}`);
  const stakeholders = session.stakeholders || [];
  const existing = stakeholders.find(s => s.name === name);
  if (existing) {
    existing.role = role;
    return { ...session, stakeholders };
  }
  return { ...session, stakeholders: [...stakeholders, { name, role }] };
}

function removeStakeholder(session, name) {
  const stakeholders = (session.stakeholders || []).filter(s => s.name !== name);
  return { ...session, stakeholders };
}

function getStakeholders(session) {
  return session.stakeholders || [];
}

function addStakeholderByName(sessions, sessionName, name, role) {
  return sessions.map(s => s.name === sessionName ? addStakeholder(s, name, role) : s);
}

function filterByStakeholder(sessions, name) {
  return sessions.filter(s => (s.stakeholders || []).some(sh => sh.name === name));
}

function filterByRole(sessions, role) {
  return sessions.filter(s => (s.stakeholders || []).some(sh => sh.role === role));
}

function listAllStakeholders(sessions) {
  const map = {};
  for (const s of sessions) {
    for (const sh of (s.stakeholders || [])) {
      if (!map[sh.name]) map[sh.name] = new Set();
      map[sh.name].add(sh.role);
    }
  }
  return Object.entries(map).map(([name, roles]) => ({ name, roles: [...roles] }));
}

module.exports = { isValidRole, addStakeholder, removeStakeholder, getStakeholders, addStakeholderByName, filterByStakeholder, filterByRole, listAllStakeholders, VALID_ROLES };
