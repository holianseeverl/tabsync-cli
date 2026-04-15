const { groupByTag, groupByDate, groupByTabCount, group } = require('./group');

const sessions = [
  { id: '1', name: 'Work', tags: ['work', 'important'], tabs: [{}, {}, {}], createdAt: '2024-01-10T10:00:00Z' },
  { id: '2', name: 'Recipes', tags: ['personal'], tabs: [{}], createdAt: '2024-01-10T12:00:00Z' },
  { id: '3', name: 'Research', tags: ['work'], tabs: [{}, {}, {}, {}, {}, {}], createdAt: '2024-02-05T09:00:00Z' },
  { id: '4', name: 'Misc', tags: [], tabs: [{}, {}], createdAt: '2024-02-05T11:00:00Z' },
];

describe('groupByTag', () => {
  test('groups sessions by their tags', () => {
    const result = groupByTag(sessions);
    expect(result['work']).toHaveLength(2);
    expect(result['personal']).toHaveLength(1);
    expect(result['important']).toHaveLength(1);
  });

  test('places untagged sessions under "untagged"', () => {
    const result = groupByTag(sessions);
    expect(result['untagged']).toHaveLength(1);
    expect(result['untagged'][0].name).toBe('Misc');
  });
});

describe('groupByDate', () => {
  test('groups sessions by ISO date string', () => {
    const result = groupByDate(sessions);
    expect(result['2024-01-10']).toHaveLength(2);
    expect(result['2024-02-05']).toHaveLength(2);
  });

  test('handles sessions without createdAt', () => {
    const result = groupByDate([{ id: '5', name: 'No Date', tabs: [] }]);
    expect(result['unknown']).toHaveLength(1);
  });
});

describe('groupByTabCount', () => {
  test('groups sessions into tab count buckets', () => {
    const result = groupByTabCount(sessions, 5);
    expect(result['0-4 tabs']).toHaveLength(3);
    expect(result['5-9 tabs']).toHaveLength(1);
  });

  test('uses default bucket size of 5', () => {
    const result = groupByTabCount(sessions);
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });
});

describe('group', () => {
  test('dispatches to groupByTag by default', () => {
    const result = group(sessions, 'tag');
    expect(result['work']).toBeDefined();
  });

  test('dispatches to groupByDate', () => {
    const result = group(sessions, 'date');
    expect(result['2024-01-10']).toBeDefined();
  });

  test('dispatches to groupByTabCount with options', () => {
    const result = group(sessions, 'tabcount', { bucketSize: 3 });
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  test('throws on unknown strategy', () => {
    expect(() => group(sessions, 'color')).toThrow('Unknown grouping strategy');
  });
});
