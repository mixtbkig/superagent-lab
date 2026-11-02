/* ============================================================
   DeepSeek Harness 深度教程 · 应用逻辑
   ============================================================ */
(function () {
  "use strict";

  const CHAPTERS = [
    { id: "ch00", file: "ch00.html", num: "00", title: "为什么需要 Harness", sub: "从大模型到一个能干活的智能体", part: "第一部 · 建立直觉" },
    { id: "ch01", file: "ch01.html", num: "01", title: "Agent 的最小循环", sub: "ReAct：想一步、做一步、看一步", part: "第一部 · 建立直觉" },
    { id: "ch02", file: "ch02.html", num: "02", title: "一切皆插件：Cordis", sub: "服务、上下文、事件与可逆副作用", part: "第一部 · 建立直觉" },
    { id: "ch03", file: "ch03.html", num: "03", title: "组装一台 DSH", sub: "Profile、组合包与分层 patch", part: "第一部 · 建立直觉" },

    { id: "ch04", file: "ch04.html", num: "04", title: "全局架构", sub: "一次用户请求的完整旅程", part: "第二部 · 核心引擎" },
    { id: "ch05", file: "ch05.html", num: "05", title: "会话日志：唯一真源", sub: "事件溯源与派生历史", part: "第二部 · 核心引擎" },
    { id: "ch06", file: "ch06.html", num: "06", title: "轮次与步骤", sub: "Turn / Step 的生命周期与事件", part: "第二部 · 核心引擎" },
    { id: "ch07", file: "ch07.html", num: "07", title: "LLM 层", sub: "Message、ContentBlock 与 StreamChunk", part: "第二部 · 核心引擎" },
    { id: "ch08", file: "ch08.html", num: "08", title: "工具系统（上）", sub: "注册表、Schema DSL 与作用域", part: "第二部 · 核心引擎" },
    { id: "ch09", file: "ch09.html", num: "09", title: "工具系统（下）", sub: "受保护的执行流水线与沙箱", part: "第二部 · 核心引擎" },

    { id: "ch10", file: "ch10.html", num: "10", title: "系统提示词与上下文", sub: "提示词如何被组装与记录", part: "第三部 · 上下文与记忆" },
    { id: "ch11", file: "ch11.html", num: "11", title: "上下文压缩与记忆", sub: "Token 计量、压缩与结果剪枝", part: "第三部 · 上下文与记忆" },
    { id: "ch12", file: "ch12.html", num: "12", title: "持久化与恢复", sub: "SessionHandle、JSONL 与崩溃修复", part: "第三部 · 上下文与记忆" },

    { id: "ch13", file: "ch13.html", num: "13", title: "子代理与多智能体", sub: "委派、Workflow 与 Agent Teams", part: "第四部 · 编排与扩展" },
    { id: "ch14", file: "ch14.html", num: "14", title: "技能、MCP 与扩展", sub: "Skill、MCP、动态插件与 Claude Code 模组", part: "第四部 · 编排与扩展" },

    { id: "ch15", file: "ch15.html", num: "15", title: "人在环路", sub: "审批、权限、计划、目标与后台任务", part: "第五部 · 外围与治理" },
    { id: "ch16", file: "ch16.html", num: "16", title: "前端、传输与多端", sub: "Web、Desktop、SDK、ACP 与 Typert RPC", part: "第五部 · 外围与治理" },
    { id: "ch17", file: "ch17.html", num: "17", title: "安全、可观测与工程约束", sub: "沙箱、守卫、遥测与测试体系", part: "第五部 · 外围与治理" },

    { id: "ch18", file: "ch18.html", num: "18", title: "模块全景图", sub: "372 个包的全景（不遗漏）", part: "第六部 · 全景与实战" },
    { id: "ch19", file: "ch19.html", num: "19", title: "动手实践", sub: "写一个工具插件 / 用 SDK 驱动", part: "第六部 · 全景与实战" },
    { id: "ch20", file: "ch20.html", num: "20", title: "总结与学习路线", sub: "术语表、源码导航与下一步", part: "第六部 · 全景与实战" }
  ];

  const PROGRESS_KEY = "dshcourseprogress";
  const THEME_KEY = "dsh-course-theme";

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch (e) { return {}; }
  }
  function setProgress(p) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch (e) {}
  }
  function currentChapter() {
    const b = document.body;
    return b && b.dataset.chapter ? b.dataset.chapter : null;
  }

  /* ---------- theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t === "dark" ? "dark" : "light");
  }
  (function initTheme() {
    let t = "light";
    try { t = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch (e) {}
    applyTheme(t);
  })();
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }

  /* ---------- sidebar ---------- */
  function buildSidebar() {
    const sb = document.getElementById("sidebar");
    if (!sb) return;
    const cur = currentChapter();
    const prog = getProgress();
    let html = '<div class="sb-brand-row" style="display:flex;align-items:center;gap:10px;padding:4px 8px 12px;font-weight:900;font-size:15px">' +
      '<span style="width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--brand),var(--teal));display:grid;place-items:center;color:#fff;font-size:13px">D</span>' +
      '课程目录</div>';
    let lastPart = "";
    CHAPTERS.forEach(function (c) {
      if (c.part !== lastPart) {
        html += '<div class="sb-section">' + c.part + "</div>";
        lastPart = c.part;
      }
      const active = c.id === cur ? " active" : "";
      const done = prog[c.id] ? " done" : "";
      html += '<a class="sb-link' + active + done + '" href="' + c.file + '">' +
        '<span class="num">' + c.num + "</span><span>" + c.title + '</span><span class="chk">✓</span></a>';
    });
    sb.innerHTML = html;
  }

  /* ---------- pager ---------- */
  function buildPager() {
    const pager = document.getElementById("pager");
    if (!pager) return;
    const cur = currentChapter();
    const idx = CHAPTERS.findIndex(function (c) { return c.id === cur; });
    let prev = idx > 0 ? CHAPTERS[idx - 1] : null;
    let next = idx >= 0 && idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
    const prevHtml = prev
      ? '<a class="prev" href="' + prev.file + '"><div class="p-kicker">← 上一章</div><div class="p-title">' + prev.num + " · " + prev.title + "</div></a>"
      : '<a class="prev empty"></a>';
    const nextHtml = next
      ? '<a class="next" href="' + next.file + '"><div class="p-kicker">下一章 →</div><div class="p-title">' + next.num + " · " + next.title + "</div></a>"
      : '<a class="next" href="index.html"><div class="p-kicker">完成 🎉</div><div class="p-title">返回课程地图</div></a>';
    pager.innerHTML = prevHtml + nextHtml;
  }

  /* ---------- crumb ---------- */
  function buildCrumb() {
    const el = document.querySelector(".topbar .crumb");
    if (!el) return;
    const cur = currentChapter();
    const c = CHAPTERS.find(function (x) { return x.id === cur; });
    if (c) el.textContent = "第 " + c.num + " 章 · " + c.title;
    else el.textContent = "DeepSeek Harness 深度教程";
  }

  /* ---------- page TOC ---------- */
  function buildToc() {
    const article = document.querySelector("article");
    if (!article) return;
    const hs = article.querySelectorAll("h2");
    if (hs.length < 3) return;
    const box = document.createElement("div");
    box.className = "box insight";
    box.style.marginBottom = "10px";
    let html = '<div class="box-title">🧭 本页目录</div><ol style="columns:2;column-gap:28px;margin:6px 0 0;padding-left:20px;font-size:13.5px">';
    hs.forEach(function (h, i) {
      if (!h.id) h.id = "sec-" + i;
      html += '<li style="margin:4px 0"><a href="#' + h.id + '">' + h.textContent + "</a></li>";
    });
    html += "</ol>";
    box.innerHTML = html;
    const lead = article.querySelector(".ch-lead, .ch-tag");
    if (lead && lead.parentNode) {
      // insert after the first objectives or after lead block
      const obj = article.querySelector(".objectives");
      const anchor = obj || article.querySelector("h1");
      anchor.parentNode.insertBefore(box, anchor.nextSibling);
    }
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- progress bar ---------- */
  function initReadingProgress() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;
    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = p + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- code copy + highlight ---------- */
  const KEYWORDS = "const let var function return if else for while class extends new async await import from export type interface implements readonly abstract public private protected switch case default break continue throw try catch finally typeof instanceof in of as void null undefined true false this super yield static declare module namespace enum";
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function highlight(code) {
    let esc = escapeHtml(code);
    const re = new RegExp(
      "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)" + // 1 comments
      "|(`(?:\\\\.|[^`\\\\])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')" + // 2 strings
      "|\\b(" + KEYWORDS.split(" ").join("|") + ")\\b" + // 3 keywords
      "|\\b(\\d+(?:\\.\\d+)?)\\b", // 4 numbers
      "g"
    );
    return esc.replace(re, function (m, c, s, k, n) {
      if (c) return '<span class="c">' + c + "</span>";
      if (s) return '<span class="s">' + s + "</span>";
      if (k) return '<span class="k">' + k + "</span>";
      if (n) return '<span class="n">' + n + "</span>";
      return m;
    });
  }
  function initCode() {
    document.querySelectorAll("pre").forEach(function (pre) {
      if (!pre.querySelector("code")) {
        const code = document.createElement("code");
        code.textContent = pre.textContent;
        pre.textContent = "";
        pre.appendChild(code);
      }
      const codeEl = pre.querySelector("code");
      if (!pre.closest(".code-wrap")) {
        const wrap = document.createElement("div");
        wrap.className = "code-wrap";
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);
        const btn = document.createElement("button");
        btn.className = "copy-code";
        btn.textContent = "复制";
        btn.addEventListener("click", function () {
          const txt = codeEl.innerText;
          if (navigator.clipboard) { navigator.clipboard.writeText(txt).then(function(){ btn.textContent = "已复制"; setTimeout(function(){ btn.textContent = "复制"; }, 1400); }); }
          else { btn.textContent = "不可用"; }
        });
        wrap.appendChild(btn);
      }
      if (!pre.hasAttribute("data-nohl") && !codeEl.hasAttribute("data-hl")) {
        codeEl.innerHTML = highlight(codeEl.textContent);
        codeEl.setAttribute("data-hl", "1");
      }
    });
  }

  /* ---------- quiz ---------- */
  function initQuiz() {
    document.querySelectorAll(".quiz").forEach(function (quiz) {
      const opts = quiz.querySelectorAll(".quiz-opt");
      const exp = quiz.querySelector(".quiz-exp");
      opts.forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (quiz.dataset.answered) return;
          quiz.dataset.answered = "1";
          const correct = opt.dataset.correct === "1";
          opts.forEach(function (o) {
            o.disabled = true;
            if (o.dataset.correct === "1") o.classList.add("correct");
          });
          if (!correct) opt.classList.add("wrong");
          if (exp) exp.classList.add("show");
        });
      });
    });
  }

  /* ---------- mark complete ---------- */
  function initComplete() {
    const article = document.querySelector("article");
    if (!article) return;
    const cur = currentChapter();
    if (!cur) return;
    const wrap = document.createElement("div");
    wrap.style.cssText = "margin:34px 0 0;display:flex;justify-content:center";
    const btn = document.createElement("button");
    btn.className = "btn primary";
    btn.style.padding = "11px 22px";
    const p = getProgress();
    btn.textContent = p[cur] ? "✓ 已学完本篇（点击取消）" : "标记本篇为已学完";
    btn.addEventListener("click", function () {
      const prog = getProgress();
      if (prog[cur]) { delete prog[cur]; btn.textContent = "标记本篇为已学完"; btn.classList.remove("primary"); }
      else { prog[cur] = true; btn.textContent = "✓ 已学完本篇（点击取消）"; btn.classList.add("primary"); }
      setProgress(prog);
    });
    if (p[cur]) btn.classList.add("primary"); else btn.classList.remove("primary");
    wrap.appendChild(btn);
    const pager = document.getElementById("pager");
    if (pager && pager.parentNode) pager.parentNode.insertBefore(wrap, pager);
    else article.appendChild(wrap);
  }

  /* ---------- mark visited ---------- */
  function markVisited() {
    const cur = currentChapter();
    if (!cur) return;
    const prog = getProgress();
    if (!prog[cur]) {
      prog[cur] = true;
      setProgress(prog);
    }
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    const btn = document.getElementById("menuBtn");
    const scrim = document.getElementById("scrim");
    if (btn) btn.addEventListener("click", function () { document.body.classList.toggle("nav-open"); });
    if (scrim) scrim.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    const tb = document.getElementById("themeToggle");
    if (tb) tb.addEventListener("click", toggleTheme);
  }

  /* ---------- course map (index) ---------- */
  function buildCourseMap() {
    const host = document.getElementById("courseMap");
    if (!host) return;
    const prog = getProgress();
    let lastPart = "";
    let html = "";
    let open = false;
    CHAPTERS.forEach(function (c) {
      if (c.part !== lastPart) {
        if (open) html += "</div>";
        html += '<div class="part-title">' + c.part + '</div><div class="cards">';
        lastPart = c.part;
        open = true;
      }
      const done = prog[c.id] ? " done" : "";
      html += '<a class="ch-card' + done + '" href="' + c.file + '">' +
        '<div class="n">CH ' + c.num + "</div>" +
        '<h3>' + c.title + "</h3>" +
        "<p>" + c.sub + "</p>" +
        '<div class="status">✓ 已学</div></a>';
    });
    if (open) html += "</div>";
    host.innerHTML = html;

    // progress summary
    const total = CHAPTERS.length;
    const doneN = CHAPTERS.filter(function (c) { return prog[c.id]; }).length;
    const sum = document.getElementById("progressSummary");
    if (sum) {
      const pct = Math.round((doneN / total) * 100);
      sum.innerHTML = '<div class="bar" style="max-width:420px;margin:0 auto"><span class="seg-brand" style="width:' + pct + '%"></span></div>' +
        '<div style="text-align:center;margin-top:8px;color:var(--ink-3);font-size:13px">已学完 <b style="color:var(--ink)">' + doneN + "</b> / " + total + " 章 · " + pct + "%</div>";
    }
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildSidebar();
    buildCourseMap();
    buildPager();
    buildCrumb();
    markVisited();
    initNav();
    initReadingProgress();
    initQuiz();
    initComplete();
    initCode();
    buildToc();
    initReveal();
    if (window.DSH_DIAGRAMS) window.DSH_DIAGRAMS.init();
  });

  window.DSH = { chapters: CHAPTERS, getProgress: getProgress, setProgress: setProgress, highlight: highlight };
})();
