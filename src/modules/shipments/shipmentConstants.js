// ==================== SHIPMENT CONSTANTS ====================
// All dropdown data, sample records, and configuration from CreateShipment_AllModes_v2.html

export const PRODUCT_CONFIG = {
  LPG:       { icon: '🔥', badge: 'bg-orange-50 text-orange-700', label: 'LPG',           shipType: '0602', unit: 'kg',  truckClass: 'lpg-truck',       zlsde: 'ZLSDE003' },
  CHEM:      { icon: '🧪', badge: 'bg-purple-50 text-purple-700', label: 'Chemical',      shipType: '0603', unit: 'L',   truckClass: 'chem-truck',      zlsde: 'ZLSDE004' },
  FUEL:      { icon: '⛽',       badge: 'bg-blue-50 text-blue-700',     label: 'Fuel/WO',       shipType: '0605', unit: 'L',   truckClass: 'fuel-truck',      zlsde: 'ZLSDE017' },
  NGV:       { icon: '🟢', badge: 'bg-green-50 text-green-700',   label: 'NGV',           shipType: '0601', unit: 'm³', truckClass: 'ngv-truck',   zlsde: 'ZLSDE006' },
  CONTAINER: { icon: '📦', badge: 'bg-red-50 text-red-700',       label: 'Container',     shipType: '0606', unit: 'TEU', truckClass: 'container-truck', zlsde: 'ZLSDE015' },
  SCA:       { icon: '🚗', badge: 'bg-amber-50 text-amber-700',   label: 'Car Carrier',   shipType: '1400', unit: 'คัน', truckClass: 'sca-truck', zlsde: 'ZLSDE012' },
};

export function pCfg(code) {
  return PRODUCT_CONFIG[code] || PRODUCT_CONFIG.LPG;
}

// ==================== BU OPTIONS ====================
export const BU_OPTIONS = [
  { value: 'SCC', label: 'SCC — SC Carrier' },
  { value: 'SCA', label: 'SCA — SC Alliance' },
];

// ==================== PRODUCT TYPE OPTIONS ====================
export const PRODUCT_TYPE_OPTIONS = [
  { value: 'LPG',       label: '🔥 LPG' },
  { value: 'CHEM',      label: '🧪 Chemical' },
  { value: 'FUEL',      label: '⛽ Fuel / WO (น้ำมันใส)' },
  { value: 'NGV',       label: '🟢 NGV' },
  { value: 'CONTAINER', label: '📦 Container' },
  { value: 'SCA',       label: '🚗 Car Carrier (SCA)' },
];

// ==================== SITE OPTIONS ====================
export const SITE_OPTIONS = [
  { value: '060B', label: '060B — COC-FUEL-LLK' },
  { value: '060C', label: '060C — ATLAS-LPG-BPK' },
  { value: '060E', label: '060E — ATLAS-LPG-NKC' },
  { value: '060U', label: '060U — ATLAS-BSRC-SRC' },
  { value: '060J', label: '060J — SHELL-FUEL-KKN' },
  { value: '060L', label: '060L — SHELL-FUEL-KBI' },
  { value: '060N', label: '060N — INC-CHEM-BRP' },
  { value: '0631', label: '0631 — COC-LPG-BRP' },
  { value: '0632', label: '0632 — PTTOR-PROPANE' },
  { value: '0633', label: '0633 — ATLAS-LPG-SRC' },
  { value: '0634', label: '0634 — PTTOR-LPG-COD-BRP' },
  { value: '0636', label: '0636 — PTTGC-C3-BRP' },
  { value: '0637', label: '0637 — PTTGC-HA-BRP' },
  { value: '0639', label: '0639 — ZEON-RAFFINATE' },
  { value: '0656', label: '0656 — CMI-CHEM-SSK' },
  { value: '0670', label: '0670 — PTTGC-CX-BRP' },
  { value: '0675', label: '0675 — COC-LPG-NKC' },
];

// ==================== 25 SHIPMENT TYPE OPTIONS ====================
export const SHIPMENT_TYPE_OPTIONS = [
  { value: '0001', label: '0001 — Indiv.Shipmt - Road' },
  { value: '0002', label: '0002 — Collct.Shipmt - Road' },
  { value: '0003', label: '0003 — Collective Shipment' },
  { value: '0004', label: '0004 — Prelim. leg by road' },
  { value: '0005', label: '0005 — Main leg by sea' },
  { value: '0006', label: '0006 — Subseq. leg by road' },
  { value: '0010', label: '0010 — Inbound Shipment' },
  { value: '0101', label: '0101 — SCGL – Costal Feeder' },
  { value: '0102', label: '0102 — SCGL – River Feeder' },
  { value: '0103', label: '0103 — SCGL - Truck' },
  { value: '0201', label: '0201 — SCM – Habour BKK' },
  { value: '0202', label: '0202 — SCM – Habour MTP' },
  { value: '0601', label: '0601 — SCC-NGV' },
  { value: '0602', label: '0602 — SCC-LPG' },
  { value: '0603', label: '0603 — SCC-CHEM' },
  { value: '0604', label: '0604 — SCC-Ammonia' },
  { value: '0605', label: '0605 — SCC-Fuel' },
  { value: '0606', label: '0606 — SCC-Special Container' },
  { value: '0607', label: '0607 — SCC-Internal Job' },
  { value: '0608', label: '0608 — SCC-Industrial GAS' },
  { value: '0609', label: '0609 — SCC-Other' },
  { value: '0800', label: '0800 — NPM-Harbor Service' },
  { value: '0801', label: '0801 — NPM– Coastal Feeder' },
  { value: '1200', label: '1200 — SPL - Truck' },
  { value: '1400', label: '1400 — SCA - Truck' },
  { value: '1500', label: '1500 — SCH - Gas Vessel' },
  { value: '1700', label: '1700 — PKR - Truck' },
];

// ==================== 30 SHIPPING TYPE OPTIONS ====================
export const SHIPPING_TYPE_OPTIONS = [
  { value: '01', label: '01 — Truck' },
  { value: '02', label: '02 — Mail' },
  { value: '03', label: '03 — Rail' },
  { value: '04', label: '04 — Sea' },
  { value: '61', label: '61 — งานปกติ' },
  { value: '62', label: '62 — งานโอนคลัง' },
  { value: '63', label: '63 — งานเติมเก็บ' },
  { value: '64', label: '64 — งานกิ่ง' },
  { value: '65', label: '65 — งานCommissioning' },
  { value: '66', label: '66 — งานคาลิเบท' },
  { value: '67', label: '67 — เปลี่ยนแปลงสถานีแม่' },
  { value: '68', label: '68 — เพิ่มตู้เข้าสถานีแม่' },
  { value: '69', label: '69 — ลากตู้ NGV ตรวจสภาพ' },
  { value: '6A', label: '6A — งานดูดก๊าซ' },
  { value: '6B', label: '6B — Test Bulk' },
  { value: '6C', label: '6C — นำรถเข้าศูนย์' },
  { value: '6D', label: '6D — งานนำรถ เติมน้ำมัน' },
  { value: '6E', label: '6E — งานวิ่งลงคิว' },
  { value: '6F', label: '6F — งานลากรถเสีย' },
  { value: '6G', label: '6G — งานย้ายรถ/งานทอยตู้' },
  { value: '6H', label: '6H — งานนำรถ ล้างถัง(TOP)' },
  { value: '6I', label: '6I — งาน Adhoc' },
  { value: '6J', label: '6J — งาน Replace' },
  { value: '6K', label: '6K — งานรับรถชั่วโมงหมด' },
  { value: '6L', label: '6L — ลงน้ำมันถังคลัง Esso' },
  { value: '6M', label: '6M — นำรถเข้าตรวจสภาพ' },
  { value: '6N', label: '6N — นำรถเข้าอู่' },
  { value: '6O', label: '6O — นำรถมาซ่อมที่ BRP' },
  { value: '6P', label: '6P — ใช้รถทดสอบ พขร.' },
  { value: '6Q', label: '6Q — RETURN PRODUCT' },
  { value: '6R', label: '6R — กิจกรรมอื่นๆ' },
  { value: 'HI', label: 'HI — Harbor Serv. Inside' },
  { value: 'HO', label: 'HO — Harbor Serv. Outside' },
  { value: 'OF', label: 'OF — Offshore Serv.' },
  { value: 'OT', label: 'OT — MO Other' },
  { value: 'ZC', label: 'ZC — ยกเลิกเส้นทาง' },
];

// ==================== 12 ROUTE OPTIONS ====================
export const ROUTE_OPTIONS = [
  { value: '010001', label: '010001 — ท่าเรือแหลมฉบัง → ท่าเรือกรุงเทพ (121 km)', distance: 121 },
  { value: '010002', label: '010002 — ท่าเรือกรุงเทพ → ท่าเรือแหลมฉบัง (120 km)', distance: 120 },
  { value: '010003', label: '010003 — ท่าเรือแหลมฉบัง → ท่าเรือ NPM (765 km)', distance: 765 },
  { value: '010005', label: '010005 — BTC → ไทยเบฟ → BTC (311 km)', distance: 311 },
  { value: '010006', label: '010006 — BTC → ไทยเบฟ → SCSC → BTC (413 km)', distance: 413 },
  { value: '010007', label: '010007 — BTC → LCH → ไทยเบฟ → SCSC → BTC (529 km)', distance: 529 },
  { value: '010011', label: '010011 — BTC → บุญรอดฯ → BTC (231 km)', distance: 231 },
  { value: '010014', label: '010014 — BTC → มหพันธ์ (ลพบุรี) → BTC (397 km)', distance: 397 },
  { value: '010024', label: '010024 — BTC → มิชลิน (หนองแค) → BTC (300 km)', distance: 300 },
  { value: '010027', label: '010027 — BTC → มิชลิน (หนองรี) → BTC (55 km)', distance: 55 },
  { value: '010029', label: '010029 — BTC → LCH (ตู้เปล่า) (124 km)', distance: 124 },
  { value: '010030', label: '010030 — BTC → LCH (ตู้หนัก) (124 km)', distance: 124 },
  { value: 'CUSTOM', label: '+ Create Custom Route...', distance: 0 },
];

// ==================== CUSTOM ROUTE STAGE OPTIONS ====================
export const CUSTOM_STAGE1_OPTIONS = [
  { value: '010007', label: '010007 — ท่าเรือบางปะกง' },
  { value: '010102', label: '010102 — LCH (แหลมฉบัง)' },
  { value: '010100', label: '010100 — ลานจอดแหลมฉบัง' },
  { value: '010005', label: '010005 — ท่าเรือกรุงเทพ' },
  { value: '010024', label: '010024 — ท่าเรือ NPM' },
  { value: '010011', label: '010011 — ท่าเรือ A0' },
];

export const CUSTOM_STAGE2_OPTIONS = [
  { value: '010025', label: '010025 — ไทยเบฟ (บางบาล)' },
  { value: '010026', label: '010026 — โรงงานแสงโสม (นครปฐม)' },
  { value: '010027', label: '010027 — โรงงานบุญรอด (ปทุมฯ)' },
  { value: '010028', label: '010028 — มหพันธ์ (ลพบุรี)' },
  { value: '010038', label: '010038 — มิชลิน (หนองแค)' },
  { value: '010039', label: '010039 — มิชลิน (หนองรี)' },
  { value: '010095', label: '010095 — SCSC' },
];

export const CUSTOM_STAGE3_OPTIONS = [
  { value: '010095', label: '010095 — SCSC' },
  { value: '010097', label: '010097 — ลาดกระบัง (ประตู4)' },
  { value: '010011', label: '010011 — ท่าเรือ A0' },
  { value: '010018', label: '010018 — ท่าเรือ B2' },
];

export const CUSTOM_STAGE4_OPTIONS = [
  { value: '010007', label: '010007 — ท่าเรือบางปะกง' },
  { value: '010102', label: '010102 — LCH (แหลมฉบัง)' },
  { value: '010100', label: '010100 — ลานจอดแหลมฉบัง' },
];

// ==================== YARD OPTIONS (Car Carrier) ====================
export const YARD_OPTIONS = [
  { value: '1401', label: '1401 — Bang Na KM.4' },
  { value: '1402', label: '1402 — Bang Na KM.4.5' },
  { value: '1403', label: '1403 — Bang Na KM.22' },
  { value: '1406', label: '1406 — Nissan' },
  { value: '1408', label: '1408 — YARD NO. ATL KM.19' },
  { value: '1410', label: '1410 — อู่ CIMC อมตะซิตี้' },
  { value: '1411', label: '1411 — SCA สงขลา' },
  { value: '1414', label: '1414 — ศักดิ์สยาม(สกลนคร)' },
  { value: '1415', label: '1415 — SCA KM.19' },
  { value: '1416', label: '1416 — SCA SRT' },
];

// ==================== NGV QUALITY STATION OPTIONS ====================
export const NGV_QUALITY_STATIONS = [
  'ก่อนเติม',
  'หลังเติม',
  'ก่อนจ่าย',
  'หลังจ่าย',
];

// ==================== TRANSPORT FEE OPTIONS (SCA) ====================
export const SCA_TRANSPORT_FEE_OPTIONS = [
  { value: 'Y เก็บ', label: 'Y เก็บ (Collect)' },
  { value: 'Y เก็บ(SO.ตรง)', label: 'Y เก็บเปิด SO.ตรง' },
  { value: 'N ไม่เก็บ', label: 'N ไม่เก็บ (No Collect)' },
];

export const SCA_TRIP_PAY_OPTIONS = [
  { value: 'Y จ่าย', label: 'Y จ่าย (Pay)' },
  { value: 'N ไม่จ่าย', label: 'N ไม่จ่าย (No Pay)' },
];

// ==================== SAMPLE APPROVED FOs ====================
export const APPROVED_FOS = [
  { id: 'FO-2026-0001', product: 'LPG', bu: 'SCC', site: '060C', siteName: 'ATLAS-LPG-BPK', route: '010005', routeName: 'BTC-ไทยเบฟ-BTC', customer: 'ไทยเบฟ (บางบาล)', shipTo: '010025', qty: '15,000 kg', date: '05.02.2026', wbs: '08S.26CF.BPK.001', status: 'CONFIRMED' },
  { id: 'FO-2026-0002', product: 'LPG', bu: 'SCC', site: '060C', siteName: 'ATLAS-LPG-BPK', route: '010005', routeName: 'BTC-ไทยเบฟ-BTC', customer: 'ไทยเบฟ (บางบาล)', shipTo: '010025', qty: '12,000 kg', date: '05.02.2026', wbs: '08S.26CF.BPK.002', status: 'CONFIRMED' },
  { id: 'FO-2026-0003', product: 'LPG', bu: 'SCC', site: '060C', siteName: 'ATLAS-LPG-BPK', route: '010011', routeName: 'BTC-บุญรอดฯ-BTC', customer: 'โรงงานบุญรอด (ปทุมฯ)', shipTo: '010027', qty: '8,000 kg', date: '05.02.2026', wbs: '08S.26CF.BPK.003', status: 'OPEN' },
  { id: 'FO-2026-0004', product: 'CHEM', bu: 'SCC', site: '060N', siteName: 'INC-CHEM-BRP', route: '010014', routeName: 'BTC-มหพันธ์-BTC', customer: 'มหพันธ์ (ลพบุรี)', shipTo: '010028', qty: '20,000 L', date: '05.02.2026', wbs: '08S.26CF.BRP.001', status: 'CONFIRMED' },
  { id: 'FO-2026-0005', product: 'LPG', bu: 'SCC', site: '060U', siteName: 'ATLAS-BSRC-SRC', route: '010024', routeName: 'BTC-มิชลิน(หนองแค)-BTC', customer: 'มิชลิน (หนองแค)', shipTo: '010038', qty: '18,000 kg', date: '06.02.2026', wbs: '08S.26CF.SRC.001', status: 'OPEN' },
  { id: 'FO-2026-0006', product: 'CHEM', bu: 'SCC', site: '0637', siteName: 'PTTGC-HA-BRP', route: '010001', routeName: 'LCH-ท่าเรือกรุงเทพ', customer: 'ท่าเรือกรุงเทพ', shipTo: '010005', qty: '25,000 L', date: '06.02.2026', wbs: '08S.26CF.BRP.002', status: 'CONFIRMED' },
  { id: 'FO-2026-0007', product: 'LPG', bu: 'SCC', site: '0631', siteName: 'COC-LPG-BRP', route: '010005', routeName: 'BTC-ไทยเบฟ-BTC', customer: 'ไทยเบฟ (บางบาล)', shipTo: '010025', qty: '10,000 kg', date: '05.02.2026', wbs: '08S.26CF.BRP.003', status: 'OPEN' },
  { id: 'FO-2026-0008', product: 'FUEL', bu: 'SCC', site: '060B', siteName: 'COC-FUEL-LLK', route: '020110', routeName: 'BRP-Shell สระบุรี-BRP', customer: 'Shell (สระบุรี)', shipTo: '020015', qty: '36,000 L', date: '06.02.2026', wbs: '06L.35015.51', status: 'CONFIRMED' },
  { id: 'FO-2026-0009', product: 'FUEL', bu: 'SCC', site: '060B', siteName: 'COC-FUEL-LLK', route: '020205', routeName: 'SRT-PTTOR คลังสระบุรี-SRT', customer: 'PTTOR คลังสระบุรี', shipTo: '020018', qty: '40,000 L', date: '06.02.2026', wbs: '06L.33015.61', status: 'OPEN' },
  { id: 'FO-2026-0010', product: 'FUEL', bu: 'SCC', site: '060B', siteName: 'COC-FUEL-LLK', route: '020301', routeName: 'LLK-Bangchak ลาดกระบัง-LLK', customer: 'Bangchak (ลาดกระบัง)', shipTo: '020022', qty: '32,000 L', date: '07.02.2026', wbs: '06L.34015.75', status: 'CONFIRMED' },
  { id: 'FO-2026-0011', product: 'NGV', bu: 'SCC', site: '060U', siteName: 'PTT-NGV-SRT', route: '030101', routeName: 'SRT-PTT NGV สถานี บางนา-SRT', customer: 'PTT NGV บางนา', shipTo: '030010', qty: '8,500 m³', date: '06.02.2026', wbs: '06L.42015.01', status: 'OPEN' },
  { id: 'FO-2026-0012', product: 'NGV', bu: 'SCC', site: '060U', siteName: 'PTT-NGV-SRT', route: '030205', routeName: 'SRT-PTT NGV ปทุมธานี-SRT', customer: 'PTT NGV ปทุมธานี', shipTo: '030015', qty: '9,200 m³', date: '07.02.2026', wbs: '06L.42015.02', status: 'CONFIRMED' },
  { id: 'FO-2026-0013', product: 'CONTAINER', bu: 'SCC', site: '060N', siteName: 'SPL-CONTAINER-LCB', route: '010001', routeName: 'LCB-ท่าเรือกรุงเทพ', customer: 'Evergreen Line', shipTo: '010005', qty: '2 x 40ft HC', date: '06.02.2026', wbs: '06L.61015.01', status: 'CONFIRMED' },
  { id: 'FO-2026-0014', product: 'CONTAINER', bu: 'SCC', site: '060N', siteName: 'SPL-CONTAINER-LCB', route: '010002', routeName: 'ท่าเรือกรุงเทพ-LCB', customer: 'ONE Line', shipTo: '010102', qty: '1 x 20ft GP', date: '07.02.2026', wbs: '06L.61015.02', status: 'OPEN' },
  { id: 'FO-2026-0015', product: 'CONTAINER', bu: 'SCC', site: '060N', siteName: 'SPL-CONTAINER-LCB', route: '010003', routeName: 'LCB-ท่าเรือ NPM', customer: 'Hapag-Lloyd', shipTo: '010024', qty: '3 x 40ft GP', date: '06.02.2026', wbs: '06L.61015.03', status: 'CONFIRMED' },
  { id: 'FO-2026-0016', product: 'SCA', bu: 'SCA', site: '060N', siteName: 'SCA-CARRIER-LPK', route: '040101', routeName: 'LPK-Toyota บ้านโพธิ์-LPK', customer: 'Toyota Motor Thailand', shipTo: '040010', qty: '8 คัน', date: '06.02.2026', wbs: '06L.62015.01', status: 'CONFIRMED' },
  { id: 'FO-2026-0017', product: 'SCA', bu: 'SCA', site: '060N', siteName: 'SCA-CARRIER-LPK', route: '040205', routeName: 'LPK-Isuzu สมุทรปราการ-LPK', customer: 'Tri Petch Isuzu', shipTo: '040015', qty: '6 คัน', date: '07.02.2026', wbs: '06L.62015.02', status: 'OPEN' },
];

// ==================== SAMPLE SHIPMENTS ====================
export const SAMPLE_SHIPMENTS = [
  { id: 'SHP-2026-001', status: 'OPEN', product: 'LPG', route: '010005', routeName: 'BTC-ไทยเบฟ-BTC', truck: '83-0569', trailer: '83-1069', vehicleNo: 'VH-830569', truckType: 'LPG Tanker 18T', driver1: 'EMP001', driver1Name: 'สมชาย ใจดี', fos: ['FO-2026-0001','FO-2026-0002'], created: '04.02.2026', totalQty: '27,000 kg', bu: 'SCC', site: '060C' },
  { id: 'SHP-2026-002', status: 'OPEN', product: 'LPG', route: '010011', routeName: 'BTC-บุญรอดฯ-BTC', truck: '83-0571', trailer: '83-1071', vehicleNo: 'VH-830571', truckType: 'LPG Tanker 20T', driver1: 'EMP002', driver1Name: 'สมหญิง รักดี', fos: ['FO-2026-0003'], created: '04.02.2026', totalQty: '8,000 kg', bu: 'SCC', site: '060C' },
  { id: 'SHP-2026-003', status: 'DISPATCHED', product: 'CHEM', route: '010014', routeName: 'BTC-มหพันธ์-BTC', truck: '84-0601', trailer: '84-1101', vehicleNo: 'VH-840601', truckType: 'Chemical Tank 25T', driver1: 'EMP003', driver1Name: 'วิชัย เก่งมาก', fos: ['FO-2026-0004'], created: '03.02.2026', totalQty: '20,000 L', bu: 'SCC', site: '060N' },
  { id: 'SHP-2026-004', status: 'COMPLETED', product: 'LPG', route: '010024', routeName: 'BTC-มิชลิน-BTC', truck: '83-0575', trailer: '83-1075', vehicleNo: 'VH-830575', truckType: 'LPG Tanker 15T', driver1: 'EMP004', driver1Name: 'ประยุทธ์ แข็งแรง', fos: ['FO-2026-0005'], created: '02.02.2026', totalQty: '18,000 kg', bu: 'SCC', site: '060U' },
  { id: 'SHP-2026-005', status: 'OPEN', product: 'FUEL', route: '020110', routeName: 'BRP-Shell สระบุรี-BRP', truck: '71-5432', trailer: '71-9432', vehicleNo: 'VH-715432', truckType: 'Oil Tanker 36KL', driver1: 'EMP005', driver1Name: 'อนุชา พลเดช', fos: ['FO-2026-0008'], created: '05.02.2026', totalQty: '36,000 L', bu: 'SCC', site: '060B' },
  { id: 'SHP-2026-006', status: 'DISPATCHED', product: 'FUEL', route: '020205', routeName: 'SRT-PTTOR คลังสระบุรี-SRT', truck: '71-5440', trailer: '71-9440', vehicleNo: 'VH-715440', truckType: 'Oil Tanker 40KL', driver1: 'EMP006', driver1Name: 'ธนกฤต สุขใจ', fos: ['FO-2026-0009'], created: '04.02.2026', totalQty: '40,000 L', bu: 'SCC', site: '060B' },
  { id: 'SHP-2026-007', status: 'OPEN', product: 'NGV', route: '030101', routeName: 'SRT-PTT NGV บางนา-SRT', truck: '68-2200', trailer: '', vehicleNo: 'VH-682200', truckType: 'NGV Tube Trailer', driver1: 'EMP007', driver1Name: 'วรพจน์ มั่นคง', fos: ['FO-2026-0011'], created: '05.02.2026', totalQty: '8,500 m³', bu: 'SCC', site: '060U' },
  { id: 'SHP-2026-008', status: 'DISPATCHED', product: 'NGV', route: '030205', routeName: 'SRT-PTT NGV ปทุมธานี-SRT', truck: '68-2210', trailer: '', vehicleNo: 'VH-682210', truckType: 'NGV Tube Trailer', driver1: 'EMP008', driver1Name: 'ศักดิ์ชัย ดำรง', fos: ['FO-2026-0012'], created: '04.02.2026', totalQty: '9,200 m³', bu: 'SCC', site: '060U' },
  { id: 'SHP-2026-009', status: 'OPEN', product: 'CONTAINER', route: '010001', routeName: 'LCB-ท่าเรือกรุงเทพ', truck: '70-3300', trailer: '70-CH01', vehicleNo: 'VH-703300', truckType: 'Container Chassis 40ft', driver1: 'EMP009', driver1Name: 'พิชิต ท่าเรือ', fos: ['FO-2026-0013'], created: '05.02.2026', totalQty: '2 x 40ft HC', bu: 'SCC', site: '060N' },
  { id: 'SHP-2026-010', status: 'COMPLETED', product: 'CONTAINER', route: '010003', routeName: 'LCB-ท่าเรือ NPM', truck: '70-3310', trailer: '70-CH02', vehicleNo: 'VH-703310', truckType: 'Container Chassis 40ft', driver1: 'EMP010', driver1Name: 'สุรเดช ขนส่ง', fos: ['FO-2026-0015'], created: '03.02.2026', totalQty: '3 x 40ft GP', bu: 'SCC', site: '060N' },
  { id: 'SHP-2026-011', status: 'OPEN', product: 'SCA', route: '040101', routeName: 'LPK-Toyota บ้านโพธิ์-LPK', truck: '72-8800', trailer: '72-CC01', vehicleNo: 'VH-728800', truckType: 'Car Carrier 8-unit', driver1: 'EMP011', driver1Name: 'ชัยวัฒน์ รถยนต์', fos: ['FO-2026-0016'], created: '05.02.2026', totalQty: '8 คัน', bu: 'SCA', site: '060N' },
  { id: 'SHP-2026-012', status: 'DISPATCHED', product: 'SCA', route: '040205', routeName: 'LPK-Isuzu สมุทรปราการ-LPK', truck: '72-8810', trailer: '72-CC02', vehicleNo: 'VH-728810', truckType: 'Car Carrier 6-unit', driver1: 'EMP012', driver1Name: 'เอกชัย ส่งรถ', fos: ['FO-2026-0017'], created: '04.02.2026', totalQty: '6 คัน', bu: 'SCA', site: '060N' },
];

// ==================== FLEET/TRUCK DATA ====================
export const FLEET_DATA = [
  { id: 'T1', plate: '83-0569', trailer: '83-1069', vehicleNo: 'VH-830569', type: 'LPG Tanker 18T', product: 'LPG', capacity: '18,000 kg', location: 'BPK Depot', lastDate: '03.02.2026', status: 'available' },
  { id: 'T2', plate: '83-0571', trailer: '83-1071', vehicleNo: 'VH-830571', type: 'LPG Tanker 20T', product: 'LPG', capacity: '20,000 kg', location: 'SRC Depot', lastDate: '02.02.2026', status: 'available' },
  { id: 'T3', plate: '83-0575', trailer: '83-1075', vehicleNo: 'VH-830575', type: 'LPG Tanker 15T', product: 'LPG', capacity: '15,000 kg', location: 'BPK Depot', lastDate: '01.02.2026', status: 'available' },
  { id: 'T4', plate: '84-0601', trailer: '84-1101', vehicleNo: 'VH-840601', type: 'Chemical Tank 25T', product: 'CHEM', capacity: '25,000 L', location: 'BRP Depot', lastDate: '03.02.2026', status: 'available' },
  { id: 'T5', plate: '84-0605', trailer: '84-1105', vehicleNo: 'VH-840605', type: 'Chemical ISO Tank', product: 'CHEM', capacity: '20,000 L', location: 'MTP Depot', lastDate: '02.02.2026', status: 'available' },
  { id: 'T6', plate: '71-5432', trailer: '71-9432', vehicleNo: 'VH-715432', type: 'Oil Tanker 36KL', product: 'FUEL', capacity: '36,000 L', location: 'BRP Depot', lastDate: '04.02.2026', status: 'available' },
  { id: 'T7', plate: '71-5440', trailer: '71-9440', vehicleNo: 'VH-715440', type: 'Oil Tanker 40KL', product: 'FUEL', capacity: '40,000 L', location: 'SRT Depot', lastDate: '03.02.2026', status: 'available' },
  { id: 'T8', plate: '68-2200', trailer: '', vehicleNo: 'VH-682200', type: 'NGV Tube Trailer', product: 'NGV', capacity: '8,500 m³', location: 'SRT Depot', lastDate: '04.02.2026', status: 'available' },
  { id: 'T9', plate: '68-2210', trailer: '', vehicleNo: 'VH-682210', type: 'NGV Tube Trailer', product: 'NGV', capacity: '9,200 m³', location: 'SRT Depot', lastDate: '03.02.2026', status: 'available' },
  { id: 'T10', plate: '70-3300', trailer: '70-CH01', vehicleNo: 'VH-703300', type: 'Container Chassis 40ft', product: 'CONTAINER', capacity: '2 x 20ft / 1 x 40ft', location: 'LCB', lastDate: '04.02.2026', status: 'available' },
  { id: 'T11', plate: '70-3310', trailer: '70-CH02', vehicleNo: 'VH-703310', type: 'Container Chassis 40ft', product: 'CONTAINER', capacity: '2 x 20ft / 1 x 40ft', location: 'BKK Port', lastDate: '03.02.2026', status: 'available' },
  { id: 'T12', plate: '85-0701', trailer: '85-1201', vehicleNo: 'VH-850701', type: 'Container 40ft', product: 'CONTAINER', capacity: '1 x 40ft', location: 'LCB', lastDate: '03.02.2026', status: 'in_use' },
  { id: 'T13', plate: '72-8800', trailer: '72-CC01', vehicleNo: 'VH-728800', type: 'Car Carrier 8-unit', product: 'SCA', capacity: '8 cars', location: 'LPK', lastDate: '04.02.2026', status: 'available' },
  { id: 'T14', plate: '72-8810', trailer: '72-CC02', vehicleNo: 'VH-728810', type: 'Car Carrier 6-unit', product: 'SCA', capacity: '6 cars', location: 'LPK', lastDate: '03.02.2026', status: 'available' },
];

// ==================== EMPLOYEE DATA ====================
export const EMPLOYEE_DATA = [
  { id: 'EMP001', name: 'สมชาย ใจดี', phone: '081-234-5678', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'EMP002', name: 'สมหญิง รักดี', phone: '081-345-6789', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'EMP003', name: 'วิชัย เก่งมาก', phone: '081-456-7890', role: 'driver', intern: false, license: 'ใบอนุญาต ท.3', licenseValid: true },
  { id: 'EMP004', name: 'ประยุทธ์ แข็งแรง', phone: '081-567-8901', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'EMP005', name: 'อนุชา พลเดช', phone: '082-123-4567', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'EMP006', name: 'ธนกฤต สุขใจ', phone: '082-234-5678', role: 'driver', intern: true, license: 'ใบอนุญาต ท.3', licenseValid: true },
  { id: 'EMP007', name: 'วรพจน์ มั่นคง', phone: '082-345-6789', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'EMP008', name: 'ศักดิ์ชัย ดำรง', phone: '083-123-4567', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'EMP009', name: 'พิชิต ท่าเรือ', phone: '083-234-5678', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'EMP010', name: 'สุรเดช ขนส่ง', phone: '083-345-6789', role: 'driver', intern: false, license: 'ใบอนุญาต ท.3', licenseValid: false },
  { id: 'EMP011', name: 'ชัยวัฒน์ รถยนต์', phone: '084-123-4567', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'EMP012', name: 'เอกชัย ส่งรถ', phone: '084-234-5678', role: 'driver', intern: false, license: 'ใบอนุญาต ท.4', licenseValid: true },
  { id: 'HLP001', name: 'จักรี ช่วยเหลือ', phone: '085-123-4567', role: 'helper', intern: false, license: null, licenseValid: false },
  { id: 'HLP002', name: 'สมศักดิ์ พิทักษ์', phone: '085-234-5678', role: 'helper', intern: true, license: null, licenseValid: false },
];

// ==================== CAR CARRIER POSITION LAYOUT ====================
export const SCA_POSITIONS = {
  upper: ['U1', 'U2', 'U3', 'U4', 'U5', 'U6'],
  lower: ['L1', 'L2', 'L3', 'L4', 'L5'],
};

export const SAMPLE_CAR_CARRIER_VEHICLES = [
  { pos: 'U1', vin: '202512-XH0672', model: 'Hilux Revo', engine: '', color: 'White', soldTo: '1100297', dealer: 'บจก.โตโยต้า ทรานสปอร์ต', shipTo: '9140343', shipToName: 'LCB โตโยต้าแหลมฉบัง', calling: '', returnCar: false },
  { pos: 'U2', vin: '202512-XH0673', model: 'Hilux Revo', engine: '', color: 'White', soldTo: '1100297', dealer: 'บจก.โตโยต้า ทรานสปอร์ต', shipTo: '9140343', shipToName: 'LCB โตโยต้าแหลมฉบัง', calling: '', returnCar: false },
  { pos: 'U3', vin: '202512-XH0674', model: 'Hilux Revo', engine: '', color: 'Silver', soldTo: '1100297', dealer: 'บจก.โตโยต้า ทรานสปอร์ต', shipTo: '9140343', shipToName: 'LCB โตโยต้าแหลมฉบัง', calling: '', returnCar: false },
  { pos: 'U4', vin: '202512-XH0675', model: 'Hilux Revo', engine: '', color: 'Red', soldTo: '1100297', dealer: 'บจก.โตโยต้า ทรานสปอร์ต', shipTo: '9140343', shipToName: 'LCB โตโยต้าแหลมฉบัง', calling: '', returnCar: false },
  { pos: 'U5', vin: '202512-XH0676', model: 'Hilux Revo', engine: '', color: 'White', soldTo: '1100297', dealer: 'บจก.โตโยต้า ทรานสปอร์ต', shipTo: '9140343', shipToName: 'LCB โตโยต้าแหลมฉบัง', calling: '', returnCar: false },
  { pos: 'L1', vin: '202512-XH0677', model: 'Hilux Revo', engine: '', color: 'Black', soldTo: '1100297', dealer: 'บจก.โตโยต้า ทรานสปอร์ต', shipTo: '9140343', shipToName: 'LCB โตโยต้าแหลมฉบัง', calling: '', returnCar: false },
  { pos: 'L2', vin: '202512-XH0678', model: 'Hilux Revo', engine: '', color: 'White', soldTo: '1100297', dealer: 'บจก.โตโยต้า ทรานสปอร์ต', shipTo: '9140343', shipToName: 'LCB โตโยต้าแหลมฉบัง', calling: '', returnCar: false },
  { pos: 'L3', vin: '202512-XH0679', model: 'Hilux Revo', engine: '', color: 'Gray', soldTo: '1100297', dealer: 'บจก.โตโยต้า ทรานสปอร์ต', shipTo: '9140343', shipToName: 'LCB โตโยต้าแหลมฉบัง', calling: '', returnCar: false },
];
