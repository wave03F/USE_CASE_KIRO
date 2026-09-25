/* ============================================================
   lab.js — router สำหรับหน้า Lab
   - ไม่มี ?lab=  → แสดง catalog (เลือกจาก 5 Lab)
   - มี ?lab=key → แสดงรายละเอียด Lab นั้น (steps + bonus)
   ============================================================ */

(function () {
  "use strict";

  const root = document.getElementById("labRoot");
  const labNav = document.getElementById("labNav");
  const params = new URLSearchParams(location.search);
  const key = params.get("lab");

  if (key && LABS[key]) {
    renderDetail(key, LABS[key]);
  } else {
    renderCatalog();
  }

  fillIcons();
  bindCopy();
  bindProgress();
  bindReveal();
  bindSmoothScroll();

  /* ============================================================
     Catalog view — เลือก Lab
     ============================================================ */
  function renderCatalog() {
    labNav.innerHTML =
      '<a href="index.html">← กลับหน้าหลัก</a>';

    let cards = "";
    LAB_ORDER.forEach(function (k) {
      const lab = LABS[k];
      cards +=
        '<a class="card lab-pick" href="lab.html?lab=' + k + '">' +
        '<div class="lab-pick-top">' +
        '<span class="lab-pick-ico" data-icon="' + lab.icon + '"></span>' +
        '<span class="lab-pick-badges">' +
        '<span class="lab-badge lab-badge-' + levelClass(lab.level) + '">' + lab.level + "</span>" +
        '<span class="lab-badge lab-badge-tag">' + lab.tag + "</span>" +
        "</span>" +
        "</div>" +
        "<h3>" + lab.title + "</h3>" +
        '<p class="lab-pick-tag">' + lab.tagline + "</p>" +
        '<div class="lab-pick-foot">' +
        '<span class="lab-time"><span data-icon="timer"></span>' + lab.time + "</span>" +
        '<span class="lab-pick-go">เริ่มทำ<span data-icon="arrowRight"></span></span>' +
        "</div>" +
        "</a>";
    });

    root.innerHTML =
      '<section class="hero lab-hero" id="top">' +
      '<div class="hero-glow" aria-hidden="true"></div>' +
      '<div class="container hero-inner">' +
      '<span class="pill"><span class="pill-dot"></span> Hands-on Labs · ลงมือทำจริงกับ Kiro</span>' +
      '<h1 class="hero-title">เลือก Lab ที่อยากลอง<br />แล้วสร้างของจริงไปกับ <span class="grad-text">Kiro</span></h1>' +
      '<p class="hero-sub">แต่ละ Lab พาคุณเดินตาม Spec-Driven Development ครบทุกขั้น พร้อม prompt สำเร็จรูปที่กดคัดลอกไปวางใน Kiro ได้เลย ไม่ต้องเขียนโค้ดเอง</p>' +
      "</div></section>" +
      '<section class="section"><div class="container">' +
      '<div class="section-head"><span class="eyebrow">เลือกได้ ' + LAB_ORDER.length + ' รูปแบบ</span>' +
      "<h2>Labs ทั้งหมด</h2>" +
      '<p class="section-desc">ตั้งแต่เว็บแอปเบา ๆ ไปจนถึง REST API ฝั่ง backend เลือกตามความสนใจหรือระดับได้เลย</p></div>' +
      '<div class="grid grid-3 lab-catalog">' + cards + "</div>" +
      "</div></section>" +
      ctaBlock();
  }

  /* ============================================================
     Detail view — รายละเอียด Lab
     ============================================================ */
  function renderDetail(k, lab) {
    labNav.innerHTML =
      '<a href="lab.html">Labs ทั้งหมด</a>' +
      '<a href="index.html">← กลับหน้าหลัก</a>';

    // goal chips อิงเป้าหมายมาตรฐานของทุก Lab
    const goals =
      '<div class="lab-goal">' +
      '<div class="lab-goal-item"><span class="lab-goal-ico" data-icon="target"></span> ได้ ' + lab.title + " ที่ใช้ได้จริง</div>" +
      '<div class="lab-goal-item"><span class="lab-goal-ico" data-icon="brain"></span> เข้าใจ workflow ของ Kiro</div>' +
      '<div class="lab-goal-item"><span class="lab-goal-ico" data-icon="keyboard"></span> เขียนโค้ดเองน้อยที่สุด</div>' +
      "</div>";

    const previewBtn = lab.preview
      ? '<a href="' + lab.preview + '" target="_blank" class="btn btn-ghost">เปิดดูผลลัพธ์ตัวอย่าง</a>'
      : "";

    // steps
    let steps = "";
    lab.steps.forEach(function (s, i) {
      steps +=
        '<div class="tl-item">' +
        '<div class="tl-marker"><span class="tl-num">' + (i + 1) + "</span></div>" +
        '<div class="tl-card card">' +
        '<div class="tl-head"><span class="tl-tag">' + s.tag + "</span><h3>" + s.title + "</h3></div>" +
        '<p class="tl-desc">' + s.desc + "</p>" +
        '<div class="prompt-box"><div class="prompt-bar"><span>Prompt สำหรับวางใน Kiro</span>' +
        '<button class="copy-btn" data-prompt="' + encodeURIComponent(s.prompt) + '">คัดลอก</button></div>' +
        '<pre class="prompt-text">' + escapeHtml(s.prompt) + "</pre></div>" +
        '<div class="expect"><span class="expect-label">สิ่งที่ควรเห็น</span>' + s.expect + "</div>" +
        "</div></div>";
    });

    // bonus
    let bonus = "";
    lab.bonus.forEach(function (b) {
      bonus +=
        '<article class="card bonus-card">' +
        '<div class="bonus-ico" data-icon="' + b.ico + '"></div>' +
        "<h3>" + b.title + "</h3><p>" + b.text + "</p></article>";
    });

    root.innerHTML =
      // hero
      '<section class="hero lab-hero" id="top">' +
      '<div class="hero-glow" aria-hidden="true"></div>' +
      '<div class="container hero-inner">' +
      '<a class="back-link" href="lab.html"><span data-icon="arrowRight" class="flip"></span> Labs ทั้งหมด</a>' +
      '<span class="pill"><span class="pill-dot"></span> Hands-on Lab · ' + lab.level + " · ~" + lab.time + "</span>" +
      '<h1 class="hero-title">สร้าง <span class="grad-text">' + lab.title + "</span><br />ด้วย Kiro แบบ Spec-Driven</h1>" +
      '<p class="hero-sub">' + lab.tagline + " — ลงมือทำจริงตั้งแต่ต้นจนจบ แค่คุยกับ Kiro เป็นภาษาคน</p>" +
      '<div class="hero-cta"><a href="#steps" class="btn btn-primary">เริ่ม Lab</a>' + previewBtn + "</div>" +
      goals +
      "</div></section>" +
      // intro callout
      '<section class="section"><div class="container narrow">' +
      '<div class="callout"><h3><span class="callout-ico" data-icon="' + lab.icon + '"></span>โจทย์ของเรา: ' + lab.title + "</h3>" +
      "<p>" + lab.intro + "</p></div></div></section>" +
      // prerequisites (ใช้ร่วมทุก Lab)
      '<section class="section section-alt" id="prereq"><div class="container narrow">' +
      '<div class="section-head left"><span class="eyebrow">ก่อนเริ่ม</span><h2>เตรียมตัว 3 อย่าง</h2></div>' +
      '<ol class="prep-list">' +
      "<li><b>ติดตั้ง Kiro</b> — เปิด Kiro IDE ให้พร้อม (ยังไม่มี ดูวิธีสมัครฟรีที่หน้าหลัก)</li>" +
      "<li><b>สร้างโฟลเดอร์ว่าง</b> — เช่น <code>" + k + "-lab</code> แล้วเปิดเป็น workspace ใน Kiro</li>" +
      "<li><b>เปิด Chat ของ Kiro</b> — เราจะพิมพ์คุยกับ Kiro ทั้งหมดจากตรงนี้</li>" +
      "</ol>" +
      '<div class="tip"><span class="tip-badge">เคล็ดลับ</span> แต่ละขั้นมีปุ่ม <b>คัดลอก prompt</b> กดแล้ววางใน Chat ของ Kiro ได้เลย ปรับแก้คำได้ตามใจ</div>' +
      "</div></section>" +
      // steps
      '<section class="section" id="steps"><div class="container">' +
      '<div class="section-head"><span class="eyebrow">ลงมือทำ</span><h2>' + lab.steps.length + " ขั้นตอน จากไอเดีย → ของจริงที่รันได้</h2>" +
      '<p class="section-desc">ทำทีละขั้น กดคัดลอก prompt วางใน Kiro แล้วดูมันทำงาน</p></div>' +
      '<div class="timeline">' + steps + "</div>" +
      "</div></section>" +
      // bonus
      '<section class="section section-alt" id="bonus"><div class="container narrow">' +
      '<div class="section-head left"><span class="eyebrow">อยากท้าทายต่อ</span><h2>โจทย์ต่อยอด (Bonus)</h2>' +
      '<p class="section-desc">ลองสั่ง Kiro เพิ่มฟีเจอร์เหล่านี้ ดูว่ามันต่อยอดจาก spec เดิมได้เร็วแค่ไหน</p></div>' +
      '<div class="grid grid-2 bonus-grid">' + bonus + "</div>" +
      "</div></section>" +
      // next labs
      nextLabsBlock(k) +
      ctaBlock();
  }

  /* ---------- แนะนำ Lab อื่นท้ายหน้า detail ---------- */
  function nextLabsBlock(current) {
    const others = LAB_ORDER.filter((x) => x !== current).slice(0, 3);
    let cards = "";
    others.forEach(function (k) {
      const lab = LABS[k];
      cards +=
        '<a class="card lab-mini" href="lab.html?lab=' + k + '">' +
        '<span class="lab-mini-ico" data-icon="' + lab.icon + '"></span>' +
        "<div><h4>" + lab.title + "</h4><span>" + lab.level + " · " + lab.tag + "</span></div>" +
        "</a>";
    });
    return (
      '<section class="section"><div class="container">' +
      '<div class="section-head"><span class="eyebrow">ทำต่อได้เลย</span><h2>ลอง Lab อื่น</h2></div>' +
      '<div class="grid grid-3 lab-mini-grid">' + cards + "</div>" +
      "</div></section>"
    );
  }

  function ctaBlock() {
    return (
      '<section class="cta"><div class="container cta-inner">' +
      "<h2>ชอบ Lab นี้ไหม? นี่คือแค่จุดเริ่มต้น</h2>" +
      "<p>ลองนึกภาพทีมคุณสร้างระบบจริงระดับองค์กรด้วยวิธีเดียวกันนี้ — เริ่มฟรีได้เลย หรือคุยกับทีมเรา</p>" +
      '<div class="hero-cta"><a href="index.html#getstarted" class="btn btn-primary">ดูทางเลือกเริ่มต้นใช้งาน</a>' +
      '<a href="index.html#showcase" class="btn btn-ghost">ดูตัวอย่างระบบจริง</a></div>' +
      "</div></section>"
    );
  }

  /* ============================================================
     Helpers
     ============================================================ */
  function levelClass(level) {
    return level.indexOf("กลาง") >= 0 ? "mid" : "basic";
  }

  function fillIcons() {
    document.querySelectorAll("[data-icon]").forEach(function (el) {
      el.innerHTML = icon(el.dataset.icon);
    });
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- Copy ---------- */
  function bindCopy() {
    const toast = document.getElementById("toast");
    let toastTimer;
    document.addEventListener("click", function (e) {
      const btn = e.target.closest(".copy-btn");
      if (!btn) return;
      const text = decodeURIComponent(btn.dataset.prompt);
      copyText(text).then(function () {
        btn.innerHTML = icon("check", "ic-sm") + "คัดลอกแล้ว";
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1600);
        setTimeout(function () { btn.textContent = "คัดลอก"; }, 1600);
      });
    });
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- Scroll progress ---------- */
  function bindProgress() {
    const progress = document.getElementById("scrollProgress");
    window.addEventListener("scroll", function () {
      const h = document.documentElement;
      progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
    });
  }

  /* ---------- Reveal ---------- */
  function bindReveal() {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".tl-item, .bonus-card, .callout, .section-head, .lab-pick, .lab-mini").forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* ---------- Smooth scroll ---------- */
  function bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        const id = a.getAttribute("href");
        if (id.length > 1) {
          const t = document.querySelector(id);
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
        }
      });
    });
  }
})();
