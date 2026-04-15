const { addLabel, removeLabel, addLabelByName, removeLabelByName, filterByLabel, getAllLabels, getLabels } = require('./label');

const base = [
  { id: '1', name: 'Work', tabs: [], labels: ['important'] },
  { id: '2', name: 'Personal', tabs: [], labels: [] },
  { id: '3', name: 'Research', tabs: [] },
];

test('addLabel adds a label to a session by id', () => {
  const result = addLabel(base, '2', 'fun');
  expect(result.find(s => s.id === '2').labels).toContain('fun');
});

test('addLabel does not duplicate existing label', () => {
  const result = addLabel(base, '1', 'important');
  expect(result.find(s => s.id === '1').labels.filter(l => l === 'important').length).toBe(1);
});

test('addLabel handles session with no labels field', () => {
  const result = addLabel(base, '3', 'research');
  expect(result.find(s => s.id === '3').labels).toEqual(['research']);
});

test('removeLabel removes a label from a session', () => {
  const result = removeLabel(base, '1', 'important');
  expect(result.find(s => s.id === '1').labels).not.toContain('important');
});

test('removeLabel is a no-op if label not present', () => {
  const result = removeLabel(base, '2', 'nonexistent');
  expect(result.find(s => s.id === '2').labels).toEqual([]);
});

test('addLabelByName finds session by name', () => {
  const result = addLabelByName(base, 'Personal', 'leisure');
  expect(result.find(s => s.name === 'Personal').labels).toContain('leisure');
});

test('addLabelByName throws if session not found', () => {
  expect(() => addLabelByName(base, 'Ghost', 'x')).toThrow('Session "Ghost" not found');
});

test('removeLabelByName removes label by session name', () => {
  const result = removeLabelByName(base, 'Work', 'important');
  expect(result.find(s => s.name === 'Work').labels).not.toContain('important');
});

test('filterByLabel returns matching sessions', () => {
  const result = filterByLabel(base, 'important');
  expect(result.length).toBe(1);
  expect(result[0].name).toBe('Work');
});

test('filterByLabel returns empty array if none match', () => {
  expect(filterByLabel(base, 'unknown')).toEqual([]);
});

test('getAllLabels returns sorted unique labels', () => {
  const sessions = [
    { id: '1', labels: ['beta', 'alpha'] },
    { id: '2', labels: ['alpha', 'gamma'] },
  ];
  expect(getAllLabels(sessions)).toEqual(['alpha', 'beta', 'gamma']);
});

test('getLabels returns empty array when no labels field', () => {
  expect(getLabels({ id: '1', name: 'X' })).toEqual([]);
});
