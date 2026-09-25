/* ============================================================
   lab.js — เนื้อหา Lab + interaction (copy prompt, timeline)
   ============================================================ */

const STEPS = [
  {
    n: 1,
    tag: "Spec",
    title: "บอก Kiro ว่าอยากได้อะไร (สร้าง Spec)",
    desc: "เริ่มจากเล่าไอเดียเป็นภาษาคน Kiro จะเปลี่ยนให้เป็นเอกสาร requirements ที่ชัดเจน นี่คือหัวใจของ Spec-Driven Development",
    prompt:
      "อยากได้เว็บ Pomodoro Timer แบบ single page ใช้ HTML/CSS/JS ล้วน ไม่ต้องมี framework\n" +
      "ความสามารถที่ต้องการ:\n" +
      "- นับถอยหลังโหมดโฟกัส 25 นาที และโหมดพัก 5 นาที\n" +
      "- ปุ่ม Start, Pause, Reset\n" +
      "- พอหมดเวลาให้สลับโหมดอัตโนมัติและมีเสียงเตือน\n" +
      "- แสดงจำนวนรอบ (pomodoro) ที่ทำเสร็จ\n" +
      "ช่วยสร้าง spec (requirements) ให้ก่อน ยังไม่ต้องเขียนโค้ด",
    expect: "Kiro สร้างเอกสาร requirements เป็นข้อ ๆ (มักอยู่ใน .kiro/specs/) พร้อมถามยืนยันก่อนไปต่อ"
  },
  {
    n: 2,
    tag: "Design",
    title: "ให้ Kiro ออกแบบวิธีทำ (Design)",
    desc: "เมื่อ requirements ตรงใจแล้ว ให้ Kiro วางแผนการออกแบบ เช่น โครงไฟล์ โครงสร้างข้อมูล และ logic การนับเวลา",
    prompt:
      "requirements โอเคแล้ว ช่วยทำเอกสาร design ต่อ\n" +
      "อยากให้แยกเป็น 3 ไฟล์: index.html, styles.css, app.js\n" +
      "อธิบายด้วยว่าจะจับเวลายังไง (ใช้ setInterval), เก็บ state อะไรบ้าง และสลับโหมดยังไง",
    expect: "Kiro สร้างเอกสาร design อธิบายโครงสร้างไฟล์ + state + flow การทำงาน"
  },
  {
    n: 3,
    tag: "Tasks",
    title: "แตกงานเป็น Task List",
    desc: "Kiro แปลง design เป็นรายการงานย่อยที่ทำทีละขั้น ทำให้เห็นความคืบหน้าและควบคุมได้",
    prompt:
      "design โอเค ช่วยแตกเป็น task list ที่ทำทีละขั้นได้\n" +
      "เรียงลำดับให้เริ่มจากโครง HTML → หน้าตา CSS → logic การจับเวลา → เสียงเตือนและนับรอบ",
    expect: "Kiro สร้าง task list เรียงลำดับ แต่ละ task ผูกกับ requirement และเลือกให้ทำทีละอันได้"
  },
  {
    n: 4,
    tag: "Code",
    title: "ให้ Kiro ลงมือสร้างโค้ด",
    desc: "สั่งให้ Kiro ทำ task แรก แล้วไล่ไปทีละอัน Kiro จะเขียนโค้ด รันตรวจ และรายงานผลให้",
    prompt:
      "เริ่มทำ task แรกได้เลย แล้วทำต่อไปทีละ task จนครบ\n" +
      "ทำเสร็จแต่ละ task ช่วยสรุปสั้น ๆ ว่าแก้ไฟล์ไหนไปบ้าง",
    expect: "Kiro สร้าง index.html / styles.css / app.js ให้ครบ ทำงานได้ พร้อมทยอยติ๊ก task ที่เสร็จ"
  },
  {
    n: 5,
    tag: "Steering",
    title: "ตั้งมาตรฐานให้ Kiro จำ (Steering)",
    desc: "Steering คือกฎที่ Kiro จะจำและใช้ทุกครั้ง เหมาะกับ coding style หรือข้อกำหนดของทีม ลองตั้งดูสัก 1 ข้อ",
    prompt:
      "ช่วยสร้าง steering file ที่บอกว่า:\n" +
      "- โค้ดทุกไฟล์ต้องมีคอมเมนต์ภาษาไทยอธิบายส่วนสำคัญ\n" +
      "- ใช้สีธีมม่วง (#7c5cff) เป็นสีหลักของปุ่ม\n" +
      "แล้วปรับเว็บ Pomodoro ให้เข้ากับกฎนี้",
    expect: "Kiro สร้างไฟล์ใน .kiro/steering/ และปรับโค้ดให้ตรงกฎ ครั้งต่อ ๆ ไปมันจะจำกฎนี้เอง"
  },
  {
    n: 6,
    tag: "Hook",
    title: "ทำงานอัตโนมัติด้วย Agent Hook",
    desc: "Hook ให้ Kiro ทำงานเองเมื่อเกิดเหตุการณ์ เช่น ทุกครั้งที่บันทึกไฟล์ ลองสร้าง hook ตรวจโค้ดอัตโนมัติ",
    prompt:
      "ช่วยสร้าง Agent Hook ที่ทำงานทุกครั้งที่ผมบันทึกไฟล์ .js\n" +
      "ให้ตรวจว่าโค้ดมี console.log ที่ลืมลบไหม แล้วเตือนผม",
    expect: "Kiro สร้างไฟล์ hook ใน .kiro/hooks/ พอบันทึกไฟล์ .js hook จะทำงานตามที่ตั้งไว้"
  }
];

const BONUS = [
  { ico: "🌙", title: "โหมดมืด/สว่าง", text: "ขอให้ Kiro เพิ่มปุ่มสลับ Dark/Light mode และจำค่าที่เลือกไว้ใน localStorage" },
  { ico: "⏱️", title: "ปรับเวลาได้เอง", text: "ให้ผู้ใช้ตั้งเวลาโฟกัส/พักเองได้ แทนที่จะ fix 25/5 นาที" },
  { ico: "📊", title: "สถิติรายวัน", text: "เก็บจำนวน pomodoro ที่ทำในแต่ละวัน แล้วโชว์เป็นกราฟง่าย ๆ" },
  { ico: "🔔", title: "แจ้งเตือนเบราว์เซอร์", text: "ใช้ Notification API เด้งแจ้งเตือนเมื่อหมดเวลา แม้สลับแท็บอยู่" }
];

(function () {
  "use strict";

  /* ---------- Render steps ---------- */
  const tl = document.getElementById("timeline");
  STEPS.forEach((s) => {
    const item = document.createElement("div");
    item.className = "tl-item";
    item.innerHTML =
      '<div class="tl-marker"><span class="tl-num">' + s.n + "</span></div>" +
      '<div class="tl-card card">' +
      '<div class="tl-head">' +
      '<span class="tl-tag">' + s.tag + "</span>" +
      "<h3>" + s.title + "</h3>" +
      "</div>" +
      '<p class="tl-desc">' + s.desc + "</p>" +
      '<div class="prompt-box">' +
      '<div class="prompt-bar"><span>Prompt สำหรับวางใน Kiro</span>' +
      '<button class="copy-btn" data-prompt="' + encodeURIComponent(s.prompt) + '">คัดลอก</button></div>' +
      "<pre class=\"prompt-text\">" + escapeHtml(s.prompt) + "</pre>" +
      "</div>" +
      '<div class="expect"><span class="expect-label">สิ่งที่ควรเห็น</span>' + s.expect + "</div>" +
      "</div>";
    tl.appendChild(item);
  });

  /* ---------- Render bonus ---------- */
  const bg = document.getElementById("bonusGrid");
  BONUS.forEach((b) => {
    const el = document.createElement("article");
    el.className = "card bonus-card";
    el.innerHTML =
      '<div class="bonus-ico">' + b.ico + "</div>" +
      "<h3>" + b.title + "</h3>" +
      "<p>" + b.text + "</p>";
    bg.appendChild(el);
  });

  /* ---------- Copy buttons ---------- */
  const toast = document.getElementById("toast");
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const text = decodeURIComponent(btn.dataset.prompt);
    copyText(text).then(() => {
      btn.textContent = "คัดลอกแล้ว ✓";
      showToast();
      setTimeout(() => (btn.textContent = "คัดลอก"), 1600);
    });
  });

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }
  let toastTimer;
  function showToast() {
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- Scroll progress ---------- */
  const progress = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  });

  /* ---------- Reveal + smooth scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".tl-item, .bonus-card, .callout, .section-head").forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth" }); }
      }
    });
  });
})();
