(function () {
  const code = (language, lines) => ({
    language,
    content: Array.isArray(lines) ? lines.join('\n') : lines
  });

  const section = (title, paragraphs, bullets = [], sample = null, note = '') => ({
    title,
    paragraphs,
    bullets,
    code: sample,
    note
  });

  const step = (title, description, sample = null) => ({
    title,
    description,
    code: sample
  });

  const practice = (title, description, steps, expected, troubleshooting = []) => ({
    title,
    description,
    tasks: [],
    steps,
    expected,
    troubleshooting
  });

  const lesson = (config) => config;

  const resources = {
    tsInstall: { label: 'TypeScript：下载与安装', url: 'https://www.typescriptlang.org/download/' },
    tsConfig: { label: 'TSConfig Reference', url: 'https://www.typescriptlang.org/tsconfig/' },
    tsEveryday: { label: 'TypeScript Everyday Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
    tsObjects: { label: 'TypeScript Object Types', url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html' },
    tsFunctions: { label: 'TypeScript More on Functions', url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html' },
    tsNarrowing: { label: 'TypeScript Narrowing', url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' },
    tsGenerics: { label: 'TypeScript Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' },
    tsModules: { label: 'TypeScript Modules', url: 'https://www.typescriptlang.org/docs/handbook/2/modules.html' },
    tsUtility: { label: 'TypeScript Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html' },
    zod: { label: 'Zod Documentation', url: 'https://zod.dev/' },
    nodeIntro: { label: 'Node.js Introduction', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' },
    nodeNpm: { label: 'Node.js package manager introduction', url: 'https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager' },
    nodeEsm: { label: 'Node.js ECMAScript modules', url: 'https://nodejs.org/api/esm.html' },
    nodeCjs: { label: 'Node.js CommonJS modules', url: 'https://nodejs.org/api/modules.html' },
    nodeLoop: { label: 'Node.js Event Loop', url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick' },
    nodeBlocking: { label: 'Node.js: Blocking vs Non-Blocking', url: 'https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking' },
    nodeEvents: { label: 'Node.js Events API', url: 'https://nodejs.org/api/events.html' },
    nodeFs: { label: 'Node.js File system API', url: 'https://nodejs.org/api/fs.html' },
    nodePath: { label: 'Node.js Path API', url: 'https://nodejs.org/api/path.html' },
    nodeBuffer: { label: 'Node.js Buffer API', url: 'https://nodejs.org/api/buffer.html' },
    nodeStream: { label: 'Node.js Stream API', url: 'https://nodejs.org/api/stream.html' },
    nodeHttp: { label: 'Node.js HTTP API', url: 'https://nodejs.org/api/http.html' },
    nodeProcess: { label: 'Node.js Process API', url: 'https://nodejs.org/api/process.html' },
    pythonTutorial: { label: 'Python 3 中文教程', url: 'https://docs.python.org/zh-cn/3/tutorial/' },
    pythonVenv: { label: 'Python 虚拟环境和包', url: 'https://docs.python.org/zh-cn/3/tutorial/venv.html' },
    pythonFlow: { label: 'Python 流程控制', url: 'https://docs.python.org/zh-cn/3/tutorial/controlflow.html' },
    pythonData: { label: 'Python 数据结构', url: 'https://docs.python.org/zh-cn/3/tutorial/datastructures.html' },
    pythonTyping: { label: 'Python typing', url: 'https://docs.python.org/zh-cn/3/library/typing.html' },
    pythonModules: { label: 'Python 模块', url: 'https://docs.python.org/zh-cn/3/tutorial/modules.html' },
    pythonErrors: { label: 'Python 错误和异常', url: 'https://docs.python.org/zh-cn/3/tutorial/errors.html' },
    pythonPathlib: { label: 'Python pathlib', url: 'https://docs.python.org/zh-cn/3/library/pathlib.html' },
    pythonDataclass: { label: 'Python dataclasses', url: 'https://docs.python.org/zh-cn/3/library/dataclasses.html' },
    pythonAsyncio: { label: 'Python asyncio', url: 'https://docs.python.org/zh-cn/3/library/asyncio.html' },
    fastapi: { label: 'FastAPI Documentation', url: 'https://fastapi.tiangolo.com/' }
  };

  const foundationPhase = '基础预备阶段（F1-F8，共 8 周）';

  window.FOUNDATION_COURSE = {
    code,
    section,
    step,
    practice,
    lesson,
    resources,
    phase: foundationPhase,
    modules: [
      {
        id: 'foundation-guide',
        title: '基础预备导学',
        icon: 'map',
        phase: foundationPhase,
        lessons: [
          lesson({
            id: 'start-here',
            week: '导学',
            title: '先打好三门基础，再进入 Agent 主线',
            duration: '60分钟',
            level: '零基础',
            summary: '明确 TypeScript、Node.js、Python 与后端数据基础的职责、八周节奏、练习方式和统一项目目录。',
            objectives: [
              '在导航中找到 F1-F8 的全部基础章节',
              '理解 TypeScript、Node.js、Python 在目标岗位中的不同职责',
              '建立可以持续 24 周使用的本地练习仓库'
            ],
            sections: [
              section(
                '为什么三门都要学，但深度不同',
                [
                  'TypeScript 是主开发语言，用来写 AI 应用的前端、Node.js 后端、工具调用和 Agent 工作流。Node.js 不是另一门语言，而是 JavaScript/TypeScript 的服务端运行时；需要补齐浏览器前端不常接触的文件、网络、进程、事件循环和服务生命周期。',
                  'Python 在 AI 生态中覆盖文档处理、数据实验、评测和大量 SDK。转型阶段不要求用 Python 训练模型，但必须能读懂示例、编写可靠脚本，并能用 FastAPI 暴露一个小服务。'
                ],
                [
                  'F1-F2：TypeScript，每周 8-10 小时，目标是类型建模与工程化',
                  'F3-F4：Node.js，每周 9-11 小时，目标是理解运行时并写出原生 HTTP 服务',
                  'F5-F6：Python，每周 8-10 小时，目标是完成文档处理器与 FastAPI 接口',
                  'F7-F8：SQL/PostgreSQL、Redis、鉴权与测试，每周 9-11 小时，补齐 W1-W4 的后端前置'
                ],
                null,
                '学习顺序固定为 TypeScript -> Node.js -> Python。每章先运行示例，再完成练习，最后按验收清单自测。'
              ),
              section(
                '统一练习目录与提交节奏',
                [
                  '所有基础练习放在同一个仓库，按语言和章节拆分。每个章节目录至少包含 README、源码和你实际运行后的结果记录。这样进入岗位主线时，可以直接复用已验证的代码。',
                  '不要只保存截图。错误、命令、输入和输出都应保留为文本，后续排查环境或版本差异时才有依据。'
                ],
                ['每章一个目录，不在桌面散落 demo 文件', '每完成一章至少提交一次', 'README 写清启动命令、预期输出和遇到的问题'],
                code('text', [
                  'agent-learning/',
                  '  foundations/',
                  '    typescript/f1-01-setup/',
                  '    nodejs/f3-03-event-loop/',
                  '    python/f5-01-environment/',
                  '    backend/f7-01-sql/',
                  '  apps/',
                  '  docs/learning-log.md'
                ])
              ),
              section(
                '什么叫真正完成一章',
                [
                  '“看懂了”不能作为验收。你需要关闭教程后重新写出核心代码，能够预测输出，并能解释一个错误案例。练习中的预期结果是最低标准，不是可选项。',
                  '基础阶段不追求代码量，而是追求可解释性。尤其是事件循环、类型收窄、异步异常和 Python 可变对象，必须通过实验验证直觉。'
                ],
                ['能独立运行', '能修改输入并预测结果', '能解释报错原因', '能为关键行为补一个自动化测试或断言']
              )
            ],
            practice: practice(
              '创建八周基础学习仓库',
              '从空目录开始完成版本检查、目录初始化和学习日志。后续所有 Demo 都放入这个仓库。',
              [
                step('检查运行环境', '在 PowerShell 中执行以下命令，把实际输出记录到 `docs/learning-log.md`。', code('powershell', [
                  'node --version',
                  'npm --version',
                  'python --version  # 要求 3.12+',
                  'git --version'
                ])),
                step('创建目录', '新建统一仓库与三门语言的基础目录。', code('powershell', [
                  'mkdir agent-learning',
                  'cd agent-learning',
                  'mkdir foundations, apps, docs',
                  'mkdir foundations/typescript, foundations/nodejs, foundations/python',
                  'git init'
                ])),
                step('建立学习日志', '创建 `docs/learning-log.md`，每章按同一格式记录目标、命令、结果和问题。', code('markdown', [
                  '# 学习日志',
                  '',
                  '## F1-01 TypeScript 环境',
                  '- 目标：',
                  '- 实际命令：',
                  '- 运行结果：',
                  '- 遇到的问题：',
                  '- 我的解释：'
                ])),
                step('完成首个提交', '确认目录与日志正确后提交，提交信息说明这是基础阶段初始化。', code('powershell', [
                  'git add .',
                  'git commit -m "chore: initialize foundation learning workspace"'
                ]))
              ],
              ['能够从仓库根目录找到三门语言的练习目录', '学习日志包含真实版本号', 'Git 工作区干净且存在首个提交'],
              ['系统 Node.js 低于 20 时，安装 Node.js 24 LTS 后重新打开终端', '课程统一要求 Python 3.12+；Windows 上若 `python` 不可用，尝试 `py --version` 并在后续命令中使用 `py`']
            ),
            acceptance: ['能说明三门技术各自承担什么职责', '能解释为什么先基础后框架', '统一练习仓库可用'],
            resources: [resources.tsInstall, resources.nodeIntro, resources.pythonTutorial]
          })
        ]
      }
    ]
  };
})();
