// recurrence.js — set recurring open schedules for sessions

const VALID_FREQUENCIES = ['daily', 'weekly', 'monthly'];

function isValidFrequency(freq) {
  return VALID_FREQUENCIES.includes(freq);
}

function setRecurrence(session, frequency, dayOrDate = null) {
  if (!isValidFrequency(frequency)) {
    throw new Error(`Invalid frequency: ${frequency}. Must be one of ${VALID_FREQUENCIES.join(', ')}`);
  }
  return {
    ...session,
    recurrence: { frequency, dayOrDate, setAt: new Date().toISOString() }
  };
}

function clearRecurrence(session) {
  const updated = { ...session };
  delete updated.recurrence;
  return updated;
}

function setRecurrenceByName(sessions, name, frequency, dayOrDate = null) {
  return sessions.map(s => s.name === name ? setRecurrence(s, frequency, dayOrDate) : s);
}

function getRecurrence(session) {
  return session.recurrence || null;
}

function filterByFrequency(sessions, frequency) {
  return sessions.filter(s => s.recurrence && s.recurrence.frequency === frequency);
}

function listRecurring(sessions) {
  return sessions.filter(s => !!s.recurrence);
}

module.exports = {
  isValidFrequency,
  setRecurrence,
  clearRecurrence,
  setRecurrenceByName,
  getRecurrence,
  filterByFrequency,
  listRecurring
};
