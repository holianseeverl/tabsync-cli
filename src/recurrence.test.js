const {
  isValidFrequency,
  setRecurrence,
  clearRecurrence,
  setRecurrenceByName,
  getRecurrence,
  filterByFrequency,
  listRecurring
} = require('./recurrence');

function makeSession(name = 'Test') {
  return { id: '1', name, tabs: [] };
}

test('isValidFrequency accepts valid values', () => {
  expect(isValidFrequency('daily')).toBe(true);
  expect(isValidFrequency('weekly')).toBe(true);
  expect(isValidFrequency('monthly')).toBe(true);
});

test('isValidFrequency rejects invalid values', () => {
  expect(isValidFrequency('hourly')).toBe(false);
  expect(isValidFrequency('')).toBe(false);
});

test('setRecurrence adds recurrence to session', () => {
  const s = makeSession();
  const updated = setRecurrence(s, 'weekly', 'Monday');
  expect(updated.recurrence.frequency).toBe('weekly');
  expect(updated.recurrence.dayOrDate).toBe('Monday');
  expect(updated.recurrence.setAt).toBeDefined();
});

test('setRecurrence throws on invalid frequency', () => {
  expect(() => setRecurrence(makeSession(), 'hourly')).toThrow();
});

test('clearRecurrence removes recurrence', () => {
  const s = setRecurrence(makeSession(), 'daily');
  const cleared = clearRecurrence(s);
  expect(cleared.recurrence).toBeUndefined();
});

test('setRecurrenceByName updates matching session', () => {
  const sessions = [makeSession('A'), makeSession('B')];
  const updated = setRecurrenceByName(sessions, 'A', 'monthly', '1');
  expect(updated[0].recurrence.frequency).toBe('monthly');
  expect(updated[1].recurrence).toBeUndefined();
});

test('getRecurrence returns recurrence or null', () => {
  const s = makeSession();
  expect(getRecurrence(s)).toBeNull();
  const r = setRecurrence(s, 'daily');
  expect(getRecurrence(r).frequency).toBe('daily');
});

test('filterByFrequency filters correctly', () => {
  const sessions = [
    setRecurrence(makeSession('A'), 'daily'),
    setRecurrence(makeSession('B'), 'weekly'),
    makeSession('C')
  ];
  const result = filterByFrequency(sessions, 'daily');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('A');
});

test('listRecurring returns only sessions with recurrence', () => {
  const sessions = [
    setRecurrence(makeSession('A'), 'weekly'),
    makeSession('B')
  ];
  expect(listRecurring(sessions)).toHaveLength(1);
});
