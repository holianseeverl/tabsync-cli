const {
  favoriteSession,
  unfavoriteSession,
  listFavorites,
  isFavorite,
  toggleFavoriteByName,
} = require('./favorite');

const makeSession = (name, extra = {}) => ({
  id: `id-${name}`,
  name,
  tabs: [],
  createdAt: new Date().toISOString(),
  ...extra,
});

describe('favoriteSession', () => {
  it('sets favorite to true', () => {
    const s = makeSession('work');
    expect(favoriteSession(s).favorite).toBe(true);
  });

  it('does not mutate original', () => {
    const s = makeSession('work');
    favoriteSession(s);
    expect(s.favorite).toBeUndefined();
  });
});

describe('unfavoriteSession', () => {
  it('removes favorite property', () => {
    const s = makeSession('work', { favorite: true });
    const result = unfavoriteSession(s);
    expect(result.favorite).toBeUndefined();
  });

  it('does not mutate original', () => {
    const s = makeSession('work', { favorite: true });
    unfavoriteSession(s);
    expect(s.favorite).toBe(true);
  });
});

describe('listFavorites', () => {
  it('returns only favorited sessions', () => {
    const sessions = [
      makeSession('a', { favorite: true }),
      makeSession('b'),
      makeSession('c', { favorite: true }),
    ];
    expect(listFavorites(sessions).map((s) => s.name)).toEqual(['a', 'c']);
  });

  it('returns empty array when none are favorites', () => {
    expect(listFavorites([makeSession('x')])).toEqual([]);
  });
});

describe('isFavorite', () => {
  it('returns true for favorited session', () => {
    expect(isFavorite(makeSession('a', { favorite: true }))).toBe(true);
  });

  it('returns false when not favorited', () => {
    expect(isFavorite(makeSession('a'))).toBe(false);
  });
});

describe('toggleFavoriteByName', () => {
  it('favorites a non-favorited session', () => {
    const sessions = [makeSession('alpha')];
    const result = toggleFavoriteByName(sessions, 'alpha');
    expect(result[0].favorite).toBe(true);
  });

  it('unfavorites an already favorited session', () => {
    const sessions = [makeSession('alpha', { favorite: true })];
    const result = toggleFavoriteByName(sessions, 'alpha');
    expect(result[0].favorite).toBeUndefined();
  });

  it('leaves unrelated sessions untouched', () => {
    const sessions = [makeSession('alpha'), makeSession('beta', { favorite: true })];
    const result = toggleFavoriteByName(sessions, 'alpha');
    expect(result[1].favorite).toBe(true);
  });
});
