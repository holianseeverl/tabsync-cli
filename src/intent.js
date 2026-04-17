// intent.js — tag a session with a purpose/intent and query by it

const VALID_INTENTS = ['research', 'work', 'personal', 'reference', 'shopping', 'entertainment', 'learning', 'other'];

function isValidIntent(intent) {
  return VALID_INTENTS.includes(intent);
}

function setIntent(session, intent) {
  if (!isValidIntent(intent)) throw new Error(`Invalid intent: ${intent}`);
  return { ...session, intent };
}

function clearIntent(session) {
  const s = { ...session };
  delete s.intent;
  return s;
}

function setIntentByName(sessions, name, intent) {
  return sessions.map(s => s.name === name ? setIntent(s, intent) : s);
}

function getIntent(session) {
  return session.intent || null;
}

function filterByIntent(sessions, intent) {
  if (!isValidIntent(intent)) throw new Error(`Invalid intent: ${intent}`);
  return sessions.filter(s => s.intent === intent);
}

function groupByIntent(sessions) {
  const groups = {};
  for (const s of sessions) {
    const key = s.intent || 'unset';
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  }
  return groups;
}

function listValidIntents() {
  return [...VALID_INTENTS];
}

module.exports = { isValidIntent, setIntent, clearIntent, setIntentByName, getIntent, filterByIntent, groupByIntent, listValidIntents };
