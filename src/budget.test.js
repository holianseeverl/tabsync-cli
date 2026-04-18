const {
  isValidBudget,
  setBudget,
  clearBudget,
  setBudgetByName,
  getBudget,
  isOverBudget,
  filterOverBudget,
  filterWithinBudget,
  sortByBudget,
} = require('./budget');

const makeSession = (name, tabs = [], budget = undefined) => ({
  id: name,
  name,
  tabs,
  ...(budget !== undefined ? { budget } : {}),
});

test('isValidBudget accepts positive integers', () => {
  expect(isValidBudget(5)).toBe(true);
  expect(isValidBudget(1)).toBe(true);
});

test('isValidBudget rejects invalid values', () => {
  expect(isValidBudget(0)).toBe(false);
  expect(isValidBudget(-1)).toBe(false);
  expect(isValidBudget(1.5)).toBe(false);
  expect(isValidBudget('5')).toBe(false);
});

test('setBudget sets budget on session', () => {
  const s = makeSession('a');
  expect(setBudget(s, 10).budget).toBe(10);
});

test('setBudget throws on invalid budget', () => {
  expect(() => setBudget(makeSession('a'), 0)).toThrow();
});

test('clearBudget removes budget', () => {
  const s = makeSession('a', [], 5);
  expect(clearBudget(s).budget).toBeUndefined();
});

test('setBudgetByName updates matching session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = setBudgetByName(sessions, 'a', 3);
  expect(result.find(s => s.name === 'a').budget).toBe(3);
  expect(result.find(s => s.name === 'b').budget).toBeUndefined();
});

test('getBudget returns budget or null', () => {
  expect(getBudget(makeSession('a', [], 7))).toBe(7);
  expect(getBudget(makeSession('a'))).toBeNull();
});

test('isOverBudget detects over-budget sessions', () => {
  const tabs = ['t1', 't2', 't3'];
  expect(isOverBudget(makeSession('a', tabs, 2))).toBe(true);
  expect(isOverBudget(makeSession('a', tabs, 5))).toBe(false);
  expect(isOverBudget(makeSession('a', tabs))).toBe(false);
});

test('filterOverBudget returns only over-budget sessions', () => {
  const sessions = [
    makeSession('a', ['t1', 't2'], 1),
    makeSession('b', ['t1'], 5),
  ];
  expect(filterOverBudget(sessions).map(s => s.name)).toEqual(['a']);
});

test('filterWithinBudget returns sessions within budget', () => {
  const sessions = [
    makeSession('a', ['t1', 't2'], 1),
    makeSession('b', ['t1'], 5),
  ];
  expect(filterWithinBudget(sessions).map(s => s.name)).toEqual(['b']);
});

test('sortByBudget sorts ascending, nulls last', () => {
  const sessions = [makeSession('a', [], 10), makeSession('b', [], 3), makeSession('c')];
  const sorted = sortByBudget(sessions);
  expect(sorted[0].name).toBe('b');
  expect(sorted[1].name).toBe('a');
  expect(sorted[2].name).toBe('c');
});
