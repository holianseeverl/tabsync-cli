const {
  setCooldownByName,
  clearCooldown,
  getCooldown,
  isOnCooldown,
  filterOnCooldown,
  filterOffCooldown
} = require('../cooldown');

function handleSetCooldown(sessions, name, value, unit) {
  const num = parseFloat(value);
  if (isNaN(num)) {
    console.error(`Invalid cooldown value: ${value}`);
    return sessions;
  }
  const updated = setCooldownByName(sessions, name, num, unit);
  const found = updated.find(s => s.name === name);
  if (!found || !found.cooldown) {
    console.error(`Session "${name}" not found or invalid cooldown.`);
  } else {
    console.log(`Cooldown set: ${name} — ${num} ${unit}`);
  }
  return updated;
}

function handleClearCooldown(sessions, name) {
  const updated = sessions.map(s => s.name === name ? clearCooldown(s) : s);
  console.log(`Cooldown cleared for "${name}".`);
  return updated;
}

function handleShowCooldown(sessions, name) {
  const s = sessions.find(s => s.name === name);
  if (!s) { console.error(`Session "${name}" not found.`); return; }
  const cd = getCooldown(s);
  if (!cd) { console.log(`No cooldown set for "${name}".`); return; }
  const status = isOnCooldown(s) ? 'ACTIVE' : 'EXPIRED';
  console.log(`${name}: ${cd.value} ${cd.unit} [${status}] (set at ${cd.setAt})`);
}

function handleListOnCooldown(sessions) {
  const list = filterOnCooldown(sessions);
  if (!list.length) { console.log('No sessions currently on cooldown.'); return; }
  list.forEach(s => console.log(`  ${s.name} — ${s.cooldown.value} ${s.cooldown.unit}`));
}

function handleListOffCooldown(sessions) {
  const list = filterOffCooldown(sessions);
  if (!list.length) { console.log('All sessions are on cooldown.'); return; }
  list.forEach(s => console.log(`  ${s.name}`));
}

function registerCooldownCmd(program, sessions, save) {
  const cmd = program.command('cooldown').description('Manage session cooldowns');

  cmd.command('set <name> <value> <unit>')
    .description('Set a cooldown (unit: minutes|hours|days)')
    .action((name, value, unit) => save(handleSetCooldown(sessions(), name, value, unit)));

  cmd.command('clear <name>')
    .description('Clear cooldown from a session')
    .action(name => save(handleClearCooldown(sessions(), name)));

  cmd.command('show <name>')
    .description('Show cooldown status for a session')
    .action(name => handleShowCooldown(sessions(), name));

  cmd.command('list-active')
    .description('List sessions currently on cooldown')
    .action(() => handleListOnCooldown(sessions()));

  cmd.command('list-ready')
    .description('List sessions not on cooldown')
    .action(() => handleListOffCooldown(sessions()));
}

module.exports = {
  handleSetCooldown,
  handleClearCooldown,
  handleShowCooldown,
  handleListOnCooldown,
  handleListOffCooldown,
  registerCooldownCmd
};
