const { isValidSentiment, setSentiment, clearSentiment, setSentimentByName, getSentiment, filterBySentiment, sortBySentiment } = require('./sentiment');

function makeSession(overrides = {}) {
  return { id: 's1', name: 'Test', tabs: [], createdAt: new Date().toISOString(), ...overrides };
}

test('isValidSentiment accepts valid values', () => {
  expect(isValidSentiment('positive')).toBe(true);
  expect(isValidSentiment('negative')).toBe(true);
  expect(isValidSentiment('neutral')).toBe(true);
  expect(isValidSentiment('mixed')).toBe(true);
});

test('isValidSentiment rejects invalid values', () => {
  expect(isValidSentiment('happy')).toBe(false);
  expect(isValidSentiment('')).toBe(false);
});

test('setSentiment sets sentiment on matching session', () => {
  const sessions = [makeSession({ id: 's1' })];
  const result = setSentiment(sessions, 's1', 'positive');
  expect(result[0].sentiment).toBe('positive');
});

test('setSentiment throws on invalid sentiment', () => {
  const sessions = [makeSession()];
  expect(() => setSentiment(sessions, 's1', 'ecstatic')).toThrow();
});

test('clearSentiment removes sentiment', () => {
  const sessions = [makeSession({ sentiment: 'negative' })];
  const result = clearSentiment(sessions, 's1');
  expect(result[0].sentiment).toBeUndefined();
});

test('setSentimentByName sets by name', () => {
  const sessions = [makeSession({ name: 'Work' })];
  const result = setSentimentByName(sessions, 'Work', 'neutral');
  expect(result[0].sentiment).toBe('neutral');
});

test('getSentiment returns sentiment or null', () => {
  expect(getSentiment(makeSession({ sentiment: 'mixed' }))).toBe('mixed');
  expect(getSentiment(makeSession())).toBeNull();
});

test('filterBySentiment filters correctly', () => {
  const sessions = [
    makeSession({ id: 's1', sentiment: 'positive' }),
    makeSession({ id: 's2', sentiment: 'negative' }),
  ];
  expect(filterBySentiment(sessions, 'positive')).toHaveLength(1);
  expect(filterBySentiment(sessions, 'positive')[0].id).toBe('s1');
});

test('sortBySentiment sorts positive first', () => {
  const sessions = [
    makeSession({ id: 's1', sentiment: 'negative' }),
    makeSession({ id: 's2', sentiment: 'positive' }),
    makeSession({ id: 's3', sentiment: 'neutral' }),
  ];
  const sorted = sortBySentiment(sessions);
  expect(sorted[0].id).toBe('s2');
  expect(sorted[2].id).toBe('s1');
});
