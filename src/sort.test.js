const { sortByDate, sortByName, sortByTabCount, sort } = require('./sort');

const mockSessions = [
  { name: 'Banana', createdAt: '2024-01-15T10:00:00Z', tabs: [1, 2, 3] },
  { name: 'Apple', createdAt: '2024-03-01T08:00:00Z', tabs: [1] },
  { name: 'Cherry', createdAt: '2024-02-10T12:00:00Z', tabs: [1, 2, 3, 4, 5] },
];

describe('sortByDate', () => {
  test('sorts descending by default', () => {
    const result = sortByDate(mockSessions);
    expect(result[0].name).toBe('Apple');
    expect(result[2].name).toBe('Banana');
  });

  test('sorts ascending when specified', () => {
    const result = sortByDate(mockSessions, 'asc');
    expect(result[0].name).toBe('Banana');
    expect(result[2].name).toBe('Apple');
  });

  test('does not mutate original array', () => {
    const original = [...mockSessions];
    sortByDate(mockSessions);
    expect(mockSessions).toEqual(original);
  });
});

describe('sortByName', () => {
  test('sorts ascending alphabetically by default', () => {
    const result = sortByName(mockSessions);
    expect(result[0].name).toBe('Apple');
    expect(result[1].name).toBe('Banana');
    expect(result[2].name).toBe('Cherry');
  });

  test('sorts descending when specified', () => {
    const result = sortByName(mockSessions, 'desc');
    expect(result[0].name).toBe('Cherry');
  });
});

describe('sortByTabCount', () => {
  test('sorts descending by tab count by default', () => {
    const result = sortByTabCount(mockSessions);
    expect(result[0].name).toBe('Cherry');
    expect(result[2].name).toBe('Apple');
  });

  test('sorts ascending when specified', () => {
    const result = sortByTabCount(mockSessions, 'asc');
    expect(result[0].name).toBe('Apple');
  });

  test('handles sessions with no tabs', () => {
    const withEmpty = [...mockSessions, { name: 'Empty', createdAt: '2024-01-01T00:00:00Z' }];
    const result = sortByTabCount(withEmpty, 'asc');
    expect(result[0].name).toBe('Empty');
  });
});

describe('sort (generic)', () => {
  test('defaults to date desc', () => {
    const result = sort(mockSessions);
    expect(result[0].name).toBe('Apple');
  });

  test('sorts by name', () => {
    const result = sort(mockSessions, 'name');
    expect(result[0].name).toBe('Apple');
  });

  test('sorts by tabs', () => {
    const result = sort(mockSessions, 'tabs');
    expect(result[0].name).toBe('Cherry');
  });

  test('respects explicit order override', () => {
    const result = sort(mockSessions, 'date', 'asc');
    expect(result[0].name).toBe('Banana');
  });
});
