// cooldown.js — track per-session cooldown periods

const VALID_UNITS = ['minutes', 'hours', 'days'];

function isValidCooldown(value, unit) {
  return typeof value === 'number' && value > 0 && VALID_UNITS.includes(unit);
}

function setCooldown(session, value, unit) {
  if (!isValidCooldown(value, unit)) throw new Error(`Invalid cooldown: ${value} ${unit}`);
  return { ...session, cooldown: { value, unit, setAt: new Date().toISOString() } };
}

function clearCooldown(session) {
  const s = { ...session };
  delete s.cooldown;
  return s;
}

function setCooldownByName(sessions, name, value, unit) {
  return sessions.map(s => s.name === name ? setCooldown(s, value, unit) : s);
}

function getCooldown(session) {
  return session.cooldown || null;
}

function isOnCooldown(session) {
  const cd = session.cooldown;
  if (!cd) return false;
  const setAt = new Date(cd.setAt).getTime();
  const multipliers = { minutes: 60000, hours: 3600000, days: 86400000 };
  const expiresAt = setAt + cd.value * multipliers[cd.unit];
  return Date.now() < expiresAt;
}

function filterOnCooldown(sessions) {
  return sessions.filter(isOnCooldown);
}

function filterOffCooldown(sessions) {
  return sessions.filter(s => !isOnCooldown(s));
}

module.exports = {
  isValidCooldown,
  setCooldown,
  clearCooldown,
  setCooldownByName,
  getCooldown,
  isOnCooldown,
  filterOnCooldown,
  filterOffCooldown
};
