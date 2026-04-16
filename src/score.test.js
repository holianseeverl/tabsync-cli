const { computeScore, scoreSession, scoreSessions, sortByScore, filterByMinScore } = require('./score');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: [], ...overrides };
}

test('computeScore returns 0 for bare session', () => {
  expect(computeScore(makeSession())).toBe(0);
});

test('computeScore adds rating weight', () => {
  const s = makeSession({ rating: 5 });
  expect(computeScore(s)).toBe(100);
});

test('computeScore adds favorite and pinned bonuses', () => {
  const s = makeSession({ favorite: true, pinned: true });
  expect(computeScore(s)).toBe(20);
});

test('computeScore adds priority weight', () => {
  const s = makeSession({ priority: 'high' });
  expect(computeScore(s)).toBe(45);
});

test('computeScore adds tab count weight', () => {
  const s = makeSession({ tabs: [{}, {}, {}] });
  expect(computeScore(s)).toBeCloseTo(1.5);
});

test('scoreSession attaches score field', () => {
  const s = makeSession({ rating: 3 });
  expect(scoreSession(s).score).toBe(60);
});

test('scoreSessions maps all sessions', () => {
  const sessions = [makeSession(), makeSession({ rating: 1 })];
  const result = scoreSessions(sessions);
  expect(result).toHaveLength(2);
  expect(result[1].score).toBe(20);
});

test('sortByScore desc orders highest first', () => {
  const sessions = [makeSession({ rating: 1 }), makeSession({ rating: 5 })];
  const result = sortByScore(sessions);
  expect(result[0].score).toBeGreaterThan(result[1].score);
});

test('sortByScore asc orders lowest first', () => {
  const sessions = [makeSession({ rating: 5 }), makeSession({ rating: 1 })];
  const result = sortByScore(sessions, 'asc');
  expect(result[0].score).toBeLessThan(result[1].score);
});

test('filterByMinScore filters correctly', () => {
  const sessions = [makeSession({ rating: 1 }), makeSession({ rating: 5 })];
  const result = filterByMinScore(sessions, 50);
  expect(result).toHaveLength(1);
  expect(result[0].score).toBe(100);
});
