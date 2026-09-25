/* ============================================================
   Pomodoro Timer — logic (ตัวอย่างผลลัพธ์จาก Kiro Lab)
   ============================================================ */

// ค่าเวลาของแต่ละโหมด (วินาที)
const DURATIONS = { focus: 25 * 60, break: 5 * 60 };

// state หลักของแอป
let mode = "focus";        // โหมดปัจจุบัน: focus / break
let remaining = DURATIONS[mode]; // เวลาที่เหลือ (วินาที)
let timerId = null;        // id ของ setInterval
let running = false;       // กำลังนับอยู่หรือไม่
let rounds = 0;            // จำนวนรอบโฟกัสที่ทำเสร็จ

// อ้างอิง element
const clockEl = document.getElementById("clock");
const modeLabelEl = document.getElementById("modeLabel");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const roundsEl = document.getElementById("rounds");
const tabs = document.querySelectorAll(".mode-tab");

// แปลงวินาทีเป็นรูปแบบ mm:ss
function format(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return m + ":" + s;
}

// อัปเดตหน้าจอนาฬิกาและ label
function render() {
  clockEl.textContent = format(remaining);
  modeLabelEl.textContent = mode === "focus" ? "ถึงเวลาโฟกัส" : "พักสักครู่";
  document.title = format(remaining) + " · Pomodoro";
}

// เริ่ม/หยุดชั่วคราว
function toggle() {
  if (running) {
    pause();
  } else {
    start();
  }
}

function start() {
  running = true;
  startBtn.textContent = "Pause";
  timerId = setInterval(tick, 1000);
}

function pause() {
  running = false;
  startBtn.textContent = "Start";
  clearInterval(timerId);
}

// นับถอยหลังทีละวินาที
function tick() {
  if (remaining > 0) {
    remaining--;
    render();
  } else {
    complete();
  }
}

// เมื่อหมดเวลาในโหมดปัจจุบัน
function complete() {
  pause();
  beep();
  if (mode === "focus") {
    rounds++;
    roundsEl.textContent = rounds;
  }
  // สลับโหมดอัตโนมัติ
  switchMode(mode === "focus" ? "break" : "focus");
  clockEl.classList.add("pulse");
  setTimeout(() => clockEl.classList.remove("pulse"), 500);
}

// เปลี่ยนโหมดและรีเซ็ตเวลาของโหมดนั้น
function switchMode(next) {
  mode = next;
  remaining = DURATIONS[mode];
  tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
  render();
}

// รีเซ็ตกลับค่าเริ่มต้นของโหมดปัจจุบัน
function reset() {
  pause();
  remaining = DURATIONS[mode];
  render();
}

// เสียงเตือนแบบง่ายด้วย Web Audio API (ไม่ต้องมีไฟล์เสียง)
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    /* บางเบราว์เซอร์อาจบล็อกเสียงก่อนมีการโต้ตอบ */
  }
}

// ผูก event
startBtn.addEventListener("click", toggle);
resetBtn.addEventListener("click", reset);
tabs.forEach((t) =>
  t.addEventListener("click", () => {
    switchMode(t.dataset.mode);
    pause();
  })
);

// เริ่มต้นแสดงผล
render();
