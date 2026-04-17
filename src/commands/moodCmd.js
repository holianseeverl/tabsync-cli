const { setMoodByName, clearMood, getMood, filterByMood, sortByMood, VALID_MOODS } = require('../mood');

function handleSetMood(sessions, name, mood) {
  try {
    const updated = setMoodByName(sessions, name, mood);
    const found = updated.find(s => s.name === name);
    if (!found) { console.log(`Session "${name}" not found.`); return sessions; }
    console.log(`Mood for "${name}" set to "${mood}".`);
    return updated;
  } catch (e) {
    console.error(e.message);
    return sessions;
  }
}

function handleClearMood(sessions, name) {
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) { console.log(`Session "${name}" not found.`); return sessions; }
  const updated = sessions.map(s => s.name === name ? clearMood(s) : s);
  console.log(`Mood cleared for "${name}".`);
  return updated;
}

function handleShowMood(sessions, name) {
  const session = sessions.find(s => s.name === name);
  if (!session) { console.log(`Session "${name}" not found.`); return; }
  const mood = getMood(session);
  console.log(mood ? `Mood: ${mood}` : `No mood set for "${name}".`);
}

function handleFilterByMood(sessions, mood) {
  const results = filterByMood(sessions, mood);
  if (!results.length) { console.log(`No sessions with mood "${mood}".`); return; }
  results.forEach(s => console.log(`- ${s.name} [${s.mood}]`));
}

function handleSortByMood(sessions) {
  const sorted = sortByMood(sessions);
  sorted.forEach(s => console.log(`- ${s.name} [${s.mood || 'none'}]`));
  return sorted;
}

function registerMoodCmd(program, sessions, save) {
  const mood = program.command('mood').description('Manage session moods');

  mood.command('set <name> <mood>').description(`Set mood (${VALID_MOODS.join(', ')})`)
    .action((name, m) => save(handleSetMood(sessions(), name, m)));

  mood.command('clear <name>').description('Clear mood from session')
    .action(name => save(handleClearMood(sessions(), name)));

  mood.command('show <name>').description('Show mood of session')
    .action(name => handleShowMood(sessions(), name));

  mood.command('filter <mood>').description('Filter sessions by mood')
    .action(m => handleFilterByMood(sessions(), m));

  mood.command('sort').description('Sort sessions by mood')
    .action(() => handleSortByMood(sessions()));
}

module.exports = { handleSetMood, handleClearMood, handleShowMood, handleFilterByMood, handleSortByMood, registerMoodCmd };
