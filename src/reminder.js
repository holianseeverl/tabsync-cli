// reminder.js — attach reminders/due dates to sessions

function setReminder(sessions, sessionId, { message, dueAt }) {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    return {
      ...s,
      reminder: {
        message: message || '',
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
        createdAt: new Date().toISOString()
      }
    };
  });
}

function clearReminder(sessions, sessionId) {
  return sessions.map(s => {
    if (s.id !== sessionId) return s;
    const { reminder, ...rest } = s;
    return rest;
  });
}

function getReminder(sessions, sessionId) {
  const session = sessions.find(s => s.id === sessionId);
  return session ? session.reminder || null : null;
}

function listDue(sessions, asOf = new Date()) {
  const now = new Date(asOf).getTime();
  return sessions.filter(s => {
    if (!s.reminder || !s.reminder.dueAt) return false;
    return new Date(s.reminder.dueAt).getTime() <= now;
  });
}

function setReminderByName(sessions, name, opts) {
  const session = sessions.find(s => s.name === name);
  if (!session) return sessions;
  return setReminder(sessions, session.id, opts);
}

function hasReminder(session) {
  return !!(session && session.reminder);
}

module.exports = {
  setReminder,
  clearReminder,
  getReminder,
  listDue,
  setReminderByName,
  hasReminder
};
