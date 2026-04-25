// surface: tracks which 'surface' or context a session is associated with
// e.g. 'browser', 'terminal', 'editor', 'mobile', 'meeting'

const VALID_SURFACES = ['browser', 'terminal', 'editor', 'mobile', 'meeting', 'other'];

function isValidSurface(surface) {
  return VALID_SURFACES.includes(surface);
}

function setSurface(session, surface) {
  if (!isValidSurface(surface)) {
    throw new Error(`Invalid surface: '${surface}'. Valid values: ${VALID_SURFACES.join(', ')}`);
  }
  return { ...session, surface };
}

function clearSurface(session) {
  const updated = { ...session };
  delete updated.surface;
  return updated;
}

function setSurfaceByName(sessions, name, surface) {
  return sessions.map(s => s.name === name ? setSurface(s, surface) : s);
}

function getSurface(session) {
  return session.surface || null;
}

function filterBySurface(sessions, surface) {
  return sessions.filter(s => s.surface === surface);
}

function sortBySurface(sessions) {
  return [...sessions].sort((a, b) => {
    const ai = VALID_SURFACES.indexOf(a.surface || 'other');
    const bi = VALID_SURFACES.indexOf(b.surface || 'other');
    return ai - bi;
  });
}

function groupBySurface(sessions) {
  const groups = {};
  for (const s of sessions) {
    const key = s.surface || 'unset';
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  return groups;
}

module.exports = {
  isValidSurface,
  setSurface,
  clearSurface,
  setSurfaceByName,
  getSurface,
  filterBySurface,
  sortBySurface,
  groupBySurface,
  VALID_SURFACES
};
