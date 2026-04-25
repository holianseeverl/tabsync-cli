// cohesion: measures how well tabs in a session relate to each other
// based on shared domains, keywords in titles, and tag overlap

function computeDomainOverlap(tabs) {
  if (!tabs || tabs.length < 2) return 0;
  const domains = tabs.map(t => {
    try { return new URL(t.url).hostname; } catch { return ''; }
  }).filter(Boolean);
  const unique = new Set(domains);
  return 1 - (unique.size - 1) / Math.max(domains.length - 1, 1);
}

function computeTagOverlap(session) {
  const tags = session.tags || [];
  if (tags.length === 0) return 0;
  return Math.min(tags.length / 5, 1);
}

function computeTitleSimilarity(tabs) {
  if (!tabs || tabs.length < 2) return 0;
  const words = tabs.flatMap(t =>
    (t.title || '').toLowerCase().split(/\W+/).filter(w => w.length > 3)
  );
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const repeated = Object.values(freq).filter(c => c > 1).length;
  return Math.min(repeated / Math.max(words.length * 0.5, 1), 1);
}

function computeCohesion(session) {
  const tabs = session.tabs || [];
  const domainScore = computeDomainOverlap(tabs);
  const tagScore = computeTagOverlap(session);
  const titleScore = computeTitleSimilarity(tabs);
  const raw = domainScore * 0.5 + tagScore * 0.3 + titleScore * 0.2;
  return Math.round(raw * 100) / 100;
}

function setCohesion(session) {
  return { ...session, cohesion: computeCohesion(session) };
}

function setCohesionByName(sessions, name) {
  return sessions.map(s => s.name === name ? setCohesion(s) : s);
}

function getCohesion(session) {
  return session.cohesion ?? computeCohesion(session);
}

function sortByCohesion(sessions, direction = 'desc') {
  return [...sessions].sort((a, b) => {
    const diff = getCohesion(a) - getCohesion(b);
    return direction === 'asc' ? diff : -diff;
  });
}

function filterByMinCohesion(sessions, min) {
  return sessions.filter(s => getCohesion(s) >= min);
}

module.exports = {
  computeCohesion,
  setCohesion,
  setCohesionByName,
  getCohesion,
  sortByCohesion,
  filterByMinCohesion,
};
