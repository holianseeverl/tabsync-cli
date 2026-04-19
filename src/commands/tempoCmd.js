const { isValidTempo, setTempoByName, clearTempo, getTempo, filterByTempo, sortByTempo, VALID_TEMPOS } = require('../tempo');

function handleSetTempo(sessions, name, tempo) {
  if (!isValidTempo(tempo)) {
    console.error(`Invalid tempo "${tempo}". Valid: ${VALID_TEMPOS.join(', ')}`);
    return sessions;
  }
  const updated = setTempoByName(sessions, name, tempo);
  const found = updated.find(s => s.name === name);
  if (!found) { console.error(`Session "${name}" not found.`); return sessions; }
  console.log(`Tempo for "${name}" set to "${tempo}".`);
  return updated;
}

function handleClearTempo(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.error(`Session "${name}" not found.`); return sessions; }
  const updated = sessions.map(s => s.name === name ? clearTempo(s) : s);
  console.log(`Tempo cleared for "${name}".`);
  return updated;
}

function handleShowTempo(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) { console.error(`Session "${name}" not found.`); return; }
  const t = getTempo(session);
  console.log(t ? `${name}: ${t}` : `${name}: (no tempo set)`);
}

function handleFilterByTempo(sessions, tempo) {
  if (!isValidTempo(tempo)) {
    console.error(`Invalid tempo "${tempo}".`);
    return;
  }
  const results = filterByTempo(sessions, tempo);
  if (!results.length) { console.log('No sessions found.'); return; }
  results.forEach(s => console.log(`${s.name} [${s.tempo}]`));
}

function handleSortByTempo(sessions) {
  const sorted = sortByTempo(sessions);
  sorted.forEach(s => console.log(`${s.name}: ${s.tempo || '(none)'}`))
  return sorted;
}

function registerTempoCmd(program, sessions, save) {
  const cmd = program.command('tempo').description('Manage session tempo');

  cmd.command('set <name> <tempo>').description(`Set tempo (${VALID_TEMPOS.join('|')})`)
    .action((name, tempo) => save(handleSetTempo(sessions(), name, tempo)));

  cmd.command('clear <name>').description('Clear tempo')
    .action(name => save(handleClearTempo(sessions(), name)));

  cmd.command('show <name>').description('Show tempo')
    .action(name => handleShowTempo(sessions(), name));

  cmd.command('filter <tempo>').description('Filter by tempo')
    .action(tempo => handleFilterByTempo(sessions(), tempo));

  cmd.command('sort').description('Sort by tempo')
    .action(() => handleSortByTempo(sessions()));
}

module.exports = { handleSetTempo, handleClearTempo, handleShowTempo, handleFilterByTempo, handleSortByTempo, registerTempoCmd };
