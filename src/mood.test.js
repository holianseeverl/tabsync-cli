const { isValidMood, setMood, clearMood, setMoodByName, getMood, filterByMood, listMoods } = require('./mood');

const makeSession = (id, name, mood) => ({ id, name, tabs: [], createdAt: new Date().toISOString(), ...(mood ? { mood } : {}) });

describe('isValidMood', () => {
  it('returns true for valid moods', () => {
    expect(isValidMood('focused')).toBe(true);
    expect(isValidMood('urgent')).toBe(true);
  });
  it('returns false for invalid moods', () => {
    expect(isValidMood('happy')).toBe(false);
    expect(isValidMood('')).toBe(false);
  });
});

describe('setMood', () => {
  it('sets mood on matching session', () => {
    const sessions = [makeSession('1', 'Work')];
    const result = setMood(sessions, '1', 'focused');
    expect(result[0].mood).toBe('focused');
  });
  it('throws on invalid mood', () => {
    const sessions = [makeSession('1', 'Work')];
    expect(() => setMood(sessions, '1', 'happy')).toThrow();
  });
  it('does not mutate other sessions', () => {
    const sessions = [makeSession('1', 'A'), makeSession('2', 'B')];
    const result = setMood(sessions, '1', 'relaxed');
    expect(result[1].mood).toBeUndefined();
  });
});

describe('clearMood', () => {
  it('removes mood from session', () => {
    const sessions = [makeSession('1', 'Work', 'urgent')];
    const result = clearMood(sessions, '1');
    expect(result[0].mood).toBeUndefined();
  });
});

describe('setMoodByName', () => {
  it('sets mood by session name', () => {
    const sessions = [makeSession('1', 'Research')];
    const result = setMoodByName(sessions, 'Research', 'exploratory');
    expect(result[0].mood).toBe('exploratory');
  });
});

describe('getMood', () => {
  it('returns mood for session', () => {
    const sessions = [makeSession('1', 'Work', 'focused')];
    expect(getMood(sessions, '1')).toBe('focused');
  });
  it('returns null if no mood', () => {
    const sessions = [makeSession('1', 'Work')];
    expect(getMood(sessions, '1')).toBeNull();
  });
});

describe('filterByMood', () => {
  it('filters sessions by mood', () => {
    const sessions = [makeSession('1', 'A', 'focused'), makeSession('2', 'B', 'relaxed'), makeSession('3', 'C', 'focused')];
    const result = filterByMood(sessions, 'focused');
    expect(result).toHaveLength(2);
  });
});

describe('listMoods', () => {
  it('returns all valid moods', () => {
    const moods = listMoods();
    expect(moods).toContain('focused');
    expect(moods.length).toBeGreaterThan(0);
  });
});
