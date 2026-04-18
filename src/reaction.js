// reaction.js — emoji reactions on sessions

const VALID_REACTIONS = ['👍', '❤️', '🔥', '⭐', '🎯', '💡', '🚀', '😅'];

function isValidReaction(reaction) {
  return VALID_REACTIONS.includes(reaction);
}

function addReaction(session, reaction) {
  if (!isValidReaction(reaction)) throw new Error(`Invalid reaction: ${reaction}`);
  const reactions = session.reactions ? [...session.reactions] : [];
  if (!reactions.includes(reaction)) reactions.push(reaction);
  return { ...session, reactions };
}

function removeReaction(session, reaction) {
  const reactions = (session.reactions || []).filter(r => r !== reaction);
  return { ...session, reactions };
}

function clearReactions(session) {
  return { ...session, reactions: [] };
}

function addReactionByName(sessions, name, reaction) {
  return sessions.map(s => s.name === name ? addReaction(s, reaction) : s);
}

function getReactions(session) {
  return session.reactions || [];
}

function filterByReaction(sessions, reaction) {
  return sessions.filter(s => (s.reactions || []).includes(reaction));
}

function sortByReactionCount(sessions) {
  return [...sessions].sort((a, b) => (b.reactions || []).length - (a.reactions || []).length);
}

module.exports = {
  VALID_REACTIONS,
  isValidReaction,
  addReaction,
  removeReaction,
  clearReactions,
  addReactionByName,
  getReactions,
  filterByReaction,
  sortByReactionCount
};
