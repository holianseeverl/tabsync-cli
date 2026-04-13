const path = require('path');
const { exportSessions, importSessions } = require('../export');
const { addSession } = require('../sessionStore');
const { isValidSession } = require('../session');

/**
 * CLI handler for: tabsync export <outputFile> [--name <name>] [--tags <tag1,tag2>]
 */
function handleExport(args) {
  const outputFile = args._[1] || 'tabsync-export.json';
  const options = {};

  if (args.name) options.name = args.name;
  if (args.tags) options.tags = args.tags.split(',').map(t => t.trim());

  try {
    const outPath = exportSessions(outputFile, options);
    console.log(`✓ Sessions exported to: ${outPath}`);
  } catch (err) {
    console.error(`✗ Export failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * CLI handler for: tabsync import <inputFile> [--merge]
 * Without --merge, existing sessions are replaced.
 * With --merge, imported sessions are added alongside existing ones.
 */
function handleImport(args) {
  const inputFile = args._[1];

  if (!inputFile) {
    console.error('✗ Please provide an import file path.');
    process.exit(1);
  }

  try {
    const { sessions } = importSessions(inputFile);
    const valid = sessions.filter(isValidSession);
    const skipped = sessions.length - valid.length;

    if (args.merge) {
      valid.forEach(s => addSession(s));
      console.log(`✓ Merged ${valid.length} session(s) into existing store.`);
    } else {
      const { saveSessions } = require('../sessionStore');
      saveSessions(valid);
      console.log(`✓ Imported ${valid.length} session(s) (store replaced).`);
    }

    if (skipped > 0) {
      console.warn(`  ⚠ Skipped ${skipped} invalid session(s).`);
    }
  } catch (err) {
    console.error(`✗ Import failed: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { handleExport, handleImport };
