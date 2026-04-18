const {
  handleSetBudget,
  handleClearBudget,
  handleShowBudget,
  handleListOverBudget,
  handleListWithinBudget,
  handleSortByBudget,
} = require('./budgetCmd');

const makeSession = (name, tabs = [], budget = undefined) => ({
  id: name, name, tabs,
  ...(budget !== undefined ? { budget } : {}),
});

beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test('handleSetBudget sets budget and returns updated sessions', () => {
  const sessions = [makeSession('work')];
  const result = handleSetBudget(sessions, 'work', '5');
  expect(result.find(s => s.name === 'work').budget).toBe(5);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('5'));
});

test('handleSetBudget handles missing session', () => {
  const sessions = [makeSession('work')];
  const result = handleSetBudget(sessions, 'other', '5');
  expect(result).toBe(sessions);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleClearBudget removes budget', () => {
  const sessions = [makeSession('work', [], 5)];
  const result = handleClearBudget(sessions, 'work');
  expect(result.find(s => s.name === 'work').budget).toBeUndefined();
});

test('handleClearBudget handles missing session', () => {
  const sessions = [makeSession('work')];
  const result = handleClearBudget(sessions, 'nope');
  expect(result).toBe(sessions);
});

test('handleShowBudget shows over budget status', () => {
  const sessions = [makeSession('a', ['t1','t2','t3'], 2)];
  handleShowBudget(sessions, 'a');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('OVER BUDGET'));
});

test('handleShowBudget shows within budget status', () => {
  const sessions = [makeSession('a', ['t1'], 5)];
  handleShowBudget(sessions, 'a');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('within budget'));
});

test('handleShowBudget shows no budget message', () => {
  const sessions = [makeSession('a', ['t1'])];
  handleShowBudget(sessions, 'a');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('no budget'));
});

test('handleListOverBudget lists over-budget sessions', () => {
  const sessions = [
    makeSession('a', ['t1','t2'], 1),
    makeSession('b', ['t1'], 5),
  ];
  handleListOverBudget(sessions);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('a'));
});

test('handleListOverBudget shows empty message', () => {
  handleListOverBudget([makeSession('a', ['t1'], 5)]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
});

test('handleSortByBudget returns sorted sessions', () => {
  const sessions = [makeSession('a', [], 10), makeSession('b', [], 3)];
  const result = handleSortByBudget(sessions);
  expect(result[0].name).toBe('b');
});
