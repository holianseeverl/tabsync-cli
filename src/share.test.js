const { encodeSession, decodeSession, generateShareUrl, decodeShareUrl } = require('./share');

const validSession = {
  id: 'abc123',
  name: 'Work Tabs',
  tabs: [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://notion.so', title: 'Notion' }
  ],
  createdAt: '2024-01-15T10:00:00.000Z'
};

describe('encodeSession', () => {
  test('returns a non-empty base64 string', () => {
    const code = encodeSession(validSession);
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);
  });

  test('throws on invalid session', () => {
    expect(() => encodeSession({ name: 'bad' })).toThrow('Cannot encode invalid session');
  });
});

describe('decodeSession', () => {
  test('round-trips a session correctly', () => {
    const code = encodeSession(validSession);
    const result = decodeSession(code);
    expect(result).toEqual(validSession);
  });

  test('throws on empty string', () => {
    expect(() => decodeSession('')).toThrow('Invalid share code');
  });

  test('throws on non-string input', () => {
    expect(() => decodeSession(null)).toThrow('Invalid share code');
  });

  test('throws on garbled base64 that decodes to invalid JSON', () => {
    const bad = Buffer.from('not-json!!!', 'utf8').toString('base64');
    expect(() => decodeSession(bad)).toThrow('Share code contains invalid JSON');
  });

  test('throws when decoded JSON is not a valid session', () => {
    const bad = Buffer.from(JSON.stringify({ foo: 'bar' }), 'utf8').toString('base64');
    expect(() => decodeSession(bad)).toThrow('Decoded data is not a valid session');
  });
});

describe('generateShareUrl', () => {
  test('returns a URL containing the session param', () => {
    const url = generateShareUrl(validSession);
    expect(url).toContain('https://tabsync.app/import');
    expect(url).toContain('session=');
  });

  test('accepts a custom base URL', () => {
    const url = generateShareUrl(validSession, 'http://localhost:3000/share');
    expect(url).toStartWith('http://localhost:3000/share');
  });
});

describe('decodeShareUrl', () => {
  test('recovers the original session from a share URL', () => {
    const url = generateShareUrl(validSession);
    const result = decodeShareUrl(url);
    expect(result).toEqual(validSession);
  });

  test('throws on a URL with no session param', () => {
    expect(() => decodeShareUrl('https://tabsync.app/import')).toThrow('No session parameter found in URL');
  });

  test('throws on a completely invalid URL', () => {
    expect(() => decodeShareUrl('not-a-url')).toThrow('Invalid URL provided');
  });
});
