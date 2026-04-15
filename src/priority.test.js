const {
  isValidPriority,
  setPriority,
  clearPriority,
  setPriorityByName,
  filterByPriority,
  getSessionPriority,
  sortByPriority,
} = require('./priority');

const mockSessions = () => [
  { id: '1', name: 'Work', tabs: [], priority: 'high' },
  { id: '2', name: 'Personal', tabs: [], priority: 'low' },
  { id: '3', name: 'Research', tabs: [] },
];

describe('isValidPriority', () => {
  it('returns true for valid priorities', () => {
    expect(isValidPriority('low')).toBe(true);
    expect(isValidPriority('normal')).toBe(true);
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
    const result = setPriority(mockSessions(), '3', 'critical');
    expect(result.find(s => s.id === '3').priority).toBe('critical');
  });

  it('does not mutate other sessions', () => {
    const result = setPriority(mockSessions(), '3', 'critical');
    expect(result.find(s => s.id === '1').priority).toBe('high');
  });

  it('throws on invalid priority', () => {
    expect(() => setPriority(mockSessions(), '1', 'extreme')).toThrow('Invalid priority');
  });
});

describe('clearPriority', () => {
  it('removes priority field from session', () => {
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
    const result = setPriorityByName(mockSessions(), 'Research', 'normal');
    expect(result.find(s => s.name === 'Research').priority).toBe('normal');
  });

  it('throws if session name not found', () => {
    expect(() => setPriorityByName(mockSessions(), 'Ghost', 'low')).toThrow('not found');
  });
});

describe('filterByPriority', () => {
  it('returns only sessions with given priority', () => {
    const result = filterByPriority(mockSessions(), 'high');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Work');
  });

  it('throws on invalid priority', () => {
    expect(() => filterByPriority(mockSessions(), 'mega')).toThrow('Invalid priority');
  });
});

describe('getSessionPriority', () => {
  it('returns the session priority', () => {
    expect(getSessionPriority({ priority: 'critical' })).toBe('critical');
  });

  it('defaults to normal if no priority set', () => {
    expect(getSessionPriority({})).toBe('normal');
  });
});

describe('sortByPriority', () => {
  it('sorts sessions from critical to low', () => {
    const sessions = [
      { id: '1', priority: 'low' },
      { id: '2', priority: 'critical' },
      { id: '3', priority: 'high' },
      { id: '4' },
    ];
    const result = sortByPriority(sessions);
    expect(result.map(s => s.id)).toEqual(['2', '3', '4', '1']);
  });

  it('does not mutate original array', () => {
    const sessions = mockSessions();
    const original = [...sessions];
    sortByPriority(sessions);
    expect(sessions).toEqual(original);
  });
});
