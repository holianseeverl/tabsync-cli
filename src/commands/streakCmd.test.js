const { handleIncrementStreak, handleClearStreak, handleShowStreak, handleFilterByMinStreak, handleSortByStreak } = require('./streakCmd');

function makeSession(name, streak) {
  return { id: name, name, tabs: [], createdAt: new Date().toISOString(), ...(streak ? { streak } : {}) };
}

beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test('handleIncrementStreak logs and returns updated sessions', () => {
  const sessions = [makeSession('work')];
  const result = handleIncrementStreak(sessions, 'work', '2024-03-01T09:00:00.000Z');
  expect(result[0].streak.count).toBe(1);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('1 day'));
});

test('handleIncrementStreak warns if not found', () => {
  const sessions = [makeSession('work')];
  handleIncrementStreak(sessions, 'missing');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleClearStreak removes streak', () => {
  const sessions = [makeSession('work', { count: 5, lastAccessed: '2024-03-01T00:00:00.000Z' })];
  const result = handleClearStreak(sessions, 'work');
  expect(result[0].streak).toBeUndefined();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('cleared'));
});

test('handleClearStreak warns if not found', () => {
  handleClearStreak([], 'ghost');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleShowStreak prints streak info', () => {
  const sessions = [makeSession('work', { count: 3, lastAccessed: '2024-03-01T00:00:00.000Z' })];
  handleShowStreak(sessions, 'work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('3 day'));
});

test('handleShowStreak warns if not found', () => {
  handleShowStreak([], 'ghost');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleFilterByMinStreak prints matching sessions', () => {
  const sessions = [
    makeSession('a', { count: 10, lastAccessed: null }),
    makeSession('b', { count: 2, lastAccessed: null })
  ];
  handleFilterByMinStreak(sessions, 5);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('a'));
});

test('handleFilterByMinStreak shows none message', () => {
  handleFilterByMinStreak([], 5);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
});

test('handleSortByStreak returns sorted sessions', () => {
  const sessions = [
    makeSession('a', { count: 1, lastAccessed: null }),
    makeSession('b', { count: 8, lastAccessed: null })
  ];
  const result = handleSortByStreak(sessions);
  expect(result[0].name).toBe('b');
});
