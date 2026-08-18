(function () {
  const F = window.FOUNDATION_COURSE;
  const { code, section, step } = F;
  const file = (name, language, lines, description = '') => ({ name, description, code: code(language, lines) });
  const demo = (title, description, files, commands, output, verify) => ({
    title,
    description,
    files,
    commands: code('powershell', commands),
    output: code('text', output),
    verify
  });

  const upgrades = {
    'w1-reliable-client': {
      sections: [
        section('重试必须受总预算约束', [
          '单次超时、最大尝试次数和总截止时间是三个不同边界。每次重试前先计算剩余预算，不能让三次 3 秒超时把用户请求拖成 9 秒以上。',
          '只重试临时网络错误、429 和部分 5xx。参数错误、认证失败和业务拒绝不会因为重试而恢复。指数退避加入随机抖动，避免多个实例同时再次冲击上游。'
        ], ['总 deadline', '单次 timeout', '最大 attempts', '可重试错误白名单', '退避与 jitter']),
        section('适配器隔离供应商差异', [
          '业务层依赖统一接口，不直接读取供应商响应字段。Adapter 负责 URL、请求体、鉴权头、错误映射和响应归一化。',
          'AbortSignal 从入口传入 Client，再传给 fetch；用户取消后不得继续重试。结构化日志记录 attempt、duration、status 和 requestId，但不记录密钥。'
        ])
      ],
      steps: [
        step('定义错误分类', '建立 TIMEOUT、RATE_LIMIT、UPSTREAM、INVALID_REQUEST、CANCELLED。'),
        step('实现单次请求', '组合调用方 signal 与单次 timeout，finally 清理资源。'),
        step('增加重试循环', '仅对白名单错误重试，并检查总截止时间。'),
        step('使用本地假服务测试', '服务前两次返回 503，第三次返回 200；另测取消和 400。'),
        step('记录指标', '输出尝试次数、总耗时和最终错误分类。')
      ],
      expected: ['503 两次后第三次成功', '400 只调用一次', '取消后不再发起下一次请求'],
      troubleshooting: ['测试不应访问真实模型 API', '不要重试 POST 写操作，除非具有幂等键和明确协议'],
      demo: demo('本地可重试 HTTP Client', '启动本地假上游，前两次失败、第三次成功。', [file('demo.mjs', 'javascript', [
        'import { createServer } from "node:http";',
        'import { once } from "node:events";',
        'let calls = 0;',
        'const server = createServer((_req, res) => { calls++; res.statusCode = calls < 3 ? 503 : 200; res.end(calls < 3 ? "retry" : "ok"); });',
        'server.listen(0, "127.0.0.1"); await once(server, "listening");',
        'const { port } = server.address();',
        'async function request(url, attempts = 3) {',
        '  for (let attempt = 1; attempt <= attempts; attempt++) {',
        '    const response = await fetch(url, { signal: AbortSignal.timeout(1000) });',
        '    console.log(`attempt=${attempt} status=${response.status}`);',
        '    if (response.ok) return response.text();',
        '    if (response.status < 500 || attempt === attempts) throw new Error(`HTTP_${response.status}`);',
        '    await new Promise((resolve) => setTimeout(resolve, 20 * attempt));',
        '  }',
        '}',
        'console.log(await request(`http://127.0.0.1:${port}`));',
        'server.close();'
      ])], ['node demo.mjs'], ['attempt=1 status=503', 'attempt=2 status=503', 'attempt=3 status=200', 'ok'], '总调用次数必须为 3；将第一次状态改为 400 后只能调用一次。')
    },
    'w2-nest-streaming': {
      sections: [
        section('SSE 是有边界的单向事件流', [
          'SSE 响应使用 `text/event-stream`，每条事件以空行结束。浏览器 EventSource 只支持 GET；聊天 POST 流可直接使用 fetch 读取响应流，或拆分为创建任务与订阅事件。',
          '事件应有明确 type 和 JSON data。连接断开时取消上游生成并释放定时器，不能继续消耗 token。'
        ]),
        section('NestJS 分层与生命周期', [
          'Controller 只处理协议映射，Provider 承担业务与上游调用，DTO/Pipe 校验输入。模块声明依赖，避免 Controller 内 new 服务。',
          '流式端点必须处理完成、错误和取消三种结束路径。写响应后发生的异常不能再发送普通 JSON 错误，应转成流内 error 事件并关闭。'
        ])
      ],
      steps: [step('初始化 Nest 项目', '建立 AppModule、ChatController 和 ChatService。'), step('定义事件结构', 'token、done、error 三类事件使用可辨识联合。'), step('实现定时 token 流', '使用 Observable 或 AsyncIterable 产生固定 token。'), step('处理断开', '监听请求 close 并清理生成器。'), step('使用 curl 验证', '检查 Content-Type、事件空行和结束事件。')],
      expected: ['客户端按顺序收到 A、B、C、done', '断开后服务端停止产生 token'],
      troubleshooting: ['代理可能缓存响应，需要禁用 buffering', '每条 SSE 必须以两个换行结束'],
      demo: demo('NestJS DTO 与可取消 SSE 服务', '概念章已验证 SSE 协议；本 Demo 使用真实 NestJS Module、Controller、Provider、ValidationPipe 和流清理。', [
        file('package.json', 'json', [
          '{',
          '  "name": "nest-sse-learning",',
          '  "private": true,',
          '  "type": "module",',
          '  "scripts": { "build": "tsc -p tsconfig.json", "start": "npm run build && node dist/main.js" }',
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
          '    "experimentalDecorators": true,',
          '    "emitDecoratorMetadata": true,',
          '    "skipLibCheck": true',
          '  }',
          '}'
        ]),
        file('src/main.ts', 'typescript', [
          'import "reflect-metadata";',
          'import { ValidationPipe } from "@nestjs/common";',
          'import { NestFactory } from "@nestjs/core";',
          'import { AppModule } from "./app.module.js";',
          '',
          'const app = await NestFactory.create(AppModule);',
          'app.enableShutdownHooks();',
          'app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));',
          'await app.listen(3000, "127.0.0.1");',
          'console.log("http://127.0.0.1:3000");'
        ]),
        file('src/app.module.ts', 'typescript', [
          'import { Module } from "@nestjs/common";',
          'import { ChatController } from "./chat.controller.js";',
          'import { ChatService } from "./chat.service.js";',
          '',
          '@Module({ controllers: [ChatController], providers: [ChatService] })',
          'export class AppModule {}'
        ]),
        file('src/chat.service.ts', 'typescript', [
          'import { Injectable, type MessageEvent } from "@nestjs/common";',
          'import { Observable } from "rxjs";',
          '',
          'type CloseAwareRequest = {',
          '  socket: {',
          '    on(event: "close", listener: () => void): void;',
          '    off(event: "close", listener: () => void): void;',
          '  };',
          '};',
          '',
          '@Injectable()',
          'export class ChatService {',
          '  stream(request: CloseAwareRequest): Observable<MessageEvent> {',
          '    return new Observable((subscriber) => {',
          '      const tokens = ["A", "B", "C"];',
          '      let index = 0;',
          '      const close = () => subscriber.complete();',
          '      request.socket.on("close", close);',
          '      const timer = setInterval(() => {',
          '        if (index < tokens.length) subscriber.next({ type: "token", data: { value: tokens[index++] } });',
          '        else { subscriber.next({ type: "done", data: {} }); subscriber.complete(); }',
          '      }, 300);',
          '      return () => { clearInterval(timer); request.socket.off("close", close); console.log("stream-cleaned"); };',
          '    });',
          '  }',
          '}'
        ]),
        file('src/chat.controller.ts', 'typescript', [
          'import { Body, Controller, Post, Req, Sse } from "@nestjs/common";',
          'import { IsString, MinLength } from "class-validator";',
          'import { randomUUID } from "node:crypto";',
          'import type { Observable } from "rxjs";',
          'import type { MessageEvent } from "@nestjs/common";',
          'import { ChatService } from "./chat.service.js";',
          '',
          'class CreateChatDto {',
          '  @IsString()',
          '  @MinLength(1)',
          '  message!: string;',
          '}',
          '',
          '@Controller("chat")',
          'export class ChatController {',
          '  constructor(private readonly chat: ChatService) {}',
          '',
          '  @Post()',
          '  create(@Body() _body: CreateChatDto) {',
          '    const id = randomUUID();',
          '    return { id, streamUrl: `/chat/${id}/events` };',
          '  }',
          '',
          '  @Sse(":id/events")',
          '  stream(@Req() request: Parameters<ChatService["stream"]>[0]): Observable<MessageEvent> {',
          '    return this.chat.stream(request);',
          '  }',
          '}'
        ])
      ], ['npm install @nestjs/common @nestjs/core class-transformer class-validator reflect-metadata rxjs', 'npm install -D typescript @types/node', 'npm start', '# 新开 PowerShell：先创建会话，再订阅流', '$body = @{ message = "hello" } | ConvertTo-Json', '$chat = Invoke-RestMethod -Method Post -ContentType "application/json" -Body $body http://127.0.0.1:3000/chat', 'curl.exe -N "http://127.0.0.1:3000$($chat.streamUrl)"'], ['event: token / data: {"value":"A"}', 'event: token / data: {"value":"B"}', 'event: token / data: {"value":"C"}', 'event: done / data: {}', '服务端输出 stream-cleaned'], '`npm start` 必须先通过真实 TypeScript 编译并生成 design:paramtypes；空 message 返回 400；客户端中途 Ctrl+C 或应用收到关闭信号后，服务端输出 stream-cleaned。')
    },
    'w3-data-auth-tests': {
      sections: [
        section('从 F7-F8 组合真实请求链路', [
          'HTTP 层依次完成请求 ID、会话认证、DTO 校验、授权、事务写入和缓存失效。每一层只处理自己的失败，不把数据库异常原样暴露给客户端。',
          '用户、会话、消息和调用记录使用关系表；Redis 保存短期会话、限流或缓存。业务真相仍由 PostgreSQL 约束。'
        ]),
        section('测试必须跨越真正的边界', [
          '服务纯函数用单元测试；Repository 使用测试数据库验证 SQL、约束和事务；HTTP 集成测试启动真实应用并从请求入口断言。',
          '每个测试创建独立标识并清理数据，不能依赖执行顺序。测试环境密钥与生产隔离。'
        ])
      ],
      steps: [step('建立迁移', '创建 users、sessions、messages、model_calls 和索引。'), step('实现认证 Guard', '从 HttpOnly Cookie 读取不透明 session id。'), step('实现事务服务', '写消息和 model_call 在同一事务完成。'), step('增加 Redis 限流', '以 userId 为维度，测试使用独立 key。'), step('编写三层测试', '单元、数据库集成、HTTP 集成各至少两条。')],
      expected: ['未认证 401、越权 403、校验 422', '事务失败时消息和调用记录都不落库'],
      troubleshooting: ['不要在集成测试中 mock 掉 PostgreSQL', '日志不得输出 Cookie、JWT 或模型密钥'],
      demo: demo('事务原子性 SQL', '用一份 SQL 证明消息与调用记录共同回滚。', [file('atomic.sql', 'sql', [
        'CREATE TEMP TABLE messages(id text PRIMARY KEY, content text NOT NULL);',
        'CREATE TEMP TABLE calls(id text PRIMARY KEY, message_id text NOT NULL REFERENCES messages(id));',
        'BEGIN;',
        "INSERT INTO messages VALUES ('m1','hello');",
        "INSERT INTO calls VALUES ('c1','missing');",
        'COMMIT;',
        'SELECT count(*) FROM messages;'
      ])], ['psql -d agent_learning -v ON_ERROR_STOP=0 -f atomic.sql'], ['ERROR: insert or update on table "calls" violates foreign key constraint', 'ROLLBACK', 'count = 0（重新查询临时表时）'], '第二条写入失败后 messages 也必须回滚；实际练习建议在持久测试 schema 中验证。')
    },
    'w4-python-docker-e2e': {
      sections: [
        section('服务边界通过契约而不是语言耦合', [
          'Node.js 调用 Python 时只依赖 HTTP/OpenAPI 契约，超时、错误码和请求 ID要跨服务传递。Python 内部实现可以改变，只要契约和行为保持。',
          '健康检查区分进程存活与依赖就绪。容器启动顺序不能替代重试，因为 depends_on 不保证业务服务已经可用。'
        ]),
        section('镜像和 Compose 的最低要求', [
          '镜像使用固定基础版本、非 root 用户、明确工作目录和最小依赖。不要把 `.env`、缓存和虚拟环境复制进镜像。',
          'Compose 用于本地集成；E2E 等待健康检查后从 Node API 入口调用 Python，不能绕过被测试链路。'
        ])
      ],
      steps: [step('建立 Python /analyze', 'Pydantic 校验文本并返回统计。'), step('建立 Dockerfile', '使用 python:3.12-slim、非 root 用户和 healthcheck。'), step('建立 Node adapter', '传递 requestId 和 3 秒超时。'), step('Compose 组装', '为两个服务建立内部网络。'), step('E2E 验证', '从公开 Node 端口请求并断言 Python 结果。')],
      expected: ['docker compose up 后两个健康检查通过', 'E2E 返回字符数与行数'],
      troubleshooting: ['容器内 localhost 指向自身，服务间用 Compose service name', '不要在镜像中写入真实密钥'],
      demo: demo('最小 FastAPI 容器', '完整 Dockerfile 与服务文件，可单独构建运行。', [
        file('app.py', 'python', ['from fastapi import FastAPI', 'app = FastAPI()', '@app.get("/health")', 'def health() -> dict[str, str]: return {"status": "ok"}']),
        file('requirements.txt', 'text', ['fastapi==0.116.1', 'uvicorn==0.35.0']),
        file('Dockerfile', 'dockerfile', ['FROM python:3.12-slim', 'WORKDIR /app', 'COPY requirements.txt .', 'RUN pip install --no-cache-dir -r requirements.txt', 'COPY app.py .', 'EXPOSE 8000', 'CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]'])
      ], ['docker build -t agentpath-python .', 'docker run --rm -p 8000:8000 agentpath-python', '# 新开 PowerShell', 'Invoke-RestMethod http://127.0.0.1:8000/health'], ['status', '------', 'ok'], '停止容器后端口应释放；正式作业再增加非 root 用户和容器 healthcheck。')
    },
    'w5-model-streaming': {
      sections: [
        section('消息与事件是两个不同模型', [
          '持久化消息表示 user/assistant/tool 的业务记录；传输事件表示 token、tool-call、usage、done、error。不要把每个 token 当成一条数据库消息。',
          'Provider Adapter 把供应商增量事件归一化。业务层只消费统一事件，并在 done 时保存最终消息与 usage。'
        ]),
        section('密钥、取消与失败恢复', [
          '密钥只在服务端环境中读取。客户端取消必须传到上游；已经输出部分文本后发生错误，UI 应保留部分内容并显示可重试状态。',
          '切换供应商时记录 model、provider、latency、tokens 和 finishReason，才能比较质量与成本。'
        ])
      ],
      steps: [step('定义 Provider 接口', 'stream(messages, signal) 返回 AsyncIterable 统一事件。'), step('实现 MockProvider', '固定产生三个 token 和 usage。'), step('实现 SSE 映射', '事件序列化为 type+data。'), step('处理取消', 'Abort 后生成器停止且不产生 done。'), step('替换真实 Provider', '只改 adapter，不改业务与 UI。')],
      expected: ['mock 流依次输出 token、usage、done', '取消路径无后续 token'],
      troubleshooting: ['不要把 API key 放到 VITE_ 或 NEXT_PUBLIC_ 环境变量', '流结束与网络断开不是同一个状态'],
      demo: demo('可替换 Mock Provider', '无需真实密钥，验证统一流事件。', [file('provider.mjs', 'javascript', [
        'class MockProvider {',
        '  async *stream(_messages, signal) {',
        '    for (const text of ["你好", "，", "Agent"]) {',
        '      signal?.throwIfAborted(); yield { type: "token", text };',
        '    }',
        '    yield { type: "usage", input: 3, output: 3 };',
        '    yield { type: "done", finishReason: "stop" };',
        '  }',
        '}',
        'for await (const event of new MockProvider().stream([], new AbortController().signal)) console.log(JSON.stringify(event));'
      ])], ['node provider.mjs'], ['{"type":"token","text":"你好"}', '{"type":"token","text":"，"}', '{"type":"token","text":"Agent"}', '{"type":"usage","input":3,"output":3}', '{"type":"done","finishReason":"stop"}'], '接入真实供应商后仍必须产生相同事件结构。')
    },
    'w6-structured-tools': {
      sections: [
        section('模型提议，服务端决定执行', [
          'Tool Calling 不是模型直接调用函数。模型输出工具名和参数，服务端根据白名单找到实现，再执行 schema 校验、认证、授权和审计。',
          '读取工具与写入工具风险不同。退款、删除和发消息等副作用操作需要幂等键、用户确认和权限检查。'
        ]),
        section('结构化输出必须由 schema 验证', [
          '不要从自然语言截取大括号解析 JSON。使用供应商结构化输出能力，并在应用边界用 Zod/JSON Schema 再验证。',
          'schema 版本应与评测数据关联；字段变更必须更新消费者和回归用例。'
        ])
      ],
      steps: [step('定义 ToolRegistry', '工具包含 name、schema、risk 和 execute。'), step('注册 calculator', '仅接受有限数字。'), step('注册 refund 提议', '风险为 write，执行前要求 approved=true。'), step('处理未知工具', '返回稳定 TOOL_NOT_ALLOWED。'), step('测试参数和授权', '覆盖非法数值、越权、重复幂等键。')],
      expected: ['合法 calculator 返回结果', '未知或非法工具不会进入 execute', '高风险工具未批准不执行'],
      troubleshooting: ['schema 校验后使用解析结果，不使用原始参数', '工具实现仍需业务级授权'],
      demo: demo('Zod 工具注册表', '使用确定性模型输出模拟服务端校验与执行。', [file('tools.mjs', 'javascript', [
        'import { z } from "zod";',
        'const tools = new Map([["add", {',
        '  schema: z.object({ a: z.number().finite(), b: z.number().finite() }),',
        '  execute: ({ a, b }) => a + b',
        '}]]);',
        'async function callTool(name, raw) {',
        '  const tool = tools.get(name); if (!tool) throw new Error("TOOL_NOT_ALLOWED");',
        '  return tool.execute(tool.schema.parse(raw));',
        '}',
        'console.log(await callTool("add", { a: 2, b: 3 }));',
        'try { await callTool("delete", {}); } catch (error) { console.log(error.message); }'
      ])], ['npm init -y', 'npm pkg set type=module', 'npm install zod', 'node tools.mjs'], ['5', 'TOOL_NOT_ALLOWED'], '把 a 改成字符串必须产生 Zod 校验错误，execute 不得运行。')
    },
    'w7-context-evals': {
      sections: [
        section('上下文管理是信息预算', [
          '优先保留系统规则、当前任务、最近消息和必要证据；旧对话可摘要，但摘要也要版本化并可追溯。裁剪不能删除工具结果中的关键业务状态。',
          '缓存和模型路由只在固定评测集上比较。更便宜模型若任务成功率下降，不能仅凭 token 成本宣布优化。'
        ]),
        section('评测基线由样本、断言和指标组成', [
          '每条样本包含输入、上下文、期望行为和标签。确定性任务使用精确断言，开放回答使用规则、人工或模型评审组合。',
          '报告同时记录成功率、P95 延迟、输入/输出 token 和估算成本，按任务类型分组，避免平均值掩盖失败。'
        ])
      ],
      steps: [step('创建 evals.jsonl', '至少 20 条，包含正常、边界、拒答和工具路径。'), step('建立 baseline', '固定 mock 或模型版本与 prompt。'), step('实现断言', '分类用精确匹配，引用用包含检查。'), step('记录耗时成本', '每条结果保存 durationMs 和 cost。'), step('比较路由', '按标签选择模型并与 baseline 对比。')],
      expected: ['报告包含分组成功率和失败样本', '任何 prompt/模型变更都生成新报告'],
      troubleshooting: ['测试集不要只包含已经成功的案例', '模型评审器也需要抽样人工校准'],
      demo: demo('确定性评测运行器', '用固定分类器展示样本、断言和汇总结构。', [file('eval.mjs', 'javascript', [
        'const cases = [',
        '  { input: "退款", expected: "refund" },',
        '  { input: "查订单", expected: "order" },',
        '  { input: "你好", expected: "other" }',
        '];',
        'const classify = (text) => text.includes("退款") ? "refund" : text.includes("订单") ? "order" : "other";',
        'const results = cases.map((item) => ({ ...item, actual: classify(item.input) }));',
        'const passed = results.filter((item) => item.actual === item.expected).length;',
        'console.log(JSON.stringify({ passed, total: results.length, successRate: passed / results.length }));'
      ])], ['node eval.mjs'], ['{"passed":3,"total":3,"successRate":1}'], '故意修改一个 expected 后，successRate 必须下降且能定位具体失败样本。')
    },
    'w8-rag-ingestion': {
      sections: [
        section('摄取链路必须可重复和可追溯', [
          '加载后先标准化编码、空白和页码，再按内容哈希去重。Chunk 保留 source、title、page、version 和 sectionPath，检索结果才能回到原文。',
          '重建索引要使用稳定 documentId/chunkId，并能按版本删除旧块。不要每次运行不断追加重复向量。'
        ]),
        section('切分策略取决于文档结构', [
          '固定字符切分简单但会破坏标题与段落；结构切分优先按 Markdown 标题、PDF 页面或表格单元；过长段落再使用带 overlap 的窗口。',
          'Embedding 前记录原始文本与规范化文本。向量只能用于相似度，权限、版本和产品线等确定条件使用元数据过滤。'
        ])
      ],
      steps: [step('加载两份文档', '保留 source、version 和标题。'), step('规范化并去重', '使用 SHA-256 生成 documentId。'), step('结构切分', '标题作为 chunk 上下文，过长段落再窗口切分。'), step('生成稳定 chunkId', 'documentId+section+offset。'), step('验证重建', '连续运行两次，chunk 数量不增长。')],
      expected: ['每个 chunk 都有来源与版本', '重复文档被识别', '重建结果稳定'],
      troubleshooting: ['不要用数组序号作为长期 chunkId', 'PDF 页眉页脚应在切分前清洗'],
      demo: demo('真实 Embedding 与 pgvector 幂等摄取', '概念章已用固定语料解释证据链；本 Demo 调用 OpenAI-compatible Embedding API，将稳定 Chunk 写入真实 pgvector 并执行一次向量检索。', [
        file('package.json', 'json', [
          '{',
          '  "name": "rag-ingestion-learning",',
          '  "private": true,',
          '  "type": "module",',
          '  "scripts": { "start": "node ingestion.mjs" }',
          '}'
        ]),
        file('ingestion.mjs', 'javascript', [
          'import { embed, embedMany } from "ai";',
          'import { createOpenAICompatible } from "@ai-sdk/openai-compatible";',
          'import { createHash } from "node:crypto";',
          'import pg from "pg";',
          'import pgvector from "pgvector/pg";',
          '',
          'for (const name of ["MODEL_BASE_URL", "MODEL_API_KEY", "EMBEDDING_MODEL", "DATABASE_URL"]) {',
          '  if (!process.env[name]) throw new Error(`MISSING_ENV:${name}`);',
          '}',
          'const provider = createOpenAICompatible({',
          '  name: "learning-provider",',
          '  baseURL: process.env.MODEL_BASE_URL,',
          '  apiKey: process.env.MODEL_API_KEY',
          '});',
          'const model = provider.textEmbeddingModel(process.env.EMBEDDING_MODEL);',
          'const source = "guide.md";',
          'const version = "v1";',
          'const text = "# Guide\\n## Install\\nRun npm install.\\n## Start\\nRun npm start.";',
          'const documentId = createHash("sha256").update(`${source}:${version}:${text}`).digest("hex").slice(0, 12);',
          'const chunks = text.split(/(?=^## )/m).slice(1).map((part, index) => {',
          '  const [heading, ...body] = part.trim().split("\\n");',
          '  return { id: `${documentId}:${index}`, source, version, heading: heading.slice(3), text: body.join(" ") };',
          '});',
          'const { embeddings } = await embedMany({ model, values: chunks.map((chunk) => `${chunk.heading}\\n${chunk.text}`) });',
          'const dimensions = embeddings[0]?.length;',
          'if (!Number.isInteger(dimensions) || dimensions < 8 || dimensions > 10000) throw new Error("INVALID_EMBEDDING_DIMENSIONS");',
          '',
          'const client = new pg.Client({ connectionString: process.env.DATABASE_URL });',
          'await client.connect();',
          'await client.query("CREATE EXTENSION IF NOT EXISTS vector");',
          'await pgvector.registerTypes(client);',
          'await client.query(`CREATE TABLE IF NOT EXISTS chunks (id text PRIMARY KEY, source text NOT NULL, version text NOT NULL, heading text NOT NULL, content text NOT NULL, embedding vector(${dimensions}) NOT NULL)`);',
          'for (const [index, chunk] of chunks.entries()) {',
          '  await client.query(',
          '    "INSERT INTO chunks(id, source, version, heading, content, embedding) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO UPDATE SET source=EXCLUDED.source, version=EXCLUDED.version, heading=EXCLUDED.heading, content=EXCLUDED.content, embedding=EXCLUDED.embedding",',
          '    [chunk.id, chunk.source, chunk.version, chunk.heading, chunk.text, pgvector.toSql(embeddings[index])]',
          '  );',
          '}',
          'const { embedding: queryVector } = await embed({ model, value: "怎样启动项目" });',
          'const result = await client.query("SELECT id, heading, 1 - (embedding <=> $1::vector) AS score FROM chunks ORDER BY embedding <=> $1::vector LIMIT 2", [pgvector.toSql(queryVector)]);',
          'console.log(JSON.stringify({ documentId, chunks: chunks.length, dimensions, results: result.rows }));',
          'await client.end();'
        ])
      ], ['docker run --name agentpath-pgvector -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=agent_learning -p 5432:5432 -d pgvector/pgvector:pg16', 'npm install ai @ai-sdk/openai-compatible pg pgvector', '$env:DATABASE_URL="postgres://postgres:postgres@127.0.0.1:5432/agent_learning"', '$env:MODEL_BASE_URL="<所选模型平台的 OpenAI-compatible API 地址>"', '$env:MODEL_API_KEY="<仅保存在本机环境变量中的密钥>"', '$env:EMBEDDING_MODEL="<该平台的 Embedding 模型 ID>"', 'npm start', '# 重复运行一次，验证 upsert 不增加行数'], ['输出 documentId、chunks: 2 和实际 embedding dimensions', 'results 中 Start 通常排在 Install 之前，并带相似度 score', '第二次运行仍只有相同两个主键'], '先确认所选平台支持 OpenAI-compatible Embedding 接口；重复运行后执行 `SELECT count(*) FROM chunks` 必须仍为 2。更换 Embedding 模型或维度时使用新索引版本并重建表。')
    },
    'w9-rag-retrieval': {
      sections: [
        section('混合检索合并词法与语义信号', [
          'BM25 擅长产品名、错误码和专有词，向量检索擅长同义表达。先分别取候选，再通过归一化分数、RRF 或重排器合并。',
          'Top-K 不是越大越好。过多弱相关块会增加成本并诱导模型。查询改写保留原问题，所有检索步骤进入 trace。'
        ]),
        section('引用和拒答是生成约束', [
          '模型回答中的事实必须绑定 chunkId/source/page。前端引用定位使用后端返回的结构化 citation，不从回答文本猜测。',
          '没有足够证据时明确拒答或转人工。阈值需要在固定评测集上调，不靠单个例子决定。'
        ])
      ],
      steps: [step('准备候选集', '建立包含错误码和同义问法的 8 个 chunk。'), step('实现词法分数', '按查询词命中数形成可解释基线。'), step('加入向量 fixture', '测试中使用固定语义分数。'), step('RRF 合并', '保留每路排名和最终分数。'), step('生成引用回答', '返回 answer 与 citations 数组；低于阈值拒答。')],
      expected: ['专有错误码被词法检索召回', '同义问题由语义候选召回', '引用可定位到 source'],
      troubleshooting: ['不要把生成答案再当作检索证据', '检索阈值应按任务标签评测'],
      demo: demo('RRF 混合排名', '使用两个固定排名列表验证合并公式。', [file('rrf.mjs', 'javascript', [
        'const lexical = ["c1", "c2", "c3"];',
        'const semantic = ["c2", "c4", "c1"];',
        'const scores = new Map();',
        'for (const ranking of [lexical, semantic]) ranking.forEach((id, index) => scores.set(id, (scores.get(id) ?? 0) + 1 / (60 + index + 1)));',
        'const result = [...scores].sort((a, b) => b[1] - a[1]).map(([id]) => id);',
        'console.log(result.join(","));'
      ])], ['node rrf.mjs'], ['c2,c1,c4,c3'], 'c2 在两路排名靠前，应成为第一；实际系统还需元数据过滤和重排。')
    },
    'w10-rag-evaluation': {
      sections: [
        section('检索和生成要分开评测', [
          'Recall@K 判断相关文档是否进入候选，MRR 关注第一个相关结果位置。若检索失败，生成模型无法凭空补救；若检索成功而回答不忠实，问题在生成与提示约束。',
          '忠实度、答案相关性和引用正确率需要保存回答、上下文和引用，不能只存一个总分。'
        ]),
        section('回归报告要支持决策', [
          '对同一 Golden Dataset 比较切分、embedding、Top-K 和重排方案。报告包含均值、分位数和失败切片，并固定配置版本。',
          '质量、延迟和成本是共同约束。只有指标改善且风险可接受，方案才通过发布门禁。'
        ])
      ],
      steps: [step('建立 50 条 Golden Dataset', '标注 expectedChunkIds 与答案要点。'), step('运行检索', '保存 rankedChunkIds 和耗时。'), step('计算 Recall@K/MRR', '对每条和整体输出。'), step('评估回答', '保存忠实度与引用断言。'), step('比较两方案', '输出差异和退化案例。')],
      expected: ['报告可定位每个失败样本', '两方案使用同一数据集与指标'],
      troubleshooting: ['Golden Dataset 也要版本化', '模型评审分数不能替代引用和规则断言'],
      demo: demo('Recall@K 与 MRR 计算', '用三个固定样本验证指标实现。', [file('metrics.mjs', 'javascript', [
        'const cases = [',
        '  { relevant: ["a", "b"], ranked: ["a", "x", "b"] },',
        '  { relevant: ["c"], ranked: ["x", "c"] },',
        '  { relevant: ["d"], ranked: ["x", "y"] }',
        '];',
        'const recallAt2 = cases.reduce((sum, item) => {',
        '  const recalled = new Set(item.ranked.slice(0, 2).filter((id) => item.relevant.includes(id))).size;',
        '  return sum + recalled / item.relevant.length;',
        '}, 0) / cases.length;',
        'const mrr = cases.reduce((sum, item) => { const i = item.ranked.findIndex((id) => item.relevant.includes(id)); return sum + (i < 0 ? 0 : 1 / (i + 1)); }, 0) / cases.length;',
        'console.log(`recall@2=${recallAt2.toFixed(3)} mrr=${mrr.toFixed(3)}`);'
      ])], ['node metrics.mjs'], ['recall@2=0.500 mrr=0.500'], '第一条有两个 relevant chunk，但 Top-2 只召回 a，因此该条 Recall@2 必须为 0.5；MRR 只看第一个相关结果的位置。')
    },
    'w11-workflows-agents': {
      sections: [
        section('先把确定性路径画成状态图', [
          '输入分类、权限检查、数据库写入和错误恢复应是确定性节点；只有意图模糊、工具选择或内容生成才交给模型。',
          'State Schema 明确每个节点可读写字段。节点返回局部更新，边根据状态路由；必须有最大步数和终止条件，避免循环。'
        ]),
        section('Workflow 优先于自主 Agent', [
          '已知业务流程使用顺序、并行、条件和循环组合，更容易测试与审计。Agent 适合路径无法预先枚举且工具风险受控的任务。',
          '框架只是执行状态图的工具。先用确定性 fixture 验证节点输入输出，再替换模型路由。'
        ])
      ],
      steps: [step('定义 State', '包含 input、intent、evidence、toolResult、answer、steps。'), step('实现 classify', '测试用确定性分类器。'), step('实现条件路由', '知识问题走 retrieve，订单问题走 tool。'), step('增加 maxSteps', '超过阈值进入 failure。'), step('记录 trace', '每个节点写入名称、输入摘要和耗时。')],
      expected: ['知识与订单输入走不同节点', '未知输入安全结束', '任何路径不超过最大步数'],
      troubleshooting: ['不要让模型决定权限检查是否执行', '节点副作用要幂等并可重试'],
      demo: demo('LangGraph 显式状态图', '概念章已用普通循环解释 State 与终止；本 Demo 使用真实 LangGraph Annotation、节点、条件边和 recursionLimit。', [
        file('package.json', 'json', [
          '{',
          '  "name": "langgraph-workflow-learning",',
          '  "private": true,',
          '  "type": "module",',
          '  "scripts": { "build": "tsc -p tsconfig.json", "start": "npm run build && node dist/workflow.js" }',
          '}'
        ]),
        file('tsconfig.json', 'json', [
          '{',
          '  "compilerOptions": {',
          '    "target": "ES2022",',
          '    "module": "NodeNext",',
          '    "moduleResolution": "NodeNext",',
          '    "strict": true,',
          '    "outDir": "dist",',
          '    "skipLibCheck": true',
          '  },',
          '  "include": ["workflow.ts"]',
          '}'
        ]),
        file('workflow.ts', 'typescript', [
          'import { Annotation, END, START, StateGraph } from "@langchain/langgraph";',
          '',
          'const State = Annotation.Root({',
          '  input: Annotation<string>(),',
          '  intent: Annotation<"order" | "knowledge" | "fallback">(),',
          '  answer: Annotation<string>(),',
          '  trace: Annotation<string[]>({ reducer: (current, update) => current.concat(update), default: () => [] })',
          '});',
          '',
          'const classify = (state: typeof State.State) => ({',
          '  intent: state.input.includes("订单") ? "order" as const : state.input.includes("安装") ? "knowledge" as const : "fallback" as const,',
          '  trace: ["classify"]',
          '});',
          'const order = (_state: typeof State.State) => ({ answer: "订单工具结果", trace: ["order"] });',
          'const knowledge = (_state: typeof State.State) => ({ answer: "知识库结果", trace: ["knowledge"] });',
          'const fallback = (_state: typeof State.State) => ({ answer: "无法确定，请转人工", trace: ["fallback"] });',
          '',
          'const graph = new StateGraph(State)',
          '  .addNode("classify", classify)',
          '  .addNode("order", order)',
          '  .addNode("knowledge", knowledge)',
          '  .addNode("fallback", fallback)',
          '  .addEdge(START, "classify")',
          '  .addConditionalEdges("classify", (state) => state.intent, { order: "order", knowledge: "knowledge", fallback: "fallback" })',
          '  .addEdge("order", END)',
          '  .addEdge("knowledge", END)',
          '  .addEdge("fallback", END)',
          '  .compile();',
          '',
          'for (const input of ["查询订单", "如何安装", "天气如何"]) {',
          '  const result = await graph.invoke({ input }, { recursionLimit: 4 });',
          '  console.log(`${input}: ${result.trace.join(" -> ")} | ${result.answer}`);',
          '}'
        ])
      ], ['npm install @langchain/langgraph', 'npm install -D typescript @types/node', 'npm start'], ['查询订单: classify -> order | 订单工具结果', '如何安装: classify -> knowledge | 知识库结果', '天气如何: classify -> fallback | 无法确定，请转人工'], '`npm start` 必须先通过 TypeScript 编译；三类输入走不同节点；把任一终止边改成回到 classify 后，recursionLimit 应阻止无限循环。')
    },
    'w12-persistence-hitl': {
      sections: [
        section('Checkpoint 保存可恢复状态', [
          '每个会话拥有 threadId，关键节点后保存 state、nextNode 和版本。恢复时先读取 checkpoint，不从头重复执行已完成副作用。',
          'Checkpoint 数据需要访问控制和保留策略，其中可能包含用户输入、工具结果和敏感信息。'
        ]),
        section('审批与幂等共同保护写操作', [
          '高风险工具在执行前生成 proposal，保存参数摘要并中断。用户批准后重新校验身份、权限、参数和数据新鲜度，再执行。',
          '幂等键绑定业务操作，重复恢复或网络重试返回第一次结果，不能重复退款。'
        ])
      ],
      steps: [step('定义 checkpoint', '包含 threadId、state、nextNode、version。'), step('执行到审批点', '写 proposal 后返回 pending。'), step('模拟进程重启', '新进程读取文件并恢复。'), step('批准并执行', '重新授权，使用 idempotencyKey。'), step('重复批准', '返回相同结果且执行计数仍为 1。')],
      expected: ['重启后仍处于 pending', '未批准不执行', '重复批准只执行一次'],
      troubleshooting: ['不要把闭包或函数写入 checkpoint', '审批后业务数据可能变化，必须二次校验'],
      demo: demo('跨进程 Checkpoint 与幂等执行', '用一个持久化文件同时保存 checkpoint 和 effects；连续启动三个 Node 进程验证恢复后不会重复退款。', [file('hitl.mjs', 'javascript', [
        'import { readFile, writeFile } from "node:fs/promises";',
        'const path = "hitl-state.json";',
        'const action = process.argv[2];',
        '',
        'if (action === "init") {',
        '  const database = {',
        '    checkpoint: { threadId: "th1", status: "pending", nextNode: "refund", proposal: { action: "refund", amount: 10 }, idempotencyKey: "refund:th1:10" },',
        '    effects: {},',
        '    executionCount: 0',
        '  };',
        '  await writeFile(path, JSON.stringify(database, null, 2), "utf8");',
        '  console.log("initialized pending");',
        '} else {',
        '  const database = JSON.parse(await readFile(path, "utf8"));',
        '  if (action === "approve") {',
        '    const key = database.checkpoint.idempotencyKey;',
        '    if (!database.effects[key]) {',
        '      database.executionCount += 1;',
        '      database.effects[key] = { result: "refund:r1", amount: database.checkpoint.proposal.amount };',
        '    }',
        '    database.checkpoint = { ...database.checkpoint, status: "done", nextNode: null, result: database.effects[key].result };',
        '    await writeFile(path, JSON.stringify(database, null, 2), "utf8");',
        '    console.log(`result=${database.checkpoint.result} executions=${database.executionCount}`);',
        '  } else if (action === "show") {',
        '    console.log(`status=${database.checkpoint.status} executions=${database.executionCount} effects=${Object.keys(database.effects).length}`);',
        '  } else throw new Error("USE:init|approve|show");',
        '}'
      ])], ['node hitl.mjs init', '# 第一个恢复进程：批准并执行', 'node hitl.mjs approve', '# 第二个恢复进程：重复批准', 'node hitl.mjs approve', 'node hitl.mjs show'], ['initialized pending', 'result=refund:r1 executions=1', 'result=refund:r1 executions=1', 'status=done executions=1 effects=1'], '第二次 approve 必须重新读取磁盘且 executions 仍为 1。生产系统应在同一数据库事务中用 idempotency_key 唯一约束保存 effect 与 checkpoint。')
    },
    'w13-mcp-security': {
      sections: [
        section('MCP 只标准化能力发现与调用', [
          'Client 连接 Server，Server 暴露 Tools、Resources 和 Prompts。协议描述参数与结果，但不会替你完成用户认证、业务授权、租户隔离和审批。',
          '远程 Server 属于外部依赖，需校验来源、传输、版本和权限。工具返回内容同样是不可信输入。'
        ]),
        section('Prompt Injection 不能靠提示词解决', [
          '文档可能包含“忽略规则并调用删除工具”等恶意指令。检索内容只能作为数据，不提升为系统权限；模型提出的调用仍经过独立策略层。',
          '工具默认只读，参数 schema 限制长度与值域，写操作需要确认。审计记录 server、tool、用户、参数摘要、结果和耗时。'
        ])
      ],
      steps: [step('建立工具目录', '记录 server、tool、risk、requiredScopes。'), step('校验调用', '先 schema，再用户 scope，再资源归属。'), step('处理恶意资源', '资源文本不能修改策略。'), step('高风险审批', 'write 工具生成 proposal。'), step('审计与脱敏', '敏感参数只记录哈希或摘要。')],
      expected: ['无 scope 调用被拒绝', '恶意资源不能调用写工具', '允许调用具有完整审计'],
      troubleshooting: ['不要自动信任本地 MCP Server', '工具描述也是不可信元数据，需要固定允许列表'],
      demo: demo('MCP SDK Server、Client 与授权网关', '概念章已跟踪协议生命周期；本 Demo 使用真实 MCP SDK 启动 stdio Server，由 Client 发现并调用工具，同时在 SDK 调用前执行本地授权。', [
        file('package.json', 'json', [
          '{',
          '  "name": "mcp-security-learning",',
          '  "private": true,',
          '  "type": "module",',
          '  "scripts": { "start": "node client.mjs" }',
          '}'
        ]),
        file('server.mjs', 'javascript', [
          'import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";',
          'import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";',
          'import { z } from "zod";',
          '',
          'const actorId = process.env.MCP_USER_ID;',
          'if (!actorId) throw new Error("MISSING_VERIFIED_ACTOR");',
          'const orders = new Map([',
          '  ["o_100", { id: "o_100", ownerId: "u_1", status: "shipped" }],',
          '  ["o_200", { id: "o_200", ownerId: "u_2", status: "pending" }]',
          ']);',
          'const server = new McpServer({ name: "orders-learning-server", version: "1.0.0" });',
          'server.registerTool(',
          '  "orders_read",',
          '  { description: "按订单 ID 查询当前用户可见的订单", inputSchema: { id: z.string().regex(/^o_[0-9]+$/) } },',
          '  async ({ id }) => {',
          '    const order = orders.get(id);',
          '    if (!order || order.ownerId !== actorId) return { isError: true, content: [{ type: "text", text: JSON.stringify({ error: "RESOURCE_FORBIDDEN" }) }] };',
          '    return { content: [{ type: "text", text: JSON.stringify({ id: order.id, status: order.status }) }] };',
          '  }',
          ');',
          'await server.connect(new StdioServerTransport());'
        ], 'stdio Server 的 stdout 只能写协议消息。此处由可信 Host 用环境绑定 actor；远程 Server 必须从验证过的访问令牌/会话取得身份，绝不能信任工具参数中的 userId。'),
        file('client.mjs', 'javascript', [
          'import { Client } from "@modelcontextprotocol/sdk/client/index.js";',
          'import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";',
          '',
          'const catalog = new Map([',
          '  ["orders_read", { risk: "read", scope: "orders:read" }],',
          '  ["refund_create", { risk: "write", scope: "refund:write" }]',
          ']);',
          'const orderOwners = new Map([["o_100", "u_1"], ["o_200", "u_2"]]);',
          'function authorize(user, toolName, args, approved = false) {',
          '  const policy = catalog.get(toolName);',
          '  if (!policy) throw new Error("TOOL_NOT_ALLOWED");',
          '  if (!user.scopes.includes(policy.scope)) throw new Error("FORBIDDEN");',
          '  if (toolName === "orders_read" && orderOwners.get(args.id) !== user.id) throw new Error("RESOURCE_FORBIDDEN");',
          '  if (policy.risk === "write" && !approved) throw new Error("APPROVAL_REQUIRED");',
          '}',
          '',
          'const user = { id: "u_1", scopes: ["orders:read"] };',
          'const transport = new StdioClientTransport({ command: process.execPath, args: ["server.mjs"], env: { ...process.env, MCP_USER_ID: user.id } });',
          'const client = new Client({ name: "orders-learning-client", version: "1.0.0" });',
          'await client.connect(transport);',
          'const listed = await client.listTools();',
          'console.log(`tools=${listed.tools.map((tool) => tool.name).join(",")}`);',
          'authorize(user, "orders_read", { id: "o_100" });',
          'const result = await client.callTool({ name: "orders_read", arguments: { id: "o_100" } });',
          'console.log(`result=${result.content[0].text}`);',
          'try { authorize(user, "orders_read", { id: "o_200" }); } catch (error) { console.log(`host-blocked=${error.message}`); }',
          'const denied = await client.callTool({ name: "orders_read", arguments: { id: "o_200" } });',
          'console.log(`server-blocked=${denied.content[0].text}`);',
          'try { authorize(user, "refund_create", {}, true); } catch (error) { console.log(`scope-blocked=${error.message}`); }',
          'await client.close();'
        ])
      ], ['npm install @modelcontextprotocol/sdk zod', 'npm start'], ['tools=orders_read', 'result={"id":"o_100","status":"shipped"}', 'host-blocked=RESOURCE_FORBIDDEN', 'server-blocked={"error":"RESOURCE_FORBIDDEN"}', 'scope-blocked=FORBIDDEN'], 'Host 在 callTool 前校验 scope 和订单 owner；故意绕过 Host 调用 o_200 时，Server 仍按已验证 actor 拒绝。生产远程 Server 从访问令牌而不是 args 获取 actor/tenant。')
    },
    'w14-system-design': {
      sections: [
        section('设计从用户任务和失败模式开始', [
          '先列用户、触发条件、成功标准和人工兜底，再决定是否需要 RAG、Workflow 或 Agent。能用普通代码完成的确定性步骤不交给模型。',
          '非功能需求包含延迟、并发、可用性、成本、隐私、审计和数据保留，必须有可测指标。'
        ]),
        section('威胁模型与权限矩阵是设计输入', [
          '画出浏览器、API、模型供应商、数据库、向量库、MCP 和人工审批之间的数据流与信任边界。',
          '每个工具列出角色、租户范围、读写风险、参数校验、审批、幂等和审计要求。风险不能等开发完成后补。'
        ])
      ],
      steps: [step('写一页问题定义', '用户、任务、非目标和成功指标。'), step('画数据流', '标记信任边界和敏感数据。'), step('建立权限矩阵', '覆盖全部工具与角色。'), step('建立 50 条评测集', '正常、边界、攻击和故障。'), step('做成本预算', '按日请求量、token、检索和存储估算。')],
      expected: ['设计明确不用 Agent 的部分', '每项风险有控制和验证方法'],
      troubleshooting: ['不要用框架名称代替架构决策', '指标必须有数据来源和阈值'],
      demo: demo('设计门禁检查器', '用结构化 JSON 检查关键设计项是否齐全。', [file('design-check.mjs', 'javascript', [
        'const design = {',
        '  users: ["support"],',
        '  metrics: ["task_success", "p95", "cost"],',
        '  tools: [{ name: "refund", risk: "write", approval: true, idempotency: true }],',
        '  evalCases: 50,',
        '  threatModel: true',
        '};',
        'const checks = { users: design.users.length > 0, metrics: design.metrics.length >= 3, tools: design.tools.every((t) => t.risk !== "write" || (t.approval && t.idempotency)), evals: design.evalCases >= 50, threatModel: design.threatModel };',
        'console.log(checks, Object.values(checks).every(Boolean) ? "PASS" : "FAIL");'
      ])], ['node design-check.mjs'], ['{ users: true, metrics: true, tools: true, evals: true, threatModel: true } PASS'], '把 refund.approval 改为 false，门禁必须 FAIL。')
    },
    'w15-observability-deploy': {
      sections: [
        section('Trace 连接一次用户任务的全部步骤', [
          '入口创建 traceId，模型、检索、工具、数据库和下游 HTTP 建立子 span。Span 记录名称、开始结束、状态和低基数属性，不把完整提示词和敏感响应默认写入。',
          '日志携带 traceId，指标聚合请求量、错误率、P95、token 和成本。三者互补，不能只看 console.log。'
        ]),
        section('部署门禁包含健康、回归和回滚', [
          '容器需要 startup/readiness/liveness 语义，依赖异常时 readiness 失败但进程可继续恢复。部署前运行单元、集成、E2E 和固定 AI 评测。',
          'Prompt、模型、schema、代码和评测集都记录版本。新版本指标退化时能回滚到已知组合。'
        ])
      ],
      steps: [step('定义 trace 上下文', 'requestId/traceId 贯穿服务。'), step('为关键步骤加 span', '检索、模型、工具分别记录 duration/status。'), step('结构化日志', 'JSON 单行，敏感字段脱敏。'), step('建立健康接口', '区分 live 与 ready。'), step('部署前门禁', '测试与评测任何一项失败即停止。')],
      expected: ['一次请求可按 traceId 串联', '错误 span 标记失败但不泄露敏感文本'],
      troubleshooting: ['属性不要使用 userId 等无限高基数作为指标标签', '可观测性上报失败不应拖垮主请求'],
      demo: demo('本地结构化 Span', '用最小实现理解嵌套耗时和错误状态，再迁移到 OpenTelemetry SDK。', [file('trace.mjs', 'javascript', [
        'const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));',
        'async function span(traceId, name, fn) {',
        '  const start = performance.now();',
        '  try { const value = await fn(); console.log(JSON.stringify({ traceId, name, status: "ok", durationMs: Math.round(performance.now() - start) })); return value; }',
        '  catch (error) { console.log(JSON.stringify({ traceId, name, status: "error" })); throw error; }',
        '}',
        'const traceId = crypto.randomUUID();',
        'await span(traceId, "request", async () => { await span(traceId, "retrieve", () => sleep(20)); await span(traceId, "generate", () => sleep(30)); });'
      ])], ['node trace.mjs'], ['三行 JSON；retrieve、generate、request 使用相同 traceId，status 均为 ok'], '真实项目使用 OpenTelemetry SDK 与 exporter；本例只验证上下文和边界。')
    },
    'w16-evaluate-portfolio': {
      sections: [
        section('发布结论来自固定门禁', [
          '候选版本必须与 baseline 在同一数据集、环境和指标上比较。质量门禁、P95、成本和安全用例分别设置阈值；平均质量提升不能抵消高风险工具越权。',
          '保存失败案例与取舍，而不是只展示成功演示。作品集 README 写清架构、启动、数据、指标、限制和后续计划。'
        ]),
        section('简历只写可复现指标', [
          '成功率、延迟和成本来自报告文件，注明样本量、版本和测量环境。不把主观感受写成百分比，也不隐藏失败样本。',
          '演示脚本覆盖正常、拒答、工具审批和故障降级，10 分钟内说明为什么这样设计以及哪些部分没有使用 Agent。'
        ])
      ],
      steps: [step('冻结候选版本', '记录 commit、模型、prompt、schema 和数据集版本。'), step('运行全部门禁', '质量、延迟、成本、安全和 E2E。'), step('生成差异报告', '列退化样本与原因。'), step('完成 README', '一条命令启动、架构和限制。'), step('准备演示与简历', '所有指标链接到报告。')],
      expected: ['报告明确 PASS/FAIL', '陌生人按 README 能启动', '简历指标可追溯'],
      troubleshooting: ['不要在失败门禁后手工改报告为 PASS', '压测结果注明硬件和并发模型'],
      demo: demo('发布门禁脚本', '读取固定指标并给出可自动化的发布结论。', [file('release-gate.mjs', 'javascript', [
        'const baseline = { success: 0.84, p95: 1800, cost: 0.12, securityPassed: true };',
        'const candidate = { success: 0.88, p95: 1700, cost: 0.11, securityPassed: true };',
        'const checks = {',
        '  quality: candidate.success >= baseline.success,',
        '  latency: candidate.p95 <= 2000,',
        '  cost: candidate.cost <= 0.12,',
        '  security: candidate.securityPassed',
        '};',
        'console.log(JSON.stringify({ checks, release: Object.values(checks).every(Boolean) ? "PASS" : "FAIL" }));'
      ])], ['node release-gate.mjs'], ['{"checks":{"quality":true,"latency":true,"cost":true,"security":true},"release":"PASS"}'], '把 securityPassed 改为 false 后，即使其他指标更好也必须 FAIL。')
    }
  };

  const mainLessons = window.COURSE.modules.flatMap((module) => module.lessons);
  const missing = [];
  for (const lesson of mainLessons) {
    if (!lesson.id.startsWith('w')) continue;
    const upgrade = upgrades[lesson.id];
    if (!upgrade) {
      missing.push(lesson.id);
      continue;
    }
    lesson.sections.push(...upgrade.sections);
    lesson.practice = {
      ...lesson.practice,
      steps: upgrade.steps,
      expected: upgrade.expected,
      troubleshooting: upgrade.troubleshooting,
      demo: upgrade.demo
    };
  }
  if (missing.length) throw new Error(`缺少岗位主线详情: ${missing.join(', ')}`);
})();
