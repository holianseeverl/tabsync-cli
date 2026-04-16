const { addDependency, removeDependency, getDependencies, getDependents } = require('../dependency');
const { loadSessions, saveSessions } = require('../sessionStore');

function handleAddDependency(sessionId, dependsOnId, file) {
  const sessions = loadSessions(file);
  try {
    addDependency(sessions, sessionId, dependsOnId);
    saveSessions(sessions, file);
    console.log(`Session "${sessionId}" now depends on "${dependsOnId}".`);
  } catch (e) {
    console.error(e.message);
  }
}

function handleRemoveDependency(sessionId, dependsOnId, file) {
  const sessions = loadSessions(file);
  removeDependency(sessions, sessionId, dependsOnId);
  saveSessions(sessions, file);
  console.log(`Removed dependency "${dependsOnId}" from "${sessionId}".`);
}

function handleShowDependencies(sessionId, file) {
  const sessions = loadSessions(file);
  try {
    const deps = getDependencies(sessions, sessionId);
    if (deps.length === 0) {
      console.log(`No dependencies for session "${sessionId}".`);
    } else {
      console.log(`Dependencies of "${sessionId}":`);
      deps.forEach(s => console.log(`  - [${s.id}] ${s.name}`));
    }
  } catch (e) {
    console.error(e.message);
  }
}

function handleShowDependents(sessionId, file) {
  const sessions = loadSessions(file);
  const dependents = getDependents(sessions, sessionId);
  if (dependents.length === 0) {
    console.log(`No sessions depend on "${sessionId}".`);
  } else {
    console.log(`Sessions depending on "${sessionId}":`);
    dependents.forEach(s => console.log(`  - [${s.id}] ${s.name}`));
  }
}

function registerDependencyCmd(program, file) {
  const cmd = program.command('dependency').description('Manage session dependencies');

  cmd.command('add <sessionId> <dependsOnId>').description('Add a dependency').action((a, b) => handleAddDependency(a, b, file));
  cmd.command('remove <sessionId> <dependsOnId>').description('Remove a dependency').action((a, b) => handleRemoveDependency(a, b, file));
  cmd.command('show <sessionId>').description('Show dependencies of a session').action(a => handleShowDependencies(a, file));
  cmd.command('dependents <sessionId>').description('Show sessions that depend on a session').action(a => handleShowDependents(a, file));
}

module.exports = { handleAddDependency, handleRemoveDependency, handleShowDependencies, handleShowDependents, registerDependencyCmd };
