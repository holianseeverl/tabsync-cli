const { setDeadline, clearDeadline, getDeadline, setDeadlineByName, isOverdue, listOverdue, listUpcoming, sortByDeadline } = require('./deadline');

function makeSession(name, deadline) {
  return { id: name, name, tabs: [], deadline };
}

test('setDeadline stores ISO date', () => {
  const s = makeSession('A', undefined);
  const result = setDeadline(s, '2099-01-01');
  expect(result.deadline).toBe(new Date('2099-01-01').toISOString());
});

test('setDeadline throws on invalid date', () => {
  expect(() => setDeadline(makeSession('A'), 'not-a-date')).toThrow();
});

test('clearDeadline removes deadline', () => {
  const s = makeSession('A', '2099-01-01T00:00:00.000Z');
  expect(clearDeadline(s).deadline).toBeUndefined();
});

test('getDeadline returns null when unset', () => {
  expect(getDeadline(makeSession('A'))).toBeNull();
});

test('setDeadlineByName only updates matching session', () => {
  const sessions = [makeSession('A'), makeSession('B')];
  const result = setDeadlineByName(sessions, 'A', '2099-06-01');
  expect(result[0].deadline).toBeTruthy();
  expect(result[1].deadline).toBeUndefined();
});

test('isOverdue returns true for past deadline', () => {
  const s = makeSession('A', '2000-01-01T00:00:00.000Z');
  expect(isOverdue(s)).toBe(true);
});

test('isOverdue returns false for future deadline', () => {
  const s = makeSession('A', '2099-01-01T00:00:00.000Z');
  expect(isOverdue(s)).toBe(false);
});

test('listOverdue filters correctly', () => {
  const sessions = [makeSession('A', '2000-01-01T00:00:00.000Z'), makeSession('B', '2099-01-01T00:00:00.000Z')];
  expect(listOverdue(sessions)).toHaveLength(1);
  expect(listOverdue(sessions)[0].name).toBe('A');
});

test('listUpcoming returns sessions due within window', () => {
  const soon = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const far = '2099-01-01T00:00:00.000Z';
  const sessions = [makeSession('A', soon), makeSession('B', far), makeSession('C', '2000-01-01T00:00:00.000Z')];
  const result = listUpcoming(sessions);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('A');
});

test('sortByDeadline sorts ascending, nulls last', () => {
  const sessions = [makeSession('C'), makeSession('A', '2099-06-01T00:00:00.000Z'), makeSession('B', '2099-01-01T00:00:00.000Z')];
  const sorted = sortByDeadline(sessions);
  expect(sorted[0].name).toBe('B');
  expect(sorted[1].name).toBe('A');
  expect(sorted[2].name).toBe('C');
});
