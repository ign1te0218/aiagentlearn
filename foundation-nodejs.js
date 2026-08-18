(function () {
  const F = window.FOUNDATION_COURSE;
  const { code, section, step, practice, lesson, resources } = F;

  F.modules.push({
    id: 'nodejs-foundation',
    title: 'Node.js 基础（F3-F4）',
    icon: 'server',
    phase: F.phase,
    lessons: [
      lesson({
        id: 'node-runtime-project',
        week: 'F3-01',
        title: '运行时、命令行、npm 与项目结构',
        duration: '90分钟',
        level: '零基础',
        summary: '理解 Node.js 与浏览器 JavaScript 的差异，建立可重复运行的 ESM 项目。',
        objectives: ['认识 V8、Node.js API 与操作系统能力的边界', '会使用 node、npm 和 package.json', '建立最小 ESM 项目和脚本'],
        sections: [
          section(
            'Node.js 提供了什么',
            [
              'Node.js 使用 V8 执行 JavaScript，并增加文件系统、网络、进程、流和事件等服务端 API。浏览器里的 DOM、window 和 localStorage 并不存在；Node.js 则可以访问 `process`、`Buffer`、`fs` 和 `http`。',
              'Node.js 适合 I/O 密集服务。JavaScript 回调主要在一个线程上执行，但底层 I/O 可由操作系统或 libuv 协调并发；“单线程”不等于“一次只能处理一个请求”。'
            ],
            ['JavaScript 执行引擎：V8', '异步与跨平台层：libuv', '标准库：fs、http、stream、events、crypto', '包生态：npm registry'],
            code('javascript', [
              'console.log({',
              '  node: process.version,',
              '  platform: process.platform,',
              '  cwd: process.cwd(),',
              '  pid: process.pid',
              '});'
            ])
          ),
          section(
            'node 命令与 REPL',
            [
              '`node file.js` 执行文件，单独输入 `node` 会进入 REPL，可快速验证表达式。`node --watch` 能在文件变化后重启进程，但生产环境仍需要正式的进程与部署方案。',
              '运行脚本时当前工作目录来自启动位置，不一定等于脚本所在目录。处理文件路径时必须区分 `process.cwd()` 与模块位置。'
            ],
            ['`node --version`', '`node --watch src/index.js`', '`node --env-file=.env src/index.js`（Node.js 20.6+）']
          ),
          section(
            'package.json 与 npm scripts',
            [
              '`package.json` 记录包名、模块类型、脚本和依赖。应用项目应提交 package-lock.json，团队与部署使用 `npm ci` 按锁文件安装。',
              '`dependencies` 是运行应用需要的包，`devDependencies` 是构建、检查和测试工具。不要全局安装项目依赖来“修复”本地命令。'
            ],
            [],
            code('json', [
              '{',
              '  "name": "node-foundation",',
              '  "private": true,',
              '  "type": "module",',
              '  "scripts": {',
              '    "start": "node src/index.js",',
              '    "dev": "node --watch src/index.js"',
              '  },',
              '  "engines": { "node": ">=20" }',
              '}'
            ])
          )
        ],
        practice: practice(
          '创建 Node.js 运行时信息工具',
          '初始化项目，读取命令行参数并输出运行时、内存和工作目录信息。',
          [
            step('初始化 ESM 项目', '在 `foundations/nodejs/f3-01-runtime` 下初始化，并把 package.json 的 type 设置为 module。', code('powershell', [
              'mkdir foundations/nodejs/f3-01-runtime',
              'cd foundations/nodejs/f3-01-runtime',
              'npm init -y',
              'npm pkg set type=module',
              'npm pkg set scripts.start="node src/index.js"',
              'mkdir src'
            ])),
            step('编写信息工具', '创建 `src/index.js`，读取 `process.argv[2]` 作为用户名，并输出版本、平台和内存。', code('javascript', [
              'const name = process.argv[2] ?? "student";',
              'const memory = process.memoryUsage();',
              '',
              'console.log(`你好，${name}`);',
              'console.table({',
              '  node: process.version,',
              '  platform: process.platform,',
              '  cwd: process.cwd(),',
              '  rssMB: (memory.rss / 1024 / 1024).toFixed(2)',
              '});'
            ])),
            step('通过 npm 传递参数', 'npm 脚本后的参数要放在 `--` 之后。', code('powershell', ['npm start -- Lin'])),
            step('验证工作目录差异', '分别从项目目录和上级目录执行同一个绝对路径脚本，记录 cwd 的变化。')
          ],
          ['显示真实 Node.js 版本、平台、cwd 和内存', '传入姓名与不传姓名两种情况都可运行', '能解释 cwd 为什么随启动位置变化'],
          ['`npm start Lin` 不会按预期传参时，改用 `npm start -- Lin`', 'package.json 修改后 JSON 语法错误时，用 `npm pkg get name` 检查']
        ),
        acceptance: ['能说明 Node.js 与浏览器的 API 差异', '会初始化和运行项目', '知道 lockfile 与依赖分类的作用'],
        resources: [resources.nodeIntro, resources.nodeNpm, resources.nodeProcess]
      }),
      lesson({
        id: 'node-modules-esm-cjs',
        week: 'F3-02',
        title: 'ESM、CommonJS 与模块解析',
        duration: '100分钟',
        level: '基础',
        summary: '掌握 Node.js 两套模块系统、导入导出、模块缓存和相对路径处理。',
        objectives: ['能识别 ESM 与 CommonJS 文件', '正确组织导入导出和公共入口', '避免把当前工作目录误当模块目录'],
        sections: [
          section(
            '两套模块系统如何识别',
            [
              'ESM 使用 `import/export`，CommonJS 使用 `require/module.exports`。`.mjs` 总是 ESM，`.cjs` 总是 CommonJS；普通 `.js` 由最近 package.json 的 `type` 决定。新项目建议统一使用 ESM。',
              '不要在同一文件随意混用两套语法。引入老旧 CommonJS 包时，先阅读包的 exports 声明和实际导出形状。'
            ],
            ['ESM：静态分析、顶层 await、import.meta.url', 'CommonJS：同步 require、module.exports、__dirname'],
            code('javascript', [
              '// math.js',
              'export function add(a, b) { return a + b; }',
              'export const PI = 3.14159;',
              '',
              '// index.js',
              'import { add, PI } from "./math.js";',
              'console.log(add(2, 3), PI);'
            ])
          ),
          section(
            '模块缓存与副作用',
            [
              '同一模块通常只会求值一次，后续导入复用缓存。模块顶层创建连接、读取配置或修改全局状态属于导入副作用，会让测试顺序和启动行为难以控制。',
              '把资源创建放入显式函数，例如 `createServer(config)`，让入口负责组装和生命周期。'
            ],
            ['模块导出能力，不在导入时执行主流程', '共享状态需要明确所有者', '避免循环依赖导致部分初始化值']
          ),
          section(
            'ESM 中的模块目录',
            [
              'ESM 没有 CommonJS 的 `__dirname`。可从 `import.meta.url` 转换成本地路径。读取与模块一起发布的模板或数据时应基于模块目录；读取用户指定文件时通常基于 cwd。'
            ],
            [],
            code('javascript', [
              'import { fileURLToPath } from "node:url";',
              'import path from "node:path";',
              '',
              'const filename = fileURLToPath(import.meta.url);',
              'const dirname = path.dirname(filename);',
              'console.log(path.join(dirname, "data", "config.json"));'
            ])
          )
        ],
        practice: practice(
          '拆分一个命令行计算器',
          '建立 ESM 模块、公共入口和可执行入口，并观察模块只初始化一次。',
          [
            step('创建运算模块', '创建 `src/math/add.js`、`subtract.js`，每个文件只导出一个命名函数。'),
            step('创建公共入口', '在 `src/math/index.js` 重新导出两个函数，其他模块只从公共入口导入。'),
            step('实现 CLI', '读取 `node src/cli.js add 2 3`，校验参数数量、操作名和数字转换。非法输入设置 `process.exitCode = 1`。'),
            step('验证模块缓存', '创建 `counter.js` 在顶层输出一次初始化日志，在 cli 中通过两个模块间接导入，确认日志只出现一次。'),
            step('测试不同 cwd', '从项目外执行 cli，确保代码没有依赖错误的相对文件路径。')
          ],
          ['add 与 subtract 输出正确', '未知操作和非数字参数给出明确错误并返回非 0 退出码', '模块初始化日志只输出一次'],
          ['相对导入必须包含 `.js` 扩展名', '`require is not defined` 表示当前文件是 ESM，改用 import 或明确使用 .cjs']
        ),
        acceptance: ['能判断模块格式', '理解模块缓存和导入副作用', '能正确处理 ESM 模块路径'],
        resources: [resources.nodeEsm, resources.nodeCjs]
      }),
      lesson({
        id: 'node-event-loop-deep-dive',
        week: 'F3-03',
        title: '事件循环：阶段、微任务与阻塞实验',
        duration: '180分钟',
        level: '核心基础',
        summary: '从调用栈、libuv、事件循环阶段和微任务队列理解 Node.js 并发，并通过完整实验观察执行顺序与阻塞后果。',
        objectives: ['能画出一次异步 I/O 从发起到回调执行的路径', '掌握事件循环主要阶段与微任务优先级', '能通过实验定位同步阻塞和微任务饥饿'],
        sections: [
          section(
            '先建立正确心智模型',
            [
              'Node.js 中 JavaScript 回调通常在主线程的调用栈上执行。遇到文件、网络、定时器等异步操作时，Node.js 把等待工作登记给操作系统或 libuv；当前调用栈继续执行。操作完成后，对应回调进入队列，事件循环在合适阶段取出并执行。',
              '网络 socket 通常依靠操作系统的异步就绪通知；文件系统、部分 DNS、crypto 和 zlib 等任务可能使用 libuv 线程池。线程池的存在不意味着你的 JavaScript 回调能并行执行。'
            ],
            ['调用栈：当前正在执行的 JavaScript', 'Node.js 绑定层：连接 JS 与系统能力', '操作系统/libuv：等待 I/O 或在线程池工作', '队列：保存待执行回调', '事件循环：按阶段调度回调'],
            null,
            '事件循环负责调度，不会让长时间 CPU 计算自动变成非阻塞。'
          ),
          section(
            '六个主要阶段分别做什么',
            [
              '一次循环会经过多个阶段，每个阶段有自己的回调队列。`timers` 执行到期的 setTimeout/setInterval；`pending callbacks` 处理推迟到下一轮的部分系统回调；`idle/prepare` 是内部阶段；`poll` 获取新的 I/O 事件并执行 I/O 回调；`check` 执行 setImmediate；`close callbacks` 处理 socket 等资源的关闭回调。',
              '从 libuv 1.45 / Node.js 20 起，定时器只在 poll 之后运行，而旧版本可能在 poll 前后都运行。这会影响某些 setImmediate 与定时器边界行为，所以不要依赖跨上下文的偶然顺序。'
            ],
            ['timers', 'pending callbacks', 'idle / prepare', 'poll', 'check', 'close callbacks'],
            code('text', [
              'timers -> pending callbacks -> idle/prepare -> poll -> check -> close callbacks',
              '   ^                                                                  |',
              '   +--------------------------- next iteration ------------------------+'
            ])
          ),
          section(
            'nextTick 与 Promise 微任务何时执行',
            [
              '在普通 CommonJS 顶层和大多数事件循环回调结束后，Node.js 会先清空 `process.nextTick()` 队列，再处理 Promise 微任务队列。但 ESM 模块本身通过微任务机制求值：在 Node.js 24 的 ESM 顶层示例中，已经排队的 Promise 回调会早于 `nextTick`。因此必须先说明执行上下文，不能背诵一个全局固定顺序。',
              '递归安排 nextTick 会持续抢在 I/O 前执行，造成事件循环饥饿。业务代码通常优先使用 Promise/queueMicrotask 表达微任务，nextTick 只用于极少数需要在事件循环继续前完成的兼容场景。'
            ],
            [],
            code('javascript', [
              'console.log("1 sync start");',
              '',
              'setTimeout(() => console.log("5/6 timeout"), 0);',
              'setImmediate(() => console.log("5/6 immediate"));',
              'Promise.resolve().then(() => console.log("4 promise"));',
              'process.nextTick(() => console.log("3 nextTick"));',
              '',
              'console.log("2 sync end");'
            ]),
            '在 CommonJS 顶层通常是 nextTick 先于 Promise；在 Node.js 24 的 ESM 顶层通常是 Promise 先于 nextTick。0ms 定时器与 setImmediate 的先后也不能当作稳定契约。'
          ),
          section(
            'setTimeout(0) 与 setImmediate 的上下文差异',
            [
              '`setTimeout(fn, 0)` 表示达到最小阈值后才有资格在 timers 阶段执行，不表示立刻执行。`setImmediate` 在 check 阶段执行。两者在主模块顶层的先后会受启动耗时和平台影响。',
              '如果二者都在同一个 I/O 回调中安排，poll 阶段结束后会先进入 check，因此 setImmediate 通常先于下一轮 timers。这个实验比顶层比较更能说明阶段关系。'
            ],
            [],
            code('javascript', [
              'import { readFile } from "node:fs";',
              '',
              'readFile(new URL(import.meta.url), () => {',
              '  setTimeout(() => console.log("timeout in I/O"), 0);',
              '  setImmediate(() => console.log("immediate in I/O"));',
              '});'
            ])
          ),
          section(
            '同步阻塞会影响所有连接',
            [
              '只要一个回调占用主线程，其他已经就绪的请求、定时器和 I/O 回调都必须等待。常见阻塞包括同步文件 API、大 JSON 解析、复杂正则、图片处理和无分片的长循环。',
              '小型启动配置可以同步读取，但请求路径中应优先异步 API。CPU 密集任务需要分片、worker_threads、任务队列或独立服务，不能简单包进 Promise。'
            ],
            ['观察事件循环延迟而不只看 CPU', '区分 I/O 等待与 CPU 占用', '请求处理器中避免 sync API'],
            code('javascript', [
              'function block(ms) {',
              '  const end = Date.now() + ms;',
              '  while (Date.now() < end) {}',
              '}',
              '',
              'setInterval(() => console.log("heartbeat", new Date().toISOString()), 500);',
              'setTimeout(() => block(3000), 1000);'
            ])
          ),
          section(
            '如何分析异步顺序',
            [
              '先识别代码运行在 CommonJS 顶层、ESM 顶层还是事件循环回调中，再标出同步调用栈，并记录每个 API 把回调交给哪个队列。CommonJS 顶层和普通回调结束后通常先处理 nextTick 再处理 Promise 微任务；Node.js 24 的 ESM 顶层求值中通常相反。最后再按当前事件循环阶段判断 timer、I/O 和 immediate。不要背一个脱离上下文的固定顺序。',
              '真实程序中 I/O 完成时间不可控。正确性不能依赖两个独立异步操作的完成顺序，应使用 await、Promise 组合或显式状态协调。'
            ],
            ['第一步：识别 CJS 顶层、ESM 顶层或回调上下文', '第二步：执行所有同步语句并记录调度位置', '第三步：按当前上下文处理 nextTick 与 Promise 微任务', '第四步：进入或继续事件循环阶段', '第五步：每个回调结束后再次处理该上下文中的微任务']
          )
        ],
        practice: practice(
          '完整 Demo：观察顺序、I/O 阶段和阻塞',
          '建立独立实验目录，用三个脚本分别验证微任务顺序、I/O 内 immediate/timer 顺序和主线程阻塞。不要把三组实验混成一个文件。',
          [
            step('创建实验目录', '在 `foundations/nodejs/f3-03-event-loop` 初始化项目，同时保留 `.cjs` 与 `.mjs` 两种入口用于比较。', code('powershell', [
              'mkdir foundations/nodejs/f3-03-event-loop',
              'cd foundations/nodejs/f3-03-event-loop',
              'npm init -y',
              'npm pkg set type=module',
              'mkdir src'
            ])),
            step('实验一：比较 CJS 与 ESM', '把同一段代码分别保存为 `src/order.cjs` 和 `src/order.mjs`。Node.js 24 中，CJS 顶层通常 nextTick 先于 Promise，ESM 顶层通常 Promise 先于 nextTick。', code('javascript', [
              'console.log("1 sync start");',
              'setTimeout(() => console.log("timeout"), 0);',
              'setImmediate(() => console.log("immediate"));',
              'Promise.resolve().then(() => console.log("4 promise"));',
              'process.nextTick(() => console.log("3 nextTick"));',
              'console.log("2 sync end");'
            ])),
            step('实验二：在 I/O 回调中调度', '创建 `src/io-order.mjs`。这里预期 immediate 先于 timeout。', code('javascript', [
              'import { readFile } from "node:fs";',
              '',
              'readFile(new URL(import.meta.url), (error) => {',
              '  if (error) throw error;',
              '  console.log("I/O callback");',
              '  setTimeout(() => console.log("timeout"), 0);',
              '  setImmediate(() => console.log("immediate"));',
              '  Promise.resolve().then(() => console.log("promise in I/O"));',
              '});'
            ])),
            step('实验三：量化阻塞', '创建 `src/blocking.mjs`，记录心跳实际间隔。阻塞开始后，心跳会暂停约 3 秒。', code('javascript', [
              'import { monitorEventLoopDelay } from "node:perf_hooks";',
              '',
              'const delay = monitorEventLoopDelay({ resolution: 20 });',
              'delay.enable();',
              'let last = Date.now();',
              '',
              'const timer = setInterval(() => {',
              '  const now = Date.now();',
              '  console.log(`heartbeat gap=${now - last}ms`);',
              '  last = now;',
              '}, 500);',
              '',
              'setTimeout(() => {',
              '  const end = Date.now() + 3000;',
              '  while (Date.now() < end) {}',
              '  // 让心跳和监测器先获得一次运行机会，再读取统计。',
              '  setTimeout(() => {',
              '    console.log(`max delay≈${(delay.max / 1e6).toFixed(0)}ms`);',
              '    clearInterval(timer);',
              '    delay.disable();',
              '  }, 200);',
              '}, 1200);'
            ])),
            step('运行并记录结果', '依次运行三个脚本，把 Node.js 版本、预测、实际输出和解释写进 README。', code('powershell', [
              'node src/order.cjs',
              'node src/order.mjs',
              'node src/io-order.mjs',
              'node src/blocking.mjs'
            ])),
            step('做一次反例实验', '递归安排 10 万次 nextTick，同时安排 setTimeout，观察定时器被推迟；完成后解释为什么生产代码不能无限递归 nextTick。')
          ],
          ['order.cjs 与 order.mjs 都先输出同步代码，但 Node.js 24 中二者的 nextTick/Promise 顺序不同', 'io-order.mjs 中 Promise 在 I/O 回调结束后先执行，immediate 通常早于 timeout', 'blocking.mjs 出现约 3 秒心跳间隔且 max delay 接近阻塞时长', 'README 能按执行上下文、调用栈、微任务和阶段解释结果'],
          ['顶层 timeout 与 immediate 顺序不同不算失败，它本来就不应作为稳定契约', '阻塞实验退出太早时，确保 clearInterval 在阻塞完成后调用', '不要在电脑上运行无限 nextTick；使用固定计数上限']
        ),
        acceptance: ['能准确描述事件循环主要阶段', '能解释 nextTick、Promise、timer、immediate 的关系', '能通过实验证明同步 CPU 任务会阻塞所有回调'],
        resources: [resources.nodeLoop, resources.nodeBlocking]
      }),
      lesson({
        id: 'node-async-errors-cancel',
        week: 'F3-04',
        title: '异步控制流、错误、并发与取消',
        duration: '130分钟',
        level: '基础',
        summary: '用 Promise 和 async/await 组织异步工作，正确传播错误、限制并发并支持 AbortSignal 取消。',
        objectives: ['理解 Promise 状态和错误传播', '选择串行、并行和并发限制', '使用 AbortController 取消操作'],
        sections: [
          section(
            'Promise 链与 async/await 是同一抽象',
            [
              'Promise 只有 pending、fulfilled、rejected 三种状态，落定后不会再次变化。`async/await` 提供顺序化语法，但不会把异步操作变成同步阻塞。',
              'await 只暂停当前 async 函数，并把继续执行安排为微任务；事件循环仍可以处理其他连接。'
            ],
            ['返回 Promise 让上层决定如何等待', 'catch 后若无法恢复要继续 throw', 'finally 用于释放资源，不改变业务结果']
          ),
          section(
            '串行、并行与受限并发',
            [
              '循环中逐项 await 是串行，适合存在依赖或需要控制频率的任务。`Promise.all` 同时发起所有任务，适合数量可控且全部成功才有价值的任务。上千项直接 Promise.all 可能打爆连接池或上游，需要并发限制。',
              '并发不是越高越快，瓶颈可能在数据库连接数、对方限流或本机文件描述符。'
            ],
            ['串行：结果依赖前一步', '全部并行：任务少且彼此独立', '受限并发：批量 I/O', 'allSettled：需要完整报告']
          ),
          section(
            '错误必须到达明确边界',
            [
              '异步函数抛错会变成 Promise 拒绝。入口层、请求处理器或任务消费者应有统一错误边界，记录上下文并转换为退出码或响应。不要空 catch。',
              '使用 `process.on("unhandledRejection")` 只能做最后日志和有序退出，不应作为正常业务错误处理方式。'
            ],
            [],
            code('javascript', [
              'async function main() {',
              '  try {',
              '    await runJob();',
              '  } catch (error) {',
              '    console.error("job failed", { error });',
              '    process.exitCode = 1;',
              '  }',
              '}',
              '',
              'await main();'
            ])
          ),
          section(
            'AbortSignal 是取消协议',
            [
              'AbortController 提供 signal，调用 abort 后，支持该协议的 fetch、stream 或自定义函数可以尽快停止。取消不是强制终止线程，函数需要监听 signal 并清理定时器、连接等资源。',
              '超时是取消的一种来源。更可靠的 API 会把上游请求的 signal 继续传给下游，而不是每层各自忽略取消。'
            ],
            [],
            code('javascript', [
              'async function getJson(url, signal) {',
              '  const response = await fetch(url, { signal });',
              '  if (!response.ok) throw new Error(`HTTP ${response.status}`);',
              '  return response.json();',
              '}',
              '',
              'await getJson(url, AbortSignal.timeout(3000));'
            ])
          )
        ],
        practice: practice(
          '实现可取消的并发任务池',
          '模拟 12 个异步任务，最多同时运行 3 个，支持整体取消并保留每项结果。',
          [
            step('实现 delay', '接收毫秒数和 signal；abort 时清除定时器并拒绝 `AbortError`。'),
            step('实现单个 job', '输出 start/end 与当前并发数，随机等待 100-500ms；编号 5 固定抛错。'),
            step('实现 worker 模式', '使用共享索引启动 3 个 worker，每个 worker 反复取下一个任务，避免一次创建全部 Promise。'),
            step('收集结果', '每项都转换为 `{id,status,value/error}`，单项失败不终止其他任务。'),
            step('增加取消', '1 秒后调用 controller.abort()，未开始或正在等待的任务应记录 cancelled。'),
            step('断言并发上限', '记录 maxConcurrent，程序结束时断言它不大于 3。')
          ],
          ['任何时刻 active 不超过 3', '固定失败与取消都有独立状态', '取消后没有残留定时器导致进程继续挂起'],
          ['共享索引只在同步片段中递增，避免 await 前后重复取任务', 'AbortError 在不同 API 中形状可能不同，优先检查 signal.aborted 和 error.name']
        ),
        acceptance: ['能选择合理并发策略', '错误不会静默丢失', '取消能沿调用链传递并释放资源'],
        resources: [resources.nodeLoop, resources.nodeProcess]
      }),
      lesson({
        id: 'node-event-emitter',
        week: 'F4-01',
        title: 'EventEmitter 与事件驱动设计',
        duration: '100分钟',
        level: '基础',
        summary: '使用 EventEmitter 解耦状态生产者与观察者，同时处理 error 事件、监听器清理和同步触发语义。',
        objectives: ['掌握 on、once、off 和 emit', '理解监听器默认同步执行', '避免监听器泄漏和未处理 error'],
        sections: [
          section(
            '事件生产者与监听器',
            [
              'EventEmitter 允许对象按事件名发布数据，多个监听器订阅。它适合进程内通知，不是跨进程消息队列，也不自动持久化事件。',
              '`emit` 会按注册顺序同步调用监听器。某个监听器执行长任务会阻塞 emit 返回；需要异步时由监听器显式安排异步操作。'
            ],
            [],
            code('javascript', [
              'import { EventEmitter } from "node:events";',
              '',
              'const bus = new EventEmitter();',
              'bus.on("progress", ({ current, total }) => {',
              '  console.log(`${current}/${total}`);',
              '});',
              'bus.emit("progress", { current: 1, total: 3 });'
            ])
          ),
          section(
            'error 事件需要专门监听',
            [
              'EventEmitter 发出 `error` 且没有监听器时，Node.js 会抛出异常并可能终止进程。可失败的事件源必须建立 error 监听或把错误转成 Promise/回调交给调用方。',
              '不要既发 error 又在同一路径 throw，避免同一失败被处理两次。'
            ],
            ['`once` 只处理一次', '`off` 移除同一个函数引用', '`removeAllListeners` 不应随意用于不属于自己的 emitter']
          ),
          section(
            '生命周期与监听器泄漏',
            [
              '如果每次请求都注册监听器却不移除，长时间运行后会重复执行并占用内存。Node.js 的 MaxListenersExceededWarning 是风险提示，不应只通过调大上限掩盖。',
              '注册者应负责注销，或使用 once、AbortSignal 等机制绑定生命周期。'
            ]
          )
        ],
        practice: practice(
          '实现文件处理进度事件源',
          '模拟处理 5 个文件，发出 start、progress、done 与 error，并在结束后清理监听器。',
          [
            step('创建 FileProcessor', '继承 EventEmitter，构造函数接收文件名数组。'),
            step('实现 process', '逐个等待 100ms，发出 progress；遇到 `.bad` 后缀发出 error 并停止。'),
            step('注册监听器', 'start 只监听一次，progress 持续监听，done 输出汇总，error 输出错误。'),
            step('验证同步顺序', '在 emit 前后输出日志，确认监听器在 emit 返回前执行。'),
            step('验证清理', '保存 progress 函数引用，在完成或错误时 off，并输出 listenerCount。')
          ],
          ['正常列表得到 5 次 progress 和 1 次 done', '错误列表触发 error 且进程不崩溃', '结束后 progress 监听器数量为 0'],
          ['off 无效通常因为传入了新的箭头函数，必须保存原函数引用', '异步监听器的拒绝默认不会自动变成 error，需自行 catch 或启用明确策略']
        ),
        acceptance: ['知道 emit 默认同步', 'error 事件有明确处理', '监听器生命周期不会泄漏'],
        resources: [resources.nodeEvents]
      }),
      lesson({
        id: 'node-files-path',
        week: 'F4-02',
        title: '文件系统、Path 与安全路径',
        duration: '120分钟',
        level: '基础',
        summary: '使用 Promise 文件 API、path 和 URL 安全读写文件，处理编码、原子写入和目录穿越。',
        objectives: ['掌握常用 fs/promises 操作', '正确构造跨平台路径', '防止用户路径逃逸基础目录'],
        sections: [
          section(
            '异步文件 API 与编码',
            [
              '`node:fs/promises` 提供 Promise 形式的 readFile、writeFile、mkdir、readdir 和 stat。读取文本要显式指定 utf8，否则返回 Buffer。大文件不应一次 readFile，后续使用流。',
              '错误对象通常包含 code，例如 ENOENT、EACCES、EEXIST。业务层可以按 code 转换错误，但仍要保留原始 cause。'
            ],
            [],
            code('javascript', [
              'import { mkdir, readFile, writeFile } from "node:fs/promises";',
              '',
              'await mkdir("data", { recursive: true });',
              'await writeFile("data/note.txt", "你好 Node.js", "utf8");',
              'const text = await readFile("data/note.txt", "utf8");'
            ])
          ),
          section(
            'path.resolve、join 与跨平台差异',
            [
              '`path.join` 拼接并规范化片段，`path.resolve` 从右向左生成绝对路径。Windows 和 POSIX 分隔符不同，不要手写 `/` 或 `\\` 拼文件路径。',
              '用户输入可能包含 `../` 或绝对路径。只做 join 不能防目录穿越，必须 resolve 后确认结果仍位于允许的基础目录内。'
            ],
            [],
            code('javascript', [
              'import path from "node:path";',
              '',
              'function safePath(base, userPath) {',
              '  const root = path.resolve(base);',
              '  const target = path.resolve(root, userPath);',
              '  const relative = path.relative(root, target);',
              '  if (relative.startsWith("..") || path.isAbsolute(relative)) {',
              '    throw new Error("路径超出允许目录");',
              '  }',
              '  return target;',
              '}'
            ])
          ),
          section(
            '避免部分写入',
            [
              '进程在 writeFile 中途退出可能留下不完整文件。对配置或索引清单等关键小文件，可先写同目录临时文件，再 rename 覆盖目标。rename 在同一文件系统内通常提供原子替换语义。',
              '并发写同一文件仍需更高层的锁、版本或单写者设计。'
            ],
            ['写临时文件', '必要时 fsync', 'rename 到目标', '清理失败临时文件']
          )
        ],
        practice: practice(
          '实现安全笔记存储器',
          '命令行支持 write、read、list，所有文件只能位于项目 data 目录。',
          [
            step('建立路径模块', '从 import.meta.url 得到项目模块目录，导出 safePath，拒绝 `../secret.txt` 和绝对路径。'),
            step('实现 write', '自动创建 data 目录；把内容先写到 `.tmp`，再 rename 为目标文件。'),
            step('实现 read', '以 utf8 读取，ENOENT 转成“笔记不存在”，其他错误继续抛出。'),
            step('实现 list', '只列出 `.txt` 文件，输出文件名和 stat 得到的字节数。'),
            step('执行安全用例', '正常写读一个中文文件，再尝试 `../outside.txt`，确认被拒绝且外部未创建文件。')
          ],
          ['中文往返读取不乱码', '目录不存在时可自动创建', '路径穿越被拒绝', '列表包含名称与大小'],
          ['Windows 路径比较不要直接使用字符串 startsWith，优先使用 path.relative', 'rename 被占用时检查是否有未关闭的文件句柄']
        ),
        acceptance: ['能正确处理文本编码和文件错误', '路径跨平台且不允许逃逸', '关键写入不直接覆盖半成品'],
        resources: [resources.nodeFs, resources.nodePath]
      }),
      lesson({
        id: 'node-buffer-encoding',
        week: 'F4-03',
        title: 'Buffer、字符编码与二进制边界',
        duration: '90分钟',
        level: '基础',
        summary: '理解字符串与字节的区别，正确处理 UTF-8、Base64、字节长度和分块解码。',
        objectives: ['理解 Buffer 表示原始字节', '区分字符长度与字节长度', '避免切断多字节字符导致乱码'],
        sections: [
          section(
            '字符串不是字节数组',
            [
              'JavaScript 字符串使用 UTF-16 代码单元表示文本，Buffer 表示一段原始字节。网络和文件最终传输字节，编码决定文本与字节如何互相转换。',
              '中文字符在 UTF-8 中通常占 3 字节，因此 `text.length` 与 `Buffer.byteLength(text)` 不相等。HTTP Content-Length 必须使用字节长度。'
            ],
            [],
            code('javascript', [
              'const text = "你好A";',
              'const bytes = Buffer.from(text, "utf8");',
              '',
              'console.log(text.length);                 // 3',
              'console.log(Buffer.byteLength(text));     // 7',
              'console.log(bytes.toString("hex"));',
              'console.log(bytes.toString("utf8"));'
            ])
          ),
          section(
            'Buffer 创建与安全',
            [
              '`Buffer.from` 从字符串或数组创建，`Buffer.alloc` 创建并清零。`Buffer.allocUnsafe` 更快但可能包含旧内存数据，只有会立即完整覆盖且明确测量过性能时才使用。',
              'Base64 是编码，不是加密。它让二进制可以放入文本协议，但任何人都能解码。'
            ],
            ['Buffer.from(text, encoding)', 'Buffer.alloc(size)', 'buf.subarray(start,end) 共享内存视图', 'buf.toString(encoding)']
          ),
          section(
            '分块可能切断 UTF-8 字符',
            [
              '网络 chunk 边界与字符边界无关。直接对每个 Buffer 调用 toString 再拼接，可能把一个中文字符拆成两个无效片段。流上使用 `setEncoding("utf8")` 或 StringDecoder 保留未完成字节。'
            ],
            [],
            code('javascript', [
              'import { StringDecoder } from "node:string_decoder";',
              '',
              'const decoder = new StringDecoder("utf8");',
              'const input = Buffer.from("你好");',
              'console.log(decoder.write(input.subarray(0, 2)));',
              'console.log(decoder.write(input.subarray(2)));',
              'console.log(decoder.end());'
            ])
          )
        ],
        practice: practice(
          '实现编码检查器',
          '输入一段文本，输出字符长度、UTF-8 字节数、十六进制、Base64，并验证往返解码。',
          [
            step('读取命令行文本', '支持 `node src/encoding.js "你好 Agent"`，未提供时打印用法并设置退出码。'),
            step('输出四种表示', '输出 JS length、Buffer.byteLength、hex 和 base64。'),
            step('往返验证', '分别从 hex 与 base64 恢复字符串，使用严格相等断言。'),
            step('模拟错误分块', '把中文 Buffer 在第 2 字节处分开，比较逐块 toString 和 StringDecoder 的结果。'),
            step('记录结论', 'README 解释为什么 Content-Length 不能使用字符串 length。')
          ],
          ['中文的字符长度和字节长度不同', 'hex/base64 都能恢复原文', 'StringDecoder 分块结果无替换字符'],
          ['终端本身乱码时先确认脚本文件为 UTF-8，并用 JSON.stringify 输出排除字体问题', 'Base64 末尾 `=` 是填充，不是错误']
        ),
        acceptance: ['能区分字符和字节', '会安全创建与转换 Buffer', '知道如何处理跨 chunk 字符'],
        resources: [resources.nodeBuffer]
      }),
      lesson({
        id: 'node-stream-backpressure',
        week: 'F4-04',
        title: 'Stream、背压与 pipeline',
        duration: '140分钟',
        level: '核心基础',
        summary: '使用流分块处理大数据，理解 Readable、Writable、Transform、背压和错误传播。',
        objectives: ['理解四类流和 chunk', '知道背压为什么存在', '使用 pipeline 安全组合流'],
        sections: [
          section(
            '流解决什么问题',
            [
              '`readFile` 必须把整个文件放入内存，流则一块一块读取和处理。对大文件、上传下载、模型流式输出和日志管道，流能降低峰值内存并更早产生输出。',
              'Readable 产生数据，Writable 消费数据，Duplex 同时可读写，Transform 在读写之间转换数据。'
            ],
            ['文件读取流', 'HTTP 请求/响应流', '压缩流', '逐行解析与模型 token 流']
          ),
          section(
            '背压是生产与消费的协调',
            [
              '如果生产速度超过消费速度，数据会在内存累积。Writable 的 `write()` 返回 false 表示内部缓冲达到阈值，生产者应等待 `drain` 再继续。',
              '直接使用 `readable.pipe(writable)` 或 `pipeline` 会自动协调常见背压，不要在 data 事件里无条件向慢目标写入。'
            ],
            [],
            code('javascript', [
              'import { once } from "node:events";',
              '',
              'for await (const chunk of readable) {',
              '  if (!writable.write(chunk)) {',
              '    await once(writable, "drain");',
              '  }',
              '}',
              'writable.end();'
            ])
          ),
          section(
            'pipeline 统一完成、错误和销毁',
            [
              '`stream/promises` 的 pipeline 返回 Promise，并在任一流失败时销毁整条管道。相比手工监听每个 error/finish/close，它更不容易泄漏文件句柄。',
              'Transform 的 `_transform` 必须调用 callback；未调用会让管道永久等待。'
            ],
            [],
            code('javascript', [
              'import { createReadStream, createWriteStream } from "node:fs";',
              'import { Transform } from "node:stream";',
              'import { pipeline } from "node:stream/promises";',
              'import { StringDecoder } from "node:string_decoder";',
              '',
              'const decoder = new StringDecoder("utf8");',
              'const upper = new Transform({',
              '  transform(chunk, _encoding, callback) {',
              '    callback(null, decoder.write(chunk).toUpperCase());',
              '  },',
              '  flush(callback) {',
              '    callback(null, decoder.end().toUpperCase());',
              '  }',
              '});',
              '',
              'await pipeline(createReadStream("input.txt"), upper, createWriteStream("output.txt"));'
            ])
          )
        ],
        practice: practice(
          '实现大日志逐行统计器',
          '生成大日志文件，通过流逐行统计级别，不把整个文件读入内存。',
          [
            step('生成测试日志', '用写入流生成 10 万行 JSONL；若 write 返回 false，等待 drain。每行含 level、message、timestamp。'),
            step('建立读取管道', '使用 createReadStream 和 readline.createInterface 逐行迭代。'),
            step('解析与统计', '逐行 JSON.parse，统计 info/warn/error；坏行记录数量但不中断整个处理。'),
            step('观察内存', '处理前后输出 process.memoryUsage().rss，确认没有随文件大小等比例增长。'),
            step('增加失败用例', '目标目录不存在或输入文件不存在时，入口捕获错误、输出 code 并设置退出码。')
          ],
          ['准确处理 10 万行并输出三类计数', '坏行被统计且后续行继续处理', '没有使用 readFile', '错误后进程可以正常退出'],
          ['JSONL 行尾在 Windows 可能是 CRLF，readline 会正确处理', '生成器不等待 drain 会造成内存升高，应检查 write 返回值']
        ),
        acceptance: ['能选择流而非整文件读取', '理解并遵守背压', '管道错误能统一传播和清理'],
        resources: [resources.nodeStream, resources.nodeFs]
      }),
      lesson({
        id: 'node-http-capstone',
        week: 'F4-05',
        title: '原生 HTTP 服务：路由、JSON、超时与关闭',
        duration: '180分钟',
        level: '综合练习',
        summary: '不使用框架完成 JSON API 和静态文件服务，整合请求流、路径安全、错误响应、日志与优雅关闭。',
        objectives: ['理解 HTTP 请求与响应都是流', '实现最小路由和 JSON body 限制', '处理超时、错误和进程关闭'],
        sections: [
          section(
            'IncomingMessage 与 ServerResponse',
            [
              'Node.js 原生 http 回调收到 req 和 res。req 是 Readable，包含 method、url、headers 和请求体流；res 是 Writable，通过 statusCode、setHeader、write/end 发送响应。',
              '同一个请求只能结束一次。异步分支返回后要避免继续执行造成 `ERR_HTTP_HEADERS_SENT`。'
            ],
            [],
            code('javascript', [
              'import { createServer } from "node:http";',
              '',
              'const server = createServer((req, res) => {',
              '  res.statusCode = 200;',
              '  res.setHeader("content-type", "application/json; charset=utf-8");',
              '  res.end(JSON.stringify({ ok: true }));',
              '});',
              '',
              'server.listen(3000, "127.0.0.1");'
            ])
          ),
          section(
            '读取 JSON body 必须限制大小',
            [
              '请求体是流。把所有 chunk 收集后 JSON.parse 是小型 API 的可行做法，但必须设置字节上限，否则攻击者可以持续发送数据耗尽内存。超出上限应停止读取并返回 413。',
              'Content-Type、JSON 语法和字段结构是不同层次的校验，不能只捕获 JSON.parse。'
            ],
            ['只接受 `application/json`', '累计 Buffer 字节数', '限制例如 64 KiB', '解析失败返回 400', '业务校验失败返回 422']
          ),
          section(
            '路由与静态文件安全',
            [
              '使用 `new URL(req.url, base)` 解析路径和查询参数。静态文件路径必须限制在 public 根目录内，并按扩展名返回正确 Content-Type。',
              '基础练习可以手写少量路由，真实项目进入 W2 后使用 NestJS 管理模块、校验和中间件。'
            ]
          ),
          section(
            '请求日志与优雅关闭',
            [
              '为每个请求生成 requestId，记录 method、path、status 和 durationMs。日志应是结构化对象，不拼接不可解析的大字符串。',
              '收到 SIGINT/SIGTERM 后停止接收新连接，等待现有请求结束，再退出。关闭应设置最大等待时间，避免永久挂住。'
            ],
            [],
            code('javascript', [
              'process.on("SIGINT", () => {',
              '  console.log("shutting down");',
              '  server.close((error) => {',
              '    if (error) process.exitCode = 1;',
              '  });',
              '});'
            ])
          )
        ],
        practice: practice(
          'Node.js 基础毕业 Demo：任务 API 与静态站点',
          '从空目录实现 GET/POST 任务接口、静态文件、统一错误、请求日志和优雅关闭。',
          [
            step('建立目录和脚本', '创建 `src/server.js`、`src/router.js`、`src/body.js`、`src/files.js`、`public/index.html`，start 脚本运行 server。'),
            step('实现响应工具', '提供 sendJson(res,status,data) 和 sendError；Content-Type 包含 utf-8，错误包含 requestId、code、message。'),
            step('实现 body 解析', '异步迭代 req，累计 Buffer；超过 64 KiB 抛出 BODY_TOO_LARGE；JSON 错误为 INVALID_JSON。'),
            step('实现内存任务路由', '`GET /api/tasks` 返回数组；`POST /api/tasks` 校验 title，生成 id；未知 API 返回 404。'),
            step('实现静态文件', '`GET /` 返回 public/index.html；使用安全路径函数，拒绝 `..`；只允许 GET/HEAD。'),
            step('增加日志与错误边界', '请求开始记录时间，finally 输出一行 JSON 日志。请求处理最外层 catch 转统一响应。'),
            step('增加超时和关闭', '设置 requestTimeout/headersTimeout；SIGINT 调用 server.close，输出启动和关闭日志。'),
            step('手工验证完整流程', '在两个 PowerShell 窗口分别启动服务和调用接口。', code('powershell', [
              'npm start',
              'Invoke-RestMethod http://127.0.0.1:3000/api/tasks',
              "Invoke-RestMethod -Method Post -ContentType 'application/json' -Body '{\"title\":\"学习事件循环\"}' http://127.0.0.1:3000/api/tasks",
              'Invoke-WebRequest http://127.0.0.1:3000/'
            ])),
            step('补充自动化测试', '使用 `node:test` 启动随机端口，测试 GET、POST、非法 JSON、缺标题、404 和路径穿越。测试结束必须关闭服务器。')
          ],
          ['6 条自动化用例通过', '非法 body 不会导致进程崩溃', '每个响应和日志包含同一个 requestId', 'Ctrl+C 后端口被释放', 'README 可让其他人从零启动'],
          ['出现 headers already sent 时检查分支发送响应后是否 return', '测试挂起通常是服务器或连接没有关闭', '不要把用户 URL 直接拼到文件系统路径']
        ),
        acceptance: ['能独立完成原生 HTTP 服务', '请求体、路径、错误和生命周期都有边界', '具备进入 NestJS 与大模型 API 阶段的 Node.js 基础'],
        resources: [resources.nodeHttp, resources.nodeStream, resources.nodeProcess, resources.nodePath]
      })
    ]
  });
})();
