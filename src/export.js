const fs = require('fs');
const path = require('path');
const { loadSessions } = require('./sessionStore');

/**
 * Exports sessions to a JSON file at the given output path.
 * @param {string} outputPath - Destination file path for the export.
 * @param {object} options - Optional filters: { name, tags }
 * @returns {string} The resolved output path.
 */
function exportSessions(outputPath, options = {}) {
  let sessions = loadSessions();

  if (options.name) {
    sessions = sessions.filter(s =>
      s.name.toLowerCase().includes(options.name.toLowerCase())
    );
  }

  if (options.tags && options.tags.length > 0) {
    sessions = sessions.filter(s =>
      s.tags && options.tags.some(tag => s.tags.includes(tag))
    );
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    sessions,
  };

  const resolved = path.resolve(outputPath);
  fs.writeFileSync(resolved, JSON.stringify(exportData, null, 2), 'utf-8');
  return resolved;
}

/**
 * Imports sessions from a JSON export file.
 * Returns the parsed sessions array without persisting — caller decides what to do.
 * @param {string} inputPath - Path to the exported JSON file.
 * @returns {{ sessions: Array, exportedAt: string, version: string }}
 */
function importSessions(inputPath) {
  const resolved = path.resolve(inputPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Import file not found: ${resolved}`);
  }

  const raw = fs.readFileSync(resolved, 'utf-8');
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in import file: ${err.message}`);
  }

  if (!Array.isArray(parsed.sessions)) {
    throw new Error('Import file is missing a valid "sessions" array.');
  }

  return parsed;
}

module.exports = { exportSessions, importSessions };
