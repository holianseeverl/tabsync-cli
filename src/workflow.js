// workflow.js - create and apply named workflows (sequences of steps)

function createWorkflow(name, steps = []) {
  return { name, steps, createdAt: new Date().toISOString() };
}

function addStep(workflow, step) {
  return { ...workflow, steps: [...workflow.steps, step] };
}

function removeStep(workflow, index) {
  const steps = workflow.steps.filter((_, i) => i !== index);
  return { ...workflow, steps };
}

function applyWorkflow(sessions, workflow) {
  return workflow.steps.reduce((acc, step) => {
    if (typeof step.fn === 'function') {
      return step.fn(acc);
    }
    return acc;
  }, sessions);
}

function findWorkflowByName(workflows, name) {
  return workflows.find(w => w.name === name) || null;
}

function listWorkflows(workflows) {
  return workflows.map(w => ({ name: w.name, steps: w.steps.length, createdAt: w.createdAt }));
}

function removeWorkflow(workflows, name) {
  return workflows.filter(w => w.name !== name);
}

module.exports = { createWorkflow, addStep, removeStep, applyWorkflow, findWorkflowByName, listWorkflows, removeWorkflow };
