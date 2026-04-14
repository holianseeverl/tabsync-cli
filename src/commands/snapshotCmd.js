const { loadSessions, saveSessions } = require('../sessionStore');
const { createSnapshot, restoreSnapshot, listSnapshots, findSnapshotByLabel } = require('../snapshot');
const fs = require('fs');
const path = require('path');

const SNAPSHOT_FILE = path.resolve(process.cwd(), 'snapshots.json');

function loadSnapshots() {
  if (!fs.existsSync(SNAPSHOT_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveSnapshots(snapshots) {
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshots, null, 2));
}

async function handleSnapshot(argv) {
  const { action, label } = argv;
  const sessions = loadSessions();
  const snapshots = loadSnapshots();

  if (action === 'create') {
    if (!label) {
      console.error('Error: --label is required for create');
      process.exit(1);
    }
    if (findSnapshotByLabel(snapshots, label)) {
      console.error(`Error: snapshot "${label}" already exists`);
      process.exit(1);
    }
    const snap = createSnapshot(sessions, label);
    snapshots.push(snap);
    saveSnapshots(snapshots);
    console.log(`Snapshot "${label}" created with ${snap.sessions.length} session(s).`);

  } else if (action === 'restore') {
    if (!label) {
      console.error('Error: --label is required for restore');
      process.exit(1);
    }
    const snap = findSnapshotByLabel(snapshots, label);
    if (!snap) {
      console.error(`Error: snapshot "${label}" not found`);
      process.exit(1);
    }
    const restored = restoreSnapshot(snap);
    saveSessions(restored);
    console.log(`Restored ${restored.length} session(s) from snapshot "${label}".`);

  } else if (action === 'list') {
    const list = listSnapshots(snapshots);
    if (list.length === 0) {
      console.log('No snapshots found.');
    } else {
      list.forEach(s => {
        console.log(`[${s.index}] ${s.label} — ${s.sessionCount} session(s) — ${s.createdAt}`);
      });
    }

  } else {
    console.error(`Unknown action: ${action}. Use create, restore, or list.`);
    process.exit(1);
  }
}

module.exports = { handleSnapshot };
