// dependency.js — link sessions together as dependencies

function addDependency(sessions, sessionId, dependsOnId) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  if (!sessions.find(s => s.id === dependsOnId)) throw new Error(`Session ${dependsOnId} not found`);
  if (sessionId === dependsOnId) throw new Error('Session cannot depend on itself');
  if (!session.dependencies) session.dependencies = [];
  if (!session.dependencies.includes(dependsOnId)) {
    session.dependencies.push(dependsOnId);
  }
  return session;
}

function removeDependency(sessions, sessionId, dependsOnId) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  if (!session.dependencies) return session;
  session.dependencies = session.dependencies.filter(id => id !== dependsOnId);
  return session;
}

function getDependencies(sessions, sessionId) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  const ids = session.dependencies || [];
  return sessions.filter(s => ids.includes(s.id));
}

function getDependents(sessions, sessionId) {
  return sessions.filter(s => s.dependencies && s.dependencies.includes(sessionId));
}

function hasDependency(session, dependsOnId) {
  return Array.isArray(session.dependencies) && session.dependencies.includes(dependsOnId);
}

module.exports = { addDependency, removeDependency, getDependencies, getDependents, hasDependency };
