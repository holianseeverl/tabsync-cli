const { isValidSignal, setSignal, clearSignal, setSignalByName, getSignal, filterBySignal, sortBySignal } = require('./signal');

function makeSession(name, signal) {
  const s = { id: name, name, tabs: [] };
  if (signal) s.signal = signal;
  return s;
}

describe('isValidSignal', () => {
  test('accepts valid signals', () => {
    expect(isValidSignal('low')).toBe(true);
    expect(isValidSignal('critical')).toBe(true);
  });
  test('rejects invalid', () => {
    expect(isValidSignal('urgent')).toBe(false);
  });
});

describe('setSignal', () => {
  test('sets signal on session', () => {
    const s = makeSession('a');
    expect(setSignal(s, 'high').signal).toBe('high');
  });
  test('throws on invalid signal', () => {
    expect(() => setSignal(makeSession('a'), 'unknown')).toThrow();
  });
  test('does not mutate original', () => {
    const s = makeSession('a');
    setSignal(s, 'low');
    expect(s.signal).toBeUndefined();
  });
});

describe('clearSignal', () => {
  test('removes signal', () => {
    const s = makeSession('a', 'medium');
    expect(clearSignal(s).signal).toBeUndefined();
  });
});

describe('setSignalByName', () => {
  test('updates matching session', () => {
    const sessions = [makeSession('a'), makeSession('b')];
    const result = setSignalByName(sessions, 'a', 'critical');
    expect(result.find(s => s.name === 'a').signal).toBe('critical');
    expect(result.find(s => s.name === 'b').signal).toBeUndefined();
  });
});

describe('getSignal', () => {
  test('returns signal or null', () => {
    expect(getSignal(makeSession('a', 'low'))).toBe('low');
    expect(getSignal(makeSession('b'))).toBeNull();
  });
});

describe('filterBySignal', () => {
  test('filters correctly', () => {
    const sessions = [makeSession('a', 'high'), makeSession('b', 'low'), makeSession('c', 'high')];
    expect(filterBySignal(sessions, 'high').map(s => s.name)).toEqual(['a', 'c']);
  });
});

describe('sortBySignal', () => {
  test('sorts critical first', () => {
    const sessions = [makeSession('a', 'low'), makeSession('b', 'critical'), makeSession('c', 'medium')];
    const sorted = sortBySignal(sessions);
    expect(sorted[0].name).toBe('b');
    expect(sorted[sorted.length - 1].name).toBe('a');
  });
  test('sessions without signal go last', () => {
    const sessions = [makeSession('x'), makeSession('y', 'high')];
    expect(sortBySignal(sessions)[0].name).toBe('y');
  });
});
