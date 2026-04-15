// favoriteCmd.js — CLI handlers for favorite feature

const { loadSessions, saveSessions } = require('../sessionStore');
const {
  favoriteSession,
  unfavoriteSession,
  listFavorites,
  toggleFavoriteByName,
} = require('../favorite');

function handleFavorite(name) {
  const sessions = loadSessions();
  const target = sessions.find((s) => s.name === name);
  if (!target) {
    console.error(`Session "${name}" not found.`);
    process.exit(1);
  }
  const updated = sessions.map((s) =>
    s.name === name ? favoriteSession(s) : s
  );
  saveSessions(updated);
  console.log(`Session "${name}" marked as favorite.`);
}

function handleUnfavorite(name) {
  const sessions = loadSessions();
  const target = sessions.find((s) => s.name === name);
  if (!target) {
    console.error(`Session "${name}" not found.`);
    process.exit(1);
  }
  const updated = sessions.map((s) =>
    s.name === name ? unfavoriteSession(s) : s
  );
  saveSessions(updated);
  console.log(`Session "${name}" removed from favorites.`);
}

function handleToggleFavorite(name) {
  const sessions = loadSessions();
  const updated = toggleFavoriteByName(sessions, name);
  saveSessions(updated);
  const isFav = updated.find((s) => s.name === name)?.favorite === true;
  console.log(`Session "${name}" is now ${isFav ? 'a favorite' : 'not a favorite'}.`);
}

function handleListFavorites() {
  const sessions = loadSessions();
  const favs = listFavorites(sessions);
  if (favs.length === 0) {
    console.log('No favorite sessions found.');
    return;
  }
  favs.forEach((s) => console.log(`- ${s.name} (${s.tabs.length} tabs)`));
}

module.exports = {
  handleFavorite,
  handleUnfavorite,
  handleToggleFavorite,
  handleListFavorites,
};
