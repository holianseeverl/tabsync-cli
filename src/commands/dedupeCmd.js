const { loadSessions, saveSessions } = require('../sessionStore');
const { dedupe, dedupeSessionsByName } = require('../dedupe');

/**
 * Handle the dedupe command
 * @param {Object} options - CLI options
 * @param {string} options.file - path to sessions file
 * @param {boolean} options.byName - dedupe by name (keep most recent) instead of exact match
 * @param {boolean} options.dryRun - preview changes without saving
 */
async function handleDedupe(options = {}) {
  const { file, byName = false, dryRun = false } = options;

  let sessions;
  try {
    sessions = await loadSessions(file);
  } catch (err) {
    console.error(`Failed to load sessions: ${err.message}`);
    process.exit(1);
  }

  const originalCount = sessions.length;
  const result = byName ? dedupeSessionsByName(sessions) : dedupe(sessions);
  const removedCount = originalCount - result.length;

  if (dryRun) {
    console.log(`[dry-run] Would remove ${removedCount} duplicate session(s). ${result.length} session(s) remaining.`);
    if (removedCount > 0) {
      const kept = new Set(result.map((s) => s.id));
      const removed = sessions.filter((s) => !kept.has(s.id));
      console.log('Sessions that would be removed:');
      removed.forEach((s) => console.log(`  - ${s.name} (${s.id})`));
    }
    return;
  }

  if (removedCount === 0) {
    console.log('No duplicates found.');
    return;
  }

  try {
    await saveSessions(result, file);
    console.log(`Removed ${removedCount} duplicate session(s). ${result.length} session(s) remaining.`);
  } catch (err) {
    console.error(`Failed to save sessions: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { handleDedupe };
