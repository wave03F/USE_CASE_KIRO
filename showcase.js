/* ============================================================
   showcase.js — render 32 UC ของ Landed-Cost Engine (ตัวอย่างจริง)
   ใช้ modal ตัวเดียวกับ app.js
   ============================================================ */

(function () {
  "use strict";
  if (typeof SHOWCASE_UC === "undefined") return;

  /* ---------- Intro / meta ---------- */
  document.getElementById("showcaseTitle").textContent = SHOWCASE_META.title;
  document.getElementById("showcaseSub").textContent = SHOWCASE_META.subtitle;
  document.getElementById("showcaseBlurb").textContent = SHOWCASE_META.blurb;

  const statsWrap = document.getElementById("showcaseStats");
  SHOWCASE_META.stats.forEach((s) => {
    const el = document.createElement("div");
    el.className = "sc-stat";
    el.innerHTML =
      '<span class="sc-stat-num">' + s.num + (s.suffix || "") + "</span>" +
      '<span class="sc-stat-label">' + s.label + "</span>";
    statsWrap.appendChild(el);
  });

  /* ---------- Filter ---------- */
  const filterBar = document.getElementById("showcaseFilter");
  const grid = document.getElementById("showcaseGrid");
  const filters = [{ key: "all", label: "ทั้งหมด" }].concat(
    Object.keys(SHOWCASE_MODULES).map((k) => ({ key: k, label: SHOWCASE_MODULES[k].label }))
  );
  let active = "all";

  filters.forEach((f) => {
    const b = document.createElement("button");
    b.className = "chip-filter" + (f.key === "all" ? " active" : "");
    b.textContent = f.label;
    b.addEventListener("click", () => {
      active = f.key;
      filterBar.querySelectorAll(".chip-filter").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      render();
    });
    filterBar.appendChild(b);
  });

  /* ---------- Cards ---------- */
  function render() {
    grid.innerHTML = "";
    const list = SHOWCASE_UC.filter((u) => active === "all" || u.module === active);
    list.forEach((u) => {
      const mod = SHOWCASE_MODULES[u.module];
      const card = document.createElement("article");
      card.className = "card uc-card accent-" + mod.color;
      card.innerHTML =
        '<div class="uc-top">' +
        '<span class="uc-id">' + u.id + "</span>" +
        '<span class="uc-badge badge-' + mod.color + '">' + mod.label + "</span>" +
        "</div>" +
        "<h3>" + u.name + "</h3>" +
        '<p class="uc-desc">' + u.description + "</p>" +
        '<div class="uc-foot">' +
        '<span class="uc-actor">👤 ' + u.actor + "</span>" +
        '<span class="prio prio-' + prioClass(u.priority) + '">' + u.priority + "</span>" +
        "</div>" +
        '<span class="uc-more">ดูรายละเอียดเต็ม →</span>';
      card.addEventListener("click", () => openModal(u, mod));
      grid.appendChild(card);
    });
  }

  function prioClass(p) {
    const k = p.toLowerCase();
    return k === "critical" ? "critical" : k;
  }

  /* ---------- Modal (reuse existing #modal / #modalBody) ---------- */
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");

  function ul(items) {
    if (!items || !items.length) return '<p class="modal-empty">—</p>';
    return "<ul>" + items.map((i) => "<li>" + i + "</li>").join("") + "</ul>";
  }
  function ol(items) {
    if (!items || !items.length) return '<p class="modal-empty">—</p>';
    return "<ol>" + items.map((i) => "<li>" + i + "</li>").join("") + "</ol>";
  }
  function block(t, b) {
    return '<div class="modal-block"><h4>' + t + "</h4>" + b + "</div>";
  }

  function openModal(u, mod) {
    modalBody.innerHTML =
      '<div class="modal-head">' +
      '<span class="uc-badge badge-' + mod.color + '">' + mod.label + "</span>" +
      '<span class="prio prio-' + prioClass(u.priority) + '">Priority: ' + u.priority + "</span>" +
      "</div>" +
      '<h2 class="modal-title"><span class="modal-uc-id">' + u.id + "</span> " + u.name + "</h2>" +
      '<p class="modal-actor">👤 <b>Actor:</b> ' + u.actor + "</p>" +
      '<p class="modal-descr">' + u.description + "</p>" +
      block("Preconditions", ul(u.pre)) +
      block("Main Flow", ol(u.main)) +
      block("Alternative Flow", ul(u.alt)) +
      block("Exception Flow", ul(u.exc)) +
      block("Postconditions", ul(u.post)) +
      block("Business Rules", ul(u.rules)) +
      '<div class="ears-box"><span class="ears-label">EARS Requirement</span><p>' + u.ears + "</p></div>";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  /* ---------- Summary table ---------- */
  const tbody = document.querySelector("#showcaseTable tbody");
  SHOWCASE_UC.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td><b>" + u.id + "</b></td>" +
      "<td>" + u.name + "</td>" +
      "<td>" + u.actor + "</td>" +
      "<td>" + SHOWCASE_MODULES[u.module].label + "</td>" +
      '<td><span class="prio prio-' + prioClass(u.priority) + '">' + u.priority + "</span></td>";
    tbody.appendChild(tr);
  });

  /* ---------- Reveal + count-up for showcase stats ---------- */
  const scStats = document.querySelectorAll(".sc-stat-num");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent;
      const target = parseInt(raw, 10);
      if (isNaN(target)) { io.unobserve(el); return; }
      const suffix = raw.replace(/[0-9]/g, "");
      let cur = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = cur + suffix;
      }, 25);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  scStats.forEach((s) => io.observe(s));

  render();
})();
