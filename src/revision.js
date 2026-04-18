// revision.js — track named revisions/versions of a session

function createRevision(label, session) {
  return {
    label,
    createdAt: new Date().toISOString(),
    snapshot: JSON.parse(JSON.stringify(session)),
  };
}

function addRevision(session, label) {
  if (!session.revisions) session.revisions = [];
  const rev = createRevision(label, session);
  session.revisions.push(rev);
  return session;
}

function getRevisions(session) {
  return session.revisions || [];
}

function findRevision(session, label) {
  return (session.revisions || []).find(r => r.label === label) || null;
}

function restoreRevision(session, label) {
  const rev = findRevision(session, label);
  if (!rev) return null;
  const restored = JSON.parse(JSON.stringify(rev.snapshot));
  restored.revisions = session.revisions;
  return restored;
}

function removeRevision(session, label) {
  if (!session.revisions) return session;
  session.revisions = session.revisions.filter(r => r.label !== label);
  return session;
}

function clearRevisions(session) {
  session.revisions = [];
  return session;
}

module.exports = {
  createRevision,
  addRevision,
  getRevisions,
  findRevision,
  restoreRevision,
  removeRevision,
  clearRevisions,
};
