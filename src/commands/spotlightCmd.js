const { getSpotlight, getSpotlightByTag, getSpotlightByPriority, spotlightSummary } = require('../spotlight');
const { loadSessions } = require('../sessionStore');

function handleSpotlight(args, options) {
  const sessions = loadSessions();

  if (options.tag) {
    const results = getSpotlightByTag(sessions, options.tag);
    if (results.length === 0) {
      console.log(`No spotlight sessions with tag "${options.tag}".`);
    } else {
      results.forEach(s => console.log(`  ${s.name} [tag:${options.tag}]`));
    }
    return;
  }

  if (options.priority) {
    const results = getSpotlightByPriority(sessions, options.priority);
    if (results.length === 0) {
      console.log(`No spotlight sessions with priority "${options.priority}".`);
    } else {
      results.forEach(s => console.log(`  ${s.name} [priority:${options.priority}]`));
    }
    return;
  }

  console.log(spotlightSummary(sessions));
}

function registerSpotlightCmd(program) {
  program
    .command('spotlight')
    .description('Show pinned and favorite sessions at a glance')
    .option('--tag <tag>', 'Filter spotlight by tag')
    .option('--priority <level>', 'Filter spotlight by priority')
    .action((options) => handleSpotlight([], options));
}

module.exports = { handleSpotlight, registerSpotlightCmd };
