const {
  isValidRating,
  rateSession,
  clearRating,
  rateSessionByName,
  filterByRating,
  sortByRating,
  getRating,
} = require('./rating');

const baseSessions = [
  { id: '1', name: 'Work', tabs: [], rating: 4 },
  { id: '2', name: 'Research', tabs: [] },
  { id: '3', name: 'Fun', tabs: [], rating: 2 },
];

test('isValidRating accepts 1–5', () => {
  [1, 2, 3, 4, 5].forEach(r => expect(isValidRating(r)).toBe(true));
});

test('isValidRating rejects 0 and 6', () => {
  expect(isValidRating(0)).toBe(false);
  expect(isValidRating(6)).toBe(false);
});

test('rateSession sets rating on matching session', () => {
  const result = rateSession(baseSessions, '2', 3);
  expect(result.find(s => s.id === '2').rating).toBe(3);
});

test('rateSession does not mutate other sessions', () => {
  const result = rateSession(baseSessions, '2', 3);
  expect(result.find(s => s.id === '1').rating).toBe(4);
});

test('rateSession throws on invalid rating', () => {
  expect(() => rateSession(baseSessions, '1', 9)).toThrow('Invalid rating');
});

test('clearRating removes rating field', () => {
  const result = clearRating(baseSessions, '1');
  expect(result.find(s => s.id === '1').rating).toBeUndefined();
});

test('clearRating leaves unrated sessions untouched', () => {
  const result = clearRating(baseSessions, '1');
  expect(result.find(s => s.id === '2').rating).toBeUndefined();
});

test('rateSessionByName finds by name and rates', () => {
  const result = rateSessionByName(baseSessions, 'Research', 5);
  expect(result.find(s => s.name === 'Research').rating).toBe(5);
});

test('rateSessionByName throws if name not found', () => {
  expect(() => rateSessionByName(baseSessions, 'Ghost', 3)).toThrow('Session not found');
});

test('filterByRating returns sessions at or above min', () => {
  const result = filterByRating(baseSessions, 3);
  expect(result.map(s => s.id)).toEqual(['1']);
});

test('sortByRating desc puts highest first', () => {
  const result = sortByRating(baseSessions, 'desc');
  expect(result[0].id).toBe('1');
});

test('sortByRating asc puts lowest first', () => {
  const result = sortByRating(baseSessions, 'asc');
  expect(result[0].rating ?? 0).toBe(0);
});

test('getRating returns null when not set', () => {
  expect(getRating(baseSessions, '2')).toBeNull();
});

test('getRating returns value when set', () => {
  expect(getRating(baseSessions, '1')).toBe(4);
});
