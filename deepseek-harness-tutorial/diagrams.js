/* DeepSeek Harness 教程 · 交互图示 */
(function () {
  "use strict";

  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- sequence player ---------- */
  function initSeq(root) {
    const rows = qsa(".seq-row", root);
    const note = root.querySelector(".seq-note");
    const count = root.querySelector(".seq-count");
    let i = -1, timer = null;

    function render() {
      rows.forEach(function (r, k) {
        r.classList.toggle("on", k <= i);
      });
      if (note && i >= 0 && i < rows.length) note.textContent = rows[i].dataset.note || "";
      if (note && i < 0) note.textContent = "点击「下一步」或「播放」开始。";
      if (count) count.textContent = (i + 1) + " / " + rows.length;
    }
    function next() { if (i < rows.length - 1) { i++; render(); } else stop(); }
    function prev() { if (i >= 0) { i--; render(); } }
    function stop() { if (timer) { clearInterval(timer); timer = null; } const b = root.querySelector('[data-act="play"]'); if (b) b.textContent = "▶ 播放"; }
    function play() {
      if (timer) { stop(); return; }
      if (i >= rows.length - 1) i = -1;
      const b = root.querySelector('[data-act="play"]');
      if (b) b.textContent = "⏸ 暂停";
      next();
      timer = setInterval(function () {
        if (i >= rows.length - 1) stop();
        else next();
      }, 1400);
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const act = b.dataset.act;
      if (act === "next") { stop(); next(); }
      else if (act === "prev") { stop(); prev(); }
      else if (act === "play") play();
      else if (act === "reset") { stop(); i = -1; render(); }
    });
    render();
  }

  /* ---------- stepper ---------- */
  function initStepper(root) {
    const items = qsa(".step-item", root);
    const detail = root.querySelector(".step-detail");
    if (!detail || !items.length) return;
    function select(k) {
      items.forEach(function (it, j) {
        it.classList.toggle("active", j === k);
        it.classList.toggle("done", j < k);
      });
      const it = items[k];
      const title = it.dataset.title || it.textContent.trim();
      const code = it.dataset.code || "";
      const tag = it.dataset.tag || "";
      const desc = it.dataset.desc || "";
      detail.innerHTML =
        '<div class="sd-kicker">STEP ' + (k + 1) + " / " + items.length + "</div>" +
        "<h4>" + title + "</h4>" +
        "<div>" + desc + "</div>" +
        (code ? '<div class="sd-code">' + code.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</div>" : "") +
        (tag ? '<div class="sd-tag">' + tag + "</div>" : "");
      const idx = root.querySelector(".st-index");
      if (idx) idx.textContent = (k + 1) + " / " + items.length;
    }
    items.forEach(function (it, k) {
      it.addEventListener("click", function () { select(k); });
    });
    root.addEventListener("click", function (e) {
      const b = e.target.closest("[data-sact]");
      if (!b) return;
      let cur = items.findIndex(function (x) { return x.classList.contains("active"); });
      if (cur < 0) cur = 0;
      if (b.dataset.sact === "next") select(Math.min(items.length - 1, cur + 1));
      if (b.dataset.sact === "prev") select(Math.max(0, cur - 1));
      if (b.dataset.sact === "reset") select(0);
    });
    select(0);
  }

  /* ---------- stream animation ---------- */
  function initStream(root) {
    const chunks = qsa(".stream-chunk", root);
    let timer = null;
    function reset() { if (timer) clearInterval(timer); timer = null; chunks.forEach(function (c) { c.classList.remove("on"); }); }
    function run() {
      reset();
      let k = 0;
      timer = setInterval(function () {
        if (k >= chunks.length) { clearInterval(timer); timer = null; return; }
        chunks[k].classList.add("on");
        k++;
      }, 520);
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "run") run();
      if (b.dataset.act === "reset-stream") reset();
    });
    reset();
  }

  /* ---------- compaction animation ---------- */
  function initCompact(root) {
    const cells = qsa(".tokgrid .tk", root);
    const out = root.querySelector(".compact-stat");
    root.addEventListener("click", function (e) {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "compact") {
        let drop = Math.floor(cells.length * 0.62);
        cells.forEach(function (c, k) { if (k < drop) c.classList.add("drop"); });
        const sum = cells[cells.length - drop - 1];
        if (sum) sum.classList.add("sum");
        if (out) out.textContent = "压缩后：保留最近 " + (cells.length - drop) + " 个单元 + 1 条摘要（约 ↓" + Math.round((drop / cells.length) * 100) + "% 上下文）";
      } else if (b.dataset.act === "restore") {
        cells.forEach(function (c) { c.classList.remove("drop"); c.classList.remove("sum"); });
        if (out) out.textContent = "压缩前：全部历史都在请求里";
      }
    });
  }

  /* ---------- staged layers ---------- */
  function initLayers(root) {
    const layers = qsa(".layer", root);
    layers.forEach(function (l) { l.classList.add("dim"); });
    let k = -1;
    function step() {
      k++;
      if (k < layers.length) {
        layers[k].classList.remove("dim");
        layers[k].classList.add("flash");
        setTimeout(function () { layers[k] && layers[k].classList.remove("flash"); }, 700);
      }
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "build") { layers.forEach(function (l) { l.classList.add("dim"); l.classList.remove("brand", "teal", "amber"); }); k = -1; step(); }
      if (b.dataset.act === "next-layer") step();
      if (b.dataset.act === "show-all") layers.forEach(function (l) { l.classList.remove("dim"); });
    });
    // reveal all by default so content is readable without interaction
    setTimeout(function () { layers.forEach(function (l) { l.classList.remove("dim"); }); }, 400);
  }

  /* ---------- playable vertical flow ---------- */
  function initPlayflow(root) {
    const steps = qsa(".play-step", root);
    if (!steps.length) return;
    steps.forEach(function (s) { s.style.opacity = "0.22"; s.style.transform = "translateX(-6px)"; s.style.transition = ".35s"; });
    let i = -1, timer = null;
    function reset() { if (timer) clearInterval(timer); timer = null; steps.forEach(function (s) { s.style.opacity = "0.22"; s.style.transform = "translateX(-6px)"; }); i = -1; }
    function next() {
      if (i < steps.length - 1) {
        i++;
        steps[i].style.opacity = "1";
        steps[i].style.transform = "none";
        steps[i].scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else { if (timer) { clearInterval(timer); timer = null; } }
    }
    root.addEventListener("click", function (e) {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "pf-next") next();
      else if (b.dataset.act === "pf-reset") reset();
      else if (b.dataset.act === "pf-play") { reset(); timer = setInterval(next, 1300); next(); }
    });
  }

  /* ---------- clickable flow nodes ---------- */
  function initNodes(root) {
    const nodes = qsa(".node.clickable", root);
    const out = root.querySelector(".node-detail");
    nodes.forEach(function (n) {
      n.addEventListener("click", function () {
        nodes.forEach(function (x) { x.classList.remove("sel"); });
        n.classList.add("sel");
        if (out) {
          out.innerHTML = '<div class="sd-kicker">' + (n.dataset.kicker || "组件") + "</div><h4>" + (n.dataset.title || n.textContent.trim()) + "</h4><div>" + (n.dataset.desc || "") + "</div>" + (n.dataset.code ? '<div class="sd-code">' + n.dataset.code.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</div>" : "");
        }
      });
    });
  }

  function init() {
    qsa('[data-widget="seq"]').forEach(initSeq);
    qsa('[data-widget="stepper"]').forEach(initStepper);
    qsa('[data-widget="stream"]').forEach(initStream);
    qsa('[data-widget="compact"]').forEach(initCompact);
    qsa('[data-widget="layers"]').forEach(initLayers);
    qsa('[data-widget="playflow"]').forEach(initPlayflow);
    qsa('[data-widget="nodes"]').forEach(initNodes);
  }

  window.DSH_DIAGRAMS = { init: init };
})();
