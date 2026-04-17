const { isValidIntent, setIntent, clearIntent, setIntentByName, getIntent, filterByIntent, sortByIntent } = require('../intent');
const { loadSessions, saveSessions } = require('../sessionStore');

const VALID_INTENTS = ['research', 'work', 'personal', 'reference', 'shopping', 'entertainment'];

function handleSetIntent(name, intent, store) {
  const sessions = loadSessions(store);
  if (!isValidIntent(intent)) {
    console.error(`Invalid intent "${intent}". Valid: ${VALID_INTENTS.join(', ')}`);
    return;
  }
  const updated = setIntentByName(sessions, name, intent);
  if (updated === sessions) {
    console.error(`Session "${name}" not found.`);
    return;
  }
  saveSessions(store, updated);
  console.log(`Intent for "${name}" set to "${intent}".`);
}

function handleClearIntent(name, store) {
  const sessions = loadSessions(store);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.error(`Session "${name}" not found.`);
    return;
  }
  const updated = [...sessions];
  updated[idx] = clearIntent(updated[idx]);
  saveSessions(store, updated);
  console.log(`Intent cleared for "${name}".`);
}

function handleShowIntent(name, store) {
  const sessions = loadSessions(store);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.error(`Session "${name}" not found.`);
    return;
  }
  const intent = getIntent(session);
  console.log(intent ? `Intent: ${intent}` : `No intent set for "${name}".`);
}

function handleFilterByIntent(intent, store) {
  const sessions = loadSessions(store);
  const results = filterByIntent(sessions, intent);
  if (!results.length) {
    console.log(`No sessions with intent "${intent}".`);
    return;
  }
  results.forEach(s => console.log(`- ${s.name} [${s.intent}]`));
}

function handleSortByIntent(store) {
  const sessions = loadSessions(store);
  const sorted = sortByIntent(sessions);
  sorted.forEach(s => console.log(`- ${s.name}: ${s.intent || '(none)'}`))
}

function registerIntentCmd(program, store) {
  const cmd = program.command('intent').description('Manage session intents');

  cmd.command('set <name> <intent>')
    .description(`Set intent (${VALID_INTENTS.join(', ')})`)
    .action((name, intent) => handleSetIntent(name, intent, store));

  cmd.command('clear <name>')
    .description('Clear intent from session')
    .action(name => handleClearIntent(name, store));

  cmd.command('show <name>')
    .description('Show intent of session')
    .action(name => handleShowIntent(name, store));

  cmd.command('filter <intent>')
    .description('Filter sessions by intent')
    .action(intent => handleFilterByIntent(intent, store));

  cmd.command('sort')
    .description('Sort sessions by intent')
    .action(() => handleSortByIntent(store));
}

module.exports = { handleSetIntent, handleClearIntent, handleShowIntent, handleFilterByIntent, handleSortByIntent, registerIntentCmd };
