import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataScripts = [
  'course-data.js',
  'foundation-data.js',
  'foundation-typescript.js',
  'foundation-nodejs.js',
  'foundation-python.js',
  'foundation-backend.js',
  'foundation-demos.js',
  'main-details.js',
  'foundation-apply.js',
  'job-track-foundations.js',
  'quiz-data.js'
];
const allScripts = [...dataScripts, 'app.js', 'server.js'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function checkWithProcess(command, args, input, label) {
  const result = spawnSync(command, args, { input, encoding: 'utf8' });
  const detail = result.error?.message || result.stderr || result.stdout || '未知错误';
  assert(result.status === 0, `${label} 语法检查失败\n${detail}`);
}

function checkSqlStructure(source, label) {
  const withoutStrings = source.replace(/'(?:''|[^'])*'/g, "''");
  assert((withoutStrings.match(/'/g) || []).length % 2 === 0, `${label} SQL 字符串引号不闭合`);
  let depth = 0;
  for (const character of withoutStrings) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    assert(depth >= 0, `${label} SQL 右括号多于左括号`);
  }
  assert(depth === 0, `${label} SQL 括号不闭合`);
  assert(/\b(SELECT|CREATE|INSERT|UPDATE|DELETE|BEGIN|COMMIT|ALTER|DROP)\b/i.test(withoutStrings), `${label} 未找到 SQL 语句`);
}

function collectStrings(value, result = []) {
  if (typeof value === 'string') result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, result));
  return result;
}

for (const filename of allScripts) {
  const source = fs.readFileSync(path.join(root, filename), 'utf8');
  new vm.Script(source, { filename });
}

const context = vm.createContext({ window: {}, console });
for (const filename of dataScripts) {
  const source = fs.readFileSync(path.join(root, filename), 'utf8');
  new vm.Script(source, { filename }).runInContext(context);
}

const course = context.window.COURSE;
assert(course && Array.isArray(course.modules), '课程数据未正确生成');
assert(course.modules.length === 10, `模块数量应为 10，实际为 ${course.modules.length}`);

const pythonCommand = process.env.PYTHON || 'python';
const pythonVersionResult = spawnSync(pythonCommand, ['-c', 'import sys; print(".".join(map(str, sys.version_info[:3])))'], { encoding: 'utf8' });
const pythonVersionDetail = pythonVersionResult.error?.message || pythonVersionResult.stderr || '';
assert(pythonVersionResult.status === 0, `无法运行 Python：${pythonVersionDetail}`);
const pythonVersion = pythonVersionResult.stdout.trim();
const [pythonMajor, pythonMinor] = pythonVersion.split('.').map(Number);
assert(pythonMajor > 3 || (pythonMajor === 3 && pythonMinor >= 12), `内容校验要求 Python 3.12+，实际为 ${pythonVersion}`);

const lessons = course.modules.flatMap((module) => module.lessons || []);
const ids = lessons.map((lesson) => lesson.id);
assert(lessons.length === 51, `章节数量应为 51，实际为 ${lessons.length}`);
assert(new Set(ids).size === ids.length, '章节 ID 存在重复');
assert(lessons.filter((lesson) => lesson.id.startsWith('w')).length === 16, '岗位主线应为 W1-W16 共 16 章');
const conceptLessonIds = new Set([
  'job-backend-nest-concepts',
  'job-llm-concepts',
  'job-rag-concepts',
  'job-agent-concepts',
  'job-mcp-concepts'
]);
assert([...conceptLessonIds].every((id) => ids.includes(id)), '岗位主线缺少 NestJS/LLM/RAG/Agent/MCP 概念导论');
const jobLessons = lessons.filter((lesson) => lesson.id.startsWith('w') || conceptLessonIds.has(lesson.id));
assert(jobLessons.length === 21, `岗位主线应为 16 个工程章加 5 个概念章，实际为 ${jobLessons.length}`);
for (const [moduleId, conceptId, engineeringId] of [
  ['backend-engineering', 'job-backend-nest-concepts', 'w2-nest-streaming'],
  ['llm-applications', 'job-llm-concepts', 'w5-model-streaming'],
  ['rag-engineering', 'job-rag-concepts', 'w8-rag-ingestion'],
  ['agent-engineering', 'job-agent-concepts', 'w11-workflows-agents'],
  ['agent-engineering', 'job-mcp-concepts', 'w13-mcp-security']
]) {
  const module = course.modules.find((item) => item.id === moduleId);
  assert(module, `缺少岗位模块：${moduleId}`);
  assert(module.lessons.findIndex((lesson) => lesson.id === conceptId) < module.lessons.findIndex((lesson) => lesson.id === engineeringId), `${conceptId} 必须位于 ${engineeringId} 之前`);
}

let sectionCount = 0;
let stepCount = 0;
let demoJavaScriptFiles = 0;
let demoTypeScriptFiles = 0;
let demoPythonFiles = 0;
let demoJsonFiles = 0;
let demoSqlFiles = 0;
let quizQuestionCount = 0;
const quizQuestionIds = new Set();
const quizAnswerDistribution = [0, 0, 0];
for (const lesson of lessons) {
  const prefix = `${lesson.id}: `;
  assert(Array.isArray(lesson.objectives) && lesson.objectives.length >= 3, `${prefix}学习目标不完整`);
  assert(Array.isArray(lesson.sections) && lesson.sections.length >= 2, `${prefix}知识讲解不足`);
  assert(Array.isArray(lesson.practice?.steps) && lesson.practice.steps.length >= 4, `${prefix}练习步骤不足`);
  assert(Array.isArray(lesson.acceptance) && lesson.acceptance.length >= 3, `${prefix}验收标准不完整`);
  assert(Array.isArray(lesson.resources) && lesson.resources.length >= 1, `${prefix}缺少学习资料`);
  assert(lesson.quiz?.passingScore === 100, `${prefix}测验通过分数必须为 100`);
  assert(Array.isArray(lesson.quiz?.questions) && lesson.quiz.questions.length === 3, `${prefix}必须包含 3 道理解题`);

  if (jobLessons.includes(lesson)) {
    assert(lesson.learningApproach === 'knowledge-first', `${prefix}未标记知识优先学习顺序`);
    assert(lesson.sections.length >= 6, `${prefix}岗位主线至少需要 6 节概念与工程讲解`);
    const firstTitles = lesson.sections.slice(0, 6).map((item) => item.title).join('|');
    assert(firstTitles.includes('是什么'), `${prefix}缺少前置定义讲解`);
    assert(firstTitles.includes('为什么'), `${prefix}缺少问题背景讲解`);
    assert(firstTitles.includes('核心机制'), `${prefix}缺少核心机制讲解`);
    assert(lesson.sections.some((item) => /边界|误区/.test(item.title)), `${prefix}缺少适用边界或常见误区`);
  }

  for (const question of lesson.quiz.questions) {
    assert(typeof question.id === 'string' && question.id, `${prefix}测验题缺少 ID`);
    assert(!quizQuestionIds.has(question.id), `${prefix}测验题 ID 重复：${question.id}`);
    quizQuestionIds.add(question.id);
    assert(typeof question.prompt === 'string' && question.prompt.trim(), `${prefix}${question.id} 缺少题干`);
    assert(Array.isArray(question.options) && question.options.length === 3, `${prefix}${question.id} 必须包含 3 个选项`);
    assert(new Set(question.options).size === question.options.length, `${prefix}${question.id} 存在重复选项`);
    assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, `${prefix}${question.id} 正确答案越界`);
    quizAnswerDistribution[question.answer] += 1;
    assert(typeof question.explanation === 'string' && question.explanation.trim(), `${prefix}${question.id} 缺少答案解析`);
    quizQuestionCount += 1;
  }

  const demo = lesson.practice?.demo;
  assert(demo && Array.isArray(demo.files) && demo.files.length >= 1, `${prefix}缺少完整 Demo 文件`);
  assert(demo.commands?.content?.trim(), `${prefix}缺少 Demo 运行命令`);
  assert(demo.output?.content?.trim(), `${prefix}缺少 Demo 预期输出`);
  assert(typeof demo.verify === 'string' && demo.verify.trim(), `${prefix}缺少 Demo 验证重点`);

  for (const demoFile of demo.files) {
    const language = demoFile.code?.language;
    const source = demoFile.code?.content || '';
    const label = `${prefix}${demoFile.name}`;
    if (language === 'javascript') {
      const isCommonJs = demoFile.name.includes('.cjs');
      const args = isCommonJs ? ['--check', '-'] : ['--check', '--input-type=module', '-'];
      checkWithProcess(process.execPath, args, source, label);
      demoJavaScriptFiles += 1;
    } else if (language === 'typescript') {
      const stripped = stripTypeScriptTypes(source, { mode: 'transform' });
      const syntaxSource = stripped
        .replace(/^\s*@[A-Za-z_$][\w$]*\(\{[\s\S]*?^\s*\}\)\s*$/gm, '')
        .replace(/^\s*@[A-Za-z_$][\w$]*(?:\([^\r\n]*\))?\s*$/gm, '')
        .replace(/([,(]\s*)@[A-Za-z_$][\w$]*\([^)]*\)\s*/g, '$1');
      checkWithProcess(process.execPath, ['--check', '--input-type=module', '-'], syntaxSource, label);
      demoTypeScriptFiles += 1;
    } else if (language === 'python') {
      checkWithProcess(pythonCommand, ['-c', 'import ast, sys; ast.parse(sys.stdin.read())'], source, label);
      demoPythonFiles += 1;
    } else if (language === 'json') {
      try {
        JSON.parse(source);
      } catch (error) {
        throw new Error(`${label} JSON 解析失败\n${error.message}`);
      }
      demoJsonFiles += 1;
    } else if (language === 'sql') {
      checkSqlStructure(source, label);
      demoSqlFiles += 1;
    } else if (language === 'dockerfile') {
      assert(/^FROM\s+\S+/im.test(source), `${label} Dockerfile 缺少 FROM`);
    }
  }

  sectionCount += lesson.sections.length;
  stepCount += lesson.practice.steps.length;
}

assert(Math.max(...quizAnswerDistribution) - Math.min(...quizAnswerDistribution) <= 12, `正确答案位置分布失衡：${quizAnswerDistribution.join('/')}`);

const engineeringDemoRequirements = {
  'w2-nest-streaming': ['@nestjs/core', '@Controller', 'emitDecoratorMetadata'],
  'w8-rag-ingestion': ['embedMany', 'pgvector', 'CREATE EXTENSION IF NOT EXISTS vector'],
  'w11-workflows-agents': ['@langchain/langgraph', 'StateGraph', 'addConditionalEdges'],
  'w12-persistence-hitl': ['idempotencyKey', 'executionCount', 'node hitl.mjs approve'],
  'w13-mcp-security': ['@modelcontextprotocol/sdk', 'McpServer', 'client.listTools', 'authorize']
};
for (const [lessonId, requiredTokens] of Object.entries(engineeringDemoRequirements)) {
  const lesson = lessons.find((item) => item.id === lessonId);
  const source = JSON.stringify(lesson?.practice?.demo || {});
  for (const token of requiredTokens) assert(source.includes(token), `${lessonId} 工程 Demo 缺少真实技术要素：${token}`);
}

const visibleContent = JSON.stringify(course);
for (const staleText of ['20周', '20 周', '4周基础', '四周基础', 'P1-P4']) {
  assert(!visibleContent.includes(staleText), `课程仍包含旧规划文本：${staleText}`);
}

const courseStrings = collectStrings(course);
const activationPath = String.raw`.\.venv\Scripts\Activate.ps1`;
const activationCommands = courseStrings.filter((value) => value.includes('Activate.ps1'));
assert(activationCommands.length >= 1, '课程缺少 Python 虚拟环境激活命令');
for (const command of activationCommands) {
  assert(command.includes(activationPath), `Python 虚拟环境路径在渲染后损坏：${command}`);
}
assert(!courseStrings.some((value) => value.includes('..venvScripts')), '课程包含被 JavaScript 吞掉反斜杠的虚拟环境路径');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const relativeAssets = [...html.matchAll(/(?:src|href)="(\.\/[^"#?]+)(?:\?[^"#]*)?"/g)].map((match) => match[1]);
for (const relativeAsset of relativeAssets) {
  assert(fs.existsSync(path.resolve(root, relativeAsset)), `页面资源不存在：${relativeAsset}`);
}
assert(fs.existsSync(path.join(root, '.nojekyll')), '缺少 GitHub Pages .nojekyll');
assert(fs.existsSync(path.join(root, '.github', 'workflows', 'pages.yml')), '缺少 GitHub Pages 工作流');

console.log(JSON.stringify({
  modules: course.modules.length,
  pythonVersion,
  lessons: lessons.length,
  uniqueIds: new Set(ids).size,
  demos: lessons.filter((lesson) => lesson.practice?.demo).length,
  sections: sectionCount,
  practiceSteps: stepCount,
  demoJavaScriptFiles,
  demoTypeScriptFiles,
  demoPythonFiles,
  demoJsonFiles,
  demoSqlFiles,
  quizQuestions: quizQuestionCount,
  quizAnswerDistribution,
  relativeAssets: relativeAssets.length,
  status: 'passed'
}, null, 2));
