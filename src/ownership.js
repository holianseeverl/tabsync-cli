// ownership.js — assign and manage session ownership/author metadata

function setOwner(session, owner) {
  if (!owner || typeof owner !== 'string' || !owner.trim()) {
    throw new Error('Owner must be a non-empty string');
  }
  return { ...session, owner: owner.trim() };
}

function clearOwner(session) {
  const s = { ...session };
  delete s.owner;
  return s;
}

function getOwner(session) {
  return session.owner || null;
}

function setOwnerByName(sessions, name, owner) {
  return sessions.map(s => s.name === name ? setOwner(s, owner) : s);
}

function filterByOwner(sessions, owner) {
  return sessions.filter(s => s.owner === owner);
}

function listOwners(sessions) {
  const owners = sessions.map(s => s.owner).filter(Boolean);
  return [...new Set(owners)];
}

function transferOwner(sessions, fromOwner, toOwner) {
  if (!toOwner || typeof toOwner !== 'string' || !toOwner.trim()) {
    throw new Error('Target owner must be a non-empty string');
  }
  return sessions.map(s => s.owner === fromOwner ? { ...s, owner: toOwner.trim() } : s);
}

module.exports = { setOwner, clearOwner, getOwner, setOwnerByName, filterByOwner, listOwners, transferOwner };
