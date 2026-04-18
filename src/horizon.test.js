const { setHorizon, clearHorizon, getHorizon, setHorizonByName, isOverdue, listOverdue, listUpcoming, sortByHorizon } = require('./horizon');

const makeSession = (name, horizon) => ({ id: name, name, horizon });

test('setHorizon sets iso date', () => {
  const s = makeSession('a', null);
  const r = setHorizon(s, '2030-01-01');
  expect(r.horizon).toBe(new Date('2030-01-01').toISOString());
});

test('setHorizon throws on invalid date', () => {
  expect(() => setHorizon(makeSession('a'), 'notadate')).toThrow();
});

test('clearHorizon removes horizon', () => {
  const s = makeSession('a', '2030-01-01T00:00:00.000Z');
  expect(clearHorizon(s).horizon).toBeUndefined();
});

test('getHorizon returns horizon or null', () => {
  expect(getHorizon(makeSession('a', '2030-01-01T00:00:00.000Z'))).toBe('2030-01-01T00:00:00.000Z');
  expect(getHorizon(makeSession('b'))).toBeNull();
});

test('setHorizonByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setHorizonByName(sessions, 'a', '2030-06-01');
  expect(result[0].horizon).toBeTruthy();
  expect(result[1].horizon).toBeUndefined();
});

test('isOverdue returns true for past horizon', () => {
  const s = makeSession('a', '2000-01-01T00:00:00.000Z');
  expect(isOverdue(s)).toBe(true);
});

test('isOverdue returns false for future horizon', () => {
  const s = makeSession('a', '2099-01-01T00:00:00.000Z');
  expect(isOverdue(s)).toBe(false);
});

test('listOverdue filters overdue sessions', () => {
  const sessions = [makeSession('a', '2000-01-01T00:00:00.000Z'), makeSession('b', '2099-01-01T00:00:00.000Z')];
  expect(listOverdue(sessions)).toHaveLength(1);
});

test('listUpcoming returns sessions within days window', () => {
  const soon = new Date(Date.now() + 2 * 86400000).toISOString();
  const far = new Date(Date.now() + 30 * 86400000).toISOString();
  const sessions = [makeSession('a', soon), makeSession('b', far)];
  expect(listUpcoming(sessions, 7)).toHaveLength(1);
});

test('sortByHorizon sorts ascending, nulls last', () => {
  const sessions = [makeSession('c', null), makeSession('a', '2025-01-01T00:00:00.000Z'), makeSession('b', '2024-01-01T00:00:00.000Z')];
  const sorted = sortByHorizon(sessions);
  expect(sorted[0].name).toBe('b');
  expect(sorted[2].name).toBe('c');
});
