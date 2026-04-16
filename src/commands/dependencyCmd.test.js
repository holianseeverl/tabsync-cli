const { handleAddDependency, handleRemoveDependency, handleShowDependencies, handleShowDependents } = require('./dependencyCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const baseSessions = () => [
  { id: 'a', name: 'Alpha', tabs: [] },
  { id: 'b', name: 'Beta', tabs: [] },
];

beforeEach(() => {
  loadSessions.mockReturnValue(baseSessions());
  saveSessions.mockClear();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

test('handleAddDependency saves updated sessions', () => {
  handleAddDependency('b', 'a', 'test.json');
  expect(saveSessions).toHaveBeenCalled();
  const saved = saveSessions.mock.calls[0][0];
  const b = saved.find(s => s.id === 'b');
  expect(b.dependencies).toContain('a');
});

test('handleAddDependency logs error on invalid ids', () => {
  handleAddDependency('z', 'a', 'test.json');
  expect(console.error).toHaveBeenCalled();
  expect(saveSessions).not.toHaveBeenCalled();
});

test('handleRemoveDependency removes and saves', () => {
  loadSessions.mockReturnValue([
    { id: 'a', name: 'Alpha', tabs: [] },
    { id: 'b', name: 'Beta', tabs: [], dependencies: ['a'] },
  ]);
  handleRemoveDependency('b', 'a', 'test.json');
  expect(saveSessions).toHaveBeenCalled();
  const saved = saveSessions.mock.calls[0][0];
  expect(saved.find(s => s.id === 'b').dependencies).not.toContain('a');
});

test('handleShowDependencies prints deps', () => {
  loadSessions.mockReturnValue([
    { id: 'a', name: 'Alpha', tabs: [] },
    { id: 'b', name: 'Beta', tabs: [], dependencies: ['a'] },
  ]);
  handleShowDependencies('b', 'test.json');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Alpha'));
});

test('handleShowDependencies prints none message', () => {
  handleShowDependencies('a', 'test.json');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No dependencies'));
});

test('handleShowDependents prints dependents', () => {
  loadSessions.mockReturnValue([
    { id: 'a', name: 'Alpha', tabs: [] },
    { id: 'b', name: 'Beta', tabs: [], dependencies: ['a'] },
  ]);
  handleShowDependents('a', 'test.json');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Beta'));
});
