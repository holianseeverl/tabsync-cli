// theme.js — assign and manage visual themes for sessions

const VALID_THEMES = ['light', 'dark', 'solarized', 'monokai', 'nord', 'dracula'];

function isValidTheme(theme) {
  return VALID_THEMES.includes(theme);
}

function setTheme(session, theme) {
  if (!isValidTheme(theme)) throw new Error(`Invalid theme: ${theme}`);
  return { ...session, theme };
}

function clearTheme(session) {
  const s = { ...session };
  delete s.theme;
  return s;
}

function setThemeByName(sessions, name, theme) {
  return sessions.map(s => s.name === name ? setTheme(s, theme) : s);
}

function getTheme(session) {
  return session.theme || null;
}

function filterByTheme(sessions, theme) {
  return sessions.filter(s => s.theme === theme);
}

function listThemes() {
  return [...VALID_THEMES];
}

function sortByTheme(sessions) {
  return [...sessions].sort((a, b) => {
    const ta = a.theme || '';
    const tb = b.theme || '';
    return ta.localeCompare(tb);
  });
}

module.exports = {
  isValidTheme,
  setTheme,
  clearTheme,
  setThemeByName,
  getTheme,
  filterByTheme,
  listThemes,
  sortByTheme
};
