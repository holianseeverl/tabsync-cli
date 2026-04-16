const {
  hideSession,
  unhideSession,
  hideSessionByName,
  listVisible,
  listHidden,
  toggleVisibility,
} = require('./visibility');

const makeSessions = () => [
  { id: '1', name: 'Work', tabs: [], hidden: false },
  { id: '2', name: 'Personal', tabs: [], hidden: false },
  { id: '3', name: 'Research', tabs: [], hidden: true },
];

describe('hideSession', () => {
  it('marks a session as hidden by id', () => {
    const result = hideSession(makeSessions(), '1');
    expect(result.find(s => s.id === '1').hidden).toBe(true);
  });

  it('does not affect other sessions', () => {
    const result = hideSession(makeSessions(), '1');
    expect(result.find(s => s.id === '2').hidden).toBe(false);
  });

  it('returns same length array', () => {
    const sessions = makeSessions();
    expect(hideSession(sessions, '1')).toHaveLength(sessions.length);
  });
});

describe('unhideSession', () => {
  it('sets hidden to false for a session', () => {
    const result = unhideSession(makeSessions(), '3');
    expect(result.find(s => s.id === '3').hidden).toBe(false);
  });

  it('no-ops on already visible session', () => {
    const result = unhideSession(makeSessions(), '2');
    expect(result.find(s => s.id === '2').hidden).toBe(false);
  });
});

describe('hideSessionByName', () => {
  it('hides the first session with matching name', () => {
    const result = hideSessionByName(makeSessions(), 'Personal');
    expect(result.find(s => s.name === 'Personal').hidden).toBe(true);
  });

  it('does not change sessions with different names', () => {
    const result = hideSessionByName(makeSessions(), 'Personal');
    expect(result.find(s => s.name === 'Work').hidden).toBe(false);
  });
});

describe('listVisible', () => {
  it('returns only non-hidden sessions', () => {
    const result = listVisible(makeSessions());
    expect(result).toHaveLength(2);
    result.forEach(s => expect(s.hidden).not.toBe(true));
  });
});

describe('listHidden', () => {
  it('returns only hidden sessions', () => {
    const result = listHidden(makeSessions());
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });
});

describe('toggleVisibility', () => {
  it('hides a visible session', () => {
    const result = toggleVisibility(makeSessions(), '1');
    expect(result.find(s => s.id === '1').hidden).toBe(true);
  });

  it('unhides a hidden session', () => {
    const result = toggleVisibility(makeSessions(), '3');
    expect(result.find(s => s.id === '3').hidden).toBe(false);
  });
});
