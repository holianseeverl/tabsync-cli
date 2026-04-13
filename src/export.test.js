const fs = require('fs');
const path = require('path');
const { exportSessions, importSessions } = require('./export');
const { saveSessions } = require('./sessionStore');
const { createSession } = require('./session');

const TMP_FILE = path.join(__dirname, '__tmp_export_test__.json');

// Stub the data store path used by sessionStore
const STORE_PATH = path.join(__dirname, '..', 'data', 'sessions.json');

beforeEach(() => {
  const sessions = [
    createSession('Work', ['https://github.com', 'https://jira.example.com'], ['work']),
    createSession('Research', ['https://arxiv.org', 'https://scholar.google.com'], ['study', 'research']),
    createSession('Entertainment', ['https://youtube.com'], ['fun']),
  ];
  saveSessions(sessions);
});

afterEach(() => {
  if (fs.existsSync(TMP_FILE)) fs.unlinkSync(TMP_FILE);
});

describe('exportSessions', () => {
  test('writes a JSON file with all sessions when no filter applied', () => {
    exportSessions(TMP_FILE);
    const content = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
    expect(content.sessions).toHaveLength(3);
    expect(content.version).toBe('1.0');
    expect(content.exportedAt).toBeDefined();
  });

  test('filters sessions by name', () => {
    exportSessions(TMP_FILE, { name: 'work' });
    const content = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
    expect(content.sessions).toHaveLength(1);
    expect(content.sessions[0].name).toBe('Work');
  });

  test('filters sessions by tags', () => {
    exportSessions(TMP_FILE, { tags: ['study'] });
    const content = JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
    expect(content.sessions).toHaveLength(1);
    expect(content.sessions[0].name).toBe('Research');
  });

  test('returns the resolved output path', () => {
    const result = exportSessions(TMP_FILE);
    expect(result).toBe(path.resolve(TMP_FILE));
  });
});

describe('importSessions', () => {
  test('reads and parses a valid export file', () => {
    exportSessions(TMP_FILE);
    const result = importSessions(TMP_FILE);
    expect(Array.isArray(result.sessions)).toBe(true);
    expect(result.sessions).toHaveLength(3);
  });

  test('throws if file does not exist', () => {
    expect(() => importSessions('/nonexistent/path.json')).toThrow('Import file not found');
  });

  test('throws if file contains invalid JSON', () => {
    fs.writeFileSync(TMP_FILE, 'not json', 'utf-8');
    expect(() => importSessions(TMP_FILE)).toThrow('Invalid JSON');
  });

  test('throws if sessions array is missing', () => {
    fs.writeFileSync(TMP_FILE, JSON.stringify({ version: '1.0' }), 'utf-8');
    expect(() => importSessions(TMP_FILE)).toThrow('missing a valid "sessions" array');
  });
});
