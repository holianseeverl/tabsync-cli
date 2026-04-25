const {
  handleShowCohesion,
  handleComputeAll,
  handleSortByCohesion,
  handleFilterByMin,
} = require('./cohesionCmd');

function makeSession(overrides = {}) {
  return {
    id: 'sid',
    name: 'Session',
    tabs: [
      { url: 'https://github.com/a', title: 'a repo' },
      { url: 'https://github.com/b', title: 'b repo' },
    ],
    tags: ['dev'],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test('handleShowCohesion logs score for known session', () => {
  const sessions = [makeSession({ name: 'Work' })];
  handleShowCohesion(sessions, 'Work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Work'));
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Cohesion'));
});

test('handleShowCohesion logs not found for unknown session', () => {
  const sessions = [makeSession({ name: 'Work' })];
  handleShowCohesion(sessions, 'Unknown');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleComputeAll attaches cohesion to all sessions', () => {
  const sessions = [
    makeSession({ name: 'A' }),
    makeSession({ name: 'B' }),
  ];
  const result = handleComputeAll(sessions);
  expect(result).toHaveLength(2);
  result.forEach(s => expect(typeof s.cohesion).toBe('number'));
});

test('handleComputeAll logs each session', () => {
  const sessions = [makeSession({ name: 'A' })];
  handleComputeAll(sessions);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('A'));
});

test('handleSortByCohesion returns sorted sessions', () => {
  const sessions = [
    { ...makeSession({ name: 'low' }), cohesion: 0.1 },
    { ...makeSession({ name: 'high' }), cohesion: 0.9 },
  ];
  const sorted = handleSortByCohesion(sessions, 'desc');
  expect(sorted[0].name).toBe('high');
});

test('handleSortByCohesion asc works', () => {
  const sessions = [
    { ...makeSession({ name: 'low' }), cohesion: 0.1 },
    { ...makeSession({ name: 'high' }), cohesion: 0.9 },
  ];
  const sorted = handleSortByCohesion(sessions, 'asc');
  expect(sorted[0].name).toBe('low');
});

test('handleFilterByMin returns sessions above threshold', () => {
  const sessions = [
    { ...makeSession({ name: 'low' }), cohesion: 0.2 },
    { ...makeSession({ name: 'high' }), cohesion: 0.8 },
  ];
  const result = handleFilterByMin(sessions, '0.5');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('high');
});

test('handleFilterByMin logs error for invalid threshold', () => {
  const sessions = [makeSession()];
  handleFilterByMin(sessions, 'bad');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('between 0 and 1'));
});

test('handleFilterByMin logs message when no results', () => {
  const sessions = [{ ...makeSession(), cohesion: 0.1 }];
  handleFilterByMin(sessions, '0.9');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
});
