// ==================== SHIPMENT CONSTANTS ====================
// All dropdown data, sample records, and configuration from CreateShipment_AllModes_v2.html

export const PRODUCT_CONFIG = {
  LPG:       { icon: '🔥', badge: 'bg-orange-50 text-orange-700', label: 'LPG',           shipType: '0602', unit: 'kg',  truckClass: 'lpg-truck',       zlsde: 'ZLSDE003' },
  CHEM:      { icon: '🧪', badge: 'bg-purple-50 text-purple-700', label: 'Chemical',      shipType: '0603', unit: 'L',   truckClass: 'chem-truck',      zlsde: 'ZLSDE004' },
  FUEL:      { icon: '⛽',       badge: 'bg-blue-50 text-blue-700',     label: 'Fuel/WO',       shipType: '0605', unit: 'L',   truckClass: 'fuel-truck',      zlsde: 'ZLSDE017' },
  NGV:       { icon: '🟢', badge: 'bg-green-50 text-green-700',   label: 'NGV',           shipType: '0601', unit: 'm³', truckClass: 'ngv-truck',   zlsde: 'ZLSDE006' },
  CONTAINER: { icon: '📦', badge: 'bg-red-50 text-red-700',       label: 'Container',     shipType: '0606', unit: 'TEU', truckClass: 'container-truck', zlsde: 'ZLSDE015' },
  SCA:       { icon: '🚗', badge: 'bg-amber-50 text-amber-700',   label: 'Car Carrier',   shipType: '1400', unit: 'คัน', truckClass: 'sca-truck', zlsde: 'ZLSDE012' },
  TUG:       { icon: '🚢', badge: 'bg-teal-50 text-teal-700',    label: 'Tug Service',   shipType: '0201', unit: 'Job', truckClass: 'tug-boat',  zlsde: 'ZLSDE020' },
};

export function pCfg(code) {
  return PRODUCT_CONFIG[code] || PRODUCT_CONFIG.LPG;
}

// ==================== BU OPTIONS ====================
export const BU_OPTIONS = [
  { value: 'SCC', label: 'SCC — SC Carrier' },
  { value: 'SCA', label: 'SCA — SC Alliance' },
  { value: 'SCM', label: 'SCM — SC Maritime' },
  { value: 'NPM', label: 'NPM — National Port Management' },
];

// ==================== PRODUCT TYPE OPTIONS ====================
export const PRODUCT_TYPE_OPTIONS = [
  { value: 'LPG',       label: '🔥 LPG' },
  { value: 'CHEM',      label: '🧪 Chemical' },
  { value: 'FUEL',      label: '⛽ Fuel / WO (น้ำมันใส)' },
  { value: 'NGV',       label: '🟢 NGV' },
  { value: 'CONTAINER', label: '📦 Container' },
  { value: 'SCA',       label: '🚗 Car Carrier (SCA)' },
  { value: 'TUG',       label: '🚢 Tug Service (SCM)' },
];

// ==================== SITE OPTIONS (from master_O1) ====================
export const SITE_OPTIONS = [
  { value: '060B', label: '060B — COC-FUEL-LLK' },
  { value: '060C', label: '060C — ATLAS-LPG-BPK' },
  { value: '060E', label: '060E — ATLAS-LPG-NKC' },
  { value: '060U', label: '060U — ATLAS-BSRC-SRC' },
  { value: '060J', label: '060J — SHELL-FUEL-KKN' },
  { value: '060L', label: '060L — SHELL-FUEL-KBI' },
  { value: '060N', label: '060N — INC-CHEM-BRP' },
  { value: '060V', label: '060V — NFC-GYPSUM' },
  { value: '060X', label: '060X — BANGCHAK-FUEL-SSK' },
  { value: '060Z', label: '060Z — PTTOR-PremiumHSD-BRP' },
  { value: '060D', label: '060D — PTT-NGV-NPM' },
  { value: '060R', label: '060R — PTT-NGV-NPM 2' },
  { value: '0610', label: '0610 — COC-FUEL-SRT' },
  { value: '0618', label: '0618 — COC-FUEL-SSK' },
  { value: '061B', label: '061B — SHELL-FUEL-SKL' },
  { value: '061D', label: '061D — BCP-FUEL-SRC' },
  { value: '061F', label: '061F — SHELL-FUEL-LLK' },
  { value: '0620', label: '0620 — COC-FUEL-SRC' },
  { value: '0624', label: '0624 — COC-FUEL-SRB' },
  { value: '0626', label: '0626 — SHELL-FUEL-SSK' },
  { value: '0630', label: '0630 — NFC-NH3-BRP' },
  { value: '0631', label: '0631 — COC-LPG-BRP' },
  { value: '0632', label: '0632 — PTTOR-PROPANE' },
  { value: '0633', label: '0633 — ATLAS-LPG-SRC' },
  { value: '0634', label: '0634 — PTTOR-LPG-COD-BRP' },
  { value: '0636', label: '0636 — PTTGC-C3-BRP' },
  { value: '0637', label: '0637 — PTTGC-HA-BRP' },
  { value: '0639', label: '0639 — ZEON-RAFFINATE' },
  { value: '0656', label: '0656 — CMI-CHEM-SSK' },
  { value: '0660', label: '0660 — NFC-NH4-RY' },
  { value: '0665', label: '0665 — NFC-NH3-SRT' },
  { value: '0667', label: '0667 — NFC-NH3-SKL' },
  { value: '0670', label: '0670 — PTTGC-CX-BRP' },
  { value: '0675', label: '0675 — COC-LPG-NKC' },
  { value: '0685', label: '0685 — SHELL-FUEL-SRB' },
  { value: '0686', label: '0686 — BFPL-FUEL-SRB' },
  { value: '0687', label: '0687 — BFPL-FUEL-LLK' },
  { value: '0688', label: '0688 — BFPL-FUEL-SRC' },
  { value: '0691', label: '0691 — INEOS-BD-BRP' },
  { value: '1200', label: '1200 — SPL' },
  { value: '1400', label: '1400 — SCA - No Contract' },
  { value: '1401', label: '1401 — SCA - Toyota SKL' },
  { value: '1402', label: '1402 — SCA - Toyota' },
  { value: '1403', label: '1403 — SCA - Honda' },
  { value: '1404', label: '1404 — SCA - Nissan' },
  { value: '1405', label: '1405 — SCA - Mitsubishi Cor' },
  { value: '1406', label: '1406 — SCA - Mitsubishi Mot' },
  { value: '1407', label: '1407 — SCA - Eurasia Suzuki' },
  { value: '1408', label: '1408 — SCA - Apple' },
  { value: '1409', label: '1409 — SCA - Vehicle' },
  { value: '1410', label: '1410 — SCA - Other' },
  { value: '1411', label: '1411 — SCA-Toyota SRT Yard' },
  { value: '1412', label: '1412 — SCA - คาทูน นาที' },
  { value: '1413', label: '1413 — SCA - ทีซี ซีโร่ โล' },
  { value: '1414', label: '1414 — SCA - Motto Auction' },
  { value: '1415', label: '1415 — SCA - JP logistics' },
  { value: '1416', label: '1416 — SCA - บจก.ออโต้ลอจิค' },
  { value: '1417', label: '1417 — SCA-บจก.อินเตอร์-ทรา' },
  { value: '1418', label: '1418 — SCA-บจก.ชิโนทรานส์ ไ' },
  { value: '1419', label: '1419 — SCA - Ford Mot' },
];

// ==================== ชนิดสินค้า OPTIONS (from master_O1) ====================
export const PRODUCT_SUBTYPE_OPTIONS = [
  { value: '6001', label: '6001 — Acetone' },
  { value: '6002', label: '6002 — APF 80/100' },
  { value: '6003', label: '6003 — BUTANE' },
  { value: '6004', label: '6004 — BUTYL ACETATE' },
  { value: '6005', label: '6005 — BUTYL ACETATE D 175 KG' },
  { value: '6006', label: '6006 — BUTYL ACETATE D 180 KG' },
  { value: '6007', label: '6007 — BUTYL GLYCOL ETHER' },
  { value: '6008', label: '6008 — BUTYL OXITOL' },
  { value: '6009', label: '6009 — BUTYL OXITOL D 175 KG' },
  { value: '6010', label: '6010 — BUTYL OXITOL D 180 KG' },
  { value: '6011', label: '6011 — C10 Aromatic Residue' },
  { value: '6012', label: '6012 — C9 Aromatic Residue' },
  { value: '6013', label: '6013 — Chlorine' },
  { value: '6014', label: '6014 — CO2' },
  { value: '6015', label: '6015 — CONTAINER' },
  { value: '6016', label: '6016 — CTL' },
  { value: '6017', label: '6017 — CYCLOHEXANE' },
  { value: '6018', label: '6018 — DMK' },
  { value: '6019', label: '6019 — DMK (ACETONE) D 158 KG' },
  { value: '6020', label: '6020 — DMK (ACETONE) D 160 KG' },
  { value: '6021', label: '6021 — Emulsion' },
  { value: '6022', label: '6022 — ETHYL ACETATE' },
  { value: '6023', label: '6023 — ETHYL ACETATE D 175 KG' },
  { value: '6024', label: '6024 — ETHYL ACETATE D 180 KG' },
  { value: '6025', label: '6025 — HEAVY AROMATICS' },
  { value: '6026', label: '6026 — HEXANE' },
  { value: '6027', label: '6027 — HEXANE EXTRACTION' },
  { value: '6028', label: '6028 — HEXANE D 138 KG' },
  { value: '6029', label: '6029 — HEXANE POLYMER D 138 KG' },
  { value: '6030', label: '6030 — IPA' },
  { value: '6031', label: '6031 — IPA D 157 KG' },
  { value: '6032', label: '6032 — IPA D 160 KG' },
  { value: '6033', label: '6033 — ISO PROPANE' },
  { value: '6034', label: '6034 — LPG' },
  { value: '6035', label: '6035 — MEG' },
  { value: '6036', label: '6036 — MEK' },
  { value: '6037', label: '6037 — MEK D 160 KG' },
  { value: '6038', label: '6038 — MEK D 165 KG' },
  { value: '6039', label: '6039 — MIBK' },
  { value: '6040', label: '6040 — MIBK D 160 KG' },
  { value: '6041', label: '6041 — MIBK D 165 KG' },
  { value: '6042', label: '6042 — MP (Methyl Proxitol)' },
  { value: '6043', label: '6043 — MP (Methyl Proxitol) D 190 KG' },
  { value: '6044', label: '6044 — MPA (Methyl Proxitol Acetate)' },
  { value: '6045', label: '6045 — MPA D 200 KG' },
  { value: '6046', label: '6046 — NGV' },
  { value: '6047', label: '6047 — NH3' },
  { value: '6048', label: '6048 — PENTANE' },
  { value: '6049', label: '6049 — PENTANE 60/40' },
  { value: '6050', label: '6050 — PENTANE 80/20' },
  { value: '6051', label: '6051 — PENTANE MIX' },
  { value: '6052', label: '6052 — PRECAST' },
  { value: '6053', label: '6053 — PROPYLENE' },
  { value: '6054', label: '6054 — Raffinate' },
  { value: '6055', label: '6055 — SARASOL 40' },
  { value: '6056', label: '6056 — SARASOL 40 D 209 LT' },
  { value: '6057', label: '6057 — SARASOL 40 (L)' },
  { value: '6058', label: '6058 — SARASOL 40 (L) D 209 LT' },
  { value: '6059', label: '6059 — SHELLSOL 60/145' },
  { value: '6060', label: '6060 — SHELLSOL 60/145 D 205 LT' },
  { value: '6061', label: '6061 — SHELLSOL A100 D 200 LT' },
  { value: '6062', label: '6062 — SHELLSOL A100 (L)' },
  { value: '6063', label: '6063 — SHELLSOL A100 (L) D 200 LT' },
  { value: '6064', label: '6064 — SHELLSOL A100 (L) D 205 LT' },
  { value: '6065', label: '6065 — SHELLSOL A150' },
  { value: '6066', label: '6066 — SHELLSOL A150 D 175 KG' },
  { value: '6067', label: '6067 — SHELLSOL A150 D 200 LT' },
  { value: '6068', label: '6068 — SHELLSOL A150 D 205 LT' },
  { value: '6069', label: '6069 — SHELLSOL BF' },
  { value: '6070', label: '6070 — SHELLSOL BF D 205 LT' },
  { value: '6071', label: '6071 — SHELLSOL BF D 205 LT' },
  { value: '6072', label: '6072 — Solvent 1425' },
  { value: '6073', label: '6073 — Solvent 3040' },
  { value: '6074', label: '6074 — STYRENE MONOMER' },
  { value: '6075', label: '6075 — TOLUENE' },
  { value: '6076', label: '6076 — TOLUENE (L)' },
  { value: '6077', label: '6077 — TOLUENE (L) D 205 LT' },
  { value: '6078', label: '6078 — TOLUENE (L) D 200 LT' },
  { value: '6079', label: '6079 — Top Sol MIX' },
  { value: '6080', label: '6080 — TOPSOL 2046' },
  { value: '6081', label: '6081 — TOPSOL 60/145' },
  { value: '6082', label: '6082 — TOPSOL A100(L)' },
  { value: '6083', label: '6083 — TOPSOL A150' },
  { value: '6084', label: '6084 — TOPSOL BF' },
  { value: '6085', label: '6085 — TOPSOL X2000' },
  { value: '6086', label: '6086 — WS-200' },
  { value: '6087', label: '6087 — WS-200 D 200 LT' },
  { value: '6088', label: '6088 — WS-200 (L)' },
  { value: '6089', label: '6089 — WS-200 (L) D 200 LT' },
  { value: '6090', label: '6090 — WS-3060' },
  { value: '6091', label: '6091 — XYLENE D 175 KG' },
  { value: '6092', label: '6092 — XYLENE D 200 LT' },
  { value: '6093', label: '6093 — XYLENE D 205 LT' },
  { value: '6094', label: '6094 — XYLENE (L)' },
  { value: '6095', label: '6095 — XYLENE (L) D 200 LT' },
  { value: '6096', label: '6096 — XYLENE (L) D 205 LT' },
  { value: '6097', label: '6097 — แก๊สไฮโดรคาร์บอนเหลว' },
  { value: '6098', label: '6098 — กระป๋อง' },
  { value: '6099', label: '6099 — กากน้ำตาล' },
  { value: '6100', label: '6100 — น้ำมัน' },
  { value: '6101', label: '6101 — รถยนต์' },
  { value: '6102', label: '6102 — Propane' },
  { value: '6103', label: '6103 — Propylene Rich' },
  { value: '6104', label: '6104 — Methanol' },
  { value: '6105', label: '6105 — WS-3060 (DPK)' },
  { value: '6106', label: '6106 — NH4OH' },
  { value: '6107', label: '6107 — Aromatic (A9)' },
  { value: '6108', label: '6108 — NGL' },
  { value: '6109', label: '6109 — หางเรียบ' },
  { value: '6110', label: '6110 — LIN' },
  { value: '6111', label: '6111 — Ethanol' },
  { value: '6112', label: '6112 — Butadiene' },
  { value: '6113', label: '6113 — TOPSol RM Bulk' },
  { value: '6114', label: '6114 — XYLENE (R)' },
  { value: '6115', label: '6115 — XYLENE (R) D 200 LT' },
  { value: '6116', label: '6116 — XYLENE (R) D 205 LT' },
  { value: '6117', label: '6117 — Solvent Mix' },
  { value: '6118', label: '6118 — ESCAID 110' },
  { value: '6119', label: '6119 — TOPSOL 60/145 (WT16)' },
  { value: '6120', label: '6120 — TOPSOL A150 ND' },
  { value: '6121', label: '6121 — C10 Plus' },
  { value: '6122', label: '6122 — Petrahydro suran' },
  { value: '6123', label: '6123 — Sometor 35' },
  { value: '6124', label: '6124 — TOPSol BT 40' },
  { value: '6125', label: '6125 — Oxygen' },
  { value: '6126', label: '6126 — JAYFLEX (DINP)' },
  { value: '6127', label: '6127 — ISO Tank' },
  { value: '6128', label: '6128 — JAYELEX (DIDP)' },
  { value: '6129', label: '6129 — อาร์กอนเหลว (LAR)' },
  { value: '6130', label: '6130 — PAGASOL 1425' },
  { value: '6131', label: '6131 — DSP 80/100' },
  { value: '6132', label: '6132 — BUTANOL' },
  { value: '6133', label: '6133 — ตะกร้าเหล็ก' },
  { value: '6134', label: '6134 — Others' },
  { value: '6135', label: '6135 — MIXED XYLENE (UN 1307)' },
  { value: '6136', label: '6136 — Petroleum Distillates' },
  { value: '6137', label: '6137 — P-XYLENE' },
  { value: '6138', label: '6138 — Odorless LPG' },
  { value: '6139', label: '6139 — Gypsum' },
  { value: 'C001', label: 'C001 — ตู้หนักไป-ตู้หนักกลับ' },
  { value: 'C002', label: 'C002 — ตู้หนักไป-ตู้เบากลับ' },
  { value: 'C003', label: 'C003 — ตู้เบาไป-ตู้หนักกลับ' },
  { value: 'C004', label: 'C004 — ตู้เบาไป-ตู้เบากลับ' },
  { value: 'C005', label: 'C005 — หางเรียบ' },
  { value: 'C006', label: 'C006 — หนัก เบา (ไป) หนัก (กลับ)' },
  { value: 'C007', label: 'C007 — เบา เบา (ไป) หนัก (กลับ)' },
  { value: 'C008', label: 'C008 — หนักไปยกลง > หางเปล่า > หนักกลับ' },
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

// ==================== 22 ROUTE OPTIONS ====================
export const ROUTE_OPTIONS = [
  { value: '010001', label: '010001 — ท่าเรือแหลมฉบัง → ท่าเรือกรุงเทพ (121 km)', distance: 121 },
  { value: '010002', label: '010002 — ท่าเรือกรุงเทพ → ท่าเรือแหลมฉบัง (120 km)', distance: 120 },
  { value: '010003', label: '010003 — ท่าเรือแหลมฉบัง → ท่าเรือ NPM (765 km)', distance: 765 },
  { value: '010004', label: '010004 — LCH → นิคมอมตะนคร → LCH (90 km)', distance: 90 },
  { value: '010005', label: '010005 — BTC → ไทยเบฟ → BTC (311 km)', distance: 311 },
  { value: '010006', label: '010006 — BTC → ไทยเบฟ → SCSC → BTC (413 km)', distance: 413 },
  { value: '010007', label: '010007 — BTC → LCH → ไทยเบฟ → SCSC → BTC (529 km)', distance: 529 },
  { value: '010008', label: '010008 — BTC → สระบุรี → BTC (280 km)', distance: 280 },
  { value: '010009', label: '010009 — BTC → ลาดกระบัง → BTC (145 km)', distance: 145 },
  { value: '010010', label: '010010 — BTC → SCG (บางซื่อ) → BTC (190 km)', distance: 190 },
  { value: '010011', label: '010011 — BTC → บุญรอดฯ → BTC (231 km)', distance: 231 },
  { value: '010012', label: '010012 — BTC → ปทุมธานี → BTC (200 km)', distance: 200 },
  { value: '010013', label: '010013 — BTC → นครปฐม → BTC (260 km)', distance: 260 },
  { value: '010014', label: '010014 — BTC → มหพันธ์ (ลพบุรี) → BTC (397 km)', distance: 397 },
  { value: '010015', label: '010015 — BTC → ราชบุรี → BTC (310 km)', distance: 310 },
  { value: '010016', label: '010016 — BTC → สมุทรสาคร → BTC (175 km)', distance: 175 },
  { value: '010020', label: '010020 — LCH → Map Ta Phut → LCH (95 km)', distance: 95 },
  { value: '010024', label: '010024 — BTC → มิชลิน (หนองแค) → BTC (300 km)', distance: 300 },
  { value: '010027', label: '010027 — BTC → มิชลิน (หนองรี) → BTC (55 km)', distance: 55 },
  { value: '010029', label: '010029 — BTC → LCH (ตู้เปล่า) (124 km)', distance: 124 },
  { value: '010030', label: '010030 — BTC → LCH (ตู้หนัก) (124 km)', distance: 124 },
  { value: 'CUSTOM', label: '+ Create Custom Route...', distance: 0 },
];

// ==================== ROUTE → STAGES MAPPING ====================
// BTC = ท่าเรือบางปะกง (010007), LCH = แหลมฉบัง (010102)
export const ROUTE_STAGES = {
  '010001': [ // LCH → ท่าเรือกรุงเทพ (121 km)
    { depNo: '010102', departure: 'LCH (แหลมฉบัง)', destNo: '010005', destination: 'ท่าเรือกรุงเทพ', type: 'First', distance: 121 },
  ],
  '010002': [ // ท่าเรือกรุงเทพ → LCH (120 km)
    { depNo: '010005', departure: 'ท่าเรือกรุงเทพ', destNo: '010102', destination: 'LCH (แหลมฉบัง)', type: 'First', distance: 120 },
  ],
  '010003': [ // LCH → ท่าเรือ NPM (765 km)
    { depNo: '010102', departure: 'LCH (แหลมฉบัง)', destNo: '010024', destination: 'ท่าเรือ NPM', type: 'First', distance: 765 },
  ],
  '010005': [ // BTC → ไทยเบฟ → BTC (311 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010025', destination: 'ไทยเบฟ (บางบาล)', type: 'First', distance: 151 },
    { depNo: '010025', departure: 'ไทยเบฟ (บางบาล)', destNo: '010007', destination: 'ท่าเรือบางปะกง', type: 'Transport', distance: 160 },
  ],
  '010006': [ // BTC → ไทยเบฟ → SCSC → BTC (413 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010025', destination: 'ไทยเบฟ (บางบาล)', type: 'First', distance: 151 },
    { depNo: '010025', departure: 'ไทยเบฟ (บางบาล)', destNo: '010095', destination: 'SCSC', type: 'Transport', distance: 112 },
    { depNo: '010095', departure: 'SCSC', destNo: '010007', destination: 'ท่าเรือบางปะกง', type: 'Transport', distance: 150 },
  ],
  '010007': [ // BTC → LCH → ไทยเบฟ → SCSC → BTC (529 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010102', destination: 'LCH (แหลมฉบัง)', type: 'First', distance: 80 },
    { depNo: '010102', departure: 'LCH (แหลมฉบัง)', destNo: '010025', destination: 'ไทยเบฟ (บางบาล)', type: 'Loading Transfer', distance: 180 },
    { depNo: '010025', departure: 'ไทยเบฟ (บางบาล)', destNo: '010095', destination: 'SCSC', type: 'Transport', distance: 112 },
    { depNo: '010095', departure: 'SCSC', destNo: '010007', destination: 'ท่าเรือบางปะกง', type: 'Transport', distance: 157 },
  ],
  '010011': [ // BTC → บุญรอดฯ → BTC (231 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010027', destination: 'โรงงานบุญรอด (ปทุมฯ)', type: 'First', distance: 115 },
    { depNo: '010027', departure: 'โรงงานบุญรอด (ปทุมฯ)', destNo: '010007', destination: 'ท่าเรือบางปะกง', type: 'Transport', distance: 116 },
  ],
  '010014': [ // BTC → มหพันธ์ (ลพบุรี) → BTC (397 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010028', destination: 'มหพันธ์ (ลพบุรี)', type: 'First', distance: 198 },
    { depNo: '010028', departure: 'มหพันธ์ (ลพบุรี)', destNo: '010007', destination: 'ท่าเรือบางปะกง', type: 'Transport', distance: 199 },
  ],
  '010024': [ // BTC → มิชลิน (หนองแค) → BTC (300 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010038', destination: 'มิชลิน (หนองแค)', type: 'First', distance: 150 },
    { depNo: '010038', departure: 'มิชลิน (หนองแค)', destNo: '010007', destination: 'ท่าเรือบางปะกง', type: 'Transport', distance: 150 },
  ],
  '010027': [ // BTC → มิชลิน (หนองรี) → BTC (55 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010039', destination: 'มิชลิน (หนองรี)', type: 'First', distance: 27 },
    { depNo: '010039', departure: 'มิชลิน (หนองรี)', destNo: '010007', destination: 'ท่าเรือบางปะกง', type: 'Transport', distance: 28 },
  ],
  '010029': [ // BTC → LCH (ตู้เปล่า) (124 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010102', destination: 'LCH (แหลมฉบัง)', type: 'First', distance: 124 },
  ],
  '010030': [ // BTC → LCH (ตู้หนัก) (124 km)
    { depNo: '010007', departure: 'ท่าเรือบางปะกง', destNo: '010102', destination: 'LCH (แหลมฉบัง)', type: 'First', distance: 124 },
  ],
};

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

// ==================== UNIFIED CONNECTION POINTS (all unique from CUSTOM_STAGE 1-4) ====================
export const CONNECTION_POINTS = [
  { value: '010005', label: '010005 — ท่าเรือกรุงเทพ' },
  { value: '010007', label: '010007 — ท่าเรือบางปะกง' },
  { value: '010011', label: '010011 — ท่าเรือ A0' },
  { value: '010018', label: '010018 — ท่าเรือ B2' },
  { value: '010024', label: '010024 — ท่าเรือ NPM' },
  { value: '010025', label: '010025 — ไทยเบฟ (บางบาล)' },
  { value: '010026', label: '010026 — โรงงานแสงโสม (นครปฐม)' },
  { value: '010027', label: '010027 — โรงงานบุญรอด (ปทุมฯ)' },
  { value: '010028', label: '010028 — มหพันธ์ (ลพบุรี)' },
  { value: '010038', label: '010038 — มิชลิน (หนองแค)' },
  { value: '010039', label: '010039 — มิชลิน (หนองรี)' },
  { value: '010095', label: '010095 — SCSC' },
  { value: '010097', label: '010097 — ลาดกระบัง (ประตู4)' },
  { value: '010100', label: '010100 — ลานจอดแหลมฉบัง' },
  { value: '010102', label: '010102 — LCH (แหลมฉบัง)' },
];

// ==================== YARD OPTIONS (Car Carrier) ====================
export const YARD_OPTIONS = [
  { value: '1401', label: '1401 — Bang Na KM.4' },
  { value: '1402', label: '1402 — Bang Na KM.4.5' },
  { value: '1403', label: '1403 — Bang Na KM.22' },
  { value: '1405', label: '1405 — Toyota Gateway' },
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
  { id: 'SHP-2026-013', status: 'DISPATCHED', product: 'TUG', route: '', routeName: 'BKK-TUG Harbor Service', truck: '', trailer: '', vehicleNo: 'TUG-001', truckType: 'Tug Boat', driver1: 'EMP001', driver1Name: 'สมชาย ใจดี', fos: [], created: '05.02.2026', totalQty: '1 Job', bu: 'SCM', site: 'BKK' },
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

// ==================== MASTER O3 — Auto-populate lookup ====================
// When user selects หน่วยงาน (site) + เส้นทาง (route), auto-fill shipmentType, shippingType, productSubtype, wbs
// Key format: "site|route" → defaults
export const MASTER_O3 = {
  // COC-FUEL sites
  '060B|010001': { shipmentType: '0002', shippingType: '01', productSubtype: '6001', wbs: 'WBS-FUEL-060B' },
  '060B|010002': { shipmentType: '0002', shippingType: '01', productSubtype: '6001', wbs: 'WBS-FUEL-060B' },
  '0610|010001': { shipmentType: '0002', shippingType: '01', productSubtype: '6001', wbs: 'WBS-FUEL-0610' },
  '0618|010004': { shipmentType: '0002', shippingType: '01', productSubtype: '6001', wbs: 'WBS-FUEL-0618' },
  // SHELL-FUEL sites
  '060J|010005': { shipmentType: '0001', shippingType: '01', productSubtype: '6002', wbs: 'WBS-SHELL-060J' },
  '060L|010005': { shipmentType: '0001', shippingType: '01', productSubtype: '6002', wbs: 'WBS-SHELL-060L' },
  '061B|010006': { shipmentType: '0001', shippingType: '01', productSubtype: '6002', wbs: 'WBS-SHELL-061B' },
  // LPG sites
  '060C|010007': { shipmentType: '0001', shippingType: '01', productSubtype: '6010', wbs: 'WBS-LPG-060C' },
  '060E|010008': { shipmentType: '0001', shippingType: '01', productSubtype: '6010', wbs: 'WBS-LPG-060E' },
  // NGV sites
  '060D|010009': { shipmentType: '0001', shippingType: '01', productSubtype: '6021', wbs: 'WBS-NGV-060D' },
  '060R|010009': { shipmentType: '0001', shippingType: '01', productSubtype: '6021', wbs: 'WBS-NGV-060R' },
  // CHEM sites
  '060N|010010': { shipmentType: '0003', shippingType: '01', productSubtype: '6030', wbs: 'WBS-CHEM-060N' },
  // BCP-FUEL
  '061D|010011': { shipmentType: '0002', shippingType: '01', productSubtype: '6003', wbs: 'WBS-BCP-061D' },
  '060X|010004': { shipmentType: '0002', shippingType: '01', productSubtype: '6003', wbs: 'WBS-BCP-060X' },
  // PTTOR
  '060Z|010001': { shipmentType: '0001', shippingType: '01', productSubtype: '6005', wbs: 'WBS-PTTOR-060Z' },
  // ATLAS
  '060U|010007': { shipmentType: '0001', shippingType: '01', productSubtype: '6010', wbs: 'WBS-ATLAS-060U' },
  // Container
  '0636|010001': { shipmentType: '0002', shippingType: '01', productSubtype: '6050', wbs: 'WBS-SPL-0636' },
  '0636|010002': { shipmentType: '0002', shippingType: '01', productSubtype: '6050', wbs: 'WBS-SPL-0636' },
  '0636|010003': { shipmentType: '0002', shippingType: '01', productSubtype: '6050', wbs: 'WBS-SPL-0636' },
};

// Lookup function: returns defaults or null
export function lookupMasterO3(site, route) {
  return MASTER_O3[`${site}|${route}`] || null;
}

// ==================== TUG SERVICE OPTIONS (SCM) ====================
export const TUG_AGENT_OPTIONS = [
  { value: 'thai-maritime', label: 'Thai Maritime Co., Ltd.' },
  { value: 'gulf-nav', label: 'Gulf Navigation Ltd.' },
  { value: 'ocean-tow', label: 'Ocean Towage Co., Ltd.' },
  { value: 'bangkok-tug', label: 'Bangkok Tug Service Co., Ltd.' },
];

export const TUG_SITE_OPTIONS = [
  { value: 'BKK', label: 'BKK' },
  { value: 'MTP', label: 'MTP' },
  { value: 'LCH', label: 'LCH' },
];

export const TUG_PORT_OPTIONS = [
  { value: 'BKK-TUG', label: 'BKK-TUG — BANGKOK - BKK TUG' },
  { value: 'BKK-BAR', label: 'BKK-BAR — BANGKOK - BAR' },
  { value: 'MTP-TUG', label: 'MTP-TUG — MAP TA PHUT - TUG' },
  { value: 'LCH-TUG', label: 'LCH-TUG — LAEM CHABANG - TUG' },
];

export const TUG_VESSEL_OPTIONS = [
  { value: 'MV GULF PIONEER', label: 'MV GULF PIONEER', grt: 6300, loa: 98.4 },
  { value: 'MV THAI STAR', label: 'MV THAI STAR', grt: 4500, loa: 85.2 },
  { value: 'MV OCEAN GRACE', label: 'MV OCEAN GRACE', grt: 8200, loa: 120.5 },
  { value: 'MV BANGKOK PRIDE', label: 'MV BANGKOK PRIDE', grt: 5100, loa: 92.0 },
];

export const TUG_JOB_TYPE_OPTIONS = [
  { value: 'HI', label: 'Harbor Serv. Inside' },
  { value: 'HO', label: 'Harbor Serv. Outside' },
  { value: 'OF', label: 'Offshore Serv.' },
];

export const TUG_SCOPE_OPTIONS = [
  { value: 'In-Bay', label: 'In-Bay' },
  { value: 'Out-Bay', label: 'Out-Bay' },
  { value: 'River', label: 'River' },
  { value: 'Offshore', label: 'Offshore' },
];

export const TUG_ACTIVITY_OPTIONS = [
  { value: 'Berth', label: 'Berth' },
  { value: 'Unberth', label: 'Unberth' },
  { value: 'Shifting', label: 'Shifting' },
  { value: 'Escorting', label: 'Escorting' },
  { value: 'Standby', label: 'Standby' },
];

export const TUG_SERVICE_OPTIONS = [
  { value: 'harbour-towage-inbound', label: 'Harbour Towage - Inbound' },
  { value: 'harbour-towage-outbound', label: 'Harbour Towage - Outbound' },
  { value: 'shifting', label: 'Shifting' },
  { value: 'standby', label: 'Standby Charge' },
  { value: 'escorting', label: 'Escorting' },
];

// Sample Sales BOM items
export const SAMPLE_SALES_BOM_ITEMS = [
  { item: '7SHITUGBOAT00005', description: 'Tug Boat Service #5', unit: 'Trip', tugBoat: '', wbs: '' },
  { item: '7SHISTANDBY00003', description: 'Standby Charge', unit: 'Hour', tugBoat: '', wbs: '' },
];

// ==================== TUG REPORT-IN TIME STAGES ====================
export const TUG_TIME_STAGES = [
  { key: 'start', label: 'Start', required: true },
  { key: 'standby1', label: 'Stand by #1', required: false },
  { key: 'workPeriod1', label: 'Work Period #1', required: false },
  { key: 'standby2', label: 'Stand by #2', required: false },
  { key: 'workPeriod2', label: 'Work Period #2', required: false },
  { key: 'standby3', label: 'Stand by #3', required: false },
  { key: 'workPeriod3', label: 'Work Period #3', required: false },
  { key: 'last', label: 'Last', required: true },
];

// ==================== NPM EIR FORM OPTIONS ====================
export const NPM_EIR_EVENT_OPTIONS = [
  { value: 'checkin', label: 'เช็คอินเท่านั้น' },
  { value: 'checkout', label: 'เช็คเอ้าท์เท่านั้น' },
  { value: 'both', label: 'เช็คอิน + เช็คเอ้าท์' },
];

export const NPM_CUSTOMER_TYPE_OPTIONS = [
  { value: 'IM', label: 'IM - Import' },
  { value: 'EX', label: 'EX - Export' },
  { value: 'DM', label: 'DM - Domestic' },
  { value: 'TR', label: 'TR - Transit' },
];

export const NPM_FCL_STATUS_OPTIONS = [
  { value: 'FCL', label: 'FCL' },
  { value: 'LCL', label: 'LCL' },
  { value: 'Empty', label: 'Empty' },
];

export const NPM_STUFFING_OPTIONS = [
  { value: 'CY', label: 'CY' },
  { value: 'CFS', label: 'CFS' },
];
