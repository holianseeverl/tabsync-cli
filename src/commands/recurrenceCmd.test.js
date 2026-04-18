const {
  handleSetRecurrence,
  handleClearRecurrence,
  handleShowRecurrence,
  handleFilterByFrequency,
  handleListRecurring
} = require('./recurrenceCmd');

function makeSession(name) {
  return { id: name, name, tabs: [] };
}

test('handleSetRecurrence sets recurrence on named session', () => {
  const sessions = [makeSession('Work'), makeSession('Personal')];
  const updated = handleSetRecurrence(sessions, 'Work', 'daily');
  expect(updated.find(s => s.name === 'Work').recurrence.frequency).toBe('daily');
  expect(updated.find(s => s.name === 'Personal').recurrence).toBeUndefined();
});

test('handleSetRecurrence returns unchanged sessions on invalid frequency', () => {
  const sessions = [makeSession('Work')];
  const updated = handleSetRecurrence(sessions, 'Work', 'hourly');
  expect(updated[0].recurrence).toBeUndefined();
});

test('handleSetRecurrence returns unchanged sessions if name not found', () => {
  const sessions = [makeSession('Work')];
  const updated = handleSetRecurrence(sessions, 'Nope', 'daily');
  expect(updated).toEqual(sessions);
});

test('handleClearRecurrence removes recurrence', () => {
  const sessions = [{ ...makeSession('Work'), recurrence: { frequency: 'weekly', dayOrDate: null, setAt: '' } }];
  const updated = handleClearRecurrence(sessions, 'Work');
  expect(updated[0].recurrence).toBeUndefined();
});

test('handleClearRecurrence returns unchanged if not found', () => {
  const sessions = [makeSession('Work')];
  const updated = handleClearRecurrence(sessions, 'Ghost');
  expect(updated).toEqual(sessions);
});

test('handleShowRecurrence logs recurrence info', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const sessions = [{ ...makeSession('Work'), recurrence: { frequency: 'monthly', dayOrDate: '1', setAt: 'now' } }];
  handleShowRecurrence(sessions, 'Work');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('monthly'));
  spy.mockRestore();
});

test('handleFilterByFrequency lists matching sessions', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const sessions = [
    { ...makeSession('A'), recurrence: { frequency: 'daily', dayOrDate: null } },
    { ...makeSession('B'), recurrence: { frequency: 'weekly', dayOrDate: null } }
  ];
  handleFilterByFrequency(sessions, 'daily');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('A'));
  spy.mockRestore();
});

test('handleListRecurring lists all recurring sessions', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const sessions = [
    { ...makeSession('A'), recurrence: { frequency: 'weekly', dayOrDate: 'Monday' } },
    makeSession('B')
  ];
  handleListRecurring(sessions);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('A'));
  spy.mockRestore();
});
