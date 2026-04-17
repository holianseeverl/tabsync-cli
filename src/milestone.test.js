const { isValidMilestone, setMilestone, clearMilestone, setMilestoneByName, getMilestone, filterByMilestone, sortByMilestone, listMilestones } = require('./milestone');

function makeSession(name, milestone) {
  return { id: name, name, tabs: [], createdAt: new Date().toISOString(), ...(milestone ? { milestone } : {}) };
}

test('isValidMilestone returns true for valid values', () => {
  expect(isValidMilestone('done')).toBe(true);
  expect(isValidMilestone('draft')).toBe(true);
});

test('isValidMilestone returns false for invalid', () => {
  expect(isValidMilestone('unknown')).toBe(false);
  expect(isValidMilestone('')).toBe(false);
});

test('setMilestone sets milestone on session', () => {
  const s = makeSession('work');
  const result = setMilestone(s, 'in-progress');
  expect(result.milestone).toBe('in-progress');
});

test('setMilestone throws on invalid milestone', () => {
  expect(() => setMilestone(makeSession('work'), 'bad')).toThrow();
});

test('clearMilestone removes milestone', () => {
  const s = makeSession('work', 'done');
  const result = clearMilestone(s);
  expect(result.milestone).toBeUndefined();
});

test('setMilestoneByName updates correct session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setMilestoneByName(sessions, 'a', 'review');
  expect(result[0].milestone).toBe('review');
  expect(result[1].milestone).toBeUndefined();
});

test('getMilestone returns milestone or null', () => {
  expect(getMilestone(makeSession('a', 'done'))).toBe('done');
  expect(getMilestone(makeSession('a'))).toBeNull();
});

test('filterByMilestone returns matching sessions', () => {
  const sessions = [makeSession('a', 'done'), makeSession('b', 'draft'), makeSession('c', 'done')];
  expect(filterByMilestone(sessions, 'done')).toHaveLength(2);
});

test('sortByMilestone sorts by milestone order', () => {
  const sessions = [makeSession('c', 'done'), makeSession('a', 'draft'), makeSession('b', 'review')];
  const sorted = sortByMilestone(sessions);
  expect(sorted[0].milestone).toBe('draft');
  expect(sorted[2].milestone).toBe('done');
});

test('listMilestones returns all valid milestones', () => {
  const list = listMilestones();
  expect(list).toContain('draft');
  expect(list).toContain('done');
  expect(list.length).toBeGreaterThan(0);
});
