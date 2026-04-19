// flow.js — assign and query a 'flow state' for sessions

const VALID_FLOWS = ['blocked', 'idle', 'active', 'deep'];

function isValidFlow(flow) {
  return VALID_FLOWS.includes(flow);
}

function setFlow(sessions, id, flow) {
  if (!isValidFlow(flow)) throw new Error(`Invalid flow: ${flow}`);
  return sessions.map(s => s.id === id ? { ...s, flow } : s);
}

function clearFlow(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, flow: undefined } : s);
}

function setFlowByName(sessions, name, flow) {
  const session = sessions.find(s => s.name === name);
  if (!session) throw new Error(`Session not found: ${name}`);
  return setFlow(sessions, session.id, flow);
}

function getFlow(session) {
  return session.flow || null;
}

function filterByFlow(sessions, flow) {
  return sessions.filter(s => s.flow === flow);
}

function sortByFlow(sessions) {
  const order = { deep: 0, active: 1, idle: 2, blocked: 3 };
  return [...sessions].sort((a, b) => {
    const oa = order[a.flow] ?? 99;
    const ob = order[b.flow] ?? 99;
    return oa - ob;
  });
}

module.exports = { isValidFlow, setFlow, clearFlow, setFlowByName, getFlow, filterByFlow, sortByFlow, VALID_FLOWS };
