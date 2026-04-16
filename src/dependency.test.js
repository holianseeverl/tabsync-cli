const { addDependency, removeDependency, getDependencies, getDependents, hasDependency } = require('./dependency');

function makeSessions() {
  return [
    { id: 'a', name: 'Alpha', tabs: [] },
    { id: 'b', name: 'Beta', tabs: [] },
    { id: 'c', name: 'Gamma', tabs: [] },
  ];
}

test('addDependency links sessions', () => {
  const sessions = makeSessions();
  addDependency(sessions, 'b', 'a');
  expect(sessions[1].dependencies).toContain('a');
});

test('addDependency does not duplicate', () => {
  const sessions = makeSessions();
  addDependency(sessions, 'b', 'a');
  addDependency(sessions, 'b', 'a');
  expect(sessions[1].dependencies.length).toBe(1);
});

test('addDependency throws on self-reference', () => {
  const sessions = makeSessions();
  expect(() => addDependency(sessions, 'a', 'a')).toThrow();
});

test('addDependency throws on missing session', () => {
  const sessions = makeSessions();
  expect(() => addDependency(sessions, 'z', 'a')).toThrow();
});

test('removeDependency unlinks sessions', () => {
  const sessions = makeSessions();
  addDependency(sessions, 'b', 'a');
  removeDependency(sessions, 'b', 'a');
  expect(sessions[1].dependencies).not.toContain('a');
});

test('getDependencies returns linked sessions', () => {
  const sessions = makeSessions();
  addDependency(sessions, 'c', 'a');
  addDependency(sessions, 'c', 'b');
  const deps = getDependencies(sessions, 'c');
  expect(deps.map(s => s.id)).toEqual(['a', 'b']);
});

test('getDependents returns sessions that depend on given id', () => {
  const sessions = makeSessions();
  addDependency(sessions, 'b', 'a');
  addDependency(sessions, 'c', 'a');
  const dependents = getDependents(sessions, 'a');
  expect(dependents.map(s => s.id)).toEqual(['b', 'c']);
});

test('hasDependency returns true/false correctly', () => {
  const sessions = makeSessions();
  addDependency(sessions, 'b', 'a');
  expect(hasDependency(sessions[1], 'a')).toBe(true);
  expect(hasDependency(sessions[1], 'c')).toBe(false);
});
