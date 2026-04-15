// labelCmd.js — CLI command handlers for session labeling

const { loadSessions, saveSessions } = require('../sessionStore');
const { addLabelByName, removeLabelByName, filterByLabel, getAllLabels, getLabels } = require('../label');

function handleAddLabel(name, label, options = {}) {
  const sessions = loadSessions(options.file);
  const updated = addLabelByName(sessions, name, label);
  saveSessions(updated, options.file);
  console.log(`Label "${label}" added to session "${name}".`);
}

function handleRemoveLabel(name, label, options = {}) {
  const sessions = loadSessions(options.file);
  const updated = removeLabelByName(sessions, name, label);
  saveSessions(updated, options.file);
  console.log(`Label "${label}" removed from session "${name}".`);
}

function handleFilterByLabel(label, options = {}) {
  const sessions = loadSessions(options.file);
  const results = filterByLabel(sessions, label);
  if (results.length === 0) {
    console.log(`No sessions found with label "${label}".`);
    return;
  }
  results.forEach(s => {
    const labels = getLabels(s).join(', ');
    console.log(`  ${s.name} [${labels}]`);
  });
}

function handleListLabels(options = {}) {
  const sessions = loadSessions(options.file);
  const labels = getAllLabels(sessions);
  if (labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log('All labels:');
  labels.forEach(l => console.log(`  - ${l}`));
}

function handleShowLabels(name, options = {}) {
  const sessions = loadSessions(options.file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  const labels = getLabels(session);
  if (labels.length === 0) {
    console.log(`Session "${name}" has no labels.`);
    return;
  }
  console.log(`Labels for "${name}": ${labels.join(', ')}`);
}

function registerLabelCmd(program) {
  const label = program.command('label').description('Manage session labels');

  label.command('add <session> <label>')
    .description('Add a label to a session')
    .option('-f, --file <path>', 'sessions file')
    .action((session, lbl, opts) => handleAddLabel(session, lbl, opts));

  label.command('remove <session> <label>')
    .description('Remove a label from a session')
    .option('-f, --file <path>', 'sessions file')
    .action((session, lbl, opts) => handleRemoveLabel(session, lbl, opts));

  label.command('filter <label>')
    .description('List sessions with a given label')
    .option('-f, --file <path>', 'sessions file')
    .action((lbl, opts) => handleFilterByLabel(lbl, opts));

  label.command('list')
    .description('List all labels in use')
    .option('-f, --file <path>', 'sessions file')
    .action(opts => handleListLabels(opts));

  label.command('show <session>')
    .description('Show labels for a session')
    .option('-f, --file <path>', 'sessions file')
    .action((session, opts) => handleShowLabels(session, opts));
}

module.exports = { handleAddLabel, handleRemoveLabel, handleFilterByLabel, handleListLabels, handleShowLabels, registerLabelCmd };
