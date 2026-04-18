const {
  startTracking, stopTracking, getTrackedTime, clearTracking,
  setTrackingByName, formatDuration, sortByTrackedTime, filterByMinTime
} = require('../timetrack');

function handleStart(sessions, name) {
  const found = sessions.find(s => s.name === name);
  if (!found) { console.log(`Session '${name}' not found.`); return sessions; }
  const updated = setTrackingByName(sessions, name, startTracking);
  console.log(`Started tracking time for '${name}'.`);
  return updated;
}

function handleStop(sessions, name) {
  const found = sessions.find(s => s.name === name);
  if (!found) { console.log(`Session '${name}' not found.`); return sessions; }
  const updated = setTrackingByName(sessions, name, stopTracking);
  const stopped = updated.find(s => s.name === name);
  console.log(`Stopped. Total time: ${formatDuration(getTrackedTime(stopped))}`);
  return updated;
}

function handleShowTime(sessions, name) {
  const s = sessions.find(s => s.name === name);
  if (!s) { console.log(`Session '${name}' not found.`); return; }
  console.log(`${name}: ${formatDuration(getTrackedTime(s))}`);
}

function handleClearTime(sessions, name) {
  const found = sessions.find(s => s.name === name);
  if (!found) { console.log(`Session '${name}' not found.`); return sessions; }
  const updated = setTrackingByName(sessions, name, clearTracking);
  console.log(`Cleared time tracking for '${name}'.`);
  return updated;
}

function handleSortByTime(sessions) {
  const sorted = sortByTrackedTime(sessions);
  sorted.forEach(s => console.log(`${s.name}: ${formatDuration(getTrackedTime(s))}`));
  return sorted;
}

function handleFilterByMinTime(sessions, minMs) {
  const result = filterByMinTime(sessions, minMs);
  if (!result.length) { console.log('No sessions match.'); return result; }
  result.forEach(s => console.log(`${s.name}: ${formatDuration(getTrackedTime(s))}`));
  return result;
}

function registerTimetrackCmd(program, sessions, save) {
  const cmd = program.command('timetrack').description('Track time spent in sessions');
  cmd.command('start <name>').action(n => save(handleStart(sessions(), n)));
  cmd.command('stop <name>').action(n => save(handleStop(sessions(), n)));
  cmd.command('show <name>').action(n => handleShowTime(sessions(), n));
  cmd.command('clear <name>').action(n => save(handleClearTime(sessions(), n)));
  cmd.command('sort').action(() => handleSortByTime(sessions()));
  cmd.command('filter <minMs>').action(ms => handleFilterByMinTime(sessions(), Number(ms)));
}

module.exports = {
  handleStart, handleStop, handleShowTime, handleClearTime,
  handleSortByTime, handleFilterByMinTime, registerTimetrackCmd
};
