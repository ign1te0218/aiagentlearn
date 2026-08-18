(function () {
  const F = window.FOUNDATION_COURSE;
  const { code, section, step, practice, lesson } = F;

  const resources = {
    postgresTutorial: { label: 'PostgreSQL Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
    postgresDdl: { label: 'PostgreSQL Data Definition', url: 'https://www.postgresql.org/docs/current/ddl.html' },
    postgresTransactions: { label: 'PostgreSQL Transactions', url: 'https://www.postgresql.org/docs/current/tutorial-transactions.html' },
    postgresIndexes: { label: 'PostgreSQL Indexes', url: 'https://www.postgresql.org/docs/current/indexes.html' },
    redisTypes: { label: 'Redis Data Types', url: 'https://redis.io/docs/latest/develop/data-types/' },
    redisCache: { label: 'Redis Client-side caching', url: 'https://redis.io/docs/latest/develop/clients/client-side-caching/' },
    owaspAuth: { label: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
    nodeTest: { label: 'Node.js Test Runner', url: 'https://nodejs.org/api/test.html' }
  };

  F.modules.push({
    id: 'backend-foundation',
    title: '后端数据基础（F7-F8）',
    icon: 'database',
    phase: F.phase,
    lessons: [
      lesson({
        id: 'backend-sql-modeling',
        week: 'F7-01',
        title: '关系模型与 SQL 查询基础',
        duration: '150分钟',
        level: '后端前置',
        summary: '从表、行、列、主键和外键开始，掌握 CRUD、过滤、连接、聚合与参数化查询。',
        objectives: ['能把用户、会话、消息建模为关系表', '会写常用 SELECT/INSERT/UPDATE/DELETE', '理解参数化查询为什么能防 SQL 注入'],
        sections: [
          section(
            '关系模型先表达实体与约束',
            [
              '表表达一类实体，行是实例，列是属性。主键稳定标识一行，外键表达实体关系并阻止悬空引用。数据库约束不是重复校验，而是所有写入路径共享的最后防线。',
              'AI 对话项目至少包含 users、conversations、messages。消息属于会话，会话属于用户；不要把所有内容塞进一列无法查询的大 JSON。'
            ],
            ['PRIMARY KEY：唯一且非空', 'FOREIGN KEY：引用完整性', 'NOT NULL：必填', 'UNIQUE：业务唯一', 'CHECK：值域约束'],
            code('sql', [
              'CREATE TABLE users (',
              '  id text PRIMARY KEY,',
              '  email text NOT NULL UNIQUE,',
              '  created_at timestamptz NOT NULL DEFAULT now()',
              ');',
              '',
              'CREATE TABLE conversations (',
              '  id text PRIMARY KEY,',
              '  user_id text NOT NULL REFERENCES users(id),',
              '  title text NOT NULL,',
              '  created_at timestamptz NOT NULL DEFAULT now()',
              ');'
            ])
          ),
          section(
            '查询由来源、过滤、投影和排序组成',
            [
              'SELECT 决定返回列，FROM 决定来源，WHERE 在分组前过滤行，GROUP BY 聚合，HAVING 过滤聚合结果，ORDER BY 明确顺序，LIMIT 限制数量。没有 ORDER BY 时数据库不保证返回顺序。',
              'JOIN 根据关系合并表。INNER JOIN 只保留匹配行，LEFT JOIN 保留左侧全部行；连接条件遗漏会产生笛卡尔积。'
            ],
            [],
            code('sql', [
              'SELECT u.email, count(c.id) AS conversation_count',
              'FROM users AS u',
              'LEFT JOIN conversations AS c ON c.user_id = u.id',
              'GROUP BY u.id, u.email',
              'ORDER BY conversation_count DESC, u.email ASC;'
            ])
          ),
          section(
            '写操作与参数化查询',
            [
              'INSERT 创建行，UPDATE 修改符合 WHERE 的行，DELETE 删除符合 WHERE 的行。执行更新或删除前先用同样 WHERE 做 SELECT，避免漏条件。',
              '应用代码绝不能把用户输入拼进 SQL。数据库驱动的参数占位符会把 SQL 结构和值分开解析，从根本上避免输入被当作语句执行。'
            ],
            ['PostgreSQL 常用 `$1`、`$2` 参数', '写操作使用 RETURNING 获取结果', '限制应用数据库账号权限'],
            code('javascript', [
              'const result = await client.query(',
              '  "SELECT id, email FROM users WHERE email = $1",',
              '  [email]',
              ');'
            ])
          )
        ],
        practice: practice(
          '建立对话数据库并完成 10 条查询',
          '使用本地 PostgreSQL 或 Docker 中的 PostgreSQL，创建用户、会话、消息三张表并写查询脚本。',
          [
            step('准备数据库', '创建独立数据库 agent_learning，不使用生产或个人真实数据。'),
            step('创建 schema.sql', '包含三张表、主外键、NOT NULL、角色 CHECK 和时间字段。'),
            step('创建 seed.sql', '插入 3 个用户、5 个会话和至少 12 条 user/assistant 消息。'),
            step('完成查询', '覆盖过滤、排序、LIMIT、INNER/LEFT JOIN、count、group by 和一条带 RETURNING 的更新。'),
            step('验证约束', '尝试重复 email、未知 user_id 和非法 role，记录数据库错误。'),
            step('编写 Node 参数化查询', '使用 pg 驱动按 email 查询用户，不拼接字符串。')
          ],
          ['三张表关系正确', '10 条查询有注释和确定结果', '三个非法写入均被约束拒绝', 'Node 查询使用参数数组'],
          ['连接结果异常增多时检查 ON 条件', 'DELETE/UPDATE 影响行数不符合预期时立即回滚并检查 WHERE']
        ),
        acceptance: ['能独立建立基础关系模型', '会写并解释常用 SQL', '所有外部值通过参数传入'],
        resources: [resources.postgresTutorial, resources.postgresDdl]
      }),
      lesson({
        id: 'backend-transactions-migrations',
        week: 'F7-02',
        title: '事务、索引、迁移与连接池',
        duration: '150分钟',
        level: '后端前置',
        summary: '理解 ACID、并发更新、索引代价、版本化迁移和连接池生命周期。',
        objectives: ['会用事务保护多步写入', '能根据查询条件建立基础索引', '理解迁移与连接池的正确边界'],
        sections: [
          section(
            '事务让一组操作共同成功或失败',
            [
              '事务从 BEGIN 开始，以 COMMIT 提交或 ROLLBACK 回滚。转账、创建订单加明细、写消息加调用记录等操作若只完成一半会破坏业务一致性，因此必须在同一事务中执行。',
              '事务不能消除所有并发问题。隔离级别、行锁、唯一约束和乐观版本号分别解决不同冲突。事务应尽量短，不在持有连接和锁时等待模型 API。'
            ],
            [],
            code('javascript', [
              'const client = await pool.connect();',
              'try {',
              '  await client.query("BEGIN");',
              '  await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, from]);',
              '  await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, to]);',
              '  await client.query("COMMIT");',
              '} catch (error) {',
              '  await client.query("ROLLBACK");',
              '  throw error;',
              '} finally {',
              '  client.release();',
              '}'
            ])
          ),
          section(
            '索引加速读取但增加写入成本',
            [
              'B-tree 索引适合等值、范围和排序。外键列、频繁过滤列和组合查询可能需要索引；低选择性布尔列通常不值得单独索引。组合索引的列顺序要匹配常用查询。',
              '使用 EXPLAIN (ANALYZE, BUFFERS) 看真实计划，不以“建了索引”作为结论。小表顺序扫描可能本来就更快。'
            ],
            ['索引占空间', '写入需要维护索引', '无用重复索引需要清理', '先根据查询再设计索引']
          ),
          section(
            '迁移是数据库结构的版本历史',
            [
              '不要在应用启动时随意 CREATE/ALTER。迁移文件按顺序记录结构变化，部署前执行并保留审核记录。生产迁移要考虑旧代码兼容、锁表时间和回滚策略。',
              '连接池复用昂贵连接。请求从池获取连接并及时释放；事务中的所有语句必须使用同一个 client。进程关闭时调用 pool.end。'
            ],
            ['expand/contract 兼容迁移', '迁移文件提交版本库', '连接池设置上限和超时', 'finally 释放连接']
          )
        ],
        practice: practice(
          '实现可回滚的账户转账',
          '建立账户表和迁移目录，用 Node.js 事务完成转账并验证失败回滚。',
          [
            step('编写 001_init.sql', '建立 accounts 与 transfers，余额必须非负，transfer 金额必须为正。'),
            step('实现 migrate.js', '按文件名顺序执行未应用迁移，并记录 schema_migrations。'),
            step('实现 transfer', '使用同一连接开启事务，锁定两个账户，检查余额，更新并写流水。'),
            step('验证回滚', '制造余额不足和第二条 SQL 失败，确认两个账户余额都不变化。'),
            step('建立索引并比较计划', '为 transfers(account_id, created_at) 建索引，保存 EXPLAIN 输出。'),
            step('关闭连接池', '测试和 CLI 的 finally 中调用 pool.end，确认进程不挂起。')
          ],
          ['成功转账两边余额和流水一致', '失败转账完全回滚', '迁移重复执行不会重复建表', '连接池在结束时关闭'],
          ['事务语句若混用 pool.query 会跑到其他连接', '长事务阻塞时检查是否在事务中等待外部网络']
        ),
        acceptance: ['能为多步写入划定事务', '索引有查询依据', '结构变更通过迁移管理'],
        resources: [resources.postgresTransactions, resources.postgresIndexes]
      }),
      lesson({
        id: 'backend-redis-cache',
        week: 'F8-01',
        title: 'Redis 数据结构、缓存与限流基础',
        duration: '140分钟',
        level: '后端前置',
        summary: '掌握 String、Hash、Set、TTL、缓存旁路和固定窗口限流，并理解 Redis 不能替代主数据库。',
        objectives: ['根据用途选择 Redis 数据结构', '实现带 TTL 的 cache-aside', '识别缓存穿透、击穿和一致性边界'],
        sections: [
          section(
            'Redis 是内存数据服务，不是万能数据库',
            [
              'String 可存文本、数字和序列化对象；Hash 保存对象字段；Set 去重；Sorted Set 按分数排序。Key 应包含业务前缀和标识，例如 `user:42:profile`。',
              '会话、短期缓存和限流适合 Redis；强一致业务记录仍放 PostgreSQL。是否开启持久化取决于数据丢失能否接受。'
            ],
            ['TTL 让临时数据自动过期', 'SCAN 替代生产环境 KEYS', '大 key 和热 key 需要监控', '敏感数据不要明文无限期保存']
          ),
          section(
            'cache-aside 的读取与失效',
            [
              '读取时先查缓存，未命中再查数据库并写缓存；更新数据库后删除缓存。缓存只是副本，代码必须接受短暂不一致，并为 TTL 与失败策略做选择。',
              '空结果也可短 TTL 缓存以减轻穿透。热点 key 失效可用互斥、随机 TTL 或后台刷新降低击穿。'
            ],
            [],
            code('javascript', [
              'async function getUser(id) {',
              '  const key = `user:${id}`;',
              '  const cached = await redis.get(key);',
              '  if (cached) return JSON.parse(cached);',
              '  const user = await repository.findUser(id);',
              '  await redis.set(key, JSON.stringify(user), { EX: 60 });',
              '  return user;',
              '}'
            ])
          ),
          section(
            '计数器和限流需要原子操作',
            [
              'INCR 是原子的，可与 EXPIRE 实现基础固定窗口限流。多个命令之间仍可能发生进程中断，生产实现使用事务、Lua 或成熟库保证设置窗口与递增的一致性。',
              '限流要明确维度、窗口、阈值和被拒响应。仅按 IP 可能误伤共享网络，仅按用户会漏掉匿名攻击。'
            ]
          )
        ],
        practice: practice(
          '为用户查询增加缓存与限流',
          '使用本地 Redis，实现 30 秒用户缓存和每用户每分钟 5 次的固定窗口限流。',
          [
            step('准备 Redis', '使用独立测试实例，配置 URL 到环境变量，不把地址写死。'),
            step('实现 cache-aside', '首次读取命中 fake repository，第二次读取命中 Redis；记录 source。'),
            step('实现更新失效', '先更新 repository，成功后 DEL 对应缓存，再读取获得新值。'),
            step('实现限流', '按 userId+分钟构造 key，原子递增，首次设置过期时间。'),
            step('覆盖故障', '模拟 Redis 不可用：缓存失败时降级查数据库，限流失败策略需明确记录。'),
            step('自动化验证', '使用唯一 key 前缀，测试结束删除本次 key，不执行 FLUSHALL。')
          ],
          ['第二次查询不调用 repository', '更新后缓存不会返回旧值', '第 6 次请求被拒绝', '测试不清空他人数据'],
          ['不要在共享 Redis 执行 KEYS 或 FLUSHALL', '缓存 JSON 解析失败时删除坏 key 并回源，不要无限重复失败']
        ),
        acceptance: ['缓存不是唯一数据源', 'TTL 与失效策略明确', '限流计数具备原子性意识'],
        resources: [resources.redisTypes, resources.redisCache]
      }),
      lesson({
        id: 'backend-auth-testing',
        week: 'F8-02',
        title: '认证、授权、密码、会话与测试金字塔',
        duration: '160分钟',
        level: '后端前置',
        summary: '区分认证和授权，理解密码哈希、Cookie/Token 会话与单元、集成、E2E 测试的职责。',
        objectives: ['能设计最小登录与权限检查', '不在日志或存储中泄露密码和 Token', '为服务建立分层自动化测试'],
        sections: [
          section(
            '认证回答是谁，授权回答能做什么',
            [
              '登录成功只证明身份，访问每个资源仍需检查所有权或角色。前端隐藏按钮不是授权；服务端工具调用和 MCP 工具也必须复用同一授权策略。',
              '采用默认拒绝和最小权限。管理员、普通用户以及服务账号应有不同能力，高风险写操作还需要二次确认和审计。'
            ],
            ['Authentication：身份', 'Authorization：权限', 'Ownership：资源归属', 'Audit：谁在何时做了什么']
          ),
          section(
            '密码与会话的安全边界',
            [
              '密码只保存慢速自适应哈希，例如 Argon2id 或 bcrypt，并使用库生成随机盐；不能使用 SHA-256 直接哈希密码。登录错误不应泄露账号是否存在。',
              '浏览器应用常用 HttpOnly、Secure、SameSite Cookie 保存不透明会话标识。JWT 适合分布式令牌场景，但撤销、轮换和权限变更更复杂；不要默认把 JWT 当成更安全。'
            ],
            ['密钥来自环境或密钥管理', 'Token 不写日志和 URL', '会话有过期与撤销', '登录接口限流']
          ),
          section(
            '测试层级验证不同风险',
            [
              '单元测试验证纯函数和服务分支，速度快；集成测试验证数据库、Redis 和 HTTP 边界；E2E 从用户入口覆盖关键链路。不能只用大量 E2E 替代底层测试，也不能用 mock 证明 SQL 真能执行。',
              '测试必须可重复、互相隔离并清理资源。时间、随机数、外部 API 和数据库应有可控制边界。'
            ],
            ['Arrange / Act / Assert', '正常、边界、失败三类用例', '每次测试独立数据', '错误路径同样断言']
          )
        ],
        practice: practice(
          '实现带所有权检查的会话 API',
          '用内存仓库完成登录、会话校验和任务所有权授权，并使用 node:test 覆盖。',
          [
            step('定义边界', 'User 不对外返回 passwordHash；Session 只有随机 id、userId、expiresAt。'),
            step('实现登录服务', '通过注入的 passwordVerifier 验证，失败统一返回 INVALID_CREDENTIALS。'),
            step('实现 requireSession', '会话不存在或过期返回 UNAUTHENTICATED，并删除过期会话。'),
            step('实现所有权检查', '只有 task.userId 等于当前用户或角色 admin 才能读取。'),
            step('记录审计', '允许和拒绝均记录 action、userId、resourceId、result，不记录密码和 Token。'),
            step('编写测试', '至少覆盖登录成功/失败、过期会话、本人访问、越权拒绝、管理员访问六条。')
          ],
          ['六条测试通过', '错误不泄露账号存在性', '越权访问被服务端拒绝', '日志没有密码和会话标识'],
          ['不要在测试中比较真实密码哈希耗时，可注入 verifier', '授权检查必须在读取或写入资源之前执行']
        ),
        acceptance: ['能区分认证、授权和所有权', '敏感凭据不泄露', '单元与集成测试职责明确'],
        resources: [resources.owaspAuth, resources.nodeTest]
      })
    ]
  });
})();
