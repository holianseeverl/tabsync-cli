// workflow.js — chain multiple operations on sessions

function createWorkflow(name, steps = []) {
  return { name, steps, createdAt: new Date().toISOString() };
}

function addStep(workflow, step) {
  if (!step || typeof step !== 'string') throw new Error('Step must be a non-empty string');
  return { ...workflow, steps: [...workflow.steps, step] };
}

function removeStep(workflow, index) {
  if (index < 0 || index >= workflow.steps.length) throw new Error('Invalid step index');
  const steps = workflow.steps.filter((_, i) => i !== index);
  return { ...workflow, steps };
}

function applyWorkflow(sessions, workflow, handlers) {
  let result = sessions;
  for (const step of workflow.steps) {
    const [cmd, ...args] = step.split(':');
    if (!handlers[cmd]) throw new Error(`Unknown workflow step: ${cmd}`);
    result = handlers[cmd](result, ...args);
  }
  return result;
}

function findWorkflowByName(workflows, name) {
  return workflows.find(w => w.name === name) || null;
}

function removeWorkflow(workflows, name) {
  return workflows.filter(w => w.name !== name);
}

function listWorkflows(workflows) {
  return workflows.map(w => ({ name: w.name, stepCount: w.steps.length, createdAt: w.createdAt }));
}

module.exports = { createWorkflow, addStep, removeStep, applyWorkflow, findWorkflowByName, removeWorkflow, listWorkflows };
