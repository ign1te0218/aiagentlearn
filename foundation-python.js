(function () {
  const F = window.FOUNDATION_COURSE;
  const { code, section, step, practice, lesson, resources } = F;

  F.modules.push({
    id: 'python-foundation',
    title: 'Python 基础（F5-F6）',
    icon: 'file-code-2',
    phase: F.phase,
    lessons: [
      lesson({
        id: 'python-environment-project',
        week: 'F5-01',
        title: '解释器、虚拟环境、pip 与项目结构',
        duration: '100分钟',
        level: '零基础',
        summary: '使用 Python 3.12+ 在 Windows 上建立隔离项目，理解解释器、虚拟环境、依赖文件和模块入口。',
        objectives: ['能确认解释器为 Python 3.12 或更高版本', '会创建、激活和退出虚拟环境', '建立可重复安装的最小项目'],
        sections: [
          section(
            '解释器与脚本执行',
            [
              '本课程统一要求 Python 3.12 或更高版本，以便后续稳定使用现代类型语法与 asyncio API。Python 源文件由解释器执行。Windows 上可能同时存在 `python`、`py` 和虚拟环境中的 python，安装包前必须确认当前解释器。`python -m pip` 比直接运行 pip 更明确，因为它保证 pip 属于当前解释器。',
              '交互式解释器适合验证表达式，正式练习写入 `.py` 文件并通过命令运行，才能纳入版本管理和复现。'
            ],
            ['`python --version` 必须为 3.12+', '`python -c "import sys; print(sys.executable)"`', '`python script.py`', '`python -m package.module`'],
            code('python', [
              'import platform',
              'import sys',
              '',
              'print("version:", platform.python_version())',
              'print("executable:", sys.executable)',
              'print("platform:", platform.platform())'
            ])
          ),
          section(
            '虚拟环境隔离项目依赖',
            [
              '`venv` 会为项目建立独立解释器入口和 site-packages。激活只是修改当前 shell 的 PATH；脚本和 CI 也可以直接调用 `.venv` 内的解释器，不依赖激活状态。',
              '`.venv` 不能提交到 Git。提交依赖声明和锁定策略，而不是提交已安装文件。'
            ],
            ['创建：`python -m venv .venv`', '激活：`.\\.venv\\Scripts\\Activate.ps1`', '退出：`deactivate`', '检查：`python -m pip list`']
          ),
          section(
            '依赖与项目入口',
            [
              '简单练习可用 requirements.txt 固定直接依赖版本。更完整项目可以使用 pyproject.toml 管理元数据、构建和工具配置。基础阶段先理解“声明依赖、隔离安装、可重复启动”三件事。',
              '`if __name__ == "__main__"` 让文件被直接执行时运行入口，被其他模块导入时不自动执行主流程。'
            ],
            [],
            code('python', [
              'def main() -> None:',
              '    print("Python foundation ready")',
              '',
              '',
              'if __name__ == "__main__":',
              '    main()'
            ])
          )
        ],
        practice: practice(
          '创建可复现的 Python 项目',
          '建立虚拟环境、入口脚本、依赖文件和忽略规则，并证明使用的是项目解释器。',
          [
            step('创建目录与虚拟环境', '在基础仓库根目录执行。', code('powershell', [
              'mkdir foundations/python/f5-01-environment',
              'cd foundations/python/f5-01-environment',
              'python -m venv .venv',
              '.\\.venv\\Scripts\\Activate.ps1'
            ])),
            step('确认解释器', '运行以下命令，路径必须位于当前项目 `.venv`。', code('powershell', [
              'python -c "import sys; print(sys.executable)"',
              'python -m pip --version'
            ])),
            step('安装一个依赖', '安装 httpx 并导出当前依赖；这里只验证环境，暂不请求网络。', code('powershell', [
              'python -m pip install httpx',
              'cmd /c "python -m pip freeze > requirements.txt"'
            ])),
            step('创建入口', '创建 `src/main.py`，输出版本、解释器路径和依赖版本。'),
            step('忽略环境目录', '在 `.gitignore` 写入 `.venv/`、`__pycache__/`、`.pytest_cache/`。'),
            step('重建验证', '退出环境，新建临时虚拟环境并从 requirements.txt 安装，确认入口仍可运行。')
          ],
          ['sys.executable 指向项目虚拟环境', 'requirements.txt 包含固定版本', '.venv 未被 Git 跟踪', '其他虚拟环境可按文件重装'],
          ['PowerShell 禁止执行激活脚本时，可直接使用 `.\\.venv\\Scripts\\python.exe` 执行命令', '不要使用管理员权限全局安装来绕过环境问题']
        ),
        acceptance: ['Python 版本不低于 3.12', '能独立创建隔离环境', '知道 python -m pip 的意义', '项目入口与依赖可复现'],
        resources: [resources.pythonTutorial, resources.pythonVenv]
      }),
      lesson({
        id: 'python-syntax-control',
        week: 'F5-02',
        title: '变量、基本类型、条件与循环',
        duration: '110分钟',
        level: '零基础',
        summary: '掌握 Python 缩进语法、动态类型、真假值、条件分支和可读循环。',
        objectives: ['适应缩进和 Python 命名风格', '理解常用基本类型与真假值', '正确使用 if、for、while、range 和 enumerate'],
        sections: [
          section(
            '变量绑定与动态类型',
            [
              'Python 变量名绑定到对象，不需要先声明类型。动态类型不等于没有类型：对象始终有具体类型，错误可能在运行时暴露。后续会用类型提示提前发现一部分问题。',
              '变量使用 snake_case，类使用 PascalCase，常量约定使用 UPPER_CASE。缩进是语法，统一使用 4 个空格，不混用 Tab。'
            ],
            ['整数 `int`', '浮点 `float`', '字符串 `str`', '布尔 `bool`', '空值 `None`'],
            code('python', [
              'course_name = "AgentPath"',
              'weekly_hours = 12',
              'is_started = True',
              'finished_at = None',
              '',
              'print(type(course_name), type(weekly_hours))'
            ])
          ),
          section(
            '条件与真假值',
            [
              '`if/elif/else` 按顺序判断。空字符串、0、空集合和 None 都是假值，但业务上 0 可能是合法结果，因此判断缺失值时写 `value is None`，不要一律 `if not value`。',
              '比较 None 使用 `is`，值比较使用 `==`。链式比较 `0 <= score <= 100` 比两个 and 更自然。'
            ],
            [],
            code('python', [
              'score = 85',
              '',
              'if not 0 <= score <= 100:',
              '    print("分数无效")',
              'elif score >= 80:',
              '    print("通过")',
              'else:',
              '    print("继续练习")'
            ])
          ),
          section(
            'for 优先遍历对象本身',
            [
              'Python 的 for 遍历可迭代对象，不需要通过索引访问列表。需要位置时使用 enumerate，需要同时遍历两组数据时使用 zip。while 适合次数未知、由条件决定的循环。',
              '`break` 结束循环，`continue` 跳过本次，循环的 else 只在没有 break 时执行，基础业务代码谨慎使用以免降低可读性。'
            ],
            ['`for item in items`', '`for index, item in enumerate(items, start=1)`', '`for left, right in zip(a, b)`']
          )
        ],
        practice: practice(
          '实现命令行成绩分析器',
          '解析一组内置分数，过滤非法值，输出总数、平均分、最高分和等级分布。',
          [
            step('准备输入', '定义包含整数、0、100、负数、超过 100 和 None 的列表。'),
            step('清洗数据', '使用 for 和条件分支，只保留 0-100；把被丢弃值及原因放入 invalid 列表。'),
            step('计算统计', '不使用第三方库，计算总数、总分、平均分、最高和最低；空列表不得除零。'),
            step('划分等级', '使用 if/elif 统计 A/B/C/D，边界值至少覆盖 60、70、80、90。'),
            step('格式化输出', '使用 f-string 把平均分保留 2 位，并逐项输出非法数据。'),
            step('验证边界', '分别用正常列表、全非法列表和空列表运行。')
          ],
          ['正常数据统计准确', '0 和 100 被保留', '空列表不会抛 ZeroDivisionError', '非法输入有明确原因'],
          ['`bool` 是 `int` 的子类，若不接受 True/False，校验时应明确排除', '不要在遍历原列表时删除元素，创建新列表更安全']
        ),
        acceptance: ['能写出清晰条件和循环', '能正确处理 None 与 0', '知道何时不用索引循环'],
        resources: [resources.pythonFlow]
      }),
      lesson({
        id: 'python-collections-comprehensions',
        week: 'F5-03',
        title: '列表、元组、字典、集合与推导式',
        duration: '120分钟',
        level: '基础',
        summary: '根据语义选择集合类型，理解可变性、复制、哈希与推导式的可读边界。',
        objectives: ['正确选择四种核心集合', '理解浅复制和共享引用', '使用推导式完成简单映射与过滤'],
        sections: [
          section(
            '四种集合分别表达什么',
            [
              'list 有序可变，适合任务序列；tuple 有序通常不可变，适合固定记录或返回多个值；dict 保存键值映射；set 保存唯一且可哈希的元素，适合去重和成员检查。',
              'Python 3.7+ 字典保持插入顺序，但若业务依赖排序仍应显式排序。集合不保证适合展示的稳定顺序。'
            ],
            ['列表：`[item1, item2]`', '元组：`(x, y)`', '字典：`{"id": "t1"}`', '集合：`{"rag", "agent"}`'],
            code('python', [
              'tasks = ["TypeScript", "Node.js", "Python"]',
              'point = (30.5, 104.1)',
              'progress = {"TypeScript": 100, "Node.js": 40}',
              'skills = {"Node.js", "Python", "Node.js"}'
            ])
          ),
          section(
            '可变对象与浅复制',
            [
              '赋值不会复制列表或字典，只会让两个变量引用同一对象。切片、list.copy 和 dict.copy 是浅复制，内部嵌套对象仍共享。需要避免意外修改时，优先建立新结构或明确使用 deepcopy。',
              '函数默认参数不能使用可变列表或字典，因为同一个对象会被多次调用共享。'
            ],
            [],
            code('python', [
              'def add_tag(tag: str, tags: list[str] | None = None) -> list[str]:',
              '    result = [] if tags is None else list(tags)',
              '    result.append(tag)',
              '    return result'
            ])
          ),
          section(
            '推导式保持单一意图',
            [
              '列表、字典和集合推导式适合一层映射加一个简单过滤。嵌套三层或包含复杂分支时，普通循环更易读、也更方便记录错误。',
              '生成器表达式使用圆括号，按需产生值，适合 sum、any、all 等消费函数。'
            ],
            [],
            code('python', [
              'tasks = [',
              '    {"title": "TS", "done": True},',
              '    {"title": "Node", "done": False},',
              ']',
              '',
              'done_titles = [item["title"] for item in tasks if item["done"]]',
              'task_map = {item["title"]: item for item in tasks}'
            ])
          )
        ],
        practice: practice(
          '清洗课程报名数据',
          '把重复、缺字段和标签混乱的记录整理为按用户索引的数据和全局标签统计。',
          [
            step('准备原始数据', '至少 6 条字典，包含重复 user_id、空姓名、重复标签和缺失 tags。'),
            step('建立清洗结果', '使用 dict 按 user_id 保存最后一条合法记录；非法记录保存原索引和原因。'),
            step('规范标签', '去除首尾空格、转小写、用 set 去重，再排序输出，保证展示稳定。'),
            step('统计频次', '使用字典 `tag_counts[tag] = tag_counts.get(tag, 0) + 1` 统计。'),
            step('验证复制', '修改清洗结果中的标签，确认是否影响原始数据；根据结果修正为不共享内部列表。'),
            step('输出 JSON 友好结果', 'set 不能直接 JSON 序列化，输出前转换为排序列表。')
          ],
          ['重复用户规则明确', '非法记录不会让程序中断', '标签唯一、规范、顺序稳定', '原始输入未被修改'],
          ['出现 unhashable type: list 表示把可变列表放进 set 或作为 dict 键', '浅复制仍共享嵌套列表时，逐层创建新列表或使用 copy.deepcopy']
        ),
        acceptance: ['集合选择符合语义', '理解引用与浅复制', '推导式保持可读'],
        resources: [resources.pythonData]
      }),
      lesson({
        id: 'python-functions-typing',
        week: 'F5-04',
        title: '函数、参数、作用域与类型提示',
        duration: '130分钟',
        level: '基础',
        summary: '编写职责单一的函数，掌握参数规则、作用域、类型提示和 TypedDict/Protocol 的基本使用。',
        objectives: ['设计清晰函数签名', '理解位置、关键字和可变参数', '用类型提示提高可读性与检查能力'],
        sections: [
          section(
            '函数参数与返回值',
            [
              '函数通过 def 定义。参数可以按位置或关键字传递；`*` 后的参数只能用关键字，适合 timeout、limit 等容易混淆的配置。`*args` 收集位置参数，`**kwargs` 收集关键字参数，不应替代明确接口。',
              '函数应在同一抽象层完成一件事。解析、校验、持久化和展示全部塞进一个函数会难以测试。'
            ],
            [],
            code('python', [
              'def calculate_cost(',
              '    input_tokens: int,',
              '    output_tokens: int,',
              '    *,',
              '    input_price: float,',
              '    output_price: float,',
              ') -> float:',
              '    return input_tokens * input_price + output_tokens * output_price'
            ])
          ),
          section(
            'LEGB 作用域与闭包',
            [
              '名称查找遵循 Local、Enclosing、Global、Built-in。函数内部赋值默认创建局部变量；频繁依赖 global 会隐藏状态和依赖。闭包可以保留外层变量，但可变状态仍需要清晰生命周期。',
              '不要使用 list、dict、str 等内置名称作为变量名，否则会遮蔽内置函数。'
            ],
            ['依赖优先通过参数传入', '配置在入口读取后传递', '测试替换依赖而非修改全局']
          ),
          section(
            '可变默认参数为什么会跨调用共享',
            [
              '函数默认参数在执行 `def`、也就是函数定义时求值一次，而不是每次调用时重新创建。若默认值是 list、dict 或 set，函数对它的修改会保留到下一次调用，造成不同请求之间意外共享状态。',
              '普通函数需要“每次调用一个新容器”时，使用 `None` 作为哨兵并在函数体内创建对象。`dataclasses.field(default_factory=list)` 解决的是 dataclass 字段默认值，不用于普通函数参数；两种写法不能混为一谈。'
            ],
            ['危险：`def add(item, items=[])`', '函数参数：`items: list[str] | None = None` 后在函数内创建', 'dataclass 字段：`field(default_factory=list)`'],
            code('python', [
              'def add_tag(tag: str, tags: list[str] | None = None) -> list[str]:',
              '    result = [] if tags is None else list(tags)',
              '    result.append(tag)',
              '    return result',
              '',
              'print(add_tag("rag"))    # ["rag"]',
              'print(add_tag("agent"))  # ["agent"]，不会包含上一次结果'
            ])
          ),
          section(
            '类型提示不会自动校验运行时',
            [
              '类型提示服务编辑器、类型检查器和读者，Python 运行时通常不会强制执行。`list[str]`、`dict[str, int]`、`str | None` 描述常见结构。',
              'TypedDict 描述字典键结构，dataclass 描述真正对象。Protocol 描述“只要具有这些方法即可”的结构化接口，适合依赖注入和测试替身。'
            ],
            [],
            code('python', [
              'from typing import Protocol, TypedDict',
              '',
              'class TaskData(TypedDict):',
              '    id: str',
              '    title: str',
              '',
              'class TaskStore(Protocol):',
              '    def save(self, task: TaskData) -> None: ...'
            ]),
            '类型提示不可信任外部 JSON。进入系统时仍要做字段和类型校验，后续 FastAPI/Pydantic 会完成这部分。'
          )
        ],
        practice: practice(
          '重构 Token 成本计算器',
          '从一段全局变量脚本重构为可测试函数，并覆盖合法、边界和异常输入。',
          [
            step('定义数据类型', '用 TypedDict 定义 Usage，用 dataclass 或普通类定义 Pricing。'),
            step('实现纯函数', 'calculate_cost 不读取 input、不打印、不修改全局；价格参数只能以关键字传入。'),
            step('验证默认参数', '写一个错误的 list 默认参数并连续调用两次，再改用 None 哨兵；为两种行为各写一个断言。'),
            step('增加校验', 'token 和价格不能为负数；非法值抛 ValueError，错误消息包含字段名。'),
            step('实现批量汇总', '接收 Iterable[Usage]，逐项计算总成本，不依赖具体 list。'),
            step('添加 unittest', '覆盖 0 token、正常值、负数、空列表和多条记录，使用 assertAlmostEqual。'),
            step('运行类型检查（可选）', '安装 mypy 后执行 `python -m mypy src`，记录它发现的问题。')
          ],
          ['函数签名有完整类型提示', '6 类测试通过（含可变默认参数回归）', '核心函数无打印和全局状态', '负数输入有明确异常'],
          ['浮点金额比较不要直接 `==`，测试用 assertAlmostEqual；真实账务通常使用 Decimal', 'TypedDict 只帮助静态检查，不会阻止运行时缺键']
        ),
        acceptance: ['函数边界清晰可测试', '能解释并修复可变默认参数的跨调用共享', '能读写常用类型提示', '理解提示与运行时校验不同'],
        resources: [resources.pythonFlow, resources.pythonTyping]
      }),
      lesson({
        id: 'python-modules-exceptions',
        week: 'F6-01',
        title: '模块、包、导入与异常处理',
        duration: '120分钟',
        level: '基础',
        summary: '组织 Python 包的依赖方向，使用明确异常分类、异常链和资源清理。',
        objectives: ['理解模块、包和导入入口', '捕获具体异常而非吞掉错误', '使用异常链保留根因'],
        sections: [
          section(
            '模块与包',
            [
              '一个 `.py` 文件是模块，包含模块的目录可以组成包。推荐从项目根目录使用 `python -m app.main` 运行包入口，让绝对导入保持稳定。直接运行包内部文件可能导致导入路径与预期不同。',
              '`__init__.py` 可以标识普通包并暴露少量公共 API，不要把大量初始化逻辑放进去。'
            ],
            [],
            code('text', [
              'document_tool/',
              '  app/',
              '    __init__.py',
              '    main.py',
              '    parser.py',
              '    errors.py',
              '  tests/',
              '  pyproject.toml'
            ])
          ),
          section(
            '捕获你能处理的具体异常',
            [
              '`except Exception` 放在底层容易把编程错误也当成业务错误。文件不存在、JSON 错误、权限错误应分别处理或转换；无法恢复时继续抛给统一入口。不要写空 except。',
              '`else` 在 try 无异常时执行，`finally` 无论成功失败都执行，适合释放显式资源。文件通常使用 with 自动关闭。'
            ],
            ['先捕获更具体异常', '错误消息包含操作和上下文', '入口设置非 0 退出码', '日志保留堆栈和根因']
          ),
          section(
            '异常链保留底层原因',
            [
              '使用 `raise DomainError(...) from error` 把底层异常设为 cause。用户看到稳定领域错误，开发者仍能追踪原始堆栈。`from None` 会隐藏上下文，只有确定底层信息无价值或可能泄密时使用。'
            ],
            [],
            code('python', [
              'import json',
              '',
              'class ConfigError(Exception):',
              '    pass',
              '',
              'def load_config(path: str) -> dict[str, object]:',
              '    try:',
              '        with open(path, encoding="utf-8") as file:',
              '            return json.load(file)',
              '    except (OSError, json.JSONDecodeError) as error:',
              '        raise ConfigError(f"无法读取配置: {path}") from error'
            ])
          )
        ],
        practice: practice(
          '拆分配置加载包',
          '实现 JSON 配置加载、字段校验、异常转换和命令行入口。',
          [
            step('建立包结构', '创建 app 包、config.py、errors.py、main.py 和 tests。通过 `python -m app.main config.json` 启动。'),
            step('定义异常', '建立 ConfigNotFound、ConfigSyntaxError、ConfigValidationError，均继承 ConfigError。'),
            step('实现加载器', '分别捕获 FileNotFoundError、PermissionError、JSONDecodeError，并使用 `raise ... from error`。'),
            step('校验字段', '必须包含 model:str、timeout:int 且 timeout > 0；未知字段可保留但不能替代必填。'),
            step('实现入口', '只在入口捕获 ConfigError，打印简洁消息并返回退出码 2；意外异常不要伪装成配置错误。'),
            step('测试四条路径', '正常、文件不存在、JSON 错误、字段错误；额外检查 `__cause__` 存在。')
          ],
          ['四条测试通过', '用户错误消息稳定', '底层异常通过 cause 可追踪', '从项目根目录用 -m 启动成功'],
          ['相对导入错误时不要修改 sys.path，先确认启动命令和包结构', 'except 顺序从具体到一般，否则子类分支永远到不了']
        ),
        acceptance: ['项目能按包运行', '异常分类和边界合理', '不会吞掉未知错误'],
        resources: [resources.pythonModules, resources.pythonErrors]
      }),
      lesson({
        id: 'python-files-json',
        week: 'F6-02',
        title: 'Pathlib、文本、JSON 与上下文管理器',
        duration: '130分钟',
        level: '基础',
        summary: '使用 pathlib 和 with 安全处理文本与 JSON，完成编码、JSONL、原子写入和路径边界。',
        objectives: ['使用 Path 替代手工字符串路径', '正确读写 UTF-8 和 JSON/JSONL', '使用上下文管理器确保资源释放'],
        sections: [
          section(
            'Path 对象让路径操作可组合',
            [
              '`pathlib.Path` 提供 `/` 拼接、resolve、exists、mkdir、glob、read_text 和 write_text。它比手工拼接分隔符更跨平台，也让路径意图更清晰。',
              '外部路径同样需要限制在允许目录。可通过 resolve 后使用 `is_relative_to(base)` 检查 Python 3.9+ 的路径归属。'
            ],
            [],
            code('python', [
              'from pathlib import Path',
              '',
              'base = Path(__file__).resolve().parent / "data"',
              'base.mkdir(parents=True, exist_ok=True)',
              'target = base / "notes.txt"',
              'target.write_text("你好 Python", encoding="utf-8")'
            ])
          ),
          section(
            'with 管理资源生命周期',
            [
              '`with open(...) as file` 在正常和异常路径都会关闭文件。任何具备 `__enter__`/`__exit__` 或异步版本的对象都可以作为上下文管理器，例如锁、数据库事务和 HTTP 客户端。',
              '简单文本可用 Path.read_text；逐行处理大文件应使用 open 并迭代，不要 read 把全部内容装入内存。'
            ],
            ['文本明确 encoding=utf-8', '大文件逐行迭代', '写入明确 newline 策略', '异常后文件仍关闭']
          ),
          section(
            'JSON 与 JSONL',
            [
              'JSON 文档适合整体对象；JSONL 每行一个 JSON 对象，适合追加日志、评测集和流式处理。json.dump/load 处理文件对象，dumps/loads 处理字符串。',
              '`ensure_ascii=False` 让中文保持可读；它不改变 UTF-8 编码，写文件仍需 encoding。'
            ],
            [],
            code('python', [
              'import json',
              '',
              'record = {"question": "如何学习 RAG？", "score": 1}',
              'line = json.dumps(record, ensure_ascii=False)',
              'with open("evals.jsonl", "a", encoding="utf-8", newline="\n") as file:',
              '    file.write(line + "\n")'
            ])
          ),
          section(
            '小型关键文件的原子替换',
            [
              '与 Node.js 类似，先写同目录临时文件再 `replace` 可以减少半写文件。并发更新仍需版本控制或锁；原子替换只解决单次落盘中断。'
            ],
            [],
            code('python', [
              'import json',
              'from pathlib import Path',
              '',
              'def save_json(path: Path, data: object) -> None:',
              '    temp = path.with_suffix(path.suffix + ".tmp")',
              '    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")',
              '    temp.replace(path)'
            ])
          )
        ],
        practice: practice(
          '实现 JSONL 文档统计器',
          '读取一个可能包含坏行的 JSONL 文件，逐行校验、统计并原子写出报告。',
          [
            step('生成样例文件', '创建 8 行记录，字段包含 path、chars、language；其中加入 2 行非法 JSON 或缺字段。'),
            step('逐行解析', 'with 打开文件，enumerate(start=1) 记录行号；每行 json.loads，错误保存行号和原因。'),
            step('校验数据', 'path 和 language 必须为 str，chars 必须为非负 int；bool 不算合法 int。'),
            step('计算汇总', '输出有效/无效数量、总字符数、按 language 统计。'),
            step('原子写报告', '先写 report.json.tmp，再 replace 为 report.json，中文不转义并缩进。'),
            step('增加路径保护', '输入文件必须位于 data 目录，`../` 路径应拒绝。')
          ],
          ['坏行不阻断后续处理', '报告计数准确并包含错误行号', '中文 JSON 可读', '路径穿越被拒绝'],
          ['空行可选择跳过，但规则要写进 README', '`isinstance(True, int)` 为真，若业务不接受布尔值需额外 `not isinstance(value, bool)`']
        ),
        acceptance: ['路径处理跨平台', '文件总能正确关闭', '能区分 JSON 与 JSONL 并处理坏行'],
        resources: [resources.pythonPathlib, resources.pythonErrors]
      }),
      lesson({
        id: 'python-classes-dataclasses',
        week: 'F6-03',
        title: '类、dataclass 与依赖注入',
        duration: '120分钟',
        level: '基础',
        summary: '用 dataclass 表达数据，用普通类封装行为，通过构造参数注入依赖而不是依赖全局状态。',
        objectives: ['理解实例、类属性和方法', '会使用 dataclass 建模', '通过 Protocol 和构造参数替换依赖'],
        sections: [
          section(
            '类把状态与行为组织在一起',
            [
              '`self` 指向当前实例，实例属性通常在 `__init__` 中建立。类属性由所有实例共享，不适合放可变的实例数据。继承表达“是一个”的稳定关系，普通业务更常使用组合。',
              '简单数据记录不必手写大量初始化与 repr，dataclass 会自动生成。'
            ],
            [],
            code('python', [
              'from dataclasses import dataclass, field',
              '',
              '@dataclass(slots=True)',
              'class Document:',
              '    id: str',
              '    title: str',
              '    tags: list[str] = field(default_factory=list)'
            ])
          ),
          section(
            '默认工厂避免共享可变值',
            [
              'dataclass 的列表或字典字段使用 `field(default_factory=list)`，让每个实例获得新对象。冻结 dataclass 可减少意外修改，但字段内部若仍是 list，并不会自动深度不可变。',
              '`slots=True` 可限制任意新增属性并减少部分内存，适合稳定数据模型，不是必须选项。'
            ]
          ),
          section(
            '依赖通过构造参数注入',
            [
              '服务类若在内部创建文件仓库或 HTTP Client，测试很难替换。定义最小 Protocol，并在构造函数接收依赖，测试可传入内存实现。',
              '依赖注入不是一定要框架。显式构造参数就是最容易理解的实现。'
            ],
            [],
            code('python', [
              'from typing import Protocol',
              '',
              'class DocumentStore(Protocol):',
              '    def save(self, document: Document) -> None: ...',
              '',
              'class DocumentService:',
              '    def __init__(self, store: DocumentStore) -> None:',
              '        self._store = store',
              '',
              '    def create(self, document: Document) -> None:',
              '        if not document.title.strip():',
              '            raise ValueError("title 不能为空")',
              '        self._store.save(document)'
            ])
          )
        ],
        practice: practice(
          '实现可替换存储的文档服务',
          '建立 Document、DocumentStore、InMemoryStore 和 DocumentService，并用 unittest 验证。',
          [
            step('定义 dataclass', 'Document 包含 id、title、content、tags；tags 使用 default_factory，title 在创建服务中校验。'),
            step('定义 Protocol', '只暴露 save、get、list 三个方法，返回类型明确处理不存在情况。'),
            step('实现内存仓库', '使用 dict 保存；返回列表副本，避免调用方修改仓库内部容器。'),
            step('实现服务', 'create 去除标题空格、标签去重；重复 id 抛领域错误。'),
            step('编写 fake 记录调用', '额外建立 RecordingStore，保存传入的文档，用它验证服务确实调用依赖。'),
            step('测试可变默认值', '创建两个 Document，只修改第一个 tags，确认第二个不受影响。')
          ],
          ['两个实例不共享 tags', '服务测试不访问磁盘', '重复 id 与空标题错误明确', 'Protocol 只包含真实需要的方法'],
          ['不要写 `tags: list[str] = []`', '类属性和实例属性混淆时，检查属性是否在 __init__ 或 dataclass 字段中声明']
        ),
        acceptance: ['会选择 dataclass 和普通类', '没有共享可变默认值', '依赖可在测试中替换'],
        resources: [resources.pythonDataclass, resources.pythonTyping]
      }),
      lesson({
        id: 'python-async-fastapi-capstone',
        week: 'F6-04',
        title: 'asyncio 与 FastAPI 文档处理服务',
        duration: '180分钟',
        level: '综合练习',
        summary: '理解协程与事件循环，使用 FastAPI/Pydantic 把文档统计器封装为带校验、错误和测试的 HTTP 服务。',
        objectives: ['理解协程、await 与并发任务', '区分异步 I/O 与 CPU 密集工作', '完成可由 Node.js 调用的 FastAPI 服务'],
        sections: [
          section(
            '协程在 await 处交还控制权',
            [
              '调用 async 函数得到协程对象，只有 await 或创建 Task 后才会执行。await 等待支持异步协议的操作时，事件循环可以运行其他就绪协程。',
              '把同步阻塞函数放进 async def 不会自动变成非阻塞。同步文件 I/O、大计算或 time.sleep 会阻塞事件循环；延时使用 asyncio.sleep，阻塞库可用 asyncio.to_thread 作为过渡。'
            ],
            [],
            code('python', [
              'import asyncio',
              '',
              'async def work(name: str, seconds: float) -> str:',
              '    await asyncio.sleep(seconds)',
              '    return f"{name} done"',
              '',
              'async def main() -> None:',
              '    results = await asyncio.gather(work("a", 0.2), work("b", 0.2))',
              '    print(results)',
              '',
              'asyncio.run(main())'
            ])
          ),
          section(
            'Task、gather、超时与取消',
            [
              '`asyncio.create_task` 安排协程并发执行，`gather` 等待一组结果。`asyncio.timeout` 限定一个代码块的总时间。取消会在协程下一次可中断点抛 CancelledError，清理后通常应继续传播。',
              '并发同样需要限制。使用 Semaphore 控制同时访问外部 API 的数量，不能为上万个输入无条件创建任务。'
            ],
            ['顺序依赖：逐项 await', '独立少量任务：gather', '批量任务：Semaphore + worker', '超时与取消：明确清理资源']
          ),
          section(
            'FastAPI 与 Pydantic 边界',
            [
              'FastAPI 根据路径函数和 Pydantic 模型解析请求、校验字段并生成 OpenAPI。模型校验的是外部输入，服务层仍负责业务规则。response_model 可以防止意外返回内部字段。',
              '路由函数保持薄：解析请求、调用服务、转换响应。文档统计与存储放在独立模块，便于命令行和 HTTP 复用。'
            ],
            [],
            code('python', [
              'from fastapi import FastAPI',
              'from pydantic import BaseModel, Field',
              '',
              'app = FastAPI(title="Document Service")',
              '',
              'class AnalyzeRequest(BaseModel):',
              '    text: str = Field(min_length=1, max_length=100_000)',
              '',
              'class AnalyzeResponse(BaseModel):',
              '    characters: int',
              '    words: int',
              '    lines: int',
              '',
              '@app.post("/analyze", response_model=AnalyzeResponse)',
              'async def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:',
              '    return AnalyzeResponse(',
              '        characters=len(payload.text),',
              '        words=len(payload.text.split()),',
              '        lines=len(payload.text.splitlines()) or 1,',
              '    )'
            ])
          ),
          section(
            '服务测试不需要真实端口',
            [
              'FastAPI 的 TestClient 或 httpx ASGITransport 可以在进程内调用应用，测试状态码、JSON 和校验错误。核心统计函数还应有独立单元测试，避免所有逻辑只能通过 HTTP 测。',
              '生产部署由 ASGI Server（如 uvicorn）承载。基础阶段先使用单进程，理解接口后再研究多 worker 和容器。'
            ]
          )
        ],
        practice: practice(
          'Python 基础毕业 Demo：文档分析 API',
          '从空项目完成可测试 FastAPI 服务，并用 Node.js 客户端调用，打通两种语言。',
          [
            step('建立项目和依赖', '创建 `app/main.py`、`app/service.py`、`app/models.py`、`tests/`。', code('powershell', [
              'python -m venv .venv',
              '.\\.venv\\Scripts\\Activate.ps1',
              'python -m pip install fastapi "uvicorn[standard]" httpx pytest',
              'cmd /c "python -m pip freeze > requirements.txt"'
            ])),
            step('实现纯统计函数', '输入 str，输出 dataclass 或 TypedDict，统计 characters、words、lines 和非空行；先写 5 个 pytest 单元用例。'),
            step('定义请求响应模型', '请求 text 长度 1-100000；响应只含公开统计；增加可选 request_id。'),
            step('实现接口', '提供 `GET /health` 和 `POST /analyze`。路由只调用 service，不复制统计逻辑。'),
            step('增加错误与日志', '请求过大由 Pydantic 返回 422；意外错误记录 request_id，响应不暴露堆栈。'),
            step('编写 API 测试', '覆盖 health、正常中英文、空文本、超长文本和响应字段，共至少 5 条。'),
            step('启动本地服务', '从项目根目录启动并打开 `/docs` 查看 OpenAPI。', code('powershell', [
              'python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000'
            ])),
            step('使用 Node.js 调用', '在 Node.js 练习目录创建 client.mjs，fetch POST JSON，检查 response.ok 后输出统计。', code('javascript', [
              'const response = await fetch("http://127.0.0.1:8000/analyze", {',
              '  method: "POST",',
              '  headers: { "content-type": "application/json" },',
              '  body: JSON.stringify({ text: "你好 Agent\\n第二行" })',
              '});',
              '',
              'if (!response.ok) throw new Error(`HTTP ${response.status}`);',
              'console.log(await response.json());'
            ])),
            step('完成 README', '列出创建环境、安装、测试、启动、接口示例和 Node 客户端运行命令。')
          ],
          ['至少 10 条单元/API 测试通过', '`/docs` 可查看模型与接口', '空文本返回 422', 'Node.js 客户端获得正确中文统计', '停止服务后 8000 端口释放'],
          ['uvicorn 找不到 app 时确认从项目根目录执行并存在 `app/__init__.py`', 'async 路由中不要使用 time.sleep', 'TestClient 版本冲突时核对 FastAPI 与 httpx 的兼容版本并记录锁定结果']
        ),
        acceptance: ['能解释 Python 协程何时让出控制权', 'HTTP 输入通过 Pydantic 校验', 'Node.js 与 Python 本地服务可以联调'],
        resources: [resources.pythonAsyncio, resources.fastapi, resources.pythonTyping]
      })
    ]
  });
})();
