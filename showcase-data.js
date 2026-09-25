/* ============================================================
   ตัวอย่างจริง: ระบบที่สร้างด้วย Kiro
   Cross-Border Trade Compliance & Landed-Cost Engine
   ถอดจาก USE_CASES.md (v3.1) — 32 Use Case ยืนยันจากโค้ดจริง
   ============================================================ */

const SHOWCASE_META = {
  title: "Cross-Border Trade Compliance & Landed-Cost Engine",
  subtitle: "ระบบคำนวณต้นทุนนำเข้ารวม (Landed Cost) สินค้าจีน → สหรัฐฯ",
  blurb:
    "ระบบระดับ production ที่ทีมสร้างร่วมกับ Kiro — รวมภาษีศุลกากรหลายชั้น (MFN + Section 301 + Section 232 + IEEPA), " +
    "จัดการ stacking/mutual-exclusion, แปลงสกุลเงิน, และเก็บ audit trail แบบ immutable " +
    "จากงานที่เคยเปิด Excel ไล่หาอัตราภาษี 15–20 นาที เหลือเสี้ยววินาที",
  stats: [
    { num: 32, label: "Use Cases จากโค้ดจริง" },
    { num: 9, label: "Modules" },
    { num: 105, label: "Tests ผ่านทั้งหมด", suffix: "" }
  ]
};

const SHOWCASE_MODULES = {
  auth: { label: "Authentication & Account", color: "kiro" },
  calc: { label: "Landed Cost Calculation", color: "orange" },
  hts: { label: "HTS Code Management", color: "aws" },
  tariff: { label: "Tariff Rules & Exclusions", color: "com7" },
  fx: { label: "FX Rates", color: "kiro" },
  audit: { label: "Audit Trail", color: "orange" },
  fav: { label: "Favorites", color: "aws" },
  export: { label: "Comparison & Export", color: "com7" },
  users: { label: "User Management", color: "kiro" }
};

const SHOWCASE_UC = [
  {
    id: "UC-001", module: "auth", name: "เข้าสู่ระบบด้วย Google/GitHub (OAuth)", priority: "High",
    actor: "Guest, OAuth Provider",
    description: "ผู้ใช้เข้าสู่ระบบผ่าน OAuth ระบบสร้าง/ค้นหาบัญชี แล้วออก JWT (access + refresh token)",
    pre: ["ผู้ใช้ยังไม่ได้ล็อกอิน", "ตั้งค่า OAuth client ของ Google/GitHub ไว้แล้ว"],
    main: [
      "Guest กด Login with Google/GitHub",
      "ระบบ redirect ไปหน้า consent ของ Provider",
      "ผู้ใช้อนุญาตสิทธิ์ Provider ส่ง code กลับมาที่ callback",
      "ระบบแลก code เป็น token และดึง profile",
      "ค้นหา/สร้างผู้ใช้ (role เริ่มต้น = user) แล้วออก JWT",
      "redirect กลับ frontend พร้อม token"
    ],
    alt: ["ผู้ใช้เคยสมัครแล้ว → ใช้บัญชีเดิม ไม่สร้างซ้ำ"],
    exc: ["ผู้ใช้ปฏิเสธสิทธิ์ → ไม่มี code ยังเป็น Guest", "แลก code ไม่สำเร็จ → HTTP 400 OAuth failed"],
    post: ["ผู้ใช้มีบัญชีและถือ JWT ใช้เรียก API ที่ต้องยืนยันตัวตนได้"],
    rules: ["ไม่เก็บรหัสผ่าน มอบให้ OAuth Provider", "email ต้อง unique", "ผู้ใช้ใหม่ role = user เสมอ"],
    ears: "WHEN ผู้ใช้ยืนยันตัวตนกับ OAuth Provider สำเร็จ THE SYSTEM SHALL สร้าง/ค้นหาบัญชีและออก JWT access + refresh token"
  },
  {
    id: "UC-002", module: "auth", name: "ต่ออายุ Access Token (Refresh)", priority: "Medium",
    actor: "Registered User / API Client",
    description: "แลก refresh token ที่ยังไม่หมดอายุเป็น access token ใหม่ โดยไม่ต้องล็อกอินซ้ำ",
    pre: ["เคยล็อกอินและมี refresh token ที่ยังไม่หมดอายุ"],
    main: ["ส่ง POST /auth/refresh พร้อม refresh token", "ระบบตรวจสอบ token", "ดึง role ปัจจุบันของผู้ใช้", "ออก access token ใหม่ (ฝัง role) และส่งกลับ"],
    alt: [],
    exc: ["refresh token ผิด/หมดอายุ → HTTP 401", "ไม่พบผู้ใช้ → HTTP 401 User not found"],
    post: ["ได้ access token ใหม่ อายุ 15 นาที"],
    rules: ["JWT แบบ stateless", "access token 15 นาที, refresh token 7 วัน"],
    ears: "WHEN Client ส่ง refresh token ที่ยังไม่หมดอายุ THE SYSTEM SHALL ออก access token ใหม่ที่ฝัง role ปัจจุบัน"
  },
  {
    id: "UC-003", module: "auth", name: "ดูโปรไฟล์ผู้ใช้ปัจจุบัน", priority: "Medium",
    actor: "Registered User",
    description: "ดูข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอินอยู่",
    pre: ["ล็อกอินแล้ว (มี Bearer token ที่ถูกต้อง)"],
    main: ["ส่ง GET /auth/me พร้อม Bearer token", "ระบบตรวจ token และดึงข้อมูล", "คืน id, email, name, avatar_url, role, created_at"],
    alt: [],
    exc: ["token ผิด/ไม่มี → HTTP 401 Not authenticated"],
    post: ["ไม่เปลี่ยนสถานะระบบ (read-only)"],
    rules: [],
    ears: "WHEN ผู้ใช้ล็อกอินร้องขอโปรไฟล์ THE SYSTEM SHALL คืนข้อมูลโปรไฟล์ของผู้ใช้ปัจจุบัน"
  },
  {
    id: "UC-004", module: "auth", name: "ออกจากระบบ (Logout)", priority: "Low",
    actor: "Registered User",
    description: "ผู้ใช้ออกจากระบบ (ฝั่ง client ทิ้ง token)",
    pre: ["ผู้ใช้ล็อกอินอยู่"],
    main: ["ผู้ใช้กด Logout", "Client เรียก POST /auth/logout", "ระบบตอบยืนยัน", "Client ลบ token ที่เก็บไว้"],
    alt: [],
    exc: [],
    post: ["Client ไม่มี token ผู้ใช้กลับเป็น Guest"],
    rules: ["JWT stateless — ไม่ invalidate ฝั่ง server (token ยังมีผลจนหมดอายุ)"],
    ears: "WHEN ผู้ใช้สั่ง logout THE SYSTEM SHALL ตอบยืนยันเพื่อให้ client ลบ token ที่ถืออยู่"
  },
  {
    id: "UC-010", module: "calc", name: "คำนวณต้นทุนนำเข้ารวม (Landed Cost)", priority: "Critical",
    actor: "Registered User / API Client",
    description: "หัวใจของระบบ — คำนวณต้นทุนนำเข้ารวมของสินค้า 1 รายการ รวมภาษีทุกชั้น ค่าธรรมเนียม แปลงสกุลเงิน บังคับโควตาต่อวัน และบันทึก audit",
    pre: ["ผ่านการยืนยันตัวตน (JWT หรือ API Key)", "รหัส HTS มีอยู่ในระบบ", "ยังใช้โควตาต่อวันไม่ครบ (กรณีผู้ใช้ล็อกอิน)"],
    main: [
      "ส่ง POST /calculate พร้อม hts_code, มูลค่า, origin_country, import_date, freight, insurance",
      "ตรวจโควตาต่อวัน (ผู้ใช้ล็อกอิน) — รีเซ็ตเมื่อขึ้นวันใหม่, +1 ถ้ายังไม่ถึง limit",
      "ตรวจว่ารหัส HTS มีอยู่จริง",
      "แปลง CNY→USD ด้วยอัตรา ณ วันนำเข้า (มี fallback วันใกล้เคียง)",
      "รวมมูลค่า = สินค้า + ขนส่ง + ประกัน และตรวจ De minimis (≤ $800)",
      "คำนวณ Customs Value (CIF) และตรวจ FTA (USMCA ยกเว้น MFN)",
      "Rule Engine ดึงกฎที่มีผล + ตรวจ Exclusion + ใช้ Stacking Logic",
      "คำนวณค่าธรรมเนียม MPF และ HMF",
      "รวมเป็น Landed Cost และบันทึก audit log พร้อม calculation_id + user_id",
      "คืน breakdown ทุกชั้นภาษี (รวมชั้นที่ถูกตัดพร้อมเหตุผล), exclusions, FX ที่ใช้"
    ],
    alt: [
      "A1 De minimis: มูลค่า ≤ $800 → total_duty = 0, de_minimis_applied = true",
      "A2 FTA: origin MX/CA → MFN แสดงแต่ applied = false เหตุผล exempt_under_USMCA",
      "A3 Mutual exclusion: เก็บเรตสูงสุด ตัดตัวที่ต่ำกว่า เหตุผล excluded_by_stacking_rule"
    ],
    exc: [
      "โควตาต่อวันเต็ม → HTTP 429 Daily calculation limit reached",
      "รหัส HTS ไม่มี → HTTP 400 HTS code not found",
      "ไม่ส่งทั้ง CNY และ USD → HTTP 400",
      "ไม่มีอัตราแลกเปลี่ยนใกล้เคียง → การแปลงสกุลเงินล้มเหลว"
    ],
    post: ["บันทึก CalculationLog แบบ immutable ผูก user_id", "ตัวนับ daily_calculations เพิ่ม 1", "ได้ผลครบพร้อม calculation_id"],
    rules: [
      "MFN เป็นภาษีฐานเสมอ", "ภาษี mutually exclusive จ่ายเฉพาะเรตสูงสุด",
      "De minimis ≤ $800 ยกเว้นภาษี+ค่าธรรมเนียม", "USMCA ยกเว้น MFN",
      "MPF 0.3464% ($31.67–$614.35), HMF 0.125%", "กฎ HTS ที่เฉพาะเจาะจงกว่ามีลำดับสูงกว่า",
      "โควตา: user 50/วัน, admin 99,999/วัน", "API Key/dev ไม่ผูกโควตา, user_id = null"
    ],
    ears: "WHEN Client ส่งคำขอคำนวณที่ผ่านการยืนยันตัวตนและยังมีโควตา THE SYSTEM SHALL คำนวณ Landed Cost รวมภาษีทุกชั้นและบันทึก audit log แบบ immutable"
  },
  {
    id: "UC-020", module: "hts", name: "ค้นหารหัส HTS", priority: "High",
    actor: "Registered User / Admin / API Client",
    description: "ค้นหารหัสพิกัดศุลกากรตาม prefix ของรหัส หรือ keyword ในคำอธิบาย",
    pre: ["ผ่านการยืนยันตัวตน"],
    main: ["ส่ง GET /hts-codes?q=...&level=...", "ค้นหาตาม prefix/keyword และ filter ตาม level", "คืนผลลัพธ์ (จำกัด 50 รายการ)"],
    alt: ["q ว่าง → คืนรายการทั่วไปตามลำดับรหัส"],
    exc: ["ไม่ผ่านการยืนยันตัวตน → HTTP 401"],
    post: ["read-only"],
    rules: ["ผลลัพธ์จำกัดสูงสุด 50 รายการต่อคำค้น"],
    ears: "WHEN ผู้ใช้ค้นหา HTS ด้วย prefix หรือ keyword THE SYSTEM SHALL คืนผลลัพธ์ที่ตรงเงื่อนไขไม่เกิน 50 รายการ"
  },
  {
    id: "UC-021", module: "hts", name: "ดูรายละเอียดรหัส HTS", priority: "Medium",
    actor: "Registered User / Admin / API Client",
    description: "ดึงข้อมูลของรหัส HTS ที่ระบุ",
    pre: ["ผ่านการยืนยันตัวตน"],
    main: ["ส่ง GET /hts-codes/{code}", "ระบบค้นหาและคืนรายละเอียด"],
    alt: [],
    exc: ["ไม่พบรหัส → HTTP 404"],
    post: ["read-only"],
    rules: [],
    ears: "WHEN ผู้ใช้ระบุรหัส HTS THE SYSTEM SHALL คืนรายละเอียดของรหัสนั้น หรือ HTTP 404 หากไม่พบ"
  },
  {
    id: "UC-022", module: "hts", name: "เพิ่มรหัส HTS ใหม่ (admin)", priority: "Medium",
    actor: "Admin / API Client (trusted service)",
    description: "เพิ่มรหัส HTS ใหม่เข้าระบบ ระบบกำหนด level อัตโนมัติจากรูปแบบรหัส",
    pre: ["ยืนยันตัวตนแบบ admin (JWT role=admin, API Key, หรือ dev mode)"],
    main: ["ส่ง POST /hts-codes พร้อมรหัสและคำอธิบาย", "ตรวจสิทธิ์ admin", "กำหนด level อัตโนมัติ", "บันทึกและคืนข้อมูล (HTTP 201)"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403 Admin role required", "รหัสซ้ำ → HTTP 409"],
    post: ["มีรหัส HTS ใหม่ ใช้ในการคำนวณได้"],
    rules: ["level กำหนดจากความยาว/รูปแบบ (chapter ≤2, heading ≤4, subheading >4)"],
    ears: "WHEN admin ส่งรหัส HTS ใหม่ THE SYSTEM SHALL บันทึกพร้อมกำหนด level อัตโนมัติ และปฏิเสธผู้ใช้ที่ไม่ใช่ admin ด้วย HTTP 403"
  },
  {
    id: "UC-023", module: "hts", name: "แก้ไขรหัส HTS (admin)", priority: "Low",
    actor: "Admin / API Client (trusted service)",
    description: "อัปเดตคำอธิบาย/parent ของรหัส HTS เฉพาะ field ที่ส่งมาจะถูกแก้ไข",
    pre: ["ยืนยันตัวตนแบบ admin", "รหัสนั้นมีอยู่"],
    main: ["ส่ง PUT /hts-codes/{code} พร้อม field ที่แก้", "ตรวจสิทธิ์ admin และค้นหารหัส", "อัปเดตเฉพาะ field ที่ส่งมา"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบรหัส → HTTP 404"],
    post: ["ข้อมูลรหัส HTS ถูกปรับปรุง"],
    rules: ["ไม่อนุญาตเปลี่ยน code เอง (แก้ได้เฉพาะ description/parent)"],
    ears: "WHEN admin แก้ไขรหัส HTS ที่มีอยู่ THE SYSTEM SHALL อัปเดตเฉพาะ field ที่ส่งมาโดยไม่เปลี่ยนรหัสหลัก"
  },
  {
    id: "UC-024", module: "hts", name: "ลบรหัส HTS (admin)", priority: "Low",
    actor: "Admin / API Client (trusted service)",
    description: "ลบรหัส HTS ออกจากระบบ พร้อม referential guard กันลบรหัสที่ยังมีกฎอ้างถึง",
    pre: ["ยืนยันตัวตนแบบ admin", "รหัสนั้นมีอยู่"],
    main: ["ส่ง DELETE /hts-codes/{code}", "ตรวจสิทธิ์ admin และค้นหารหัส", "ตรวจ referential guard (นับกฎภาษี/exclusion ที่อ้างถึง)", "ถ้าไม่มีการอ้างถึง ลบและตอบ HTTP 204"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบรหัส → HTTP 404", "มีกฎ/exclusion อ้างถึง → HTTP 409 (ไม่ลบ)"],
    post: ["รหัส HTS ถูกลบเมื่อไม่มีการอ้างถึง (การคำนวณเดิมไม่กระทบ)"],
    rules: ["ต้องลบ/ย้ายกฎภาษีและ exclusion ที่อ้างถึงก่อน (กัน dangling reference)"],
    ears: "WHEN admin ลบรหัส HTS ที่ยังมีกฎภาษีหรือ exclusion อ้างถึง THE SYSTEM SHALL ปฏิเสธด้วย HTTP 409 และไม่ลบ"
  },
  {
    id: "UC-030", module: "tariff", name: "ดูรายการกฎภาษี", priority: "High",
    actor: "Registered User / Admin / API Client",
    description: "แสดงกฎภาษีทั้งหมดพร้อม temporal versioning กรองตามชนิดภาษีหรือ HTS ได้",
    pre: ["ผ่านการยืนยันตัวตน"],
    main: ["ส่ง GET /tariff-rules?tariff_type=...&hts_code=...", "คืนรายการกฎที่ตรงเงื่อนไข"],
    alt: [],
    exc: ["ไม่ผ่านการยืนยันตัวตน → HTTP 401"],
    post: ["read-only"],
    rules: ["ชนิดภาษี: MFN, SECTION_301, SECTION_232, IEEPA, AD_CVD"],
    ears: "WHEN ผู้ใช้ขอรายการกฎภาษี THE SYSTEM SHALL คืนกฎที่ตรงตัวกรองพร้อมข้อมูล temporal versioning"
  },
  {
    id: "UC-031", module: "tariff", name: "สร้างกฎภาษีใหม่ (admin)", priority: "High",
    actor: "Admin / API Client (trusted service)",
    description: "เพิ่มกฎภาษีใหม่พร้อมตั้งค่า stacking / mutual-exclusion",
    pre: ["ยืนยันตัวตนแบบ admin"],
    main: ["ส่ง POST /tariff-rules พร้อม pattern, type, rate, effective_from/to, stacks_with, mutually_exclusive_with", "ตรวจสิทธิ์ admin และ validate", "บันทึกและคืน (HTTP 201)"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "type ผิด → HTTP 400", "validation ไม่ผ่าน (rate เกิน 0–5) → HTTP 422"],
    post: ["กฎใหม่มีผลตามช่วงวันที่ (data-driven ไม่ต้อง deploy)"],
    rules: ["การเปลี่ยนกฎไม่กระทบผลการคำนวณเดิม (immutable audit)"],
    ears: "WHEN admin สร้างกฎภาษีใหม่ THE SYSTEM SHALL บันทึกกฎให้มีผลตามช่วงวันที่โดยไม่ต้อง deploy ใหม่"
  },
  {
    id: "UC-032", module: "tariff", name: "แก้ไขกฎภาษี (admin)", priority: "High",
    actor: "Admin / API Client (trusted service)",
    description: "อัปเดตกฎภาษีที่มีอยู่ เฉพาะ field ที่ส่งมาจะถูกแก้ไข (partial update)",
    pre: ["ยืนยันตัวตนแบบ admin", "กฎที่ระบุมีอยู่"],
    main: ["ส่ง PUT /tariff-rules/{rule_id} พร้อม field ที่แก้", "ตรวจสิทธิ์ admin และค้นหากฎ", "อัปเดตเฉพาะ field ที่ส่งมา"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบ rule_id → HTTP 404"],
    post: ["กฎถูกปรับปรุง มีผลกับการคำนวณครั้งถัดไป"],
    rules: ["แก้ได้เฉพาะ rate, effective_to, stacks_with, mutually_exclusive_with, description, source_reference"],
    ears: "WHEN admin แก้ไขกฎภาษีที่มีอยู่ THE SYSTEM SHALL อัปเดตเฉพาะ field ที่ส่งมาและมีผลกับการคำนวณครั้งถัดไป"
  },
  {
    id: "UC-033", module: "tariff", name: "ลบกฎภาษี (admin)", priority: "Medium",
    actor: "Admin / API Client (trusted service)",
    description: "ลบกฎภาษีแบบถาวร (hard delete) — อนุญาตเฉพาะกฎที่ยังไม่เคยมีผล",
    pre: ["ยืนยันตัวตนแบบ admin", "กฎที่ระบุมีอยู่"],
    main: ["ส่ง DELETE /tariff-rules/{rule_id}", "ตรวจสิทธิ์ admin และค้นหากฎ", "ตรวจว่ากฎยังไม่มีผล (effective_from อนาคต)", "ถ้ายังไม่มีผล ลบและตอบ HTTP 204"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบ rule_id → HTTP 404", "กฎมีผลแล้ว → HTTP 409 (แนะให้ใช้ soft-close)"],
    post: ["กฎที่ยังไม่มีผลถูกลบ การคำนวณเดิมไม่กระทบ"],
    rules: ["hard delete ได้เฉพาะกฎที่ยังไม่เคยมีผล; กฎที่มีผลแล้วต้องใช้ soft-close (UC-038)"],
    ears: "WHEN admin ลบกฎภาษีที่มีผลแล้ว THE SYSTEM SHALL ปฏิเสธด้วย HTTP 409 และแนะนำให้ใช้ soft-close แทน"
  },
  {
    id: "UC-038", module: "tariff", name: "ปิดกฎภาษี (soft-close) (admin)", priority: "Medium",
    actor: "Admin / API Client (trusted service)",
    description: "ปิดกฎภาษีที่เคย/กำลังมีผล โดยตั้งวันสิ้นสุด (effective_to) แทนการลบ เพื่อรักษา audit",
    pre: ["ยืนยันตัวตนแบบ admin", "กฎที่ระบุมีอยู่"],
    main: ["ส่ง POST /tariff-rules/{rule_id}/close พร้อม close_date", "ตรวจสิทธิ์ admin และค้นหากฎ", "ตั้ง effective_to = close_date และคืนกฎ"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบ rule_id → HTTP 404", "มีวันสิ้นสุดก่อน/เท่า close_date อยู่แล้ว → HTTP 400"],
    post: ["กฎยังอยู่ในระบบเพื่อ audit แต่ไม่ถูกใช้หลัง close_date"],
    rules: ["เป็นวิธี retire กฎที่แนะนำ — เก็บไว้ตรวจย้อนหลัง", "การคำนวณเดิมไม่กระทบ"],
    ears: "WHEN admin ปิดกฎภาษีที่มีผลแล้ว THE SYSTEM SHALL ตั้ง effective_to โดยเก็บกฎไว้ในระบบเพื่อรักษา audit trail"
  },
  {
    id: "UC-034", module: "tariff", name: "ดูรายการข้อยกเว้นภาษี", priority: "Medium",
    actor: "Registered User / Admin / API Client",
    description: "แสดง exclusion ทั้งหมด (ทั้งที่มีผลและหมดอายุ) กรองตาม HTS ได้",
    pre: ["ผ่านการยืนยันตัวตน"],
    main: ["ส่ง GET /exclusions?hts_code=...", "คืนรายการ exclusion"],
    alt: [],
    exc: ["ไม่ผ่านการยืนยันตัวตน → HTTP 401"],
    post: ["read-only"],
    rules: [],
    ears: "WHEN ผู้ใช้ขอรายการข้อยกเว้น THE SYSTEM SHALL คืน exclusion ทั้งหมดที่ตรงตัวกรอง"
  },
  {
    id: "UC-035", module: "tariff", name: "สร้างข้อยกเว้นภาษีใหม่ (admin)", priority: "Medium",
    actor: "Admin / API Client (trusted service)",
    description: "เพิ่ม exclusion ใหม่ (ยกเว้นภาษีชนิดหนึ่งสำหรับ HTS/ประเทศ ในช่วงเวลาหนึ่ง)",
    pre: ["ยืนยันตัวตนแบบ admin"],
    main: ["ส่ง POST /exclusions พร้อม hts_code, tariff_type, origin_country, effective_from/to", "ตรวจสิทธิ์ admin และ validate", "บันทึกและคืน (HTTP 201)"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "type ผิด → HTTP 400", "validation ไม่ผ่าน → HTTP 422"],
    post: ["exclusion ถูกใช้อัตโนมัติในการคำนวณที่อยู่ในช่วงมีผล"],
    rules: ["effective_to = null = ยกเว้นถาวร; exclusion ตัดภาษีชนิดที่ระบุออก"],
    ears: "WHEN admin สร้าง exclusion ใหม่ THE SYSTEM SHALL นำไปใช้ตัดภาษีชนิดที่ระบุออกจากการคำนวณตามช่วงวันที่มีผล"
  },
  {
    id: "UC-036", module: "tariff", name: "แก้ไขข้อยกเว้นภาษี (admin)", priority: "Low",
    actor: "Admin / API Client (trusted service)",
    description: "อัปเดต exclusion เฉพาะ field ที่ส่งมา (effective_to, description, source_reference)",
    pre: ["ยืนยันตัวตนแบบ admin", "exclusion ที่ระบุมีอยู่"],
    main: ["ส่ง PUT /exclusions/{exclusion_id} พร้อม field ที่แก้", "ตรวจสิทธิ์ admin และค้นหา", "อัปเดตและคืนผล"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบ exclusion_id → HTTP 404"],
    post: ["exclusion ถูกปรับปรุง (เช่น ขยาย/ปิดวันหมดอายุ)"],
    rules: ["ใช้แก้ effective_to เพื่อขยายหรือยุติการยกเว้น"],
    ears: "WHEN admin แก้ไข exclusion THE SYSTEM SHALL อัปเดตเฉพาะ field ที่ส่งมา"
  },
  {
    id: "UC-037", module: "tariff", name: "ลบข้อยกเว้นภาษี (admin)", priority: "Low",
    actor: "Admin / API Client (trusted service)",
    description: "ลบ exclusion แบบถาวร (hard delete) — อนุญาตเฉพาะที่ยังไม่เคยมีผล",
    pre: ["ยืนยันตัวตนแบบ admin", "exclusion ที่ระบุมีอยู่"],
    main: ["ส่ง DELETE /exclusions/{exclusion_id}", "ตรวจสิทธิ์ admin และค้นหา", "ตรวจว่ายังไม่มีผล", "ถ้ายังไม่มีผล ลบและตอบ HTTP 204"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบ exclusion_id → HTTP 404", "มีผลแล้ว → HTTP 409 (แนะ soft-close)"],
    post: ["exclusion ที่ยังไม่มีผลถูกลบ"],
    rules: ["hard delete ได้เฉพาะที่ยังไม่เคยมีผล; ที่มีผลแล้วต้องใช้ soft-close (UC-039)"],
    ears: "WHEN admin ลบ exclusion ที่มีผลแล้ว THE SYSTEM SHALL ปฏิเสธด้วย HTTP 409 และแนะนำ soft-close"
  },
  {
    id: "UC-039", module: "tariff", name: "ปิดข้อยกเว้นภาษี (soft-close) (admin)", priority: "Low",
    actor: "Admin / API Client (trusted service)",
    description: "ปิด exclusion ที่เคย/กำลังมีผล โดยตั้งวันสิ้นสุด (effective_to) แทนการลบ",
    pre: ["ยืนยันตัวตนแบบ admin", "exclusion ที่ระบุมีอยู่"],
    main: ["ส่ง POST /exclusions/{exclusion_id}/close พร้อม close_date", "ตรวจสิทธิ์ admin และค้นหา", "ตั้ง effective_to = close_date และคืนผล"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบ exclusion_id → HTTP 404", "มีวันสิ้นสุดก่อน/เท่า close_date อยู่แล้ว → HTTP 400"],
    post: ["exclusion ยังอยู่ในระบบเพื่อ audit แต่ไม่ถูกใช้หลัง close_date"],
    rules: ["เป็นวิธี retire exclusion ที่แนะนำ — เก็บไว้ตรวจย้อนหลัง"],
    ears: "WHEN admin ปิด exclusion ที่มีผลแล้ว THE SYSTEM SHALL ตั้ง effective_to โดยเก็บไว้เพื่อ audit"
  },
  {
    id: "UC-040", module: "fx", name: "ดูอัตราแลกเปลี่ยนย้อนหลัง", priority: "Medium",
    actor: "Registered User / Admin / API Client",
    description: "แสดงอัตราแลกเปลี่ยนของคู่สกุลเงิน (ค่าเริ่มต้น CNY→USD) กรองตามช่วงวันที่ได้",
    pre: ["ผ่านการยืนยันตัวตน"],
    main: ["ส่ง GET /fx-rates?from_currency=CNY&to_currency=USD&date_from=...&date_to=...", "คืนรายการอัตรา (จำกัด 100 เรียงวันที่ล่าสุดก่อน)"],
    alt: [],
    exc: ["ไม่ผ่านการยืนยันตัวตน → HTTP 401"],
    post: ["read-only"],
    rules: ["ผลลัพธ์จำกัด 100 รายการ"],
    ears: "WHEN ผู้ใช้ขออัตราแลกเปลี่ยน THE SYSTEM SHALL คืนอัตราของคู่สกุลเงินตามช่วงวันที่ ไม่เกิน 100 รายการ"
  },
  {
    id: "UC-041", module: "fx", name: "เพิ่ม/อัปเดตอัตราแลกเปลี่ยน (admin)", priority: "High",
    actor: "Admin / API Client (trusted service)",
    description: "เพิ่มอัตราแลกเปลี่ยนสำหรับวันที่ระบุ ถ้ามีอยู่แล้วจะอัปเดต (upsert)",
    pre: ["ยืนยันตัวตนแบบ admin"],
    main: ["ส่ง POST /fx-rates พร้อม from_currency, to_currency, rate, date", "ตรวจสิทธิ์ admin แล้วตรวจว่ามีอัตราของวันนั้นแล้วหรือไม่ → เพิ่ม/อัปเดต", "คืนผล (HTTP 201)"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "validation ไม่ผ่าน → HTTP 422"],
    post: ["อัตราพร้อมใช้ในการแปลงสกุลเงินของการคำนวณ"],
    rules: ["1 อัตราต่อ 1 คู่สกุลเงินต่อ 1 วันที่ (upsert)"],
    ears: "WHEN admin ส่งอัตราแลกเปลี่ยนของวันหนึ่ง THE SYSTEM SHALL บันทึกหรืออัปเดตอัตรานั้นแบบ upsert"
  },
  {
    id: "UC-042", module: "fx", name: "ลบอัตราแลกเปลี่ยน (admin)", priority: "Low",
    actor: "Admin / API Client (trusted service)",
    description: "ลบอัตราแลกเปลี่ยนตาม id",
    pre: ["ยืนยันตัวตนแบบ admin", "อัตราที่ระบุมีอยู่"],
    main: ["ส่ง DELETE /fx-rates/{rate_id}", "ตรวจสิทธิ์ admin และค้นหาอัตรา", "ลบและตอบ HTTP 204"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบ rate_id → HTTP 404"],
    post: ["อัตราแลกเปลี่ยนถูกลบ"],
    rules: ["การลบอัตราที่เคยใช้แล้วไม่กระทบผลเดิม (log เก็บ fx_rate ที่ใช้)", "อาจ fallback วันใกล้เคียงหรือ live API"],
    ears: "WHEN admin ลบอัตราแลกเปลี่ยน THE SYSTEM SHALL ลบรายการนั้นโดยไม่กระทบผลการคำนวณที่บันทึกไว้แล้ว"
  },
  {
    id: "UC-050", module: "audit", name: "ดูประวัติการคำนวณย้อนหลัง", priority: "Medium",
    actor: "Registered User / Admin / API Client",
    description: "แสดงรายการการคำนวณ เรียงเวลาล่าสุดก่อน ใช้เป็น audit trail โดยขอบเขตการมองเห็นขึ้นกับ role",
    pre: ["ผ่านการยืนยันตัวตน"],
    main: ["ส่ง GET /calculations?hts_code=...&limit=...&offset=...", "กำหนดขอบเขต: user เห็นเฉพาะของตน, admin/service เห็นทั้งหมด", "คืนรายการ (จำกัด 200, มี pagination)"],
    alt: [],
    exc: ["ไม่ผ่านการยืนยันตัวตน → HTTP 401"],
    post: ["read-only"],
    rules: ["limit ≤ 200 เรียงจากใหม่ไปเก่า", "ผู้ใช้ทั่วไปเห็นเฉพาะของตน; admin/service เห็นทั้งหมด"],
    ears: "WHEN ผู้ใช้ทั่วไปขอประวัติการคำนวณ THE SYSTEM SHALL คืนเฉพาะรายการที่เป็นของผู้ใช้นั้น"
  },
  {
    id: "UC-051", module: "audit", name: "ดูรายละเอียดการคำนวณครั้งเดียว", priority: "Medium",
    actor: "Registered User / Admin / API Client",
    description: "ดึงข้อมูลการคำนวณ 1 รายการ ประกอบด้วย input, กฎที่ใช้, exclusions, ผลลัพธ์ พร้อมตรวจ ownership",
    pre: ["ผ่านการยืนยันตัวตน", "มี calculation_id"],
    main: ["ส่ง GET /calculations/{calculation_id}", "ค้นหา log", "ตรวจ ownership (user ที่ไม่ใช่เจ้าของ → ถือว่าไม่พบ)", "คืนรายละเอียดครบถ้วน"],
    alt: [],
    exc: ["ไม่พบ calculation_id → HTTP 404", "ผู้ใช้ทั่วไปเปิดของคนอื่น → HTTP 404 (ไม่เปิดเผยว่ามีอยู่)"],
    post: ["read-only"],
    rules: ["ข้อมูล immutable สะท้อนกฎ ณ เวลาคำนวณ; admin/service เข้าถึงได้ทุกรายการ"],
    ears: "WHEN ผู้ใช้ทั่วไปเปิดรายละเอียดการคำนวณที่ไม่ใช่ของตน THE SYSTEM SHALL ตอบ HTTP 404 เพื่อไม่เปิดเผยว่ามีอยู่จริง"
  },
  {
    id: "UC-060", module: "fav", name: "บันทึก HTS code เป็นรายการโปรด", priority: "Low",
    actor: "Registered User",
    description: "บันทึก HTS code ไว้เข้าถึงเร็ว พร้อม note ได้",
    pre: ["ล็อกอินแล้ว (ต้องมี JWT — ไม่รองรับ API Key ล้วน)"],
    main: ["ส่ง POST /favorites พร้อม hts_code และ note", "ตรวจว่ายังไม่เคยบันทึก", "บันทึกผูก user_id และคืนผล (HTTP 201)"],
    alt: [],
    exc: ["ไม่ได้ล็อกอิน → HTTP 401 Login required", "บันทึกซ้ำ → HTTP 409"],
    post: ["HTS code อยู่ในรายการโปรดของผู้ใช้"],
    rules: ["1 ผู้ใช้ บันทึก 1 HTS code ได้ครั้งเดียว (ห้ามซ้ำ)"],
    ears: "WHEN ผู้ใช้ล็อกอินบันทึก HTS code ที่ยังไม่เคยบันทึก THE SYSTEM SHALL เพิ่มลงรายการโปรดของผู้ใช้นั้น"
  },
  {
    id: "UC-061", module: "fav", name: "ดู HTS code ที่บันทึกไว้", priority: "Low",
    actor: "Registered User",
    description: "แสดงรายการ HTS code โปรดของผู้ใช้ปัจจุบัน",
    pre: ["ล็อกอินแล้ว"],
    main: ["ส่ง GET /favorites", "คืนรายการของผู้ใช้ เรียงเวลาบันทึกล่าสุดก่อน"],
    alt: [],
    exc: ["ไม่ได้ล็อกอิน → HTTP 401"],
    post: ["read-only"],
    rules: ["แสดงเฉพาะรายการของผู้ใช้ที่ล็อกอิน"],
    ears: "WHEN ผู้ใช้ล็อกอินขอรายการโปรด THE SYSTEM SHALL คืนเฉพาะ HTS code ที่ผู้ใช้นั้นบันทึกไว้"
  },
  {
    id: "UC-062", module: "fav", name: "ลบ HTS code ออกจากรายการโปรด", priority: "Low",
    actor: "Registered User",
    description: "ลบ HTS code ที่บันทึกไว้ออก",
    pre: ["ล็อกอินแล้ว", "รายการนั้นเป็นของผู้ใช้"],
    main: ["ส่ง DELETE /favorites/{favorite_id}", "ตรวจว่ารายการเป็นของผู้ใช้และลบออก (HTTP 204)"],
    alt: [],
    exc: ["ไม่ได้ล็อกอิน → HTTP 401", "ไม่พบ/ไม่ใช่ของผู้ใช้ → HTTP 404"],
    post: ["รายการถูกลบออกจากรายการโปรด"],
    rules: ["ลบได้เฉพาะรายการของตนเอง"],
    ears: "WHEN ผู้ใช้ลบรายการโปรดของตน THE SYSTEM SHALL ลบเฉพาะรายการที่เป็นของผู้ใช้นั้น"
  },
  {
    id: "UC-070", module: "export", name: "เปรียบเทียบผลการคำนวณหลายกรณี", priority: "Medium",
    actor: "Registered User",
    description: "เปรียบเทียบต้นทุนนำเข้าระหว่างหลายกรณี (วันที่/สินค้าต่างกัน) ที่หน้า Compare",
    pre: ["ล็อกอินแล้ว", "มีผลการคำนวณตั้งแต่ 2 กรณีขึ้นไป"],
    main: ["เข้าหน้า /compare", "เลือก/ป้อนกรณีที่จะเทียบ", "Frontend เรียก POST /calculate ต่อกรณี แล้วแสดงตารางเทียบ"],
    alt: ["เพิ่ม/ลบกรณีระหว่างทาง → ตารางอัปเดต"],
    exc: ["กรณีใดคำนวณล้มเหลว → แสดง error เฉพาะกรณีนั้น", "ใช้โควตาต่อวันเกิน → กรณีที่เกินได้ HTTP 429"],
    post: ["เห็นผลเปรียบเทียบ (แต่ละการคำนวณถูกบันทึก audit และนับโควตา)"],
    rules: ["อ้างอิงกฎธุรกิจของ UC-010 ทุกข้อ (รวมโควตา)", "เป็น flow frontend ที่ include UC-010 หลายครั้ง"],
    ears: "WHEN ผู้ใช้เปรียบเทียบหลายกรณี THE SYSTEM SHALL คำนวณแต่ละกรณีผ่าน UC-010 และแสดงผลเทียบกันเป็นตาราง"
  },
  {
    id: "UC-071", module: "export", name: "พิมพ์ / ส่งออกผลลัพธ์เป็น PDF", priority: "Low",
    actor: "Registered User",
    description: "ส่งออก/พิมพ์รายงานผลการคำนวณเป็น PDF (หน้า /print)",
    pre: ["มีผลการคำนวณที่ต้องการพิมพ์"],
    main: ["กด Export/Print จากผลการคำนวณ", "Frontend จัดรูปแบบรายงานและสร้าง PDF", "ผู้ใช้บันทึก/พิมพ์ไฟล์"],
    alt: [],
    exc: [],
    post: ["ผู้ใช้ได้ไฟล์ PDF ของรายงาน"],
    rules: [],
    ears: "WHEN ผู้ใช้สั่งส่งออกผลการคำนวณ THE SYSTEM SHALL สร้างรายงาน PDF ให้ดาวน์โหลด/พิมพ์"
  },
  {
    id: "UC-080", module: "users", name: "ดูรายชื่อผู้ใช้ทั้งหมด (admin)", priority: "Medium",
    actor: "Admin / API Client (trusted service)",
    description: "แสดงรายชื่อผู้ใช้ทั้งหมด เรียงตามวันที่สร้างล่าสุดก่อน",
    pre: ["ยืนยันตัวตนแบบ admin"],
    main: ["ส่ง GET /users?limit=...&offset=...", "ตรวจสิทธิ์ admin และคืนรายการผู้ใช้ (id, email, name, role, daily_calculations)"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403 Admin role required"],
    post: ["read-only"],
    rules: ["limit ≤ 200, มี pagination"],
    ears: "WHEN admin ขอรายชื่อผู้ใช้ THE SYSTEM SHALL คืนรายการผู้ใช้พร้อม pagination และปฏิเสธผู้ที่ไม่ใช่ admin"
  },
  {
    id: "UC-081", module: "users", name: "ดูข้อมูลผู้ใช้รายคน (admin)", priority: "Low",
    actor: "Admin / API Client (trusted service)",
    description: "ดึงข้อมูลผู้ใช้รายคนตาม id",
    pre: ["ยืนยันตัวตนแบบ admin"],
    main: ["ส่ง GET /users/{user_id}", "ตรวจสิทธิ์ admin และคืนข้อมูลผู้ใช้"],
    alt: [],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "ไม่พบ user_id → HTTP 404"],
    post: ["read-only"],
    rules: [],
    ears: "WHEN admin ขอข้อมูลผู้ใช้รายคน THE SYSTEM SHALL คืนข้อมูลของผู้ใช้นั้น หรือ HTTP 404 หากไม่พบ"
  },
  {
    id: "UC-082", module: "users", name: "เปลี่ยน role ผู้ใช้ (promote/demote)", priority: "High",
    actor: "Admin",
    description: "เลื่อนหรือลดสิทธิ์ผู้ใช้ระหว่าง user และ admin พร้อมกันการลด role ตัวเอง",
    pre: ["ยืนยันตัวตนแบบ admin", "ผู้ใช้เป้าหมายมีอยู่"],
    main: ["ส่ง PUT /users/{user_id}/role พร้อม role ใหม่", "ตรวจสิทธิ์ admin และ validate role", "ตรวจว่าไม่ใช่การลด role ของตัวเอง", "อัปเดต role และคืนข้อมูล"],
    alt: ["Promote: user → admin", "Demote: admin → user (ของผู้ใช้อื่น)"],
    exc: ["ผู้ใช้ทั่วไป → HTTP 403", "role ผิด → HTTP 400", "ไม่พบ user_id → HTTP 404", "ลด role ตัวเอง → HTTP 400 cannot remove your own admin role"],
    post: ["role เป้าหมายถูกเปลี่ยน มีผลกับ token ที่ออกใหม่"],
    rules: ["role รองรับเพียง user และ admin", "admin ลด role ตัวเองไม่ได้ (กันล็อกตัวเองออก)", "การเปลี่ยน role มีผลเต็มหลัง refresh token"],
    ears: "WHEN admin พยายามลด role ของบัญชีตัวเอง THE SYSTEM SHALL ปฏิเสธด้วย HTTP 400 เพื่อกันระบบล็อก admin คนสุดท้ายออก"
  }
];
