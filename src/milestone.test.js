const {
  isValidMilestone,
  setMilestone,
  clearMilestone,
  setMilestoneByName,
  getMilestone,
  filterByMilestone,
  sortByMilestone,
} = require('./milestone');

function makeSession(overrides = {}) {
  return { id: 'abc', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

describe('isValidMilestone', () => {
  test('accepts valid milestones', () => {
    expect(isValidMilestone('done')).toBe(true);
    expect(isValidMilestone('review')).toBe(true);
  });
  test('rejects invalid milestones', () => {
    expect(isValidMilestone('finished')).toBe(false);
    expect(isValidMilestone('')).toBe(false);
  });
});

describe('setMilestone', () => {
  test('sets milestone on matching session', () => {
    const sessions = [makeSession({ id: '1' })];
    const result = setMilestone(sessions, '1', 'done');
    expect(result[0].milestone).toBe('done');
  });
  test('throws on invalid milestone', () => {
    const sessions = [makeSession({ id: '1' })];
    expect(() => setMilestone(sessions, '1', 'bad')).toThrow('Invalid milestone');
  });
  test('does not mutate original', () => {
    const sessions = [makeSession({ id: '1' })];
    setMilestone(sessions, '1', 'done');
    expect(sessions[0].milestone).toBeUndefined();
  });
});

describe('clearMilestone', () => {
  test('removes milestone from session', () => {
    const sessions = [makeSession({ id: '1', milestone: 'done' })];
    const result = clearMilestone(sessions, '1');
    expect(result[0].milestone).toBeUndefined();
  });
});

describe('setMilestoneByName', () => {
  test('sets milestone by name', () => {
    const sessions = [makeSession({ id: '1', name: 'Work' })];
    const result = setMilestoneByName(sessions, 'Work', 'review');
    expect(result[0].milestone).toBe('review');
  });
  test('throws if name not found', () => {
    expect(() => setMilestoneByName([], 'Missing', 'done')).toThrow('Session not found');
  });
});

describe('getMilestone', () => {
  test('returns milestone for session', () => {
    const sessions = [makeSession({ id: '1', milestone: 'in-progress' })];
    expect(getMilestone(sessions, '1')).toBe('in-progress');
  });
  test('returns null if no milestone set', () => {
    const sessions = [makeSession({ id: '1' })];
    expect(getMilestone(sessions, '1')).toBeNull();
  });
});

describe('filterByMilestone', () => {
  test('filters sessions by milestone', () => {
    const sessions = [
      makeSession({ id: '1', milestone: 'done' }),
      makeSession({ id: '2', milestone: 'draft' }),
    ];
    expect(filterByMilestone(sessions, 'done')).toHaveLength(1);
    expect(filterByMilestone(sessions, 'done')[0].id).toBe('1');
  });
});

describe('sortByMilestone', () => {
  test('sorts sessions by milestone order', () => {
    const sessions = [
      makeSession({ id: '3', milestone: 'done' }),
      makeSession({ id: '1', milestone: 'draft' }),
      makeSession({ id: '2', milestone: 'review' }),
    ];
    const sorted = sortByMilestone(sessions);
    expect(sorted.map(s => s.id)).toEqual(['1', '2', '3']);
  });
  test('puts sessions without milestone last', () => {
    const sessions = [
      makeSession({ id: '2', milestone: 'done' }),
      makeSession({ id: '1' }),
    ];
    const sorted = sortByMilestone(sessions);
    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('1');
  });
});
