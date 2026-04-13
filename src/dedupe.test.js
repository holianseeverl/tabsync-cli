const { dedupeTabsInSession, dedupeSessionsByName, dedupeExact, dedupe } = require('./dedupe');

const makeSession = (name, urls, createdAt = '2024-01-01T00:00:00Z') => ({
  id: name,
  name,
  createdAt,
  tabs: urls.map((url) => ({ url, title: url })),
  tags: [],
});

describe('dedupeTabsInSession', () => {
  it('removes duplicate URLs within a session', () => {
    const session = makeSession('s1', ['http://a.com', 'http://b.com', 'http://a.com']);
    const result = dedupeTabsInSession(session);
    expect(result.tabs).toHaveLength(2);
    expect(result.tabs.map((t) => t.url)).toEqual(['http://a.com', 'http://b.com']);
  });

  it('returns same session if no duplicates', () => {
    const session = makeSession('s1', ['http://a.com', 'http://b.com']);
    const result = dedupeTabsInSession(session);
    expect(result.tabs).toHaveLength(2);
  });

  it('does not mutate the original session', () => {
    const session = makeSession('s1', ['http://a.com', 'http://a.com']);
    dedupeTabsInSession(session);
    expect(session.tabs).toHaveLength(2);
  });
});

describe('dedupeSessionsByName', () => {
  it('keeps the most recent session when names collide', () => {
    const sessions = [
      makeSession('work', ['http://a.com'], '2024-01-01T00:00:00Z'),
      makeSession('work', ['http://b.com'], '2024-06-01T00:00:00Z'),
    ];
    const result = dedupeSessionsByName(sessions);
    expect(result).toHaveLength(1);
    expect(result[0].tabs[0].url).toBe('http://b.com');
  });

  it('keeps all sessions with unique names', () => {
    const sessions = [makeSession('work', ['http://a.com']), makeSession('home', ['http://b.com'])];
    expect(dedupeSessionsByName(sessions)).toHaveLength(2);
  });
});

describe('dedupeExact', () => {
  it('removes sessions with same name and same tab URLs', () => {
    const sessions = [
      makeSession('work', ['http://a.com', 'http://b.com']),
      makeSession('work', ['http://a.com', 'http://b.com']),
    ];
    expect(dedupeExact(sessions)).toHaveLength(1);
  });

  it('keeps sessions with same name but different tabs', () => {
    const sessions = [
      makeSession('work', ['http://a.com']),
      makeSession('work', ['http://b.com']),
    ];
    expect(dedupeExact(sessions)).toHaveLength(2);
  });
});

describe('dedupe', () => {
  it('removes exact duplicate sessions and dedupes tabs', () => {
    const sessions = [
      makeSession('work', ['http://a.com', 'http://a.com', 'http://b.com']),
      makeSession('work', ['http://a.com', 'http://a.com', 'http://b.com']),
      makeSession('home', ['http://c.com']),
    ];
    const result = dedupe(sessions);
    expect(result).toHaveLength(2);
    const work = result.find((s) => s.name === 'work');
    expect(work.tabs).toHaveLength(2);
  });
});
