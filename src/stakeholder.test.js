const { isValidRole, addStakeholder, removeStakeholder, getStakeholders, addStakeholderByName, filterByStakeholder, filterByRole, listAllStakeholders } = require('./stakeholder');

const makeSession = (name, stakeholders = []) => ({ id: name, name, tabs: [], stakeholders });

test('isValidRole accepts valid roles', () => {
  expect(isValidRole('owner')).toBe(true);
  expect(isValidRole('reviewer')).toBe(true);
  expect(isValidRole('contributor')).toBe(true);
  expect(isValidRole('observer')).toBe(true);
});

test('isValidRole rejects invalid roles', () => {
  expect(isValidRole('admin')).toBe(false);
  expect(isValidRole('')).toBe(false);
});

test('addStakeholder adds a stakeholder', () => {
  const s = makeSession('work');
  const result = addStakeholder(s, 'alice', 'owner');
  expect(result.stakeholders).toHaveLength(1);
  expect(result.stakeholders[0]).toEqual({ name: 'alice', role: 'owner' });
});

test('addStakeholder defaults to observer role', () => {
  const s = makeSession('work');
  const result = addStakeholder(s, 'bob');
  expect(result.stakeholders[0].role).toBe('observer');
});

test('addStakeholder updates role if stakeholder exists', () => {
  const s = makeSession('work', [{ name: 'alice', role: 'observer' }]);
  const result = addStakeholder(s, 'alice', 'reviewer');
  expect(result.stakeholders).toHaveLength(1);
  expect(result.stakeholders[0].role).toBe('reviewer');
});

test('addStakeholder throws on invalid role', () => {
  expect(() => addStakeholder(makeSession('x'), 'alice', 'boss')).toThrow();
});

test('removeStakeholder removes by name', () => {
  const s = makeSession('work', [{ name: 'alice', role: 'owner' }, { name: 'bob', role: 'observer' }]);
  const result = removeStakeholder(s, 'alice');
  expect(result.stakeholders).toHaveLength(1);
  expect(result.stakeholders[0].name).toBe('bob');
});

test('getStakeholders returns empty array if none', () => {
  const s = { id: 'x', name: 'x', tabs: [] };
  expect(getStakeholders(s)).toEqual([]);
});

test('addStakeholderByName targets session by name', () => {
  const sessions = [makeSession('a'), makeSession('b')];
  const result = addStakeholderByName(sessions, 'b', 'carol', 'contributor');
  expect(result[0].stakeholders).toHaveLength(0);
  expect(result[1].stakeholders[0].name).toBe('carol');
});

test('filterByStakeholder filters sessions', () => {
  const sessions = [
    makeSession('a', [{ name: 'alice', role: 'owner' }]),
    makeSession('b', [{ name: 'bob', role: 'reviewer' }]),
  ];
  expect(filterByStakeholder(sessions, 'alice')).toHaveLength(1);
});

test('filterByRole filters sessions by role', () => {
  const sessions = [
    makeSession('a', [{ name: 'alice', role: 'owner' }]),
    makeSession('b', [{ name: 'bob', role: 'observer' }]),
  ];
  expect(filterByRole(sessions, 'owner')).toHaveLength(1);
});

test('listAllStakeholders aggregates across sessions', () => {
  const sessions = [
    makeSession('a', [{ name: 'alice', role: 'owner' }]),
    makeSession('b', [{ name: 'alice', role: 'reviewer' }, { name: 'bob', role: 'observer' }]),
  ];
  const list = listAllStakeholders(sessions);
  const alice = list.find(x => x.name === 'alice');
  expect(alice.roles).toContain('owner');
  expect(alice.roles).toContain('reviewer');
  expect(list).toHaveLength(2);
});
