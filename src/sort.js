/**
 * Sort sessions by various criteria
 */

function sortByDate(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

function sortByName(sessions, order = 'asc') {
  return [...sessions].sort((a, b) => {
    const cmp = a.name.localeCompare(b.name);
    return order === 'asc' ? cmp : -cmp;
  });
}

function sortByTabCount(sessions, order = 'desc') {
  return [...sessions].sort((a, b) => {
    const diff = (a.tabs?.length || 0) - (b.tabs?.length || 0);
    return order === 'asc' ? diff : -diff;
  });
}

function sort(sessions, by = 'date', order) {
  switch (by) {
    case 'name':
      return sortByName(sessions, order || 'asc');
    case 'tabs':
      return sortByTabCount(sessions, order || 'desc');
    case 'date':
    default:
      return sortByDate(sessions, order || 'desc');
  }
}

module.exports = { sortByDate, sortByName, sortByTabCount, sort };
