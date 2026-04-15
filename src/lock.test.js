const { lockSession, unlockSession, isLocked, listLocked, lockSessionByName } = require('./lock');

const makeSessions = () => [
  { id: '1', name: 'Work', tabs: [], locked: false },
  { id: '2', name: 'Personal', tabs: [], locked: true },
  { id: '3', name: 'Research', tabs: [], locked: false },
];

describe('lockSession', () => {
  it('locks an unlocked session', () => {
    const result = lockSession(makeSessions(), '1');
    expect(result.find(s => s.id === '1').locked).toBe(true);
  });

  it('is a no-op if already locked', () => {
    const sessions = makeSessions();
    const result = lockSession(sessions, '2');
    expect(result).toEqual(sessions);
  });

  it('throws if session not found', () => {
    expect(() => lockSession(makeSessions(), 'bad-id')).toThrow('Session not found: bad-id');
  });

  it('does not mutate other sessions', () => {
    const result = lockSession(makeSessions(), '1');
    expect(result.find(s => s.id === '3').locked).toBe(false);
  });
});

describe('unlockSession', () => {
  it('unlocks a locked session', () => {
    const result = unlockSession(makeSessions(), '2');
    expect(result.find(s => s.id === '2').locked).toBe(false);
  });

  it('is a no-op if already unlocked', () => {
    const sessions = makeSessions();
    const result = unlockSession(sessions, '1');
    expect(result).toEqual(sessions);
  });

  it('throws if session not found', () => {
    expect(() => unlockSession(makeSessions(), 'nope')).toThrow('Session not found: nope');
  });
});

describe('isLocked', () => {
  it('returns true for a locked session', () => {
    expect(isLocked(makeSessions(), '2')).toBe(true);
  });

  it('returns false for an unlocked session', () => {
    expect(isLocked(makeSessions(), '1')).toBe(false);
  });

  it('throws if session not found', () => {
    expect(() => isLocked(makeSessions(), 'x')).toThrow('Session not found: x');
  });
});

describe('listLocked', () => {
  it('returns only locked sessions', () => {
    const result = listLocked(makeSessions());
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns empty array when none locked', () => {
    const sessions = makeSessions().map(s => ({ ...s, locked: false }));
    expect(listLocked(sessions)).toEqual([]);
  });
});

describe('lockSessionByName', () => {
  it('locks by name case-insensitively', () => {
    const result = lockSessionByName(makeSessions(), 'work');
    expect(result.find(s => s.id === '1').locked).toBe(true);
  });

  it('throws if name not found', () => {
    expect(() => lockSessionByName(makeSessions(), 'Unknown')).toThrow('Session not found: Unknown');
  });
});
