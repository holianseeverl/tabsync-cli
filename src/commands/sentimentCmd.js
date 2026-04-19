const { setSentiment, clearSentiment, getSentiment, filterBySentiment, sortBySentiment, isValidSentiment } = require('../sentiment');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetSentiment(name, sentiment) {
  if (!isValidSentiment(sentiment)) {
    console.error(`Invalid sentiment "${sentiment}". Use: positive, neutral, negative, mixed`);
    return;
  }
  const sessions = loadSessions();
  const updated = sessions.map(s => s.name === name ? { ...s, sentiment } : s);
  saveSessions(updated);
  console.log(`Sentiment for "${name}" set to ${sentiment}.`);
}

function handleClearSentiment(name) {
  const sessions = loadSessions();
  const updated = sessions.map(s => s.name === name ? { ...s, sentiment: undefined } : s);
  saveSessions(updated);
  console.log(`Sentiment cleared for "${name}".`);
}

function handleShowSentiment(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session "${name}" not found.`); return; }
  const val = getSentiment(session);
  console.log(val ? `${name}: ${val}` : `${name} has no sentiment set.`);
}

function handleFilterBySentiment(sentiment) {
  const sessions = loadSessions();
  const results = filterBySentiment(sessions, sentiment);
  if (!results.length) { console.log('No sessions found.'); return; }
  results.forEach(s => console.log(`${s.name} [${s.sentiment}]`));
}

function handleSortBySentiment() {
  const sessions = loadSessions();
  const sorted = sortBySentiment(sessions);
  sorted.forEach(s => console.log(`${s.name} [${s.sentiment || 'none'}]`));
}

function registerSentimentCmd(program) {
  const cmd = program.command('sentiment').description('Manage session sentiment');
  cmd.command('set <name> <sentiment>').description('Set sentiment').action(handleSetSentiment);
  cmd.command('clear <name>').description('Clear sentiment').action(handleClearSentiment);
  cmd.command('show <name>').description('Show sentiment').action(handleShowSentiment);
  cmd.command('filter <sentiment>').description('Filter by sentiment').action(handleFilterBySentiment);
  cmd.command('sort').description('Sort by sentiment').action(handleSortBySentiment);
}

module.exports = { handleSetSentiment, handleClearSentiment, handleShowSentiment, handleFilterBySentiment, handleSortBySentiment, registerSentimentCmd };
