// attachment.js — attach file references to sessions

function addAttachment(session, attachment) {
  if (!attachment || typeof attachment.name !== 'string' || typeof attachment.url !== 'string') {
    throw new Error('Attachment must have name and url');
  }
  const attachments = session.attachments ? [...session.attachments] : [];
  if (attachments.find(a => a.name === attachment.name)) {
    throw new Error(`Attachment '${attachment.name}' already exists`);
  }
  return { ...session, attachments: [...attachments, { name: attachment.name, url: attachment.url }] };
}

function removeAttachment(session, name) {
  const attachments = (session.attachments || []).filter(a => a.name !== name);
  return { ...session, attachments };
}

function getAttachments(session) {
  return session.attachments || [];
}

function addAttachmentByName(sessions, sessionName, attachment) {
  return sessions.map(s => s.name === sessionName ? addAttachment(s, attachment) : s);
}

function filterByAttachment(sessions, name) {
  return sessions.filter(s => (s.attachments || []).some(a => a.name === name));
}

function hasAttachment(session, name) {
  return (session.attachments || []).some(a => a.name === name);
}

module.exports = { addAttachment, removeAttachment, getAttachments, addAttachmentByName, filterByAttachment, hasAttachment };
