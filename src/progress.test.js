const {
  isValidProgress,
  setProgress,
  clearProgress,
  setProgressByName,
  getProgress,
  filterByMinProgress,
  filterComplete,
  sortByProgress
} = require('./progress');

const base = [
  { id: '1', name: 'Work', tabs: [], progress: 50 },
  { id: '2', name: 'Research', tabs: [], progress: 100 },
  { id: '3', name: 'Shopping', tabs: [] }
];

test('isValidProgress accepts 0-100', () => {
  expect(isValidProgress(0)).toBe(true);
  expect(isValidProgress(100)).toBe(true);
  expect(isValidProgress(50)).toBe(true);
});

test('isValidProgress rejects invalid', () => {
  expect(isValidProgress(-1)).toBe(false);
  expect(isValidProgress(101)).toBe(false);
  expect(isValidProgress('50')).toBe(false);
});

test('setProgress updates session', () => {
  const result = setProgress(base, '3', 75);
  expect(result.find(s => s.id === '3').progress).toBe(75);
});

test('setProgress throws on invalid value', () => {
  expect(() => setProgress(base, '1', 200)).toThrow();
});

test('clearProgress removes progress', () => {
  const result = clearProgress(base, '1');
  expect(result.find(s => s.id === '1').progress).toBeUndefined();
});

test('setProgressByName works by name', () => {
  const result = setProgressByName(base, 'Shopping', 30);
  expect(result.find(s => s.id === '3').progress).toBe(30);
});

test('setProgressByName throws for unknown name', () => {
  expect(() => setProgressByName(base, 'Unknown', 10)).toThrow();
});

test('getProgress returns value', () => {
  expect(getProgress(base, '1')).toBe(50);
});

test('getProgress returns null when unset', () => {
  expect(getProgress(base, '3')).toBeNull();
});

test('filterByMinProgress filters correctly', () => {
  const result = filterByMinProgress(base, 50);
  expect(result.map(s => s.id)).toEqual(['1', '2']);
});

test('filterComplete returns only 100%', () => {
  const result = filterComplete(base);
  expect(result.map(s => s.id)).toEqual(['2']);
});

test('sortByProgress descending', () => {
  const result = sortByProgress(base);
  expect(result[0].id).toBe('2');
  expect(result[1].id).toBe('1');
});
