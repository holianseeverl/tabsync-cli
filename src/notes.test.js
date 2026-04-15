const { setNote, removeNote, getNote, filterByNote, setNoteByName } = require('./notes');

const makeSession = (overrides = {}) => ({
  id: 'abc123',
  name: 'Work',
  tabs: ['https://github.com'],
  createdAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('setNote', () => {
  it('adds a note to a session', () => {
    const s = makeSession();
    const result = setNote(s, 'Important tabs');
    expect(result.note).toBe('Important tabs');
  });

  it('trims whitespace from the note', () => {
    const s = makeSession();
    const result = setNote(s, '  trimmed  ');
    expect(result.note).toBe('trimmed');
  });

  it('overwrites an existing note', () => {
    const s = makeSession({ note: 'old note' });
    const result = setNote(s, 'new note');
    expect(result.note).toBe('new note');
  });

  it('does not mutate the original session', () => {
    const s = makeSession();
    setNote(s, 'test');
    expect(s.note).toBeUndefined();
  });

  it('throws on invalid session', () => {
    expect(() => setNote(null, 'note')).toThrow('Invalid session');
  });

  it('throws if note is not a string', () => {
    expect(() => setNote(makeSession(), 42)).toThrow('Note must be a string');
  });
});

describe('removeNote', () => {
  it('removes an existing note', () => {
    const s = makeSession({ note: 'some note' });
    const result = removeNote(s);
    expect(result.note).toBeUndefined();
  });

  it('is a no-op when there is no note', () => {
    const s = makeSession();
    const result = removeNote(s);
    expect(result.note).toBeUndefined();
  });

  it('does not mutate the original', () => {
    const s = makeSession({ note: 'keep' });
    removeNote(s);
    expect(s.note).toBe('keep');
  });
});

describe('getNote', () => {
  it('returns the note when present', () => {
    const s = makeSession({ note: 'hello' });
    expect(getNote(s)).toBe('hello');
  });

  it('returns null when no note', () => {
    expect(getNote(makeSession())).toBeNull();
  });

  it('throws on invalid session', () => {
    expect(() => getNote(undefined)).toThrow('Invalid session');
  });
});

describe('filterByNote', () => {
  const sessions = [
    makeSession({ name: 'A', note: 'project alpha' }),
    makeSession({ name: 'B', note: 'beta release' }),
    makeSession({ name: 'C' }),
  ];

  it('returns sessions whose note contains the keyword', () => {
    const result = filterByNote(sessions, 'alpha');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('A');
  });

  it('is case-insensitive', () => {
    const result = filterByNote(sessions, 'BETA');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('B');
  });

  it('returns empty array when no match', () => {
    expect(filterByNote(sessions, 'zzz')).toHaveLength(0);
  });

  it('skips sessions without a note', () => {
    expect(filterByNote(sessions, '')).toHaveLength(2);
  });

  it('throws when sessions is not an array', () => {
    expect(() => filterByNote(null, 'x')).toThrow('Sessions must be an array');
  });
});

describe('setNoteByName', () => {
  it('updates the note on the matching session', () => {
    const sessions = [makeSession({ name: 'Work' }), makeSession({ name: 'Personal' })];
    const result = setNoteByName(sessions, 'Work', 'urgent');
    expect(result.find((s) => s.name === 'Work').note).toBe('urgent');
    expect(result.find((s) => s.name === 'Personal').note).toBeUndefined();
  });

  it('throws when session name is not found', () => {
    expect(() => setNoteByName([makeSession()], 'Ghost', 'x')).toThrow('Session "Ghost" not found');
  });

  it('does not mutate the original array', () => {
    const sessions = [makeSession({ name: 'Work' })];
    setNoteByName(sessions, 'Work', 'note');
    expect(sessions[0].note).toBeUndefined();
  });
});
