const {
  handleSetPriority,
  handleClearPriority,
  handleFilterByPriority,
  handleSortByPriority
} = require('./priorityCmd');
const { loadSessions, saveSessions } = require('../sessionStore');

jest.mock('../sessionStore');

const mockSessions = [
  { id: '1', name: 'Work', tabs: [], priority: 'high' },
  { id: '2', name: 'Personal', tabs: [], priority: 'low' },
  { id: '3', name: 'Research', tabs: [] }
];

beforeEach(() => {
  jest.clearAllMocks();
  loadSessions.mockReturnValue(JSON.parse(JSON.stringify(mockSessions)));
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
  process.exit.mockRestore();
});

describe('handleSetPriority', () => {
  it('saves updated sessions with new priority', () => {
    handleSetPriority('Research', 'medium');
    expect(saveSessions).toHaveBeenCalled();
    const saved = saveSessions.mock.calls[0][0];
    expect(saved.find(s => s.name === 'Research').priority).toBe('medium');
  });

  it('logs confirmation message', () => {
    handleSetPriority('Work', 'critical');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
  });

  it('exits on invalid priority', () => {
    expect(() => handleSetPriority('Work', 'extreme')).toThrow('exit');
    expect(console.error).toHaveBeenCalled();
  });

  it('exits if session not found', () => {
    expect(() => handleSetPriority('Ghost', 'low')).toThrow('exit');
  });
});

describe('handleClearPriority', () => {
  it('removes priority from session', () => {
    handleClearPriority('Work');
    const saved = saveSessions.mock.calls[0][0];
    expect(saved.find(s => s.name === 'Work').priority).toBeUndefined();
  });

  it('exits if session not found', () => {
    expect(() => handleClearPriority('Nonexistent')).toThrow('exit');
  });
});

describe('handleFilterByPriority', () => {
  it('logs sessions matching priority', () => {
    handleFilterByPriority('high');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
  });

  it('logs message when no sessions match', () => {
    handleFilterByPriority('medium');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
  });

  it('exits on invalid priority', () => {
    expect(() => handleFilterByPriority('nope')).toThrow('exit');
  });
});

describe('handleSortByPriority', () => {
  it('logs all sessions in priority order', () => {
    handleSortByPriority();
    expect(console.log).toHaveBeenCalledTimes(mockSessions.length);
  });

  it('shows none for sessions without priority', () => {
    handleSortByPriority();
    const calls = console.log.mock.calls.map(c => c[0]);
    expect(calls.some(c => c.includes('none'))).toBe(true);
  });
});
