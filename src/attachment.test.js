const { addAttachment, removeAttachment, getAttachments, addAttachmentByName, filterByAttachment, hasAttachment } = require('./attachment');

function makeSession(overrides = {}) {
  return { id: '1', name: 'Test', tabs: [], ...overrides };
}

test('addAttachment adds an attachment to a session', () => {
  const s = makeSession();
  const result = addAttachment(s, { name: 'doc.pdf', url: 'http://example.com/doc.pdf' });
  expect(result.attachments).toHaveLength(1);
  expect(result.attachments[0].name).toBe('doc.pdf');
});

test('addAttachment throws on duplicate name', () => {
  const s = makeSession({ attachments: [{ name: 'doc.pdf', url: 'http://x.com' }] });
  expect(() => addAttachment(s, { name: 'doc.pdf', url: 'http://y.com' })).toThrow();
});

test('addAttachment throws on invalid attachment', () => {
  const s = makeSession();
  expect(() => addAttachment(s, { name: 'x' })).toThrow();
  expect(() => addAttachment(s, null)).toThrow();
});

test('removeAttachment removes by name', () => {
  const s = makeSession({ attachments: [{ name: 'a', url: 'u1' }, { name: 'b', url: 'u2' }] });
  const result = removeAttachment(s, 'a');
  expect(result.attachments).toHaveLength(1);
  expect(result.attachments[0].name).toBe('b');
});

test('removeAttachment throws if attachment not found', () => {
  const s = makeSession({ attachments: [{ name: 'a', url: 'u1' }] });
  expect(() => removeAttachment(s, 'nonexistent')).toThrow();
});

test('getAttachments returns empty array if none', () => {
  expect(getAttachments(makeSession())).toEqual([]);
});

test('addAttachmentByName updates correct session', () => {
  const sessions = [makeSession({ name: 'A' }), makeSession({ id: '2', name: 'B' })];
  const result = addAttachmentByName(sessions, 'A', { name: 'f.txt', url: 'http://f.txt' });
  expect(result[0].attachments).toHaveLength(1);
  expect(result[1].attachments).toBeUndefined();
});

test('filterByAttachment returns sessions with matching attachment', () => {
  const sessions = [
    makeSession({ name: 'A', attachments: [{ name: 'x', url: 'u' }] }),
    makeSession({ id: '2', name: 'B' })
  ];
  expect(filterByAttachment(sessions, 'x')).toHaveLength(1);
  expect(filterByAttachment(sessions, 'y')).toHaveLength(0);
});

test('hasAttachment returns true/false correctly', () => {
  const s = makeSession({ attachments: [{ name: 'z', url: 'u' }] });
  expect(hasAttachment(s, 'z')).toBe(true);
  expect(hasAttachment(s, 'w')).toBe(false);
});
