const { pinSession, unpinSession, listPinned, isPinned } = require('./pin');

const makeSessions = () => [
  { id: 'a1', name: 'Work', tabs: [], pinned: false },
  { id: 'b2', name: 'Research', tabs: [], pinned: true },
  { id: 'c3', name: 'Personal', tabs: [] }
];

describe('pinSession', () => {
  it('pins an unpinned session', () => {
    const result = pinSession(makeSessions(), 'a1');
    expect(result.find(s => s.id === 'a1').pinned).toBe(true);
  });

  it('does not affect other sessions', () => {
    const result = pinSession(makeSessions(), 'a1');
    expect(result.find(s => s.id === 'c3').pinned).toBeUndefined();
  });

  it('throws if session not found', () => {
    expect(() => pinSession(makeSessions(), 'zzz')).toThrow('Session not found: zzz');
  });
});

describe('unpinSession', () => {
  it('unpins a pinned session', () => {
    const result = unpinSession(makeSessions(), 'b2');
    expect(result.find(s => s.id === 'b2').pinned).toBe(false);
  });

  it('throws if session not found', () => {
    expect(() => unpinSession(makeSessions(), 'nope')).toThrow('Session not found: nope');
  });
});

describe('listPinned', () => {
  it('returns only pinned sessions', () => {
    const result = listPinned(makeSessions());
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b2');
  });

  it('returns empty array if none pinned', () => {
    const sessions = [{ id: 'x', name: 'X', tabs: [] }];
    expect(listPinned(sessions)).toEqual([]);
  });
});

describe('isPinned', () => {
  it('returns true for pinned session', () => {
    expect(isPinned({ id: 'b2', pinned: true })).toBe(true);
  });

  it('returns false for unpinned session', () => {
    expect(isPinned({ id: 'a1', pinned: false })).toBe(false);
  });

  it('returns false if pinned field is missing', () => {
    expect(isPinned({ id: 'c3' })).toBe(false);
  });
});
