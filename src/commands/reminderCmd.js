// reminderCmd.js — CLI command handlers for session reminders

const { loadSessions, saveSessions } = require('../sessionStore');
const {
  setReminderByName,
  clearReminder,
  getReminder,
  listDue
} = require('../reminder');

function handleSetReminder(name, message, dueAt, opts = {}) {
  const sessions = loadSessions(opts.file);
  const updated = setReminderByName(sessions, name, { message, dueAt });
  if (updated === sessions) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  saveSessions(updated, opts.file);
  console.log(`Reminder set for "${name}": ${message}${dueAt ? ` (due: ${dueAt})` : ''}`);
}

function handleClearReminder(name, opts = {}) {
  const sessions = loadSessions(opts.file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  const updated = clearReminder(sessions, session.id);
  saveSessions(updated, opts.file);
  console.log(`Reminder cleared for "${name}".`);
}

function handleShowReminder(name, opts = {}) {
  const sessions = loadSessions(opts.file);
  const session = sessions.find(s => s.name === name);
  if (!session) {
    console.log(`Session "${name}" not found.`);
    return;
  }
  const reminder = getReminder(sessions, session.id);
  if (!reminder) {
    console.log(`No reminder set for "${name}".`);
    return;
  }
  console.log(`Reminder for "${name}":`);
  console.log(`  Message : ${reminder.message || '(none)'}`);
  console.log(`  Due     : ${reminder.dueAt || '(no due date)'}`);
  console.log(`  Created : ${reminder.createdAt}`);
}

function handleListDue(opts = {}) {
  const sessions = loadSessions(opts.file);
  const due = listDue(sessions);
  if (due.length === 0) {
    console.log('No sessions with overdue reminders.');
    return;
  }
  console.log('Overdue reminders:');
  due.forEach(s => {
    console.log(`  [${s.name}] ${s.reminder.message || ''} — due: ${s.reminder.dueAt}`);
  });
}

function registerReminderCmd(program) {
  const cmd = program.command('reminder').description('Manage session reminders');

  cmd.command('set <name> <message>')
    .option('--due <date>', 'Due date (ISO string)')
    .description('Set a reminder on a session')
    .action((name, message, options) => handleSetReminder(name, message, options.due));

  cmd.command('clear <name>')
    .description('Clear reminder from a session')
    .action(name => handleClearReminder(name));

  cmd.command('show <name>')
    .description('Show reminder for a session')
    .action(name => handleShowReminder(name));

  cmd.command('due')
    .description('List sessions with overdue reminders')
    .action(() => handleListDue());
}

module.exports = {
  handleSetReminder,
  handleClearReminder,
  handleShowReminder,
  handleListDue,
  registerReminderCmd
};
