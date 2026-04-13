const { loadSessions, saveSessions } = require('../sessionStore');
const { addTag, removeTag, filterByTag, getAllTags } = require('../tags');

/**
 * Handle the `tag add <sessionId> <tag>` command
 */
async function handleTagAdd(sessionId, tag, options = {}) {
  const sessions = await loadSessions(options.file);
  const index = sessions.findIndex(s => s.id === sessionId);

  if (index === -1) {
    console.error(`Session not found: ${sessionId}`);
    process.exit(1);
  }

  sessions[index] = addTag(sessions[index], tag);
  await saveSessions(sessions, options.file);

  console.log(`Tag "${tag.trim().toLowerCase()}" added to session "${sessions[index].name}".`);
}

/**
 * Handle the `tag remove <sessionId> <tag>` command
 */
async function handleTagRemove(sessionId, tag, options = {}) {
  const sessions = await loadSessions(options.file);
  const index = sessions.findIndex(s => s.id === sessionId);

  if (index === -1) {
    console.error(`Session not found: ${sessionId}`);
    process.exit(1);
  }

  sessions[index] = removeTag(sessions[index], tag);
  await saveSessions(sessions, options.file);

  console.log(`Tag "${tag.trim().toLowerCase()}" removed from session "${sessions[index].name}".`);
}

/**
 * Handle the `tag list` command — list all unique tags
 */
async function handleTagList(options = {}) {
  const sessions = await loadSessions(options.file);
  const tags = getAllTags(sessions);

  if (tags.length === 0) {
    console.log('No tags found.');
    return;
  }

  console.log('Available tags:');
  tags.forEach(t => console.log(`  - ${t}`));
}

/**
 * Handle the `tag filter <tag>` command — list sessions with a given tag
 */
async function handleTagFilter(tag, options = {}) {
  const sessions = await loadSessions(options.file);
  const matched = filterByTag(sessions, tag);

  if (matched.length === 0) {
    console.log(`No sessions found with tag "${tag}".`);
    return;
  }

  console.log(`Sessions tagged "${tag}":`);
  matched.forEach(s => {
    const tabCount = Array.isArray(s.tabs) ? s.tabs.length : 0;
    console.log(`  [${s.id}] ${s.name} (${tabCount} tab${tabCount !== 1 ? 's' : ''})`);
  });
}

module.exports = { handleTagAdd, handleTagRemove, handleTagList, handleTagFilter };
