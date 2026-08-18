(function () {
  const F = window.FOUNDATION_COURSE;
  const { code } = F;
  const file = (name, language, lines, description = '') => ({ name, description, code: code(language, lines) });
  const demo = (title, description, files, commands, output, verify) => ({
    title,
    description,
    files,
    commands: code('powershell', commands),
    output: code('text', output),
    verify
  });

  const demos = {
    'start-here': demo(
      '学习仓库最小成品',
      '创建后即可作为后续 24 周的统一工作目录。',
      [file('docs/learning-log.md', 'markdown', [
        '# 学习日志',
        '',
        '## F1-01 TypeScript 环境',
        '- 目标：完成严格模式项目',
        '- 命令：npm run typecheck',
        '- 结果：通过',
        '- 问题与解释：待记录'
      ])],
      ['git init', 'git status --short'],
      ['?? docs/', '?? foundations/'],
      '目录存在且日志可以被 Git 跟踪；本章不要求安装业务依赖。'
    ),
    'ts-setup-tsconfig': demo(
      '严格模式 TypeScript 项目',
      '完整展示 ESM、严格检查、编译和运行链路。',
      [
        file('package.json', 'json', [
          '{',
          '  "name": "f1-01-ts-setup",',
          '  "private": true,',
          '  "type": "module",',
          '  "scripts": {',
          '    "typecheck": "tsc --noEmit",',
          '    "build": "tsc",',
          '    "start": "node dist/index.js"',
          '  },',
          '  "devDependencies": { "typescript": "^5.9.0" }',
          '}'
        ]),
        file('tsconfig.json', 'json', [
          '{',
          '  "compilerOptions": {',
          '    "target": "ES2022",',
          '    "module": "NodeNext",',
          '    "moduleResolution": "NodeNext",',
          '    "rootDir": "src",',
          '    "outDir": "dist",',
          '    "strict": true,',
          '    "noUncheckedIndexedAccess": true',
          '  },',
          '  "include": ["src/**/*.ts"]',
          '}'
        ]),
        file('src/index.ts', 'typescript', [
          'const course: string = "AgentPath";',
          'const weeklyHours: number = 9;',
          'console.log(`${course}: ${weeklyHours} 小时/周`);'
        ])
      ],
      ['npm install', 'npm run typecheck', 'npm run build', 'npm start'],
      ['AgentPath: 9 小时/周'],
      '`dist/index.js` 不再包含类型注解，package.json 的 `type` 明确为 module。'
    ),
    'ts-primitives-collections': demo(
      '课程统计器',
      '使用联合类型、只读数组和空值处理统计课程进度。',
      [file('demo.ts', 'typescript', [
        'type Status = "todo" | "done";',
        'interface Course {',
        '  title: string;',
        '  minutes: number;',
        '  status: Status;',
        '  tags: readonly string[];',
        '}',
        '',
        'function summarize(items: readonly Course[]) {',
        '  const totalMinutes = items.reduce((sum, item) => sum + item.minutes, 0);',
        '  const completed = items.filter((item) => item.status === "done").length;',
        '  const tags = [...new Set(items.flatMap((item) => item.tags))].sort();',
        '  return { totalMinutes, completed, tags };',
        '}',
        '',
        'console.log(summarize([',
        '  { title: "TS", minutes: 60, status: "done", tags: ["type"] },',
        '  { title: "Node", minutes: 90, status: "todo", tags: ["runtime", "type"] }',
        ']));'
      ])],
      ['npm init -y', 'npm install --save-dev typescript tsx', 'npx tsc --strict --noEmit demo.ts', 'npx tsx demo.ts'],
      ['{ totalMinutes: 150, completed: 1, tags: [ \'runtime\', \'type\' ] }'],
      '把输入改为空数组，应得到 0、0 和空标签数组。'
    ),
    'ts-object-modeling': demo(
      '可辨识联合请求状态',
      '通过 status 字段保证每个状态只包含合法数据。',
      [file('demo.ts', 'typescript', [
        'type Result<T> =',
        '  | { status: "loading" }',
        '  | { status: "success"; data: T }',
        '  | { status: "failure"; code: string; message: string };',
        '',
        'function render(result: Result<string>): string {',
        '  switch (result.status) {',
        '    case "loading": return "加载中";',
        '    case "success": return `结果: ${result.data}`;',
        '    case "failure": return `${result.code}: ${result.message}`;',
        '  }',
        '}',
        '',
        'console.log(render({ status: "success", data: "完成" }));',
        'console.log(render({ status: "failure", code: "E1", message: "失败" }));'
      ])],
      ['npm init -y', 'npm install --save-dev typescript tsx', 'npx tsc --strict --noEmit demo.ts', 'npx tsx demo.ts'],
      ['结果: 完成', 'E1: 失败'],
      '尝试构造 `{status:"success"}`，类型检查必须失败。'
    ),
    'ts-functions-async': demo(
      '保留全部结果的异步任务执行器',
      '单项错误被转换为结果联合，不会让批次提前退出。',
      [file('demo.ts', 'typescript', [
        'type JobResult<T> =',
        '  | { id: string; status: "ok"; value: T }',
        '  | { id: string; status: "error"; error: string };',
        '',
        'async function run<T>(id: string, job: () => Promise<T>): Promise<JobResult<T>> {',
        '  try {',
        '    return { id, status: "ok", value: await job() };',
        '  } catch (error: unknown) {',
        '    return { id, status: "error", error: error instanceof Error ? error.message : String(error) };',
        '  }',
        '}',
        '',
        'const results = await Promise.all([',
        '  run("a", async () => 1),',
        '  run("b", async () => { throw new Error("boom"); })',
        ']);',
        'console.log(JSON.stringify(results));'
      ])],
      ['npm init -y', 'npm pkg set type=module', 'npm install --save-dev typescript tsx', 'npx tsx demo.ts'],
      ['[{"id":"a","status":"ok","value":1},{"id":"b","status":"error","error":"boom"}]'],
      '批次必须包含两项，失败任务不能产生未处理 Promise 拒绝。'
    ),
    'ts-narrowing-exhaustive': demo(
      'unknown 事件守卫与穷尽检查',
      '先校验未知对象，再按事件类型完整分支。',
      [file('demo.ts', 'typescript', [
        'type StreamEvent = { type: "text"; value: string } | { type: "done" };',
        'function isEvent(value: unknown): value is StreamEvent {',
        '  if (typeof value !== "object" || value === null || !("type" in value)) return false;',
        '  const item = value as Record<string, unknown>;',
        '  return item.type === "done" || (item.type === "text" && typeof item.value === "string");',
        '}',
        'function assertNever(value: never): never { throw new Error(JSON.stringify(value)); }',
        'function handle(event: StreamEvent): string {',
        '  switch (event.type) {',
        '    case "text": return event.value;',
        '    case "done": return "完成";',
        '    default: return assertNever(event);',
        '  }',
        '}',
        'for (const value of [{ type: "text", value: "A" }, { type: "bad" }]) {',
        '  console.log(isEvent(value) ? handle(value) : "invalid");',
        '}'
      ])],
      ['npm init -y', 'npm install --save-dev typescript tsx', 'npx tsc --strict --noEmit demo.ts', 'npx tsx demo.ts'],
      ['A', 'invalid'],
      '新增 error 联合成员后，未修改 switch 时应出现编译错误。'
    ),
    'ts-generics-keyof': demo(
      '类型安全字段读取器',
      '泛型保留对象、字段名和返回值之间的关系。',
      [file('demo.ts', 'typescript', [
        'function getField<T, K extends keyof T>(value: T, key: K): T[K] {',
        '  return value[key];',
        '}',
        'function indexById<T extends { id: string }>(items: readonly T[]): Map<string, T> {',
        '  return new Map(items.map((item) => [item.id, item]));',
        '}',
        'const tasks = [{ id: "t1", title: "学习泛型", priority: 3 }];',
        'console.log(getField(tasks[0]!, "priority"));',
        'console.log(indexById(tasks).get("t1")?.title);'
      ])],
      ['npm init -y', 'npm install --save-dev typescript tsx', 'npx tsc --strict --noUncheckedIndexedAccess --noEmit demo.ts', 'npx tsx demo.ts'],
      ['3', '学习泛型'],
      '把字段改为 `missing` 必须在类型检查阶段失败。'
    ),
    'ts-utility-modules-errors': demo(
      '模块化服务与稳定错误码',
      '公共模型、错误和服务分文件，通过错误码而不是文案分支。',
      [
        file('src/errors.ts', 'typescript', [
          'export class AppError extends Error {',
          '  constructor(readonly code: "NOT_FOUND" | "VALIDATION", message: string) {',
          '    super(message);',
          '    this.name = "AppError";',
          '  }',
          '}'
        ]),
        file('src/index.ts', 'typescript', [
          'import { AppError } from "./errors.js";',
          'function findTask(id: string): string {',
          '  if (id !== "t1") throw new AppError("NOT_FOUND", "任务不存在");',
          '  return "学习模块";',
          '}',
          'try { console.log(findTask("t2")); }',
          'catch (error) {',
          '  if (error instanceof AppError) console.log(error.code);',
          '  else throw error;',
          '}'
        ])
      ],
      ['npm init -y', 'npm pkg set type=module', 'npm install --save-dev typescript tsx', 'npx tsx src/index.ts'],
      ['NOT_FOUND'],
      '修改中文消息不应影响调用方按 code 判断。'
    ),
    'ts-runtime-validation-client': demo(
      'Zod 安全响应解析',
      '把外部 JSON 保持为 unknown，只有 schema 验证后的值进入业务代码。',
      [file('demo.ts', 'typescript', [
        'import { z } from "zod";',
        'const UserSchema = z.object({ id: z.string(), role: z.enum(["user", "admin"]) });',
        'type User = z.infer<typeof UserSchema>;',
        'function parseUser(raw: unknown): User {',
        '  const result = UserSchema.safeParse(raw);',
        '  if (!result.success) throw new Error("INVALID_DATA");',
        '  return result.data;',
        '}',
        'console.log(parseUser({ id: "u1", role: "admin" }));',
        'try { parseUser({ id: "u2", role: "root" }); }',
        'catch (error) { console.log((error as Error).message); }'
      ])],
      ['npm init -y', 'npm pkg set type=module', 'npm install zod', 'npm install --save-dev typescript tsx', 'npx tsx demo.ts'],
      ["{ id: 'u1', role: 'admin' }", 'INVALID_DATA'],
      '非法 role 不得通过类型断言进入业务代码。'
    ),
    'node-runtime-project': demo(
      '运行时信息 CLI',
      '读取命令行参数并输出 Node.js 环境信息。',
      [file('index.mjs', 'javascript', [
        'const name = process.argv[2] ?? "student";',
        'console.log(`hello=${name}`);',
        'console.log(`node=${process.versions.node}`);',
        'console.log(`platform=${process.platform}`);',
        'console.log(`cwd=${process.cwd()}`);'
      ])],
      ['node index.mjs Lin'],
      ['hello=Lin', 'node=24.x.x', 'platform=win32', 'cwd=<当前目录绝对路径>'],
      '版本和 cwd 属于环境相关值；字段名和参数回显必须一致。'
    ),
    'node-modules-esm-cjs': demo(
      'ESM 计算器 CLI',
      '使用命名导出和公共入口组织模块。',
      [
        file('math.mjs', 'javascript', ['export const add = (a, b) => a + b;', 'export const subtract = (a, b) => a - b;']),
        file('cli.mjs', 'javascript', [
          'import { add, subtract } from "./math.mjs";',
          'const [operation, leftRaw, rightRaw] = process.argv.slice(2);',
          'const left = Number(leftRaw);',
          'const right = Number(rightRaw);',
          'if (!Number.isFinite(left) || !Number.isFinite(right)) throw new Error("INVALID_NUMBER");',
          'const fn = operation === "add" ? add : operation === "subtract" ? subtract : null;',
          'if (!fn) throw new Error("UNKNOWN_OPERATION");',
          'console.log(fn(left, right));'
        ])
      ],
      ['node cli.mjs add 2 3', 'node cli.mjs subtract 8 3'],
      ['5', '5'],
      '把 add 改为 multiply 应得到 UNKNOWN_OPERATION，而不是静默返回 NaN。'
    ),
    'node-event-loop-deep-dive': demo(
      'CJS/ESM 微任务与阻塞对照实验',
      '使用相同代码比较模块上下文，再单独测量主线程阻塞。',
      [
        file('order.cjs（相同内容也保存为 order.mjs）', 'javascript', [
          'console.log("sync-start");',
          'Promise.resolve().then(() => console.log("promise"));',
          'process.nextTick(() => console.log("nextTick"));',
          'console.log("sync-end");'
        ]),
        file('blocking.mjs', 'javascript', [
          'import { monitorEventLoopDelay } from "node:perf_hooks";',
          'const histogram = monitorEventLoopDelay({ resolution: 20 });',
          'histogram.enable();',
          'let last = Date.now();',
          'const heartbeat = setInterval(() => {',
          '  const now = Date.now(); console.log(`gap=${now - last}ms`); last = now;',
          '}, 500);',
          'setTimeout(() => {',
          '  const end = Date.now() + 3000;',
          '  while (Date.now() < end) {}',
          '  setTimeout(() => {',
          '    console.log(`max≈${Math.round(histogram.max / 1e6)}ms`);',
          '    clearInterval(heartbeat); histogram.disable();',
          '  }, 200);',
          '}, 1200);'
        ])
      ],
      ['node order.cjs', 'node order.mjs', 'node blocking.mjs'],
      ['CJS: sync-start -> sync-end -> nextTick -> promise', 'ESM(Node 24): sync-start -> sync-end -> promise -> nextTick', 'blocking: 至少一个 gap 和 max 接近 3000ms'],
      '不要断言 timer 与 immediate 的顶层顺序；这里仅断言已验证的模块上下文差异。'
    ),
    'node-async-errors-cancel': demo(
      '并发上限为 2 的任务池',
      'worker 共享索引取任务，单项错误被收集。',
      [file('pool.mjs', 'javascript', [
        'const jobs = [100, 80, -1, 60, 40];',
        'let cursor = 0;',
        'let active = 0;',
        'let maxActive = 0;',
        'const results = [];',
        'const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));',
        'async function worker() {',
        '  while (cursor < jobs.length) {',
        '    const id = cursor++; const ms = jobs[id]; active++; maxActive = Math.max(maxActive, active);',
        '    try { if (ms < 0) throw new Error("INVALID"); await sleep(ms); results[id] = "ok"; }',
        '    catch (error) { results[id] = error.message; }',
        '    finally { active--; }',
        '  }',
        '}',
        'await Promise.all([worker(), worker()]);',
        'console.log({ maxActive, results });'
      ])],
      ['node pool.mjs'],
      ["{ maxActive: 2, results: [ 'ok', 'ok', 'INVALID', 'ok', 'ok' ] }"],
      'maxActive 必须始终小于等于 2。'
    ),
    'node-event-emitter': demo(
      '进度事件与监听器清理',
      '同步发出进度，完成后移除监听器。',
      [file('events.mjs', 'javascript', [
        'import { EventEmitter } from "node:events";',
        'const bus = new EventEmitter();',
        'const onProgress = ({ current, total }) => console.log(`${current}/${total}`);',
        'bus.on("error", (error) => console.log(`error=${error.message}`));',
        'bus.on("progress", onProgress);',
        'for (let current = 1; current <= 3; current++) bus.emit("progress", { current, total: 3 });',
        'bus.off("progress", onProgress);',
        'console.log(`listeners=${bus.listenerCount("progress")}`);'
      ])],
      ['node events.mjs'],
      ['1/3', '2/3', '3/3', 'listeners=0'],
      '移除监听器必须使用注册时的同一个函数引用。'
    ),
    'node-files-path': demo(
      '安全路径笔记',
      '只允许在 data 目录内写入，并通过临时文件原子替换。',
      [file('notes.mjs', 'javascript', [
        'import { mkdir, readFile, rename, writeFile } from "node:fs/promises";',
        'import path from "node:path";',
        'const root = path.resolve("data");',
        'function safePath(name) {',
        '  const target = path.resolve(root, name);',
        '  const relative = path.relative(root, target);',
        '  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("OUTSIDE_ROOT");',
        '  return target;',
        '}',
        'await mkdir(root, { recursive: true });',
        'const target = safePath("note.txt");',
        'await writeFile(`${target}.tmp`, "你好 Node", "utf8");',
        'await rename(`${target}.tmp`, target);',
        'console.log(await readFile(target, "utf8"));',
        'try { safePath("../secret.txt"); } catch (error) { console.log(error.message); }'
      ])],
      ['node notes.mjs'],
      ['你好 Node', 'OUTSIDE_ROOT'],
      '项目外不得创建 secret.txt，临时文件在成功后应消失。'
    ),
    'node-buffer-encoding': demo(
      'UTF-8 编码与 StringDecoder',
      '在中文字符中间分块，验证解码器能正确恢复。',
      [file('encoding.mjs', 'javascript', [
        'import { StringDecoder } from "node:string_decoder";',
        'const text = "你好A";',
        'const buffer = Buffer.from(text, "utf8");',
        'console.log(`chars=${text.length} bytes=${buffer.length}`);',
        'const decoder = new StringDecoder("utf8");',
        'const restored = decoder.write(buffer.subarray(0, 2)) + decoder.write(buffer.subarray(2)) + decoder.end();',
        'console.log(restored);',
        'console.log(Buffer.from(buffer.toString("base64"), "base64").equals(buffer));'
      ])],
      ['node encoding.mjs'],
      ['chars=3 bytes=7', '你好A', 'true'],
      '输出中不能出现替换字符 `�`。'
    ),
    'node-stream-backpressure': demo(
      '不会切断 UTF-8 的大写转换流',
      'StringDecoder 保留跨 chunk 的半个字符，pipeline 统一处理错误。',
      [file('stream.mjs', 'javascript', [
        'import { Readable, Transform, Writable } from "node:stream";',
        'import { pipeline } from "node:stream/promises";',
        'import { StringDecoder } from "node:string_decoder";',
        'const bytes = Buffer.from("你好 agent");',
        'const source = Readable.from([bytes.subarray(0, 2), bytes.subarray(2)]);',
        'const decoder = new StringDecoder("utf8");',
        'const upper = new Transform({',
        '  transform(chunk, _encoding, callback) { callback(null, decoder.write(chunk).toUpperCase()); },',
        '  flush(callback) { callback(null, decoder.end().toUpperCase()); }',
        '});',
        'let result = "";',
        'const sink = new Writable({ write(chunk, _encoding, callback) { result += chunk.toString(); callback(); } });',
        'await pipeline(source, upper, sink);',
        'console.log(result);'
      ])],
      ['node stream.mjs'],
      ['你好 AGENT'],
      '输入故意在中文 UTF-8 字节中间切块，输出仍不得乱码。'
    ),
    'node-http-capstone': demo(
      '可测试的原生任务 API',
      '服务器导出工厂，测试使用随机端口并负责关闭。',
      [
        file('server.mjs', 'javascript', [
          'import { createServer } from "node:http";',
          'import { resolve } from "node:path";',
          'import { fileURLToPath } from "node:url";',
          'export function buildServer() {',
          '  const tasks = [];',
          '  return createServer((req, res) => {',
          '    res.setHeader("content-type", "application/json; charset=utf-8");',
          '    if (req.method === "GET" && req.url === "/api/tasks") return res.end(JSON.stringify(tasks));',
          '    res.statusCode = 404; res.end(JSON.stringify({ code: "NOT_FOUND" }));',
          '  });',
          '}',
          'if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {',
          '  buildServer().listen(3000, "127.0.0.1", () => console.log("http://127.0.0.1:3000"));',
          '}'
        ]),
        file('server.test.mjs', 'javascript', [
          'import test from "node:test";',
          'import assert from "node:assert/strict";',
          'import { once } from "node:events";',
          'import { buildServer } from "./server.mjs";',
          'test("GET tasks", async (t) => {',
          '  const server = buildServer().listen(0, "127.0.0.1");',
          '  t.after(() => server.close()); await once(server, "listening");',
          '  const address = server.address();',
          '  const response = await fetch(`http://127.0.0.1:${address.port}/api/tasks`);',
          '  assert.equal(response.status, 200); assert.deepEqual(await response.json(), []);',
          '});'
        ])
      ],
      ['node --test server.test.mjs'],
      ['ok 1 - GET tasks', '# pass 1', '# fail 0'],
      '测试结束后进程应自行退出，随机端口不得残留。'
    ),
    'python-environment-project': demo(
      '虚拟环境信息脚本',
      '证明脚本使用项目解释器并满足 Python 3.12。',
      [file('main.py', 'python', [
        'import platform',
        'import sys',
        'from importlib.metadata import version',
        '',
        'if sys.version_info < (3, 12):',
        '    raise RuntimeError("Python 3.12+ required")',
        'print(f"python={platform.python_version()}")',
        'print(f"httpx={version(\'httpx\')}")',
        'print(f"venv={sys.prefix != sys.base_prefix}")'
      ])],
      ['python -m venv .venv', '.\\.venv\\Scripts\\Activate.ps1', 'python -m pip install httpx', 'python main.py'],
      ['python=3.12.x（或更新）', 'httpx=<安装版本>', 'venv=True'],
      'venv 必须为 True，解释器版本不得低于 3.12。'
    ),
    'python-syntax-control': demo(
      '成绩清洗与统计',
      '显式处理 None、bool、边界和空列表。',
      [file('stats.py', 'python', [
        'values: list[object] = [85, 0, 100, -1, None, True, 70]',
        'valid: list[int] = []',
        'invalid: list[object] = []',
        'for value in values:',
        '    if isinstance(value, int) and not isinstance(value, bool) and 0 <= value <= 100:',
        '        valid.append(value)',
        '    else:',
        '        invalid.append(value)',
        'average = sum(valid) / len(valid) if valid else 0',
        'print(f"count={len(valid)} average={average:.2f}")',
        'print(f"invalid={invalid}")'
      ])],
      ['python stats.py'],
      ['count=4 average=63.75', 'invalid=[-1, None, True]'],
      'True 不能因为是 int 子类而进入有效分数。'
    ),
    'python-collections-comprehensions': demo(
      '用户标签清洗',
      '使用字典去重用户、集合去重标签，并避免修改原输入。',
      [file('clean.py', 'python', [
        'records = [',
        '    {"id": "u1", "name": " Lin ", "tags": ["RAG", "rag"]},',
        '    {"id": "u2", "name": "Ada", "tags": ["Agent"]},',
        ']',
        'cleaned = {',
        '    item["id"]: {',
        '        "name": item["name"].strip(),',
        '        "tags": sorted({tag.strip().lower() for tag in item.get("tags", [])}),',
        '    }',
        '    for item in records',
        '    if item.get("id") and item.get("name", "").strip()',
        '}',
        'print(cleaned)',
        'print(records[0]["tags"])'
      ])],
      ['python clean.py'],
      ["{'u1': {'name': 'Lin', 'tags': ['rag']}, 'u2': {'name': 'Ada', 'tags': ['agent']}}", "['RAG', 'rag']"],
      '第二行证明原始嵌套列表未被修改。'
    ),
    'python-functions-typing': demo(
      'Token 成本纯函数',
      '关键字专用价格参数、负数校验和可重复断言。',
      [file('cost.py', 'python', [
        'def calculate_cost(',
        '    input_tokens: int, output_tokens: int, *, input_price: float, output_price: float',
        ') -> float:',
        '    values = (input_tokens, output_tokens, input_price, output_price)',
        '    if any(value < 0 for value in values):',
        '        raise ValueError("values must be non-negative")',
        '    return input_tokens * input_price + output_tokens * output_price',
        '',
        'cost = calculate_cost(100, 20, input_price=0.001, output_price=0.002)',
        'assert abs(cost - 0.14) < 1e-9',
        'print(f"cost={cost:.2f}")'
      ])],
      ['python cost.py'],
      ['cost=0.14'],
      '把任意参数改为负数，应抛出 ValueError。'
    ),
    'python-modules-exceptions': demo(
      '配置加载与异常链',
      '把文件和 JSON 错误转换为稳定领域异常并保留 cause。',
      [file('config_demo.py', 'python', [
        'import json',
        'from pathlib import Path',
        'class ConfigError(Exception): pass',
        'def load(path: Path) -> dict[str, object]:',
        '    try:',
        '        return json.loads(path.read_text(encoding="utf-8"))',
        '    except (OSError, json.JSONDecodeError) as error:',
        '        raise ConfigError(f"无法读取配置: {path}") from error',
        'Path("good.json").write_text(\'{"timeout": 3}\', encoding="utf-8")',
        'print(load(Path("good.json")))',
        'try: load(Path("missing.json"))',
        'except ConfigError as error: print(type(error.__cause__).__name__)'
      ])],
      ['python config_demo.py'],
      ["{'timeout': 3}", 'FileNotFoundError'],
      '__cause__ 必须保留底层异常类型。'
    ),
    'python-files-json': demo(
      '容错 JSONL 统计器',
      '逐行读取、记录坏行并原子写出报告。',
      [file('jsonl_demo.py', 'python', [
        'import json',
        'from pathlib import Path',
        'source = Path("items.jsonl")',
        'source.write_text(\'{"chars": 3}\\nbad\\n{"chars": 7}\\n\', encoding="utf-8")',
        'total = 0; invalid: list[int] = []',
        'with source.open(encoding="utf-8") as stream:',
        '    for number, line in enumerate(stream, start=1):',
        '        try: total += int(json.loads(line)["chars"])',
        '        except (json.JSONDecodeError, KeyError, TypeError, ValueError): invalid.append(number)',
        'report = {"total": total, "invalid_lines": invalid}',
        'target = Path("report.json"); temp = target.with_suffix(".tmp")',
        'temp.write_text(json.dumps(report, ensure_ascii=False), encoding="utf-8"); temp.replace(target)',
        'print(report)'
      ])],
      ['python jsonl_demo.py'],
      ["{'total': 10, 'invalid_lines': [2]}"],
      '坏行不能阻断第 3 行，结束后不存在 report.tmp。'
    ),
    'python-classes-dataclasses': demo(
      '可注入的文档仓库',
      'dataclass 使用默认工厂，服务依赖 Protocol 而不是全局仓库。',
      [file('service.py', 'python', [
        'from dataclasses import dataclass, field',
        'from typing import Protocol',
        '@dataclass',
        'class Document:',
        '    id: str; title: str; tags: list[str] = field(default_factory=list)',
        'class Store(Protocol):',
        '    def save(self, document: Document) -> None: ...',
        'class MemoryStore:',
        '    def __init__(self) -> None: self.items: dict[str, Document] = {}',
        '    def save(self, document: Document) -> None: self.items[document.id] = document',
        'class Service:',
        '    def __init__(self, store: Store) -> None: self.store = store',
        '    def create(self, document: Document) -> None:',
        '        if not document.title.strip(): raise ValueError("EMPTY_TITLE")',
        '        self.store.save(document)',
        'store = MemoryStore(); Service(store).create(Document("d1", "Guide"))',
        'print(list(store.items))'
      ])],
      ['python service.py'],
      ["['d1']"],
      '再创建一个 Document 并修改 tags，两个实例不得共享列表。'
    ),
    'python-async-fastapi-capstone': demo(
      'FastAPI 文档分析服务与 Node 客户端',
      '请求由 Pydantic 校验，统计逻辑可独立测试。',
      [
        file('app.py', 'python', [
          'from fastapi import FastAPI',
          'from pydantic import BaseModel, Field',
          'app = FastAPI()',
          'class Request(BaseModel): text: str = Field(min_length=1, max_length=100_000)',
          'class Response(BaseModel): characters: int; lines: int',
          '@app.get("/health")',
          'def health() -> dict[str, str]: return {"status": "ok"}',
          '@app.post("/analyze", response_model=Response)',
          'async def analyze(payload: Request) -> Response:',
          '    return Response(characters=len(payload.text), lines=len(payload.text.splitlines()) or 1)'
        ]),
        file('client.mjs', 'javascript', [
          'const response = await fetch("http://127.0.0.1:8000/analyze", {',
          '  method: "POST", headers: { "content-type": "application/json" },',
          '  body: JSON.stringify({ text: "你好 Agent\\n第二行" })',
          '});',
          'if (!response.ok) throw new Error(`HTTP ${response.status}`);',
          'console.log(await response.json());'
        ])
      ],
      ['python -m pip install fastapi uvicorn', 'python -m uvicorn app:app --port 8000', '# 新开 PowerShell', 'node client.mjs'],
      ["{ characters: 12, lines: 2 }（空格和换行均计入 characters）"],
      '客户端源码中的 `\\n` 必须保持为两个字符，运行时 JSON 才会包含换行。'
    ),
    'backend-sql-modeling': demo(
      '用户与会话关系模型',
      '一份 SQL 文件完成建表、种子和连接聚合查询。',
      [file('demo.sql', 'sql', [
        'DROP TABLE IF EXISTS conversations, users CASCADE;',
        'CREATE TABLE users (id text PRIMARY KEY, email text NOT NULL UNIQUE);',
        'CREATE TABLE conversations (id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id), title text NOT NULL);',
        "INSERT INTO users VALUES ('u1','a@example.com'),('u2','b@example.com');",
        "INSERT INTO conversations VALUES ('c1','u1','First'),('c2','u1','Second');",
        'SELECT u.email, count(c.id) AS total',
        'FROM users u LEFT JOIN conversations c ON c.user_id = u.id',
        'GROUP BY u.id, u.email ORDER BY u.email;'
      ])],
      ['psql -d agent_learning -f demo.sql'],
      ['a@example.com | 2', 'b@example.com | 0'],
      '第二个用户没有会话，但 LEFT JOIN 必须保留并显示 0。'
    ),
    'backend-transactions-migrations': demo(
      '可回滚账户事务',
      '使用 psql 的事务和约束证明失败写入不会留下部分结果。',
      [file('transaction.sql', 'sql', [
        'DROP TABLE IF EXISTS accounts;',
        'CREATE TABLE accounts (id text PRIMARY KEY, balance integer NOT NULL CHECK (balance >= 0));',
        "INSERT INTO accounts VALUES ('a',100),('b',0);",
        'BEGIN;',
        "UPDATE accounts SET balance = balance - 30 WHERE id = 'a';",
        "UPDATE accounts SET balance = balance + 30 WHERE id = 'b';",
        'COMMIT;',
        'SELECT id, balance FROM accounts ORDER BY id;'
      ])],
      ['psql -d agent_learning -f transaction.sql'],
      ['a | 70', 'b | 30'],
      '把转出金额改为 300 时 CHECK 应使事务失败，最终余额仍是初始化值。'
    ),
    'backend-redis-cache': demo(
      '带 TTL 的 cache-aside',
      '第一次回源、第二次命中缓存，并显示剩余 TTL。',
      [file('cache.mjs', 'javascript', [
        'import { createClient } from "redis";',
        'const client = createClient({ url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379" });',
        'await client.connect();',
        'const key = "agentpath:demo:user:u1";',
        'let source = "cache"; let value = await client.get(key);',
        'if (!value) { source = "repository"; value = JSON.stringify({ id: "u1", name: "Lin" }); await client.set(key, value, { EX: 30 }); }',
        'console.log(source, JSON.parse(value), await client.ttl(key));',
        'await client.del(key); await client.quit();'
      ])],
      ['npm init -y', 'npm pkg set type=module', 'npm install redis', 'node cache.mjs'],
      ["repository { id: 'u1', name: 'Lin' } <1到30之间的TTL>"],
      '再次运行前若保留 DEL，仍会回源；为观察命中可临时注释 DEL 并连续运行两次。'
    ),
    'backend-auth-testing': demo(
      '所有权授权单元测试',
      '纯函数明确本人、管理员与拒绝三条路径。',
      [file('auth.test.mjs', 'javascript', [
        'import test from "node:test";',
        'import assert from "node:assert/strict";',
        'function canRead(user, task) { return user.role === "admin" || user.id === task.userId; }',
        'const task = { id: "t1", userId: "u1" };',
        'test("owner", () => assert.equal(canRead({ id: "u1", role: "user" }, task), true));',
        'test("other user", () => assert.equal(canRead({ id: "u2", role: "user" }, task), false));',
        'test("admin", () => assert.equal(canRead({ id: "u3", role: "admin" }, task), true));'
      ])],
      ['node --test auth.test.mjs'],
      ['# tests 3', '# pass 3', '# fail 0'],
      '授权必须在服务端执行；前端是否显示按钮不影响三条断言。'
    )
  };

  const missing = [];
  for (const module of F.modules) {
    for (const lesson of module.lessons) {
      const item = demos[lesson.id];
      if (!item) missing.push(lesson.id);
      else lesson.practice.demo = item;
    }
  }
  if (missing.length) throw new Error(`缺少基础 Demo: ${missing.join(', ')}`);
})();
