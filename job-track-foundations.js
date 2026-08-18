(function () {
  const section = (title, paragraphs, bullets = [], code = null, note = '') => ({ title, paragraphs, bullets, code, note });
  const step = (title, description, code = null) => ({ title, description, code });
  const code = (language, lines) => ({ language, content: Array.isArray(lines) ? lines.join('\n') : lines });
  const file = (name, language, lines, description = '') => ({ name, description, code: code(language, lines) });
  const resource = (label, url) => ({ label, url });
  const demo = (title, description, files, commands, output, verify) => ({
    title,
    description,
    files,
    commands: code('powershell', commands),
    output: code('text', output),
    verify
  });

  const jobResources = {
    nestOverview: resource('NestJS First Steps', 'https://docs.nestjs.com/first-steps'),
    nestProviders: resource('NestJS Providers 与依赖注入', 'https://docs.nestjs.com/providers'),
    nestModules: resource('NestJS Modules', 'https://docs.nestjs.com/modules'),
    nestLifecycle: resource('NestJS Lifecycle Events', 'https://docs.nestjs.com/fundamentals/lifecycle-events'),
    tsDecorators: resource('TypeScript Decorators', 'https://www.typescriptlang.org/docs/handbook/decorators.html'),
    llmCourse: resource('Hugging Face LLM Course', 'https://huggingface.co/learn/llm-course/chapter1/1'),
    googleLlm: resource('Google ML Crash Course: Large Language Models', 'https://developers.google.com/machine-learning/crash-course/llm'),
    aiSdk: resource('Vercel AI SDK Core', 'https://ai-sdk.dev/docs/ai-sdk-core/overview'),
    ragConcepts: resource('LangChain Retrieval 概念', 'https://docs.langchain.com/oss/javascript/langchain/retrieval'),
    ragCookbook: resource('AI SDK Node.js RAG', 'https://ai-sdk.dev/cookbook/node/retrieval-augmented-generation'),
    pgvector: resource('pgvector', 'https://github.com/pgvector/pgvector'),
    langgraph: resource('LangGraph Overview', 'https://docs.langchain.com/oss/javascript/langgraph/overview'),
    workflows: resource('LangGraph Workflows and Agents', 'https://docs.langchain.com/oss/javascript/langgraph/workflows-agents'),
    aiAgents: resource('AI SDK Agents', 'https://ai-sdk.dev/docs/agents/overview'),
    mcpIntro: resource('MCP 2026-07-28 入门', 'https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro'),
    mcpArchitecture: resource('MCP 2026-07-28 架构', 'https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture'),
    mcpServer: resource('MCP Server Concepts', 'https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts'),
    mcpSecurity: resource('MCP 安全最佳实践', 'https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices')
  };

  const conceptLessons = {
    'backend-engineering': {
      before: 'w2-nest-streaming',
      lesson: {
        id: 'job-backend-nest-concepts',
        week: 'W2 · 概念课',
        title: '后端框架、IoC/DI 与 NestJS 原理',
        duration: '3小时',
        level: '岗位主线 · 必修概念',
        summary: '先理解后端框架解决什么问题、NestJS 的模块系统和依赖注入如何工作，再进入 Controller、DTO 与流式接口实现。',
        objectives: ['用自己的话解释框架、IoC、DI 和 NestJS', '解释装饰器元数据、Provider Scope 与应用生命周期', '画出一次 HTTP 请求经过 NestJS 的处理链', '识别 Controller、Provider、Module 与 Adapter 的职责边界'],
        sections: [
          section('是什么：后端框架与 NestJS', [
            '后端框架是一组约定、运行时机制和工具，用来组织 HTTP 入口、业务服务、依赖、配置、校验、错误处理和生命周期。它不是“能启动端口的库”，价值在于让多人长期维护的服务拥有稳定结构。',
            'NestJS 是运行在 Node.js 上、以 TypeScript 为主要语言的服务端框架。它借鉴 Angular 的模块、装饰器和依赖注入风格，底层可以使用 Express 或 Fastify 处理 HTTP，但应用代码主要面向 Nest 提供的抽象。'
          ], ['框架提供控制反转、约定和扩展点', 'NestJS 负责组织应用，不替代 Node.js、HTTP 或数据库知识', 'Express/Fastify 是 HTTP 适配层，NestJS 是更上层的应用结构']),
          section('为什么需要：从脚本到可维护服务', [
            '小脚本可以在路由中直接读取环境变量、访问数据库并调用模型；功能增加后，这些职责互相缠绕，测试需要启动所有依赖，替换模型供应商也会修改路由。框架通过明确边界降低这种耦合。',
            '使用 NestJS 的目标不是少写几行代码，而是让依赖来源、初始化顺序、请求入口和资源释放都可追踪。只有当系统包含多个模块、外部依赖和测试边界时，这种结构收益才明显。'
          ], ['统一应用启动和关闭', '集中输入校验与异常映射', '让业务服务可以替换依赖并独立测试']),
          section('核心机制：IoC 与依赖注入', [
            '控制反转（IoC）表示对象不再自行决定“依赖从哪里创建”。对象只声明自己需要什么，由容器在应用启动时注册 Provider、解析依赖图并创建实例。依赖注入（DI）是实现 IoC 的常见方式。',
            '例如 ChatService 依赖 ModelProvider。ChatService 不执行 `new OpenAIProvider()`，而在构造函数声明接口令牌；Module 决定当前令牌绑定真实 Provider、MockProvider 还是测试替身。这样业务逻辑不依赖具体供应商。'
          ], ['Token：容器中依赖的唯一标识', 'Provider：告诉容器如何创建值或实例', 'Scope：实例是单例、请求级还是瞬态', 'Dependency graph：容器按依赖关系决定创建顺序'], code('typescript', [
            'export const MODEL_PROVIDER = Symbol("MODEL_PROVIDER");',
            '',
            '@Injectable()',
            'export class ChatService {',
            '  constructor(@Inject(MODEL_PROVIDER) private readonly model: ModelProvider) {}',
            '}',
            '',
            '@Module({',
            '  providers: [ChatService, { provide: MODEL_PROVIDER, useClass: MockProvider }]',
            '})',
            'export class ChatModule {}'
          ])),
          section('前置语法：装饰器与反射元数据', [
            '装饰器是应用在类、方法、属性或参数上的函数调用语法，用来附加或变换声明信息。NestJS 的 `@Module`、`@Controller`、`@Injectable`、`@Get` 等装饰器会登记元数据，框架在启动时读取这些元数据来建立模块、路由和依赖关系。装饰器不是注释，也不会自动执行被标记方法。',
            'NestJS 经典编译链使用 TypeScript legacy decorators，并常配合 `experimentalDecorators`、`emitDecoratorMetadata` 与 `reflect-metadata`。`emitDecoratorMetadata` 让 `tsc` 为类构造参数生成有限的运行时类型元数据；只做语法转译的工具可能不生成这些信息，所以本章 Demo 使用 `tsc` 编译后再运行。',
            'TypeScript 的接口、泛型和大多数类型会在运行时擦除，容器不能把接口名当成真实 Token。依赖接口、字符串或 Symbol Token 时使用显式 `@Inject(TOKEN)`，不要假设反射能恢复所有静态类型。'
          ], ['`experimentalDecorators`：启用 Nest 依赖的 legacy decorator 语法', '`emitDecoratorMetadata`：由 TypeScript 编译器发出有限 design:type 元数据', '`reflect-metadata`：提供元数据读写 API，必须在应用入口导入', '装饰器元数据负责描述结构，业务规则仍写在普通可测试函数中'], code('json', [
            '{',
            '  "compilerOptions": {',
            '    "experimentalDecorators": true,',
            '    "emitDecoratorMetadata": true',
            '  }',
            '}'
          ]), '不要把 NestJS 装饰器与新版标准装饰器混为一谈；以 NestJS 当前编译要求为准。'),
          section('核心机制：Module、Controller 与 Provider', [
            'Module 是依赖边界和装配单元，声明本模块的 Controller、Provider、imports 与 exports。Controller 把 HTTP 方法、路径、参数转换为用例调用；Provider 承担业务逻辑或基础设施能力。',
            '模块导出的是稳定能力，而不是内部所有类。一个模块大量相互导入、依赖 `forwardRef`，通常说明领域边界或依赖方向需要重新检查。'
          ], ['Controller：协议适配，不承载核心规则', 'Application Service：编排一个业务用例', 'Domain：表达业务规则', 'Adapter/Repository：连接模型、数据库和外部 API']),
          section('核心机制：一次请求怎样流过 NestJS', [
            '请求通常依次经过 Middleware、Guard、Interceptor 前置逻辑、Pipe、Controller、Service，再经过 Interceptor 后置逻辑与 Exception Filter。它们处理的关注点不同，不能把所有逻辑都塞进 Guard 或 Interceptor。',
            'Guard 主要回答是否允许访问；Pipe 转换并校验当前参数；Interceptor 包裹调用过程做日志、超时或响应映射；Filter 把未处理异常映射为稳定协议。理解顺序后才能判断日志、鉴权和 DTO 校验应放在哪里。'
          ], ['Middleware：通用请求预处理', 'Guard：认证和授权决策', 'Pipe：参数转换与校验', 'Interceptor：调用前后横切逻辑', 'Filter：异常到响应的最后映射']),
          section('核心机制：Provider Scope 与应用生命周期', [
            '默认 Provider 是单例 Scope，在应用启动时由容器创建并在请求间复用，适合无请求私有状态的 Service。Request Scope 每个请求创建依赖子树，Transient Scope 每个注入点创建实例；二者增加对象创建和上下文传播成本，只在确有隔离需求时使用。',
            '构造函数用于接收依赖和建立轻量字段，不应发起不可控异步 I/O。`OnModuleInit` 在所在模块依赖解析后运行，`OnApplicationBootstrap` 在所有模块初始化后、应用开始监听前运行；异步 Hook 返回 Promise 时 Nest 会等待。',
            '正常关闭时可依次使用 `OnModuleDestroy`、`BeforeApplicationShutdown` 和 `OnApplicationShutdown` 释放订阅、连接与后台任务。要响应 SIGTERM 等系统信号，入口需调用 `app.enableShutdownHooks()`；Hook 不能替代每个请求或流自身的取消与清理。'
          ], ['Singleton：默认，实例跨请求复用', 'Request：每个请求一组实例，成本更高', 'Transient：每个消费者得到新实例', 'Bootstrap Hook：初始化连接或预热，但必须有失败策略', 'Shutdown Hook：停止接单、等待在途任务并释放资源'], code('typescript', [
            '@Injectable()',
            'export class WorkerService implements OnModuleInit, OnModuleDestroy {',
            '  async onModuleInit() { /* 建立受控连接或预热 */ }',
            '  async onModuleDestroy() { /* 停止任务并释放连接 */ }',
            '}',
            '',
            'const app = await NestFactory.create(AppModule);',
            'app.enableShutdownHooks();'
          ])),
          section('边界与常见误区', [
            '装饰器只是声明元数据，不会自动带来良好架构。Controller 很薄但 Service 包含数千行，同样是职责失衡；把所有类标记为 Injectable 也不等于需要 DI。',
            '请求级 Provider 会增加创建开销并扩大隐式状态，默认优先无状态单例。NestJS 也不会自动解决事务、幂等、越权、事件循环阻塞或流连接泄漏，这些仍需要明确设计。'
          ], ['误区：Module 等于文件夹', '误区：用了 DTO 就完成所有业务校验', '误区：DI 容器可以隐藏循环依赖', '边界：简单脚本不一定需要完整框架'], null, '先能画出对象关系和请求链，再运行 Nest CLI。'),
          section('最小机制实验：自己扮演一次容器', [
            '在使用 NestJS 前，先用普通 JavaScript 创建一个只支持 value、factory 与依赖解析的小容器。逐行跟踪注册、解析、缓存和错误路径，观察对象不再自行 new 依赖。',
            '这个实验不用于生产，而是把“魔法”还原为可理解的对象创建过程。完成后再对照 NestJS Provider 文档寻找 useValue、useFactory 和 useClass。'
          ], ['先画依赖图：Controller -> Service -> Provider', '替换 Provider 后 Service 代码不变', '制造缺失 token，观察解析错误发生在装配阶段'])
        ],
        practice: {
          title: '先解释依赖图，再搭 NestJS 骨架',
          description: '先完成术语卡片和请求链图，再运行最小容器实验；确认理解后才创建 NestJS Module。',
          tasks: ['写出框架、IoC、DI、Module、Provider 的定义', '解释装饰器、metadata 与 Token', '画出 HTTP 请求处理链和应用生命周期', '运行最小 DI 容器', '替换依赖并观察行为', '创建不含业务逻辑的 NestJS 骨架'],
          steps: [
            step('建立概念卡片', '每个概念写“定义、解决的问题、一个反例”，不能只抄官方文档。'),
            step('检查装饰器编译结果', '启用 experimentalDecorators 与 emitDecoratorMetadata，用 `tsc` 编译一个 Injectable 类；对比关闭 metadata 后的输出，并解释接口为什么仍需显式 Token。'),
            step('画请求链', '标注 Middleware、Guard、Interceptor、Pipe、Controller、Service 和 Filter 的职责。'),
            step('画应用生命周期', '从 Module 构造、OnModuleInit、OnApplicationBootstrap、listen 到三个 Shutdown Hook，标出单例/请求级实例的创建范围。'),
            step('运行容器实验', '保存下方 `container.mjs`，运行并解释注册表、递归解析和实例缓存。'),
            step('替换依赖', '将 MockModelProvider 换成另一个实现，确认 ChatService 无需修改。'),
            step('创建 Nest 骨架', '创建 ChatModule、ChatController、ChatService，只返回固定字符串，不接模型。'),
            step('写学习复盘', '回答“哪些是 Nest 机制，哪些仍属于 HTTP/Node.js 基础”。')
          ],
          demo: demo('用 35 行代码看懂依赖注入', '这个 Demo 只演示依赖注册、解析和替换；理解后再使用 NestJS 容器。', [file('container.mjs', 'javascript', [
            'class Container {',
            '  definitions = new Map();',
            '  instances = new Map();',
            '  register(token, definition) { this.definitions.set(token, definition); }',
            '  resolve(token) {',
            '    if (this.instances.has(token)) return this.instances.get(token);',
            '    const definition = this.definitions.get(token);',
            '    if (!definition) throw new Error(`MISSING_PROVIDER:${token}`);',
            '    const dependencies = (definition.dependencies ?? []).map((item) => this.resolve(item));',
            '    const instance = definition.factory(...dependencies);',
            '    this.instances.set(token, instance);',
            '    return instance;',
            '  }',
            '}',
            '',
            'const container = new Container();',
            'container.register("model", { factory: () => ({ generate: () => "mock-answer" }) });',
            'container.register("chat", {',
            '  dependencies: ["model"],',
            '  factory: (model) => ({ reply: () => model.generate() })',
            '});',
            'console.log(container.resolve("chat").reply());',
            'console.log(container.resolve("chat") === container.resolve("chat"));'
          ], '先不依赖 NestJS，观察 IoC 容器最核心的工作。')], ['node container.mjs'], ['mock-answer', 'true'], '能解释 true 来自容器缓存；修改 model 的工厂后，chat 的代码保持不变。'),
          expected: ['能不看材料解释 IoC 与 DI 的区别', '能正确放置校验、鉴权和业务逻辑', 'Nest 骨架中的依赖由 Module 装配'],
          troubleshooting: ['不要先复制完整 CRUD 项目再反推概念', '如果说不清依赖由谁创建，回到容器实验逐行跟踪'],
        },
        acceptance: ['能画出 NestJS 依赖图和请求处理链', '能说明 Controller、Service、Provider、Module 的职责和反例', '能解释简单脚本何时不需要 NestJS'],
        resources: [jobResources.tsDecorators, jobResources.nestOverview, jobResources.nestProviders, jobResources.nestModules, jobResources.nestLifecycle]
      }
    },
    'llm-applications': {
      before: 'w5-model-streaming',
      lesson: {
        id: 'job-llm-concepts',
        week: 'W5 · 概念课',
        title: '大语言模型：Token、推理、上下文与局限',
        duration: '5小时',
        level: '岗位主线 · 必修概念',
        summary: '先建立“概率式文本生成器”的心智模型，理解 Token、上下文窗口、采样和幻觉，再接入模型 API。',
        objectives: ['解释 LLM 的输入、训练目标、预测循环和输出', '用 prefill、decode 与 KV cache 解释首字和逐 Token 延迟', '区分训练、推理、上下文学习与检索', '根据任务选择温度、上下文和结构化约束'],
        sections: [
          section('是什么：大语言模型不是知识数据库', [
            '大语言模型（LLM）是在大量文本上训练的参数化模型。给定已有 Token 序列，它计算下一个 Token 的概率分布；把新 Token 接回输入并重复预测，就形成一段输出。',
            '模型参数压缩了训练数据中的语言与模式，但不能像数据库一样列出每条知识的来源，也不保证内部信息最新或精确。应用工程的关键是利用它的生成和理解能力，同时用外部数据、规则和评测约束不可靠部分。'
          ], ['输入：消息、文本、图像等被编码后的表示', '推理：基于当前上下文计算下一 Token 分布', '输出：采样或选择 Token 后循环生成', '停止：遇到停止标记、长度上限、工具调用或取消']),
          section('为什么需要：它擅长非结构化映射', [
            '传统程序需要开发者枚举规则，而 LLM 能处理意图分类、摘要、信息抽取、改写和开放式表达等难以完全列举的语言变化。它适合把模糊自然语言映射为候选结构或内容。',
            '如果任务可以由 SQL、权限规则、确定性计算或固定流程可靠完成，就不应让模型代替。模型应位于不确定性的边缘，业务不变量仍由代码执行。'
          ], ['适合：语言理解、候选生成、弱结构输入', '不适合：精确算术、权限裁决、事实数据库、不可逆写操作']),
          section('核心机制：Transformer、自注意力与训练目标', [
            '主流 LLM 以 Transformer 为基础。文本先变成 Token 向量；每层 self-attention 让当前位置按当前内容选择性聚合上下文中其他位置的信息，再经过前馈网络和残差连接逐层形成表示。应用工程师不必先推导矩阵公式，但要理解模型输出依赖整个可见上下文，而不是按关键字查询一张事实表。',
            '常见 causal language model 的预训练目标是：给定前面的 Token，最小化下一个 Token 预测误差。训练通过反向传播修改大量参数；推理只使用已训练参数计算输出，不会因为一次聊天自动把新事实永久写入权重。指令微调和偏好优化会进一步塑造回答行为，但仍不提供业务数据库式的事实保证。'
          ], ['Transformer 层：self-attention + 前馈网络 + 残差/归一化', '训练：并行处理大量序列并更新参数', '推理：参数固定，根据本次上下文计算下一个 Token', '上下文学习：临时影响本次输出，不等于继续训练']),
          section('核心机制：Token 与上下文窗口', [
            '模型并不直接读取“字符”或“单词”，Tokenizer 会把文本切成 Token ID。中文字符、英文词片段、标点和空格可能占用不同数量的 Token，所以字符数不能直接等同成本。',
            '上下文窗口是一次推理可处理的总 Token 预算，包含系统指令、历史消息、检索证据、工具结果和输出。窗口变大不代表模型能同等关注每一处内容；无关历史会稀释关键信号并增加延迟与成本。'
          ], ['Tokenization 决定输入长度与计费单位', 'Context = 指令 + 当前问题 + 历史 + 证据 + 输出预算', '超过窗口会截断或报错', '长上下文仍需要选择、摘要和排序']),
          section('核心机制：Prefill、Decode 与 KV Cache', [
            '推理通常分为 prefill 和 decode。Prefill 先处理系统指令、历史与当前输入，构建每层 attention 所需的 Key/Value 表示；输入越长，首个 Token 前需要完成的计算和数据搬运通常越多，因此 TTFT（time to first token）会上升。',
            'Decode 随后逐 Token 运行：新 Token 必须依赖此前结果，所以单个序列的生成具有顺序性，tokens/s 与输出长度决定用户等待完整答案的时间。流式传输只能尽早展示已生成 Token，不能消除模型的 decode 计算。',
            'KV cache 保存当前序列历史 Token 的 attention Key/Value，避免每一步重新计算全部过去表示，但会占用显存/内存，并不是知识缓存或最终答案缓存。只有供应商明确支持的相同前缀缓存才能跨请求复用部分 prefill，任意相似问题不能直接共享 KV cache。'
          ], ['TTFT 主要受输入长度、排队与 prefill 影响', 'TPOT/tokens per second 描述 decode 阶段', '长输出增加 decode 时间和费用', 'KV cache 以空间换重复计算，随批量与序列长度增长']),
          section('核心机制：Logit、概率与采样', [
            '模型先为候选 Token 产生 logit，再经过 softmax 转为概率。temperature 会缩放 logit：较低温度让分布更尖锐、输出更稳定，较高温度让候选更分散，但不会自动提高事实正确率。',
            'top-p 只在累计概率达到阈值的候选集合中采样。生产任务应先定义可接受输出和评测，再调采样参数；分类和结构抽取通常偏低温，创意生成才可能提高随机性。'
          ], ['Greedy：选择最高概率 Token', 'Temperature：改变分布锐度', 'Top-p：限制动态候选集合', 'Seed：部分供应商提供近似复现，但不等于绝对确定']),
          section('核心机制：消息、指令与上下文学习', [
            'Chat API 把输入组织为 system、user、assistant、tool 等角色。角色影响供应商如何拼接提示，但模型最终仍接收一个上下文序列；系统消息不是不可突破的安全边界。',
            '在上下文中提供任务说明、示例和数据属于提示或上下文学习，不会修改模型权重。Fine-tuning 会改变权重，RAG 会在推理前检索外部证据，三者解决的问题不同。'
          ], ['Prompt：本次任务的指令与示例', 'RAG：动态注入外部证据', 'Fine-tuning：调整模型行为模式', 'Tool calling：让模型提出结构化动作意图']),
          section('边界与常见误区', [
            '幻觉不是偶发语法错误，而是概率生成在缺少可靠证据时仍可能给出流畅答案。降低温度不能根治；需要证据、拒答、结构校验和评测。',
            '模型看到工具描述不等于有权执行工具，结构化输出不等于内容真实，长上下文也不等于永久记忆。API 返回成功只说明生成完成，不说明任务正确。'
          ], ['误区：LLM 在实时搜索全部互联网', '误区：system prompt 等于权限系统', '误区：温度为 0 就完全确定且不会幻觉', '边界：模型版本变化会带来行为漂移'], null, '先把模型输出视为“待验证的候选”，再设计应用边界。'),
          section('最小机制实验：观察概率而不是聊天界面', [
            '用固定 logit 计算不同温度下的 softmax，观察最高候选概率如何变化。这个实验不会训练模型，但能解释为什么调高温度会增加多样性。',
            '随后手工记录一次真实 API 调用的输入消息、输出事件、usage、finish reason 和错误；不要只看最终文本。'
          ], ['比较 temperature=0.5 与 1.5', '解释概率总和为什么为 1', '区分生成协议成功与业务答案正确'])
        ],
        practice: {
          title: '建立 LLM 推理心智模型',
          description: '先完成术语图和概率实验，再用 Mock Provider 观察完整生成事件，最后才连接真实模型。',
          tasks: ['画出 Transformer 与 Token 预测循环', '区分 prefill、decode 与 KV cache', '计算两组采样概率', '估算一次对话的上下文组成', '列出三种幻觉控制措施', '记录一次模型 API 的完整元数据'],
          steps: [
            step('画预测循环', '标出 tokenize、forward、logits、sampling、append 和 stop。'),
            step('拆分推理延迟', '对同一模型分别发送短输入和长输入，记录 TTFT、输出 Token 数与总时长；说明差异可能来自 prefill、排队和网络，不能只凭一次请求下结论。'),
            step('运行温度实验', '保存并运行 `temperature.mjs`，解释两行概率差异。'),
            step('拆解上下文', '把一段聊天分为系统指令、历史、当前输入、证据和输出预算。'),
            step('建立失败清单', '分别记录事实错误、格式错误、指令冲突、上下文截断和超时。'),
            step('使用 Mock Provider', '先固定事件序列，验证 UI 的开始、增量、完成、取消、失败状态。'),
            step('接入真实 API', '服务端读取密钥，记录 model、tokens、latency、finishReason，不记录敏感正文。')
          ],
          demo: demo('温度如何改变候选概率', '使用固定 logit 观察概率分布；这是推理机制实验，不是完整模型。', [file('temperature.mjs', 'javascript', [
            'const logits = [2, 1, 0];',
            'function softmax(values, temperature) {',
            '  const scaled = values.map((value) => value / temperature);',
            '  const max = Math.max(...scaled);',
            '  const exp = scaled.map((value) => Math.exp(value - max));',
            '  const total = exp.reduce((sum, value) => sum + value, 0);',
            '  return exp.map((value) => value / total);',
            '}',
            'for (const temperature of [0.5, 1.5]) {',
            '  const probabilities = softmax(logits, temperature);',
            '  console.log(temperature, probabilities.map((value) => value.toFixed(3)).join(","));',
            '}'
          ])], ['node temperature.mjs'], ['0.5 0.867,0.117,0.016', '1.5 0.563,0.289,0.148'], '能说明较高温度让分布更平，但不能据此声称答案更正确。'),
          expected: ['能从 Token 预测循环解释流式输出', '能区分 Prompt、RAG 和 Fine-tuning', '能列出至少四类 LLM 失败模式'],
          troubleshooting: ['不要把聊天网页操作等同于理解模型机制', '概率实验解释采样，不代表真实模型只有三个 Token'],
        },
        acceptance: ['能用自己的话解释 Transformer 训练目标与逐 Token 生成', '能用 prefill、decode 和 KV cache 解释延迟与内存边界', '能说明上下文窗口、温度与幻觉的边界', '能判断一个步骤应使用模型还是确定性代码'],
        resources: [jobResources.googleLlm, jobResources.llmCourse, jobResources.aiSdk]
      }
    },
    'rag-engineering': {
      before: 'w8-rag-ingestion',
      lesson: {
        id: 'job-rag-concepts',
        week: 'W8 · 概念课',
        title: 'RAG：检索增强生成的原理与证据边界',
        duration: '4小时',
        level: '岗位主线 · 必修概念',
        summary: '先理解 RAG 为什么由离线索引与在线问答两条链组成，以及检索、引用和拒答的职责，再搭向量库。',
        objectives: ['解释 RAG 与长上下文、搜索、微调的差异', '画出摄取链和查询链的数据流', '区分检索失败、生成失败与引用失败'],
        sections: [
          section('是什么：RAG 是一套运行时证据流程', [
            '检索增强生成（RAG）在用户提问时先从外部知识源检索相关内容，再把证据与问题一起交给模型生成答案。它不是某个向量数据库，也不是简单的“上传 PDF 后聊天”。',
            'RAG 的目标是让答案基于可更新、可授权、可引用的外部事实。系统需要同时管理文档处理、索引、检索、上下文组装、生成约束、引用和评测。'
          ], ['知识源：文档、数据库、工单或 API', 'Retriever：按问题选择候选证据', 'Generator：在证据约束下组织答案', 'Citation：把答案主张连接到可核对原文']),
          section('为什么需要：模型参数不等于业务知识库', [
            '业务规则会更新，私有文档不能依赖模型预训练记住，用户权限也要求不同人看到不同证据。RAG 让知识更新和模型升级相互独立，并能返回来源。',
            '如果数据本来就是精确结构化字段，优先调用数据库或业务 API；如果任务是稳定行为风格，可能考虑微调。RAG 主要解决“本次回答需要哪些外部证据”。'
          ], ['比重新训练更易更新和撤回知识', '可在检索前执行权限过滤', '可通过 chunkId 追踪证据与失败原因']),
          section('核心机制：离线摄取与索引链', [
            '离线链通常包含加载、解析、清洗、去重、切分、元数据补全、Embedding 和写入索引。每一步都要版本化并可重复执行，否则无法判断索引中哪个结果来自哪版文档和切分策略。',
            'Chunk 是最小检索与引用单位。过小会丢失语义，过大则混入无关信息。标题、章节、页码、版本、租户和权限不是装饰字段，而是过滤、引用和重建索引的基础。'
          ], ['Document -> normalized text -> chunks', 'Chunk -> embedding vector + lexical fields + metadata', '稳定 ID 与内容哈希支持幂等', '文档删除需要同步撤销旧 chunk']),
          section('核心机制：Embedding 与相似度', [
            'Embedding 把文本映射到高维向量，语义相近文本通常在向量空间更接近。检索通过余弦相似度、点积或距离寻找候选，但分数只在同一模型、同一处理方式和具体数据集上有意义。',
            '向量检索擅长同义表达，词法检索擅长错误码、型号和专有名词。生产 RAG 常用混合检索、元数据过滤和重排，而不是只取向量 Top-K。'
          ], ['Embedding model 变化通常需要重建向量', '距离阈值不是跨模型通用常数', 'Top-K 增大同时增加噪声、Token 和成本']),
          section('核心机制：在线查询与生成链', [
            '在线链把用户问题规范化或改写，执行权限过滤与多路检索，重排候选，选择上下文，再要求模型依据证据回答并返回结构化引用。每一步都应进入 trace。',
            '生成器只能看到被选中的上下文。相关文档没有召回属于检索失败；文档已召回但答案背离原文属于生成忠实度失败；引用位置无法定位则是引用链失败。三者需要分别评测。'
          ], ['Query -> retrieve -> rerank -> context', 'Context + instruction -> answer + citations', '无足够证据 -> 拒答、澄清或转人工']),
          section('边界与常见误区', [
            '向量数据库不会自动理解文档，Embedding 相似也不等于事实支持。把所有命中文本塞进 Prompt 可能降低质量；让模型生成一个看似真实的链接也不算引用。',
            'RAG 不能修复错误源文档、越权索引或不受控工具调用。权限必须在检索阶段生效，引用必须由后端结构化映射到真实 chunk，最终结论要由固定评测集验证。'
          ], ['误区：Top-K 越大越好', '误区：有 RAG 就不会幻觉', '误区：切分只看固定字符数', '边界：时效性取决于摄取与索引更新']),
          section('最小机制实验：不用向量库跑通证据链', [
            '先用三段固定文本和可解释的词法得分完成 retrieve -> context -> citation，确认输入、候选、选中证据和拒答条件。再替换为 Embedding 或 pgvector。',
            '如果连固定数据的证据链都无法解释，增加框架只会让问题更难定位。'
          ], ['打印每个 chunk 的得分', '答案返回 chunkId 而不是编造 URL', '问题无命中时返回 insufficient-evidence'])
        ],
        practice: {
          title: '先画两条链，再引入向量索引',
          description: '用固定语料跑通可解释 RAG，逐项记录中间结果；验证证据链后再增加 Embedding。',
          tasks: ['画摄取链和查询链', '定义 chunk 数据结构', '运行词法检索实验', '实现引用与拒答', '再替换一条向量检索支路'],
          steps: [
            step('画数据流', '分别画离线摄取链和在线查询链，标出每一步输入、输出和版本。'),
            step('定义 Chunk Schema', '至少包含 id、text、source、location、version、tenantId 和 permissions。'),
            step('运行最小证据链', '保存并运行 `rag-baseline.mjs`，查看得分和 citation。'),
            step('加入无答案问题', '阈值以下返回 insufficient-evidence，不允许拼凑答案。'),
            step('加入 Embedding', '只替换候选产生方式，保留相同的 chunk、引用和评测接口。'),
            step('记录失败类型', '给每个案例标注 ingestion、retrieval、generation 或 citation。')
          ],
          demo: demo('可解释的最小 RAG 证据链', '先用词法得分理解 RAG 接口，再替换检索器。', [file('rag-baseline.mjs', 'javascript', [
            'const chunks = [',
            '  { id: "c1", source: "refund.md#7", text: "退款申请需要订单号，审核时间为两个工作日" },',
            '  { id: "c2", source: "shipping.md#2", text: "物流查询需要运单号" },',
            '  { id: "c3", source: "account.md#4", text: "修改手机号需要身份验证" }',
            '];',
            'function retrieve(query) {',
            '  const terms = query.split(/\s+/).filter(Boolean);',
            '  return chunks.map((chunk) => ({ ...chunk, score: terms.filter((term) => chunk.text.includes(term)).length }))',
            '    .sort((a, b) => b.score - a.score);',
            '}',
            'function answer(query) {',
            '  const [best] = retrieve(query);',
            '  if (!best || best.score === 0) return { status: "insufficient-evidence", citations: [] };',
            '  return { status: "answered", answer: best.text, citations: [{ chunkId: best.id, source: best.source }] };',
            '}',
            'console.log(JSON.stringify(answer("退款 订单号")));',
            'console.log(JSON.stringify(answer("发票 抬头")));'
          ])], ['node rag-baseline.mjs'], ['{"status":"answered","answer":"退款申请需要订单号，审核时间为两个工作日","citations":[{"chunkId":"c1","source":"refund.md#7"}]}', '{"status":"insufficient-evidence","citations":[]}'], '能指出检索器可替换而证据与引用契约保持不变；无证据问题必须拒答。'),
          expected: ['能说明摄取链和查询链每一步的职责', '每个回答可回溯到真实 chunk', '能区分至少三类 RAG 失败'],
          troubleshooting: ['先保证固定语料的链路正确，再排查向量模型和数据库', '不要使用生成答案本身作为“证据”'],
        },
        acceptance: ['能解释 RAG 不是向量数据库的同义词', '能比较 RAG、长上下文、业务 API 和微调的适用边界', '能从 trace 判断问题发生在检索还是生成'],
        resources: [jobResources.ragConcepts, jobResources.ragCookbook, jobResources.pgvector]
      }
    },
    'agent-engineering': {
      before: 'w11-workflows-agents',
      lesson: {
        id: 'job-agent-concepts',
        week: 'W11 · 概念课',
        title: 'Agent：循环、状态、工具与自主性边界',
        duration: '4小时',
        level: '岗位主线 · 必修概念',
        summary: '先理解 Agent 是受约束的决策循环，区分固定 Workflow 与自主 Agent，再使用 LangGraph。',
        objectives: ['解释 Agent 的观察、决策、行动和终止循环', '按任务不确定性选择 Workflow 或 Agent', '为状态、工具、预算和失败恢复定义边界'],
        sections: [
          section('是什么：Agent 是围绕目标运行的受控循环', [
            '在大模型应用中，Agent 通常指一个能读取当前状态、决定下一步、调用工具、观察结果并继续迭代的执行系统。LLM 常用于选择或生成下一步，但完整 Agent 还包含状态、工具执行器、策略、预算、终止条件和审计。',
            '一次模型调用不是 Agent；按固定步骤运行的链也不一定是 Agent。关键差异在于下一步是否由运行时状态和模型决策动态产生。'
          ], ['Observe：读取用户输入、状态和工具结果', 'Decide：选择回答、工具或下一节点', 'Act：由受信任执行器调用工具', 'Update：把结果写回状态', 'Stop：成功、失败、预算耗尽或人工终止']),
          section('为什么需要：路径无法完全预先枚举', [
            '当任务需要根据中间结果选择不同信息源、重复搜索或组合多个只读工具时，固定流程可能难以覆盖所有路径。Agent 提供一定自主性，让模型处理开放式决策。',
            '自主性会增加成本、延迟和不可预测性。能用一个函数或明确状态机完成的任务，不应为了“像 Agent”而增加循环。工程目标是最小必要自主性。'
          ], ['固定审批流优先 Workflow', '开放式研究可考虑 Agent', '高风险写操作保持确定性授权与人工确认']),
          section('核心机制：状态、节点、边与循环', [
            '状态是一次任务中可序列化的事实，例如输入、已选意图、证据、工具结果、步数和错误。节点读取状态并返回局部更新，边决定下一个节点；循环允许基于观察再次行动。',
            '状态 Schema 是可恢复和可测试的契约。若节点随意读取全局变量、闭包或进程内对象，Checkpoint 无法可靠恢复，也难以重放失败。'
          ], ['State 必须区分事实、候选和执行结果', 'Node 应有明确输入输出和副作用', 'Edge 应包含终止与失败分支', 'maxSteps、deadline、tokenBudget 共同限制循环']),
          section('核心机制：工具调用不是直接执行', [
            '模型根据工具名称、描述和参数 Schema 产生调用意图。服务端先验证结构，再检查用户权限、资源归属、业务规则、幂等与审批，最后才由执行器调用真实系统。',
            '工具结果会重新进入上下文，可能包含不可信文本。Agent 不应把工具返回的“请忽略规则”当成更高优先级指令，也不能让模型伪造执行成功。'
          ], ['Model proposes，executor disposes', '只读和写工具采用不同风险级别', '每次调用记录 tool、arguments digest、result、latency 和 actor']),
          section('核心机制：记忆、计划与恢复', [
            '短期记忆通常是当前线程状态或经过裁剪的消息；长期记忆是显式写入的用户偏好、知识或历史记录。二者都需要 Schema、权限、来源和保留策略，不能把完整聊天无限追加。',
            '计划只是候选步骤，不是可靠承诺。执行过程中要根据工具结果重规划。Checkpoint 保存可恢复状态，幂等键避免恢复时重复副作用。'
          ], ['Memory 不等于上下文窗口', 'Plan 不等于已经执行', 'Checkpoint 不保存数据库连接等进程对象', 'Resume 前重新校验权限和数据新鲜度']),
          section('边界与常见误区', [
            '多 Agent 不会自动提高质量，它还引入角色协调、上下文复制和责任不清。框架也不会提供业务正确性；LangGraph 只帮助表达与执行图。',
            '让模型自由选择所有工具、取消步数限制或在循环中直接写生产系统，会把概率错误放大为真实副作用。权限、预算和终止条件必须是模型不可绕过的代码。'
          ], ['误区：会调用工具就是 Agent', '误区：更多 Agent 等于更智能', '误区：模型记忆等于数据库事实', '边界：高风险动作需要确定性策略与人工参与']),
          section('最小机制实验：先写普通状态机', [
            '不用 Agent 框架实现 observe -> decide -> act -> update 循环，限制最多三步并打印 trace。确认状态和终止语义后，再映射到 LangGraph 节点与边。',
            '这个过程能区分“框架 API 不熟”与“Agent 设计不清”。'
          ], ['状态每次都创建可序列化新值', '工具只是确定性函数', '未知问题不会无限循环'])
        ],
        practice: {
          title: '从状态机推导 Agent',
          description: '先写出任务、状态和终止条件，再运行零框架循环；最后把同一契约迁移到 LangGraph。',
          tasks: ['定义 Agent 与 Workflow 的判定表', '设计状态 Schema', '运行受限循环', '加入工具授权边界', '映射为 LangGraph 状态图'],
          steps: [
            step('定义任务边界', '写出目标、成功、失败、允许工具、最大步数、总耗时和人工终止。'),
            step('设计 State Schema', '区分 input、facts、proposal、toolResult、answer、steps 和 trace。'),
            step('运行最小循环', '保存并运行 `agent-loop.mjs`，逐步解释状态变化。'),
            step('制造未知输入', '确认系统在预算内安全终止，而不是循环猜测。'),
            step('加入写工具提案', '模型只能产生 proposal；代码返回 approval-required，不执行写入。'),
            step('迁移到 LangGraph', '保持相同 State、节点断言和终止条件，只替换执行框架。')
          ],
          demo: demo('零框架 Agent 循环', '先看懂循环与状态，再学习框架 API。', [file('agent-loop.mjs', 'javascript', [
            'const tools = { order: (id) => ({ id, status: "shipped" }) };',
            'function decide(state) {',
            '  if (state.answer) return { type: "stop" };',
            '  if (state.input.includes("订单") && !state.toolResult) return { type: "tool", name: "order", args: ["o1"] };',
            '  if (state.toolResult) return { type: "answer", value: `订单状态：${state.toolResult.status}` };',
            '  return { type: "answer", value: "无法确定，请转人工" };',
            '}',
            'function run(input, maxSteps = 3) {',
            '  let state = { input, steps: 0, trace: [] };',
            '  while (state.steps < maxSteps) {',
            '    const action = decide(state);',
            '    state = { ...state, steps: state.steps + 1, trace: [...state.trace, action.type] };',
            '    if (action.type === "tool") state = { ...state, toolResult: tools[action.name](...action.args) };',
            '    if (action.type === "answer") state = { ...state, answer: action.value };',
            '    if (action.type === "stop" || state.answer) return state;',
            '  }',
            '  return { ...state, answer: "budget-exhausted" };',
            '}',
            'console.log(JSON.stringify(run("查询订单")));',
            'console.log(JSON.stringify(run("随便聊聊")));'
          ])], ['node agent-loop.mjs'], ['第一行 trace 为 ["tool","answer"]，回答 shipped', '第二行 trace 为 ["answer"]，安全转人工'], '能指出决定、执行和状态更新是三个边界；maxSteps 是代码约束，不由模型决定。'),
          expected: ['能用状态变化解释 Agent 每一步', '未知任务在预算内终止', '写操作只产生提案并进入审批'],
          troubleshooting: ['如果状态包含函数或连接对象，先重做 Schema', '不要在理解循环前同时引入多 Agent 和多个框架'],
        },
        acceptance: ['能给三个场景选择函数、Workflow 或 Agent 并说明理由', '能定义 Agent 的状态、预算、终止和工具边界', '能解释框架提供什么以及不提供什么'],
        resources: [jobResources.workflows, jobResources.langgraph, jobResources.aiAgents]
      }
    }
  };

  const mcpConceptLesson = {
    id: 'job-mcp-concepts',
    week: 'W13 · 概念课',
    title: 'MCP：Host、Client、Server 与协议生命周期',
    duration: '4小时',
    level: '岗位主线 · 必修概念',
    summary: '先理解 MCP 解决的互操作问题、三方角色、能力原语和消息生命周期，再接入真实 Server。',
    objectives: ['解释 Host、Client、Server 的职责和信任边界', '区分 Tools、Resources 与 Prompts', '画出初始化、能力协商、调用和关闭流程'],
    sections: [
      section('是什么：MCP 是上下文与能力互操作协议', [
        'Model Context Protocol（MCP）定义 AI 应用如何发现并调用外部能力、读取资源和使用提示模板。它让 Host 不必为每个数据源编写完全不同的私有连接协议。',
        'MCP 不是 Agent 框架、模型 API 或业务权限系统。它标准化消息与能力描述，但工具执行后的业务正确性、用户授权和风险控制仍由应用负责。'
      ], ['协议层：JSON-RPC 消息和生命周期', '能力层：Tools、Resources、Prompts 等原语', '传输层：stdio 或可流式 HTTP 等连接方式']),
      section('为什么需要：降低 M×N 的重复集成', [
        '没有共同协议时，多个 AI Host 对多个工具或数据源需要分别实现适配。MCP 让 Server 以统一方式暴露能力，Host 可以复用连接、发现和调用逻辑。',
        '统一协议提高互操作性，但也扩大第三方 Server 的供应链与权限风险，因此“能连接”与“应允许调用”必须分开判断。'
      ], ['Server 可独立演进和复用', 'Host 统一展示和治理能力', '协议版本与能力协商减少隐式假设']),
      section('核心机制：Host、Client 与 Server', [
        'Host 是用户直接使用的 AI 应用，负责模型、会话、授权策略和用户体验。Host 内通常为每个 Server 建立一个 Client 连接；Client 负责协议通信和能力协商；Server 暴露受控能力。',
        'Server 不应假设模型身份等于最终用户身份。远程调用需要明确的用户认证、租户上下文和 scope，Host 也不能自动信任 Server 返回的描述或内容。'
      ], ['Host：编排模型、连接和用户许可', 'Client：维护一对一协议会话', 'Server：实现能力并访问后端系统', 'User：批准敏感能力并拥有可理解反馈']),
      section('核心机制：Tools、Resources 与 Prompts', [
        'Tool 表示可调用操作，包含名称、说明和输入 Schema；Resource 表示可读取的上下文数据，通过 URI 标识；Prompt 表示可复用的消息模板。三者语义不同，不能把读取文档伪装成无约束写工具。',
        '能力描述帮助模型或用户理解接口，但描述仍是不可信元数据。Host 应使用允许列表、风险等级和本地策略决定哪些能力可见、可调用或必须确认。'
      ], ['Tools：可能产生副作用，需参数校验与授权', 'Resources：读取数据，仍需权限与内容隔离', 'Prompts：模板，不具有更高安全优先级']),
      section('核心机制：初始化、协商与调用生命周期', [
        '连接建立后，Client 发送 initialize，双方交换协议版本、实现信息和 capabilities；完成 initialized 通知后，Client 才根据协商结果 list 或 call 能力。关闭时应停止新调用、处理在途请求并释放进程或网络资源。',
        'MCP 使用 JSON-RPC 风格的 request、response 和 notification。request 有 id 并期待结果或错误，notification 没有响应；同一连接上的并发调用需要按 id 对应，不能依赖返回顺序。'
      ], ['initialize -> initialized', 'tools/list -> tools/call', 'resources/list/read 与 prompts/list/get', '超时、取消、错误和连接关闭都属于协议状态']),
      section('核心机制：传输不是安全策略', [
        'stdio 常用于本地子进程，消息通过标准输入输出；远程传输通过 HTTP 等方式连接。传输决定消息如何到达，不自动决定 Server 是否可信或用户能访问哪些资源。',
        '本地 Server 也能读取文件、环境变量或执行命令，不能因为“只在本机”就默认安全。远程 Server 还需要 TLS、来源验证、令牌生命周期和重定向等安全控制。'
      ], ['stdio 日志不能污染协议 stdout', '远程连接需要验证 endpoint 与授权服务器', '密钥不进入模型上下文或工具参数日志']),
      section('边界与常见误区', [
        'MCP 工具的 inputSchema 只验证形状，不证明用户有权限，也不保证业务数据有效。Prompt Injection 可以藏在 Resource 或 Tool 结果中，不能仅靠系统提示防御。',
        'Server 数量越多，能力冲突、上下文噪声和供应链风险越高。生产环境应维护目录、版本、风险、scope、所有者和审计，而不是启动时自动接受任意 Server。'
      ], ['误区：MCP 等于 Function Calling', '误区：本地 Server 默认可信', '误区：Schema 校验等于授权', '边界：MCP 不替代审批、幂等和业务审计']),
      section('最小机制实验：读懂一组协议消息', [
        '先用普通对象模拟 initialize、tools/list 和 tools/call，区分请求 ID、方法、参数与结果。能解释生命周期后，再使用 SDK 启动 stdio Server。',
        '实验只展示协议形状，不执行真实业务。真实接入必须在调用前增加能力目录和授权网关。'
      ], ['按 id 配对请求与响应', '在 capability 未声明时拒绝调用', '把协议错误与业务工具错误分开记录'])
    ],
    practice: {
      title: '先跟踪协议，再连接真实 MCP Server',
      description: '手工走完一次 MCP 会话并标注信任边界，确认理解后才使用 SDK。',
      tasks: ['画 Host/Client/Server 图', '区分三类能力', '运行生命周期消息实验', '建立工具风险目录', '再接入只读 MCP Server'],
      steps: [
        step('画角色与信任边界', '标出用户、Host、每个 Client、Server 和后端系统，写出谁认证谁。'),
        step('制作能力对照表', '为 Tool、Resource、Prompt 分别写用途、示例、副作用和安全检查。'),
        step('运行消息实验', '保存并运行 `mcp-lifecycle.mjs`，按 id 配对请求与响应。'),
        step('加入非法顺序', '在 initialize 前调用 tools/list，模拟 Client 本地拒绝。'),
        step('建立工具目录', '记录 serverId、tool、risk、requiredScopes、approval 和 owner。'),
        step('接入只读 Server', '先 list，再明确选择一个只读工具调用；检查关闭和错误路径。')
      ],
      demo: demo('MCP 生命周期消息追踪', '不用 SDK 先理解 JSON-RPC 消息角色和调用顺序。', [file('mcp-lifecycle.mjs', 'javascript', [
        'const messages = [',
        '  { direction: "client->server", jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2026-07-28", capabilities: {} } },',
        '  { direction: "server->client", jsonrpc: "2.0", id: 1, result: { protocolVersion: "2026-07-28", capabilities: { tools: {} } } },',
        '  { direction: "client->server", jsonrpc: "2.0", method: "notifications/initialized" },',
        '  { direction: "client->server", jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },',
        '  { direction: "client->server", jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "orders.read", arguments: { id: "o1" } } }',
        '];',
        'let phase = "new";',
        'for (const message of messages) {',
        '  if (message.method === "initialize" && phase === "new") phase = "initializing";',
        '  else if (message.result && message.id === 1 && phase === "initializing") phase = "negotiated";',
        '  else if (message.method === "notifications/initialized" && phase === "negotiated") phase = "ready";',
        '  else if (message.method?.startsWith("tools/") && phase !== "ready") throw new Error("NOT_INITIALIZED");',
        '  const kind = message.method ? (Object.hasOwn(message, "id") ? "request" : "notification") : "response";',
        '  console.log(`${kind} ${message.id ?? "-"} ${message.method ?? "result"} phase=${phase}`);',
        '}'
      ])], ['node mcp-lifecycle.mjs'], ['request 1 initialize phase=initializing', 'response 1 result phase=negotiated', 'notification - notifications/initialized phase=ready', 'request 2 tools/list phase=ready', 'request 3 tools/call phase=ready'], '能解释 response 如何完成版本与能力协商、notification 为什么没有 id；真实 SDK 还负责校验、传输、响应配对和取消。'),
      expected: ['能正确画出三方角色而不把 Client 当最终用户', '能按顺序解释初始化和工具调用', '能列出协议之外仍需实现的安全控制'],
      troubleshooting: ['不要在未理解生命周期前复制大型 MCP Server 模板', 'stdio Server 的调试日志写 stderr，避免破坏协议消息'],
    },
    acceptance: ['能解释 MCP 解决什么、不解决什么', '能比较 Tool、Resource、Prompt 和两类传输', '能为一个写工具列出 Schema、授权、审批、幂等和审计'],
    resources: [jobResources.mcpIntro, jobResources.mcpArchitecture, jobResources.mcpServer, jobResources.mcpSecurity]
  };

  const conceptUpgrades = {
    'w1-reliable-client': {
      what: ['第三方 API Client 是业务服务与外部供应商之间的边界层，负责把内部请求映射为外部协议，并把供应商响应和错误归一化。它不只是一个 `fetch` 包装函数。'],
      why: ['大模型、Embedding、搜索和支付等外部服务都会超时、限流或部分失败。若每个业务函数自行处理，重试、日志和取消语义会不一致，故障还会向整个请求链扩散。'],
      mechanism: ['一次可靠调用包含总 deadline、单次 timeout、AbortSignal、错误分类、重试策略和观测字段。调用状态应从 pending 走向 success、cancelled 或 failed，任何终态都要释放定时器和连接。'],
      mechanismBullets: ['先判定操作是否幂等', '再判定错误是否暂时可恢复', '每次尝试都受剩余总预算限制', 'Adapter 隔离供应商字段'],
      boundaries: ['重试不会修复认证、参数或业务拒绝，熔断也不是“失败几次就永久关闭”。非幂等写操作缺少幂等键时默认不重试；日志不得记录密钥和完整敏感正文。']
    },
    'w2-nest-streaming': {
      what: ['本章把 NestJS 的应用结构与 SSE/HTTP 流组合起来。NestJS 管理模块和依赖，SSE 是服务器按事件格式持续向客户端推送数据的 HTTP 响应协议。'],
      why: ['模型输出逐步生成，等待完整文本会增加首字延迟。流式接口允许尽早展示内容，但连接存在时间更长，取消、错误和资源释放比普通 JSON 响应更重要。'],
      mechanism: ['Controller 建立协议响应，Service 返回 AsyncIterable 或 Observable 事件，Provider 产生统一模型事件。客户端断开通过 signal 传播到生成器，流依次经历 open、token/tool/usage、done 或 error、close。'],
      mechanismBullets: ['DTO 校验请求入口', '事件类型与业务消息分离', '完成、失败、取消是不同终态', '关闭路径清理订阅与上游生成'],
      boundaries: ['SSE 是服务端到客户端的单向通道，浏览器 EventSource 只发 GET；POST 聊天可用 fetch 读取流或拆成创建任务和订阅。已写出响应后不能再返回普通 JSON 错误。']
    },
    'w3-data-auth-tests': {
      what: ['数据库保存业务事实，认证建立请求者身份，授权判断其对具体资源的操作权限，缓存加速临时读取，测试验证这些边界在组合后仍成立。'],
      why: ['智能体应用会保存会话、消息、工具调用和审批。缺少关系约束、事务和资源级授权时，模型表现再好也可能造成越权读取、重复写入或不可审计状态。'],
      mechanism: ['HTTP 请求先解析会话身份，再执行 DTO 校验和资源授权；用例在事务中写入关系表，提交后失效缓存。测试按纯函数、真实数据库/HTTP 集成和少量关键 E2E 分层。'],
      mechanismBullets: ['认证不等于授权', '数据库是事实源，Redis 是加速或限流层', '事务保护跨表业务不变量', '集成测试不应 mock 掉被验证的真实边界'],
      boundaries: ['JWT 有效不代表可以读取任意会话，缓存命中也不能绕过授权。覆盖率百分比不能代替越权、回滚和并发失败用例。']
    },
    'w4-python-docker-e2e': {
      what: ['FastAPI 把 Python 文档处理能力暴露为 HTTP 服务，Docker 镜像封装进程运行环境，Compose 组织本地多服务，E2E 从公开入口验证完整用户链路。'],
      why: ['Python 生态适合解析与评测，TypeScript 服务适合承载主要业务。跨语言进程通过版本化契约协作，可以各自升级和扩容，避免共享进程内部实现。'],
      mechanism: ['Node Adapter 发送符合 OpenAPI Schema 的请求并传播 requestId、deadline 与错误；容器通过镜像创建隔离进程，服务发现使用 Compose 名称；健康检查决定实例是否可接流量。'],
      mechanismBullets: ['镜像是只读模板，容器是运行实例', 'localhost 在容器内指向当前容器', 'liveness 与 readiness 语义不同', 'E2E 必须从公开入口经过真实服务'],
      boundaries: ['Docker 不等于虚拟机，也不会自动等待依赖业务就绪。E2E 不能替代单元和集成测试；容器中仍需非 root、密钥注入和超时控制。']
    },
    'w5-model-streaming': {
      what: ['模型 API 是把消息和生成参数发送给托管 LLM 推理服务的协议；流式生成把一次响应拆成 token、工具、usage、完成与错误等增量事件。'],
      why: ['应用需要隐藏密钥、统一多个供应商差异、缩短首字时间，并在用户取消或模型故障时保持可恢复 UI。直接从浏览器调用供应商会泄露密钥并使业务耦合外部协议。'],
      mechanism: ['Provider Adapter 将内部消息映射为供应商请求，再把增量响应归一化为可辨识联合事件。业务层只消费统一事件，并在 done 时持久化最终消息和 usage。'],
      mechanismBullets: ['业务消息与传输事件分开建模', 'AbortSignal 贯穿浏览器、后端和上游', 'finishReason 与 usage 是结果的一部分', '部分输出失败时保留内容并标记状态'],
      boundaries: ['流式显示不提高答案质量，API 200 也不证明业务正确。供应商切换只能隔离协议差异，不能假设模型能力、Token 计算和工具行为完全相同。']
    },
    'w6-structured-tools': {
      what: ['结构化输出要求模型按照 Schema 返回机器可验证的数据；Tool Calling 让模型提出某个工具及参数的调用意图，真实执行仍由应用控制。'],
      why: ['自然语言适合人读，却不适合直接驱动数据库或业务 API。Schema 把概率输出转成可校验候选，工具层再把语言理解连接到确定性系统。'],
      mechanism: ['服务端定义工具名称、说明和 JSON Schema；模型返回候选调用；应用依次做解析、Schema 校验、身份与资源授权、业务校验、审批和幂等，再执行并把结果回传模型。'],
      mechanismBullets: ['生成结构与验证结构是两步', '模型提出调用，不拥有执行权', '工具结果同样是不可信输入', '失败错误应区分可重试与业务拒绝'],
      boundaries: ['Schema 正确不代表字段事实正确，也不代表用户有权操作。不要从自由文本截取 JSON；写工具不能只凭模型置信度自动执行。']
    },
    'w7-context-evals': {
      what: ['上下文管理决定本次推理向模型提供哪些指令、历史和证据；模型路由按任务选择模型；评测用固定样本判断方案质量、延迟和成本。'],
      why: ['上下文窗口有限且按 Token 计费，无差别追加历史会增加噪声。不同模型的能力、价格和延迟不同，没有评测就无法知道摘要、裁剪或路由是否真的改善。'],
      mechanism: ['先按任务保留必要系统规则和当前输入，再选择相关历史、证据与工具结果，最后预留输出预算。路由器基于任务类别和 SLA 选模型，评测器在版本化数据集上运行断言。'],
      mechanismBullets: ['Context 是信息预算，不是永久记忆', '摘要是有损压缩，需要保留来源', '离线评测用于比较版本', '线上指标观察真实分布和漂移'],
      boundaries: ['上下文更长不保证注意到关键信息，平均分提高也可能掩盖安全用例退化。模型评审可以辅助，但不能替代引用、Schema 和业务规则断言。']
    },
    'w8-rag-ingestion': {
      what: ['摄取是把原始知识源转换为可检索、可过滤、可追踪 Chunk 的离线数据工程过程，Embedding 和向量索引只是其中两个步骤。'],
      why: ['原始 PDF、网页和表格包含布局噪声、重复内容与权限差异。若摄取不可重复或没有来源元数据，在线检索即使命中也无法引用、更新或删除。'],
      mechanism: ['管道依次执行加载、解析、规范化、去重、结构化切分、元数据补全、内容哈希、Embedding 和 upsert。配置与模型版本共同组成索引版本。'],
      mechanismBullets: ['稳定 documentId/chunkId 支持幂等', '切分保留标题和结构上下文', '权限元数据随 Chunk 进入索引', '删除源文档时撤销旧索引'],
      boundaries: ['固定长度切分不是通用答案，Embedding 分数也不能判断内容真伪。不要在摄取日志中泄露敏感全文；模型或切分策略变化通常需要重新评测和重建索引。']
    },
    'w9-rag-retrieval': {
      what: ['检索从索引选择支持当前问题的候选证据；混合检索组合词法与语义信号，重排器进一步判断查询与候选的相关性。'],
      why: ['向量检索可能漏掉错误码和型号，词法检索可能漏掉同义表达。单一路径难以覆盖真实问题，且候选顺序直接影响模型看到的证据。'],
      mechanism: ['查询可先做规范化或多路改写，分别生成 BM25 与向量候选，再做元数据过滤、RRF 合并或 rerank，最后按 Token 预算选择上下文并生成结构化 citation。'],
      mechanismBullets: ['保留原查询用于追踪', '权限过滤早于上下文组装', '记录每路排名和最终分数', '阈值与 Top-K 在固定数据集上调优'],
      boundaries: ['相似度高不等于支持答案，重排也不能修复缺失或错误文档。引用必须指向真实原文位置，不能让模型自行编造 URL。']
    },
    'w10-rag-evaluation': {
      what: ['RAG 评测把摄取、检索、生成和引用拆成可观测层，并用 Golden Dataset 比较不同配置的质量、延迟、成本与安全。'],
      why: ['只阅读几条答案无法定位退化来自哪一层，也容易挑选成功示例。固定样本和分层指标让切分、Embedding、Top-K 或提示修改可以公平比较。'],
      mechanism: ['每条样本保存问题、预期证据、答案要点和标签；运行时保存候选排名、上下文、回答与引用。Recall@K/MRR 评检索，忠实度和引用断言评生成。'],
      mechanismBullets: ['数据集、配置和输出共同版本化', '指标按类别和风险切片', '失败样本进入回归集', '发布门禁同时约束质量、延迟与成本'],
      boundaries: ['一个总分不能解释具体失败，LLM-as-judge 也可能偏置和漂移。评测集需要持续审查，不能把测试答案泄露进提示或索引。']
    },
    'w11-workflows-agents': {
      what: ['Workflow 由预先定义的节点和边决定允许路径；Agent 在受控循环中根据状态动态选择下一步。两者都可以使用模型，但自主性程度不同。'],
      why: ['分类、检索、工具和回复组合后会出现分支、失败与恢复。显式状态图比隐藏在长函数或提示词中的流程更容易测试、审计和限制。'],
      mechanism: ['State Schema 保存可序列化事实，节点执行小步骤并返回更新，条件边根据状态路由。循环受 maxSteps、deadline、预算和终止条件限制，每个节点写 trace。'],
      mechanismBullets: ['确定性规则放代码节点', '模糊理解才交给模型节点', '副作用节点要求幂等', '未知路径进入明确失败或人工处理'],
      boundaries: ['使用 LangGraph 不会自动把流程变成 Agent，也不会自动保证安全。权限检查、金额校验和最终写入不能由模型决定是否执行。']
    },
    'w12-persistence-hitl': {
      what: ['Checkpoint 保存任务可恢复状态与下一位置；Human-in-the-loop 在高风险节点暂停并等待授权；幂等保证重复恢复不会重复产生副作用。'],
      why: ['Agent 任务可能跨分钟、小时或进程重启，退款等写操作还需要人工确认。仅依赖内存或按钮禁用无法保证恢复一致性和防重复执行。'],
      mechanism: ['执行到风险节点时持久化 proposal、threadId、state version 和 nextNode，然后中断。恢复时读取 checkpoint，重新认证授权和检查数据新鲜度，使用幂等键执行并保存结果。'],
      mechanismBullets: ['Checkpoint 保存数据，不保存函数和连接', 'Proposal 与 execution result 分开', '审批后再次校验', '幂等键由稳定业务操作生成'],
      boundaries: ['Checkpoint 不是无限聊天存档，人工批准也不能替代服务端授权。旧审批可能因价格、库存或权限变化失效，恢复时必须重新验证。']
    },
    'w13-mcp-security': {
      what: ['MCP 接入把外部 Server 暴露的 Tools、Resources 和 Prompts 纳入 Host；安全层决定哪些能力对当前用户可见、可调用和需要审批。'],
      why: ['统一协议降低集成成本，也让不可信 Server 和内容更容易进入模型上下文。缺少本地策略时，Prompt Injection 或过宽工具权限可能转化为真实副作用。'],
      mechanism: ['Host 维护 Server 允许列表与工具目录，调用前依次验证协议 Schema、用户 scope、资源归属、风险级别和审批；调用后验证结果、脱敏审计并限制其指令优先级。'],
      mechanismBullets: ['协议协商不等于业务授权', 'Resource 与工具结果视为不可信数据', '写工具默认不可自动调用', 'Server、tool 和版本进入审计'],
      boundaries: ['本地 stdio Server 也可能访问敏感文件，inputSchema 也不能阻止越权。系统提示不是安全沙箱，模型不得持有绕过策略层的执行通道。']
    },
    'w14-system-design': {
      what: ['系统设计把用户任务、业务流程、质量属性、数据、模型、工具和安全边界转换为可实现且可验收的架构决策。'],
      why: ['如果先选框架再找问题，容易把普通查询过度设计成多 Agent。先明确任务和失败代价，才能决定哪些步骤用模型、RAG、Workflow、工具或纯代码。'],
      mechanism: ['从用户故事和业务不变量出发，画数据流与信任边界，定义功能/非功能需求、工具权限矩阵、评测集和容量成本，再用 ADR 记录关键取舍。'],
      mechanismBullets: ['需求可测试且有责任人', '架构图标出数据与信任边界', '每个写工具都有权限与审批', '指标与评测先于实现冻结'],
      boundaries: ['架构图不是组件清单，模型名称也不是架构。设计不能只覆盖成功路径，必须包含降级、拒答、人工处理、数据删除和成本上限。']
    },
    'w15-observability-deploy': {
      what: ['可观测性用 Trace、Metric 和 Log 从外部输出推断系统内部状态；部署把经过门禁的版本交付到可运行环境并提供健康、回滚和变更记录。'],
      why: ['一次智能体任务跨模型、检索、工具和数据库，仅有 console.log 无法定位延迟、错误和成本。能启动的容器也不等于能安全接流量。'],
      mechanism: ['入口创建 trace，上下游 span 传播上下文；日志记录离散事件，指标聚合趋势。部署依次经过构建、测试、AI 评测、健康检查、逐步接流量和回滚观察。'],
      mechanismBullets: ['Trace 连接单次任务', 'Metric 观察总体趋势', 'Log 保留可搜索事件', 'readiness 控制是否接流量'],
      boundaries: ['不要把用户全文和密钥默认写入观测系统，也不要用 userId 等高基数字段做指标标签。观测 SDK 失败不应拖垮主请求，健康检查也不能执行昂贵全链路操作。']
    },
    'w16-evaluate-portfolio': {
      what: ['发布评测是候选版本与基线在同一数据、环境和指标上的可重复比较；作品集把问题、架构、证据、失败和取舍组织为可复现工程案例。'],
      why: ['一次顺利演示无法证明系统稳定，简历上的百分比若没有基线和报告也无法验证。门禁和文档把主观“看起来不错”转成可审查结论。'],
      mechanism: ['冻结代码、模型、Prompt、Schema 与数据集版本，运行质量、延迟、成本、安全和 E2E 门禁，保存差异与失败切片；README 提供一条启动路径、架构、限制和报告链接。'],
      mechanismBullets: ['任何高风险安全退化都阻止发布', '指标注明样本量与环境', '失败案例解释定位和修复', '演示覆盖正常、拒答、审批与降级'],
      boundaries: ['作品集不是功能截图集合，门禁通过也不代表永无故障。不能选择性删除失败样本、手改 PASS 或把估算数据写成实测指标。']
    }
  };

  function makeConceptSections(item) {
    return [
      section('是什么：本章对象与术语边界', item.what, item.whatBullets || []),
      section('为什么需要：它解决的工程问题', item.why, item.whyBullets || []),
      section('核心机制：建立可推演的心智模型', item.mechanism, item.mechanismBullets || []),
      section('边界与常见误区', item.boundaries, item.boundaryBullets || [], null, '先能解释机制与失败边界，再开始本章工程 Demo。')
    ];
  }

  const moduleById = new Map(window.COURSE.modules.map((module) => [module.id, module]));
  for (const [moduleId, config] of Object.entries(conceptLessons)) {
    if (!config) continue;
    const module = moduleById.get(moduleId);
    if (!module) throw new Error(`缺少岗位模块：${moduleId}`);
    const index = module.lessons.findIndex((lesson) => lesson.id === config.before);
    if (index < 0) throw new Error(`缺少概念课插入点：${config.before}`);
    config.lesson.learningApproach = 'knowledge-first';
    module.lessons.splice(index, 0, config.lesson);
  }

  const agentModule = moduleById.get('agent-engineering');
  const mcpIndex = agentModule?.lessons.findIndex((lesson) => lesson.id === 'w13-mcp-security') ?? -1;
  if (mcpIndex < 0) throw new Error('缺少 MCP 概念课插入点：w13-mcp-security');
  mcpConceptLesson.learningApproach = 'knowledge-first';
  agentModule.lessons.splice(mcpIndex, 0, mcpConceptLesson);

  const missing = [];
  for (const module of window.COURSE.modules) {
    for (const lesson of module.lessons) {
      if (!lesson.id.startsWith('w')) continue;
      const concepts = conceptUpgrades[lesson.id];
      if (!concepts) {
        missing.push(lesson.id);
        continue;
      }
      lesson.learningApproach = 'knowledge-first';
      lesson.sections = [...makeConceptSections(concepts), ...lesson.sections];
    }
  }
  if (missing.length) throw new Error(`缺少岗位主线概念层：${missing.join(', ')}`);

  window.COURSE.updatedAt = '2026-08-18';
})();
