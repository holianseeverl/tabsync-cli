const { getSpotlight, getSpotlightByTag, getSpotlightByPriority, formatSpotlightEntry, spotlightSummary } = require('./spotlight');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: [], pinned: false, favorite: false, ...overrides };
}

test('getSpotlight returns pinned and favorite sessions', () => {
  const sessions = [
    makeSession({ id: '1', name: 'A', pinned: true }),
    makeSession({ id: '2', name: 'B', favorite: true }),
    makeSession({ id: '3', name: 'C' }),
  ];
  const result = getSpotlight(sessions);
  expect(result).toHaveLength(2);
  expect(result.map(s => s.name)).toEqual(['A', 'B']);
});

test('getSpotlightByTag filters spotlight by tag', () => {
  const sessions = [
    makeSession({ id: '1', name: 'A', pinned: true, tags: ['work'] }),
    makeSession({ id: '2', name: 'B', pinned: true, tags: ['personal'] }),
  ];
  const result = getSpotlightByTag(sessions, 'work');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('A');
});

test('getSpotlightByPriority filters spotlight by priority', () => {
  const sessions = [
    makeSession({ id: '1', name: 'A', pinned: true, priority: 'high' }),
    makeSession({ id: '2', name: 'B', favorite: true, priority: 'low' }),
  ];
  expect(getSpotlightByPriority(sessions, 'high')).toHaveLength(1);
  expect(getSpotlightByPriority(sessions, 'low')[0].name).toBe('B');
});

test('formatSpotlightEntry includes badges and tab count', () => {
  const s = makeSession({ name: 'MySession', pinned: true, favorite: true, priority: 'high', tabs: [{}, {}] });
  const line = formatSpotlightEntry(s);
  expect(line).toContain('[pinned]');
  expect(line).toContain('[fav]');
  expect(line).toContain('[high]');
  expect(line).toContain('2 tab(s)');
});

test('spotlightSummary returns message when empty', () => {
  expect(spotlightSummary([])).toBe('No spotlight sessions found.');
});

test('spotlightSummary lists spotlight sessions', () => {
  const sessions = [makeSession({ name: 'X', pinned: true, tabs: [{}] })];
  const out = spotlightSummary(sessions);
  expect(out).toContain('X');
  expect(out).toContain('1 tab(s)');
});
