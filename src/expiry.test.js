const {
  setExpiry,
  clearExpiry,
  isExpired,
  listExpired,
  listActive,
  setExpiryByName,
  purgeExpired,
} = require('./expiry');

const makeSession = (name, extra = {}) => ({
  id: `id-${name}`,
  name,
  tabs: [{ url: 'https://example.com', title: 'Example' }],
  createdAt: new Date().toISOString(),
  ...extra,
});

const PAST = new Date(Date.now() - 1000 * 60 * 60).toISOString();
const FUTURE = new Date(Date.now() + 1000 * 60 * 60).toISOString();

describe('setExpiry', () => {
  test('adds expiresAt to session', () => {
    const s = makeSession('alpha');
    const result = setExpiry(s, FUTURE);
    expect(result.expiresAt).toBe(new Date(FUTURE).toISOString());
  });

  test('throws on invalid session', () => {
    expect(() => setExpiry({}, FUTURE)).toThrow('Invalid session');
  });

  test('throws on invalid date', () => {
    expect(() => setExpiry(makeSession('a'), 'not-a-date')).toThrow('Invalid expiry date');
  });
});

describe('clearExpiry', () => {
  test('removes expiresAt from session', () => {
    const s = makeSession('beta', { expiresAt: FUTURE });
    const result = clearExpiry(s);
    expect(result.expiresAt).toBeUndefined();
  });

  test('throws on invalid session', () => {
    expect(() => clearExpiry({})).toThrow('Invalid session');
  });
});

describe('isExpired', () => {
  test('returns true for past expiry', () => {
    const s = makeSession('c', { expiresAt: PAST });
    expect(isExpired(s)).toBe(true);
  });

  test('returns false for future expiry', () => {
    const s = makeSession('d', { expiresAt: FUTURE });
    expect(isExpired(s)).toBe(false);
  });

  test('returns false when no expiresAt', () => {
    expect(isExpired(makeSession('e'))).toBe(false);
  });
});

describe('listExpired / listActive', () => {
  const sessions = [
    makeSession('old', { expiresAt: PAST }),
    makeSession('new', { expiresAt: FUTURE }),
    makeSession('none'),
  ];

  test('listExpired returns only expired sessions', () => {
    expect(listExpired(sessions).map(s => s.name)).toEqual(['old']);
  });

  test('listActive returns non-expired sessions', () => {
    expect(listActive(sessions).map(s => s.name)).toEqual(['new', 'none']);
  });
});

describe('setExpiryByName', () => {
  test('sets expiry on matching session', () => {
    const sessions = [makeSession('work'), makeSession('play')];
    const result = setExpiryByName(sessions, 'work', FUTURE);
    expect(result.find(s => s.name === 'work').expiresAt).toBeDefined();
    expect(result.find(s => s.name === 'play').expiresAt).toBeUndefined();
  });
});

describe('purgeExpired', () => {
  test('removes expired sessions', () => {
    const sessions = [
      makeSession('expired', { expiresAt: PAST }),
      makeSession('active'),
    ];
    const result = purgeExpired(sessions);
    expect(result.map(s => s.name)).toEqual(['active']);
  });
});
