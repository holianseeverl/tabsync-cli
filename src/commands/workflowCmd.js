const { createWorkflow, addStep, removeStep, applyWorkflow, findWorkflowByName, listWorkflows, removeWorkflow } = require('../workflow');
const { loadSessions, saveSessions } = require('../sessionStore');
const fs = require('fs');

const WORKFLOW_FILE = 'workflows.json';

function loadWorkflows() {
  if (!fs.existsSync(WORKFLOW_FILE)) return [];
  return JSON.parse(fs.readFileSync(WORKFLOW_FILE, 'utf-8'));
}

function saveWorkflows(workflows) {
  fs.writeFileSync(WORKFLOW_FILE, JSON.stringify(workflows, null, 2));
}

function handleCreateWorkflow(name) {
  const workflows = loadWorkflows();
  if (findWorkflowByName(workflows, name)) {
    console.log(`Workflow "${name}" already exists.`);
    return;
  }
  workflows.push(createWorkflow(name));
  saveWorkflows(workflows);
  console.log(`Workflow "${name}" created.`);
}

function handleListWorkflows() {
  const workflows = loadWorkflows();
  if (!workflows.length) { console.log('No workflows found.'); return; }
  listWorkflows(workflows).forEach(w => {
    console.log(`- ${w.name} (${w.steps} steps) [${w.createdAt}]`);
  });
}

function handleRemoveWorkflow(name) {
  const workflows = loadWorkflows();
  const updated = removeWorkflow(workflows, name);
  if (updated.length === workflows.length) {
    console.log(`Workflow "${name}" not found.`);
    return;
  }
  saveWorkflows(updated);
  console.log(`Workflow "${name}" removed.`);
}

function registerWorkflowCmd(program) {
  const cmd = program.command('workflow').description('Manage session workflows');

  cmd.command('create <name>').description('Create a new workflow').action(handleCreateWorkflow);
  cmd.command('list').description('List all workflows').action(handleListWorkflows);
  cmd.command('remove <name>').description('Remove a workflow').action(handleRemoveWorkflow);
}

module.exports = { loadWorkflows, saveWorkflows, handleCreateWorkflow, handleListWorkflows, handleRemoveWorkflow, registerWorkflowCmd };
