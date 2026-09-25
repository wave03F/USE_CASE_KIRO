/* ============================================================
   ข้อมูล Use Case ของ Kiro
   วิเคราะห์จากฟีเจอร์จริงของ Kiro: Spec-Driven Development,
   Agent Hooks, MCP, Steering, Autopilot/Supervised, Vibe/Spec session
   ============================================================ */

const ACTORS = [
  {
    icon: "👩‍💻",
    name: "Developer",
    type: "Human",
    desc: "ผู้ใช้หลัก เขียน prompt สั่งงาน สร้าง/ทบทวน spec รันงาน และตรวจผลลัพธ์ในเอดิเตอร์"
  },
  {
    icon: "🧭",
    name: "Tech Lead / Reviewer",
    type: "Human",
    desc: "ตรวจ requirement และ design ก่อนลงมือ อนุมัติการเปลี่ยนแปลงในโหมด Supervised"
  },
  {
    icon: "📋",
    name: "Product Owner / BA",
    type: "Human",
    desc: "ให้ requirement เชิงธุรกิจ ตรวจ spec ว่าตรงกับความต้องการ กำหนด priority"
  },
  {
    icon: "🛡️",
    name: "Admin / DevOps",
    type: "Human",
    desc: "ตั้งค่า Steering, MCP, สิทธิ์การใช้งาน และนโยบายอนุมัติของ Agent Hooks"
  },
  {
    icon: "🤖",
    name: "Kiro Agent (AI)",
    type: "AI Agent",
    desc: "ผู้กระทำในระบบ อ่านบริบท สร้าง spec/โค้ด รัน task รัน hook และตรวจสอบผลลัพธ์"
  },
  {
    icon: "☁️",
    name: "Amazon Bedrock (Claude)",
    type: "External System",
    desc: "โมเดล LLM ที่ประมวลผลภาษาและสร้างผลลัพธ์ให้ Kiro Agent ผ่าน AWS"
  },
  {
    icon: "🔌",
    name: "MCP Server / External Tools",
    type: "External System",
    desc: "ระบบภายนอก เช่น เอกสาร, ฐานข้อมูล, API ที่ Kiro เชื่อมต่อผ่าน Model Context Protocol"
  }
];

const MODULES = {
  spec: { label: "Spec-Driven", color: "kiro" },
  agent: { label: "Agent & Automation", color: "orange" },
  context: { label: "Context & Config", color: "com7" },
  collab: { label: "Collaboration", color: "aws" }
};

const USECASES = [
  {
    id: "UC-001",
    module: "spec",
    name: "สร้าง Spec จาก Prompt",
    actor: "Developer, Kiro Agent",
    priority: "High",
    description: "ผู้ใช้บรรยายฟีเจอร์ที่ต้องการเป็นภาษาธรรมชาติ Kiro แปลงเป็นเอกสาร spec ที่มี requirement, design และ task list",
    pre: [
      "เปิด workspace ในโหมด Spec session",
      "Kiro เชื่อมต่อ Amazon Bedrock ได้สำเร็จ"
    ],
    main: [
      "ผู้ใช้พิมพ์ prompt อธิบายฟีเจอร์ที่ต้องการ",
      "Kiro Agent วิเคราะห์บริบท workspace และ Steering ที่เกี่ยวข้อง",
      "Kiro สร้างเอกสาร requirements (รูปแบบ EARS)",
      "ผู้ใช้ตรวจและยืนยัน requirements",
      "Kiro สร้างเอกสาร design ตาม requirements",
      "Kiro สร้าง task list ที่แตกงานเป็นขั้นตอนย่อย (include UC-002)"
    ],
    alt: [
      "ผู้ใช้แก้ไข requirement ระหว่างทาง → Kiro ปรับ design และ task ให้สอดคล้อง",
      "ผู้ใช้แนบไฟล์อ้างอิง (openapi/graphql) → Kiro ใช้ประกอบการออกแบบ"
    ],
    exc: [
      "เชื่อม Bedrock ไม่ได้ → แจ้ง error และให้ลองใหม่ ไม่บันทึก spec ที่ไม่สมบูรณ์",
      "prompt กำกวมเกินไป → Kiro ถามกลับเพื่อขอความชัดเจนแทนการเดา"
    ],
    post: [
      "ได้ไฟล์ spec (requirements, design, tasks) บันทึกใน .kiro/specs/",
      "ทุก requirement traceable ไปยัง task"
    ],
    rules: [
      "spec เป็น source of truth โค้ดต้องสอดคล้องกับ spec เสมอ",
      "ทุก requirement เขียนในรูปแบบ EARS"
    ],
    ears: "WHEN ผู้ใช้ส่ง prompt อธิบายฟีเจอร์ THE SYSTEM SHALL สร้างเอกสาร requirements, design และ task list ที่เชื่อมโยงกันและตรวจสอบย้อนกลับได้"
  },
  {
    id: "UC-002",
    module: "spec",
    name: "จัดทำและติดตาม Task List",
    actor: "Kiro Agent, Developer",
    priority: "High",
    description: "แตก design เป็นงานย่อยที่ทำได้ทีละขั้น พร้อมติดตามสถานะแต่ละ task",
    pre: ["มีเอกสาร design ที่ยืนยันแล้ว"],
    main: [
      "Kiro แปลง design เป็นรายการ task ที่เรียงลำดับ",
      "แต่ละ task ผูกกับ requirement ที่เกี่ยวข้อง",
      "ผู้ใช้เลือก task ที่จะให้ Kiro ลงมือทำ",
      "Kiro อัปเดตสถานะ task (pending → in progress → completed)"
    ],
    alt: ["ผู้ใช้สั่งข้าม task บางอัน → Kiro ไม่ mark ว่าเสร็จตามคำสั่ง"],
    exc: ["task ขึ้นต่อกันแต่ prerequisite ยังไม่เสร็จ → Kiro เตือนและแนะนำลำดับที่ถูกต้อง"],
    post: ["ทุก task มีสถานะชัดเจน เห็น progress ของฟีเจอร์"],
    rules: ["ทำ task ตามลำดับที่ระบุ เว้นแต่ผู้ใช้สั่งเป็นอย่างอื่น"],
    ears: "WHEN เอกสาร design ได้รับการยืนยัน THE SYSTEM SHALL สร้าง task list ที่เรียงลำดับและผูกกับ requirement พร้อมติดตามสถานะได้"
  },
  {
    id: "UC-003",
    module: "spec",
    name: "รัน Task และสร้างโค้ด",
    actor: "Kiro Agent",
    priority: "High",
    description: "Kiro ลงมือทำ task ที่เลือก เขียน/แก้โค้ดให้ครบ แล้วตรวจสอบผลลัพธ์",
    pre: ["มี task ที่เลือกไว้", "workspace อยู่ในสถานะพร้อมแก้ไข"],
    main: [
      "Kiro อ่านโค้ดที่เกี่ยวข้องก่อนแก้",
      "Kiro เขียนหรือแก้ไขไฟล์ตาม task",
      "Kiro รัน build/test ที่โปรเจกต์มี (include UC-004)",
      "Kiro แก้ error ที่เจอจนผ่าน",
      "Kiro รายงานสรุปการเปลี่ยนแปลง"
    ],
    alt: [
      "โหมด Autopilot → Kiro ทำต่อเนื่องจนจบ task",
      "โหมด Supervised → Kiro หยุดขออนุมัติหลังการแก้ไขแต่ละชุด"
    ],
    exc: [
      "build/test ล้มเหลวซ้ำ ๆ → Kiro วิเคราะห์ root cause แล้วลองแนวทางใหม่",
      "การกระทำเสี่ยง (ลบไฟล์จำนวนมาก) → Kiro ขอ confirm ก่อน"
    ],
    post: ["โค้ดถูกแก้ตาม task", "ผ่าน build/test", "task ถูก mark completed"],
    rules: ["ห้ามอ้างว่าเสร็จถ้ายังไม่ผ่านการตรวจสอบจริง"],
    ears: "WHEN ผู้ใช้สั่งรัน task THE SYSTEM SHALL แก้ไขโค้ดตาม task รัน build/test และรายงานผลก่อนถือว่าเสร็จ"
  },
  {
    id: "UC-004",
    module: "spec",
    name: "ตรวจสอบผลลัพธ์ (Verify)",
    actor: "Kiro Agent",
    priority: "High",
    description: "รัน build/test และยืนยันว่าผลลัพธ์ตรงกับเกณฑ์ความสำเร็จของ requirement",
    pre: ["มีการเปลี่ยนแปลงโค้ดที่รอตรวจสอบ"],
    main: [
      "ตรวจหา build/test runner ของโปรเจกต์",
      "รัน build และ test ที่เกี่ยวข้อง",
      "เทียบผลลัพธ์กับเกณฑ์ความสำเร็จใน requirement",
      "รายงานสิ่งที่ยืนยันได้และยืนยันไม่ได้"
    ],
    alt: ["ไม่มี test framework → Kiro เสนอ/ติดตั้งตามมาตรฐานของภาษานั้น"],
    exc: ["รัน test ไม่ได้เพราะ dependency ขาด → แจ้งชัดเจนว่าตรวจสอบไม่ได้เพราะอะไร"],
    post: ["มีผลการตรวจสอบชัดเจน ไม่ตกหล่น"],
    rules: ["คำสั่ง exit 0 ไม่ถือเป็นหลักฐานว่าสำเร็จโดยอัตโนมัติ"],
    ears: "WHEN มีการเปลี่ยนแปลงโค้ด THE SYSTEM SHALL รัน build/test และเทียบผลกับเกณฑ์ความสำเร็จก่อนสรุปผล"
  },
  {
    id: "UC-005",
    module: "agent",
    name: "สร้าง Agent Hook",
    actor: "Developer, Admin",
    priority: "Medium",
    description: "กำหนดให้ Kiro ทำงานอัตโนมัติเมื่อเกิด event เช่น บันทึกไฟล์ สร้างไฟล์ หรือจบ task",
    pre: ["มีสิทธิ์แก้ไขไฟล์ใน .kiro/hooks/"],
    main: [
      "ผู้ใช้ระบุ trigger (เช่น PostFileSave) และ matcher",
      "ผู้ใช้เลือก action แบบ command หรือ agent prompt",
      "Kiro สร้างไฟล์ hook ที่ .kiro/hooks/<id>.json",
      "Hook พร้อมทำงานในเซสชันถัดไป"
    ],
    alt: ["action แบบ agent prompt → เพิ่ม prompt แบบคงที่เข้าบริบทแทนการรันคำสั่ง"],
    exc: ["trigger/matcher ไม่ถูกต้อง → Kiro เตือนและเสนอรูปแบบที่ถูก"],
    post: ["มี hook ที่ทำงานตาม event ที่กำหนด"],
    rules: ["สร้าง hook ผ่านเครื่องมือ createHook เท่านั้น ไม่เขียนไฟล์เอง"],
    ears: "WHEN ผู้ใช้กำหนด trigger และ action THE SYSTEM SHALL สร้างไฟล์ hook ที่ถูกต้องและพร้อมทำงานตาม event"
  },
  {
    id: "UC-006",
    module: "agent",
    name: "รัน Agent Hook อัตโนมัติ",
    actor: "Kiro Agent",
    priority: "Medium",
    description: "เมื่อเกิด event ที่ตรงกับ hook Kiro จะรัน action ที่ตั้งไว้โดยอัตโนมัติ",
    pre: ["มี hook ที่ enable และ trigger ตรงกับ event"],
    main: [
      "เกิด event (เช่น ผู้ใช้บันทึกไฟล์ .ts)",
      "Kiro ตรวจ matcher ว่าตรงกับ event",
      "Kiro รัน action (command หรือ inject prompt)",
      "แสดงผลลัพธ์ของ hook"
    ],
    alt: ["PreToolUse hook → อาจ extend ด้วยการขออนุมัติก่อนดำเนินการ (UC-007)"],
    exc: [
      "command exit 2 → บล็อกการทำงานและแจ้งเหตุผล",
      "ตรวจพบ hook วนซ้ำ (circular) → ข้าม hook ซ้อนเพื่อกันลูปไม่รู้จบ"
    ],
    post: ["งานอัตโนมัติถูกดำเนินการตามที่ตั้งไว้"],
    rules: ["ถ้า PreToolUse hook ปฏิเสธสิทธิ์ ห้ามเรียกเครื่องมือนั้นซ้ำ"],
    ears: "WHEN เกิด event ที่ตรงกับ matcher ของ hook THE SYSTEM SHALL รัน action ที่กำหนดโดยอัตโนมัติและแสดงผล"
  },
  {
    id: "UC-007",
    module: "agent",
    name: "ขออนุมัติก่อนดำเนินการ (Guardrail)",
    actor: "Kiro Agent, Reviewer",
    priority: "High",
    description: "สำหรับการกระทำเสี่ยงหรือ PreToolUse hook Kiro จะขอการยืนยันจากผู้ใช้ก่อน",
    pre: ["มีการกระทำที่จัดเป็นความเสี่ยงสูง หรือมี PreToolUse hook"],
    main: [
      "Kiro ประเมินความเสี่ยงของการกระทำ",
      "Kiro อธิบายว่าจะทำอะไร เสี่ยงอะไร ย้อนกลับได้ไหม",
      "Kiro รอการยืนยันจากผู้ใช้",
      "เมื่อได้รับอนุมัติจึงดำเนินการ"
    ],
    alt: ["ผู้ใช้ปฏิเสธ → Kiro หาทางเลือกที่ไม่ทำลายข้อมูล"],
    exc: ["hook ปฏิเสธสิทธิ์ → หยุดทันที ไม่ทำต่อ"],
    post: ["การกระทำเสี่ยงเกิดขึ้นเฉพาะเมื่อได้รับอนุมัติ"],
    rules: ["Guardrail มีลำดับความสำคัญเหนือ default-to-action"],
    ears: "WHEN การกระทำเป็นความเสี่ยงสูงหรือมี PreToolUse guard THE SYSTEM SHALL อธิบายความเสี่ยงและรอการอนุมัติก่อนดำเนินการ"
  },
  {
    id: "UC-008",
    module: "context",
    name: "ตั้งค่า Steering (มาตรฐานทีม)",
    actor: "Admin, Developer",
    priority: "Medium",
    description: "ใส่บริบทและกฎของทีม (coding standard, ข้อมูลโปรเจกต์) ให้ Kiro ใช้อ้างอิงทุกครั้ง",
    pre: ["มีสิทธิ์แก้ไข .kiro/steering/"],
    main: [
      "ผู้ใช้สร้าง/แก้ไฟล์ .md ใน .kiro/steering/",
      "กำหนดโหมด inclusion (always / fileMatch / manual / auto)",
      "Kiro นำ steering มาใช้ประกอบทุกคำสั่งที่เกี่ยวข้อง"
    ],
    alt: ["inclusion: auto + description → เปิดใช้ตามบริบทของคำขอโดยอัตโนมัติ"],
    exc: ["front-matter ผิดรูปแบบ → Kiro เตือนให้แก้"],
    post: ["Kiro ทำงานตามมาตรฐานและบริบทของทีมอย่างสม่ำเสมอ"],
    rules: ["ค่า inclusion: auto เป็นไวยากรณ์ถูกต้อง ห้ามลบทิ้ง"],
    ears: "WHEN มีไฟล์ steering ที่เข้าเงื่อนไข inclusion THE SYSTEM SHALL นำบริบทและกฎนั้นมาใช้ประกอบการทำงาน"
  },
  {
    id: "UC-009",
    module: "context",
    name: "เชื่อมต่อ MCP Server",
    actor: "Admin, Kiro Agent",
    priority: "Medium",
    description: "เชื่อม Kiro กับเครื่องมือ/ข้อมูลภายนอกผ่าน Model Context Protocol เพื่อทำงานบนบริบทจริง",
    pre: ["มีไฟล์ตั้งค่า mcp.json (ระดับ user หรือ workspace)"],
    main: [
      "Admin กำหนด server ใน mcp.json",
      "Kiro เชื่อมต่อ MCP server ที่ enable",
      "Kiro เรียกใช้เครื่องมือของ server ตามที่ต้องใช้",
      "นำผลลัพธ์มาใช้ประกอบงาน"
    ],
    alt: ["config หลายระดับ → รวมกันตามลำดับ precedence (user < workspace)"],
    exc: ["server เชื่อมไม่ได้ → แจ้งและ reconnect ได้จาก MCP Server view"],
    post: ["Kiro ใช้ข้อมูล/เครื่องมือภายนอกในงานได้"],
    rules: ["ไม่แก้ไฟล์ config เดิมทับ ถ้าผู้ใช้ตั้งไว้แล้วให้แก้เฉพาะจุด"],
    ears: "WHEN มี MCP server ที่ตั้งค่าและ enable THE SYSTEM SHALL เชื่อมต่อและเรียกใช้เครื่องมือของ server นั้นเมื่อจำเป็น"
  },
  {
    id: "UC-010",
    module: "collab",
    name: "สลับโหมด Autopilot / Supervised",
    actor: "Developer, Reviewer",
    priority: "Medium",
    description: "เลือกระดับการควบคุม — ให้ Kiro ทำเองจนจบ หรือหยุดขออนุมัติทีละขั้น",
    pre: ["อยู่ในเซสชันการทำงานกับ Kiro"],
    main: [
      "ผู้ใช้เลือกโหมดการทำงาน",
      "Autopilot: Kiro ทำงานต่อเนื่อง ผู้ใช้ดู/ย้อน/หยุดได้",
      "Supervised: Kiro หยุดหลังการแก้ไข แสดงเป็น hunk ให้ยอมรับ/ปฏิเสธ"
    ],
    alt: ["สลับโหมดระหว่างทางได้ตามความเหมาะสมของงาน"],
    exc: ["ผู้ใช้ interrupt กลางทาง → Kiro หยุดและคงงานที่ทำไว้"],
    post: ["ระดับการควบคุมตรงกับที่ทีมต้องการ"],
    rules: ["Supervised เหมาะกับงานที่ต้องรีวิวละเอียด เช่น auth/infra"],
    ears: "WHEN ผู้ใช้เลือกโหมด Supervised THE SYSTEM SHALL หยุดเพื่อขออนุมัติการเปลี่ยนแปลงเป็นราย hunk ก่อนดำเนินการต่อ"
  }
];
