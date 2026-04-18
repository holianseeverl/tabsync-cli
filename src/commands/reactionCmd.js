const {
  isValidReaction,
  VALID_REACTIONS,
  addReactionByName,
  removeReaction,
  clearReactions,
  getReactions,
  filterByReaction,
  sortByReactionCount
} = require('../reaction');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleAddReaction(name, reaction, options = {}) {
  const sessions = loadSessions(options.file);
  const target = sessions.find(s => s.name === name);
  if (!target) return console.error(`Session not found: ${name}`);
  if (!isValidReaction(reaction)) {
    return console.error(`Invalid reaction. Valid: ${VALID_REACTIONS.join(' ')}`);
  }
  const updated = addReactionByName(sessions, name, reaction);
  saveSessions(updated, options.file);
  console.log(`Added ${reaction} to "${name}"`);
}

function handleRemoveReaction(name, reaction, options = {}) {
  const sessions = loadSessions(options.file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) return console.error(`Session not found: ${name}`);
  const updated = [...sessions];
  updated[idx] = removeReaction(sessions[idx], reaction);
  saveSessions(updated, options.file);
  console.log(`Removed ${reaction} from "${name}"`);
}

function handleClearReactions(name, options = {}) {
  const sessions = loadSessions(options.file);
  const idx = sessions.findIndex(s => s.name === name);
  if (idx === -1) return console.error(`Session not found: ${name}`);
  const updated = [...sessions];
  updated[idx] = clearReactions(sessions[idx]);
  saveSessions(updated, options.file);
  console.log(`Cleared reactions from "${name}"`);
}

function handleShowReactions(name, options = {}) {
  const sessions = loadSessions(options.file);
  const target = sessions.find(s => s.name === name);
  if (!target) return console.error(`Session not found: ${name}`);
  const reactions = getReactions(target);
  if (!reactions.length) return console.log(`No reactions on "${name}"`);
  console.log(`${name}: ${reactions.join(' ')}`);
}

function handleFilterByReaction(reaction, options = {}) {
  const sessions = loadSessions(options.file);
  const results = filterByReaction(sessions, reaction);
  if (!results.length) return console.log(`No sessions with reaction ${reaction}`);
  results.forEach(s => console.log(`${s.name}: ${getReactions(s).join(' ')}}`));
}

function handleSortByReactionCount(options = {}) {
  const sessions = loadSessions(options.file);
  const sorted = sortByReactionCount(sessions);
  sorted.forEach(s => console.log(`${s.name} (${getReactions(s).length}) ${getReactions(s).join(' ')}}`));
}

function registerReactionCmd(program) {
  const cmd = program.command('reaction').description('Manage session reactions');
  cmd.command('add <name> <reaction>').action((name, reaction, opts) => handleAddReaction(name, reaction, opts));
  cmd.command('remove <name> <reaction>').action((name, reaction, opts) => handleRemoveReaction(name, reaction, opts));
  cmd.command('clear <name>').action((name, opts) => handleClearReactions(name, opts));
  cmd.command('show <name>').action((name, opts) => handleShowReactions(name, opts));
  cmd.command('filter <reaction>').action((reaction, opts) => handleFilterByReaction(reaction, opts));
  cmd.command('sort').action(opts => handleSortByReactionCount(opts));
}

module.exports = { handleAddReaction, handleRemoveReaction, handleClearReactions, handleShowReactions, handleFilterByReaction, handleSortByReactionCount, registerReactionCmd };
