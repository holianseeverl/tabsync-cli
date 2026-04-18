const { addAttachment, removeAttachment, getAttachments, filterByAttachment } = require('../attachment');

function handleAddAttachment(sessions, sessionName, name, url) {
  const session = sessions.find(s => s.name === sessionName);
  if (!session) {
    console.log(`Session '${sessionName}' not found.`);
    return sessions;
  }
  try {
    const updated = addAttachment(session, { name, url });
    const result = sessions.map(s => s.name === sessionName ? updated : s);
    console.log(`Attached '${name}' to session '${sessionName}'.`);
    return result;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return sessions;
  }
}

function handleRemoveAttachment(sessions, sessionName, name) {
  const session = sessions.find(s => s.name === sessionName);
  if (!session) {
    console.log(`Session '${sessionName}' not found.`);
    return sessions;
  }
  const updated = removeAttachment(session, name);
  console.log(`Removed attachment '${name}' from '${sessionName}'.`);
  return sessions.map(s => s.name === sessionName ? updated : s);
}

function handleShowAttachments(sessions, sessionName) {
  const session = sessions.find(s => s.name === sessionName);
  if (!session) { console.log(`Session '${sessionName}' not found.`); return; }
  const attachments = getAttachments(session);
  if (!attachments.length) { console.log('No attachments.'); return; }
  attachments.forEach(a => console.log(`  ${a.name}: ${a.url}`));
}

function handleFilterByAttachment(sessions, name) {
  const results = filterByAttachment(sessions, name);
  if (!results.length) { console.log('No sessions found.'); return; }
  results.forEach(s => console.log(`  ${s.name}`));
}

function registerAttachmentCmd(program, sessions, save) {
  const cmd = program.command('attachment').description('Manage session attachments');

  cmd.command('add <session> <name> <url>').description('Add an attachment').action((session, name, url) => {
    save(handleAddAttachment(sessions(), session, name, url));
  });

  cmd.command('remove <session> <name>').description('Remove an attachment').action((session, name) => {
    save(handleRemoveAttachment(sessions(), session, name));
  });

  cmd.command('show <session>').description('Show attachments').action(session => {
    handleShowAttachments(sessions(), session);
  });

  cmd.command('filter <name>').description('Filter sessions by attachment name').action(name => {
    handleFilterByAttachment(sessions(), name);
  });
}

module.exports = { handleAddAttachment, handleRemoveAttachment, handleShowAttachments, handleFilterByAttachment, registerAttachmentCmd };
