// historyCmd.js — CLI command handlers for session history

const fs = require('fs');
const path = require('path');
const {
  addHistoryEntry,
  getHistoryForSession,
  clearHistory,
  filterHistoryByAction,
  getRecentHistory,
} = require('../history');

const HISTORY_FILE = path.resolve(__dirname, '../../data/history.json');

function loadHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveHistory(history) {
  fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function handleLogHistory(sessionId, sessionName, action) {
  const history = loadHistory();
  const updated = addHistoryEntry(history, sessionId, sessionName, action);
  saveHistory(updated);
  console.log(`Logged '${action}' for session "${sessionName}".`);
}

function handleShowHistory(argv) {
  let history = loadHistory();

  if (argv.session) {
    history = getHistoryForSession(history, argv.session);
  }
  if (argv.action) {
    history = filterHistoryByAction(history, argv.action);
  }

  const limit = argv.limit ? parseInt(argv.limit, 10) : 20;
  const recent = getRecentHistory(history, limit);

  if (recent.length === 0) {
    console.log('No history entries found.');
    return;
  }

  recent.forEach((e) => {
    console.log(`[${e.timestamp}] ${e.action.toUpperCase()} — "${e.sessionName}" (${e.sessionId})`);
  });
}

function handleClearHistory(argv) {
  const history = loadHistory();
  const updated = clearHistory(history, argv.session || null);
  saveHistory(updated);
  if (argv.session) {
    console.log(`Cleared history for session "${argv.session}".`);
  } else {
    console.log('Cleared all history.');
  }
}

module.exports = {
  loadHistory,
  saveHistory,
  handleLogHistory,
  handleShowHistory,
  handleClearHistory,
};
