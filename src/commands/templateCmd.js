// templateCmd.js — CLI handlers for template commands
const { loadSessions, saveSessions } = require('../sessionStore');
const { createTemplate, applyTemplate, findTemplateByName, removeTemplate, listTemplates } = require('../template');
const fs = require('fs');
const path = require('path');

const TEMPLATES_FILE = path.resolve(process.cwd(), 'templates.json');

function loadTemplates() {
  if (!fs.existsSync(TEMPLATES_FILE)) return [];
  return JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf-8'));
}

function saveTemplates(templates) {
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
}

function handleSaveTemplate(sessionName, templateName) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.name === sessionName);
  if (!session) return console.error(`Session "${sessionName}" not found.`);

  const templates = loadTemplates();
  if (findTemplateByName(templates, templateName)) {
    return console.error(`Template "${templateName}" already exists. Remove it first.`);
  }

  templates.push(createTemplate(templateName, session));
  saveTemplates(templates);
  console.log(`Template "${templateName}" saved from session "${sessionName}".`);
}

function handleApplyTemplate(templateName, newSessionName) {
  const templates = loadTemplates();
  const template = findTemplateByName(templates, templateName);
  if (!template) return console.error(`Template "${templateName}" not found.`);

  const sessions = loadSessions();
  const newSession = applyTemplate(template, newSessionName);
  sessions.push(newSession);
  saveSessions(sessions);
  console.log(`Session "${newSession.name}" created from template "${templateName}".`);
}

function handleRemoveTemplate(templateName) {
  const templates = loadTemplates();
  if (!findTemplateByName(templates, templateName)) {
    return console.error(`Template "${templateName}" not found.`);
  }
  saveTemplates(removeTemplate(templates, templateName));
  console.log(`Template "${templateName}" removed.`);
}

function handleListTemplates() {
  const templates = loadTemplates();
  if (!templates.length) return console.log('No templates saved.');
  listTemplates(templates).forEach(t => {
    console.log(`  ${t.name} — ${t.tabCount} tab(s), created ${t.createdAt}`);
  });
}

module.exports = { handleSaveTemplate, handleApplyTemplate, handleRemoveTemplate, handleListTemplates, loadTemplates, saveTemplates };
