const { handleSetAlias, handleClearAlias, handleShowAlias, handleFindByAlias, handleListAliases } = require('./aliasCmd');

function makeSession(name, alias) {
  return { id: name, name, tabs: [], alias: alias || undefined };
}

describe('handleSetAlias', () => {
  it('sets alias on matching session', () => {
    const sessions = [makeSession('work'), makeSession('home')];
    const result = handleSetAlias(sessions, 'work', 'w');
    expect(result.find(s => s.name === 'work').alias).toBe('w');
  });

  it('returns original sessions if session not found', () => {
    const sessions = [makeSession('work')];
    const result = handleSetAlias(sessions, 'nope', 'x');
    expect(result).toBe(sessions);
  });
});

describe('handleClearAlias', () => {
  it('clears alias from session', () => {
    const sessions = [makeSession('work', 'w')];
    const result = handleClearAlias(sessions, 'work');
    expect(result.find(s => s.name === 'work').alias).toBeUndefined();
  });

  it('returns original sessions if session not found', () => {
    const sessions = [makeSession('work')];
    const result = handleClearAlias(sessions, 'nope');
    expect(result).toBe(sessions);
  });
});

describe('handleShowAlias', () => {
  it('logs alias if present', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleShowAlias([makeSession('work', 'w')], 'work');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('w'));
    spy.mockRestore();
  });

  it('logs no alias message if absent', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleShowAlias([makeSession('work')], 'work');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No alias'));
    spy.mockRestore();
  });
});

describe('handleFindByAlias', () => {
  it('logs found session', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleFindByAlias([makeSession('work', 'w')], 'w');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('work'));
    spy.mockRestore();
  });

  it('logs not found message', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleFindByAlias([makeSession('work')], 'z');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No session found'));
    spy.mockRestore();
  });
});

describe('handleListAliases', () => {
  it('lists sessions with aliases', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleListAliases([makeSession('work', 'w'), makeSession('home')]);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('logs empty message when none', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleListAliases([makeSession('work')]);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
    spy.mockRestore();
  });
});
