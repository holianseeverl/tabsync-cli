'use strict';

const { createSession, isValidSession } = require('./session');

describe('createSession', () => {
  test('creates a session with correct shape', () => {
    const session = createSession('Work', [
      { title: 'GitHub', url: 'https://github.com' },
      { title: 'Docs', url: 'https://nodejs.org' },
    ]);

    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('name', 'Work');
    expect(session).toHaveProperty('createdAt');
    expect(session.tabs).toHaveLength(2);
    expect(session.tabs[0]).toEqual({ title: 'GitHub', url: 'https://github.com' });
  });

  test('falls back to url as title when title is missing', () => {
    const session = createSession('Minimal', [{ url: 'https://example.com' }]);
    expect(session.tabs[0].title).toBe('https://example.com');
  });

  test('trims whitespace from session name', () => {
    const session = createSession('  Research  ', []);
    expect(session.name).toBe('Research');
  });

  test('throws when name is empty', () => {
    expect(() => createSession('')).toThrow('Session name must be a non-empty string');
    expect(() => createSession('   ')).toThrow('Session name must be a non-empty string');
  });

  test('throws when a tab has no url', () => {
    expect(() =>
      createSession('Bad', [{ title: 'No URL here' }])
    ).toThrow('Tab at index 0 is missing a valid url');
  });

  test('generates unique ids for each session', () => {
    const a = createSession('A', []);
    const b = createSession('B', []);
    expect(a.id).not.toBe(b.id);
  });
});

describe('isValidSession', () => {
  test('returns true for a valid session object', () => {
    const session = createSession('Test', [{ url: 'https://test.com' }]);
    expect(isValidSession(session)).toBe(true);
  });

  test('returns false for missing fields', () => {
    expect(isValidSession({ name: 'oops' })).toBe(false);
    expect(isValidSession(null)).toBe(false);
    expect(isValidSession(42)).toBe(false);
  });

  test('returns false when tabs is not an array', () => {
    expect(isValidSession({ id: '1', name: 'x', createdAt: 'now', tabs: 'nope' })).toBe(false);
  });
});
