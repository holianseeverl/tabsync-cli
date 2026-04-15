const { handleRate, handleClearRating, handleFilterByRating, handleSortByRating } = require('./ratingCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const mockSessions = [
  { id: '1', name: 'Work', tabs: [1, 2], rating: 4 },
  { id: '2', name: 'Research', tabs: [1], rating: 2 },
  { id: '3', name: 'Fun', tabs: [1, 2, 3] },
];

beforeEach(() => {
  loadSessions.mockReturnValue(JSON.parse(JSON.stringify(mockSessions)));
  saveSessions.mockClear();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('handleRate saves updated sessions with new rating', () => {
  handleRate('Fun', 5);
  const saved = saveSessions.mock.calls[0][0];
  expect(saved.find(s => s.name === 'Fun').rating).toBe(5);
});

test('handleRate logs confirmation', () => {
  handleRate('Work', 3);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('3'));
});

test('handleRate throws on invalid rating', () => {
  expect(() => handleRate('Work', 9)).toThrow();
});

test('handleClearRating removes rating and saves', () => {
  handleClearRating('Work');
  const saved = saveSessions.mock.calls[0][0];
  expect(saved.find(s => s.name === 'Work').rating).toBeUndefined();
});

test('handleClearRating exits if session not found', () => {
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => handleClearRating('Ghost')).toThrow('exit');
  exitSpy.mockRestore();
});

test('handleFilterByRating prints sessions at or above threshold', () => {
  handleFilterByRating(3);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
  expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Research'));
});

test('handleFilterByRating shows message if no results', () => {
  handleFilterByRating(5);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
});

test('handleSortByRating desc lists highest rated first', () => {
  const calls = [];
  console.log.mockImplementation(msg => calls.push(msg));
  handleSortByRating('desc');
  expect(calls[0]).toContain('4★');
});

test('handleSortByRating asc lists unrated or lowest first', () => {
  const calls = [];
  console.log.mockImplementation(msg => calls.push(msg));
  handleSortByRating('asc');
  expect(calls[0]).toContain('unrated');
});
