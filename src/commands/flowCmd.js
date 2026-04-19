const { setFlowByName, clearFlow, getFlow, filterByFlow, sortByFlow, VALID_FLOWS } = require('../flow');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetFlow(name, flow) {
  let sessions = loadSessions();
  sessions = setFlowByName(sessions, name, flow);
  saveSessions(sessions);
  console.log(`Flow for "${name}" set to "${flow}".`);
}

function handleClearFlow(name) {
  let sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) return console.error(`Session not found: ${name}`);
  sessions = clearFlow(sessions, session.id);
  saveSessions(sessions);
  console.log(`Flow cleared for "${name}".`);
}

function handleShowFlow(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) return console.error(`Session not found: ${name}`);
  const flow = getFlow(session);
  console.log(flow ? `Flow: ${flow}` : 'No flow set.');
}

function handleFilterByFlow(flow) {
  const sessions = loadSessions();
  const results = filterByFlow(sessions, flow);
  if (!results.length) return console.log('No sessions found.');
  results.forEach(s => console.log(`- ${s.name} [${s.flow}]`));
}

function handleSortByFlow() {
  const sessions = loadSessions();
  const sorted = sortByFlow(sessions);
  sorted.forEach(s => console.log(`- ${s.name} [${s.flow || 'none'}]`));
}

function registerFlowCmd(program) {
  const cmd = program.command('flow').description('Manage session flow states');

  cmd.command('set <name> <flow>')
    .description(`Set flow state (${VALID_FLOWS.join(', ')})`)
    .action(handleSetFlow);

  cmd.command('clear <name>')
    .description('Clear flow state')
    .action(handleClearFlow);

  cmd.command('show <name>')
    .description('Show flow state')
    .action(handleShowFlow);

  cmd.command('filter <flow>')
    .description('Filter sessions by flow')
    .action(handleFilterByFlow);

  cmd.command('sort')
    .description('Sort sessions by flow priority')
    .action(handleSortByFlow);
}

module.exports = { handleSetFlow, handleClearFlow, handleShowFlow, handleFilterByFlow, handleSortByFlow, registerFlowCmd };
