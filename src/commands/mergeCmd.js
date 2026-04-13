// mergeCmd.js - CLI command handler for merging sessions
const { loadSessions, saveSessions } = require('../sessionStore');
const { mergeSessions, mergeMany } = require('../merge');

/**
 * Handle the merge command.
 * Merges two or more sessions by name or index.
 */
async function handleMerge(sessionNames, options = {}) {
  const { name, dedupe = false, store = 'sessions.json' } = options;

  const sessions = await loadSessions(store);

  if (sessionNames.length < 2) {
    console.error('Error: At least two session names are required.');
    process.exit(1);
  }

  const targets = sessionNames.map((n) => {
    const found = sessions.find((s) => s.name === n);
    if (!found) {
      console.error(`Error: Session "${n}" not found.`);
      process.exit(1);
    }
    return found;
  });

  const mergeOptions = { dedupe };
  if (name) mergeOptions.name = name;

  let merged;
  if (targets.length === 2) {
    merged = mergeSessions(targets[0], targets[1], mergeOptions);
  } else {
    merged = mergeMany(targets, mergeOptions);
  }

  sessions.push(merged);
  await saveSessions(sessions, store);

  console.log(`Merged ${targets.length} sessions into "${merged.name}" (${merged.tabs.length} tabs).`);
  return merged;
}

module.exports = { handleMerge };
