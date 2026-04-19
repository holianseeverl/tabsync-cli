const {
  createChain,
  addToChain,
  removeFromChain,
  getChainSessions,
  findChainByName,
  removeChain,
  listChains
} = require('../chain');
const { loadSessions } = require('../sessionStore');
const fs = require('fs');
const path = require('path');

const CHAINS_FILE = path.resolve('chains.json');

function loadChains() {
  if (!fs.existsSync(CHAINS_FILE)) return [];
  return JSON.parse(fs.readFileSync(CHAINS_FILE, 'utf8'));
}

function saveChains(chains) {
  fs.writeFileSync(CHAINS_FILE, JSON.stringify(chains, null, 2));
}

function handleCreateChain({ name }) {
  const chains = loadChains();
  if (findChainByName(chains, name)) {
    console.log(`Chain "${name}" already exists.`);
    return;
  }
  chains.push(createChain(name));
  saveChains(chains);
  console.log(`Chain "${name}" created.`);
}

function handleAddToChain({ name, sessionId }) {
  const chains = loadChains();
  const idx = chains.findIndex(c => c.name === name);
  if (idx === -1) { console.log(`Chain "${name}" not found.`); return; }
  chains[idx] = addToChain(chains[idx], sessionId);
  saveChains(chains);
  console.log(`Added session ${sessionId} to chain "${name}".`);
}

function handleRemoveFromChain({ name, sessionId }) {
  const chains = loadChains();
  const idx = chains.findIndex(c => c.name === name);
  if (idx === -1) { console.log(`Chain "${name}" not found.`); return; }
  chains[idx] = removeFromChain(chains[idx], sessionId);
  saveChains(chains);
  console.log(`Removed session ${sessionId} from chain "${name}".`);
}

function handleShowChain({ name }) {
  const chains = loadChains();
  const chain = findChainByName(chains, name);
  if (!chain) { console.log(`Chain "${name}" not found.`); return; }
  const sessions = loadSessions();
  const ordered = getChainSessions(chain, sessions);
  if (!ordered.length) { console.log('No sessions in chain.'); return; }
  ordered.forEach((s, i) => console.log(`${i + 1}. [${s.id}] ${s.name}`));
}

function handleListChains() {
  const chains = loadChains();
  if (!chains.length) { console.log('No chains defined.'); return; }
  listChains(chains).forEach(c => console.log(`${c.name} (${c.length} sessions)`));
}

function handleDeleteChain({ name }) {
  const chains = loadChains();
  saveChains(removeChain(chains, name));
  console.log(`Chain "${name}" deleted.`);
}

function registerChainCmd(program) {
  const cmd = program.command('chain').description('Manage session chains');
  cmd.command('create <name>').action(name => handleCreateChain({ name }));
  cmd.command('add <name> <sessionId>').action((name, sessionId) => handleAddToChain({ name, sessionId }));
  cmd.command('remove <name> <sessionId>').action((name, sessionId) => handleRemoveFromChain({ name, sessionId }));
  cmd.command('show <name>').action(name => handleShowChain({ name }));
  cmd.command('list').action(() => handleListChains());
  cmd.command('delete <name>').action(name => handleDeleteChain({ name }));
}

module.exports = { loadChains, saveChains, handleCreateChain, handleAddToChain, handleRemoveFromChain, handleShowChain, handleListChains, handleDeleteChain, registerChainCmd };
