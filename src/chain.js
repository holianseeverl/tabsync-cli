// chain.js — link sessions into ordered sequences

function createChain(name, sessionIds = []) {
  return { name, sessionIds };
}

function addToChain(chain, sessionId) {
  if (chain.sessionIds.includes(sessionId)) return chain;
  return { ...chain, sessionIds: [...chain.sessionIds, sessionId] };
}

function removeFromChain(chain, sessionId) {
  return { ...chain, sessionIds: chain.sessionIds.filter(id => id !== sessionId) };
}

function reorderChain(chain, sessionIds) {
  const valid = sessionIds.filter(id => chain.sessionIds.includes(id));
  return { ...chain, sessionIds: valid };
}

function getChainSessions(chain, sessions) {
  return chain.sessionIds
    .map(id => sessions.find(s => s.id === id))
    .filter(Boolean);
}

function findChainByName(chains, name) {
  return chains.find(c => c.name === name) || null;
}

function removeChain(chains, name) {
  return chains.filter(c => c.name !== name);
}

function listChains(chains) {
  return chains.map(c => ({ name: c.name, length: c.sessionIds.length }));
}

module.exports = {
  createChain,
  addToChain,
  removeFromChain,
  reorderChain,
  getChainSessions,
  findChainByName,
  removeChain,
  listChains
};
