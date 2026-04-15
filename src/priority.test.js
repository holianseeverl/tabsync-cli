const {
  isValidPriority,
  setPriority,
  clearPriority,
  setPriorityByName,
  filterByPriority,
  sortByPriority,
  getSessionPriority
} = require('./priority');

const mockSessions = () => [
  { id: '1', name: 'Work', tabs: [], priority: 'high' },
  { id: '2', name: 'Personal', tabs: [], priority: 'low' },
  { id: '3', name: 'Research', tabs: [] },
  { id: '4', name: 'Urgent', tabs: [], priority: 'critical' }
];

describe('isValidPriority', () => {
  it('returns true for valid priorities', () => {
    expect(isValidPriority('low')).toBe(true);
    expect(isValidPriority('medium')).toBe(true);
    expect(isValidPriority('high')).toBe(true);
    expect(isValidPriority('critical')).toBe(true);
  });

  it('returns false for invalid priorities', () => {
    expect(isValidPriority('urgent')).toBe(false);
    expect(isValidPriority('')).toBe(false);
    expect(isValidPriority(null)).toBe(false);
  });
});

describe('setPriority', () => {
  it('sets priority on matching session', () => {
    const result = setPriority(mockSessions(), '3', 'medium');
    expect(result.find(s => s.id === '3').priority).toBe('medium');
  });

  it('throws on invalid priority', () => {
    expect(() => setPriority(mockSessions(), '1', 'extreme')).toThrow();
  });

  it('does not mutate other sessions', () => {
    const sessions = mockSessions();
    const result = setPriority(sessions, '1', 'medium');
    expect(result.find(s => s.id === '2').priority).toBe('low');
  });
});

describe('clearPriority', () => {
  it('removes priority from session', () => {
    const result = clearPriority(mockSessions(), '1');
    expect(result.find(s => s.id === '1').priority).toBeUndefined();
  });

  it('leaves other sessions unchanged', () => {
    const result = clearPriority(mockSessions(), '1');
    expect(result.find(s => s.id === '2').priority).toBe('low');
  });
});

describe('setPriorityByName', () => {
  it('sets priority by session name', () => {
    const result = setPriorityByName(mockSessions(), 'Research', 'high');
    expect(result.find(s => s.name === 'Research').priority).toBe('high');
  });

  it('throws on invalid priority', () => {
    expect(() => setPriorityByName(mockSessions(), 'Work', 'bad')).toThrow();
  });
});

describe('filterByPriority', () => {
  it('filters sessions by priority', () => {
    const result = filterByPriority(mockSessions(), 'high');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Work');
  });

  it('returns empty array if none match', () => {
    const result = filterByPriority(mockSessions(), 'medium');
    expect(result).toHaveLength(0);
  });

  it('throws on invalid priority', () => {
    expect(() => filterByPriority(mockSessions(), 'nope')).toThrow();
  });
});

describe('sortByPriority', () => {
  it('sorts sessions from critical to low, unset last', () => {
    const result = sortByPriority(mockSessions());
    expect(result[0].priority).toBe('critical');
    expect(result[1].priority).toBe('high');
    expect(result[2].priority).toBe('low');
    expect(result[3].priority).toBeUndefined();
  });
});

describe('getSessionPriority', () => {
  it('returns priority if set', () => {
    expect(getSessionPriority({ id: '1', priority: 'high' })).toBe('high');
  });

  it('returns null if not set', () => {
    expect(getSessionPriority({ id: '1' })).toBeNull();
  });
});
