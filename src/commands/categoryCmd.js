const { setCategory, clearCategory, setCategoryByName, getCategory, filterByCategory, sortByCategory } = require('../category');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleSetCategory(name, category) {
  const sessions = loadSessions();
  const updated = setCategoryByName(sessions, name, category);
  if (updated === sessions) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  saveSessions(updated);
  console.log(`Category "${category}" set on session "${name}".`);
}

function handleClearCategory(name) {
  const sessions = loadSessions();
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  sessions[idx] = clearCategory(sessions[idx]);
  saveSessions(sessions);
  console.log(`Category cleared from session "${name}".`);
}

function handleShowCategory(name) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  const cat = getCategory(session);
  console.log(cat ? `Category: ${cat}` : `No category set.`);
}

function handleFilterByCategory(category) {
  const sessions = loadSessions();
  const results = filterByCategory(sessions, category);
  if (!results.length) {
    console.log(`No sessions with category "${category}".`);
    return;
  }
  results.forEach(s => console.log(`- ${s.name} [${s.category}]`));
}

function handleSortByCategory() {
  const sessions = loadSessions();
  const sorted = sortByCategory(sessions);
  sorted.forEach(s => console.log(`- ${s.name}: ${s.category || '(none)'}}`));
}

function registerCategoryCmd(program) {
  const cmd = program.command('category').description('Manage session categories');

  cmd.command('set <name> <category>').description('Set category on a session').action(handleSetCategory);
  cmd.command('clear <name>').description('Clear category from a session').action(handleClearCategory);
  cmd.command('show <name>').description('Show category of a session').action(handleShowCategory);
  cmd.command('filter <category>').description('Filter sessions by category').action(handleFilterByCategory);
  cmd.command('sort').description('List sessions sorted by category').action(handleSortByCategory);
}

module.exports = { handleSetCategory, handleClearCategory, handleShowCategory, handleFilterByCategory, handleSortByCategory, registerCategoryCmd };
