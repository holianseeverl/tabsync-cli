// alias.js — assign short aliases to sessions for quick access

function setAlias(sessions, id, alias) {
  if (!alias || typeof alias !== 'string' || !alias.trim()) {
    throw new Error('Alias must be a non-empty string');
  }
  const trimmed = alias.trim();
  const conflict = sessions.find(s => s.alias === trimmed && s.id !== id);
  if (conflict) {
    throw new Error(`Alias "${trimmed}" is already used by session "${conflict.name}"`);
  }
  return sessions.map(s => s.id === id ? { ...s, alias: trimmed } : s);
}

function clearAlias(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, alias: undefined } : s);
}

function setAliasByName(sessions, name, alias) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session "${name}" not found`);
  return setAlias(sessions, session.id, alias);
}

function findByAlias(sessions, alias) {
  return sessions.find(s => s.alias === alias) || null;
}

function getAlias(sessions, id) {
  const session = sessions.find(s => s.id === id);
  return session ? (session.alias || null) : null;
}

function listAliased(sessions) {
  return sessions.filter(s => s.alias);
}

module.exports = { setAlias, clearAlias, setAliasByName, findByAlias, getAlias, listAliased };
