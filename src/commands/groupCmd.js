// groupCmd.js — CLI command handler for session grouping

const { loadSessions } = require('../sessionStore');
const { group } = require('../group');

const VALID_STRATEGIES = ['tag', 'date', 'tabcount'];

function formatGroup(label, sessions) {
  const lines = [`\n[${label}] (${sessions.length} session${sessions.length !== 1 ? 's' : ''}):`];
  for (const s of sessions) {
    const tabCount = Array.isArray(s.tabs) ? s.tabs.length : 0;
    lines.push(`  - ${s.name} (${tabCount} tab${tabCount !== 1 ? 's' : ''})`);
  }
  return lines.join('\n');
}

function handleGroup(args, options = {}) {
  const by = args[0] || 'tag';

  if (!VALID_STRATEGIES.includes(by)) {
    console.error(`Unknown strategy "${by}". Valid options: ${VALID_STRATEGIES.join(', ')}`);
    return;
  }

  const sessions = loadSessions();

  if (sessions.length === 0) {
    console.log('No sessions found.');
    return;
  }

  const bucketSize = options.bucketSize ? parseInt(options.bucketSize, 10) : 5;

  if (isNaN(bucketSize) || bucketSize <= 0) {
    console.error('--bucket-size must be a positive integer.');
    return;
  }

  const grouped = group(sessions, by, { bucketSize });
  const keys = Object.keys(grouped).sort();

  if (keys.length === 0) {
    console.log('No groups found.');
    return;
  }

  console.log(`Grouped by: ${by}`);
  for (const key of keys) {
    console.log(formatGroup(key, grouped[key]));
  }
}

function registerGroupCmd(program) {
  program
    .command('group [by]')
    .description('Group sessions by tag, date, or tabcount')
    .option('--bucket-size <n>', 'Bucket size for tabcount grouping', '5')
    .action((by = 'tag', opts) => {
      handleGroup([by], { bucketSize: opts.bucketSize });
    });
}

module.exports = { handleGroup, formatGroup, registerGroupCmd };
