const {
  createChain,
  addToChain,
  removeFromChain,
  reorderChain,
  getChainSessions,
  findChainByName,
  removeChain,
  listChains
} = require('./chain');

const makeSession = (id, name) => ({ id, name, tabs: [] });

test('createChain returns chain with name and empty ids', () => {
  const c = createChain('mychain');
  expect(c.name).toBe('mychain');
  expect(c.sessionIds).toEqual([]);
});

test('addToChain appends session id', () => {
  const c = createChain('c');
  const c2 = addToChain(c, 'abc');
  expect(c2.sessionIds).toContain('abc');
});

test('addToChain does not duplicate', () => {
  const c = createChain('c', ['abc']);
  const c2 = addToChain(c, 'abc');
  expect(c2.sessionIds.length).toBe(1);
});

test('removeFromChain removes session id', () => {
  const c = createChain('c', ['a', 'b']);
  const c2 = removeFromChain(c, 'a');
  expect(c2.sessionIds).toEqual(['b']);
});

test('reorderChain reorders to given list', () => {
  const c = createChain('c', ['a', 'b', 'c']);
  const c2 = reorderChain(c, ['c', 'a', 'b']);
  expect(c2.sessionIds).toEqual(['c', 'a', 'b']);
});

test('reorderChain ignores unknown ids', () => {
  const c = createChain('c', ['a', 'b']);
  const c2 = reorderChain(c, ['b', 'z']);
  expect(c2.sessionIds).toEqual(['b']);
});

test('getChainSessions returns sessions in order', () => {
  const sessions = [makeSession('1', 'A'), makeSession('2', 'B')];
  const c = createChain('c', ['2', '1']);
  const result = getChainSessions(c, sessions);
  expect(result.map(s => s.id)).toEqual(['2', '1']);
});

test('findChainByName finds correct chain', () => {
  const chains = [createChain('foo'), createChain('bar')];
  expect(findChainByName(chains, 'bar').name).toBe('bar');
  expect(findChainByName(chains, 'nope')).toBeNull();
});

test('removeChain removes by name', () => {
  const chains = [createChain('foo'), createChain('bar')];
  const result = removeChain(chains, 'foo');
  expect(result.length).toBe(1);
  expect(result[0].name).toBe('bar');
});

test('listChains returns name and length', () => {
  const chains = [createChain('a', ['x', 'y']), createChain('b')];
  const list = listChains(chains);
  expect(list[0]).toEqual({ name: 'a', length: 2 });
  expect(list[1]).toEqual({ name: 'b', length: 0 });
});
