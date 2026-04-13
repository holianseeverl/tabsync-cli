const { searchByKeyword, searchByDateRange, searchByMinTabs, search } = require('./search');

const mockSessions = [
  {
    id: '1',
    name: 'Work Stuff',
    tags: ['work'],
    createdAt: '2024-01-10T10:00:00.000Z',
    tabs: [
      { url: 'https://github.com', title: 'GitHub' },
      { url: 'https://jira.example.com', title: 'Jira' }
    ]
  },
  {
    id: '2',
    name: 'Personal Reading',
    tags: ['personal'],
    createdAt: '2024-03-05T08:00:00.000Z',
    tabs: [
      { url: 'https://news.ycombinator.com', title: 'HN' }
    ]
  },
  {
    id: '3',
    name: 'Research',
    tags: ['work', 'research'],
    createdAt: '2024-06-20T14:00:00.000Z',
    tabs: [
      { url: 'https://arxiv.org', title: 'Arxiv' },
      { url: 'https://github.com/openai', title: 'OpenAI GitHub' },
      { url: 'https://scholar.google.com', title: 'Scholar' }
    ]
  }
];

describe('searchByKeyword', () => {
  test('matches session name', () => {
    const results = searchByKeyword(mockSessions, 'work');
    expect(results.map(s => s.id)).toContain('1');
  });

  test('matches tab URL', () => {
    const results = searchByKeyword(mockSessions, 'github');
    expect(results.map(s => s.id)).toContain('1');
    expect(results.map(s => s.id)).toContain('3');
  });

  test('returns all sessions for empty query', () => {
    expect(searchByKeyword(mockSessions, '')).toHaveLength(3);
  });

  test('is case insensitive', () => {
    const results = searchByKeyword(mockSessions, 'PERSONAL');
    expect(results.map(s => s.id)).toContain('2');
  });
});

describe('searchByDateRange', () => {
  test('filters by from date', () => {
    const results = searchByDateRange(mockSessions, '2024-03-01', null);
    expect(results.map(s => s.id)).not.toContain('1');
    expect(results.map(s => s.id)).toContain('2');
  });

  test('filters by to date', () => {
    const results = searchByDateRange(mockSessions, null, '2024-02-01');
    expect(results.map(s => s.id)).toContain('1');
    expect(results.map(s => s.id)).not.toContain('2');
  });

  test('filters within range', () => {
    const results = searchByDateRange(mockSessions, '2024-02-01', '2024-04-01');
    expect(results.map(s => s.id)).toEqual(['2']);
  });
});

describe('searchByMinTabs', () => {
  test('returns sessions with at least N tabs', () => {
    const results = searchByMinTabs(mockSessions, 2);
    expect(results.map(s => s.id)).toContain('1');
    expect(results.map(s => s.id)).not.toContain('2');
  });
});

describe('search (combined)', () => {
  test('applies multiple criteria', () => {
    const results = search(mockSessions, { keyword: 'github', minTabs: 2 });
    expect(results.map(s => s.id)).toContain('3');
    expect(results.map(s => s.id)).not.toContain('2');
  });

  test('returns all sessions with no criteria', () => {
    expect(search(mockSessions, {})).toHaveLength(3);
  });
});
