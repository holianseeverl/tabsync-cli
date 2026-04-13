const { mergeSessions, mergeMany } = require('./merge');

const sessionA = {
  id: 'a1',
  name: 'Work',
  tabs: [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://slack.com', title: 'Slack' },
  ],
  tags: ['work'],
  createdAt: '2024-01-01T00:00:00.000Z',
};

const sessionB = {
  id: 'b1',
  name: 'Research',
  tabs: [
    { url: 'https://stackoverflow.com', title: 'Stack Overflow' },
    { url: 'https://github.com', title: 'GitHub' },
  ],
  tags: ['research', 'work'],
  createdAt: '2024-01-02T00:00:00.000Z',
};

describe('mergeSessions', () => {
  test('merges tabs from both sessions', () => {
    const result = mergeSessions(sessionA, sessionB);
    expect(result.tabs).toHaveLength(4);
  });

  test('uses provided name', () => {
    const result = mergeSessions(sessionA, sessionB, { name: 'Combined' });
    expect(result.name).toBe('Combined');
  });

  test('defaults name to combined session names', () => {
    const result = mergeSessions(sessionA, sessionB);
    expect(result.name).toBe('Work + Research');
  });

  test('deduplicates tabs when dedupe=true', () => {
    const result = mergeSessions(sessionA, sessionB, { dedupe: true });
    expect(result.tabs).toHaveLength(3);
  });

  test('merges tags without duplicates', () => {
    const result = mergeSessions(sessionA, sessionB);
    expect(result.tags).toEqual(expect.arrayContaining(['work', 'research']));
    expect(result.tags.filter((t) => t === 'work')).toHaveLength(1);
  });

  test('throws if a session is missing', () => {
    expect(() => mergeSessions(null, sessionB)).toThrow();
  });
});

describe('mergeMany', () => {
  const sessionC = {
    id: 'c1',
    name: 'Personal',
    tabs: [{ url: 'https://reddit.com', title: 'Reddit' }],
    tags: ['personal'],
    createdAt: '2024-01-03T00:00:00.000Z',
  };

  test('merges more than two sessions', () => {
    const result = mergeMany([sessionA, sessionB, sessionC]);
    expect(result.tabs).toHaveLength(5);
  });

  test('throws if fewer than two sessions provided', () => {
    expect(() => mergeMany([sessionA])).toThrow();
    expect(() => mergeMany([])).toThrow();
  });
});
