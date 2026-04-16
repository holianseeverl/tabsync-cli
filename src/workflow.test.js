const { createWorkflow, addStep, removeStep, applyWorkflow, findWorkflowByName, listWorkflows, removeWorkflow } = require('./workflow');

const mockSessions = [
  { id: '1', name: 'Alpha', tabs: [{ url: 'https://a.com' }], tags: [] },
  { id: '2', name: 'Beta', tabs: [{ url: 'https://b.com' },.com' }], tags: [] },
];

test('createWorkflow returns workflow object', () => {
  const wf = createWorkflow('my-flow');
  expect(wf.name).toBe('my-flow');
  expect(wf.steps).toEqual([]);
  expect(wf.createdAt).toBeDefined();
});

test('addStep appends step to workflow', () => {
  const wf = createWorkflow('flow');
  const step = { label: 'filter', fn: s => s };
  const updated = addStep(wf, step);
  expect(updated.steps).toHaveLength(1);
  expect(updated.steps[0].label).toBe('filter');
});

test('removeStep removes step by index', () => {
  let wf = createWorkflow('flow');
  wf = addStep(wf, { label: 'a', fn: s => s });
  wf = addStep(wf, { label: 'b', fn: s => s });
  const updated = removeStep(wf, 0);
  expect(updated.steps).toHaveLength(1);
  expect(updated.steps[0].label).toBe('b');
});

test('applyWorkflow runs steps in sequence', () => {
  const filterStep = { label: 'filter', fn: sessions => sessions.filter(s => s.name === 'Alpha') };
  const wf = addStep(createWorkflow('flow'), filterStep);
  const result = applyWorkflow(mockSessions, wf);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('Alpha');
});

test('findWorkflowByName returns correct workflow', () => {
  const workflows = [createWorkflow('one'), createWorkflow('two')];
  expect(findWorkflowByName(workflows, 'two').name).toBe('two');
  expect(findWorkflowByName(workflows, 'nope')).toBeNull();
});

test('listWorkflows returns summary', () => {
  const wf = addStep(createWorkflow('flow'), { label: 'x', fn: s => s });
  const list = listWorkflows([wf]);
  expect(list[0].name).toBe('flow');
  expect(list[0].steps).toBe(1);
});

test('removeWorkflow removes by name', () => {
  const workflows = [createWorkflow('a'), createWorkflow('b')];
  const result = removeWorkflow(workflows, 'a');
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe('b');
});
