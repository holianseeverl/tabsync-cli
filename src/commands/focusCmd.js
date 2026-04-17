const { setFocus, clearFocus, getFocused, setFocusByName, listByFocusRecency } = require('../focus');

function handleSetFocus(sessions, name) {
  const updated = setFocusByName(sessions, name);
  if (!updated) {
    console.log(`Session "${name}" not found.`);
    return sessions;
  }
  console.log(`Focus set to "${name}".`);
  return updated;
}

function handleClearFocus(sessions) {
  const updated = clearFocus(sessions);
  console.log('Focus cleared.');
  return updated;
}

function handleShowFocus(sessions) {
  const focused = getFocused(sessions);
  if (!focused) {
    console.log('No session is currently focused.');
  } else {
    console.log(`Focused: ${focused.name} (${focused.id}) since ${focused.focusedAt}`);
  }
}

function handleFocusHistory(sessions) {
  const list = listByFocusRecency(sessions);
  if (!list.length) {
    console.log('No focus history.');
    return;
  }
  list.forEach(s => console.log(`  ${s.name} — last focused ${s.focusedAt}`));
}

function registerFocusCmd(program, sessions, save) {
  const focus = program.command('focus').description('Manage session focus');

  focus.command('set <name>').description('Set focus to a session').action(name => {
    const updated = handleSetFocus(sessions, name);
    save(updated);
  });

  focus.command('clear').description('Clear current focus').action(() => {
    const updated = handleClearFocus(sessions);
    save(updated);
  });

  focus.command('show').description('Show focused session').action(() => handleShowFocus(sessions));

  focus.command('history').description('List sessions by focus recency').action(() => handleFocusHistory(sessions));
}

module.exports = { handleSetFocus, handleClearFocus, handleShowFocus, handleFocusHistory, registerFocusCmd };
