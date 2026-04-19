// scope.js — assign and manage a scope (e.g. 'personal', 'work', 'research') to sessions

const VALID_SCOPES = ['personal', 'work', 'research', 'education', 'finance', 'health', 'other'];

function isValidScope(scope) {
  return VALID_SCOPES.includes(scope);
}

function setScope(session, scope) {
  if (!isValidScope(scope)) throw new Error(`Invalid scope: ${scope}`);
  return { ...session, scope };
}

function clearScope(session) {
  const s = { ...session };
  delete s.scope;
  return s;
}

function setScopeByName(sessions, name, scope) {
  return sessions.map(s => s.name === name ? setScope(s, scope) : s);
}

function getScope(session) {
  return session.scope || null;
}

function filterByScope(sessions, scope) {
  return sessions.filter(s => s.scope === scope);
}

function sortByScope(sessions) {
  return [...sessions].sort((a, b) => {
    const ai = VALID_SCOPES.indexOf(a.scope || '');
    const bi = VALID_SCOPES.indexOf(b.scope || '');
    return ai - bi;
  });
}

function listScopes() {
  return [...VALID_SCOPES];
}

module.exports = { isValidScope, setScope, clearScope, setScopeByName, getScope, filterByScope, sortByScope, listScopes };
