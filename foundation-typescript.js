(function () {
  const F = window.FOUNDATION_COURSE;
  const { code, section, step, practice, lesson, resources } = F;

  F.modules.push({
    id: 'typescript-foundation',
    title: 'TypeScript 基础（F1-F2）',
    icon: 'braces',
    phase: F.phase,
    lessons: [
      lesson({
        id: 'ts-setup-tsconfig',
        week: 'F1-01',
        title: '环境、编译流程与 tsconfig',
        duration: '90分钟',
        level: '零基础',
        summary: '建立第一个严格模式 TypeScript 项目，理解源码、类型检查、编译产物和运行时之间的关系。',
        objectives: ['理解 Node.js 24 直接执行部分 TypeScript 与完整编译流程的边界', '掌握 `tsc --noEmit` 与编译输出的区别', '会配置严格模式和常用目录选项'],
        sections: [
          section(
            'TypeScript 在运行链路中的位置',
            [
              'TypeScript 是 JavaScript 的静态类型层。Node.js 24 可以通过类型剥离直接执行一部分只含可擦除类型语法的 `.ts` 文件，但它不会完整读取 `tsconfig`、执行类型检查或支持所有需要转换的 TypeScript 语法。生产项目仍应使用 `tsc --noEmit` 检查，并通过编译器或构建工具生成 JavaScript。',
              '`tsc` 有两项核心工作：检查类型，以及按配置生成 JavaScript。开发阶段可以使用 `tsc --noEmit` 只做检查；构建阶段再把 `src` 编译到 `dist`。'
            ],
            ['源码：`src/*.ts`', '类型检查：`npx tsc --noEmit`', '编译产物：`dist/*.js`', '运行：`node dist/index.js`'],
            code('typescript', [
              'const course: string = "TypeScript 基础";',
              'const hours: number = 12;',
              '',
              'console.log(`${course}: ${hours} 小时`);'
            ])
          ),
          section(
            'strict 模式为什么必须开启',
            [
              '`strict` 会启用一组更严格的检查，例如空值、函数参数和属性初始化。转型项目要处理模型输出、数据库记录和外部 API，这些边界最容易出现空值和类型漂移，因此不要通过关闭 strict 来消除报错。',
              '`noUncheckedIndexedAccess` 会让数组或字典索引结果包含 `undefined`，迫使代码处理“键不存在”的真实情况。'
            ],
            ['`strict: true`', '`noUncheckedIndexedAccess: true`', '`exactOptionalPropertyTypes: true`', '`noImplicitOverride: true`'],
            code('json', [
              '{',
              '  "compilerOptions": {',
              '    "target": "ES2022",',
              '    "module": "NodeNext",',
              '    "moduleResolution": "NodeNext",',
              '    "rootDir": "src",',
              '    "outDir": "dist",',
              '    "strict": true,',
              '    "noUncheckedIndexedAccess": true,',
              '    "exactOptionalPropertyTypes": true',
              '  },',
              '  "include": ["src/**/*.ts"]',
              '}'
            ])
          ),
          section(
            '编译错误与运行错误不是一回事',
            [
              '类型错误表示代码与声明的契约冲突；运行错误表示实际执行时发生异常。通过类型检查只能减少一部分错误，不能替代输入校验、异常处理和测试。',
              '使用 `@ts-ignore` 会直接跳过下一行检查。基础阶段不要使用它；先理解错误，再修正类型或业务逻辑。'
            ],
            ['红色类型提示要读完整', '不要把 `any` 当作快速修复', '第三方输入必须做运行时校验']
          )
        ],
        practice: practice(
          '从零创建严格模式项目',
          '完成初始化、类型检查、编译和运行四个步骤，并观察一个故意制造的类型错误。',
          [
            step('初始化项目', '在 `foundations/typescript/f1-01-setup` 中创建 npm 项目并安装 TypeScript。', code('powershell', [
              'mkdir foundations/typescript/f1-01-setup',
              'cd foundations/typescript/f1-01-setup',
              'npm init -y',
              'npm pkg set type=module',
              'npm install --save-dev typescript @types/node',
              'npx tsc --init'
            ])),
            step('写入配置', '将生成的 `tsconfig.json` 精简为本章示例中的严格配置，并在 `package.json` 增加 `typecheck`、`build`、`start` 三个脚本。', code('json', [
              '"scripts": {',
              '  "typecheck": "tsc --noEmit",',
              '  "build": "tsc",',
              '  "start": "node dist/index.js"',
              '}'
            ])),
            step('创建入口文件', '创建 `src/index.ts`，声明课程名和学习时长并输出。', code('typescript', [
              'const courseName: string = "AgentPath";',
              'const weeklyHours: number = 12;',
              'console.log(`${courseName} 每周 ${weeklyHours} 小时`);'
            ])),
            step('依次检查、构建和运行', '三个命令都必须成功；检查 `dist/index.js`，确认类型注解已被移除。', code('powershell', [
              'npm run typecheck',
              'npm run build',
              'npm start'
            ])),
            step('制造并修复错误', '把 `weeklyHours` 的值改为字符串，再执行类型检查。记录错误编号、含义和你的修复。')
          ],
          ['终端输出 `AgentPath 每周 12 小时`', '`dist/index.js` 可以由 Node.js 直接运行', '学习日志包含一次真实的 `TS2322` 错误和修复说明'],
          ['`tsc` 不是内部或外部命令：确认使用 `npx tsc`，并检查依赖是否安装', 'NodeNext 下相对导入后续需要写 `.js` 扩展名，这是输出模块解析规则，不是笔误']
        ),
        acceptance: ['能画出 TS 源码到 JS 运行的链路', '能独立配置严格模式项目', '不靠关闭检查解决类型错误'],
        resources: [resources.tsInstall, resources.tsConfig]
      }),
      lesson({
        id: 'ts-primitives-collections',
        week: 'F1-02',
        title: '基本类型、数组、元组与空值',
        duration: '100分钟',
        level: '基础',
        summary: '掌握类型推断、基本类型、集合与空值处理，建立 `unknown` 优先于 `any` 的习惯。',
        objectives: ['正确选择基本类型和集合类型', '区分 `null`、`undefined` 与属性缺失', '使用 `unknown` 安全接收未知数据'],
        sections: [
          section(
            '类型推断与显式注解',
            [
              '变量有明确初始值时，TypeScript 通常能推断类型。重复写 `const name: string = "Lin"` 没有额外价值；函数参数、返回值、空数组和公共对象边界更值得显式声明。',
              '字面量通过 `const` 声明时通常会保留更窄的类型，而 `let` 需要允许后续赋值，往往会拓宽为 `string` 或 `number`。'
            ],
            ['优先让编译器推断局部变量', '公共函数边界显式声明', '空数组必须提供元素类型'],
            code('typescript', [
              'const appName = "AgentPath";     // string',
              'let status = "idle";            // string',
              'const tags: string[] = [];',
              'const point: readonly [number, number] = [30.5, 104.1];'
            ])
          ),
          section(
            '数组、只读数组与元组',
            [
              '数组表示同类元素的集合；元组表示固定位置具有固定含义的短结构。API 业务对象通常应使用对象而不是长元组，因为对象字段名更清晰。',
              '`readonly` 只限制当前引用的修改操作，不会在运行时冻结对象。需要运行时不可变时还要使用 `Object.freeze` 或不可变更新策略。'
            ],
            ['`string[]` 与 `Array<string>` 等价', '`readonly string[]` 不允许 `push`', '元组适合坐标、键值对等固定短结构']
          ),
          section(
            'null、undefined、unknown 与 any',
            [
              '`undefined` 常表示没有赋值或属性不存在，`null` 常由业务主动表示“没有值”。两者是否允许必须体现在类型中。可选属性 `name?: string` 与 `name: string | undefined` 在精确可选属性模式下并不完全相同。',
              '`unknown` 接受任何值，但使用前必须检查；`any` 允许值绕过后续检查并持续污染调用链。API 的 `response.json()`、消息事件和文件解析结果都应从 `unknown` 开始。'
            ],
            [],
            code('typescript', [
              'function printLength(value: unknown): number {',
              '  if (typeof value === "string") return value.length;',
              '  if (Array.isArray(value)) return value.length;',
              '  return 0;',
              '}'
            ]),
            '不要用 `value as string` 代替检查。类型断言只改变编译器的看法，不会改变真实值。'
          )
        ],
        practice: practice(
          '实现课程统计器',
          '从一组课程记录中统计总时长、已完成数量和标签，所有数据结构都要有明确类型。',
          [
            step('建立模型', '创建 `src/course-stats.ts`，定义课程状态、课程对象和统计结果。', code('typescript', [
              'type CourseStatus = "todo" | "learning" | "done";',
              '',
              'interface Course {',
              '  id: string;',
              '  title: string;',
              '  minutes: number;',
              '  status: CourseStatus;',
              '  tags: readonly string[];',
              '  note?: string;',
              '}',
              '',
              'interface CourseStats {',
              '  totalMinutes: number;',
              '  completed: number;',
              '  tags: string[];',
              '}'
            ])),
            step('准备测试数据', '创建至少 3 条记录，其中一条不包含 `note`，标签存在重复。'),
            step('实现统计函数', '使用 `reduce` 计算时长与完成数，使用 `Set` 去重标签；函数返回值必须声明为 `CourseStats`。'),
            step('增加空数组用例', '空数组应返回 0、0 和空标签，不得产生 `NaN`。'),
            step('验证 unknown', '增加 `printLength` 的字符串、数组、数字三个调用并记录输出。')
          ],
          ['3 条记录的总时长和完成数正确', '标签去重且输入数组未被修改', '`npm run typecheck` 通过且没有 `any`'],
          ['`reduce` 推断失败时给初始值显式添加 `CourseStats`', '索引访问得到 `undefined` 时先判断，不要使用非空断言 `!`']
        ),
        acceptance: ['能解释推断与注解的边界', '能安全处理空值和未知值', '集合类型与业务语义匹配'],
        resources: [resources.tsEveryday, resources.tsObjects]
      }),
      lesson({
        id: 'ts-object-modeling',
        week: 'F1-03',
        title: '对象建模：interface、type 与联合类型',
        duration: '110分钟',
        level: '基础',
        summary: '用对象契约和联合类型表达业务规则，避免用大量可选字段制造非法状态。',
        objectives: ['区分接口、类型别名和交叉类型', '用字面量联合表达有限状态', '使用可辨识联合排除非法组合'],
        sections: [
          section(
            'interface 与 type 的实际选择',
            [
              '`interface` 直接表达对象形状，支持继承和声明合并；`type` 可以给任何类型起别名，尤其适合联合、元组和映射类型。项目中保持一致即可，不需要为了性能选择，因为它们都会在编译后消失。',
              '组合对象时优先确保字段含义不冲突。交叉类型若把同一字段交叉成不可能类型，结果可能变成 `never`。'
            ],
            ['对象公开契约常用 interface', '状态联合、函数签名、工具类型组合常用 type', '不要用继承复制不相关字段'],
            code('typescript', [
              'interface BaseTask { id: string; title: string }',
              'interface TimedTask extends BaseTask { dueAt: string }',
              'type TaskId = string;',
              'type Priority = "low" | "medium" | "high";'
            ])
          ),
          section(
            '字面量联合比裸字符串更可靠',
            [
              '当值只允许有限集合时，应使用字面量联合。这样拼写错误会在编译期暴露，编辑器也能自动补全。枚举适合需要运行时对象或与外部数值协议对齐的场景，普通业务状态优先使用联合类型。'
            ],
            [],
            code('typescript', [
              'type TaskStatus = "todo" | "doing" | "done";',
              '',
              'function moveTask(status: TaskStatus): TaskStatus {',
              '  if (status === "todo") return "doing";',
              '  return "done";',
              '}'
            ])
          ),
          section(
            '可辨识联合让非法状态无法表示',
            [
              '如果把成功数据、错误信息和加载状态都放进一个对象并设为可选，代码可能得到“成功但没有数据”这种非法组合。可辨识联合通过公共字段 `status` 区分分支，每个分支只保留合法字段。',
              '这类模型非常适合请求状态、模型流式事件和工具调用结果。'
            ],
            [],
            code('typescript', [
              'type Result<T> =',
              '  | { status: "ok"; data: T }',
              '  | { status: "error"; error: string }',
              '  | { status: "loading" };',
              '',
              'function render(result: Result<string>): string {',
              '  if (result.status === "ok") return result.data;',
              '  if (result.status === "error") return result.error;',
              '  return "加载中";',
              '}'
            ])
          )
        ],
        practice: practice(
          '重构异步任务状态',
          '把一个包含多个可选字段的任务状态重构为可辨识联合，并实现状态渲染和合法迁移。',
          [
            step('先写错误模型', '创建 `BadState`，包含 `loading?`、`data?`、`error?`，写出两个能通过类型检查但业务非法的对象。'),
            step('定义正确联合', '建立 `idle`、`loading`、`success`、`failure` 四个分支，成功分支携带数据，失败分支携带错误码和消息。'),
            step('实现渲染函数', '使用 `switch (state.status)` 返回文案，不使用可选链掩盖缺失字段。'),
            step('实现状态迁移', '只允许 `idle -> loading -> success/failure`；非法迁移返回原状态或抛出领域错误。'),
            step('覆盖所有分支', '为 4 个分支分别调用渲染函数，并故意访问不存在字段观察错误。')
          ],
          ['非法的成功状态无法编译', '4 个合法分支输出正确', '模型中没有为了省事而添加的可选业务字段'],
          ['若所有字段仍然可选，说明没有真正使用联合分支', '对象字面量的 `status` 被推断为 string 时，给对象声明目标类型或使用 `satisfies`']
        ),
        acceptance: ['能为业务有限状态建模', '能说明 interface 与 type 的常见分工', '能识别“可选字段堆叠”问题'],
        resources: [resources.tsObjects, resources.tsEveryday]
      }),
      lesson({
        id: 'ts-functions-async',
        week: 'F1-04',
        title: '函数签名、回调与 Promise 类型',
        duration: '110分钟',
        level: '基础',
        summary: '掌握参数、返回值、函数类型、重载与异步返回值，避免丢失 Promise 错误。',
        objectives: ['为函数边界建立清晰签名', '理解 `void`、`never` 和 `Promise<T>`', '正确处理异步函数返回值'],
        sections: [
          section(
            '参数与返回值是最重要的类型边界',
            [
              '函数实现内部通常可以依赖推断，但对外参数和返回值应清晰。可选参数必须放在必选参数之后；默认参数在调用方看来也是可选的。对象参数适合参数较多或含义相近的场景。',
              '`void` 表示调用方不使用返回值，不代表函数绝对不能返回内容；`never` 表示函数无法正常结束，例如始终抛错。'
            ],
            [],
            code('typescript', [
              'interface CreateTaskInput {',
              '  title: string;',
              '  priority?: "low" | "high";',
              '}',
              '',
              'function createTask(input: CreateTaskInput): { id: string; title: string } {',
              '  return { id: crypto.randomUUID(), title: input.title };',
              '}'
            ])
          ),
          section(
            '函数类型、回调与重载',
            [
              '函数类型描述可调用契约。回调参数要具体，避免 `Function`，因为它不描述参数和返回值。重载用于同一个函数根据输入形状提供不同返回类型，但实现签名必须兼容所有重载。',
              '如果联合参数配合联合返回值已经足够清晰，不要为了炫技写重载。'
            ],
            ['回调：`(task: Task) => boolean`', '异步回调：`(id: string) => Promise<Task>`', '重载只用于调用关系确实不同的场景']
          ),
          section(
            'async 函数永远返回 Promise',
            [
              '`async function` 的返回值会包装为 Promise，因此类型应写成 `Promise<T>`。调用时必须 `await`、返回给上层，或明确使用 `void` 并在内部捕获错误；否则容易产生未处理的 Promise 拒绝。',
              '`Promise.all` 任何一项失败就整体拒绝，适合全部成功才有意义的任务；`Promise.allSettled` 会保留每一项结果，适合批处理报告。'
            ],
            [],
            code('typescript', [
              'async function loadTask(id: string): Promise<string> {',
              '  const response = await fetch(`https://example.com/tasks/${id}`);',
              '  if (!response.ok) throw new Error(`HTTP ${response.status}`);',
              '  return response.text();',
              '}'
            ]),
            '不要给 Promise 直接套 `try/catch` 却忘记 `await`。只有在当前调用栈中等待拒绝，catch 才能捕获。'
          )
        ],
        practice: practice(
          '实现类型安全的批量任务执行器',
          '实现一个并发执行多个异步任务并保留成功、失败结果的函数。',
          [
            step('定义输入与结果', '定义 `AsyncJob<T>` 函数类型，以及带 `id` 的成功、失败联合结果。'),
            step('实现单项执行', '使用 `try/catch` 执行一个 job；catch 参数从 `unknown` 开始，将错误转换为字符串。'),
            step('实现批量执行', '使用 `Promise.all` 调用已经内部捕获错误的单项执行函数，保持输入顺序。'),
            step('准备三个任务', '一个立即成功，一个延迟 100ms 成功，一个抛出错误。不要使用真实网络。'),
            step('输出汇总', '统计成功数和失败数，并打印每个任务的 id 与结果。')
          ],
          ['3 个任务都出现在结果中', '失败任务不会导致整个程序提前退出', '结果分支访问字段时获得正确类型收窄'],
          ['catch 变量是 unknown：先使用 `error instanceof Error`', '若程序提前结束，检查是否遗漏 `await main()` 或是否存在未处理拒绝']
        ),
        acceptance: ['能读写常见函数签名', '能正确标注 Promise 返回值', '不会静默丢弃异步错误'],
        resources: [resources.tsFunctions, resources.tsEveryday]
      }),
      lesson({
        id: 'ts-narrowing-exhaustive',
        week: 'F2-01',
        title: '类型收窄、类型守卫与穷尽检查',
        duration: '110分钟',
        level: '进阶基础',
        summary: '让编译器根据控制流确认真实类型，并用 `never` 在新增业务分支时强制修改代码。',
        objectives: ['掌握内置收窄方式', '编写可靠的自定义类型守卫', '用 `never` 实现穷尽检查'],
        sections: [
          section(
            '控制流如何收窄类型',
            [
              'TypeScript 会分析 `typeof`、`instanceof`、`in`、相等比较和真假判断。通过检查后，变量在对应分支中会变成更具体的类型。',
              '真假判断会同时排除空字符串、0、false 等值，若这些值在业务上合法，应使用显式的 `value !== undefined`。'
            ],
            ['`typeof` 适合基本类型', '`instanceof` 适合类实例', '`in` 适合检查对象属性', '字面量字段适合可辨识联合']
          ),
          section(
            '自定义类型守卫必须真的检查',
            [
              '返回类型 `value is User` 会影响调用方的类型判断，但编译器不会验证守卫实现是否完整。守卫如果只检查一个字段，可能把错误数据误判为合法对象。',
              '复杂外部输入更适合交给 Zod 等 schema 库；手写守卫用于结构简单、性能敏感或不想引入依赖的边界。'
            ],
            [],
            code('typescript', [
              'interface User { id: string; name: string }',
              '',
              'function isUser(value: unknown): value is User {',
              '  if (typeof value !== "object" || value === null) return false;',
              '  const item = value as Record<string, unknown>;',
              '  return typeof item.id === "string" && typeof item.name === "string";',
              '}'
            ])
          ),
          section(
            'never 让遗漏分支变成编译错误',
            [
              '在完整处理联合类型后，剩余变量应为 `never`。把它传给 `assertNever`，未来联合类型新增成员而 switch 未更新时，编译器会立即报错。',
              '这对工具调用类型、流式事件类型和订单状态非常重要，因为新增事件不能悄悄走默认分支。'
            ],
            [],
            code('typescript', [
              'function assertNever(value: never): never {',
              '  throw new Error(`未处理的分支: ${JSON.stringify(value)}`);',
              '}',
              '',
              'type Event = { type: "text"; value: string } | { type: "done" };',
              '',
              'function handle(event: Event): string {',
              '  switch (event.type) {',
              '    case "text": return event.value;',
              '    case "done": return "完成";',
              '    default: return assertNever(event);',
              '  }',
              '}'
            ])
          )
        ],
        practice: practice(
          '解析并处理流式事件',
          '模拟大模型流式输出中的文本、工具开始、工具结束和完成事件。',
          [
            step('定义事件联合', '为四类事件设计唯一的 `type` 字段和各自载荷。'),
            step('实现 unknown 守卫', '只接受非空对象，并逐项检查 `type` 与载荷字段。无效输入返回 false。'),
            step('实现穷尽处理器', '使用 switch 输出可读日志，默认分支调用 `assertNever`。'),
            step('准备合法与非法输入', '至少包括 4 条合法事件和 3 条非法对象，例如缺字段、错误字段类型、未知 type。'),
            step('模拟需求变更', '新增 `error` 事件但暂时不改处理器，确认编译器报错后再补分支。')
          ],
          ['非法输入不会进入处理器', '新增分支时出现可定位的编译错误', '所有合法事件输出内容正确'],
          ['不要在守卫里直接读取 unknown 的属性', '默认分支若仍是 Event 而不是 never，说明前面遗漏了联合成员']
        ),
        acceptance: ['能选择合适的收窄方式', '守卫对非法数据不过度信任', '业务联合类型具备穷尽检查'],
        resources: [resources.tsNarrowing]
      }),
      lesson({
        id: 'ts-generics-keyof',
        week: 'F2-02',
        title: '泛型、keyof 与索引访问类型',
        duration: '120分钟',
        level: '进阶基础',
        summary: '在保留输入输出关系的前提下复用代码，避免把泛型写成没有约束的抽象。',
        objectives: ['理解泛型保存类型关系的价值', '使用约束限制可接受输入', '掌握 `keyof` 与索引访问类型'],
        sections: [
          section(
            '泛型不是“任意类型”',
            [
              '泛型表示调用时才确定、但调用过程中保持一致的类型关系。若函数输入是 T、输出也是 T，调用方可以保留具体类型；改成 unknown 会丢失关系，改成 any 会失去检查。',
              '只有代码确实适用于多种类型并需要保留关系时才引入泛型。仅使用一次的类型参数通常没有价值。'
            ],
            [],
            code('typescript', [
              'function first<T>(items: readonly T[]): T | undefined {',
              '  return items[0];',
              '}',
              '',
              'const firstName = first(["Ada", "Lin"]); // string | undefined'
            ])
          ),
          section(
            '泛型约束描述最低能力',
            [
              '`T extends { id: string }` 表示 T 至少有 id，函数内部只能安全使用约束中声明的能力，但返回值仍保留调用方额外字段。',
              '约束不是继承业务类，不要为了使用一个属性就要求整个大型接口。'
            ],
            [],
            code('typescript', [
              'function indexById<T extends { id: string }>(items: readonly T[]): Map<string, T> {',
              '  return new Map(items.map((item) => [item.id, item]));',
              '}'
            ])
          ),
          section(
            'keyof 与 T[K] 保持字段关系',
            [
              '`keyof T` 产生对象键的联合，`T[K]` 取得对应字段类型。两者组合可以实现类型安全的取值、排序和表格列配置。',
              '如果只写 `key: string`，调用方可以传不存在的字段；如果返回 unknown，又丢失了具体字段类型。'
            ],
            [],
            code('typescript', [
              'function getField<T, K extends keyof T>(object: T, key: K): T[K] {',
              '  return object[key];',
              '}',
              '',
              'const task = { id: "t1", priority: 3 };',
              'const priority = getField(task, "priority"); // number'
            ])
          )
        ],
        practice: practice(
          '实现通用分页结果与类型安全表格列',
          '为用户和任务两类数据复用分页模型，同时让表格列只能引用真实字段。',
          [
            step('定义分页模型', '创建 `Page<T>`，包含 `items`、`page`、`pageSize`、`total`。'),
            step('定义列模型', '创建 `Column<T, K extends keyof T>`，包含 key、标题和可选 formatter。'),
            step('实现 renderCell', '输入对象和列，读取 `T[K]`，有 formatter 时格式化，否则转字符串。'),
            step('建立两组调用', '分别用 User 和 Task 创建分页数据和列定义，验证类型能自动推断。'),
            step('制造错误字段', '给 User 列传入 `priority`，确认编译失败并记录错误。')
          ],
          ['同一套 Page 模型服务两种对象', '列键不能引用不存在字段', 'formatter 参数获得对应字段的精确类型'],
          ['复杂列数组会丢失单个 key 的精确关系，可先分别声明列或使用构造函数帮助推断', '不要通过 `as keyof T` 强行接受任意用户输入']
        ),
        acceptance: ['泛型用于保存真实关系', '会写常用泛型约束', '能使用 keyof 与 T[K]'],
        resources: [resources.tsGenerics]
      }),
      lesson({
        id: 'ts-utility-modules-errors',
        week: 'F2-03',
        title: '工具类型、模块边界与错误建模',
        duration: '120分钟',
        level: '进阶基础',
        summary: '掌握常用工具类型、ESM 导入导出与可判断的领域错误，建立可维护项目结构。',
        objectives: ['正确使用常见工具类型', '理解 type-only import 和 ESM 边界', '避免依靠错误消息字符串判断错误类型'],
        sections: [
          section(
            '工具类型是在现有模型上变换',
            [
              '`Pick`、`Omit`、`Partial`、`Required`、`Readonly` 和 `Record` 用来从现有类型派生新类型，减少重复声明。`Partial<T>` 不等于合法的更新 DTO，因为它会把 id 等不可修改字段也变成可选。',
              '先定义领域模型，再从它派生视图或输入；不要嵌套五六层工具类型让错误信息无法阅读。'
            ],
            [],
            code('typescript', [
              'interface User { id: string; name: string; role: "user" | "admin" }',
              'type PublicUser = Omit<User, "role">;',
              'type UpdateUserInput = Partial<Pick<User, "name" | "role">>;',
              'type UserMap = Record<string, User>;'
            ])
          ),
          section(
            'ESM 模块建立显式边界',
            [
              '每个包含 import 或 export 的文件都是模块。只用于类型的导入使用 `import type`，编译器可以明确删除它。NodeNext 配置下，TypeScript 源码的相对导入通常写输出后的 `.js` 扩展名。',
              '模块不应通过全局变量共享状态。把依赖作为参数传入函数或类，测试时才能替换。'
            ],
            ['一个模块只承担一类职责', '公共入口集中导出稳定 API', '不要产生双向循环依赖']
          ),
          section(
            '错误也需要类型和稳定代码',
            [
              '网络、校验、权限和业务冲突应使用稳定错误码区分。调用方不应通过中文消息字符串判断错误类别，因为文案随时可能修改。',
              'catch 变量是 unknown。先判断是否为自定义错误或 Error，再转换为统一结构。'
            ],
            [],
            code('typescript', [
              'class AppError extends Error {',
              '  constructor(',
              '    readonly code: "NOT_FOUND" | "VALIDATION",',
              '    message: string,',
              '    readonly cause?: unknown',
              '  ) {',
              '    super(message);',
              '    this.name = "AppError";',
              '  }',
              '}'
            ])
          )
        ],
        practice: practice(
          '拆分任务服务模块',
          '把单文件任务逻辑拆成 model、repository、service、errors 和入口文件。',
          [
            step('创建目录', '建立 `src/task/model.ts`、`repository.ts`、`service.ts`、`errors.ts` 和 `index.ts`。'),
            step('派生输入模型', '从 Task 中派生 `CreateTaskInput` 与 `UpdateTaskInput`，确保 id、createdAt 不能被客户端修改。'),
            step('定义仓库接口', '声明 findById、save 和 list；服务通过构造参数接收仓库，不直接创建实现。'),
            step('实现错误分支', '查询缺失抛出 `NOT_FOUND`，标题为空抛出 `VALIDATION`。入口按 code 输出不同结果。'),
            step('检查模块依赖', '确认 model 不导入 service，repository 不导入入口，项目没有循环依赖。')
          ],
          ['类型导入使用 `import type`', '错误分支通过 code 判断而非字符串', '项目编译后可以从 `dist/index.js` 运行'],
          ['NodeNext 提示缺少扩展名时，把相对导入改为 `./task/service.js`', '自定义 Error 的 `name` 应明确设置，日志更容易辨认']
        ),
        acceptance: ['会选择工具类型而不过度嵌套', '模块依赖方向清楚', '错误具有稳定分类'],
        resources: [resources.tsUtility, resources.tsModules]
      }),
      lesson({
        id: 'ts-runtime-validation-client',
        week: 'F2-04',
        title: '运行时校验与类型安全 API Client',
        duration: '150分钟',
        level: '综合练习',
        summary: '使用 Zod 校验真实网络数据，实现带超时、错误分类和泛型响应的 API Client。',
        objectives: ['理解静态类型不能证明外部数据正确', '使用 schema 生成类型并校验 unknown', '完成可复用 API Client'],
        sections: [
          section(
            '类型声明不能校验 JSON',
            [
              '`await response.json()` 得到的是运行时数据。即使把它断言为 `User`，服务器仍可能返回缺字段、错误类型或错误结构。安全流程是先作为 unknown 接收，再交给 schema 解析。',
              'schema 应位于系统边界：HTTP 响应、环境变量、文件和消息队列。系统内部不需要每层重复解析。'
            ],
            [],
            code('typescript', [
              'import { z } from "zod";',
              '',
              'const UserSchema = z.object({',
              '  id: z.string().min(1),',
              '  name: z.string().min(1),',
              '  role: z.enum(["user", "admin"])',
              '});',
              '',
              'type User = z.infer<typeof UserSchema>;'
            ])
          ),
          section(
            'safeParse 与 parse 的选择',
            [
              '`parse` 失败时抛出 ZodError，适合统一异常边界；`safeParse` 返回成功/失败联合，适合当前函数就要展示详细校验问题。不要解析失败后继续使用原始对象。',
              '对外错误应转换成自己的 AppError，避免上层依赖 Zod 的内部结构。日志可以保留原始 cause。'
            ],
            ['成功数据只来自 `result.data`', '失败问题可映射为字段路径和消息', '外层使用稳定错误码']
          ),
          section(
            'API Client 的最小可靠能力',
            [
              '一个可靠 Client 至少检查 HTTP 状态、限制超时、区分网络错误和数据错误，并通过传入 schema 决定返回类型。认证、重试和跟踪可以在后续岗位主线继续增加。',
              '泛型不应让调用方任意指定返回类型；应由传入的 schema 推导实际返回值。'
            ],
            [],
            code('typescript', [
              'import type { ZodType } from "zod";',
              '',
              'async function getJson<T>(url: string, schema: ZodType<T>): Promise<T> {',
              '  const response = await fetch(url, { signal: AbortSignal.timeout(3000) });',
              '  if (!response.ok) throw new AppError("HTTP", `HTTP ${response.status}`);',
              '  const raw: unknown = await response.json();',
              '  const result = schema.safeParse(raw);',
              '  if (!result.success) throw new AppError("INVALID_DATA", "响应格式错误", result.error);',
              '  return result.data;',
              '}'
            ])
          )
        ],
        practice: practice(
          '完成 TypeScript 基础项目：安全 API Client',
          '创建一个本地 mock 数据文件和可测试 Client，完整验证成功、HTTP 错误、超时和非法数据四条路径。',
          [
            step('安装并定义 schema', '安装 Zod，创建 UserSchema、UserListSchema 和由 schema 推导的类型。', code('powershell', ['npm install zod'])),
            step('实现错误模型', 'AppError 至少包含 `HTTP`、`TIMEOUT`、`INVALID_DATA`、`NETWORK` 四个 code，并保留 cause。'),
            step('实现 getJson', '传入 URL、schema 和可选 timeoutMs；检查状态、解析 unknown、执行 safeParse。'),
            step('注入 fetch 便于测试', '不要在测试中访问公网。把 fetch 函数作为可选依赖传入 Client，使用四个 fake fetch 覆盖分支。'),
            step('输出校验报告', '成功时输出用户数量；失败时输出稳定 code。非法数据示例要包含缺少 id 和错误 role。'),
            step('整理 README', '写清安装、类型检查、运行、测试命令，以及四条测试路径的预期结果。')
          ],
          ['成功数据的类型由 schema 自动推导', '四条路径都有断言且不访问公网', '项目中不存在把 `response.json()` 直接断言为业务类型'],
          ['AbortSignal.timeout 在旧运行时不可用时，确认使用 Node.js 20+', '测试 fake response 要实现 `ok`、`status`、`json` 等本例实际访问的字段']
        ),
        acceptance: ['能说明编译期与运行时的边界', '能独立写 schema 和安全解析', 'TypeScript 两周产物可供后续 Node.js 复用'],
        resources: [resources.zod, resources.tsGenerics, resources.tsNarrowing]
      })
    ]
  });
})();
