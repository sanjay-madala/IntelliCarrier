// Product configuration
export const productConfig = {
  LPG:       { icon: '🔥', badge: 'badge-lpg',       label: 'LPG',           shipType: '0602', unit: 'kg',  truckType: 'LPG Tanker' },
  CHEM:      { icon: '🧪', badge: 'badge-chem',      label: 'Chemical',      shipType: '0603', unit: 'L',   truckType: 'Chemical Tank' },
  FUEL:      { icon: '⛽', badge: 'badge-fuel',       label: 'Fuel/WO',       shipType: '0605', unit: 'L',   truckType: 'Oil Tanker' },
  NGV:       { icon: '🟢', badge: 'badge-ngv',        label: 'NGV',           shipType: '0601', unit: 'm³',  truckType: 'NGV Tube Trailer' },
  CONTAINER: { icon: '📦', badge: 'badge-container',  label: 'Container',     shipType: 'ML',   unit: 'TEU', truckType: 'Container Chassis' },
  SCA:       { icon: '🚗', badge: 'badge-sca',        label: 'Car Carrier',   shipType: '00',   unit: 'คัน', truckType: 'Car Carrier' },
  GENERAL:   { icon: '📋', badge: 'badge-general',    label: 'General Cargo', shipType: '0610', unit: 'pcs', truckType: 'General' },
  TUG:       { icon: '🚢', badge: 'badge-tug',        label: 'Tug Service',   shipType: 'TUG',  unit: 'Job', truckType: 'Tug Boat' },
};

// FO Status Config (9 statuses)
export const foStatusConfig = {
  PENDING_REVIEW:    { label: 'Pending Review',    css: 'bg-amber-50 text-amber-700',    icon: '⏳', canReview: true },
  REVIEWED:          { label: 'Validated',          css: 'bg-blue-50 text-blue-700',      icon: '✔',  canConfirm: true },
  OPEN:              { label: 'Open',               css: 'bg-green-50 text-green-700',    icon: '📂', canCreateShipment: true },
  CONFIRMED:         { label: 'Confirmed',          css: 'bg-teal-50 text-teal-700',      icon: '🚛', canCreateShipment: true },
  REVISION_REQUIRED: { label: 'Needs Correction',   css: 'bg-orange-50 text-orange-700',  icon: '🔄', canReview: true },
  SHIPMENT_CREATED:  { label: 'Shipment Created',   css: 'bg-indigo-50 text-indigo-700',  icon: '📋', canDispatch: true },
  DISPATCHED:        { label: 'Dispatched',          css: 'bg-purple-50 text-purple-700',  icon: '🚀', canReportIn: true },
  REPORT_IN:         { label: 'Report-In',           css: 'bg-cyan-50 text-cyan-700',      icon: '📥', canClose: true },
  CLOSED:            { label: 'Closed',              css: 'bg-gray-100 text-gray-600',     icon: '✅' },
};

// Channel availability by BU-Product
export const channelsByProduct = {
  'SCC-Fuel':      ['excel', 'pdf', 'tms', 'email', 'line'],
  'SCC-NGV':       ['excel', 'line', 'form'],
  'SCC-LPG':       ['excel', 'pdf'],
  'SCC-Chem':      ['form', 'manual', 'email'],
  'SCA-Car':       ['excel', 'manual'],
  'SPL-Container': ['manual'],
};

// Channel definitions
export const channelDefs = {
  excel:    { icon: '📊', key: 'excel',    action: 'upload' },
  pdf:      { icon: '📄', key: 'pdf',      action: 'upload' },
  tms:      { icon: '🔗', key: 'tms',      action: 'tms' },
  email:    { icon: '📧', key: 'email',    action: 'upload' },
  line:     { icon: '💬', key: 'line',      action: 'upload' },
  form:     { icon: '📝', key: 'form',      action: 'form' },
  manual:   { icon: '✏️', key: 'manual',    action: 'form' },
  forecast: { icon: '🚢', key: 'forecast',  action: 'upload' },
};

// Product type map for BU dropdown
export const productTypeMap = {
  SCC: ['LPG', 'CHEM', 'FUEL', 'NGV'],
  SCA: ['SCA'],
  SPL: ['CONTAINER'],
};

// Miles checking config
export const milesConfig = {
  '001': 50,
  '002': 10,
  '003': 0.15,
  '004': 100,
  '005': true,
};

// Source config for badges
export const sourceConfig = {
  'PDF Upload':      { icon: '📄', color: 'bg-blue-100 text-blue-700' },
  'Email RPA':       { icon: '📧', color: 'bg-purple-100 text-purple-700' },
  'TMS API':         { icon: '🔗', color: 'bg-green-100 text-green-700' },
  'Manual Entry':    { icon: '✏️', color: 'bg-gray-100 text-gray-700' },
  'Excel Upload':    { icon: '📊', color: 'bg-emerald-100 text-emerald-700' },
  'Forecast Upload': { icon: '🚢', color: 'bg-cyan-100 text-cyan-700' },
};

// Status config for shipment badges
export const statusConfig = {
  OPEN:       { label: 'Open',       color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  DISPATCHED: { label: 'Dispatched', color: 'bg-blue-100 text-blue-800',     dot: 'bg-blue-400' },
  REPORT_IN:  { label: 'Report-In',  color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-400' },
  COMPLETED:  { label: 'Completed',  color: 'bg-green-100 text-green-800',   dot: 'bg-green-400' },
};

// Fields by product type (for shipment form)
export const fieldsByProduct = {
  LPG:       ['route', 'wbs', 'plant', 'shippingType', 'truck', 'trailer', 'driver'],
  CHEM:      ['route', 'wbs', 'plant', 'shippingType', 'truck', 'trailer', 'driver', 'hazmatClass'],
  FUEL:      ['route', 'wbs', 'plant', 'shippingType', 'truck', 'trailer', 'driver', 'compartments'],
  NGV:       ['route', 'wbs', 'plant', 'shippingType', 'truck', 'trailer', 'driver', 'pressure'],
  CONTAINER: ['route', 'wbs', 'vessel', 'voyage', 'containerSize'],
  SCA:       ['route', 'wbs', 'truck', 'driver', 'vinScan'],
};

// LPG settlement columns (37 columns)
export const lpgCols = [
  { key: 'no',              label: 'No.',                  labelTh: 'ลำดับ',              show: true },
  { key: 'shipment',        label: 'Shipment',             labelTh: 'งานขนส่ง',           show: true },
  { key: 'stage',           label: 'Stage',                labelTh: 'Stage',              show: true },
  { key: 'soldTo',          label: 'Sold-To',              labelTh: 'ผู้ซื้อ',             show: true },
  { key: 'soldToName',      label: 'Sold-To Name',         labelTh: 'ชื่อผู้ซื้อ',         show: true },
  { key: 'shipTo',          label: 'Ship-To',              labelTh: 'จุดส่ง',              show: true },
  { key: 'shipToName',      label: 'Ship-To Name',         labelTh: 'ชื่อจุดส่ง',          show: true },
  { key: 'custDoc',         label: 'Cust. Doc',            labelTh: 'เอกสารลูกค้า',       show: true },
  { key: 'docDate',         label: 'Doc Date',             labelTh: 'วันที่เอกสาร',       show: true },
  { key: 'ticketQty',       label: 'Ticket Qty',           labelTh: 'ปริมาณหน้าตั๋ว',     show: true },
  { key: 'actualQty',       label: 'Actual Qty',           labelTh: 'ปริมาณจริง',         show: true },
  { key: 'billingQty',      label: 'Billing Qty',          labelTh: 'ปริมาณเรียกเก็บ',    show: true },
  { key: 'billingDate',     label: 'Billing Date',         labelTh: 'วันที่เรียกเก็บ',    show: true },
  { key: 'vehicleType',     label: 'Vehicle Type',         labelTh: 'ประเภทรถ',           show: true },
  { key: 'vehicleAge',      label: 'Vehicle Age',          labelTh: 'อายุรถ',             show: true },
  { key: 'billingDist',     label: 'Billing Dist (km)',    labelTh: 'ระยะเรียกเก็บ (กม.)', show: true },
  { key: 'actualDist',      label: 'Actual Dist (km)',     labelTh: 'ระยะจริง (กม.)',      show: true },
  { key: 'fuelPrice',       label: 'Fuel Price',           labelTh: 'ราคาน้ำมัน',         show: false },
  { key: 'fuel025',         label: 'Fuel 0.25',            labelTh: 'น้ำมัน 0.25',        show: false },
  { key: 'fuel050',         label: 'Fuel 0.50',            labelTh: 'น้ำมัน 0.50',        show: false },
  { key: 'fuel100',         label: 'Fuel 1.00',            labelTh: 'น้ำมัน 1.00',        show: false },
  { key: 'tripNo',          label: 'Trip No.',             labelTh: 'เลขเที่ยว',          show: true },
  { key: 'cannotUnload',    label: 'Cannot Unload',        labelTh: 'ลงก๊าซไม่ได้',       show: true },
  { key: 'serviceCode',     label: 'Service Code',         labelTh: 'รหัสบริการ',         show: false },
  { key: 'wbs',             label: 'WBS',                  labelTh: 'WBS',                show: false },
  { key: 'route',           label: 'Route',                labelTh: 'เส้นทาง',            show: false },
  { key: 'plate',           label: 'Plate No.',            labelTh: 'ทะเบียนรถ',          show: false },
  { key: 'trailer',         label: 'Trailer',              labelTh: 'หางลาก',             show: false },
  { key: 'driver',          label: 'Driver',               labelTh: 'คนขับ',              show: false },
  { key: 'qtyDiff',         label: 'Qty Diff',             labelTh: 'ผลต่างปริมาณ',       show: false },
  { key: 'distDiff',        label: 'Dist Diff',            labelTh: 'ผลต่างระยะทาง',      show: false },
  { key: 'ratePerKm',       label: 'Rate/km',              labelTh: 'อัตราต่อกม.',        show: false },
  { key: 'totalFreight',    label: 'Total Freight',        labelTh: 'ค่าขนส่งรวม',        show: false },
  { key: 'fuelSurcharge',   label: 'Fuel Surcharge',       labelTh: 'ค่าน้ำมันเพิ่ม',     show: false },
  { key: 'otherCharge',     label: 'Other Charge',         labelTh: 'ค่าใช้จ่ายอื่น',     show: false },
  { key: 'grandTotal',      label: 'Grand Total',          labelTh: 'ยอมรวมทั้งสิ้น',     show: false },
  { key: 'soNo',            label: 'SO No.',               labelTh: 'เลขที่ SO',          show: true },
];

// NGV settlement columns (18 columns)
export const ngvCols = [
  { key: 'no',              label: 'No.',                  labelTh: 'ลำดับ',              show: true },
  { key: 'shipment',        label: 'Shipment',             labelTh: 'งานขนส่ง',           show: true },
  { key: 'stage',           label: 'Stage',                labelTh: 'Stage',              show: true },
  { key: 'soldTo',          label: 'Sold-To',              labelTh: 'ผู้ซื้อ',             show: true },
  { key: 'soldToName',      label: 'Sold-To Name',         labelTh: 'ชื่อผู้ซื้อ',         show: true },
  { key: 'shipTo',          label: 'Ship-To',              labelTh: 'จุดส่ง',              show: true },
  { key: 'shipToName',      label: 'Ship-To Name',         labelTh: 'ชื่อจุดส่ง',          show: true },
  { key: 'soShipment',      label: 'SO Shipment',          labelTh: 'งานขนส่ง SO',        show: true },
  { key: 'item',            label: 'Item',                 labelTh: 'รายการ',             show: true },
  { key: 'material',        label: 'Material',             labelTh: 'วัสดุ',              show: true },
  { key: 'transportRate',   label: 'Transport Rate',       labelTh: 'อัตราขนส่ง',         show: true },
  { key: 'distance',        label: 'Distance (km)',        labelTh: 'ระยะทาง (กม.)',      show: true },
  { key: 'gasQty',          label: 'Gas Qty',              labelTh: 'ปริมาณก๊าซ',         show: true },
  { key: 'stationCost',     label: 'Station Cost',         labelTh: 'ค่าสถานี',           show: true },
  { key: 'totalCost',       label: 'Total Cost',           labelTh: 'ค่าใช้จ่ายรวม',      show: true },
  { key: 'distCategory',    label: 'Dist Category',        labelTh: 'ประเภทระยะทาง',      show: true },
  { key: 'rateInput',       label: 'Rate Input',           labelTh: 'อัตราที่ใส่',        show: true },
  { key: 'soNo',            label: 'SO No.',               labelTh: 'เลขที่ SO',          show: true },
];

// Mock routes (6+)
export const routes = [
  { id: 'R001', code: '010005', name: 'Bangkok → Chonburi', routeName: 'BTC-ชลบุรี-BTC', distance: 120, stages: [
    { n: 0, type: 'first',    origin: '—', dest: 'คลังก๊าซบางปะกง', stdDist: 0 },
    { n: 1, type: 'load',     origin: 'คลังก๊าซบางปะกง', dest: 'Laem Chabang', stdDist: 120 },
    { n: 2, type: 'last',     origin: 'Laem Chabang', dest: 'คลังก๊าซบางปะกง', stdDist: 120 },
  ]},
  { id: 'R002', code: '010010', name: 'Rayong → Saraburi', routeName: 'MTP-สระบุรี-MTP', distance: 230, stages: [
    { n: 0, type: 'first',    origin: '—', dest: 'Map Ta Phut', stdDist: 0 },
    { n: 1, type: 'load',     origin: 'Map Ta Phut', dest: 'Wang Muang', stdDist: 150 },
    { n: 2, type: 'customer', origin: 'Wang Muang', dest: 'Saraburi Depot', stdDist: 80 },
    { n: 3, type: 'last',     origin: 'Saraburi Depot', dest: 'Map Ta Phut', stdDist: 230 },
  ]},
  { id: 'R003', code: '010015', name: 'Bangkok → Nakhon Ratchasima', routeName: 'BKK-โคราช-BKK', distance: 260, stages: [
    { n: 0, type: 'first',    origin: '—', dest: 'Don Mueang', stdDist: 0 },
    { n: 1, type: 'load',     origin: 'Don Mueang', dest: 'Pak Chong', stdDist: 180 },
    { n: 2, type: 'customer', origin: 'Pak Chong', dest: 'Korat City', stdDist: 80 },
    { n: 3, type: 'last',     origin: 'Korat City', dest: 'Don Mueang', stdDist: 260 },
  ]},
  { id: 'R004', code: '010020', name: 'Sriracha → Khon Kaen', routeName: 'SRC-ขอนแก่น-SRC', distance: 480, stages: [
    { n: 0, type: 'first',    origin: '—', dest: 'Sriracha Plant', stdDist: 0 },
    { n: 1, type: 'load',     origin: 'Sriracha Plant', dest: 'Nakhon Ratchasima', stdDist: 300 },
    { n: 2, type: 'customer', origin: 'Nakhon Ratchasima', dest: 'Khon Kaen', stdDist: 180 },
    { n: 3, type: 'last',     origin: 'Khon Kaen', dest: 'Sriracha Plant', stdDist: 480 },
  ]},
  { id: 'R005', code: '010025', name: 'Bangkok → Surat Thani', routeName: 'BKK-สุราษฎร์-BKK', distance: 640, stages: [
    { n: 0, type: 'first',    origin: '—', dest: 'Bangkok Depot', stdDist: 0 },
    { n: 1, type: 'load',     origin: 'Bangkok Depot', dest: 'Hua Hin', stdDist: 200 },
    { n: 2, type: 'customer', origin: 'Hua Hin', dest: 'Chumphon', stdDist: 220 },
    { n: 3, type: 'customer', origin: 'Chumphon', dest: 'Surat Thani', stdDist: 220 },
    { n: 4, type: 'last',     origin: 'Surat Thani', dest: 'Bangkok Depot', stdDist: 640 },
  ]},
  { id: 'R006', code: '099999', name: 'Dummy Route', routeName: 'DUMMY', distance: 0, stages: [
    { n: 0, type: 'first',    origin: '—', dest: 'Origin', stdDist: 0 },
    { n: 1, type: 'customer', origin: 'Origin', dest: 'Destination', stdDist: 0 },
    { n: 2, type: 'last',     origin: 'Destination', dest: 'Origin', stdDist: 0 },
  ]},
];

// Mock employees (15+)
export const employees = [
  { id: 'EMP001', name: 'สมชาย พลเดช',     role: 'driver', phone: '081-234-5601', license: 'Class 2', intern: false },
  { id: 'EMP002', name: 'วิชัย สุขสวัสดิ์',   role: 'driver', phone: '081-234-5602', license: 'Class 2', intern: false },
  { id: 'EMP003', name: 'ประเสริฐ แก้วมณี',  role: 'driver', phone: '081-234-5603', license: 'Class 3', intern: false },
  { id: 'EMP004', name: 'อนุชา บุญมาก',     role: 'driver', phone: '081-234-5604', license: 'Class 2', intern: false },
  { id: 'EMP005', name: 'ธนากร ศรีสุข',     role: 'driver', phone: '081-234-5605', license: 'Class 3', intern: true },
  { id: 'EMP006', name: 'สุรศักดิ์ ทองดี',    role: 'driver', phone: '081-234-5606', license: 'Class 2', intern: false },
  { id: 'EMP007', name: 'พิชัย รุ่งเรือง',    role: 'driver', phone: '081-234-5607', license: 'Class 2', intern: false },
  { id: 'EMP008', name: 'อดิศร วงศ์สุวรรณ',  role: 'driver', phone: '081-234-5608', license: 'Class 3', intern: false },
  { id: 'EMP009', name: 'มานะ จันทร์แจ่ม',   role: 'helper', phone: '081-234-5609', license: null, intern: false },
  { id: 'EMP010', name: 'กิตติ สมบูรณ์',     role: 'helper', phone: '081-234-5610', license: null, intern: false },
  { id: 'EMP011', name: 'วรวุฒิ เจริญผล',   role: 'helper', phone: '081-234-5611', license: null, intern: false },
  { id: 'EMP012', name: 'สุทัศน์ พรมแดน',    role: 'helper', phone: '081-234-5612', license: null, intern: true },
  { id: 'EMP013', name: 'ปิยะ น้อยหมอ',     role: 'helper', phone: '081-234-5613', license: null, intern: false },
  { id: 'EMP014', name: 'ชัยวัฒน์ ดวงแก้ว',  role: 'driver', phone: '081-234-5614', license: 'Class 2', intern: false },
  { id: 'EMP015', name: 'นพดล ศิลป์ชัย',    role: 'helper', phone: '081-234-5615', license: null, intern: false },
  { id: 'EMP016', name: 'วิรัตน์ สุขเลิศ',   role: 'driver', phone: '081-234-5616', license: 'Class 2', intern: false },
];

// Mock trucks (8+)
export const trucks = [
  { id: 'T001', plate: '1กข-1234', trailer: 'TRL-001', vehicleNo: 'V-1001', type: 'LPG Tanker',       status: 'available', product: 'LPG',       age: 3 },
  { id: 'T002', plate: '2กค-5678', trailer: 'TRL-002', vehicleNo: 'V-1002', type: 'LPG Tanker',       status: 'available', product: 'LPG',       age: 5 },
  { id: 'T003', plate: '3กง-9012', trailer: 'TRL-003', vehicleNo: 'V-1003', type: 'Chemical Tank',    status: 'available', product: 'CHEM',      age: 2 },
  { id: 'T004', plate: '4กจ-3456', trailer: 'TRL-004', vehicleNo: 'V-1004', type: 'Oil Tanker',       status: 'available', product: 'FUEL',      age: 4 },
  { id: 'T005', plate: '5กฉ-7890', trailer: 'TRL-005', vehicleNo: 'V-1005', type: 'NGV Tube Trailer', status: 'available', product: 'NGV',       age: 1 },
  { id: 'T006', plate: '6กช-2345', trailer: 'TRL-006', vehicleNo: 'V-1006', type: 'NGV Tube Trailer', status: 'in_use',    product: 'NGV',       age: 6 },
  { id: 'T007', plate: '7กซ-6789', trailer: null,       vehicleNo: 'V-1007', type: 'Container Chassis', status: 'available', product: 'CONTAINER', age: 3 },
  { id: 'T008', plate: '8กฌ-0123', trailer: null,       vehicleNo: 'V-1008', type: 'Car Carrier',     status: 'available', product: 'SCA',       age: 2 },
];

// Mock Freight Orders (9+ across all 9 statuses)
export const freightOrders = [
  {
    id: 'FO-2026-001', status: 'PENDING_REVIEW', source: 'PDF Upload', sourceIcon: '📄',
    bu: 'SCC', product: 'LPG', customerName: 'บริษัท ทูลออยล์ เซอร์วิส จำกัด',
    route: '010005', routeName: 'BTC-ไทยเบฟ-BTC', pickupDate: '2026-02-03',
    totalQty: '27,000 kg', ocrConfidence: 94.5, created: '04.02.2026',
    shipmentType: '0602 — LPG', productType: 'LPG', wbs: '025.SRC.LPG.001',
  },
  {
    id: 'FO-2026-002', status: 'PENDING_REVIEW', source: 'Email RPA', sourceIcon: '📧',
    bu: 'SCC', product: 'NGV', customerName: 'PTT Public Co., Ltd.',
    route: 'SRC-LPB', routeName: 'SRC-ลพบุรี-SRC', pickupDate: '2026-02-03',
    totalQty: '16,000 kg', ocrConfidence: 91.2, created: '04.02.2026',
    shipmentType: '0601 — NGV', productType: 'NGV', wbs: '025.SRC.NGV.003',
  },
  {
    id: 'FO-2026-003', status: 'REVIEWED', source: 'Email RPA', sourceIcon: '📧',
    bu: 'SCC', product: 'FUEL', customerName: 'บริษัท บางจาก จำกัด',
    route: 'BCP-EKK', routeName: 'BCP-เอกชัยชัย-BCP', pickupDate: '2026-02-05',
    totalQty: '12,000 L', ocrConfidence: 96.1, created: '03.02.2026',
    shipmentType: '0605 — Fuel', productType: 'Fuel', wbs: '025.BCP.FUEL.030',
  },
  {
    id: 'FO-2026-004', status: 'OPEN', source: 'TMS API', sourceIcon: '🔗',
    bu: 'SCC', product: 'CHEM', customerName: 'IRPC Public Co., Ltd.',
    route: 'MTP-BKK', routeName: 'MTP-กรุงเทพ-MTP', pickupDate: '2026-02-04',
    totalQty: '28,000 kg', ocrConfidence: null, created: '01.02.2026',
    shipmentType: '0603 — Chemical', productType: 'Chemical', wbs: '025.MTP.CHEM.010',
  },
  {
    id: 'FO-2026-005', status: 'CONFIRMED', source: 'Manual Entry', sourceIcon: '✏️',
    bu: 'SCA', product: 'SCA', customerName: 'Toyota Motor Thailand Co., Ltd.',
    route: 'GTW-LCB', routeName: 'GTW-แหลมฉบัง-GTW', pickupDate: '2026-02-05',
    totalQty: '8 คัน', ocrConfidence: null, created: '30.01.2026',
    shipmentType: '00 — SCA Car', productType: 'Car', wbs: '025.GTW.SCA.015',
  },
  {
    id: 'FO-2026-006', status: 'SHIPMENT_CREATED', source: 'Manual Entry', sourceIcon: '✏️',
    bu: 'SCC', product: 'CHEM', customerName: 'SCG Chemicals Co., Ltd.',
    route: 'RYG-SMK', routeName: 'RYG-สมุทรสาคร-RYG', pickupDate: '2026-02-06',
    totalQty: '22,000 kg', ocrConfidence: null, created: '02.02.2026',
    shipmentType: '0603 — Chemical', productType: 'Chemical', wbs: '025.RYG.CHEM.015',
    shipmentId: 'SHP-2026-012',
  },
  {
    id: 'FO-2026-007', status: 'DISPATCHED', source: 'Excel Upload', sourceIcon: '📊',
    bu: 'SCA', product: 'SCA', customerName: 'Honda Automobile Thailand',
    route: 'AYT-BKK', routeName: 'AYT-กรุงเทพ-AYT', pickupDate: '2026-02-04',
    totalQty: '10 คัน', ocrConfidence: null, created: '28.01.2026',
    shipmentType: '00 — SCA Car', productType: 'Car', wbs: '025.AYT.SCA.020',
    shipmentId: 'SHP-2026-007',
  },
  {
    id: 'FO-2026-008', status: 'REPORT_IN', source: 'Excel Upload', sourceIcon: '📊',
    bu: 'SCC', product: 'NGV', customerName: 'บริษัท ปตท. จำกัด',
    route: 'SRC-KKN', routeName: 'SRC-ขอนแก่น-SRC', pickupDate: '2026-02-08',
    totalQty: '16,000 kg', ocrConfidence: null, created: '31.01.2026',
    shipmentType: '0601 — NGV', productType: 'NGV', wbs: '025.SRC.NGV.020',
    shipmentId: 'SHP-2026-009',
  },
  {
    id: 'FO-2026-009', status: 'CLOSED', source: 'Manual Entry', sourceIcon: '✏️',
    bu: 'SCA', product: 'SCA', customerName: 'Isuzu Motors (Thailand) Co., Ltd.',
    route: 'GTW-HYI', routeName: 'GTW-หาดใหญ่-GTW', pickupDate: '2026-02-09',
    totalQty: '6 คัน', ocrConfidence: null, created: '25.01.2026',
    shipmentType: '00 — SCA Car', productType: 'Car', wbs: '025.GTW.SCA.025',
  },
  {
    id: 'FO-2026-010', status: 'REVISION_REQUIRED', source: 'PDF Upload', sourceIcon: '📄',
    bu: 'SCC', product: 'CHEM', customerName: 'บริษัท ไทยออยล์ จำกัด',
    route: 'SRC-RYG', routeName: 'SRC-ระยอง-SRC', pickupDate: '2026-02-06',
    totalQty: '25,000 L', ocrConfidence: 78.5, created: '02.02.2026',
    shipmentType: '0603 — Chemical', productType: 'Chemical', wbs: '025.SRC.CHEM.020',
    approverComments: 'OCR confidence low. Re-verify quantity and UN number.',
  },
];

// Mock shipments (12+)
export const shipments = [
  {
    id: 'SHP-2026-001', shipmentNo: 'SHP-2026-001', status: 'OPEN', product: 'LPG', bu: 'SCC', site: 'Sriracha',
    source: 'PDF Upload', sourceIcon: '📄', ocrConfidence: 94,
    customerName: 'บ.ปิโตรเลียม จำกัด', customer: 'บ.ปิโตรเลียม จำกัด',
    route: 'R001', routeName: 'Bangkok → Chonburi',
    truck: '1กข-1234', plate: '1กข-1234', trailer: 'TRL-001', vehicleNo: 'V-1001', vehicleType: 'LPG Tanker', vehicleAge: 3,
    driver: 'สมชาย พลเดช', driver1: 'EMP001', driver1Name: 'สมชาย พลเดช', driverId: 'EMP001',
    totalQty: 18000, totalWeight: 18000, totalVolume: null,
    created: '2026-02-15', requestedPickupDate: '2026-02-17', requestedDeliveryDate: '2026-02-18',
    specialInstructions: 'Handle with care - pressurized gas',
    lastTruckMiles: 45230, riStatus: 'awaiting',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'คลังก๊าซบางปะกง', stdDist: 0, status: 'pending' },
      { n: 1, type: 'customer', origin: 'คลังก๊าซบางปะกง', dest: 'Laem Chabang', stdDist: 120, status: 'pending' },
      { n: 2, type: 'last', origin: 'Laem Chabang', dest: 'คลังก๊าซบางปะกง', stdDist: 120, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-002', shipmentNo: 'SHP-2026-002', status: 'DISPATCHED', product: 'NGV', bu: 'SCC', site: 'Rayong',
    source: 'Excel Upload', sourceIcon: '📊', ocrConfidence: null,
    customerName: 'สถานีบริการ NGV สระบุรี', customer: 'สถานีบริการ NGV สระบุรี',
    route: 'R002', routeName: 'Rayong → Saraburi',
    truck: '5กฉ-7890', plate: '5กฉ-7890', trailer: 'TRL-005', vehicleNo: 'V-1005', vehicleType: 'NGV Tube Trailer', vehicleAge: 1,
    driver: 'วิชัย สุขสวัสดิ์', driver1: 'EMP002', driver1Name: 'วิชัย สุขสวัสดิ์', driverId: 'EMP002',
    totalQty: 4200, totalWeight: 4200, totalVolume: null,
    created: '2026-02-14', requestedPickupDate: '2026-02-16', requestedDeliveryDate: '2026-02-17',
    specialInstructions: '',
    lastTruckMiles: 32100, riStatus: 'awaiting',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Map Ta Phut', stdDist: 0, status: 'pending' },
      { n: 1, type: 'customer', origin: 'Map Ta Phut', dest: 'Wang Muang', stdDist: 150, status: 'pending' },
      { n: 2, type: 'customer', origin: 'Wang Muang', dest: 'Saraburi Depot', stdDist: 80, status: 'pending' },
      { n: 3, type: 'last', origin: 'Saraburi Depot', dest: 'Map Ta Phut', stdDist: 230, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-003', shipmentNo: 'SHP-2026-003', status: 'REPORT_IN', product: 'FUEL', bu: 'SCC', site: 'Bangkok',
    source: 'TMS API', sourceIcon: '🔗', ocrConfidence: null,
    customerName: 'โรงกลั่น บางจาก', customer: 'โรงกลั่น บางจาก',
    route: 'R003', routeName: 'Bangkok → Nakhon Ratchasima',
    truck: '4กจ-3456', plate: '4กจ-3456', trailer: 'TRL-004', vehicleNo: 'V-1004', vehicleType: 'Oil Tanker', vehicleAge: 4,
    driver: 'ประเสริฐ แก้วมณี', driver1: 'EMP003', driver1Name: 'ประเสริฐ แก้วมณี', driverId: 'EMP003',
    totalQty: 36000, totalWeight: 28800, totalVolume: 36000,
    created: '2026-02-12', requestedPickupDate: '2026-02-14', requestedDeliveryDate: '2026-02-15',
    specialInstructions: 'Temperature sensitive - maintain 15-25°C',
    lastTruckMiles: 67800, riStatus: 'in_progress',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Don Mueang', stdDist: 0, status: 'completed', milesStart: 67800, milesEnd: 67800, departureTime: '2026-02-14T06:00', arrivalTime: '2026-02-14T06:00', weightBefore: 12000, weightAfter: 40800 },
      { n: 1, type: 'customer', origin: 'Don Mueang', dest: 'Pak Chong', stdDist: 180, status: 'completed', milesStart: 67800, milesEnd: 67980, departureTime: '2026-02-14T06:30', arrivalTime: '2026-02-14T10:15', ticketNo: 'TK-FUEL-001', ticketDate: '2026-02-14', poNo: 'PO-FUEL-201', faceQty: 20000, actualQty: 19850, weightBeforeUnload: 40800, weightAfterUnload: 24900, waitDiscount: false, cannotUnload: false, planArrival: '2026-02-14T10:00', customerPlanTime: '2026-02-14T10:30', waitStartTime: '2026-02-14T10:20', unloadStartTime: '2026-02-14T10:45', remarks: 'Fuel delivered on schedule' },
      { n: 2, type: 'customer', origin: 'Pak Chong', dest: 'Korat City', stdDist: 80, status: 'pending' },
      { n: 3, type: 'last', origin: 'Korat City', dest: 'Don Mueang', stdDist: 260, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-004', shipmentNo: 'SHP-2026-004', status: 'COMPLETED', product: 'LPG', bu: 'SCC', site: 'Sriracha',
    source: 'Email RPA', sourceIcon: '📧', ocrConfidence: null,
    customerName: 'สยามแก๊ส จำกัด', customer: 'สยามแก๊ส จำกัด',
    route: 'R004', routeName: 'Sriracha → Khon Kaen',
    truck: '2กค-5678', plate: '2กค-5678', trailer: 'TRL-002', vehicleNo: 'V-1002', vehicleType: 'LPG Tanker', vehicleAge: 5,
    driver: 'อนุชา บุญมาก', driver1: 'EMP004', driver1Name: 'อนุชา บุญมาก', driverId: 'EMP004',
    totalQty: 15000, totalWeight: 15000, totalVolume: null,
    created: '2026-02-10', requestedPickupDate: '2026-02-12', requestedDeliveryDate: '2026-02-13',
    specialInstructions: '',
    lastTruckMiles: 89200, riStatus: 'completed',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Sriracha Plant', stdDist: 0, status: 'completed', milesStart: 89200, milesEnd: 89200, departureTime: '2026-02-12T06:30', arrivalTime: '2026-02-12T06:30', weightBefore: 8200, weightAfter: 23200 },
      { n: 1, type: 'customer', origin: 'Sriracha Plant', dest: 'Nakhon Ratchasima', stdDist: 300, status: 'completed', milesStart: 89200, milesEnd: 89498, departureTime: '2026-02-12T07:00', arrivalTime: '2026-02-12T12:30', ticketNo: 'TK-LPG-001', ticketDate: '2026-02-12', poNo: 'PO-55001', faceQty: 9000, actualQty: 8850, weightBeforeUnload: 23200, weightAfterUnload: 14500, waitDiscount: false, cannotUnload: false, planArrival: '2026-02-12T12:00', customerPlanTime: '2026-02-12T12:30', waitStartTime: '2026-02-12T12:35', unloadStartTime: '2026-02-12T13:00', remarks: 'Delivered successfully' },
      { n: 2, type: 'customer', origin: 'Nakhon Ratchasima', dest: 'Khon Kaen', stdDist: 180, status: 'completed', milesStart: 89498, milesEnd: 89680, departureTime: '2026-02-12T14:00', arrivalTime: '2026-02-12T17:15', ticketNo: 'TK-LPG-002', ticketDate: '2026-02-12', poNo: 'PO-55002', faceQty: 6000, actualQty: 5950, weightBeforeUnload: 14500, weightAfterUnload: 8400, waitDiscount: false, cannotUnload: false, planArrival: '2026-02-12T17:00', customerPlanTime: '2026-02-12T17:30', waitStartTime: '2026-02-12T17:20', unloadStartTime: '2026-02-12T17:45', remarks: 'Minor delay due to traffic' },
      { n: 3, type: 'last', origin: 'Khon Kaen', dest: 'Sriracha Plant', stdDist: 480, status: 'completed', milesStart: 89680, milesEnd: 90158, departureTime: '2026-02-12T18:30', arrivalTime: '2026-02-13T02:00' },
    ],
  },
  {
    id: 'SHP-2026-005', shipmentNo: 'SHP-2026-005', status: 'OPEN', product: 'CHEM', bu: 'SCC', site: 'Rayong',
    source: 'Manual Entry', sourceIcon: '✏️', ocrConfidence: null,
    customerName: 'Thai Chemical Corp', customer: 'Thai Chemical Corp',
    route: 'R001', routeName: 'Bangkok → Chonburi',
    truck: '3กง-9012', plate: '3กง-9012', trailer: 'TRL-003', vehicleNo: 'V-1003', vehicleType: 'Chemical Tank', vehicleAge: 2,
    driver: 'ธนากร ศรีสุข', driver1: 'EMP005', driver1Name: 'ธนากร ศรีสุข', driverId: 'EMP005',
    totalQty: 25000, totalWeight: 27500, totalVolume: 25000,
    created: '2026-02-16', requestedPickupDate: '2026-02-18', requestedDeliveryDate: '2026-02-19',
    specialInstructions: 'Hazmat class 3 - flammable liquid',
    lastTruckMiles: 23400, riStatus: 'awaiting',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'คลังก๊าซบางปะกง', stdDist: 0, status: 'pending' },
      { n: 1, type: 'customer', origin: 'คลังก๊าซบางปะกง', dest: 'Laem Chabang', stdDist: 120, status: 'pending' },
      { n: 2, type: 'last', origin: 'Laem Chabang', dest: 'คลังก๊าซบางปะกง', stdDist: 120, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-006', shipmentNo: 'SHP-2026-006', status: 'DISPATCHED', product: 'CONTAINER', bu: 'SPL', site: 'Laem Chabang',
    source: 'Manual Entry', sourceIcon: '✏️', ocrConfidence: null,
    customerName: 'Bangkok Port Services', customer: 'Bangkok Port Services',
    route: 'R001', routeName: 'Bangkok → Chonburi',
    truck: '7กซ-6789', plate: '7กซ-6789', trailer: null, vehicleNo: 'V-1007', vehicleType: 'Container Chassis', vehicleAge: 3,
    driver: 'สุรศักดิ์ ทองดี', driver1: 'EMP006', driver1Name: 'สุรศักดิ์ ทองดี', driverId: 'EMP006',
    totalQty: 2, totalWeight: 48000, totalVolume: null,
    created: '2026-02-15', requestedPickupDate: '2026-02-17', requestedDeliveryDate: '2026-02-18',
    specialInstructions: '40ft container - oversized permit required',
    lastTruckMiles: 56700, riStatus: 'awaiting',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Bangkok Depot', stdDist: 0, status: 'pending' },
      { n: 1, type: 'customer', origin: 'Bangkok Depot', dest: 'Laem Chabang', stdDist: 120, status: 'pending' },
      { n: 2, type: 'last', origin: 'Laem Chabang', dest: 'Bangkok Depot', stdDist: 120, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-007', shipmentNo: 'SHP-2026-007', status: 'OPEN', product: 'SCA', bu: 'SCA', site: 'Bangkok',
    source: 'Excel Upload', sourceIcon: '📊', ocrConfidence: null,
    customerName: 'Toyota Motor Thailand', customer: 'Toyota Motor Thailand',
    route: 'R005', routeName: 'Bangkok → Surat Thani',
    truck: '8กฌ-0123', plate: '8กฌ-0123', trailer: null, vehicleNo: 'V-1008', vehicleType: 'Car Carrier', vehicleAge: 2,
    driver: 'พิชัย รุ่งเรือง', driver1: 'EMP007', driver1Name: 'พิชัย รุ่งเรือง', driverId: 'EMP007',
    totalQty: 8, totalWeight: 12000, totalVolume: null,
    created: '2026-02-16', requestedPickupDate: '2026-02-19', requestedDeliveryDate: '2026-02-21',
    specialInstructions: 'New vehicles - handle with extreme care',
    lastTruckMiles: 78100, riStatus: 'awaiting',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Bangkok Depot', stdDist: 0, status: 'pending' },
      { n: 1, type: 'customer', origin: 'Bangkok Depot', dest: 'Hua Hin', stdDist: 200, status: 'pending' },
      { n: 2, type: 'customer', origin: 'Hua Hin', dest: 'Chumphon', stdDist: 220, status: 'pending' },
      { n: 3, type: 'customer', origin: 'Chumphon', dest: 'Surat Thani', stdDist: 220, status: 'pending' },
      { n: 4, type: 'last', origin: 'Surat Thani', dest: 'Bangkok Depot', stdDist: 640, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-008', shipmentNo: 'SHP-2026-008', status: 'DISPATCHED', product: 'LPG', bu: 'SCC', site: 'Sriracha',
    source: 'PDF Upload', sourceIcon: '📄', ocrConfidence: 87,
    customerName: 'บ.แก๊สไทย จำกัด', customer: 'บ.แก๊สไทย จำกัด',
    route: 'R003', routeName: 'Bangkok → Nakhon Ratchasima',
    truck: '1กข-1234', plate: '1กข-1234', trailer: 'TRL-001', vehicleNo: 'V-1001', vehicleType: 'LPG Tanker', vehicleAge: 3,
    driver: 'อดิศร วงศ์สุวรรณ', driver1: 'EMP008', driver1Name: 'อดิศร วงศ์สุวรรณ', driverId: 'EMP008',
    totalQty: 20000, totalWeight: 20000, totalVolume: null,
    created: '2026-02-13', requestedPickupDate: '2026-02-15', requestedDeliveryDate: '2026-02-16',
    specialInstructions: '',
    lastTruckMiles: 45600, riStatus: 'awaiting',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Don Mueang', stdDist: 0, status: 'pending' },
      { n: 1, type: 'customer', origin: 'Don Mueang', dest: 'Pak Chong', stdDist: 180, status: 'pending' },
      { n: 2, type: 'customer', origin: 'Pak Chong', dest: 'Korat City', stdDist: 80, status: 'pending' },
      { n: 3, type: 'last', origin: 'Korat City', dest: 'Don Mueang', stdDist: 260, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-009', shipmentNo: 'SHP-2026-009', status: 'COMPLETED', product: 'NGV', bu: 'SCC', site: 'Rayong',
    source: 'TMS API', sourceIcon: '🔗', ocrConfidence: null,
    customerName: 'PTT NGV Station Korat', customer: 'PTT NGV Station Korat',
    route: 'R004', routeName: 'Sriracha → Khon Kaen',
    truck: '6กช-2345', plate: '6กช-2345', trailer: 'TRL-006', vehicleNo: 'V-1006', vehicleType: 'NGV Tube Trailer', vehicleAge: 6,
    driver: 'ชัยวัฒน์ ดวงแก้ว', driver1: 'EMP014', driver1Name: 'ชัยวัฒน์ ดวงแก้ว', driverId: 'EMP014',
    totalQty: 3800, totalWeight: 3800, totalVolume: null,
    created: '2026-02-08', requestedPickupDate: '2026-02-10', requestedDeliveryDate: '2026-02-11',
    specialInstructions: '',
    lastTruckMiles: 102300, riStatus: 'completed',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Sriracha Plant', stdDist: 0, status: 'completed', milesStart: 102300, milesEnd: 102300, departureTime: '2026-02-10T05:00', arrivalTime: '2026-02-10T05:00', weightBefore: 4800, weightAfter: 8600 },
      { n: 1, type: 'customer', origin: 'Sriracha Plant', dest: 'Nakhon Ratchasima', stdDist: 300, status: 'completed', milesStart: 102300, milesEnd: 102598, departureTime: '2026-02-10T05:30', arrivalTime: '2026-02-10T11:00', ticketNo: 'TK-NGV-001', ticketDate: '2026-02-10', poNo: 'PO-NGV-101', faceQty: 2200, actualQty: 2180, weightBeforeUnload: 8600, weightAfterUnload: 6450, waitDiscount: false, cannotUnload: false, planArrival: '2026-02-10T10:30', customerPlanTime: '2026-02-10T11:00', waitStartTime: '2026-02-10T11:05', unloadStartTime: '2026-02-10T11:20', remarks: 'NGV delivered as planned' },
      { n: 2, type: 'customer', origin: 'Nakhon Ratchasima', dest: 'Khon Kaen', stdDist: 180, status: 'completed', milesStart: 102598, milesEnd: 102775, departureTime: '2026-02-10T12:30', arrivalTime: '2026-02-10T15:45', ticketNo: 'TK-NGV-002', ticketDate: '2026-02-10', poNo: 'PO-NGV-102', faceQty: 1600, actualQty: 1580, weightBeforeUnload: 6450, weightAfterUnload: 4870, waitDiscount: false, cannotUnload: false, planArrival: '2026-02-10T15:30', customerPlanTime: '2026-02-10T16:00', waitStartTime: '2026-02-10T15:50', unloadStartTime: '2026-02-10T16:10', remarks: 'Completed without issues' },
      { n: 3, type: 'last', origin: 'Khon Kaen', dest: 'Sriracha Plant', stdDist: 480, status: 'completed', milesStart: 102775, milesEnd: 103253, departureTime: '2026-02-10T17:00', arrivalTime: '2026-02-11T01:30' },
    ],
  },
  {
    id: 'SHP-2026-010', shipmentNo: 'SHP-2026-010', status: 'REPORT_IN', product: 'LPG', bu: 'SCC', site: 'Sriracha',
    source: 'Email RPA', sourceIcon: '📧', ocrConfidence: null,
    customerName: 'ห้างหุ้นส่วน ก๊าซภาคใต้', customer: 'ห้างหุ้นส่วน ก๊าซภาคใต้',
    route: 'R005', routeName: 'Bangkok → Surat Thani',
    truck: '2กค-5678', plate: '2กค-5678', trailer: 'TRL-002', vehicleNo: 'V-1002', vehicleType: 'LPG Tanker', vehicleAge: 5,
    driver: 'สมชาย พลเดช', driver1: 'EMP001', driver1Name: 'สมชาย พลเดช', driverId: 'EMP001',
    totalQty: 16000, totalWeight: 16000, totalVolume: null,
    created: '2026-02-11', requestedPickupDate: '2026-02-13', requestedDeliveryDate: '2026-02-15',
    specialInstructions: 'Long haul - driver rest required at Chumphon',
    lastTruckMiles: 45700, riStatus: 'in_progress',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Bangkok Depot', stdDist: 0, status: 'completed', milesStart: 45700, milesEnd: 45700, departureTime: '2026-02-13T05:30', arrivalTime: '2026-02-13T05:30', weightBefore: 7500, weightAfter: 23500 },
      { n: 1, type: 'customer', origin: 'Bangkok Depot', dest: 'Hua Hin', stdDist: 200, status: 'completed', milesStart: 45700, milesEnd: 45898, departureTime: '2026-02-13T06:00', arrivalTime: '2026-02-13T10:30', ticketNo: 'TK-LPG-010', ticketDate: '2026-02-13', poNo: 'PO-LPG-301', faceQty: 8000, actualQty: 7920, weightBeforeUnload: 23500, weightAfterUnload: 15600, waitDiscount: false, cannotUnload: false, planArrival: '2026-02-13T10:00', customerPlanTime: '2026-02-13T10:30', waitStartTime: '2026-02-13T10:35', unloadStartTime: '2026-02-13T11:00', remarks: 'LPG delivered' },
      { n: 2, type: 'customer', origin: 'Hua Hin', dest: 'Chumphon', stdDist: 220, status: 'pending' },
      { n: 3, type: 'customer', origin: 'Chumphon', dest: 'Surat Thani', stdDist: 220, status: 'pending' },
      { n: 4, type: 'last', origin: 'Surat Thani', dest: 'Bangkok Depot', stdDist: 640, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-011', shipmentNo: 'SHP-2026-011', status: 'OPEN', product: 'FUEL', bu: 'SCC', site: 'Bangkok',
    source: 'Forecast Upload', sourceIcon: '🚢', ocrConfidence: null,
    customerName: 'Shell Thailand', customer: 'Shell Thailand',
    route: 'R002', routeName: 'Rayong → Saraburi',
    truck: '4กจ-3456', plate: '4กจ-3456', trailer: 'TRL-004', vehicleNo: 'V-1004', vehicleType: 'Oil Tanker', vehicleAge: 4,
    driver: 'ประเสริฐ แก้วมณี', driver1: 'EMP003', driver1Name: 'ประเสริฐ แก้วมณี', driverId: 'EMP003',
    totalQty: 40000, totalWeight: 32000, totalVolume: 40000,
    created: '2026-02-17', requestedPickupDate: '2026-02-20', requestedDeliveryDate: '2026-02-21',
    specialInstructions: '',
    lastTruckMiles: 68200, riStatus: 'awaiting',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Map Ta Phut', stdDist: 0, status: 'pending' },
      { n: 1, type: 'customer', origin: 'Map Ta Phut', dest: 'Wang Muang', stdDist: 150, status: 'pending' },
      { n: 2, type: 'customer', origin: 'Wang Muang', dest: 'Saraburi Depot', stdDist: 80, status: 'pending' },
      { n: 3, type: 'last', origin: 'Saraburi Depot', dest: 'Map Ta Phut', stdDist: 230, status: 'pending' },
    ],
  },
  {
    id: 'SHP-2026-012', shipmentNo: 'SHP-2026-012', status: 'DISPATCHED', product: 'CHEM', bu: 'SCC', site: 'Rayong',
    source: 'Email RPA', sourceIcon: '📧', ocrConfidence: null,
    customerName: 'IRPC Chemical', customer: 'IRPC Chemical',
    route: 'R003', routeName: 'Bangkok → Nakhon Ratchasima',
    truck: '3กง-9012', plate: '3กง-9012', trailer: 'TRL-003', vehicleNo: 'V-1003', vehicleType: 'Chemical Tank', vehicleAge: 2,
    driver: 'อนุชา บุญมาก', driver1: 'EMP004', driver1Name: 'อนุชา บุญมาก', driverId: 'EMP004',
    totalQty: 22000, totalWeight: 24200, totalVolume: 22000,
    created: '2026-02-14', requestedPickupDate: '2026-02-16', requestedDeliveryDate: '2026-02-17',
    specialInstructions: 'Hazmat class 8 - corrosive',
    lastTruckMiles: 23700, riStatus: 'awaiting',
    stages: [
      { n: 0, type: 'first', origin: '—', dest: 'Don Mueang', stdDist: 0, status: 'pending' },
      { n: 1, type: 'customer', origin: 'Don Mueang', dest: 'Pak Chong', stdDist: 180, status: 'pending' },
      { n: 2, type: 'customer', origin: 'Pak Chong', dest: 'Korat City', stdDist: 80, status: 'pending' },
      { n: 3, type: 'last', origin: 'Korat City', dest: 'Don Mueang', stdDist: 260, status: 'pending' },
    ],
  },
];

// Awaiting settlement rows (5 LPG + 4 NGV)
export const awaitingRows = [
  { id: 'AW001', shipmentNo: 'SHP-2026-004', stage: 'S1', product: 'LPG', soldTo: '1000001', soldToName: 'หจก.ตั้งไพบูลย์ ปิโตรเลียม', shipTo: '2000001', shipToName: 'สาขาขอนแก่น', custDoc: 'CD-20260201', docDate: '2026-02-13', ticketQty: 15000, actualQty: 14850, billingQty: 14850, billingDate: '2026-02-13', vehicleType: 'LPG Tanker', vehicleAge: 5, billingDist: 480, actualDist: 478, fuelPrice: 32.50, fuel025: 8.13, fuel050: 16.25, fuel100: 32.50, cannotUnload: false, tripNo: 'T001', serviceCode: 'SV001', wbs: 'WBS-001', route: '0C3415', plate: '2กค-5678', trailer: 'TRL-002', driver: 'อนุชา บุญมาก', qtyDiff: -150, distDiff: -2, ratePerKm: 12.50, totalFreight: 6000, fuelSurcharge: 300, otherCharge: 0, grandTotal: 6300, status: 'awaiting' },
  { id: 'AW002', shipmentNo: 'SHP-2026-004', stage: 'S2', product: 'LPG', soldTo: '1000002', soldToName: 'หจก.เอส พนมยงค์', shipTo: '2000002', shipToName: 'คลังโคราช', custDoc: 'CD-20260202', docDate: '2026-02-13', ticketQty: 8000, actualQty: 7950, billingQty: 7950, billingDate: '2026-02-13', vehicleType: 'LPG Tanker', vehicleAge: 5, billingDist: 300, actualDist: 298, fuelPrice: 32.50, fuel025: 8.13, fuel050: 16.25, fuel100: 32.50, cannotUnload: true, tripNo: 'T002', serviceCode: 'SV002', wbs: 'WBS-001', route: '0C3415', plate: '2กค-5678', trailer: 'TRL-002', driver: 'อนุชา บุญมาก', qtyDiff: -50, distDiff: -2, ratePerKm: 11.00, totalFreight: 3300, fuelSurcharge: 150, otherCharge: 0, grandTotal: 3450, status: 'awaiting' },
  { id: 'AW003', shipmentNo: 'SHP-2026-010', stage: 'S3', product: 'LPG', soldTo: '1000005', soldToName: 'บจก.ไชยโชติช่วง', shipTo: '2000005', shipToName: 'สาขาชุมพร', custDoc: 'CD-20260203', docDate: '2026-02-15', ticketQty: 12000, actualQty: 11900, billingQty: 11900, billingDate: '2026-02-15', vehicleType: 'LPG Tanker', vehicleAge: 5, billingDist: 440, actualDist: 438, fuelPrice: 33.00, fuel025: 8.25, fuel050: 16.50, fuel100: 33.00, cannotUnload: false, tripNo: 'T003', serviceCode: 'SV001', wbs: 'WBS-002', route: '0C2801', plate: '2กค-5678', trailer: 'TRL-002', driver: 'สมชาย พลเดช', qtyDiff: -100, distDiff: -2, ratePerKm: 13.00, totalFreight: 5720, fuelSurcharge: 280, otherCharge: 100, grandTotal: 6100, status: 'awaiting' },
  { id: 'AW004', shipmentNo: 'SHP-2026-001', stage: 'S1', product: 'LPG', soldTo: '1000001', soldToName: 'หจก.ตั้งไพบูลย์ ปิโตรเลียม', shipTo: '2000006', shipToName: 'สาขานครราชสีมา', custDoc: 'CD-20260204', docDate: '2026-02-17', ticketQty: 18000, actualQty: 17800, billingQty: 17800, billingDate: '2026-02-17', vehicleType: 'LPG Tanker', vehicleAge: 3, billingDist: 120, actualDist: 119, fuelPrice: 32.50, fuel025: 8.13, fuel050: 16.25, fuel100: 32.50, cannotUnload: false, tripNo: 'T004', serviceCode: 'SV001', wbs: 'WBS-003', route: '0C3415', plate: '1กข-1234', trailer: 'TRL-001', driver: 'สมชาย พลเดช', qtyDiff: -200, distDiff: -1, ratePerKm: 10.00, totalFreight: 1200, fuelSurcharge: 60, otherCharge: 0, grandTotal: 1260, status: 'awaiting' },
  { id: 'AW005', shipmentNo: 'SHP-2026-008', stage: 'S1', product: 'LPG', soldTo: '1000006', soldToName: 'บจก.ศรีราชา แก๊ส', shipTo: '2000007', shipToName: 'คลังปากช่อง', custDoc: 'CD-20260205', docDate: '2026-02-16', ticketQty: 20000, actualQty: 19800, billingQty: 19800, billingDate: '2026-02-16', vehicleType: 'LPG Tanker', vehicleAge: 3, billingDist: 180, actualDist: 179, fuelPrice: 33.00, fuel025: 8.25, fuel050: 16.50, fuel100: 33.00, cannotUnload: true, tripNo: 'T005', serviceCode: 'SV002', wbs: 'WBS-003', route: '0C2801', plate: '1กข-1234', trailer: 'TRL-001', driver: 'อดิศร วงศ์สุวรรณ', qtyDiff: -200, distDiff: -1, ratePerKm: 11.50, totalFreight: 2070, fuelSurcharge: 100, otherCharge: 50, grandTotal: 2220, status: 'awaiting' },
  { id: 'AW006', shipmentNo: 'SHP-2026-009', stage: 'S1', product: 'NGV', soldTo: '1000003', soldToName: 'บจก.ปตท. จำหน่ายก๊าซ', shipTo: '2000003', shipToName: 'สถานี NGV โคราช', soShipment: 'SHP-2026-009', item: 'NGV-001', material: 'NGV Compressed', transportRate: 2.50, distance: 180, gasQty: 3800, stationCost: 1200, totalCost: 10700, distCategory: '≤200km', rateInput: 2.50, docDate: '2026-02-14', billingDate: '2026-02-14', status: 'awaiting' },
  { id: 'AW007', shipmentNo: 'SHP-2026-009', stage: 'S2', product: 'NGV', soldTo: '1000004', soldToName: 'บจก.สยาม เอ็นจีวี', shipTo: '2000004', shipToName: 'สถานี NGV ขอนแก่น', soShipment: 'SHP-2026-009', item: 'NGV-002', material: 'NGV Compressed', transportRate: 2.80, distance: 480, gasQty: 2000, stationCost: 1500, totalCost: 8500, distCategory: '>200km', rateInput: 2.80, docDate: '2026-02-14', billingDate: '2026-02-14', status: 'awaiting' },
  { id: 'AW008', shipmentNo: 'SHP-2026-002', stage: 'S1', product: 'NGV', soldTo: '1000007', soldToName: 'บจก.เอ็นพีที เอ็นจีวี', shipTo: '2000008', shipToName: 'สถานี NGV สระบุรี', soShipment: 'SHP-2026-002', item: 'NGV-003', material: 'NGV Compressed', transportRate: 2.50, distance: 150, gasQty: 4200, stationCost: 1000, totalCost: 11500, distCategory: '≤200km', rateInput: 2.50, docDate: '2026-02-15', billingDate: '2026-02-15', status: 'awaiting' },
  { id: 'AW009', shipmentNo: 'SHP-2026-002', stage: 'S2', product: 'NGV', soldTo: '1000003', soldToName: 'บจก.ปตท. จำหน่ายก๊าซ', shipTo: '2000009', shipToName: 'สถานี NGV วังน้อย', soShipment: 'SHP-2026-002', item: 'NGV-004', material: 'NGV Compressed', transportRate: 2.30, distance: 230, gasQty: 3500, stationCost: 1100, totalCost: 9150, distCategory: '>200km', rateInput: 2.30, docDate: '2026-02-15', billingDate: '2026-02-15', status: 'awaiting' },
];

// Settlement reports
export const settlementReports = [
  {
    id: 'RPT-001', reportNo: 'RPT-2026-001', product: 'LPG', period: '2026-02-01 to 2026-02-15', site: 'BPK',
    status: 'so_posted', rows: 3, total: 15850,
    soNumbers: ['80979-001', '80979-002'],
    items: [
      { ...awaitingRows[0], status: 'settled', soNo: '80979-001' },
      { ...awaitingRows[1], status: 'settled', soNo: '80979-002' },
      { ...awaitingRows[2], status: 'settled', soNo: '80979-001' },
    ],
  },
  {
    id: 'RPT-002', reportNo: 'RPT-2026-002', product: 'NGV', period: '2026-02-01 to 2026-02-15', site: 'SRB',
    status: 'so_posted', rows: 2, total: 19200,
    soNumbers: ['21060-001', '21060-002'],
    items: [
      { ...awaitingRows[5], status: 'settled', soNo: '21060-001' },
      { ...awaitingRows[6], status: 'settled', soNo: '21060-002' },
    ],
  },
  {
    id: 'RPT-003', reportNo: 'RPT-2026-003', product: 'LPG', period: '2026-02-16 to 2026-02-19', site: 'MTP',
    status: 'pending_so', rows: 2, total: 3480,
    soNumbers: [],
    items: [
      { ...awaitingRows[3], status: 'in_report' },
      { ...awaitingRows[4], status: 'in_report' },
    ],
  },
];

// Sales orders
export const salesOrders = [
  {
    id: 'SO-001', soNo: '80979-001', reportNo: 'RPT-2026-001', product: 'LPG',
    soldTo: '1000001', soldToName: 'หจก.ตั้งไพบูลย์ ปิโตรเลียม', soType: 'ลงก๊าซได้',
    total: 12400, status: 'posted', created: '2026-02-16', numRows: 2,
    rows: [
      { shipmentNo: 'SHP-2026-004', soldTo: '1000001', shipToName: 'สาขาขอนแก่น', custDoc: 'CD-20260201', qty: 14850, soNo: '80979-001' },
      { shipmentNo: 'SHP-2026-010', soldTo: '1000005', shipToName: 'สาขาชุมพร', custDoc: 'CD-20260203', qty: 11900, soNo: '80979-001' },
    ],
  },
  {
    id: 'SO-002', soNo: '80979-002', reportNo: 'RPT-2026-001', product: 'LPG',
    soldTo: '1000002', soldToName: 'หจก.เอส พนมยงค์', soType: 'ลงก๊าซไม่ได้',
    total: 3450, status: 'posted', created: '2026-02-16', numRows: 1,
    rows: [
      { shipmentNo: 'SHP-2026-004', soldTo: '1000002', shipToName: 'คลังโคราช', custDoc: 'CD-20260202', qty: 7950, soNo: '80979-002' },
    ],
  },
  {
    id: 'SO-003', soNo: '21060-001', reportNo: 'RPT-2026-002', product: 'NGV',
    soldTo: '1000003', soldToName: 'บจก.ปตท. จำหน่ายก๊าซ', soType: '≤200km',
    total: 10700, status: 'posted', created: '2026-02-16', numRows: 1,
    rows: [
      { shipmentNo: 'SHP-2026-009', soldTo: '1000003', shipToName: 'สถานี NGV โคราช', custDoc: '-', qty: 3800, soNo: '21060-001' },
    ],
  },
  {
    id: 'SO-004', soNo: '21060-002', reportNo: 'RPT-2026-002', product: 'NGV',
    soldTo: '1000004', soldToName: 'บจก.สยาม เอ็นจีวี', soType: '>200km',
    total: 8500, status: 'posted', created: '2026-02-16', numRows: 1,
    rows: [
      { shipmentNo: 'SHP-2026-009', soldTo: '1000004', shipToName: 'สถานี NGV ขอนแก่น', custDoc: '-', qty: 2000, soNo: '21060-002' },
    ],
  },
];

// Backward-compatibility alias
export const awaitingSettlement = awaitingRows;
