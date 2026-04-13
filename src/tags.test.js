const { addTag, removeTag, filterByTag, getAllTags } = require('./tags');

describe('addTag', () => {
  it('adds a tag to a session with no tags', () => {
    const session = { id: '1', name: 'Work', tabs: [] };
    const result = addTag(session, 'work');
    expect(result.tags).toEqual(['work']);
  });

  it('normalizes tag to lowercase', () => {
    const session = { id: '1', name: 'Work', tabs: [], tags: [] };
    const result = addTag(session, 'WORK');
    expect(result.tags).toContain('work');
  });

  it('does not add duplicate tags', () => {
    const session = { id: '1', name: 'Work', tabs: [], tags: ['work'] };
    const result = addTag(session, 'work');
    expect(result.tags).toHaveLength(1);
  });

  it('does not mutate the original session', () => {
    const session = { id: '1', name: 'Work', tabs: [], tags: [] };
    addTag(session, 'work');
    expect(session.tags).toHaveLength(0);
  });

  it('throws on invalid session', () => {
    expect(() => addTag(null, 'work')).toThrow('Invalid session object');
  });

  it('throws on empty tag string', () => {
    const session = { id: '1', name: 'Work', tabs: [] };
    expect(() => addTag(session, '  ')).toThrow('Tag must be a non-empty string');
  });
});

describe('removeTag', () => {
  it('removes an existing tag', () => {
    const session = { id: '1', name: 'Work', tabs: [], tags: ['work', 'dev'] };
    const result = removeTag(session, 'work');
    expect(result.tags).toEqual(['dev']);
  });

  it('returns session unchanged if tag not present', () => {
    const session = { id: '1', name: 'Work', tabs: [], tags: ['dev'] };
    const result = removeTag(session, 'work');
    expect(result.tags).toEqual(['dev']);
  });
});

describe('filterByTag', () => {
  const sessions = [
    { id: '1', name: 'Work', tabs: [], tags: ['work', 'dev'] },
    { id: '2', name: 'Personal', tabs: [], tags: ['personal'] },
    { id: '3', name: 'Research', tabs: [], tags: ['dev', 'research'] },
  ];

  it('returns sessions matching the tag', () => {
    const result = filterByTag(sessions, 'dev');
    expect(result).toHaveLength(2);
    expect(result.map(s => s.id)).toEqual(['1', '3']);
  });

  it('returns empty array if no sessions match', () => {
    const result = filterByTag(sessions, 'unknown');
    expect(result).toHaveLength(0);
  });

  it('throws if sessions is not an array', () => {
    expect(() => filterByTag(null, 'dev')).toThrow('Sessions must be an array');
  });
});

describe('getAllTags', () => {
  it('returns all unique tags sorted', () => {
    const sessions = [
      { id: '1', tags: ['work', 'dev'] },
      { id: '2', tags: ['personal', 'dev'] },
    ];
    const result = getAllTags(sessions);
    expect(result).toEqual(['dev', 'personal', 'work']);
  });

  it('handles sessions without tags', () => {
    const sessions = [{ id: '1', tags: ['work'] }, { id: '2' }];
    const result = getAllTags(sessions);
    expect(result).toEqual(['work']);
  });
});
