import { useState, useMemo, useCallback } from 'react';
import ChannelModal from './ChannelModal';
import UploadModal from './UploadModal';
import EditDraftModal from './EditDraftModal';
import TMSModal from './TMSModal';
import ManualEntryModal from './ManualEntryModal';

import { useLanguage } from '../../contexts/LanguageContext';
/* ===== FO Status Config (matches HTML exactly) ===== */
const foStatusConfig = {
  PENDING_REVIEW:    { label: 'Pending Review',    css: 'bg-amber-50 text-[#e65100]',   icon: '⏳', canReview: true },
  REVIEWED:          { label: 'Validated',          css: 'bg-blue-50 text-blue-700',      icon: '✔',  canConfirm: true },
  OPEN:              { label: 'Open',               css: 'bg-green-50 text-[#2e7d32]',   icon: '📂', canCreateShipment: true },
  CONFIRMED:         { label: 'Confirmed',          css: 'bg-teal-50 text-[#00695c]',    icon: '🚛', canCreateShipment: true },
  REVISION_REQUIRED: { label: 'Needs Correction',   css: 'bg-orange-50 text-[#f57f17]',  icon: '🔄', canReview: true },
  SHIPMENT_CREATED:  { label: 'Shipment Created',   css: 'bg-indigo-50 text-[#283593]',  icon: '📋', canDispatch: true },
  DISPATCHED:        { label: 'Dispatched',          css: 'bg-purple-50 text-[#7b1fa2]',  icon: '🚀', canReportIn: true },
  REPORT_IN:         { label: 'Report-In',           css: 'bg-cyan-50 text-[#00695c]',    icon: '📥', canClose: true },
  CLOSED:            { label: 'Closed',              css: 'bg-gray-100 text-[#616161]',   icon: '✅' },
};

const foSourceConfig = {
  'PDF Upload':      { css: 'bg-blue-50 text-[#1565c0]',    icon: '📄' },
  'Email RPA':       { css: 'bg-pink-50 text-[#c62828]',    icon: '📧' },
  'TMS API':         { css: 'bg-green-50 text-[#2e7d32]',   icon: '🔗' },
  'Manual Entry':    { css: 'bg-purple-50 text-[#7b1fa2]',  icon: '✏️' },
  'Excel Upload':    { css: 'bg-orange-50 text-[#e65100]',  icon: '📊' },
  'Forecast Upload': { css: 'bg-teal-50 text-[#00695c]',    icon: '🚢' },
};

/* ===== Mock FO Data (15+ orders, Thai names, all statuses & sources) ===== */
const initialOrders = [
  {
    id:'FO-2026-0001', source:'PDF Upload', bu:'SCC', shipmentType:'0605 — Fuel', productType:'Fuel',
    customerName:'บริษัท ทูลออยล์ เซอร์วิส จำกัด', customerEmail:'orders@tooloil.co.th', customerPhone:'+66 2 123 4567',
    customers: [
      {name:'บริษัท ทูลออยล์ เซอร์วิส จำกัด', shipToCode:'102807', address:'จ.นนทบุรี ต.วัดชลอ อ.บางกรวย', volume:'9K Diesel + 8K G95'},
      {name:'บริษัท นาคณครา จำกัด', shipToCode:'200865', address:'จ.ปทุมธานี ต.คลองหนึ่ง อ.คลองหลวง', volume:'4K Diesel + 4K G91'},
      {name:'หสน. เจริญสุขอยุธยา', shipToCode:'101347', address:'จ.พระนครศรีอยุธยา อ.พระนครศรีอยุธยา', volume:'10K Diesel + 6K G95'},
    ],
    route:'SRC-BKK', wbs:'025.SRC.FUEL.001', shippingType:'01 - Truck',
    pickupAddress:'คลังน้ำมัน BSRC-SRC, สระบุรี', deliveryAddress:'Multiple Ship-To (3 locations)',
    products:[{name:'Diesel B7',quantity:39000,unit:'Liters',weight:33}],
    totalWeight:33000, totalVolume:39, requestedPickupDate:'2026-02-03', requestedDeliveryDate:'2026-02-03',
    specialInstructions:'Compartment split: 3 deliveries. ส่ง 3 จุด',
    status:'PENDING_REVIEW', ocrConfidence:94.5, createdAt:'2026-02-02 08:30', createdBy:'System (OCR BOT)',
    language:'Thai', originalDocument:'fuel_order_001.pdf', plant:'130H', shipmentNo:'112351195',
    reviewedBy:null, reviewedAt:null, approver:null, approverComments:null
  },
  {
    id:'FO-2026-0002', source:'Email RPA', bu:'SCC', shipmentType:'0601 — NGV', productType:'NGV',
    customerName:'PTT Public Co., Ltd.', customerEmail:'dispatch@ptt.co.th', customerPhone:'+66 2 537 2000',
    route:'SRC-LPB', wbs:'025.SRC.NGV.003', shippingType:'01 - Truck',
    pickupAddress:'PTT NGV Station SRC', deliveryAddress:'PTT สถานี NGV ลพบุรี',
    products:[{name:'NGV Compressed Gas',quantity:1,unit:'Full Load',weight:16000}],
    totalWeight:16000, totalVolume:16, requestedPickupDate:'2026-02-03', requestedDeliveryDate:'2026-02-03',
    specialInstructions:'PSI check required before loading',
    status:'PENDING_REVIEW', ocrConfidence:91.2, createdAt:'2026-02-02 09:15', createdBy:'System (Email RPA)',
    language:'English', originalDocument:'email_ptt_ngv_order.eml',
    reviewedBy:null, reviewedAt:null, approver:null, approverComments:null, estimatedValue:45000
  },
  {
    id:'FO-2026-0003', source:'TMS API', bu:'SCC', shipmentType:'0603 — Chemical', productType:'Chemical',
    customerName:'IRPC Public Co., Ltd.', customerEmail:'logistics@irpc.co.th', customerPhone:'+66 38 611 333',
    route:'MTP-BKK', wbs:'025.MTP.CHEM.010', shippingType:'01 - Truck',
    pickupAddress:'IRPC Plant, Map Ta Phut, Rayong', deliveryAddress:'Chemical Warehouse, Bangpoo, Samutprakan',
    products:[{name:'Polypropylene Resin',quantity:28000,unit:'KG',weight:28000}],
    totalWeight:28000, totalVolume:35, requestedPickupDate:'2026-02-04', requestedDeliveryDate:'2026-02-04',
    specialInstructions:'HAZMAT Class 3. Driver must have DG license.',
    status:'OPEN', ocrConfidence:null, createdAt:'2026-02-01 16:20', createdBy:'System (TMS API)',
    language:null, originalDocument:null,
    reviewedBy:'Somchai P.', reviewedAt:'2026-02-01 16:30', approver:null, approverComments:null, estimatedValue:82000
  },
  {
    id:'FO-2026-0004', source:'Manual Entry', bu:'SCA', shipmentType:'00 — SCA Car', productType:'Car',
    customerName:'Toyota Motor Thailand Co., Ltd.', customerEmail:'logistics@toyota.co.th', customerPhone:'+66 2 386 1000',
    route:'GTW-LCB', wbs:'025.GTW.SCA.015', shippingType:'01 - Truck',
    pickupAddress:'Toyota Gateway Plant, Chachoengsao', deliveryAddress:'LCB โตโยต้า นครลพบุรี',
    products:[{name:'Toyota Hilux Revo',quantity:8,unit:'pcs',weight:2000}],
    totalWeight:16000, totalVolume:0, requestedPickupDate:'2026-02-05', requestedDeliveryDate:'2026-02-05',
    specialInstructions:'Max 11 positions per car carrier. VIN scan required.',
    status:'CONFIRMED', ocrConfidence:null, createdAt:'2026-01-30 14:00', createdBy:'Wipaporn K.',
    language:null, originalDocument:null,
    reviewedBy:'Wipaporn K.', reviewedAt:'2026-01-30 14:05', approver:'Fleet Manager', approverComments:'Approved. Assign car carrier TH-8345.', estimatedValue:32000
  },
  {
    id:'FO-2026-0005', source:'Forecast Upload', bu:'SPL', shipmentType:'ML — Coastal', productType:'Container',
    customerName:'บจก.แฟร์ แอนด์ ฟาสต์ (Shipper)', customerEmail:'ops@fairfast.co.th', customerPhone:'+66 38 691 234',
    route:'MTP-SCSC', wbs:'08S.26CF.NPSRT1.S002', shippingType:'03 - Vessel',
    pickupAddress:'Map Ta Phut Port', deliveryAddress:'SCSC Terminal, Sriracha',
    products:[{name:'Rubber Wood (Container)',quantity:20,unit:'TEU',weight:580}],
    totalWeight:580000, totalVolume:20, requestedPickupDate:'2026-02-10', requestedDeliveryDate:'2026-02-12',
    specialInstructions:'Vessel: NPSRT3, Voy: S002. 10×20GP + 20×40GP',
    status:'CONFIRMED', ocrConfidence:null, createdAt:'2026-01-28 11:00', createdBy:'System (Forecast)',
    language:null, originalDocument:'forecast_feb2026.xlsx',
    reviewedBy:'Ops Team', reviewedAt:'2026-01-28 15:00', approver:'Coastal Manager',
    approverComments:'Confirmed. Vessel NPSRT3 scheduled.',
    estimatedValue:450000, assignedFleet:'Vessel NPSRT3'
  },
  {
    id:'FO-2026-0006', source:'Manual Entry', bu:'SCM', shipmentType:'TUG — Tug Boat', productType:'Tug Service',
    customerName:'Chevron Thailand', customerEmail:'marine@chevron.com', customerPhone:'+66 38 692 555',
    route:'MTP-IEAT', wbs:'025.15.JETTYG.HO', shippingType:'04 - Tug',
    pickupAddress:'Maptaphut Industrial Port', deliveryAddress:'IEAT Jetty Terminal',
    products:[{name:'Tug Service — Ship Berthing',quantity:1,unit:'Job',weight:0}],
    totalWeight:0, totalVolume:0, requestedPickupDate:'2026-02-06', requestedDeliveryDate:'2026-02-06',
    specialInstructions:'Ship: SILVER SAFETY, GRT: 12500, LOA: 180m. ในอ่าว scope.',
    status:'SHIPMENT_CREATED', ocrConfidence:null, createdAt:'2026-01-29 09:00', createdBy:'Marine Ops',
    language:null, originalDocument:null,
    reviewedBy:'Marine Ops', reviewedAt:'2026-01-29 09:10', approver:'Port Manager',
    approverComments:'Approved. Assign Tug SC-TUG-05.',
    estimatedValue:180000, assignedFleet:'SC-TUG-05', shipmentId:'SH-2026-000088'
  },
  {
    id:'FO-2026-0007', source:'Excel Upload', bu:'SCA', shipmentType:'00 — SCA Car', productType:'Car',
    customerName:'Honda Automobile Thailand', customerEmail:'fleet@honda.co.th', customerPhone:'+66 2 529 1234',
    route:'AYT-BKK', wbs:'025.AYT.SCA.020', shippingType:'01 - Truck',
    pickupAddress:'Honda Manufacturing, Ayutthaya', deliveryAddress:'Honda Dealer Network, Bangkok',
    products:[{name:'Honda City / Civic',quantity:10,unit:'pcs',weight:1500}],
    totalWeight:15000, totalVolume:0, requestedPickupDate:'2026-02-04', requestedDeliveryDate:'2026-02-04',
    specialInstructions:'Batch upload from calling sheet. 10 vehicles, 2 trips.',
    status:'DISPATCHED', ocrConfidence:null, createdAt:'2026-01-28 13:00', createdBy:'System (Excel Batch)',
    language:null, originalDocument:'honda_calling_feb04.xlsx',
    reviewedBy:'Auto Ops', reviewedAt:'2026-01-28 14:00', approver:'Fleet Manager',
    approverComments:'Dispatched. 2 car carriers assigned.',
    estimatedValue:28000, assignedFleet:'TH-8345, TH-8367', shipmentId:'SH-2026-000090'
  },
  {
    id:'FO-2026-0008', source:'PDF Upload', bu:'SCC', shipmentType:'0602 — LPG', productType:'LPG',
    customerName:'Siam Gas & Petrochemicals', customerEmail:'orders@siamgas.com', customerPhone:'+66 2 294 7777',
    route:'SRC-NKR', wbs:'025.SRC.LPG.005', shippingType:'02 - Trailer',
    pickupAddress:'SRC LPG Terminal, Saraburi', deliveryAddress:'Siam Gas Depot, Nakhon Ratchasima',
    products:[{name:'LPG Bulk',quantity:20000,unit:'Liters',weight:10000}],
    totalWeight:10000, totalVolume:20, requestedPickupDate:'2026-02-03', requestedDeliveryDate:'2026-02-03',
    specialInstructions:'HAZMAT. ตรวจ valve ก่อนขนส่ง',
    status:'OPEN', ocrConfidence:88.3, createdAt:'2026-02-01 10:00', createdBy:'System (OCR BOT)',
    language:'Thai', originalDocument:'siamgas_order_008.pdf',
    reviewedBy:'Somchai P.', reviewedAt:'2026-02-01 11:00', approver:'Fleet Manager', approverComments:null, estimatedValue:120000
  },
  {
    id:'FO-2026-0009', source:'Email RPA', bu:'SCC', shipmentType:'0605 — Fuel', productType:'Fuel',
    customerName:'บริษัท บางจาก คอร์ปอเรชั่น จำกัด (มหาชน)', customerEmail:'fuel@bangchak.co.th', customerPhone:'+66 2 335 8888',
    route:'BCP-EKK', wbs:'025.BCP.FUEL.030', shippingType:'01 - Truck',
    pickupAddress:'Bangchak Refinery, Phra Khanong', deliveryAddress:'สถานีบริการ เอกชัยชัย',
    products:[{name:'Gasohol 95',quantity:12000,unit:'Liters',weight:9000}],
    totalWeight:9000, totalVolume:12, requestedPickupDate:'2026-02-05', requestedDeliveryDate:'2026-02-05',
    specialInstructions:'Night delivery preferred',
    status:'REVIEWED', ocrConfidence:96.1, createdAt:'2026-02-03 07:00', createdBy:'System (Email RPA)',
    language:'Thai', originalDocument:'email_bangchak_fuel.eml',
    reviewedBy:'Narong S.', reviewedAt:'2026-02-03 08:00', approver:null, approverComments:null, estimatedValue:48000
  },
  {
    id:'FO-2026-0010', source:'TMS API', bu:'SCC', shipmentType:'0603 — Chemical', productType:'Chemical',
    customerName:'SCG Chemicals Co., Ltd.', customerEmail:'chem@scg.com', customerPhone:'+66 2 586 4444',
    route:'RYG-SMK', wbs:'025.RYG.CHEM.015', shippingType:'01 - Truck',
    pickupAddress:'SCG Chem Plant, Rayong', deliveryAddress:'Samut Sakhon Warehouse',
    products:[{name:'Polyethylene HDPE',quantity:22000,unit:'KG',weight:22000}],
    totalWeight:22000, totalVolume:28, requestedPickupDate:'2026-02-06', requestedDeliveryDate:'2026-02-06',
    specialInstructions:'Must use covered trailer. Temperature sensitive.',
    status:'SHIPMENT_CREATED', ocrConfidence:null, createdAt:'2026-02-02 14:00', createdBy:'System (TMS API)',
    language:null, originalDocument:null,
    reviewedBy:'Chem Ops', reviewedAt:'2026-02-02 15:00', approver:'Fleet Manager',
    approverComments:'Approved. Use covered trailer.',
    estimatedValue:95000, assignedFleet:'TK-4412', shipmentId:'SH-2026-000092'
  },
  {
    id:'FO-2026-0011', source:'PDF Upload', bu:'SCC', shipmentType:'0602 — LPG', productType:'LPG',
    customerName:'บริษัท สยามแก๊ส จำกัด', customerEmail:'ops@siamgas2.co.th', customerPhone:'+66 2 294 8888',
    route:'SRC-CMI', wbs:'025.SRC.LPG.010', shippingType:'02 - Trailer',
    pickupAddress:'SRC LPG Terminal, Saraburi', deliveryAddress:'Chiang Mai LPG Depot',
    products:[{name:'LPG Propane',quantity:18000,unit:'Liters',weight:9000}],
    totalWeight:9000, totalVolume:18, requestedPickupDate:'2026-02-07', requestedDeliveryDate:'2026-02-08',
    specialInstructions:'เส้นทางยาว ต้องพักระหว่างทาง',
    status:'DISPATCHED', ocrConfidence:92.0, createdAt:'2026-02-01 08:00', createdBy:'System (OCR BOT)',
    language:'Thai', originalDocument:'siamgas_lpg_011.pdf',
    reviewedBy:'Somchai P.', reviewedAt:'2026-02-01 09:00', approver:'Fleet Manager',
    approverComments:'Long haul approved.',
    estimatedValue:150000, assignedFleet:'TK-7789', shipmentId:'SH-2026-000085'
  },
  {
    id:'FO-2026-0012', source:'Excel Upload', bu:'SCC', shipmentType:'0601 — NGV', productType:'NGV',
    customerName:'บริษัท ปตท. สำรวจและผลิตปิโตรเลียม จำกัด (มหาชน)', customerEmail:'ngv@pttep.co.th', customerPhone:'+66 2 537 3000',
    route:'SRC-KKN', wbs:'025.SRC.NGV.020', shippingType:'01 - Truck',
    pickupAddress:'PTT NGV Saraburi', deliveryAddress:'PTT NGV Station, Khon Kaen',
    products:[{name:'NGV Compressed Gas',quantity:1,unit:'Full Load',weight:16000}],
    totalWeight:16000, totalVolume:16, requestedPickupDate:'2026-02-08', requestedDeliveryDate:'2026-02-08',
    specialInstructions:'Pressure: 250 bar. PSI check.',
    status:'REPORT_IN', ocrConfidence:null, createdAt:'2026-01-31 10:00', createdBy:'System (Excel)',
    language:null, originalDocument:'ngv_schedule_feb.xlsx',
    reviewedBy:'NGV Ops', reviewedAt:'2026-01-31 11:00', approver:'Fleet Manager',
    approverComments:'Dispatch confirmed.',
    estimatedValue:55000, assignedFleet:'TK-NGV-02', shipmentId:'SH-2026-000078'
  },
  {
    id:'FO-2026-0013', source:'Manual Entry', bu:'SCA', shipmentType:'00 — SCA Car', productType:'Car',
    customerName:'Isuzu Motors (Thailand) Co., Ltd.', customerEmail:'fleet@isuzu.co.th', customerPhone:'+66 2 966 2111',
    route:'GTW-HYI', wbs:'025.GTW.SCA.025', shippingType:'01 - Truck',
    pickupAddress:'Isuzu Gateway Plant, Chachoengsao', deliveryAddress:'Isuzu Hat Yai Dealer',
    products:[{name:'Isuzu D-Max',quantity:6,unit:'pcs',weight:2200}],
    totalWeight:13200, totalVolume:0, requestedPickupDate:'2026-02-09', requestedDeliveryDate:'2026-02-10',
    specialInstructions:'Long haul south. Rest stop required.',
    status:'CLOSED', ocrConfidence:null, createdAt:'2026-01-25 09:00', createdBy:'Wipaporn K.',
    language:null, originalDocument:null,
    reviewedBy:'Wipaporn K.', reviewedAt:'2026-01-25 09:10', approver:'Fleet Manager',
    approverComments:'Completed successfully.',
    estimatedValue:42000, assignedFleet:'TH-8345', shipmentId:'SH-2026-000060', closedAt:'2026-02-01 16:00'
  },
  {
    id:'FO-2026-0014', source:'Forecast Upload', bu:'SPL', shipmentType:'ML — Coastal', productType:'Container',
    customerName:'บจก. เอเชีย แพค (Shipper)', customerEmail:'container@asiapac.co.th', customerPhone:'+66 38 400 555',
    route:'LCH-MTP', wbs:'08S.26CF.NPSRT2.S003', shippingType:'03 - Vessel',
    pickupAddress:'Laem Chabang Port', deliveryAddress:'Map Ta Phut Port',
    products:[{name:'Chemical Container',quantity:15,unit:'TEU',weight:380}],
    totalWeight:380000, totalVolume:15, requestedPickupDate:'2026-02-15', requestedDeliveryDate:'2026-02-17',
    specialInstructions:'Vessel: NPSRT2, Voy: S003. 5x20GP + 10x40GP',
    status:'OPEN', ocrConfidence:null, createdAt:'2026-01-29 10:00', createdBy:'System (Forecast)',
    language:null, originalDocument:'forecast_feb2026_spl.xlsx',
    reviewedBy:'Ops Team', reviewedAt:'2026-01-29 14:00', approver:null, approverComments:null, estimatedValue:320000
  },
  {
    id:'FO-2026-0015', source:'PDF Upload', bu:'SCC', shipmentType:'0603 — Chemical', productType:'Chemical',
    customerName:'บริษัท ไทยออยล์ จำกัด (มหาชน)', customerEmail:'logistics@thaioil.co.th', customerPhone:'+66 38 359 000',
    route:'SRC-RYG', wbs:'025.SRC.CHEM.020', shippingType:'01 - Truck',
    pickupAddress:'Thai Oil Refinery, Sriracha', deliveryAddress:'Eastern Seaboard Industrial Estate, Rayong',
    products:[{name:'Benzene',quantity:25000,unit:'Liters',weight:21000}],
    totalWeight:21000, totalVolume:25, requestedPickupDate:'2026-02-06', requestedDeliveryDate:'2026-02-06',
    specialInstructions:'HAZMAT Class 3. Flash Point 12°C. Emergency contact required.',
    status:'REVISION_REQUIRED', ocrConfidence:78.5, createdAt:'2026-02-02 11:00', createdBy:'System (OCR BOT)',
    language:'Thai', originalDocument:'thaioil_chem_015.pdf',
    reviewedBy:'Chem Ops', reviewedAt:'2026-02-02 12:00', approver:'Safety Manager',
    approverComments:'OCR confidence low. Re-verify quantity and UN number.',
    estimatedValue:200000
  },
  {
    id:'FO-2026-0016', source:'TMS API', bu:'SCC', shipmentType:'0605 — Fuel', productType:'Fuel',
    customerName:'Shell (Thailand) Ltd.', customerEmail:'orders@shell.co.th', customerPhone:'+66 2 262 7777',
    route:'SHL-BKK', wbs:'025.SHL.FUEL.050', shippingType:'01 - Truck',
    pickupAddress:'Shell Depot, Si Racha', deliveryAddress:'Shell Station Network, Bangkok',
    products:[{name:'Shell V-Power 97',quantity:30000,unit:'Liters',weight:24000}],
    totalWeight:24000, totalVolume:30, requestedPickupDate:'2026-02-07', requestedDeliveryDate:'2026-02-07',
    specialInstructions:'Premium fuel. Temperature controlled.',
    status:'CLOSED', ocrConfidence:null, createdAt:'2026-01-27 08:00', createdBy:'System (TMS API)',
    language:null, originalDocument:null,
    reviewedBy:'Fuel Ops', reviewedAt:'2026-01-27 09:00', approver:'Fleet Manager',
    approverComments:'Completed. All delivered.',
    estimatedValue:180000, assignedFleet:'TK-8801', shipmentId:'SH-2026-000055', closedAt:'2026-02-02 17:00'
  },
];

/* ===== FOStatusBadge (custom for FO statuses - more than shipment statuses) ===== */
function FOStatusBadge({ status }) {
  const cfg = foStatusConfig[status] || { label: status, css: 'bg-gray-100 text-gray-700', icon: '' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${cfg.css}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function FOSourceBadge({ source }) {
  const cfg = foSourceConfig[source] || { css: 'bg-gray-100 text-gray-700', icon: '' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold whitespace-nowrap ${cfg.css}`}>
      {cfg.icon} {source}
    </span>
  );
}

/* ===== MAIN MODULE ===== */
export default function FreightOrderModule() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState(initialOrders);
  const [view, setView] = useState('list'); // list | review | detail
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [filterBU, setFilterBU] = useState('');
  const [filterSource, setFilterSource] = useState('');

  // Modal states
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTMSModal, setShowTMSModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showEditDraftModal, setShowEditDraftModal] = useState(false);
  const [uploadType, setUploadType] = useState('pdf');
  const [preSelectedBU, setPreSelectedBU] = useState('');
  const [preSelectedProduct, setPreSelectedProduct] = useState('');
  const [editDraft, setEditDraft] = useState(null);

  /* KPI counts */
  const kpis = useMemo(() => {
    const counts = {};
    Object.keys(foStatusConfig).forEach(k => { counts[k] = orders.filter(o => o.status === k).length; });
    return {
      total: orders.length,
      PENDING_REVIEW: counts.PENDING_REVIEW || 0,
      OPEN: (counts.OPEN || 0) + (counts.CONFIRMED || 0),
      SHIPMENT_CREATED: counts.SHIPMENT_CREATED || 0,
      DISPATCHED: counts.DISPATCHED || 0,
      REPORT_IN: counts.REPORT_IN || 0,
      CLOSED: counts.CLOSED || 0,
    };
  }, [orders]);

  /* Filtered list */
  const filtered = useMemo(() => {
    let list = orders;
    if (activeFilter === 'OPEN') {
      list = list.filter(o => o.status === 'OPEN' || o.status === 'CONFIRMED');
    } else if (activeFilter !== 'all') {
      list = list.filter(o => o.status === activeFilter);
    }
    if (filterBU) list = list.filter(o => o.bu === filterBU);
    if (filterSource) list = list.filter(o => o.source === filterSource);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.route.toLowerCase().includes(q) ||
        (o.productType || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, activeFilter, filterBU, filterSource, search]);

  /* Status transitions */
  const updateStatus = useCallback((id, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const updated = { ...o, status: newStatus };
      if (newStatus === 'REVIEWED') { updated.reviewedBy = 'Current User'; updated.reviewedAt = new Date().toLocaleString(); }
      if (newStatus === 'CONFIRMED') { updated.freightOrderId = o.id; updated.assignedFleet = 'Pending Assignment'; }
      if (newStatus === 'DISPATCHED') { updated.assignedFleet = o.assignedFleet === 'Pending Assignment' ? 'TK-' + Math.floor(Math.random()*9000+1000) : o.assignedFleet; }
      if (newStatus === 'SHIPMENT_CREATED') { updated.shipmentId = 'SH-2026-' + String(Math.floor(Math.random()*9000+1000)).padStart(6,'0'); }
      if (newStatus === 'REPORT_IN') { /* no extra fields */ }
      if (newStatus === 'CLOSED') { updated.closedAt = new Date().toLocaleString(); updated.closedBy = 'Current User'; }
      return updated;
    }));
  }, []);

  const addOrder = useCallback((newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  }, []);

  const addOrders = useCallback((newOrders) => {
    setOrders(prev => [...newOrders, ...prev]);
  }, []);

  /* Open channel modal action handler */
  const handleChannelAction = useCallback((action, bu, product) => {
    setPreSelectedBU(bu);
    setPreSelectedProduct(product);
    setShowChannelModal(false);
    if (action === 'upload' || action === 'pdf' || action === 'excel' || action === 'email' || action === 'line' || action === 'forecast') {
      setUploadType(action);
      setShowUploadModal(true);
    } else if (action === 'tms') {
      setShowTMSModal(true);
    } else if (action === 'form' || action === 'manual') {
      setShowManualModal(true);
    }
  }, []);

  /* Create shipment bridge */
  const createShipmentBridge = useCallback((order) => {
    if (window.confirm(`📋 Create Shipment for ${order.id}?\n\nBU: ${order.bu}\nType: ${order.shipmentType}\nRoute: ${order.route}\nCustomer: ${order.customerName}\n\nThis will navigate to Create Shipment screen.`)) {
      updateStatus(order.id, 'SHIPMENT_CREATED');
      // Post message for cross-module communication
      const qty = order.products?.[0] ? Number(order.products[0].quantity).toLocaleString() + ' ' + order.products[0].unit : '20,000 L';
      let dt = order.requestedPickupDate || '09.02.2026';
      if (dt.includes('-')) { const pts = dt.split('-'); dt = pts[2]+'.'+pts[1]+'.'+pts[0]; }
      window.parent.postMessage({
        _mid: 'fo_'+order.id+'_'+Date.now(),
        type: 'FO_TO_SHIPMENT',
        fo: { id:order.id, product:order.productType||'LPG', bu:order.bu||'SCC', site:'060C', route:order.route, customer:order.customerName, qty, date:dt, wbs:order.wbs||'N/A' }
      }, '*');
    }
  }, [updateStatus]);

  const dispatchOrder = useCallback((order) => {
    if (window.confirm(`🚀 Dispatch ${order.shipmentId}?\n\nThis will notify the assigned driver via mobile app.`)) {
      updateStatus(order.id, 'DISPATCHED');
      window.alert(`🚀 ${order.shipmentId} dispatched!\nDriver notified via mobile app.\n\n→ Next: Driver executes → Report-In → Settlement`);
    }
  }, [updateStatus]);

  const reportIn = useCallback((order) => {
    updateStatus(order.id, 'REPORT_IN');
    // Cross-module bridge: notify shipment/report-in module
    window.parent.postMessage({
      _mid: 'ri_' + order.id + '_' + Date.now(),
      type: 'SHIPMENT_TO_REPORTIN',
      shipment: {
        id: order.shipmentId || 'SHP-2026-' + String(Math.floor(Math.random() * 9000 + 1000)),
        foId: order.id,
        type: order.productType || 'LPG',
        bu: order.bu || '060C',
        route: order.route || '',
        driver: order.assignedDriver || '',
        plate: order.assignedFleet || '',
        customer: order.customerName,
        lastTruckMiles: 125430,
        status: 'DISPATCHED',
        riStatus: 'awaiting',
      },
    }, '*');
  }, [updateStatus]);

  const closeOrder = useCallback((order) => {
    if (window.confirm(`Close order ${order.id}?\n\nThis will mark the order as fully completed.`)) {
      updateStatus(order.id, 'CLOSED');
      window.alert(`✅ Order Closed!\n\nOrder ${order.id} has been completed.`);
    }
  }, [updateStatus]);

  /* ======= REVIEW VIEW ======= */
  if (view === 'review' && selectedOrder) {
    const o = selectedOrder;
    return (
      <div className="bg-white rounded-[10px] shadow-sm border border-[#ededed] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#ededed]" style={{background:'#fff8e1'}}>
          <div className="flex items-center gap-4">
            <button className="px-3 py-1 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]"
              onClick={() => { setView('list'); setSelectedOrder(null); }}>
              {t('common.back')}
            </button>
            <div>
              <strong>⏳ {t('freightOrders.review.title')} — {o.id}</strong>
              <div className="text-xs text-[#6a6d70]">{t('freightOrders.review.verifyData')}</div>
            </div>
          </div>
          {o.ocrConfidence
            ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#e65100]">🎯 {t('freightOrders.review.ocrConfidence')}: {o.ocrConfidence}%</span>
            : <FOSourceBadge source={o.source} />
          }
        </div>
        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-6 p-6">
          {/* LEFT: Editable form */}
          <div>
            <h3 className="text-sm font-semibold mb-3">📋 {t('freightOrders.review.extractedData')}</h3>
            {/* BU & Type */}
            <SectionCard title="🏢 Business Unit & Type">
              <div className="grid grid-cols-3 gap-3">
                <FormField label="BU"><select className="fc" defaultValue={o.bu}><option>{o.bu}</option></select></FormField>
                <FormField label="Shipment Type"><input type="text" className="fc" defaultValue={o.shipmentType} /></FormField>
                <FormField label="Product Type"><input type="text" className="fc" defaultValue={o.productType} /></FormField>
              </div>
            </SectionCard>
            {/* Customer */}
            <SectionCard title="👤 Customer">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Name" required><input type="text" className="fc" defaultValue={o.customerName} /></FormField>
                <FormField label="Phone"><input type="tel" className="fc" defaultValue={o.customerPhone} /></FormField>
                <FormField label="Email"><input type="email" className="fc" defaultValue={o.customerEmail} /></FormField>
              </div>
            </SectionCard>
            {/* Route & WBS */}
            <SectionCard title="📍 Route & WBS">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Route" required><input type="text" className="fc" defaultValue={o.route} /></FormField>
                <FormField label="WBS" required><input type="text" className="fc" defaultValue={o.wbs} /></FormField>
                <FormField label="Pickup"><textarea className="fc" rows={2} defaultValue={o.pickupAddress} /></FormField>
                <FormField label="Delivery"><textarea className="fc" rows={2} defaultValue={o.deliveryAddress} /></FormField>
              </div>
            </SectionCard>
            {/* Cargo */}
            <SectionCard title="📦 Cargo">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-2"><FormField label="Product"><input type="text" className="fc" defaultValue={o.products[0]?.name || ''} /></FormField></div>
                <FormField label="Qty"><input type="number" className="fc" defaultValue={o.products[0]?.quantity || 0} /></FormField>
                <FormField label="Unit"><input type="text" className="fc" defaultValue={o.products[0]?.unit || ''} /></FormField>
              </div>
            </SectionCard>
            {/* Schedule */}
            <SectionCard title={t('freightOrders.detail.schedule')}>
              <div className="grid grid-cols-4 gap-3">
                <FormField label="Pickup Date"><input type="date" className="fc" defaultValue={o.requestedPickupDate} /></FormField>
                <FormField label="Delivery Date"><input type="date" className="fc" defaultValue={o.requestedDeliveryDate} /></FormField>
                <FormField label="Weight (kg)"><input type="number" className="fc" defaultValue={o.totalWeight} /></FormField>
                <FormField label="Volume (m³)"><input type="number" className="fc" defaultValue={o.totalVolume} /></FormField>
              </div>
              <FormField label="Special Instructions" className="mt-2">
                <textarea className="fc" rows={2} defaultValue={o.specialInstructions} />
              </FormField>
            </SectionCard>
          </div>
          {/* RIGHT: Document & Checklist */}
          <div>
            <h3 className="text-sm font-semibold mb-3">📄 {t('freightOrders.review.originalDocument')}</h3>
            <div className="bg-[#f5f5f5] border border-[#d9d9d9] rounded-lg p-8 text-center min-h-[250px] flex flex-col items-center justify-center">
              <div className="text-5xl mb-2">📄</div>
              <div className="font-medium">{o.originalDocument || t('freightOrders.noDocument')}</div>
              <div className="text-xs text-[#89919a] mt-1">{o.source} • {o.language || 'N/A'}</div>
              {o.originalDocument && (
                <button className="mt-3 px-3 py-1 text-xs rounded border border-[#0854a0] text-[#0854a0] hover:bg-[#ebf5ff]">
                  {t('freightOrders.review.downloadOriginal')}
                </button>
              )}
            </div>
            {o.status === 'REVISION_REQUIRED' && o.approverComments && (
              <div className="mt-4 p-3 rounded-md text-sm flex items-center gap-2" style={{background:'#fff8e1', borderLeft:'3px solid #e9730c', color:'#7a5400'}}>
                ⚠️ <strong>Manager:</strong> {o.approverComments}
              </div>
            )}
            <SectionCard title={'✅ ' + t('freightOrders.review.reviewChecklist')} className="mt-4">
              {[t('freightOrders.review.checklistItems.customer'),t('freightOrders.review.checklistItems.route'),t('freightOrders.review.checklistItems.cargo'),t('freightOrders.review.checklistItems.dates'),t('freightOrders.review.checklistItems.bu'),t('freightOrders.review.checklistItems.instructions')].map((item, i) => (
                <label key={i} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#0854a0]" />
                  {item}
                </label>
              ))}
            </SectionCard>
          </div>
        </div>
        {/* Action Bar */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-[#d9d9d9] bg-[#fafafa]">
          <button className="px-3 py-1.5 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]"
            onClick={() => { setView('list'); setSelectedOrder(null); }}>{t('common.cancel')}</button>
          <button className="px-3 py-1.5 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]"
            onClick={() => { updateStatus(o.id, 'PENDING_REVIEW'); window.alert(`💾 Draft saved for ${o.id}`); }}>
            {t('common.saveDraft')}
          </button>
          <button className="px-4 py-1.5 text-xs rounded bg-[#0854a0] text-white hover:bg-[#0a6ed1] font-medium"
            onClick={() => { updateStatus(o.id, 'REVIEWED'); setView('list'); setSelectedOrder(null); window.alert(`✅ ${o.id} marked as Reviewed!\nData validated. Ready to confirm as Freight Order.`); }}>
            {t('freightOrders.review.markReviewed')}
          </button>
        </div>
      </div>
    );
  }

  /* ======= DETAIL VIEW ======= */
  if (view === 'detail' && selectedOrder) {
    const o = selectedOrder;
    const st = foStatusConfig[o.status];
    return (
      <div className="bg-white rounded-[10px] shadow-sm border border-[#ededed] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#ededed]">
          <div className="flex items-center gap-4">
            <button className="px-3 py-1 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]"
              onClick={() => { setView('list'); setSelectedOrder(null); }}>
              {t('common.back')}
            </button>
            <div>
              <strong>{o.id}</strong> — {o.customerName}
              <div className="text-xs text-[#6a6d70]">{o.route} • {o.productType} • {o.bu}</div>
            </div>
          </div>
          <FOStatusBadge status={o.status} />
        </div>
        <div className="p-6">
          {/* 3-col detail grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Order Info */}
            <div className="bg-[#fafafa] border border-[#ededed] rounded-lg p-4">
              <h4 className="text-xs font-semibold text-[#6a6d70] mb-2">📋 {t('freightOrders.detail.orderInfo')}</h4>
              <DetailRow label="Order ID" value={o.id} />
              <DetailRow label="Source" value={<FOSourceBadge source={o.source} />} />
              <DetailRow label="BU" value={o.bu} />
              <DetailRow label="Shipment Type" value={o.shipmentType} />
              <DetailRow label="Product" value={o.productType} />
              <DetailRow label="Created" value={o.createdAt} />
              <DetailRow label="Created By" value={o.createdBy} />
              {o.ocrConfidence && <DetailRow label="OCR" value={`${o.ocrConfidence}%`} />}
            </div>
            {/* Customers / Ship-To */}
            <div className="bg-[#fafafa] border border-[#ededed] rounded-lg p-4">
              <h4 className="text-xs font-semibold text-[#6a6d70] mb-2">👤 {t('freightOrders.detail.customersShipTo')}</h4>
              <div className="max-h-[200px] overflow-y-auto">
                {o.customers && o.customers.length > 0 ? o.customers.map((c, i) => (
                  <div key={i} className="p-2 mb-2 bg-[#f9f9f9] rounded-md border-l-[3px] border-[#0854a0]">
                    <div className="font-semibold text-[#0854a0] text-xs">{i+1}. {c.name}</div>
                    <div className="text-[11px] text-[#6a6d70]">
                      {c.shipToCode && <span>📍 {c.shipToCode} • </span>}
                      {c.address}
                      {c.volume && <> • <strong>{c.volume}</strong></>}
                    </div>
                  </div>
                )) : (
                  <div className="p-2 mb-2 bg-[#f9f9f9] rounded-md border-l-[3px] border-[#0854a0]">
                    <div className="font-semibold text-[#0854a0] text-xs">1. {o.customerName}</div>
                    <div className="text-[11px] text-[#6a6d70]">{o.customerEmail} • {o.customerPhone}</div>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <DetailRow label="Route" value={<strong>{o.route}</strong>} />
                <DetailRow label="WBS" value={o.wbs} />
              </div>
            </div>
            {/* Schedule */}
            <div className="bg-[#fafafa] border border-[#ededed] rounded-lg p-4">
              <h4 className="text-xs font-semibold text-[#6a6d70] mb-2">📅 {t('freightOrders.detail.schedule')}</h4>
              <DetailRow label="Pickup" value={o.requestedPickupDate} />
              <DetailRow label="Delivery" value={o.requestedDeliveryDate} />
              <DetailRow label="Weight" value={`${o.totalWeight?.toLocaleString()} kg`} />
              {o.shipmentId && <DetailRow label="Shipment" value={<strong className="text-[#0854a0]">{o.shipmentId}</strong>} />}
              {o.assignedFleet && <DetailRow label="Fleet" value={o.assignedFleet} />}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="mt-4 bg-white border border-[#ededed] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-[#6a6d70] mb-3">{'📋'} Workflow Steps</h4>
            <div className="flex items-center justify-between overflow-x-auto gap-1">
              {[
                { key: 'OPEN', label: t('freightOrders.kpi.open'), icon: '📂' },
                { key: 'SHIPMENT_CREATED', label: t('freightOrders.kpi.shipmentCreated'), icon: '📋' },
                { key: 'DISPATCHED', label: t('freightOrders.kpi.dispatched'), icon: '🚀' },
                { key: 'REPORT_IN', label: t('freightOrders.kpi.reportIn'), icon: '📥' },
                { key: 'CLOSED', label: t('freightOrders.kpi.closed'), icon: '✅' },
              ].map((step, i, arr) => {
                const statusOrder = ['PENDING_REVIEW', 'REVIEWED', 'OPEN', 'CONFIRMED', 'SHIPMENT_CREATED', 'DISPATCHED', 'REPORT_IN', 'CLOSED'];
                const currentIdx = statusOrder.indexOf(o.status);
                const stepIdx = statusOrder.indexOf(step.key);
                const isActive = stepIdx <= currentIdx;
                const isCurrent = step.key === o.status || (step.key === 'OPEN' && ['PENDING_REVIEW', 'REVIEWED', 'OPEN', 'CONFIRMED'].includes(o.status));
                return (
                  <div key={step.key} className="flex items-center">
                    <div className="flex flex-col items-center min-w-[80px]">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm"
                        style={{
                          background: isActive ? '#0854a0' : '#e0e0e0',
                          color: isActive ? '#fff' : '#999',
                          boxShadow: isCurrent ? '0 0 8px rgba(8,84,160,0.4)' : 'none',
                        }}
                      >
                        {step.icon}
                      </div>
                      <span className="text-[10px] text-center mt-1 font-medium" style={{ color: isActive ? '#0854a0' : '#bbb' }}>
                        {step.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="mx-1 text-xs" style={{ color: isActive ? '#0854a0' : '#ccc' }}>{'→'}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Manager comments */}
          {o.approverComments && (
            <div className={`mt-4 p-3 rounded-md text-sm flex items-center gap-2 ${o.status === 'REVISION_REQUIRED' ? 'bg-[#fff8e1] border-l-[3px] border-[#e9730c] text-[#7a5400]' : 'bg-[#e8f5e9] border-l-[3px] border-[#107e3e] text-[#1b5e20]'}`}>
              💬 <strong>Manager:</strong> {o.approverComments}
            </div>
          )}

          {/* Special Instructions */}
          {o.specialInstructions && (
            <SectionCard title={t('freightOrders.detail.specialInstructions')} className="mt-4">
              <div className="text-sm">{o.specialInstructions}</div>
            </SectionCard>
          )}

          {/* Bridge banners */}
          {st.canCreateShipment && (
            <div className="mt-4 flex items-center gap-4 p-5 rounded-[10px] border-2 border-[#107e3e]" style={{background:'linear-gradient(135deg,#e8f5e9,#c8e6c9)'}}>
              <div className="text-4xl">🚛</div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#1b5e20]">{t('freightOrders.detail.readyToCreateShipment')}</h4>
                <p className="text-xs text-[#2e7d32] mt-0.5">{t('freightOrders.detail.readyDescription')}</p>
              </div>
              <button className="px-4 py-2 text-sm rounded bg-[#107e3e] text-white hover:bg-[#0d6b34] font-medium"
                onClick={() => createShipmentBridge(o)}>
                {t('freightOrders.actions.createShipment')} →
              </button>
            </div>
          )}
          {st.canDispatch && (
            <div className="mt-4 flex items-center gap-4 p-5 rounded-[10px] border-2 border-[#3f51b5]" style={{background:'linear-gradient(135deg,#e8eaf6,#c5cae9)'}}>
              <div className="text-4xl">🚀</div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#1a237e]">{t('freightOrders.detail.shipmentCreatedReady')}</h4>
                <p className="text-xs text-[#283593] mt-0.5">Shipment {o.shipmentId} {t('freightOrders.detail.dispatchDescription')}</p>
              </div>
              <button className="px-4 py-2 text-sm rounded bg-[#0854a0] text-white hover:bg-[#0a6ed1] font-medium"
                onClick={() => dispatchOrder(o)}>
                {t('shipments.detail.dispatchNow')}
              </button>
            </div>
          )}
          {o.status === 'DISPATCHED' && (
            <div className="mt-4 flex items-center gap-4 p-5 rounded-[10px] border-2 border-[#107e3e]" style={{background:'linear-gradient(135deg,#e8f5e9,#a5d6a7)'}}>
              <div className="text-4xl">✅</div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#1b5e20]">{t('freightOrders.kpi.dispatched')} — {o.shipmentId}</h4>
                <p className="text-xs text-[#2e7d32] mt-0.5">Driver notified. Fleet: {o.assignedFleet}. Monitoring in Fleet Cockpit.</p>
              </div>
              <button className="px-3 py-1.5 text-xs rounded border border-[#0854a0] text-[#0854a0] hover:bg-[#ebf5ff]"
                onClick={() => window.alert(`${t('common.export')} for ${o.shipmentId}`)}>
                {t('common.export')}
              </button>
              <button className="px-3 py-1.5 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]"
                onClick={() => window.alert('Opening Fleet Cockpit...')}>
                {t('freightOrders.trackCockpit')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ======= LIST VIEW (default) ======= */
  const kpiTiles = [
    { key:'all',               label:t('freightOrders.kpi.total'),        val:kpis.total,              sub:t('freightOrders.kpi.allSources'),       color:'text-[#32363a]' },
    { key:'PENDING_REVIEW',    label:'⏳ ' + t('freightOrders.kpi.pendingReview'),   val:kpis.PENDING_REVIEW,     sub:t('freightOrders.kpi.needsValidation'),  color:'text-[#e65100]' },
    { key:'OPEN',              label:'📂 ' + t('freightOrders.kpi.open'),       val:kpis.OPEN,               sub:t('freightOrders.kpi.createShipmentSub'),   color:'text-[#2e7d32]' },
    { key:'SHIPMENT_CREATED',  label:'📋 ' + t('freightOrders.kpi.shipmentCreated'), val:kpis.SHIPMENT_CREATED, sub:t('freightOrders.kpi.readyDispatch'), color:'text-[#283593]' },
    { key:'DISPATCHED',        label:'🚀 ' + t('freightOrders.kpi.dispatched'), val:kpis.DISPATCHED,         sub:t('freightOrders.kpi.reportInPending'), color:'text-[#7b1fa2]' },
    { key:'REPORT_IN',         label:'📥 ' + t('freightOrders.kpi.reportIn'),  val:kpis.REPORT_IN,          sub:t('freightOrders.kpi.tripCompleted'),    color:'text-[#00695c]' },
    { key:'CLOSED',            label:'✅ ' + t('freightOrders.kpi.closed'),           val:kpis.CLOSED,             sub:t('common.status.completed'),         color:'text-[#616161]' },
  ];

  const panelTitle = activeFilter === 'all' ? t('freightOrders.allOrders') : (foStatusConfig[activeFilter]?.label || '') + ' Orders';

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#32363a]">{t('freightOrders.pageTitle')}</h1>
          <p className="text-xs text-[#6a6d70] mt-0.5">{t('freightOrders.pageSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowChannelModal(true)}
            className="px-3 py-1.5 text-xs rounded-md border border-[#0854a0] text-[#0854a0] hover:bg-[#ebf5ff] font-medium flex items-center gap-1">
            ➕ {t('freightOrders.newFO')}
          </button>
          <button onClick={() => {
              const csv = ['ID,Status,Source,Customer,Product,Qty,Route,Created'].concat(
                filtered.map(fo => `${fo.id},${fo.status},${fo.source},${fo.customerName || ''},${fo.productType || ''},${fo.products?.[0]?.quantity || ''},${fo.route || ''},${fo.created || ''}`)
              ).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `freight_orders_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
            }}
            className="px-3 py-1.5 text-xs rounded-md border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8] font-medium flex items-center gap-1">
            📊 {t('common.export')}
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 bg-white border-b border-[#ededed] rounded-lg p-3">
        {kpiTiles.map(tile => (
          <button key={tile.key} onClick={() => setActiveFilter(tile.key)}
            className={`min-w-[120px] px-3 py-2 border rounded-lg cursor-pointer transition-all flex-shrink-0 text-left
              ${activeFilter === tile.key ? 'border-[#0854a0] shadow-[0_0_0_2px_rgba(8,84,160,0.15)]' : 'border-[#d9d9d9] hover:shadow-sm'} bg-white`}>
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#6a6d70] flex items-center gap-1">{tile.label}</div>
            <div className={`text-xl font-bold mt-0.5 ${tile.color}`}>{tile.val}</div>
            <div className="text-[10px] text-[#89919a] mt-0.5">{tile.sub}</div>
          </button>
        ))}
      </div>

      {/* Table Panel */}
      <div className="bg-white rounded-[10px] shadow-sm border border-[#ededed] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#ededed]">
          <span className="font-semibold text-sm">{panelTitle}</span>
          <span className="text-xs text-[#89919a]">({filtered.length} items)</span>
        </div>
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-[#ededed] bg-[#fafafa]">
          <div className="relative flex-1 max-w-[320px]">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">🔍</span>
            <input type="text" placeholder={t('common.search') + '...'} value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 border border-[#d9d9d9] rounded-md text-xs font-sans focus:outline-none focus:border-[#0854a0]" />
          </div>
          <select value={filterBU} onChange={e => setFilterBU(e.target.value)}
            className="px-2 py-1.5 border border-[#d9d9d9] rounded text-[11px] bg-white">
            <option value="">{t('freightOrders.filters.allBU')}</option>
            <option value="SCC">SCC</option>
            <option value="SCA">SCA</option>
            <option value="SPL">SPL</option>
            <option value="SCM">SCM</option>
          </select>
          <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
            className="px-2 py-1.5 border border-[#d9d9d9] rounded text-[11px] bg-white">
            <option value="">{t('freightOrders.filters.allSources')}</option>
            <option value="PDF Upload">PDF/OCR</option>
            <option value="Email RPA">Email RPA</option>
            <option value="TMS API">TMS API</option>
            <option value="Manual Entry">Manual</option>
            <option value="Excel Upload">Excel</option>
            <option value="Forecast Upload">Forecast</option>
          </select>
        </div>
        {/* Table */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#f0f3f5] border-b border-[#d9d9d9]">
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap">{t('freightOrders.table.foId')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap">{t('freightOrders.table.source')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap">{t('freightOrders.table.bu')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap">{t('freightOrders.table.customer')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap">{t('freightOrders.table.route')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap">{t('freightOrders.table.productType')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap">{t('freightOrders.table.pickupDate')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap">{t('freightOrders.table.status')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#6a6d70] text-[11px] whitespace-nowrap w-[200px]">{t('freightOrders.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const st = foStatusConfig[o.status] || {};
                  return (
                    <tr key={o.id} onClick={() => { setSelectedOrder(o); setView('detail'); }}
                      className="border-b border-[#ededed] hover:bg-[#ebf5ff] cursor-pointer transition-colors">
                      <td className="px-3 py-2"><strong className="text-[#0854a0]">{o.id}</strong></td>
                      <td className="px-3 py-2"><FOSourceBadge source={o.source} /></td>
                      <td className="px-3 py-2"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-gray-100 text-[#616161]">{o.bu}</span></td>
                      <td className="px-3 py-2"><span className="max-w-[180px] truncate block" title={o.customerName}>{o.customerName}</span></td>
                      <td className="px-3 py-2"><strong>{o.route}</strong></td>
                      <td className="px-3 py-2">{o.productType || '—'}</td>
                      <td className="px-3 py-2">{o.requestedPickupDate}</td>
                      <td className="px-3 py-2"><FOStatusBadge status={o.status} /></td>
                      <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1 flex-wrap">
                          {st.canReview && (
                            <button className="px-2 py-0.5 text-[10.5px] rounded bg-[#e9730c] text-white hover:bg-[#d46400] font-medium"
                              onClick={() => { setSelectedOrder(o); setView('review'); }}>
                              {t('freightOrders.actions.review')}
                            </button>
                          )}
                          {st.canConfirm && (
                            <button className="px-2 py-0.5 text-[10.5px] rounded bg-[#107e3e] text-white hover:bg-[#0d6b34] font-medium"
                              onClick={() => updateStatus(o.id, 'CONFIRMED')}>
                              {t('freightOrders.actions.confirmFO')}
                            </button>
                          )}
                          {st.canCreateShipment && (
                            <button className="px-2 py-0.5 text-[10.5px] rounded bg-[#107e3e] text-white hover:bg-[#0d6b34] font-medium"
                              onClick={() => createShipmentBridge(o)}>
                              {t('freightOrders.actions.createShipment')}
                            </button>
                          )}
                          {st.canDispatch && (
                            <button className="px-2 py-0.5 text-[10.5px] rounded bg-[#0854a0] text-white hover:bg-[#0a6ed1] font-medium"
                              onClick={() => dispatchOrder(o)}>
                              {t('freightOrders.actions.dispatch')}
                            </button>
                          )}
                          {st.canReportIn && (
                            <button className="px-2 py-0.5 text-[10.5px] rounded bg-[#107e3e] text-white hover:bg-[#0d6b34] font-medium"
                              onClick={() => reportIn(o)}>
                              {t('freightOrders.actions.reportIn')}
                            </button>
                          )}
                          {st.canClose && (
                            <button className="px-2 py-0.5 text-[10.5px] rounded bg-[#f5f5f5] text-[#32363a] border border-[#d9d9d9] hover:bg-[#e8e8e8] font-medium"
                              onClick={() => closeOrder(o)}>
                              {t('common.close')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-[#89919a]">
            <div className="text-4xl mb-2">📭</div>
            <div>{t('common.noDataFound')}</div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showChannelModal && (
        <ChannelModal
          onClose={() => setShowChannelModal(false)}
          onSelect={handleChannelAction}
        />
      )}
      {showUploadModal && (
        <UploadModal
          type={uploadType}
          preSelectedBU={preSelectedBU}
          preSelectedProduct={preSelectedProduct}
          onClose={() => { setShowUploadModal(false); setPreSelectedBU(''); setPreSelectedProduct(''); }}
          onEditDraft={(draft) => { setEditDraft(draft); setShowEditDraftModal(true); }}
          onConfirmDrafts={(drafts) => {
            const newOrders = drafts.map(fo => ({
              id: fo.id.replace('DRAFT','OPEN'),
              source: uploadType === 'excel' ? 'Excel Upload' : uploadType === 'email' ? 'Email RPA' : 'PDF Upload',
              bu: fo.bu, shipmentType: fo.productType, productType: fo.productType,
              customerName: fo.customer, customerEmail: 'customer@example.com', customerPhone: '+66 2 XXX XXXX',
              customers: fo.shipToList ? fo.shipToList.map(st => ({name:st.name, shipToCode:st.code, address:st.address, volume:(st.diesel?st.diesel+'K Diesel':'')+(st.g95?' + '+st.g95+'K G95':'')})) : [{name:fo.customer,shipToCode:'',address:fo.deliveryAddress||'',volume:fo.quantity+' '+fo.unit}],
              route: fo.route, wbs: fo.wbs || '025.AUTO.GEN', shippingType: '01 - Truck',
              pickupAddress: fo.pickupAddress || '', deliveryAddress: fo.deliveryAddress || '',
              products: [{name:fo.productName||fo.productType, quantity:parseInt(String(fo.quantity).replace(/,/g,''))||1, unit:fo.unit||'L', weight:1000}],
              totalWeight: 10000, totalVolume: 25, requestedPickupDate: fo.loadDate || fo.deliveryDate, requestedDeliveryDate: fo.deliveryDate,
              specialInstructions: fo.specialInstructions || 'Extracted via OCR',
              status: 'OPEN', ocrConfidence: parseFloat(fo.ocrConf),
              createdAt: new Date().toLocaleString(), createdBy: 'System (OCR)',
              language: 'Thai', originalDocument: 'uploaded_file.pdf',
              plant: fo.plant, reviewedBy: null, reviewedAt: null, approver: null, approverComments: null
            }));
            addOrders(newOrders);
            setShowUploadModal(false);
            window.alert(`✅ ${newOrders.length} Freight Order(s) Created!\nStatus: OPEN — Ready for Create Shipment`);
          }}
        />
      )}
      {showEditDraftModal && editDraft && (
        <EditDraftModal
          draft={editDraft}
          onClose={() => { setShowEditDraftModal(false); setEditDraft(null); }}
          onSave={(updated) => { setEditDraft(updated); setShowEditDraftModal(false); }}
          onConfirm={(confirmed) => {
            const newOrder = {
              id: confirmed.id.replace('DRAFT','OPEN'),
              source: 'PDF Upload', bu: confirmed.bu, shipmentType: confirmed.productType, productType: confirmed.productType,
              customerName: confirmed.customer, customerEmail: confirmed.email || 'customer@example.com', customerPhone: confirmed.phone || '+66 2 XXX',
              route: confirmed.route, wbs: confirmed.wbs || '025.AUTO.GEN', shippingType: '01 - Truck',
              pickupAddress: confirmed.pickupAddress || '', deliveryAddress: confirmed.deliveryAddress || '',
              products: [{name:confirmed.productName||confirmed.productType, quantity:parseInt(String(confirmed.quantity).replace(/,/g,''))||1, unit:confirmed.unit||'L', weight:1000}],
              totalWeight: parseInt(confirmed.weight)||10000, totalVolume: 25,
              requestedPickupDate: confirmed.deliveryDate, requestedDeliveryDate: confirmed.deliveryDate,
              specialInstructions: confirmed.specialInstructions || '',
              status: 'OPEN', ocrConfidence: parseFloat(confirmed.ocrConf),
              createdAt: new Date().toLocaleString(), createdBy: 'System (OCR)',
              language: 'Thai', originalDocument: 'uploaded_file.pdf',
              reviewedBy: null, reviewedAt: null, approver: null, approverComments: null
            };
            addOrder(newOrder);
            setShowEditDraftModal(false); setShowUploadModal(false); setEditDraft(null);
            window.alert(`✅ Freight Order Created!\n\nID: ${newOrder.id}\nStatus: OPEN — Ready for Create Shipment`);
          }}
        />
      )}
      {showTMSModal && (
        <TMSModal
          onClose={() => setShowTMSModal(false)}
          onImport={(newOrders) => { addOrders(newOrders); setShowTMSModal(false); }}
        />
      )}
      {showManualModal && (
        <ManualEntryModal
          onClose={() => setShowManualModal(false)}
          onCreate={(newOrder) => {
            addOrder({ ...newOrder, id: `FO-2026-${String(orders.length+1).padStart(4,'0')}` });
            setShowManualModal(false);
            window.alert(`✅ ${newOrder.id || 'FO'} created!\nBU: ${newOrder.bu} | Type: ${newOrder.shipmentType}\nStatus: OPEN — Ready to submit.`);
          }}
        />
      )}
    </div>
  );
}

/* ===== Reusable sub-components ===== */
function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`bg-[#fafafa] border border-[#ededed] rounded-lg p-4 mb-3 ${className}`}>
      <h4 className="text-xs font-semibold text-[#6a6d70] mb-2 flex items-center gap-1">{title}</h4>
      {children}
    </div>
  );
}

function FormField({ label, required, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <label className="text-[11px] font-medium text-[#6a6d70]">
        {required && <span className="text-[#bb0000] font-bold">*</span>} {label}
      </label>
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between text-xs py-0.5">
      <span className="text-[#89919a]">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
