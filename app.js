(function () {
  const course = window.COURSE;
  const storageKeys = {
    completed: 'agentpath.completed',
    bookmarks: 'agentpath.bookmarks',
    theme: 'agentpath.theme',
    collapsed: 'agentpath.collapsed',
    sidebarCollapsed: 'agentpath.sidebar-collapsed',
    quizProgress: 'agentpath.quiz-progress.v1'
  };

  const lessonContent = document.getElementById('lessonContent');
  const courseNav = document.getElementById('courseNav');
  const globalSearch = document.getElementById('globalSearch');
  const searchCount = document.getElementById('searchCount');
  const progressText = document.getElementById('progressText');
  const courseProgress = document.getElementById('courseProgress');
  const readingProgress = document.getElementById('readingProgress');
  const bookmarkButton = document.getElementById('bookmarkButton');
  const themeButton = document.getElementById('themeButton');
  const menuButton = document.getElementById('menuButton');
  const sidebarToggleButton = document.getElementById('sidebarToggleButton');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const toast = document.getElementById('toast');

  const allLessons = course.modules.flatMap((module) =>
    module.lessons.map((item) => ({
      ...item,
      moduleId: module.id,
      moduleTitle: module.title,
      phaseTitle: module.phase || '岗位主线阶段（W1-W16，共 16 周）'
    }))
  );
  const lessonMap = new Map(allLessons.map((item) => [item.id, item]));
  const completed = new Set(readJson(storageKeys.completed, []));
  const bookmarks = new Set(readJson(storageKeys.bookmarks, []));
  const collapsedModules = new Set(readJson(storageKeys.collapsed, []));
  const storedQuizProgress = readJson(storageKeys.quizProgress, {});
  const quizProgress = storedQuizProgress && typeof storedQuizProgress === 'object' && !Array.isArray(storedQuizProgress)
    ? storedQuizProgress
    : {};

  let currentLessonId = getHashLessonId();
  let currentQuery = '';
  let isDesktopSidebarCollapsed = localStorage.getItem(storageKeys.sidebarCollapsed) === 'true';
  let toastTimer;
  const desktopSidebarQuery = window.matchMedia('(min-width: 921px)');

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function saveSet(key, value) {
    localStorage.setItem(key, JSON.stringify(Array.from(value)));
  }

  function saveQuizProgress() {
    localStorage.setItem(storageKeys.quizProgress, JSON.stringify(quizProgress));
  }

  function isQuizPassed(id) {
    return quizProgress[id]?.passed === true;
  }

  function isLessonComplete(id) {
    return completed.has(id) && isQuizPassed(id);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatInline(value) {
    return escapeHtml(value).replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  }

  function getHashLessonId() {
    const value = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    return lessonMap.has(value) ? value : allLessons[0].id;
  }

  function searchText(lesson) {
    const practiceSteps = lesson.practice.steps || [];
    const demo = lesson.practice.demo;
    return [
      lesson.week,
      lesson.title,
      lesson.summary,
      lesson.moduleTitle,
      lesson.phaseTitle,
      ...lesson.objectives,
      ...lesson.sections.flatMap((item) => [item.title, ...item.paragraphs, ...item.bullets]),
      lesson.practice.title,
      lesson.practice.description,
      ...lesson.practice.tasks,
      ...practiceSteps.flatMap((item) => [item.title, item.description || '', item.code?.content || '']),
      ...(demo?.files || []).flatMap((item) => [item.name, item.description || '', item.code?.content || '']),
      demo?.commands?.content || '',
      demo?.output?.content || '',
      ...(lesson.practice.expected || []),
      ...(lesson.practice.troubleshooting || []),
      ...lesson.acceptance,
      ...lesson.quiz.questions.flatMap((question) => [question.prompt, ...question.options, question.explanation])
    ].join(' ').toLocaleLowerCase('zh-CN');
  }

  function renderNav(query = '') {
    const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN');
    let matchCount = 0;

    let currentPhase = '';
    const navParts = [];

    course.modules.forEach((module) => {
      const matches = module.lessons.filter((item) => {
        const lesson = lessonMap.get(item.id);
        const isMatch = !normalizedQuery || searchText(lesson).includes(normalizedQuery);
        if (isMatch) matchCount += 1;
        return isMatch;
      });

      if (matches.length === 0) return;

      const phaseTitle = module.phase || '岗位主线阶段（W1-W16，共 16 周）';
      if (phaseTitle !== currentPhase) {
        currentPhase = phaseTitle;
        navParts.push(`
          <div class="phase-heading">
            <span>${escapeHtml(phaseTitle)}</span>
          </div>`);
      }

      const isCollapsed = !normalizedQuery && collapsedModules.has(module.id);
      const lessonLinks = matches.map((lesson) => {
        const isActive = lesson.id === currentLessonId;
        const isComplete = isLessonComplete(lesson.id);
        const isBookmarked = bookmarks.has(lesson.id);
        return `
          <li>
            <a class="lesson-link${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}${isBookmarked ? ' is-bookmarked' : ''}"
               href="#${encodeURIComponent(lesson.id)}" data-lesson-id="${escapeHtml(lesson.id)}">
              <i data-lucide="${isComplete ? 'circle-check' : 'file-text'}"></i>
              <span class="lesson-name">${escapeHtml(lesson.week)} · ${escapeHtml(lesson.title)}</span>
              <i class="bookmark-dot" data-lucide="bookmark"></i>
            </a>
          </li>`;
      }).join('');

      navParts.push(`
        <section class="module${isCollapsed ? ' is-collapsed' : ''}" data-module-id="${escapeHtml(module.id)}">
          <button class="module-toggle" type="button" data-module-toggle="${escapeHtml(module.id)}" aria-expanded="${!isCollapsed}">
            <i data-lucide="${escapeHtml(module.icon)}"></i>
            <span class="module-title">${escapeHtml(module.title)}</span>
            <span class="module-count">${matches.length}</span>
            <i class="chevron" data-lucide="chevron-down"></i>
          </button>
          <ul class="lesson-list">${lessonLinks}</ul>
        </section>`);
    });

    courseNav.innerHTML = navParts.join('');

    if (matchCount === 0) {
      courseNav.innerHTML = '<div class="empty-search">没有找到相关课程</div>';
    }

    searchCount.textContent = normalizedQuery ? `${matchCount}项` : '';
    bindNavEvents();
    refreshIcons();
  }

  function bindNavEvents() {
    courseNav.querySelectorAll('[data-module-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const moduleId = button.dataset.moduleToggle;
        if (collapsedModules.has(moduleId)) {
          collapsedModules.delete(moduleId);
        } else {
          collapsedModules.add(moduleId);
        }
        saveSet(storageKeys.collapsed, collapsedModules);
        renderNav(currentQuery);
      });
    });

    courseNav.querySelectorAll('[data-lesson-id]').forEach((link) => {
      link.addEventListener('click', closeSidebar);
    });
  }

  function renderCode(code, index) {
    if (!code) return '';
    return `
      <div class="code-block">
        <div class="code-toolbar">
          <span>${escapeHtml(code.language || 'text')}</span>
          <button class="copy-button" type="button" data-copy-code="${index}" title="复制代码" aria-label="复制代码">
            <i data-lucide="copy"></i>
          </button>
        </div>
        <pre><code>${escapeHtml(code.content)}</code></pre>
      </div>`;
  }

  function renderSection(item, index) {
    const paragraphs = item.paragraphs.map((paragraph) => `<p>${formatInline(paragraph)}</p>`).join('');
    const bullets = item.bullets.length
      ? `<ul>${item.bullets.map((point) => `<li>${formatInline(point)}</li>`).join('')}</ul>`
      : '';
    const note = item.note ? `<div class="note">${formatInline(item.note)}</div>` : '';
    return `
      <section class="content-section">
        <div class="section-heading">
          <span class="section-index">${String(index + 1).padStart(2, '0')}</span>
          <h2>${escapeHtml(item.title)}</h2>
        </div>
        ${paragraphs}
        ${bullets}
        ${renderCode(item.code, index)}
        ${note}
      </section>`;
  }

  function renderPracticeStep(item, index) {
    const description = item.description ? `<p>${formatInline(item.description)}</p>` : '';
    return `
      <li class="practice-step">
        <div class="practice-step-heading">
          <span>${index + 1}</span>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        ${description}
        ${renderCode(item.code, `practice-${index}`)}
      </li>`;
  }

  function renderDemo(demo) {
    if (!demo) return '';
    const files = demo.files.map((file, index) => `
      <section class="demo-file">
        <div class="demo-file-heading">
          <i data-lucide="file-code-2"></i>
          <div>
            <h4>${escapeHtml(file.name)}</h4>
            ${file.description ? `<p>${formatInline(file.description)}</p>` : ''}
          </div>
        </div>
        ${renderCode(file.code, `demo-file-${index}`)}
      </section>`).join('');

    return `
      <section class="demo-pack">
        <p class="demo-eyebrow">最小可运行示例</p>
        <h3>${escapeHtml(demo.title)}</h3>
        <p>${formatInline(demo.description)}</p>
        <div class="demo-files">${files}</div>
        <section class="demo-command">
          <h4><i data-lucide="terminal"></i>安装与运行</h4>
          ${renderCode(demo.commands, 'demo-commands')}
        </section>
        <section class="demo-command">
          <h4><i data-lucide="square-terminal"></i>预期输出</h4>
          ${renderCode(demo.output, 'demo-output')}
        </section>
        ${demo.verify ? `<div class="demo-verify"><strong>验证重点</strong><p>${formatInline(demo.verify)}</p></div>` : ''}
      </section>`;
  }

  function renderPractice(practice, acceptance) {
    const steps = practice.steps?.length
      ? `<ol class="practice-steps">${practice.steps.map(renderPracticeStep).join('')}</ol>`
      : `<ol>${practice.tasks.map((item) => `<li>${formatInline(item)}</li>`).join('')}</ol>`;
    const expected = practice.expected?.length
      ? `<div class="practice-result"><h3>预期结果</h3><ul>${practice.expected.map((item) => `<li>${formatInline(item)}</li>`).join('')}</ul></div>`
      : '';
    const troubleshooting = practice.troubleshooting?.length
      ? `<details class="troubleshooting"><summary>常见问题与排错</summary><ul>${practice.troubleshooting.map((item) => `<li>${formatInline(item)}</li>`).join('')}</ul></details>`
      : '';

    return `
      <section class="practice-section">
        <p class="practice-eyebrow">动手练习</p>
        <h2>${escapeHtml(practice.title)}</h2>
        <p>${escapeHtml(practice.description)}</p>
        ${steps}
        ${renderDemo(practice.demo)}
        ${expected}
        ${troubleshooting}
        <div class="acceptance-block">
          <h3>实践验收</h3>
          <ul class="acceptance-list">
            ${acceptance.map((item) => `<li>${formatInline(item)}</li>`).join('')}
          </ul>
        </div>
      </section>`;
  }

  function renderQuiz(lesson) {
    const quiz = lesson.quiz;
    const state = quizProgress[lesson.id] || {};
    const answers = Array.isArray(state.answers) ? state.answers : [];
    const submitted = state.submitted === true;
    const passed = state.passed === true;
    const correctCount = submitted
      ? quiz.questions.filter((question, index) => answers[index] === question.answer).length
      : 0;
    const currentAttemptPassed = submitted && correctCount === quiz.questions.length;
    const statusLabel = passed ? '已通过' : submitted ? '未通过' : '待完成';
    const attemptSummary = state.attempts
      ? ` · 已作答 ${state.attempts} 次 · 最好 ${state.bestScore} 分`
      : '';

    const questions = quiz.questions.map((question, questionIndex) => {
      const selectedAnswer = answers[questionIndex];
      const isCorrect = selectedAnswer === question.answer;
      const options = question.options.map((option, optionIndex) => {
        const isSelected = selectedAnswer === optionIndex;
        const optionState = submitted
          ? optionIndex === question.answer
            ? ' is-correct'
            : isSelected
              ? ' is-incorrect'
              : ''
          : '';
        return `
          <label class="quiz-option${optionState}" for="${escapeHtml(question.id)}-option-${optionIndex}">
            <input id="${escapeHtml(question.id)}-option-${optionIndex}" type="radio" name="quiz-${questionIndex}" value="${optionIndex}"${isSelected ? ' checked' : ''}${submitted ? ' disabled' : ''}>
            <span>${formatInline(option)}</span>
            ${submitted && optionIndex === question.answer ? '<i data-lucide="check"></i>' : ''}
            ${submitted && isSelected && optionIndex !== question.answer ? '<i data-lucide="x"></i>' : ''}
          </label>`;
      }).join('');

      return `
        <fieldset class="quiz-question" data-quiz-question="${questionIndex}">
          <legend><span>问题 ${questionIndex + 1}</span>${formatInline(question.prompt)}</legend>
          <div class="quiz-options">${options}</div>
          ${submitted ? `
            <div class="quiz-explanation ${isCorrect ? 'is-correct' : 'is-incorrect'}">
              <strong>${isCorrect ? '回答正确' : '回答错误'}</strong>
              <p>${formatInline(question.explanation)}</p>
            </div>` : ''}
        </fieldset>`;
    }).join('');

    const result = submitted ? `
      <div class="quiz-result ${currentAttemptPassed ? 'is-passed' : 'is-failed'}" role="status">
        <div>
          <strong>${currentAttemptPassed ? '本次测验通过' : passed ? '本次未通过，已保留历史通过记录' : '本次测验未通过'}</strong>
          <span>答对 ${correctCount} / ${quiz.questions.length} 题</span>
        </div>
        <span class="quiz-score">${Math.round((correctCount / quiz.questions.length) * 100)} 分</span>
      </div>` : '';

    return `
      <section class="quiz-section" id="lessonQuiz" aria-labelledby="quizTitle">
        <p class="quiz-eyebrow">理解测验</p>
        <div class="quiz-heading">
          <div>
            <h2 id="quizTitle">本章问答</h2>
            <p>共 ${quiz.questions.length} 题 · ${quiz.passingScore} 分通过${attemptSummary}</p>
          </div>
          <span class="quiz-status ${passed ? 'is-passed' : ''}"><i data-lucide="${passed ? 'badge-check' : 'circle-help'}"></i>${statusLabel}</span>
        </div>
        ${result}
        <form class="quiz-form" id="quizForm" novalidate>
          ${questions}
          <div class="quiz-actions">
            ${submitted
              ? `<button class="command-button" id="retryQuizButton" type="button"><i data-lucide="rotate-ccw"></i>${passed ? '再次练习' : '重新作答'}</button>`
              : '<button class="command-button primary" type="submit"><i data-lucide="send"></i>提交答案</button>'}
          </div>
        </form>
      </section>`;
  }

  function renderLesson(id) {
    const lesson = lessonMap.get(id) || allLessons[0];
    currentLessonId = lesson.id;
    const lessonIndex = allLessons.findIndex((item) => item.id === lesson.id);
    const previous = allLessons[lessonIndex - 1];
    const next = allLessons[lessonIndex + 1];
    const isPracticeComplete = completed.has(lesson.id);
    const isBookmarked = bookmarks.has(lesson.id);

    lessonContent.innerHTML = `
      <div class="breadcrumbs">
        <span>学习路线</span>
        <i data-lucide="chevron-right"></i>
        <span>${escapeHtml(lesson.moduleTitle)}</span>
        <i data-lucide="chevron-right"></i>
        <span>${escapeHtml(lesson.week)}</span>
      </div>

      <header class="lesson-header">
        <p class="lesson-kicker">${escapeHtml(lesson.week)} · ${escapeHtml(lesson.moduleTitle)}</p>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p class="lesson-summary">${escapeHtml(lesson.summary)}</p>
        <div class="lesson-meta">
          <span><i data-lucide="clock-3"></i>${escapeHtml(lesson.duration)}</span>
          <span><i data-lucide="gauge"></i>${escapeHtml(lesson.level)}</span>
          <span><i data-lucide="calendar-days"></i>更新于 ${escapeHtml(course.updatedAt)}</span>
        </div>
        <div class="lesson-actions">
          <button class="command-button${isPracticeComplete ? ' is-complete' : ' primary'}" id="completeButton" type="button">
            <i data-lucide="${isPracticeComplete ? 'circle-check' : 'check'}"></i>
            ${isPracticeComplete ? '实践已完成' : '标记实践完成'}
          </button>
          <button class="command-button" id="articleBookmarkButton" type="button">
            <i data-lucide="bookmark"></i>
            ${isBookmarked ? '已收藏' : '收藏章节'}
          </button>
        </div>
      </header>

      <section class="objectives">
        <h2>本章目标</h2>
        <ul>${lesson.objectives.map((item) => `<li>${formatInline(item)}</li>`).join('')}</ul>
      </section>

      ${lesson.sections.map(renderSection).join('')}

      ${renderPractice(lesson.practice, lesson.acceptance)}

      ${renderQuiz(lesson)}

      <section class="resources-section">
        <h2>对应资料</h2>
        <p>先完成本章练习，再按问题查阅官方文档。</p>
        <ul class="resource-list">
          ${lesson.resources.map((item) => `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.label)}</a></li>`).join('')}
        </ul>
      </section>

      <nav class="lesson-pagination" aria-label="章节导航">
        ${previous ? `
          <a class="pagination-link previous" href="#${encodeURIComponent(previous.id)}">
            <i data-lucide="arrow-left"></i>
            <span><span class="pagination-label">上一篇</span><span class="pagination-title">${escapeHtml(previous.title)}</span></span>
          </a>` : '<span></span>'}
        ${next ? `
          <a class="pagination-link next" href="#${encodeURIComponent(next.id)}">
            <span><span class="pagination-label">下一篇</span><span class="pagination-title">${escapeHtml(next.title)}</span></span>
            <i data-lucide="arrow-right"></i>
          </a>` : '<span></span>'}
      </nav>`;

    document.title = `${lesson.title} | AgentPath`;
    updateBookmarkButton();
    bindLessonEvents(lesson);
    renderNav(currentQuery);
    updateProgress();
    refreshIcons();
    window.scrollTo({ top: 0, behavior: 'instant' });
    readingProgress.style.width = '0';
    lessonContent.focus({ preventScroll: true });
  }

  function bindLessonEvents(lesson) {
    document.getElementById('completeButton').addEventListener('click', () => {
      if (completed.has(lesson.id)) {
        completed.delete(lesson.id);
        showToast('已取消实践完成标记');
      } else {
        completed.add(lesson.id);
        showToast(isQuizPassed(lesson.id) ? '本章已完成' : '实践已记录，完成测验后计入进度');
      }
      saveSet(storageKeys.completed, completed);
      renderLesson(lesson.id);
    });

    document.getElementById('articleBookmarkButton').addEventListener('click', () => {
      toggleBookmark(lesson.id);
    });

    lessonContent.querySelectorAll('[data-copy-code]').forEach((button) => {
      button.addEventListener('click', async () => {
        const code = button.closest('.code-block').querySelector('code').textContent;
        await copyText(code);
        showToast('代码已复制');
      });
    });

    bindQuizEvents(lesson);
  }

  function bindQuizEvents(lesson) {
    const form = document.getElementById('quizForm');
    if (!form) return;

    form.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener('change', () => {
        input.closest('.quiz-question').classList.remove('is-unanswered');
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const answers = lesson.quiz.questions.map((_question, index) => {
        const selected = form.querySelector(`input[name="quiz-${index}"]:checked`);
        return selected ? Number(selected.value) : null;
      });
      const firstMissing = answers.findIndex((answer) => answer === null);
      if (firstMissing !== -1) {
        const question = form.querySelector(`[data-quiz-question="${firstMissing}"]`);
        question.classList.add('is-unanswered');
        question.scrollIntoView({ behavior: 'smooth', block: 'center' });
        question.querySelector('input')?.focus({ preventScroll: true });
        showToast('请先完成全部题目');
        return;
      }

      const correctCount = lesson.quiz.questions.filter((question, index) => answers[index] === question.answer).length;
      const score = Math.round((correctCount / lesson.quiz.questions.length) * 100);
      const previous = quizProgress[lesson.id] || {};
      const passed = previous.passed === true || score >= lesson.quiz.passingScore;
      quizProgress[lesson.id] = {
        answers,
        score,
        bestScore: Math.max(previous.bestScore || 0, score),
        passed,
        attempts: (previous.attempts || 0) + 1,
        submitted: true
      };
      saveQuizProgress();
      showToast(score >= lesson.quiz.passingScore
        ? completed.has(lesson.id) ? '测验通过，本章已完成' : '理解测验已通过'
        : '还有知识点需要复习');
      renderLesson(lesson.id);
      requestAnimationFrame(() => document.getElementById('lessonQuiz')?.scrollIntoView({ block: 'start' }));
    });

    document.getElementById('retryQuizButton')?.addEventListener('click', () => {
      const previous = quizProgress[lesson.id] || {};
      quizProgress[lesson.id] = {
        ...previous,
        answers: [],
        score: null,
        submitted: false
      };
      saveQuizProgress();
      renderLesson(lesson.id);
      requestAnimationFrame(() => document.getElementById('lessonQuiz')?.scrollIntoView({ block: 'start' }));
    });
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function toggleBookmark(id) {
    if (bookmarks.has(id)) {
      bookmarks.delete(id);
      showToast('已取消收藏');
    } else {
      bookmarks.add(id);
      showToast('章节已收藏');
    }
    saveSet(storageKeys.bookmarks, bookmarks);
    updateBookmarkButton();
    renderLesson(id);
  }

  function updateBookmarkButton() {
    const isBookmarked = bookmarks.has(currentLessonId);
    bookmarkButton.classList.toggle('is-active', isBookmarked);
    bookmarkButton.title = isBookmarked ? '取消收藏当前章节' : '收藏当前章节';
    bookmarkButton.setAttribute('aria-label', bookmarkButton.title);
  }

  function updateProgress() {
    const count = allLessons.filter((item) => isLessonComplete(item.id)).length;
    const percent = allLessons.length ? (count / allLessons.length) * 100 : 0;
    progressText.textContent = `${count} / ${allLessons.length}`;
    courseProgress.style.width = `${percent}%`;
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
    }
  }

  function openSidebar() {
    sidebar.classList.add('is-open');
    sidebarOverlay.classList.add('is-open');
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    sidebarOverlay.classList.remove('is-open');
  }

  function applyDesktopSidebarState() {
    const isCollapsed = desktopSidebarQuery.matches && isDesktopSidebarCollapsed;
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    sidebar.toggleAttribute('inert', isCollapsed);
    sidebar.setAttribute('aria-hidden', String(isCollapsed));
    sidebarToggleButton.innerHTML = `<i data-lucide="${isCollapsed ? 'panel-left-open' : 'panel-left-close'}"></i>`;
    sidebarToggleButton.title = isCollapsed ? '展开课程目录' : '收起课程目录';
    sidebarToggleButton.setAttribute('aria-label', sidebarToggleButton.title);
    sidebarToggleButton.setAttribute('aria-expanded', String(!isCollapsed));
    refreshIcons();
  }

  function toggleDesktopSidebar() {
    isDesktopSidebarCollapsed = !isDesktopSidebarCollapsed;
    localStorage.setItem(storageKeys.sidebarCollapsed, String(isDesktopSidebarCollapsed));
    applyDesktopSidebarState();
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(storageKeys.theme, theme);
    themeButton.innerHTML = `<i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    themeButton.title = theme === 'dark' ? '切换到浅色主题' : '切换到深色主题';
    themeButton.setAttribute('aria-label', themeButton.title);
    refreshIcons();
  }

  globalSearch.addEventListener('input', (event) => {
    currentQuery = event.target.value;
    renderNav(currentQuery);
  });

  bookmarkButton.addEventListener('click', () => toggleBookmark(currentLessonId));
  themeButton.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  menuButton.addEventListener('click', openSidebar);
  sidebarToggleButton.addEventListener('click', toggleDesktopSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  desktopSidebarQuery.addEventListener('change', applyDesktopSidebarState);

  window.addEventListener('hashchange', () => {
    renderLesson(getHashLessonId());
    closeSidebar();
  });

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? Math.min(100, (window.scrollY / maxScroll) * 100) : 0;
    readingProgress.style.width = `${percent}%`;
  }, { passive: true });

  applyTheme(localStorage.getItem(storageKeys.theme) === 'dark' ? 'dark' : 'light');
  applyDesktopSidebarState();
  updateProgress();
  renderLesson(currentLessonId);
})();
