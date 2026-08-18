(function () {
  const section = (title, paragraphs, bullets = [], code = null, note = '') => ({
    title,
    paragraphs,
    bullets,
    code,
    note
  });

  const lesson = ({
    id,
    week,
    title,
    duration,
    level,
    summary,
    objectives,
    sections,
    practice,
    acceptance,
    resources
  }) => ({
    id,
    week,
    title,
    duration,
    level,
    summary,
    objectives,
    sections,
    practice,
    acceptance,
    resources
  });

  const resources = {
    tsEveryday: { label: 'TypeScript Everyday Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
    tsFunctions: { label: 'TypeScript More on Functions', url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html' },
    tsNarrowing: { label: 'TypeScript Narrowing', url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' },
    tsGenerics: { label: 'TypeScript Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html' },
    tsConfig: { label: 'TSConfig Reference', url: 'https://www.typescriptlang.org/tsconfig/' },
    zod: { label: 'Zod Documentation', url: 'https://zod.dev/' },
    nodeIntro: { label: 'Introduction to Node.js', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' },
    nodeLoop: { label: 'Node.js Event Loop', url: 'https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick' },
    nodeFiles: { label: 'Reading files with Node.js', url: 'https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs' },
    python: { label: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/' },
    pythonFlow: { label: 'Python Control Flow', url: 'https://docs.python.org/3/tutorial/controlflow.html' },
    pythonData: { label: 'Python Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
    fastapi: { label: 'FastAPI Documentation', url: 'https://fastapi.tiangolo.com/' },
    nest: { label: 'NestJS Documentation', url: 'https://docs.nestjs.com/' },
    sse: { label: 'MDN Server-sent events', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events' },
    postgres: { label: 'PostgreSQL Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
    redis: { label: 'Redis Documentation', url: 'https://redis.io/docs/latest/' },
    vitest: { label: 'Vitest Guide', url: 'https://vitest.dev/guide/' },
    docker: { label: 'Docker Get Started', url: 'https://docs.docker.com/get-started/' },
    playwright: { label: 'Playwright Documentation', url: 'https://playwright.dev/docs/intro' },
    aiSdk: { label: 'Vercel AI SDK', url: 'https://ai-sdk.dev/docs/introduction' },
    aiStructured: { label: 'AI SDK Structured Data', url: 'https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data' },
    aiTools: { label: 'AI SDK Tool Calling', url: 'https://ai-sdk.dev/cookbook/node/call-tools' },
    aiErrors: { label: 'AI SDK Error Handling', url: 'https://ai-sdk.dev/docs/ai-sdk-core/error-handling' },
    aiEmbeddings: { label: 'AI SDK Embeddings', url: 'https://ai-sdk.dev/docs/ai-sdk-core/embeddings' },
    langchain: { label: 'LangChain.js Overview', url: 'https://docs.langchain.com/oss/javascript/langchain/overview' },
    pgvector: { label: 'pgvector', url: 'https://github.com/pgvector/pgvector' },
    rag: { label: 'AI SDK Node.js RAG', url: 'https://ai-sdk.dev/cookbook/node/retrieval-augmented-generation' },
    ragEval: { label: 'LangSmith RAG Evaluation', url: 'https://docs.langchain.com/langsmith/evaluate-rag-tutorial' },
    phoenix: { label: 'Arize Phoenix', url: 'https://arize.com/docs/phoenix' },
    langgraph: { label: 'LangGraph Overview', url: 'https://docs.langchain.com/oss/javascript/langgraph/overview' },
    workflows: { label: 'LangGraph Workflows and Agents', url: 'https://docs.langchain.com/oss/javascript/langgraph/workflows-agents' },
    persistence: { label: 'LangGraph Persistence', url: 'https://docs.langchain.com/oss/javascript/langgraph/persistence' },
    interrupts: { label: 'LangGraph Interrupts', url: 'https://docs.langchain.com/oss/javascript/langgraph/interrupts' },
    mcp: { label: 'MCP 2026-07-28 入门', url: 'https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro' },
    mcpSdk: { label: 'MCP SDK', url: 'https://modelcontextprotocol.io/docs/2026-07-28/sdk' },
    mcpSecurity: { label: 'MCP 安全最佳实践', url: 'https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices' },
    owasp: { label: 'OWASP LLM Top 10', url: 'https://genai.owasp.org/llm-top-10/' },
    otel: { label: 'OpenTelemetry JavaScript', url: 'https://opentelemetry.io/docs/languages/js/' },
    langsmithEval: { label: 'LangSmith Evaluation', url: 'https://docs.langchain.com/langsmith/evaluation' }
  };

  window.COURSE = {
    title: '前端开发转型智能体应用工程师',
    updatedAt: '2026-08-18',
    modules: [
      {
        id: 'orientation-ts',
        title: '起步与 TypeScript',
        icon: 'braces',
        lessons: [
          lesson({
            id: 'start-here',
            week: '导学',
            title: '从零开始的 24 周学习路线',
            duration: '35分钟',
            level: '起步',
            summary: '了解课程边界、学习顺序、环境要求和最终作品，避免同时学习过多框架。',
            objectives: [
              '理解 F1-F8 基础预备与 W1-W16 岗位主线的关系',
              '建立每周“学习、编码、测试、复盘”的固定节奏',
              '明确什么是合格的智能体应用作品集'
            ],
            sections: [
              section(
                '为什么先学三门基础',
                [
                  'TypeScript、Node.js 和 Python 在这条路线中承担不同职责。TypeScript 是主语言；Node.js 是服务端运行时；Python 用来阅读和编写文档处理、评测及辅助服务。',
                  '三者不需要达到相同深度。你需要熟练使用 TypeScript 和 Node.js，Python只要求能读、能改、能写小型服务。'
                ],
                [
                  'TypeScript：类型建模、异步代码、运行时校验和工程配置',
                  'Node.js：HTTP、流、事件循环、文件系统、错误处理和服务生命周期',
                  'Python：数据结构、函数、异常、文件、虚拟环境、类型提示和FastAPI'
                ],
                null,
                '不要一开始学习模型训练、CUDA或多个Agent框架。目标是先交付可靠的大模型应用。'
              ),
              section(
                '学习环境与版本',
                [
                  '建议安装 Node.js 24 LTS、Git、VS Code 和 Python 3.12+。项目依赖应由版本管理文件记录，密钥只能放在本地环境变量中。',
                  '每一章都要产生可以运行的代码提交。看完文档但没有练习，不算完成章节。'
                ],
                [
                  '检查 node、npm、python 和 git 版本',
                  '创建统一的 learning-agent-app 仓库',
                  '准备 apps/web、apps/api、services/python 和 docs 目录'
                ],
                {
                  language: 'text',
                  content: [
                    'learning-agent-app/',
                    '  apps/web/          # React 或 Vue 前端',
                    '  apps/api/          # TypeScript/Node.js API',
                    '  services/python/   # Python 辅助服务',
                    '  evals/             # 固定评测集与结果',
                    '  docs/              # 架构、决策与复盘'
                  ].join('\n')
                }
              ),
              section(
                '完成标准',
                [
                  '最终作品不是聊天壳，而是一个售后工单智能体：包含知识库引用、业务工具、退款审批、评测、审计和部署。',
                  '每个阶段都向同一个项目增加能力，避免做一堆彼此无关的Demo。'
                ],
                [
                  '能运行：陌生人按README可以启动',
                  '能衡量：有任务成功率、延迟和成本数据',
                  '能解释：可以说明不用Agent的部分和失败方案',
                  '能控制：写操作有鉴权、校验、幂等和审批'
                ]
              )
            ],
            practice: {
              title: '建立学习仓库',
              description: '创建课程仓库和学习日志，记录每周目标、代码、遇到的问题和验收结果。',
              tasks: ['建立目录结构', '添加 README 和 24 周里程碑', '记录当前环境版本', '完成第一次 Git 提交']
            },
            acceptance: ['仓库可以正常提交代码', 'README写明学习目标和最终项目', '知道每种语言在路线中的职责'],
            resources: [resources.tsEveryday, resources.nodeIntro, resources.python]
          }),
          lesson({
            id: 'ts-everyday-types',
            week: 'F1',
            title: 'TypeScript基本类型与对象建模',
            duration: '3小时',
            level: '基础',
            summary: '从JavaScript迁移到TypeScript，掌握基本类型、对象、接口、类型别名和可选属性。',
            objectives: ['配置最小TypeScript项目', '为真实业务对象建立类型', '避免any扩散'],
            sections: [
              section(
                '类型注解与类型推断',
                [
                  'TypeScript会根据初始值推断类型。能推断时不必重复注解；函数边界、公共接口和复杂对象应显式声明。',
                  'unknown表示暂时未知但必须先检查，any则会关闭类型检查。处理API响应时优先使用unknown。'
                ],
                ['string、number、boolean和null/undefined', '数组、元组与只读数组', 'unknown、any和never的边界'],
                {
                  language: 'typescript',
                  content: [
                    'type UserRole = "student" | "mentor";',
                    '',
                    'interface User {',
                    '  id: string;',
                    '  name: string;',
                    '  role: UserRole;',
                    '  avatarUrl?: string;',
                    '  readonly createdAt: string;',
                    '}',
                    '',
                    'const currentUser: User = {',
                    '  id: "u_001",',
                    '  name: "Lin",',
                    '  role: "student",',
                    '  createdAt: new Date().toISOString()',
                    '};'
                  ].join('\n')
                }
              ),
              section(
                'interface与type',
                [
                  'interface适合描述可扩展的对象契约，type适合联合类型、映射类型和组合类型。不要将选择变成教条，关键是让领域模型清晰。',
                  '可选属性表示字段可能不存在，不代表可以把任何值写进去。使用strict模式可以发现更多空值问题。'
                ],
                ['对象契约使用interface', '联合类型和组合类型使用type', '开启strict、noUncheckedIndexedAccess等检查']
              )
            ],
            practice: {
              title: '给待办应用加类型',
              description: '为用户、任务、筛选条件和接口响应建立类型，并删除所有any。',
              tasks: ['定义TaskStatus联合类型', '定义Task和User接口', '实现类型安全的筛选函数', '故意制造3个错误并观察编译器提示']
            },
            acceptance: ['项目使用strict模式', '不存在无必要的any', '能解释unknown为什么更安全'],
            resources: [resources.tsEveryday, resources.tsConfig]
          }),
          lesson({
            id: 'ts-functions-objects',
            week: 'F1',
            title: '函数、对象与异步返回值',
            duration: '3小时',
            level: '基础',
            summary: '掌握函数参数、重载、对象组合、Promise返回类型和API边界建模。',
            objectives: ['正确声明函数输入输出', '为异步API建模', '理解可选参数和默认参数'],
            sections: [
              section(
                '函数是重要的类型边界',
                [
                  '函数参数和返回值决定数据如何在系统中流动。服务层公共函数应显式标注返回类型，防止实现变化意外修改接口。',
                  '回调函数的参数数量要按调用方约定声明；不要为了“兼容”滥用可选参数。'
                ],
                ['普通参数、可选参数和默认参数', '函数类型与回调', 'void、never和Promise<T>'],
                {
                  language: 'typescript',
                  content: [
                    'type ApiResult<T> =',
                    '  | { ok: true; data: T }',
                    '  | { ok: false; error: string; retryable: boolean };',
                    '',
                    'async function getUser(id: string): Promise<ApiResult<User>> {',
                    '  try {',
                    '    const response = await fetch(`/api/users/${id}`);',
                    '    if (!response.ok) throw new Error(`HTTP ${response.status}`);',
                    '    return { ok: true, data: await response.json() as User };',
                    '  } catch (error) {',
                    '    return { ok: false, error: String(error), retryable: true };',
                    '  }',
                    '}'
                  ].join('\n')
                }
              ),
              section(
                '组合而不是复制类型',
                [
                  '交叉类型、Pick、Omit和Partial可以从已有领域类型派生表单或更新类型。派生应保持业务语义，不能为了少写几行代码制造难懂类型。'
                ],
                ['Pick选择字段', 'Omit排除字段', 'Partial用于补丁而不是完整对象', 'Readonly保护不可变数据']
              )
            ],
            practice: {
              title: '实现类型安全的API Client',
              description: '实现get、post和分页查询函数，统一成功与失败结果。',
              tasks: ['定义ApiResult<T>', '定义Pagination<T>', '处理网络错误和HTTP错误', '调用方使用if分支完成类型收窄']
            },
            acceptance: ['异步函数返回Promise<T>', '调用方无需类型断言即可访问结果', '错误结果包含是否可重试'],
            resources: [resources.tsFunctions, resources.tsEveryday]
          }),
          lesson({
            id: 'ts-narrowing-generics',
            week: 'F2',
            title: '类型收窄、联合类型与泛型',
            duration: '4小时',
            level: '进阶',
            summary: '用可辨识联合表达有限状态，用泛型复用结构而不牺牲类型安全。',
            objectives: ['使用控制流完成类型收窄', '设计可辨识联合', '编写带约束的泛型函数'],
            sections: [
              section(
                '用联合类型表达状态机',
                [
                  '加载状态不是几个互不相关的布尔值。可辨识联合用一个稳定字段区分状态，编译器会在分支内自动收窄。',
                  '这类建模方式会直接用于后续的流式消息、工具调用和Agent节点状态。'
                ],
                ['typeof、in和instanceof收窄', '自定义类型保护', '穷尽检查与never'],
                {
                  language: 'typescript',
                  content: [
                    'type LoadState<T> =',
                    '  | { status: "idle" }',
                    '  | { status: "loading"; startedAt: number }',
                    '  | { status: "success"; data: T }',
                    '  | { status: "error"; message: string };',
                    '',
                    'function renderState<T>(state: LoadState<T>): string {',
                    '  switch (state.status) {',
                    '    case "idle": return "等待开始";',
                    '    case "loading": return `已等待 ${Date.now() - state.startedAt}ms`;',
                    '    case "success": return JSON.stringify(state.data);',
                    '    case "error": return state.message;',
                    '  }',
                    '}'
                  ].join('\n')
                }
              ),
              section(
                '泛型约束',
                [
                  '泛型表示调用时才确定的类型。约束用于声明泛型必须具备哪些能力，例如必须包含id字段。',
                  '如果一个泛型只出现一次，通常没有建立输入与输出关系，可能不需要泛型。'
                ],
                ['泛型函数和接口', 'extends约束', 'keyof与索引访问类型', '常用工具类型']
              )
            ],
            practice: {
              title: '建立消息状态模型',
              description: '为聊天消息建立text、tool-call、tool-result和error四种状态。',
              tasks: ['定义可辨识联合', '实现渲染函数', '增加穷尽检查', '实现泛型分页结果']
            },
            acceptance: ['所有状态分支都有明确数据', '新增状态时编译器能提示未处理分支', '泛型建立了输入输出关系'],
            resources: [resources.tsNarrowing, resources.tsGenerics]
          }),
          lesson({
            id: 'ts-project-validation',
            week: 'F2',
            title: 'TS工程配置与运行时校验',
            duration: '3小时',
            level: '进阶',
            summary: '理解TypeScript类型只存在于编译期，并用Zod校验网络和文件输入。',
            objectives: ['配置tsconfig严格规则', '理解编译期与运行时边界', '用Zod生成可靠输入类型'],
            sections: [
              section(
                '类型不会替你校验API响应',
                [
                  'TypeScript在编译后会擦除类型。把response.json()断言成User不会验证真实数据，只是告诉编译器“相信我”。',
                  '来自网络、数据库、文件和模型的输入都属于不可信边界，需要运行时Schema校验。'
                ],
                ['strict模式', '输入边界与可信数据', 'Schema解析和友好错误'],
                {
                  language: 'typescript',
                  content: [
                    'import { z } from "zod";',
                    '',
                    'const UserSchema = z.object({',
                    '  id: z.string().min(1),',
                    '  name: z.string().min(1),',
                    '  role: z.enum(["student", "mentor"])',
                    '});',
                    '',
                    'type User = z.infer<typeof UserSchema>;',
                    'const user = UserSchema.parse(await response.json());'
                  ].join('\n')
                }
              ),
              section(
                '推荐工程规则',
                ['应用项目应固定模块系统、目标运行时和严格检查。不要复制一份陌生tsconfig后不理解其中选项。'],
                ['strict', 'noUncheckedIndexedAccess', 'exactOptionalPropertyTypes', 'useUnknownInCatchVariables']
              )
            ],
            practice: {
              title: '校验不可信数据',
              description: '为API用户响应、分页参数和环境变量建立Zod Schema。',
              tasks: ['校验成功数据', '输出字段级错误', '为Schema推导TypeScript类型', '加入3个失败测试']
            },
            acceptance: ['不使用as绕过外部数据校验', '环境变量缺失时启动失败并说明原因', '失败测试覆盖空值和错误枚举'],
            resources: [resources.tsConfig, resources.zod]
          })
        ]
      },
      {
        id: 'node-foundation',
        title: 'Node.js 基础',
        icon: 'server',
        lessons: [
          lesson({
            id: 'node-runtime-modules',
            week: 'F3',
            title: '运行时、模块与项目结构',
            duration: '3小时',
            level: '基础',
            summary: '理解Node.js与浏览器的差异，掌握ESM、npm脚本、环境变量和进程信息。',
            objectives: ['使用Node.js 24 LTS', '理解ESM与CommonJS', '建立可维护的服务目录'],
            sections: [
              section(
                'Node.js不是另一门语言',
                [
                  'Node.js是JavaScript运行时。它没有浏览器DOM，但提供文件、网络、进程、流和操作系统能力。',
                  '服务端代码持续运行，需要关注进程退出、未处理异常、连接和资源释放。'
                ],
                ['globalThis与浏览器全局对象', 'process与环境变量', 'package.json和npm scripts', 'ESM导入导出'],
                {
                  language: 'javascript',
                  content: [
                    'import process from "node:process";',
                    '',
                    'const port = Number(process.env.PORT || 3000);',
                    'if (!Number.isInteger(port)) {',
                    '  throw new Error("PORT必须是整数");',
                    '}',
                    '',
                    'console.log({ node: process.version, port });'
                  ].join('\n')
                }
              ),
              section(
                '模块和依赖边界',
                ['业务逻辑不应直接读取process.env或调用数据库。将配置、外部服务和存储放在边界层，核心函数更容易测试。'],
                ['src/config', 'src/domain', 'src/services', 'src/adapters', 'test']
              )
            ],
            practice: {
              title: '建立零依赖Node项目',
              description: '创建ESM项目，读取并验证端口、日志级别和运行环境。',
              tasks: ['配置package.json', '建立src目录', '实现配置解析', '处理SIGINT优雅退出']
            },
            acceptance: ['node版本不低于20', '项目使用统一模块系统', '缺少必需配置时给出明确错误'],
            resources: [resources.nodeIntro]
          }),
          lesson({
            id: 'node-async-event-loop',
            week: 'F3',
            title: '异步编程、事件循环与取消',
            duration: '4小时',
            level: '核心',
            summary: '掌握Promise并发、事件循环、超时和AbortController，为模型流式调用打基础。',
            objectives: ['区分并发与串行', '处理异步错误', '为网络请求增加取消能力'],
            sections: [
              section(
                '不要阻塞事件循环',
                [
                  'Node.js依赖事件循环处理大量I/O。同步读取大文件或进行长时间CPU计算会阻塞所有请求。',
                  'Promise.all适合相互独立且都必须成功的任务；Promise.allSettled适合收集每个任务的结果。'
                ],
                ['微任务与定时器', '串行、并行和并发上限', '未处理Promise拒绝'],
                {
                  language: 'javascript',
                  content: [
                    'async function fetchWithTimeout(url, timeoutMs = 3000) {',
                    '  const controller = new AbortController();',
                    '  const timer = setTimeout(() => controller.abort(), timeoutMs);',
                    '  try {',
                    '    const response = await fetch(url, { signal: controller.signal });',
                    '    if (!response.ok) throw new Error(`HTTP ${response.status}`);',
                    '    return await response.json();',
                    '  } finally {',
                    '    clearTimeout(timer);',
                    '  }',
                    '}'
                  ].join('\n')
                }
              ),
              section(
                '重试不是无条件再调用一次',
                [
                  '只有暂时性错误和幂等操作适合自动重试。退款、创建订单等写操作必须有幂等键，不能盲目重试。'
                ],
                ['指数退避与随机抖动', '可重试错误分类', '超时预算', 'AbortSignal向下传递']
              )
            ],
            practice: {
              title: '实现可靠HTTP Client',
              description: '实现超时、取消、最多两次重试和错误分类。',
              tasks: ['模拟超时', '模拟500与400', '只重试可恢复错误', '确保所有定时器被清理']
            },
            acceptance: ['请求可以主动取消', '400错误不会重试', '失败后没有悬空定时器或未处理拒绝'],
            resources: [resources.nodeLoop]
          }),
          lesson({
            id: 'node-files-streams-http',
            week: 'F3',
            title: '文件、Buffer、Stream与HTTP',
            duration: '4小时',
            level: '核心',
            summary: '处理文件和流式响应，理解背压、MIME类型和HTTP服务生命周期。',
            objectives: ['安全读取文件', '理解Buffer和Stream', '构建JSON与流式HTTP接口'],
            sections: [
              section(
                '大文件应该使用流',
                [
                  'readFile会一次性把文件加载到内存。处理文档、日志和模型流式输出时，应优先使用Stream。',
                  '背压意味着消费者处理不过来时，生产者要暂缓写入。pipe可以自动协调常见背压。'
                ],
                ['path.resolve防止路径穿越', 'Buffer与文本编码', 'Readable、Writable和Transform'],
                {
                  language: 'javascript',
                  content: [
                    'import { createReadStream } from "node:fs";',
                    'import http from "node:http";',
                    '',
                    'http.createServer((req, res) => {',
                    '  if (req.url === "/guide") {',
                    '    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });',
                    '    createReadStream("./guide.txt").pipe(res);',
                    '    return;',
                    '  }',
                    '  res.writeHead(404).end("Not found");',
                    '}).listen(3000);'
                  ].join('\n')
                }
              ),
              section(
                'HTTP接口基础',
                ['接口必须明确方法、路径、状态码、内容类型和错误结构。流式接口还要检测客户端断开并取消上游任务。'],
                ['GET与POST语义', '状态码和统一错误', 'SSE基础', '关闭事件与资源释放']
              )
            ],
            practice: {
              title: '零框架文档服务',
              description: '提供静态文件、JSON元数据和逐行流式读取三个接口。',
              tasks: ['校验访问路径', '设置正确MIME', '大文件使用Stream', '客户端断开后停止读取']
            },
            acceptance: ['路径穿越请求被拒绝', '大文件不会一次性读入内存', '断开连接后文件流被销毁'],
            resources: [resources.nodeFiles, resources.sse]
          })
        ]
      },
      {
        id: 'python-foundation',
        title: 'Python 基础',
        icon: 'file-code-2',
        lessons: [
          lesson({
            id: 'python-syntax-data',
            week: 'F4',
            title: '语法、控制流与数据结构',
            duration: '4小时',
            level: '基础',
            summary: '掌握Python缩进、变量、集合类型、条件、循环和推导式，能够阅读常见AI示例。',
            objectives: ['理解Python代码结构', '熟练操作列表和字典', '编写清晰的数据转换代码'],
            sections: [
              section(
                'Python代码块由缩进决定',
                [
                  'Python没有花括号包围代码块，缩进本身就是语法。统一使用4个空格，不要混用Tab。',
                  '变量无需声明类型，但可以添加类型提示帮助编辑器和读者理解。'
                ],
                ['数字、字符串、布尔值和None', 'list、tuple、dict和set', 'if、for、while和match'],
                {
                  language: 'python',
                  content: [
                    'documents = [',
                    '    {"title": "退款规则", "pages": 8},',
                    '    {"title": "物流说明", "pages": 5},',
                    ']',
                    '',
                    'large_documents = [',
                    '    item["title"]',
                    '    for item in documents',
                    '    if item["pages"] >= 6',
                    ']',
                    '',
                    'print(large_documents)'
                  ].join('\n')
                }
              ),
              section(
                '选择合适的数据结构',
                ['列表有顺序且可重复；元组适合不可变记录；字典按键取值；集合用于去重和成员判断。'],
                ['切片与解包', '字典get与遍历', '列表/字典推导式', '集合去重']
              )
            ],
            practice: {
              title: '文档清单处理',
              description: '读取一组文档元数据，完成筛选、排序、分组和统计。',
              tasks: ['按类型分组', '统计总页数', '输出超过阈值的文档', '使用集合提取标签']
            },
            acceptance: ['代码符合4空格缩进', '能解释四种集合类型差异', '没有用复杂循环替代简单推导式'],
            resources: [resources.python, resources.pythonData]
          }),
          lesson({
            id: 'python-functions-errors',
            week: 'F4',
            title: '函数、模块、异常与类型提示',
            duration: '4小时',
            level: '基础',
            summary: '组织可复用函数，处理异常，使用虚拟环境、模块和类型提示。',
            objectives: ['编写职责单一的函数', '捕获具体异常', '管理虚拟环境和依赖'],
            sections: [
              section(
                '函数和异常边界',
                [
                  '函数应返回稳定的数据结构，不要在深层函数中随意打印或退出进程。捕获异常时只捕获可以处理的具体类型。',
                  'finally适合释放文件和连接；with上下文管理器通常更简洁。'
                ],
                ['位置与关键字参数', '默认值陷阱', 'try/except/else/finally', '自定义异常'],
                {
                  language: 'python',
                  content: [
                    'from dataclasses import dataclass',
                    'from pathlib import Path',
                    '',
                    '@dataclass',
                    'class Document:',
                    '    path: Path',
                    '    content: str',
                    '',
                    'def load_document(path: Path) -> Document:',
                    '    if not path.exists():',
                    '        raise FileNotFoundError(path)',
                    '    return Document(path=path, content=path.read_text(encoding="utf-8"))'
                  ].join('\n')
                }
              ),
              section(
                '虚拟环境与包',
                ['每个Python项目使用独立虚拟环境，依赖写入requirements或pyproject。不要把全局Python环境当作项目环境。'],
                ['python -m venv .venv', 'pip安装与冻结依赖', '__init__.py与模块导入', 'dataclass与typing']
              )
            ],
            practice: {
              title: '可测试的文档加载器',
              description: '将文档处理脚本拆成模块，并定义Document数据类和异常。',
              tasks: ['创建.venv', '拆分loader与stats模块', '添加类型提示', '处理不存在和编码错误']
            },
            acceptance: ['可在全新虚拟环境安装运行', '异常信息包含文件路径', '函数参数和返回值有类型提示'],
            resources: [resources.pythonFlow, resources.python]
          }),
          lesson({
            id: 'python-files-async-fastapi',
            week: 'P4 / W4',
            title: '文件、异步与FastAPI入门',
            duration: '4小时',
            level: '进阶',
            summary: '把Python脚本封装为带校验和错误响应的HTTP辅助服务。',
            objectives: ['处理文本和JSON文件', '理解async/await基础', '创建FastAPI接口'],
            sections: [
              section(
                '同步与异步的选择',
                [
                  '网络、数据库等等待型任务适合异步；纯CPU计算不会因为async变快。不要在异步路由中调用长时间同步函数。',
                  'FastAPI使用Pydantic模型校验请求与响应，这与TypeScript中的Zod边界校验思路一致。'
                ],
                ['pathlib文件操作', 'json模块', 'async def和await', 'Pydantic模型'],
                {
                  language: 'python',
                  content: [
                    'from fastapi import FastAPI, HTTPException',
                    'from pydantic import BaseModel',
                    '',
                    'app = FastAPI()',
                    '',
                    'class ParseRequest(BaseModel):',
                    '    path: str',
                    '',
                    '@app.post("/parse")',
                    'async def parse_document(request: ParseRequest):',
                    '    try:',
                    '        document = load_document(Path(request.path))',
                    '        return {"characters": len(document.content)}',
                    '    except FileNotFoundError as error:',
                    '        raise HTTPException(status_code=404, detail=str(error))'
                  ].join('\n')
                }
              ),
              section(
                'Node与Python协作',
                ['Node服务负责用户接口和业务流程，Python服务负责文档解析或Python生态评测。两者通过稳定的HTTP契约通信。'],
                ['请求与响应Schema', '超时和重试', '健康检查', '错误码映射']
              )
            ],
            practice: {
              title: '文档解析API',
              description: '为文本和JSON文档提供上传、解析和统计接口。',
              tasks: ['定义请求模型', '返回结构化结果', '实现404和400错误', '从Node服务调用该接口']
            },
            acceptance: ['接口自动生成OpenAPI文档', '错误状态码正确', 'Node调用设置超时并处理失败'],
            resources: [resources.fastapi, resources.python]
          })
        ]
      },
      {
        id: 'backend-engineering',
        title: '服务端工程',
        icon: 'blocks',
        lessons: [
          lesson({
            id: 'w1-reliable-client',
            week: 'W1',
            title: '可靠的第三方API客户端',
            duration: '6小时',
            level: '岗位主线',
            summary: '在基础异步能力上实现超时预算、退避重试、熔断、错误映射和可观测日志。',
            objectives: ['区分可重试错误', '传播AbortSignal', '记录稳定的调用指标'],
            sections: [
              section('调用策略', ['大模型应用依赖多个外部API。每次调用都应有超时预算、取消信号、错误类型和调用标识。'], ['连接错误与业务错误', '指数退避与抖动', '总超时预算', '熔断与降级']),
              section('统一结果与日志', ['日志记录provider、model、duration、attempt和requestId，但不能记录密钥和敏感正文。'], ['结构化日志', '错误cause链', '敏感信息脱敏'])
            ],
            practice: { title: 'API聚合服务', description: '并行调用两个公开接口，设置不同超时并聚合结果。', tasks: ['实现AbortSignal传递', '实现最多2次重试', '允许部分成功', '记录P95延迟'] },
            acceptance: ['客户端断开会取消上游请求', '非幂等请求默认不重试', '日志可定位每次失败'],
            resources: [resources.nodeLoop, resources.tsFunctions]
          }),
          lesson({
            id: 'w2-nest-streaming',
            week: 'W2',
            title: 'NestJS、DTO与流式接口',
            duration: '6小时',
            level: '岗位主线',
            summary: '搭建模块化API，使用DTO校验输入，并正确处理SSE连接的建立与关闭。',
            objectives: ['理解Nest依赖注入', '使用DTO与Pipe校验', '管理流式连接生命周期'],
            sections: [
              section('模块和依赖注入', ['Controller只负责协议转换，Service承载用例，Adapter封装模型和数据库。'], ['Module、Controller、Provider', 'DTO和ValidationPipe', '全局异常过滤器']),
              section('SSE生命周期', ['SSE适合服务端持续推送文本事件。客户端断开时必须取消模型生成并关闭所有订阅。'], ['event与data字段', '心跳', '断开检测', '资源清理'], { language: 'typescript', content: ['@Sse("chat/:id")', 'stream(@Param("id") id: string): Observable<MessageEvent> {', '  return this.chatService.stream(id);', '}'].join('\n') })
            ],
            practice: { title: '流式聊天后端', description: '用NestJS提供创建会话、发送消息和SSE订阅接口。', tasks: ['建立ChatModule', '校验消息DTO', '实现SSE事件类型', '处理客户端取消'] },
            acceptance: ['非法DTO返回400', '断开后模型调用被取消', 'Controller不直接调用模型SDK'],
            resources: [resources.nest, resources.sse]
          }),
          lesson({
            id: 'w3-data-auth-tests',
            week: 'W3',
            title: '数据库、鉴权、缓存与测试',
            duration: '10小时',
            level: '岗位主线',
            summary: '为用户、会话、消息和调用记录建立数据模型，补齐鉴权、事务、限流与测试。',
            objectives: ['设计关系模型和索引', '建立身份与资源权限', '编写服务层和接口测试'],
            sections: [
              section('数据与事务', ['会话、消息和工具调用既要支持查询，也要保留审计顺序。涉及多表写入时使用事务。'], ['主键和外键', '组合索引', '事务边界', '软删除与审计']),
              section('鉴权和缓存', ['认证确认“你是谁”，授权确认“你能做什么”。Redis适合短期缓存和限流，不是永久事实来源。'], ['Session/JWT', '资源所有权', '缓存键设计', '滑动窗口限流']),
              section('测试金字塔', ['核心业务用单元测试，数据库与HTTP契约用集成测试，关键用户流程用少量E2E。'], ['固定时间与随机数', '测试数据隔离', '失败分支覆盖'])
            ],
            practice: { title: '会话与消息存储', description: '实现用户只能访问自己会话的CRUD和限流。', tasks: ['设计表结构', '添加索引', '实现资源授权', '编写越权和事务回滚测试'] },
            acceptance: ['越权访问返回403或404', '事务失败不会留下半条数据', '核心服务覆盖成功和失败路径'],
            resources: [resources.postgres, resources.redis, resources.vitest]
          }),
          lesson({
            id: 'w4-python-docker-e2e',
            week: 'W4',
            title: 'FastAPI协作、Docker与E2E',
            duration: '8小时',
            level: '岗位主线',
            summary: '将Node、Python和数据库组合为可重复启动的本地系统，并验证关键用户流程。',
            objectives: ['定义跨语言HTTP契约', '编写Dockerfile与Compose', '执行关键E2E流程'],
            sections: [
              section('服务边界', ['Node负责用户和业务流程，Python负责文档解析。接口必须版本化并返回稳定Schema。'], ['健康检查', '超时与重试', '错误码映射', '服务依赖']),
              section('容器化与测试', ['容器镜像要固定运行时版本并使用非root用户。Compose只用于本地编排，不应把密钥写进文件。'], ['多阶段构建', '环境变量', '健康检查', 'Playwright测试数据'])
            ],
            practice: { title: '一键启动开发环境', description: '用Compose启动Web、API、Python和PostgreSQL。', tasks: ['编写两个Dockerfile', '增加healthcheck', '实现上传文档E2E', '模拟Python服务不可用'] },
            acceptance: ['新环境一条命令启动', '服务异常有降级提示', 'E2E覆盖上传到查询闭环'],
            resources: [resources.fastapi, resources.docker, resources.playwright]
          })
        ]
      },
      {
        id: 'llm-applications',
        title: '大模型应用基础',
        icon: 'bot',
        lessons: [
          lesson({
            id: 'w5-model-streaming',
            week: 'W5',
            title: '模型API、流式UI与Provider抽象',
            duration: '6小时',
            level: '岗位主线',
            summary: '安全接入模型，处理流式事件、多模态消息、错误状态和模型切换。',
            objectives: ['密钥只保存在服务端', '建立统一消息模型', '在UI正确显示流式状态'],
            sections: [
              section('消息和流事件', ['消息不仅有文本，还可能包含图片、文件、工具调用和错误。前端状态必须能表达这些分段。'], ['system/user/assistant角色', '消息part', '开始/增量/结束事件', '取消与重试']),
              section('Provider抽象', ['业务代码依赖统一模型接口，厂商SDK放在适配层。记录model、tokens、latency和finishReason。'], ['密钥管理', '模型能力矩阵', '统一错误', '降级策略'])
            ],
            practice: { title: '可切换模型的聊天页', description: '接入一个国内模型，完成流式输出、取消和错误恢复。', tasks: ['服务端代理密钥', '渲染分段消息', '支持取消', '保存调用元数据'] },
            acceptance: ['浏览器看不到密钥', '切换模型不改业务层', '流式中断有明确状态'],
            resources: [resources.aiSdk, resources.aiErrors]
          }),
          lesson({
            id: 'w6-structured-tools',
            week: 'W6',
            title: '结构化输出与Tool Calling',
            duration: '9小时',
            level: '岗位主线',
            summary: '让模型负责意图和参数建议，让服务端负责Schema、权限和真实执行。',
            objectives: ['用Schema约束输出', '区分读工具和写工具', '验证工具参数与结果'],
            sections: [
              section('结构化输出', ['不要从自然语言中截取JSON。使用Schema生成或校验结构化结果，并设计无法解析时的降级。'], ['JSON Schema', 'Zod', '重试与修复', '枚举和边界值']),
              section('工具执行边界', ['模型没有权限直接执行退款。它只能提出调用；服务端校验身份、权限、参数和幂等键后执行。'], ['工具白名单', '读写分级', '并行调用', '结果回传'], { language: 'typescript', content: ['const orderTool = tool({', '  description: "按订单号查询订单",', '  inputSchema: z.object({ orderId: z.string().min(6) }),', '  execute: async ({ orderId }) => orderService.getForUser(userId, orderId)', '});'].join('\n') })
            ],
            practice: { title: '三个业务工具', description: '实现工单分类、订单查询和计算器，并记录工具调用。', tasks: ['定义输入Schema', '执行用户级授权', '处理工具失败', '渲染调用状态'] },
            acceptance: ['不存在字符串截取JSON', '订单工具验证资源所有权', '工具失败不会终止整个会话'],
            resources: [resources.aiStructured, resources.aiTools, resources.zod]
          }),
          lesson({
            id: 'w7-context-evals',
            week: 'W7',
            title: '上下文、模型路由与基线评测',
            duration: '8小时',
            level: '岗位主线',
            summary: '控制上下文长度和成本，为关键任务建立首个固定评测集。',
            objectives: ['管理消息窗口', '按任务选择模型', '建立可重复评测基线'],
            sections: [
              section('上下文不是越长越好', ['保留与当前任务相关的信息。历史消息可以裁剪、摘要或转为结构化状态，不能无限拼接。'], ['Token预算', '消息裁剪', '摘要漂移', '缓存与复用']),
              section('评测前置', ['选20条代表真实任务的输入，保存期望分类、必须包含信息和禁止行为。每次改Prompt或模型都运行回归。'], ['任务成功率', '结构化断言', '延迟与成本', '错误分类'])
            ],
            practice: { title: '20条基线评测', description: '覆盖正常、边界、模糊和恶意输入，并比较两个模型。', tasks: ['定义样本格式', '写确定性断言', '记录P95延迟', '输出失败清单'] },
            acceptance: ['评测可以重复运行', '结果包含质量延迟成本', '失败样本可追踪到版本'],
            resources: [resources.aiErrors, resources.langsmithEval]
          })
        ]
      },
      {
        id: 'rag-engineering',
        title: 'RAG 检索工程',
        icon: 'database',
        lessons: [
          lesson({
            id: 'w8-rag-ingestion',
            week: 'W8',
            title: '文档解析、切分、Embedding与pgvector',
            duration: '7小时',
            level: '岗位主线',
            summary: '构建可重复的知识入库管道，保留来源、版本和元数据。',
            objectives: ['选择切分策略', '理解Embedding相似度', '设计可更新索引'],
            sections: [
              section('入库管道', ['文档先解析、清洗、去重，再按结构切分。每个chunk必须保留来源、页码、标题、版本和权限标签。'], ['固定长度切分', '标题和段落切分', '重复内容', '增量更新']),
              section('向量存储', ['Embedding把文本映射为向量。相似度只表示语义接近，不代表答案正确。pgvector适合初期将业务与向量数据放在同一数据库。'], ['向量维度', '余弦距离', 'HNSW/IVFFlat', '元数据过滤'])
            ],
            practice: { title: '产品文档入库', description: '将一套说明书解析并写入PostgreSQL/pgvector。', tasks: ['保存文档版本', '实现两种切分', '批量生成Embedding', '支持增量重建'] },
            acceptance: ['每个chunk可追溯原文', '重复运行不会重复入库', '可以按权限过滤检索'],
            resources: [resources.aiEmbeddings, resources.pgvector, resources.langchain]
          }),
          lesson({
            id: 'w9-rag-retrieval',
            week: 'W9',
            title: '混合检索、重排、引用与拒答',
            duration: '10小时',
            level: '岗位主线',
            summary: '提升检索命中率，并让回答始终能够定位来源或明确拒答。',
            objectives: ['理解关键词与向量检索互补', '使用重排提升Top-K', '实现证据驱动回答'],
            sections: [
              section('检索策略', ['精确型号、订单号适合关键词，语义问题适合向量。混合检索先合并候选，再重排。'], ['BM25', '向量Top-K', 'RRF融合', 'Reranker']),
              section('引用和拒答', ['生成上下文应包含稳定引用ID。模型只能依据上下文回答；证据不足时返回“未找到依据”并提示人工路径。'], ['引用定位', '查询改写', '多轮检索', '知识冲突'])
            ],
            practice: { title: '带引用的知识问答', description: '实现混合检索、重排、引用跳转和拒答。', tasks: ['准备精确词与语义问题', '比较检索结果', '展示引用片段', '加入无答案问题'] },
            acceptance: ['引用能打开原文位置', '无证据不编造', '检索与生成可独立调试'],
            resources: [resources.rag, resources.langchain]
          }),
          lesson({
            id: 'w10-rag-evaluation',
            week: 'W10',
            title: 'RAG评测、回归与链路观测',
            duration: '8小时',
            level: '岗位主线',
            summary: '分别评估检索和生成，用数据比较切分、Top-K和重排方案。',
            objectives: ['建立Golden Dataset', '计算检索与回答指标', '用Trace定位失败阶段'],
            sections: [
              section('分层评测', ['先评检索是否找到证据，再评回答是否忠实。回答错误可能来自检索缺失、上下文冲突或生成偏离。'], ['Recall@K', 'MRR', '答案相关性', '忠实度', '引用正确率']),
              section('Trace与回归', ['每次请求保存查询改写、候选文档、重排分数、最终上下文、模型输出和耗时。'], ['版本标签', '失败类别', '线上样本回流', '质量/延迟/成本权衡'])
            ],
            practice: { title: '50条RAG评测', description: '比较两种切分和两种检索策略，输出结论。', tasks: ['人工标注相关文档', '计算Recall@K', '检查引用正确率', '输出失败案例'] },
            acceptance: ['报告区分检索与生成问题', '每个结论有数据支持', '失败样本进入回归集'],
            resources: [resources.ragEval, resources.phoenix]
          })
        ]
      },
      {
        id: 'agent-engineering',
        title: 'Agent 与 MCP',
        icon: 'workflow',
        lessons: [
          lesson({
            id: 'w11-workflows-agents',
            week: 'W11',
            title: 'Workflow与Agent的边界',
            duration: '7小时',
            level: '岗位主线',
            summary: '先用显式状态图表达流程，只在必要节点允许模型决策。',
            objectives: ['识别确定性步骤', '设计状态Schema', '实现路由、循环和终止条件'],
            sections: [
              section('什么时候不需要Agent', ['固定审批、金额计算、权限校验和数据库写入都应该是确定性代码。模型适合处理分类、抽取、规划和自然语言。'], ['顺序工作流', '并行工作流', '路由', '评估-优化循环']),
              section('状态图', ['状态只保存流程需要的事实。节点接收状态并返回更新，不要在全局变量里隐藏副作用。'], ['State Schema', '节点输入输出', '条件边', '最大循环次数'])
            ],
            practice: { title: '售后流程状态图', description: '将分类、检索、订单查询、回复拆成显式节点。', tasks: ['定义状态', '实现条件路由', '设置终止条件', '记录每个节点耗时'] },
            acceptance: ['写操作不由模型直接决定', '循环有上限', '状态可以序列化'],
            resources: [resources.langgraph, resources.workflows]
          }),
          lesson({
            id: 'w12-persistence-hitl',
            week: 'W12',
            title: '持久化、故障恢复与人工审批',
            duration: '9小时',
            level: '岗位主线',
            summary: '用Checkpoint恢复长流程，用Interrupt在高风险写操作前等待人工确认。',
            objectives: ['保存与恢复线程状态', '隔离副作用', '实现幂等审批节点'],
            sections: [
              section('可恢复执行', ['长流程不能只保存在内存。Checkpoint应与threadId绑定，进程重启后从安全节点恢复。'], ['线程与会话', 'Checkpoint', '重放', '版本兼容']),
              section('人工介入和幂等', ['退款前暂停并展示金额、订单和理由。恢复时再次校验权限和状态。幂等键防止重放产生重复退款。'], ['Interrupt', '审批数据', '幂等键', '副作用节点'])
            ],
            practice: { title: '退款审批流程', description: '流程在退款前暂停，管理员确认后恢复执行。', tasks: ['保存Checkpoint', '模拟进程重启', '加入幂等键', '测试拒绝和重复确认'] },
            acceptance: ['重启后能恢复', '重复确认只执行一次', '审批前后都有审计记录'],
            resources: [resources.persistence, resources.interrupts]
          }),
          lesson({
            id: 'w13-mcp-security',
            week: 'W13',
            title: 'MCP工具接入与安全',
            duration: '7小时',
            level: '岗位主线',
            summary: '理解MCP Client/Server和工具发现，同时落实授权、最小权限和Prompt Injection防护。',
            objectives: ['实现最小MCP Server', '为工具建立权限', '识别间接Prompt Injection'],
            sections: [
              section('MCP解决什么问题', ['MCP标准化工具、资源和提示的描述与传输。它减少集成成本，但不会自动解决身份、授权和业务风险。'], ['Client与Server', 'Tool、Resource、Prompt', '传输方式', '能力协商']),
              section('工具安全', ['外部文档可能包含诱导模型调用工具的恶意文本。模型输出和MCP参数都属于不可信输入。'], ['最小权限', '用户级授权', '参数二次校验', '敏感数据隔离', '完整审计'])
            ],
            practice: { title: '订单查询MCP Server', description: '暴露只读订单查询工具，并接入用户身份与审计。', tasks: ['定义工具Schema', '传递用户身份', '拒绝越权订单', '加入恶意文档测试'] },
            acceptance: ['MCP不能绕过业务鉴权', '写工具默认禁用', 'Prompt Injection不会触发未授权调用'],
            resources: [resources.mcp, resources.mcpSdk, resources.mcpSecurity, resources.owasp]
          })
        ]
      },
      {
        id: 'production-capstone',
        title: '生产化与作品集',
        icon: 'rocket',
        lessons: [
          lesson({
            id: 'w14-system-design',
            week: 'W14',
            title: '需求、架构、评测与威胁模型',
            duration: '8小时',
            level: '作品集',
            summary: '在编码前明确业务边界、数据流、权限矩阵、指标和不使用Agent的部分。',
            objectives: ['完成系统架构图', '定义工具权限矩阵', '建立初始评测集和成本预算'],
            sections: [
              section('从业务流程开始', ['先定义用户、问题、输入、期望结果和人工兜底，再选择RAG或Agent。技术名词不是需求。'], ['用户故事', '功能与非功能需求', '数据流', '失败与降级']),
              section('风险和指标', ['列出敏感数据、越权、Prompt Injection、错误退款和成本失控风险，并为每项风险设计控制。'], ['任务成功率', 'P95延迟', '单次成本', '工具成功率', '威胁模型'])
            ],
            practice: { title: '毕业项目设计文档', description: '完成售后工单智能体的架构、权限和评测设计。', tasks: ['画系统边界', '列工具权限矩阵', '准备50条样本', '估算调用成本'] },
            acceptance: ['写明不用Agent的步骤', '每个写工具有控制措施', '指标可实际采集'],
            resources: [resources.owasp, resources.langsmithEval]
          }),
          lesson({
            id: 'w15-observability-deploy',
            week: 'W15',
            title: '可观测性、测试与部署',
            duration: '11小时',
            level: '作品集',
            summary: '把前端、Node、Python、数据库、模型和工具串成可观测、可测试、可部署的系统。',
            objectives: ['建立端到端Trace', '完成关键流程测试', '部署可演示环境'],
            sections: [
              section('观测链路', ['每次用户任务有统一traceId。Span覆盖检索、模型、工具和数据库，日志可从trace跳转。'], ['OpenTelemetry Trace', '结构化日志', '指标和告警', '敏感字段脱敏']),
              section('部署与故障演练', ['容器有健康检查、资源限制和优雅退出。主动模拟模型超时、数据库断连和MCP失败。'], ['Docker Compose', '启动顺序', '健康检查', '降级页面', '备份和恢复'])
            ],
            practice: { title: '部署测试环境', description: '部署完整系统并执行三类故障演练。', tasks: ['接入Trace', '运行E2E', '模拟模型超时', '记录恢复过程'] },
            acceptance: ['可追踪一次完整任务', '故障有用户可理解提示', '陌生人可按README启动'],
            resources: [resources.otel, resources.phoenix, resources.docker, resources.playwright]
          }),
          lesson({
            id: 'w16-evaluate-portfolio',
            week: 'W16',
            title: '回归优化、作品集与求职表达',
            duration: '10小时',
            level: '作品集',
            summary: '用真实指标完成最终优化，并把技术取舍组织成可验证的作品集。',
            objectives: ['运行最终回归与压测', '整理失败案例和架构决策', '形成可验证简历描述'],
            sections: [
              section('最终评测', ['锁定版本后运行质量、延迟、成本、安全和并发测试。优化必须说明改善了什么、牺牲了什么。'], ['任务成功率', '检索与引用', 'P95延迟', '单次成本', '安全用例']),
              section('作品集表达', ['README按问题、架构、关键决策、评测结果、运行方法和已知限制组织。面试重点不是框架列表，而是你的判断。'], ['架构图', '演示脚本', 'ADR决策记录', '失败案例', '量化简历'])
            ],
            practice: { title: '发布作品集', description: '发布演示、README、架构图、评测报告和10分钟讲解。', tasks: ['完成最终回归', '录制演示', '整理3个失败方案', '用真实指标改写简历'] },
            acceptance: ['所有指标可追溯', '不虚构改善数据', '能解释为什么没有使用多Agent'],
            resources: [resources.langsmithEval, resources.phoenix]
          })
        ]
      }
    ]
  };
})();
