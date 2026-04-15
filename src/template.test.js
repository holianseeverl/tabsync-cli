const { createTemplate, applyTemplate, findTemplateByName, removeTemplate, listTemplates } = require('./template');

const mockSession = {
  id: 'abc-123',
  name: 'Work Session',
  tabs: [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://notion.so', title: 'Notion' }
  ],
  tags: ['work'],
  createdAt: '2024-01-01T00:00:00.000Z'
};

describe('createTemplate', () => {
  it('creates a template from a session', () => {
    const t = createTemplate('my-template', mockSession);
    expect(t.name).toBe('my-template');
    expect(t.tabs).toHaveLength(2);
    expect(t.tabs[0]).toEqual({ url: 'https://github.com', title: 'GitHub' });
    expect(t.tags).toEqual(['work']);
    expect(t).not.toHaveProperty('id');
  });

  it('throws if name is missing', () => {
    expect(() => createTemplate('', mockSession)).toThrow('Template name is required');
  });

  it('throws if session is invalid', () => {
    expect(() => createTemplate('t', { name: 'bad' })).toThrow('Invalid session');
  });

  it('throws if session has no tabs', () => {
    expect(() => createTemplate('t', { ...mockSession, tabs: [] })).toThrow('Invalid session');
  });
});

describe('applyTemplate', () => {
  it('produces a new session from a template', () => {
    const t = createTemplate('base', mockSession);
    const s = applyTemplate(t);
    expect(s.name).toBe('base');
    expect(s.tabs).toHaveLength(2);
    expect(s).toHaveProperty('id');
    expect(s).toHaveProperty('createdAt');
  });

  it('allows overriding the session name', () => {
    const t = createTemplate('base', mockSession);
    const s = applyTemplate(t, 'Custom Name');
    expect(s.name).toBe('Custom Name');
  });

  it('throws on invalid template', () => {
    expect(() => applyTemplate(null)).toThrow('Invalid template');
  });

  it('throws on template with missing tabs', () => {
    expect(() => applyTemplate({ name: 'broken' })).toThrow('Invalid template');
  });
});

describe('findTemplateByName', () => {
  const templates = [createTemplate('alpha', mockSession), createTemplate('beta', mockSession)];

  it('finds a template by name', () => {
    expect(findTemplateByName(templates, 'alpha').name).toBe('alpha');
  });

  it('returns null if not found', () => {
    expect(findTemplateByName(templates, 'gamma')).toBeNull();
  });
});

describe('removeTemplate', () => {
  it('removes a template by name', () => {
    const templates = [createTemplate('alpha', mockSession), createTemplate('beta', mockSession)];
    const result = removeTemplate(templates, 'alpha');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('beta');
  });

  it('returns unchanged list if name not found', () => {
    const templates = [createTemplate('alpha', mockSession)];
    const result = removeTemplate(templates, 'nonexistent');
    expect(result).toHaveLength(1);
  });
});

describe('listTemplates', () => {
  it('returns summary info for each template', () => {
    const templates = [createTemplate('alpha', mockSession)];
    const list = listTemplates(templates);
    expect(list[0]).toEqual(expect.objectContaining({ name: 'alpha', tabCount: 2 }));
  });

  it('returns an empty array for no templates', () => {
    expect(listTemplates([])).toEqual([]);
  });
});
