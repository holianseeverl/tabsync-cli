const { createWorkflow, addStep, removeStep, applyWorkflow, findWorkflowByName, removeWorkflow, listWorkflows } = require('./workflow');

describe('createWorkflow', () => {
  it('creates a workflow with name and empty steps', () => {
    const w = createWorkflow('my-flow');
    expect(w.name).toBe('my-flow');
    expect(w.steps).toEqual([]);
    expect(w.createdAt).toBeDefined();
  });

  it('creates a workflow with initial steps', () => {
    const w = createWorkflow('flow', ['sort:date', 'dedupe']);
    expect(w.steps).toHaveLength(2);
  });
});

describe('addStep', () => {
  it('adds a step to workflow', () => {
    const w = createWorkflow('flow');
    const updated = addStep(w, 'sort:name');
    expect(updated.steps).toContain('sort:name');
  });

  it('throws on invalid step', () => {
    const w = createWorkflow('flow');
    expect(() => addStep(w, '')).toThrow();
  });
});

describe('removeStep', () => {
  it('removes step by index', () => {
    const w = createWorkflow('flow', ['a', 'b', 'c']);
    const updated = removeStep(w, 1);
    expect(updated.steps).toEqual(['a', 'c']);
  });

  it('throws on invalid index', () => {
    const w = createWorkflow('flow', ['a']);
    expect(() => removeStep(w, 5)).toThrow();
  });
});

describe('applyWorkflow', () => {
  it('applies each step handler in order', () => {
    const sessions = [{ name: 'a' }, { name: 'b' }];
    const handlers = {
      reverse: (s) => [...s].reverse(),
    };
    const w = createWorkflow('flow', ['reverse']);
    const result = applyWorkflow(sessions, w, handlers);
    expect(result[0].name).toBe('b');
  });

  it('throws on unknown step', () => {
    const w = createWorkflow('flow', ['unknown']);
    expect(() => applyWorkflow([], w, {})).toThrow('Unknown workflow step: unknown');
  });
});

describe('findWorkflowByName', () => {
  it('finds workflow by name', () => {
    const workflows = [createWorkflow('alpha'), createWorkflow('beta')];
    expect(findWorkflowByName(workflows, 'beta').name).toBe('beta');
  });

  it('returns null if not found', () => {
    expect(findWorkflowByName([], 'x')).toBeNull();
  });
});

describe('listWorkflows', () => {
  it('returns summary list', () => {
    const workflows = [createWorkflow('w1', ['a', 'b'])];
    const list = listWorkflows(workflows);
    expect(list[0].stepCount).toBe(2);
    expect(list[0].name).toBe('w1');
  });
});
