const {
  setNote,
  removeNote,
  getNote,
  filterByNote,
  setNoteByName
} = require('./notes');

const makeSession = (id, name, note = null) => ({
  id,
  name,
  tabs: [],
  createdAt: new Date().toISOString(),
  tags: [],
  note
});

describe('setNote', () => {
  it('adds a note to a session', () => {
    const session = makeSession('1', 'Work');
    const result = setNote(session, 'important work tabs');
    expect(result.note).toBe('important work tabs');
  });

  it('overwrites an existing note', () => {
    const session = makeSession('1', 'Work', 'old note');
    const result = setNote(session, 'new note');
    expect(result.note).toBe('new note');
  });

  it('does not mutate the original session', () => {
    const session = makeSession('1', 'Work');
    setNote(session, 'something');
    expect(session.note).toBeNull();
  });

  it('throws if note is not a string', () => {
    const session = makeSession('1', 'Work');
    expect(() => setNote(session, 123)).toThrow();
  });

  it('throws if note is null', () => {
    const session = makeSession('1', 'Work');
    expect(() => setNote(session, null)).toThrow();
  });

  it('throws if note is an empty string', () => {
    const session = makeSession('1', 'Work');
    expect(() => setNote(session, '')).toThrow();
  });
});

describe('removeNote', () => {
  it('removes a note from a session', () => {
    const session = makeSession('1', 'Work', 'some note');
    const result = removeNote(session);
    expect(result.note).toBeNull();
  });

  it('handles session with no note gracefully', () => {
    const session = makeSession('1', 'Work');
    const result = removeNote(session);
    expect(result.note).toBeNull();
  });

  it('does not mutate the original session', () => {
    const session = makeSession('1', 'Work', 'some note');
    removeNote(session);
    expect(session.note).toBe('some note');
  });
});

describe('getNote', () => {
  it('returns the note of a session', () => {
    const session = makeSession('1', 'Work', 'my note');
    expect(getNote(session)).toBe('my note');
  });

  it('returns null if no note', () => {
    const session = makeSession('1', 'Work');
    expect(getNote(session)).toBeNull();
  });
});

describe('filterByNote', () => {
  it('returns sessions that have notes matching the keyword', () => {
    const sessions = [
      makeSession('1', 'Work', 'important project'),
      makeSession('2', 'Home', 'personal stuff'),
      makeSession('3', 'Misc', null)
    ];
    const result = filterByNote(sessions, 'important');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns empty array if no matches', () => {
    const sessions = [makeSession('1', 'Work', 'notes here')];
    expect(filterByNote(sessions, 'xyz')).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    const sessions = [makeSession('1', 'Work', 'Important')];
    expect(filterByNote(sessions, 'important')).toHaveLength(1);
  });

  it('skips sessions with no note', () => {
    const sessions = [makeSession('1', 'Work', null)];
    expect(filterByNote(sessions, 'anything')).toHaveLength(0);
  });

  it('returns multiple matching sessions', () => {
    const sessions = [
      makeSession('1', 'Work', 'urgent deadline'),
      makeSession('2', 'Home', 'urgent errand'),
      makeSession('3', 'Misc', 'nothing special')
    ];
    const result = filterByNote(sessions, 'urgent');
    expect(result).toHaveLength(2);
    expect(result.map(s => s.id)).toEqual(['1', '2']);
  });
});
