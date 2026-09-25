/* ============================================================
   app.js — render ข้อมูล Use Case + interaction
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Actors ---------- */
  const actorGrid = document.getElementById("actorGrid");
  ACTORS.forEach((a) => {
    const el = document.createElement("article");
    el.className = "card actor-card";
    el.innerHTML =
      '<div class="actor-icon">' + a.icon + "</div>" +
      '<div class="actor-meta">' +
      '<h3>' + a.name + "</h3>" +
      '<span class="tag tag-' + typeClass(a.type) + '">' + a.type + "</span>" +
      "</div>" +
      "<p>" + a.desc + "</p>";
    actorGrid.appendChild(el);
  });

  function typeClass(t) {
    if (t === "Human") return "human";
    if (t === "AI Agent") return "ai";
    return "ext";
  }

  /* ---------- Filter bar ---------- */
  const filterBar = document.getElementById("filterBar");
  const ucGrid = document.getElementById("ucGrid");
  const filters = [{ key: "all", label: "ทั้งหมด" }].concat(
    Object.keys(MODULES).map((k) => ({ key: k, label: MODULES[k].label }))
  );
  let activeFilter = "all";

  filters.forEach((f) => {
    const b = document.createElement("button");
    b.className = "chip-filter" + (f.key === "all" ? " active" : "");
    b.textContent = f.label;
    b.dataset.key = f.key;
    b.addEventListener("click", () => {
      activeFilter = f.key;
      document.querySelectorAll(".chip-filter").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderUseCases();
    });
    filterBar.appendChild(b);
  });

  /* ---------- Use case cards ---------- */
  function renderUseCases() {
    ucGrid.innerHTML = "";
    const list = USECASES.filter((u) => activeFilter === "all" || u.module === activeFilter);
    list.forEach((u) => {
      const mod = MODULES[u.module];
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
        '<span class="prio prio-' + u.priority.toLowerCase() + '">' + u.priority + "</span>" +
        "</div>" +
        '<span class="uc-more">ดูรายละเอียดเต็ม →</span>';
      card.addEventListener("click", () => openModal(u));
      ucGrid.appendChild(card);
    });
  }
  renderUseCases();

  /* ---------- Modal ---------- */
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");

  function list(items) {
    return "<ul>" + items.map((i) => "<li>" + i + "</li>").join("") + "</ul>";
  }
  function olist(items) {
    return "<ol>" + items.map((i) => "<li>" + i + "</li>").join("") + "</ol>";
  }

  function openModal(u) {
    const mod = MODULES[u.module];
    modalBody.innerHTML =
      '<div class="modal-head">' +
      '<span class="uc-badge badge-' + mod.color + '">' + mod.label + "</span>" +
      '<span class="prio prio-' + u.priority.toLowerCase() + '">Priority: ' + u.priority + "</span>" +
      "</div>" +
      '<h2 class="modal-title"><span class="modal-uc-id">' + u.id + "</span> " + u.name + "</h2>" +
      '<p class="modal-actor">👤 <b>Actor:</b> ' + u.actor + "</p>" +
      '<p class="modal-descr">' + u.description + "</p>" +
      block("Preconditions", list(u.pre)) +
      block("Main Flow", olist(u.main)) +
      block("Alternative Flow", list(u.alt)) +
      block("Exception Flow", list(u.exc)) +
      block("Postconditions", list(u.post)) +
      block("Business Rules", list(u.rules)) +
      '<div class="ears-box"><span class="ears-label">EARS Requirement</span><p>' + u.ears + "</p></div>";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function block(title, body) {
    return '<div class="modal-block"><h4>' + title + "</h4>" + body + "</div>";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Diagram ---------- */
  const diagramActors = document.getElementById("diagramActors");
  ACTORS.forEach((a) => {
    const el = document.createElement("div");
    el.className = "d-actor";
    el.innerHTML = '<span class="d-actor-ic">' + a.icon + "</span>" + a.name;
    diagramActors.appendChild(el);
  });
  const diagramUsecases = document.getElementById("diagramUsecases");
  USECASES.forEach((u) => {
    const el = document.createElement("div");
    el.className = "d-uc accent-" + MODULES[u.module].color;
    el.innerHTML = '<span class="d-uc-id">' + u.id + "</span>" + u.name;
    diagramUsecases.appendChild(el);
  });

  /* ---------- Summary table ---------- */
  const tbody = document.querySelector("#summaryTable tbody");
  USECASES.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td><b>" + u.id + "</b></td>" +
      "<td>" + u.name + "</td>" +
      "<td>" + u.actor + "</td>" +
      "<td>" + MODULES[u.module].label + "</td>" +
      '<td><span class="prio prio-' + u.priority.toLowerCase() + '">' + u.priority + "</span></td>";
    tbody.appendChild(tr);
  });

  /* ---------- Scroll progress ---------- */
  const progress = document.getElementById("scrollProgress");
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = scrolled + "%";
    nav.classList.toggle("scrolled", h.scrollTop > 20);
  });

  /* ---------- Count-up stats ---------- */
  const stats = document.querySelectorAll(".stat-num");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      let cur = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) {
          cur = target;
          clearInterval(timer);
        }
        el.textContent = cur + suffix;
      }, 25);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach((s) => io.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".card, .section-head, .diagram-wrap, .table-wrap");
  const revObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        revObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => {
    el.classList.add("reveal");
    revObserver.observe(el);
  });

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
})();
