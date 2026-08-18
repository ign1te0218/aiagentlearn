(function () {
  const foundation = window.FOUNDATION_COURSE;
  const replacedModuleIds = new Set(['orientation-ts', 'node-foundation', 'python-foundation']);
  const mainPhase = '岗位主线阶段（W1-W16，共 16 周）';
  const mainModules = window.COURSE.modules
    .filter((module) => !replacedModuleIds.has(module.id))
    .map((module) => ({ ...module, phase: mainPhase }));

  window.COURSE = {
    ...window.COURSE,
    updatedAt: '2026-08-18',
    modules: [...foundation.modules, ...mainModules]
  };

  delete window.FOUNDATION_COURSE;
})();
