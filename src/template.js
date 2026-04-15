// template.js — save and apply session templates

/**
 * Create a template from an existing session (strips id/date, keeps structure)
 */
function createTemplate(name, session) {
  if (!name || typeof name !== 'string') throw new Error('Template name is required');
  if (!session || !Array.isArray(session.tabs)) throw new Error('Invalid session');

  return {
    name,
    tabs: session.tabs.map(tab => ({ url: tab.url, title: tab.title })),
    tags: session.tags ? [...session.tags] : [],
    createdAt: new Date().toISOString()
  };
}

/**
 * Apply a template to produce a new session-like object
 */
function applyTemplate(template, overrideName) {
  if (!template || !Array.isArray(template.tabs)) throw new Error('Invalid template');

  return {
    id: `session-${Date.now()}`,
    name: overrideName || template.name,
    tabs: template.tabs.map(tab => ({ ...tab })),
    tags: template.tags ? [...template.tags] : [],
    createdAt: new Date().toISOString()
  };
}

/**
 * Find a template by name
 */
function findTemplateByName(templates, name) {
  return templates.find(t => t.name === name) || null;
}

/**
 * Remove a template by name, returns updated list
 */
function removeTemplate(templates, name) {
  return templates.filter(t => t.name !== name);
}

/**
 * List all template names
 */
function listTemplates(templates) {
  return templates.map(t => ({ name: t.name, tabCount: t.tabs.length, createdAt: t.createdAt }));
}

module.exports = { createTemplate, applyTemplate, findTemplateByName, removeTemplate, listTemplates };
