const { sortByDate, sortByTabCount, sortByName, sort } = require('./sort');

const mockSessions = [
  {
    id: '1',
    name: 'Zebra Session',
    createdAt: '2024-01-10T10:00:00.000Z',
    tabs: [{ url: 'https://a.com' }, { url: 'https://b.com' }],
    tags: []
  },
  {
    id: '2',
    name: 'Alpha Session',
    createdAt: '2024-03-05T08:00:00.000Z',
    tabs: [{ url: 'https://c.com' }],
    tags: []
  },
  {
    id: '3',
    name: 'Mango Session',
    createdAt: '2024-02-20T15:00:00.000Z',
    tabs: [{ url: 'https://d.com' }, { url: 'https://e.com' }, { url: 'https://f.com' }],
    tags: []
  }
];

describe('sortByDate', () => {
  test('sorts descending by default (newest first)', () => {
    const result = sortByDate(mockSessions);
    expect(result[0].id).toBe('2');
    expect(result[2].id).toBe('1');
  });

  test('sorts ascending (oldest first)', () => {
    const result = sortByDate(mockSessions, 'asc');
    expect(result[0].id).toBe('1');
    expect(result[2].id).toBe('2');
  });

  test('does not mutate original array', () => {
    const original = [...mockSessions];
    sortByDate(mockSessions);
    expect(mockSessions).toEqual(original);
  });
});

describe('sortByTabCount', () => {
  test('sorts descending (most tabs first)', () => {
    const result = sortByTabCount(mockSessions);
    expect(result[0].id).toBe('3');
    expect(result[2].id).toBe('2');
  });

  test('sorts ascending (fewest tabs first)', () => {
    const result = sortByTabCount(mockSessions, 'asc');
    expect(result[0].id).toBe('2');
  });
});

describe('sortByName', () => {
  test('sorts alphabetically ascending by default', () => {
    const result = sortByName(mockSessions);
    expect(result[0].name).toBe('Alpha Session');
    expect(result[2].name).toBe('Zebra Session');
  });

  test('sorts alphabetically descending', () => {
    const result = sortByName(mockSessions, 'desc');
    expect(result[0].name).toBe('Zebra Session');
  });
});

describe('sort (dispatcher)', () => {
  test('delegates to sortByDate', () => {
    const result = sort(mockSessions, 'date', 'asc');
    expect(result[0].id).toBe('1');
  });

  test('delegates to sortByTabCount', () => {
    const result = sort(mockSessions, 'tabs', 'desc');
    expect(result[0].id).toBe('3');
  });

  test('delegates to sortByName', () => {
    const result = sort(mockSessions, 'name', 'asc');
    expect(result[0].name).toBe('Alpha Session');
  });

  test('throws on unknown sort field', () => {
    expect(() => sort(mockSessions, 'unknown')).toThrow('Unknown sort field');
  });

  test('returns empty array for non-array input', () => {
    expect(sort(null, 'date')).toEqual([]);
  });
});
