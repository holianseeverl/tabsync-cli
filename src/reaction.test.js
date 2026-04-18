const {
  isValidReaction,
  addReaction,
  removeReaction,
  clearReactions,
  addReactionByName,
  getReactions,
  filterByReaction,
  sortByReactionCount
} = require('./reaction');

const makeSession = (name, reactions = []) => ({ id: name, name, reactions });

test('isValidReaction returns true for valid reactions', () => {
  expect(isValidReaction('👍')).toBe(true);
  expect(isValidReaction('🔥')).toBe(true);
});

test('isValidReaction returns false for invalid reactions', () => {
  expect(isValidReaction('🤡')).toBe(false);
  expect(isValidReaction('')).toBe(false);
});

test('addReaction adds a reaction', () => {
  const s = makeSession('work');
  const result = addReaction(s, '👍');
  expect(result.reactions).toContain('👍');
});

test('addReaction does not duplicate', () => {
  const s = makeSession('work', ['👍']);
  const result = addReaction(s, '👍');
  expect(result.reactions.filter(r => r === '👍').length).toBe(1);
});

test('addReaction throws on invalid reaction', () => {
  expect(() => addReaction(makeSession('x'), '🤡')).toThrow();
});

test('removeReaction removes a reaction', () => {
  const s = makeSession('work', ['👍', '🔥']);
  const result = removeReaction(s, '👍');
  expect(result.reactions).not.toContain('👍');
  expect(result.reactions).toContain('🔥');
});

test('clearReactions clears all reactions', () => {
  const s = makeSession('work', ['👍', '🔥']);
  expect(clearReactions(s).reactions).toEqual([]);
});

test('addReactionByName targets correct session', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = addReactionByName(sessions, 'a', '⭐');
  expect(result[0].reactions).toContain('⭐');
  expect(result[1].reactions).toEqual([]);
});

test('filterByReaction returns matching sessions', () => {
  const sessions = [makeSession('a', ['👍']), makeSession('b', ['🔥']), makeSession('c', ['👍'])];
  expect(filterByReaction(sessions, '👍').map(s => s.name)).toEqual(['a', 'c']);
});

test('sortByReactionCount sorts descending', () => {
  const sessions = [makeSession('a', ['👍']), makeSession('b', ['👍', '🔥', '⭐']), makeSession('c', ['❤️', '🚀'])];
  const sorted = sortByReactionCount(sessions);
  expect(sorted[0].name).toBe('b');
  expect(sorted[2].name).toBe('a');
});

test('getReactions returns empty array when none set', () => {
  expect(getReactions({ name: 'x' })).toEqual([]);
});
