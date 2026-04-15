// group.js — group sessions by a given property or custom label

function groupByTag(sessions) {
  const groups = {};
  for (const session of sessions) {
    const tags = session.tags && session.tags.length > 0 ? session.tags : ['untagged'];
    for (const tag of tags) {
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(session);
    }
  }
  return groups;
}

function groupByDate(sessions) {
  const groups = {};
  for (const session of sessions) {
    const date = session.createdAt
      ? new Date(session.createdAt).toISOString().slice(0, 10)
      : 'unknown';
    if (!groups[date]) groups[date] = [];
    groups[date].push(session);
  }
  return groups;
}

function groupByTabCount(sessions, bucketSize = 5) {
  const groups = {};
  for (const session of sessions) {
    const count = Array.isArray(session.tabs) ? session.tabs.length : 0;
    const bucket = Math.floor(count / bucketSize) * bucketSize;
    const key = `${bucket}-${bucket + bucketSize - 1} tabs`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(session);
  }
  return groups;
}

function group(sessions, by = 'tag', options = {}) {
  switch (by) {
    case 'tag':
      return groupByTag(sessions);
    case 'date':
      return groupByDate(sessions);
    case 'tabcount':
      return groupByTabCount(sessions, options.bucketSize);
    default:
      throw new Error(`Unknown grouping strategy: "${by}"`);
  }
}

module.exports = { groupByTag, groupByDate, groupByTabCount, group };
