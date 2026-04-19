// sentiment: positive, neutral, negative, mixed
const VALID_SENTIMENTS = ['positive', 'neutral', 'negative', 'mixed'];

function isValidSentiment(s) {
  return VALID_SENTIMENTS.includes(s);
}

function setSentiment(sessions, id, sentiment) {
  if (!isValidSentiment(sentiment)) throw new Error(`Invalid sentiment: ${sentiment}`);
  return sessions.map(s => s.id === id ? { ...s, sentiment } : s);
}

function clearSentiment(sessions, id) {
  return sessions.map(s => s.id === id ? { ...s, sentiment: undefined } : s);
}

function setSentimentByName(sessions, name, sentiment) {
  if (!isValidSentiment(sentiment)) throw new Error(`Invalid sentiment: ${sentiment}`);
  return sessions.map(s => s.name === name ? { ...s, sentiment } : s);
}

function getSentiment(session) {
  return session.sentiment || null;
}

function filterBySentiment(sessions, sentiment) {
  return sessions.filter(s => s.sentiment === sentiment);
}

function sortBySentiment(sessions) {
  const order = { positive: 0, neutral: 1, mixed: 2, negative: 3 };
  return [...sessions].sort((a, b) => {
    const ao = order[a.sentiment] ?? 99;
    const bo = order[b.sentiment] ?? 99;
    return ao - bo;
  });
}

module.exports = { isValidSentiment, setSentiment, clearSentiment, setSentimentByName, getSentiment, filterBySentiment, sortBySentiment };
