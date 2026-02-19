import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import FormField from '../../components/common/FormField';
import InfoStrip from '../../components/common/InfoStrip';
import { ProductBadge, SourceBadge } from '../../components/common/Badge';
import { generateId } from '../../utils/helpers';
import TruckSearchModal from './TruckSearchModal';
import FleetSuggestModal from './FleetSuggestModal';
import EmployeeSearchModal from './EmployeeSearchModal';
import StageSwapModal from './StageSwapModal';
import {
  pCfg, BU_OPTIONS, PRODUCT_TYPE_OPTIONS, SITE_OPTIONS, PRODUCT_SUBTYPE_OPTIONS,
  SHIPMENT_TYPE_OPTIONS, SHIPPING_TYPE_OPTIONS, ROUTE_OPTIONS, CONNECTION_POINTS, ROUTE_STAGES, lookupMasterO3,
  YARD_OPTIONS, NGV_QUALITY_STATIONS, SCA_TRANSPORT_FEE_OPTIONS, SCA_TRIP_PAY_OPTIONS,
  APPROVED_FOS, SCA_POSITIONS, SAMPLE_CAR_CARRIER_VEHICLES,
} from './shipmentConstants';
import { trucks as truckMaster } from '../../data/mockData';

// ==================== DEFAULT STAGES ====================
const defaultStages = [];

// ==================== DRIVER/HELPER ROWS ====================
const BASE_DRIVER_ROLES_KEYS = [
  { key: 'driver1', labelKey: 'shipmentForm.driverRole1', required: true },
  { key: 'driver2', labelKey: 'shipmentForm.driverRole2', required: false },
  { key: 'helper1', labelKey: 'shipmentForm.helperRole1', required: false },
  { key: 'helper2', labelKey: 'shipmentForm.helperRole2', required: false },
];
const EXTRA_0636_ROLES = [
  { key: 'driverFill', labelKey: 'shipmentForm.driverFill', required: false },
  { key: 'driverUnload', labelKey: 'shipmentForm.driverUnload', required: false },
];

// Stage type badge colors
const stageTypeBadge = {
  'First': 'bg-blue-100 text-blue-700',
  'Hub': 'bg-purple-100 text-purple-700',
  'Transport': 'bg-orange-100 text-orange-700',
  'Loading Transfer': 'bg-green-100 text-green-700',
  'Customer': 'bg-green-100 text-green-700',
  'Last': 'bg-gray-200 text-gray-700',
};

export default function ShipmentForm({ shipment, selectedFO, channel, onBack, isEditMode = false }) {
  const { t } = useLanguage();
  const { dispatch } = useApp();
  const pc = pCfg(channel?.product || selectedFO?.product || shipment?.product || 'LPG');

  // ==================== FORM STATE ====================
  const initialSite = channel?.site || selectedFO?.site || shipment?.site || '';
  const [form, setForm] = useState({
    shipmentNo: shipment?.id || 'Auto-generated',
    bu: channel?.bu || selectedFO?.bu || shipment?.bu || '',
    product: channel?.product || selectedFO?.product || shipment?.product || '',
    site: channel?.site || selectedFO?.site || shipment?.site || '',
    shipmentType: shipment?.shipmentType || pc.shipType,
    shippingType: shipment?.shippingType || '01',
    route: selectedFO?.route || shipment?.route || '',
    wbs: selectedFO?.wbs || shipment?.wbs || '',
    productSubtype: shipment?.productSubtype || '',
    contractDate: new Date().toISOString().split('T')[0],
    plannedDate: new Date().toISOString().slice(0, 16),
    dispatchDate: new Date().toISOString().slice(0, 16),
    vehicleReceiveDate: new Date().toISOString().slice(0, 16),
    truck: shipment?.truck || '',
    trailer: shipment?.trailer || '',
    vehicleNo: shipment?.vehicleNo || '',
    transportFee: 'เก็บ',
    tripPay: 'จ่าย',
    brokenMiles: false,
    // Edit mode fields
    poNo: '',
    ticketNo: '',
    ticketDate: '',
    // Custom route handled by customRouteStages state
  });

  // Resolve driver role labels — add extra roles for site 0636
  const DRIVER_ROLES_KEYS = (form.site || initialSite) === '0636'
    ? [...BASE_DRIVER_ROLES_KEYS, ...EXTRA_0636_ROLES]
    : BASE_DRIVER_ROLES_KEYS;
  const DRIVER_ROLES = DRIVER_ROLES_KEYS.map(r => ({ ...r, label: t(r.labelKey) }));

  const [drivers, setDrivers] = useState(
    DRIVER_ROLES.map(r => ({
      key: r.key, id: shipment?.driver1 && r.key === 'driver1' ? shipment.driver1 : '',
      name: shipment?.driver1Name && r.key === 'driver1' ? shipment.driver1Name : '',
      phone: '', intern: false, licenseValid: r.key === 'driver1' && shipment?.driver1,
    }))
  );

  const initialRoute = selectedFO?.route || shipment?.route || '';
  const [stages, setStages] = useState(() => {
    if (shipment?.stages?.length) {
      return shipment.stages.map((s, i) => ({
        stage: i, depNo: '', departure: s.from || '', destNo: '', destination: s.to || '',
        type: i === 0 ? 'First' : s.type || 'Transport',
        plannedArr: '', plannedDep: '', distance: s.distance || 0,
      }));
    }
    const routeStages = ROUTE_STAGES[initialRoute];
    if (routeStages) {
      return routeStages.map((rs, i) => ({
        stage: i, depNo: rs.depNo, departure: rs.departure, destNo: rs.destNo,
        destination: rs.destination, type: rs.type, distance: rs.distance,
        plannedArr: '', plannedDep: '',
      }));
    }
    return [];
  });

  const [showCustomRoute, setShowCustomRoute] = useState(false);
  const [customRouteStages, setCustomRouteStages] = useState([
    { departure: '', destination: '' },
    { departure: '', destination: '' },
  ]);
  const [consolidatedFOs, setConsolidatedFOs] = useState([]);
  const [routeSearch, setRouteSearch] = useState('');
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);

  // NGV specific state
  const nowDT = new Date().toISOString().slice(0, 16);
  const [ngvData, setNgvData] = useState({
    receiveDate: nowDT, refDate: nowDT, dispatchDate: '',
    custNotifyDate: nowDT, custPSI: '', pairedVehicle: '', sentFrom: '',
    custOrder: '', fullTubeDate: '', remark: '',
    gasNotBroken: true,
    heavyTube: { no: 'NGV-T001', weight: 4250, psi: 3200, kg: 4250, temp: 32 },
    lightTube: { no: 'NGV-P001', weight: 4100, psi: 3100, kg: 4100, temp: 33 },
    qualityReadings: [1, 2, 3, 4].map((_, i) => ({
      station: NGV_QUALITY_STATIONS[i], temp1: 0, temp2: 0, pressure: 0, alc1: 0, alc2: 0, note: '',
    })),
  });

  // Fuel specific state
  const [fuelData, setFuelData] = useState({
    shipCust: '', custName: 'Shell (สระบุรี)', custCode: 'SH-SRB-001',
    loadReceiveSlip: '', loadStartTime: '', loadEndTime: '', loadTicketTime: '',
    unloadStartTime: '', unloadEndTime: '',
    deliveries: [
      { shipTo: '269307', name: 'บจก. ชุลออยล์ เซอร์วิส', code: 'SH-001', deliveryNo: '8023742938', comps: [
        { comp: '001', qty: 9000, status: 'Y ส่งได้' }, { comp: '002', qty: 6000, status: 'Y ส่งได้' },
        { comp: '004', qty: 5000, status: 'Y ส่งได้' }, { comp: '—', qty: 0, status: '—' },
        { comp: '—', qty: 0, status: '—' }, { comp: '—', qty: 0, status: '—' },
        { comp: '—', qty: 0, status: '—' }, { comp: '—', qty: 0, status: '—' },
      ]},
      { shipTo: '240217', name: 'บจก. ไอ อาร์ พี ฟิวเจอร์', code: 'IRP-001', deliveryNo: '8023742937', comps: [
        { comp: '003', qty: 8000, status: 'Y ส่งได้' }, { comp: '—', qty: 0, status: '—' },
        { comp: '—', qty: 0, status: '—' }, { comp: '—', qty: 0, status: '—' },
        { comp: '—', qty: 0, status: '—' }, { comp: '—', qty: 0, status: '—' },
        { comp: '—', qty: 0, status: '—' }, { comp: '—', qty: 0, status: '—' },
      ]},
    ],
  });

  // Container specific state
  const [containerData, setContainerData] = useState({
    jobType: '',
    shipTo: '', soldTo: '', payer: '', billTo: '',
    shipToName: 'ท่าเรือกรุงเทพ', soldToName: 'Evergreen Line (TH)',
    payerName: '', billToName: '',
    agent: '', agentName: '',
    booking: 'BKG-EV-2026-0142', blNo: '', shippingLine: '', vessel: '', containerCount: 2,
    portOfLoading: '', portOfDischarge: '', placeOfDelivery: '',
    remark1: '', remark2: '',
    containers: [
      { no: 'EGHU1234567', size: '40ft HC', type: 'FCL', containerType: 'Dry', seal: '', weight: 24500, tare: 3800, vgm: 28300, temp: '', status: 'Loaded' },
      { no: 'EGHU7654321', size: '40ft HC', type: 'FCL', containerType: 'Dry', seal: '', weight: 22100, tare: 3800, vgm: 25900, temp: '', status: 'Loaded' },
    ],
  });

  // Car Carrier specific state
  const [scaData, setScaData] = useState({
    yardNo: '', transType: 'I', callingNo: '', groupNo: '', trip: '',
    transportFee: 'Y เก็บ', tripPay: 'Y จ่าย', brokenMiles: false,
    positions: SCA_POSITIONS,
    vehicles: SAMPLE_CAR_CARRIER_VEHICLES,
  });

  // ==================== MODALS ====================
  const [showTruckSearch, setShowTruckSearch] = useState(false);
  const [showFleetSuggest, setShowFleetSuggest] = useState(false);
  const [empSearchTarget, setEmpSearchTarget] = useState(null);
  const [showStageSwap, setShowStageSwap] = useState(null);

  // ==================== HELPERS ====================
  const updateForm = useCallback((key, value) => setForm(f => ({ ...f, [key]: value })), []);

  // Auto-populate from master_O3 when site + route are known
  const applyMasterO3 = (site, route) => {
    const o3 = lookupMasterO3(site, route);
    if (o3) {
      setForm(f => ({
        ...f,
        shipmentType: o3.shipmentType || f.shipmentType,
        shippingType: o3.shippingType || f.shippingType,
        productSubtype: o3.productSubtype || f.productSubtype,
        wbs: o3.wbs || f.wbs,
      }));
    }
  };

  const handleSiteChange = (siteId) => {
    updateForm('site', siteId);
    if (siteId && form.route && form.route !== 'CUSTOM') {
      applyMasterO3(siteId, form.route);
    }
  };

  const handleRouteChange = (routeId) => {
    updateForm('route', routeId);
    if (routeId === 'CUSTOM') {
      setShowCustomRoute(true);
    } else {
      setShowCustomRoute(false);
      // Auto-populate stages from route master
      const routeStages = ROUTE_STAGES[routeId];
      if (routeStages) {
        setStages(routeStages.map((rs, i) => ({
          stage: i, depNo: rs.depNo, departure: rs.departure, destNo: rs.destNo,
          destination: rs.destination, type: rs.type, distance: rs.distance,
          plannedArr: '', plannedDep: '',
        })));
      }
      // Auto-populate from master_O3
      if (form.site && routeId) {
        applyMasterO3(form.site, routeId);
      }
    }
  };

  const handleTruckSelect = (truck) => {
    setForm(f => ({ ...f, truck: truck.plate, trailer: truck.trailer, vehicleNo: truck.vehicleNo, truckType: truck.type || '' }));
    setShowTruckSearch(false);
    setShowFleetSuggest(false);
  };

  // Bidirectional truck/vehicle lookup
  const lookupByPlate = (plate) => {
    const found = truckMaster.find(t => t.plate === plate);
    if (found) setForm(f => ({ ...f, truck: found.plate, trailer: found.trailer || '', vehicleNo: found.vehicleNo, truckType: found.type || '' }));
  };
  const lookupByVehicleNo = (vNo) => {
    const found = truckMaster.find(t => t.vehicleNo === vNo);
    if (found) setForm(f => ({ ...f, truck: found.plate, trailer: found.trailer || '', vehicleNo: found.vehicleNo, truckType: found.type || '' }));
  };

  const handleEmployeeSelect = (emp) => {
    if (!empSearchTarget) return;
    setDrivers(prev => prev.map(d =>
      d.key === empSearchTarget
        ? { ...d, id: emp.id, name: emp.name, phone: emp.phone, intern: emp.intern, licenseValid: emp.licenseValid }
        : d
    ));
    setEmpSearchTarget(null);
  };

  const handleStageSwap = (index, direction) => {
    setShowStageSwap({ index, direction });
  };

  const confirmStageSwap = () => {
    if (!showStageSwap) return;
    const { index, direction } = showStageSwap;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= stages.length) { setShowStageSwap(null); return; }
    setStages(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((s, i) => ({ ...s, stage: i }));
    });
    setShowStageSwap(null);
  };

  const addStage = () => {
    const last = stages[stages.length - 1];
    setStages(prev => {
      // Re-type the current last stage (it's no longer last)
      const updated = prev.map((s, i) => ({
        ...s,
        type: i === 0 ? 'First' : (s.type === 'Last' ? 'Transport' : s.type),
      }));
      return [...updated, {
        stage: prev.length, depNo: last?.destNo || '', departure: last?.destination || '', destNo: '', destination: '',
        type: 'Last', plannedArr: '', plannedDep: '', distance: 0,
      }];
    });
  };

  const removeStage = (index) => {
    if (stages.length <= 1) return;
    setStages(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, stage: i })));
  };

  const updateStageField = (index, field, value) => {
    setStages(prev => prev.map((s, i) => {
      if (i !== index) return s;
      const updated = { ...s, [field]: value };
      // Auto-fill name from SITE_OPTIONS when selecting a point number
      if (field === 'depNo') {
        const site = SITE_OPTIONS.find(o => o.value === value);
        if (site) updated.departure = site.label.split(' — ')[1] || site.label;
      }
      if (field === 'destNo') {
        const site = SITE_OPTIONS.find(o => o.value === value);
        if (site) updated.destination = site.label.split(' — ')[1] || site.label;
      }
      return updated;
    }));
  };

  const totalDistance = stages.reduce((sum, s) => sum + (s.distance || 0), 0);

  // ==================== MATCHING FOs ====================
  const matchingFOs = selectedFO
    ? APPROVED_FOS.filter(fo => fo.route === selectedFO.route && fo.id !== selectedFO.id && fo.product === selectedFO.product)
    : [];

  // ==================== SAVE/DISPATCH ====================
  const handleSave = () => {
    // Validate required fields
    const missing = [];
    if (!form.bu) missing.push('BU');
    if (!(form.product || selectedFO?.product)) missing.push('Product');
    if (!form.route) missing.push('Route');
    if (!form.truck) missing.push('Truck');
    if (!drivers[0]?.name) missing.push('Driver');
    if (missing.length > 0) {
      window.alert(`⚠️ Please fill required fields:\n${missing.join(', ')}`);
      return;
    }
    const data = {
      id: shipment?.id || generateId('SHP'),
      shipmentNo: shipment?.id || generateId('SHP'),
      status: 'OPEN',
      product: form.product || selectedFO?.product,
      bu: form.bu || selectedFO?.bu,
      site: form.site || selectedFO?.site,
      source: 'Manual Entry',
      sourceIcon: '✏️',
      customer: selectedFO?.customer || '',
      customerName: selectedFO?.customer || '',
      route: form.route,
      routeName: ROUTE_OPTIONS.find(r => r.value === form.route)?.label || form.route,
      truck: form.truck, plate: form.truck, trailer: form.trailer,
      vehicleNo: form.vehicleNo,
      driver: drivers[0]?.name || '', driver1: drivers[0]?.id || '', driver1Name: drivers[0]?.name || '',
      driverId: drivers[0]?.id || '',
      totalQty: selectedFO?.qty ? parseInt(selectedFO.qty.replace(/[^0-9]/g, '')) : 0,
      totalWeight: 0,
      created: new Date().toISOString().split('T')[0],
      stages: stages.map(s => ({ no: s.stage, from: s.departure, to: s.destination, type: s.type, distance: s.distance, status: 'pending' })),
      consolidatedFOs: consolidatedFOs.map(fo => fo.id),
      channelSource: channel?.key || 'manual',
    };
    if (isEditMode && shipment?.id) {
      dispatch({ type: 'UPDATE_SHIPMENT', payload: data });
    } else {
      dispatch({ type: 'ADD_SHIPMENT', payload: data });
    }
    onBack();
  };

  const handleDispatch = () => {
    handleSave();
    if (shipment?.id) dispatch({ type: 'DISPATCH_SHIPMENT', payload: shipment.id });
    onBack();
  };

  const currentProduct = form.product || selectedFO?.product || '';

  // ==================== RENDER ====================
  return (
    <div className="space-y-3">
      {/* ===== HEADER ===== */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text flex items-center gap-2">
              {isEditMode ? `${t('shipmentForm.editShipment')}: ${form.shipmentNo}` : t('shipmentForm.createShipment')}
            </h1>
            <p className="text-table text-text-sec mt-0.5">
              {isEditMode ? `${t('shipmentForm.fosLabel')}: ${shipment?.fos?.join(', ')}` : t('shipmentForm.consolidateDesc')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isEditMode ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
              {isEditMode ? shipment?.status || 'OPEN' : t('shipmentForm.newStatus')}
            </span>
            <button onClick={onBack} className="px-3 py-1.5 rounded border border-blue-300 text-table text-primary hover:bg-blue-100">
              &larr; {t('shipmentForm.backToFOList')}
            </button>
          </div>
        </div>
      </div>

      {/* ===== ORDER SUMMARY (shown when coming from capture flow, hidden for manual) ===== */}
      {(selectedFO || (channel && channel.key !== 'manual')) && !isEditMode && (
        <CollapsibleSection title="Order Summary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-text-muted block">Source</span>
              <SourceBadge source={shipment?.source || channel?.key || 'Manual Entry'} />
            </div>
            <div>
              <span className="text-xs text-text-muted block">{t('shipmentForm.businessUnit')}</span>
              <span className="font-medium text-table">{form.bu || selectedFO?.bu || '—'}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">{t('shipmentForm.productType')}</span>
              <ProductBadge product={currentProduct} />
            </div>
            <div>
              <span className="text-xs text-text-muted block">{t('shipmentForm.customer')}</span>
              <span className="font-medium text-table">{selectedFO?.customer || shipment?.customer || '—'}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">{t('shipmentForm.route')}</span>
              <span className="font-medium text-table">{selectedFO?.route || form.route || '—'}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">{t('shipmentForm.quantity')}</span>
              <span className="font-medium text-table">{selectedFO?.qty || shipment?.totalQty?.toLocaleString() || '—'}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">{t('shipmentForm.plannedDate')}</span>
              <span className="font-medium text-table">{selectedFO?.date || form.plannedDate?.split('T')[0] || '—'}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">{t('shipmentForm.contractWBS')}</span>
              <span className="font-medium text-table">{selectedFO?.wbs || form.wbs || '—'}</span>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* ===== SECTION 1: BU & PRODUCT (only for non-FO create) ===== */}
      {!selectedFO && !isEditMode && (
        <CollapsibleSection title={t('shipmentForm.selectBUProduct')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormField label={t('shipmentForm.businessUnit')} type="select" value={form.bu} onChange={v => updateForm('bu', v)} required
              options={BU_OPTIONS} placeholder={t('shipmentForm.selectBU')} />
            <FormField label={t('shipmentForm.productType')} type="select" value={form.product} onChange={v => { updateForm('product', v); }} required
              options={PRODUCT_TYPE_OPTIONS} placeholder={t('shipmentForm.selectProduct')} />
            <FormField label={t('shipmentForm.siteOptional')} type="select" value={form.site} onChange={v => updateForm('site', v)}
              options={SITE_OPTIONS} placeholder={t('shipmentForm.allSites')} />
          </div>
        </CollapsibleSection>
      )}

      {/* ===== SECTION 2: SELECTED FO (from FO list) ===== */}
      {selectedFO && (
        <CollapsibleSection title={t('shipmentForm.selectedFO')} badge={`1 ${t('shipmentForm.foSelected')}`}>
          <InfoStrip variant="info" icon="ℹ️">
            {t('shipmentForm.consolidateInfo')}
          </InfoStrip>
          <div className="mt-2 border-2 border-primary rounded-lg p-4 bg-blue-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-primary text-base">{selectedFO.id}</span>
              <ProductBadge product={selectedFO.product} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-table">
              <div><span className="text-xs text-text-muted block">{t('shipmentForm.buSite')}</span><span className="font-medium">{selectedFO.bu} / {selectedFO.site}</span></div>
              <div><span className="text-xs text-text-muted block">{t('shipmentForm.route')}</span><span className="font-medium">{selectedFO.route}</span></div>
              <div><span className="text-xs text-text-muted block">{t('shipmentForm.customer')}</span><span className="font-medium">{selectedFO.customer}</span></div>
              <div><span className="text-xs text-text-muted block">{t('shipmentForm.shipTo')}</span><span className="font-medium">{selectedFO.shipTo}</span></div>
              <div><span className="text-xs text-text-muted block">{t('shipmentForm.quantity')}</span><span className="font-medium">{selectedFO.qty}</span></div>
              <div><span className="text-xs text-text-muted block">{t('shipmentForm.plannedDate')}</span><span className="font-medium">{selectedFO.date}</span></div>
              <div><span className="text-xs text-text-muted block">{t('shipmentForm.contractWBS')}</span><span className="font-medium">{selectedFO.wbs}</span></div>
              <div><span className="text-xs text-text-muted block">{t('shipmentForm.statusLabel')}</span><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{t('shipmentForm.approved')}</span></div>
            </div>
          </div>

          {/* Matching FOs for consolidation */}
          {matchingFOs.length > 0 && (
            <div className="mt-3 border border-border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-b border-border flex items-center justify-between">
                <span className="text-table font-semibold">{t('shipmentForm.matchingFOs')}: <strong>{selectedFO.route}</strong></span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{matchingFOs.length} {t('shipmentForm.available')}</span>
              </div>
              <div className="max-h-[150px] overflow-y-auto">
                {matchingFOs.map(fo => {
                  const isAdded = consolidatedFOs.includes(fo.id);
                  return (
                    <div key={fo.id} className={`flex items-center gap-3 px-3 py-2 border-b border-border-light text-table ${isAdded ? 'bg-green-50' : 'hover:bg-blue-50/30'}`}>
                      <input type="checkbox" checked={isAdded} onChange={e => {
                        setConsolidatedFOs(prev => e.target.checked ? [...prev, fo.id] : prev.filter(id => id !== fo.id));
                      }} className="w-4 h-4 accent-primary" />
                      <span className="font-mono font-semibold text-primary">{fo.id}</span>
                      <span>{fo.customer}</span>
                      <span className="text-text-sec">{fo.qty}</span>
                      <span className="text-text-sec">{fo.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CollapsibleSection>
      )}

      {/* ===== SECTION 3: SHIPMENT HEADER ===== */}
      <CollapsibleSection title={t('shipmentForm.shipmentHeader')}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
          <FormField label={t('shipmentForm.shipmentNo')} value={form.shipmentNo} disabled />
          <FormField label="หน่วยงาน (Site)" type="select" value={form.site || selectedFO?.site || ''} onChange={handleSiteChange}
            options={SITE_OPTIONS} required />
          <div className="relative">
            <label className="block text-label font-medium text-text-sec mb-1.5">
              {t('shipmentForm.route')}<span className="text-error ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={routeSearch || (form.route ? (ROUTE_OPTIONS.find(r => r.value === form.route)?.label || form.route) : '')}
              onChange={e => { setRouteSearch(e.target.value); setShowRouteDropdown(true); }}
              onFocus={() => setShowRouteDropdown(true)}
              onBlur={() => setTimeout(() => setShowRouteDropdown(false), 200)}
              placeholder="Search route by name or code..."
              className="w-full border border-border rounded-md px-3 py-2 text-table text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {showRouteDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {[...ROUTE_OPTIONS, { value: 'CUSTOM', label: 'CUSTOM — Create Custom Route' }]
                  .filter(r => !routeSearch || r.label.toLowerCase().includes(routeSearch.toLowerCase()) || r.value.includes(routeSearch))
                  .map(r => (
                    <div key={r.value}
                      onClick={() => { handleRouteChange(r.value); setRouteSearch(''); setShowRouteDropdown(false); }}
                      className="px-3 py-2 text-table hover:bg-blue-50 cursor-pointer border-b border-border-light last:border-0">
                      {r.label}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <FormField label={t('shipmentForm.shipmentType')} type="select" value={form.shipmentType} onChange={v => updateForm('shipmentType', v)}
            options={SHIPMENT_TYPE_OPTIONS} />
          <FormField label={t('shipmentForm.shippingType')} type="select" value={form.shippingType} onChange={v => updateForm('shippingType', v)}
            options={SHIPPING_TYPE_OPTIONS} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
          <FormField label="ชนิดสินค้า" type="select" value={form.productSubtype} onChange={v => updateForm('productSubtype', v)}
            options={PRODUCT_SUBTYPE_OPTIONS} placeholder="— Select —" />
          <FormField label={t('shipmentForm.contractWBS')} value={form.wbs} onChange={v => updateForm('wbs', v)} required />
          <FormField label="วันที่สัญญา" type="date" value={form.contractDate} onChange={v => updateForm('contractDate', v)} required />
          <FormField label={t('shipmentForm.productType')} value={currentProduct} disabled />
          <FormField label={t('shipmentForm.buSite')} value={`${form.bu || selectedFO?.bu || ''} / ${form.site || selectedFO?.site || ''}`} disabled />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
          <FormField label="วัน/เวลา ตามแผน" type="datetime-local" value={form.plannedDate} onChange={v => updateForm('plannedDate', v)} required />
          <FormField label="วัน/เวลา จ่ายงาน" type="datetime-local" value={form.dispatchDate} onChange={v => updateForm('dispatchDate', v)} />
          <FormField label="วัน/เวลา รับรถ" type="datetime-local" value={form.vehicleReceiveDate} onChange={v => updateForm('vehicleReceiveDate', v)} />
        </div>

        {/* Custom Route — Dynamic Stages */}
        {showCustomRoute && (
          <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-table font-semibold text-orange-700">{t('shipmentForm.customRoute')} — {customRouteStages.length} stages</div>
              <button onClick={() => setCustomRouteStages(prev => [...prev, { departure: '', destination: '' }])}
                className="px-3 py-1 rounded border border-orange-400 text-orange-700 text-xs font-medium hover:bg-orange-100">
                + Add Stage
              </button>
            </div>
            <div className="space-y-2">
              {customRouteStages.map((cs, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-text-muted mb-0.5">Departure Point</label>
                      <select value={cs.departure} onChange={e => setCustomRouteStages(prev => prev.map((s, idx) => idx === i ? { ...s, departure: e.target.value } : s))}
                        className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="">— Select Departure —</option>
                        {CONNECTION_POINTS.map(cp => <option key={cp.value} value={cp.value}>{cp.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-text-muted mb-0.5">Destination Point</label>
                      <select value={cs.destination} onChange={e => setCustomRouteStages(prev => prev.map((s, idx) => idx === i ? { ...s, destination: e.target.value } : s))}
                        className="w-full border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="">— Select Destination —</option>
                        {CONNECTION_POINTS.map(cp => <option key={cp.value} value={cp.value}>{cp.label}</option>)}
                      </select>
                    </div>
                  </div>
                  {customRouteStages.length > 1 && (
                    <button onClick={() => setCustomRouteStages(prev => prev.filter((_, idx) => idx !== i))}
                      className="px-2 py-1 rounded border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 text-xs flex-shrink-0">&times;</button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-text-muted">{customRouteStages.filter(s => s.departure && s.destination).length} of {customRouteStages.length} stages configured</span>
              <button className="px-3 py-1.5 rounded bg-orange-500 text-white text-xs font-medium hover:bg-orange-600"
                onClick={() => {
                  const built = customRouteStages.filter(s => s.departure && s.destination).map((s, i) => {
                    const dep = CONNECTION_POINTS.find(cp => cp.value === s.departure);
                    const dest = CONNECTION_POINTS.find(cp => cp.value === s.destination);
                    return {
                      stage: i, depNo: s.departure, departure: dep?.label.split(' — ')[1] || s.departure,
                      destNo: s.destination, destination: dest?.label.split(' — ')[1] || s.destination,
                      type: i === 0 ? 'First' : 'Transport', plannedArr: '', plannedDep: '', distance: 0,
                    };
                  });
                  if (built.length === 0) { window.alert('Please configure at least one stage with departure and destination.'); return; }
                  setStages(built);
                  setShowCustomRoute(false);
                  updateForm('route', 'CUSTOM');
                }}>
                Apply Custom Route
              </button>
            </div>
          </div>
        )}

        {/* Edit Mode Additional Fields */}
        {isEditMode && (
          <div className="mt-3 pt-3 border-t border-dashed border-border">
            <div className="text-table font-semibold text-text-sec mb-2">{t('shipmentForm.additionalFields')}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField label={t('shipmentForm.poNo')} value={form.poNo} onChange={v => updateForm('poNo', v)} placeholder="Purchase Order No." />
              <FormField label={t('shipmentForm.ticketNo')} value={form.ticketNo} onChange={v => updateForm('ticketNo', v)} placeholder="Ticket Document No." />
              <FormField label={t('shipmentForm.ticketDate')} type="date" value={form.ticketDate} onChange={v => updateForm('ticketDate', v)} />
            </div>
          </div>
        )}
      </CollapsibleSection>

      {/* ===== SECTION 4: VEHICLE ASSIGNMENT ===== */}
      <CollapsibleSection
        title={t('shipmentForm.vehicleAssignment')}
        badge={form.truck ? form.truck : null}
      >
        <InfoStrip variant="info" icon="ℹ️">
          {t('shipmentForm.vehicleInfo')}
        </InfoStrip>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('shipmentForm.truckPlate')}</label>
            <div className="flex">
              <input type="text" value={form.truck} onChange={e => updateForm('truck', e.target.value)} onBlur={e => lookupByPlate(e.target.value)} placeholder="e.g. 83-0569"
                disabled={isEditMode}
                className="flex-1 border border-border rounded-l px-2.5 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted" />
              <button onClick={() => setShowTruckSearch(true)} disabled={isEditMode}
                className="px-2.5 py-1.5 border border-l-0 border-border rounded-r bg-gray-50 hover:bg-gray-100 text-sm disabled:opacity-50">
                Search
              </button>
            </div>
          </div>
          <FormField label={t('shipmentForm.trailerPlate')} value={form.trailer} disabled />
          <FormField label="Truck Type" value={form.truckType || '—'} disabled />
          <div>
            <label className="block text-xs font-medium text-text-sec mb-1">{t('shipmentForm.vehicleNoLabel')}</label>
            <div className="flex">
              <input type="text" value={form.vehicleNo} onChange={e => updateForm('vehicleNo', e.target.value)} onBlur={e => lookupByVehicleNo(e.target.value)} placeholder="Or enter vehicle no."
                disabled={isEditMode}
                className="flex-1 border border-border rounded-l px-2.5 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted" />
              <button onClick={() => setShowTruckSearch(true)} disabled={isEditMode}
                className="px-2.5 py-1.5 border border-l-0 border-border rounded-r bg-gray-50 hover:bg-gray-100 text-sm disabled:opacity-50">
                Search
              </button>
            </div>
          </div>
        </div>
        {!isEditMode && (
          <button onClick={() => setShowFleetSuggest(true)} className="mt-3 px-3 py-1.5 rounded bg-primary text-white text-table font-medium hover:bg-primary-hover">
            {t('shipmentForm.fleetSuggest')}
          </button>
        )}
      </CollapsibleSection>

      {/* ===== SECTION 5: DRIVERS & HELPERS ===== */}
      <CollapsibleSection title={t('shipmentForm.driversHelpers')}>
        <InfoStrip variant="warning" icon="⚠️">
          {t('shipmentForm.driverCheckInfo')}
        </InfoStrip>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-table">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-center px-2 py-2 font-semibold text-text-sec w-8">#</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec w-28">{t('shipmentForm.role')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec">{t('shipmentForm.employeeId')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec">{t('shipmentForm.name')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec w-24">{t('shipmentForm.phone')}</th>
                <th className="text-center px-2 py-2 font-semibold text-text-sec w-14">{t('shipmentForm.intern')}</th>
                <th className="text-center px-2 py-2 font-semibold text-text-sec w-20">{t('shipmentForm.license')}</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d, i) => {
                const role = DRIVER_ROLES[i] || { label: d.key, required: false };
                return (
                <tr key={d.key} className="border-b border-border-light">
                  <td className="text-center px-2 py-2 font-medium">{i + 1}</td>
                  <td className="px-2 py-2">
                    <span className={role.required ? 'font-bold text-error' : ''}>
                      {role.label}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex">
                      <input type="text" value={d.id} readOnly placeholder={role.required ? 'Search ID/Name...' : 'Optional...'}
                        disabled={isEditMode}
                        className="flex-1 border border-border rounded-l px-2 py-1 text-table bg-white disabled:bg-bg disabled:text-text-muted" />
                      <button onClick={() => setEmpSearchTarget(d.key)} disabled={isEditMode}
                        className="px-2 py-1 border border-l-0 border-border rounded-r bg-gray-50 hover:bg-gray-100 text-xs disabled:opacity-50">
                        Search
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <input type="text" value={d.name} disabled placeholder="Auto" className="w-full border border-border rounded px-2 py-1 text-table bg-gray-50 text-text-muted" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="text" value={d.phone} onChange={e => {
                      const val = e.target.value;
                      setDrivers(prev => prev.map((dr, idx) => idx === i ? { ...dr, phone: val } : dr));
                    }} placeholder="Phone" disabled={isEditMode}
                      className="w-full border border-border rounded px-2 py-1 text-table disabled:bg-bg" />
                  </td>
                  <td className="text-center px-2 py-2">
                    <input type="checkbox" checked={d.intern} onChange={e => {
                      const val = e.target.checked;
                      setDrivers(prev => prev.map((dr, idx) => idx === i ? { ...dr, intern: val } : dr));
                    }} disabled={isEditMode} className="w-4 h-4 accent-primary" />
                  </td>
                  <td className="text-center px-2 py-2">
                    {d.id ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.licenseValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {d.licenseValid ? '✓ ' + t('shipmentForm.validLicense') : '✗ ' + t('shipmentForm.expiredLicense')}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      {/* ===== SECTION 6: STAGES & ROUTE PLAN ===== */}
      <CollapsibleSection title={t('shipmentForm.stagesRoutePlan')} badge={`${t('shipmentForm.totalDistance')}: ${totalDistance} km`}>
        <InfoStrip variant="info" icon="📍">
          {t('shipmentForm.stagesInfo')}
        </InfoStrip>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-table min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-center px-2 py-2 font-semibold text-text-sec w-12">{t('shipmentForm.stageLabel')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec w-20">{t('shipmentForm.depNo')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec">{t('shipmentForm.departure')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec w-20">{t('shipmentForm.destNo')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec">{t('shipmentForm.destination')}</th>
                <th className="text-center px-2 py-2 font-semibold text-text-sec w-28">{t('shipmentForm.type')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec w-36">{t('shipmentForm.plannedArrival')}</th>
                <th className="text-left px-2 py-2 font-semibold text-text-sec w-36">{t('shipmentForm.plannedDeparture')}</th>
                <th className="text-center px-2 py-2 font-semibold text-text-sec w-16">{t('shipmentForm.distance')}</th>
                <th className="text-center px-2 py-2 font-semibold text-text-sec w-20">{t('shipmentForm.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((s, i) => (
                <tr key={i} className="border-b border-border-light">
                  <td className="text-center px-2 py-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold text-white ${
                      s.type === 'First' ? 'bg-blue-600' : s.type === 'Hub' ? 'bg-purple-600' : s.type === 'Transport' ? 'bg-orange-500' : s.type === 'Loading Transfer' || s.type === 'Customer' ? 'bg-green-600' : 'bg-gray-500'
                    }`}>{s.stage}</span>
                  </td>
                  <td className="px-2 py-2">
                    <select value={s.depNo} onChange={e => updateStageField(i, 'depNo', e.target.value)} className="w-full border border-border rounded px-1 py-1 text-xs">
                      <option value="">— Select —</option>
                      {SITE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2 text-table text-xs">{s.departure || '—'}</td>
                  <td className="px-2 py-2">
                    <select value={s.destNo} onChange={e => updateStageField(i, 'destNo', e.target.value)} className="w-full border border-border rounded px-1 py-1 text-xs">
                      <option value="">— Select —</option>
                      {SITE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2 text-table text-xs">{s.destination || '—'}</td>
                  <td className="text-center px-2 py-2">
                    <select value={s.type} onChange={e => updateStageField(i, 'type', e.target.value)} className="border border-border rounded px-1 py-0.5 text-xs">
                      {['First', 'Hub', 'Transport', 'Loading Transfer', 'Customer', 'Last'].map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input type="datetime-local" value={s.plannedArr} onChange={e => {
                      const val = e.target.value;
                      setStages(prev => prev.map((st, idx) => idx === i ? { ...st, plannedArr: val } : st));
                    }} className="w-full border border-border rounded px-1.5 py-1 text-xs" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="datetime-local" value={s.plannedDep} onChange={e => {
                      const val = e.target.value;
                      setStages(prev => prev.map((st, idx) => idx === i ? { ...st, plannedDep: val } : st));
                    }} className="w-full border border-border rounded px-1.5 py-1 text-xs" />
                  </td>
                  <td className="text-center px-2 py-2">
                    <input type="number" value={s.distance || ''} onChange={e => updateStageField(i, 'distance', Number(e.target.value))} className="w-14 border border-border rounded px-1 py-0.5 text-xs text-center" placeholder="km" />
                  </td>
                  <td className="text-center px-2 py-2">
                    <div className="flex gap-1 justify-center">
                      {i > 0 && <button onClick={() => handleStageSwap(i, 'up')} className="px-1.5 py-0.5 rounded border border-border bg-gray-50 hover:bg-gray-100 text-xs" title="Up">&uarr;</button>}
                      {i < stages.length - 1 && <button onClick={() => handleStageSwap(i, 'down')} className="px-1.5 py-0.5 rounded border border-border bg-gray-50 hover:bg-gray-100 text-xs" title="Down">&darr;</button>}
                      {stages.length > 1 && <button onClick={() => removeStage(i)} className="px-1.5 py-0.5 rounded border border-red-300 bg-red-50 hover:bg-red-100 text-xs text-red-600" title="Remove">&times;</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button onClick={addStage} className="px-3 py-1 rounded border border-border text-table text-text-sec hover:bg-bg">
            {t('shipmentForm.addStage')}
          </button>
          <div className="text-table"><strong>{t('shipmentForm.totalDistance')}:</strong> <span className="text-primary font-bold">{totalDistance} km</span></div>
        </div>
      </CollapsibleSection>

      {/* ===== SECTION 6B: TYPE-SPECIFIC DATA ===== */}

      {/* --- NGV DATA --- */}
      {currentProduct === 'NGV' && (
        <CollapsibleSection title={t('shipmentForm.ngvData')} badge={t('shipmentForm.ngvTubeTrailer')}>
          <InfoStrip variant="info" icon="ℹ️">
            {t('shipmentForm.ngvInfo')}
          </InfoStrip>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 mb-3">
            <FormField label="วัน/เวลา รับงาน" type="datetime-local" value={ngvData.receiveDate} onChange={v => setNgvData(d => ({ ...d, receiveDate: v }))} required />
            <FormField label="วัน/เวลา Ref.Date" type="datetime-local" value={ngvData.refDate} onChange={v => setNgvData(d => ({ ...d, refDate: v }))} required />
            <FormField label="วันเวลาตู้เต็ม" type="datetime-local" value={ngvData.fullTubeDate} onChange={v => setNgvData(d => ({ ...d, fullTubeDate: v }))} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <FormField label="วัน/เวลา/psi ลูกค้าแจ้ง" type="datetime-local" value={ngvData.custNotifyDate} onChange={v => setNgvData(d => ({ ...d, custNotifyDate: v }))} />
            <FormField label="PSI ลูกค้าแจ้ง" type="number" value={ngvData.custPSI} onChange={v => setNgvData(d => ({ ...d, custPSI: v }))} placeholder="psi" />
            <FormField label={t('shipmentForm.ngvPairedVehicle')} value={ngvData.pairedVehicle} onChange={v => setNgvData(d => ({ ...d, pairedVehicle: v }))} placeholder="ทะเบียนคู่รถ" />
            <FormField label={t('shipmentForm.ngvRemark')} value={ngvData.remark} onChange={v => setNgvData(d => ({ ...d, remark: v }))} placeholder="NGV Remark" />
          </div>

          {/* NGV Tube Data */}
          <div className="mt-3">
            <h4 className="text-table font-semibold text-green-700 mb-2">{t('shipmentForm.ngvTubeData')} — ตู้หนัก / ตู้เบา</h4>
            <table className="w-full text-table border border-border-light rounded overflow-hidden">
              <thead><tr className="bg-gray-50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold text-text-sec w-24">ตู้</th>
                <th className="text-left px-3 py-2 font-semibold text-text-sec">น้ำหนัก (KG)</th>
                <th className="text-left px-3 py-2 font-semibold text-text-sec">แรงดัน (PSI)</th>
                <th className="text-left px-3 py-2 font-semibold text-text-sec">น้ำหนัก/Weight (KG)</th>
                <th className="text-left px-3 py-2 font-semibold text-text-sec">อุณหภูมิ (°C)</th>
              </tr></thead>
              <tbody>
                <tr className="bg-green-50 border-b border-border-light">
                  <td className="px-3 py-2 font-bold text-green-700">ตู้หนัก</td>
                  <td className="px-3 py-2"><input type="number" value={ngvData.heavyTube.weight} onChange={e => setNgvData(d => ({ ...d, heavyTube: { ...d.heavyTube, weight: Number(e.target.value) } }))} className="border border-border rounded px-2 py-1 text-xs w-20" /></td>
                  <td className="px-3 py-2"><input type="number" value={ngvData.heavyTube.psi} onChange={e => setNgvData(d => ({ ...d, heavyTube: { ...d.heavyTube, psi: Number(e.target.value) } }))} className="border border-border rounded px-2 py-1 text-xs w-16" /></td>
                  <td className="px-3 py-2"><input type="number" value={ngvData.heavyTube.kg} onChange={e => setNgvData(d => ({ ...d, heavyTube: { ...d.heavyTube, kg: Number(e.target.value) } }))} className="border border-border rounded px-2 py-1 text-xs w-16" /></td>
                  <td className="px-3 py-2"><input type="number" value={ngvData.heavyTube.temp} onChange={e => setNgvData(d => ({ ...d, heavyTube: { ...d.heavyTube, temp: Number(e.target.value) } }))} className="border border-border rounded px-2 py-1 text-xs w-14" /></td>
                </tr>
                <tr className="border-b border-border-light">
                  <td className="px-3 py-2 font-bold text-blue-700">ตู้เบา</td>
                  <td className="px-3 py-2"><input type="number" value={ngvData.lightTube.weight} onChange={e => setNgvData(d => ({ ...d, lightTube: { ...d.lightTube, weight: Number(e.target.value) } }))} className="border border-border rounded px-2 py-1 text-xs w-20" /></td>
                  <td className="px-3 py-2"><input type="number" value={ngvData.lightTube.psi} onChange={e => setNgvData(d => ({ ...d, lightTube: { ...d.lightTube, psi: Number(e.target.value) } }))} className="border border-border rounded px-2 py-1 text-xs w-16" /></td>
                  <td className="px-3 py-2"><input type="number" value={ngvData.lightTube.kg} onChange={e => setNgvData(d => ({ ...d, lightTube: { ...d.lightTube, kg: Number(e.target.value) } }))} className="border border-border rounded px-2 py-1 text-xs w-16" /></td>
                  <td className="px-3 py-2"><input type="number" value={ngvData.lightTube.temp} onChange={e => setNgvData(d => ({ ...d, lightTube: { ...d.lightTube, temp: Number(e.target.value) } }))} className="border border-border rounded px-2 py-1 text-xs w-14" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quality Readings */}
          <div className="mt-3">
            <h4 className="text-table font-semibold text-green-700 mb-2">{t('shipmentForm.qualityReadings')} — อุณหภูมิ / ความดัน / ALC (4 จุดตรวจ)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[700px]">
                <thead><tr className="bg-gray-50 border-b border-border">
                  <th className="text-center px-2 py-2 w-8">#</th>
                  <th className="text-left px-2 py-2 w-28">จุดตรวจ</th>
                  <th className="text-left px-2 py-2 bg-green-50">อุณหภูมิ 1</th>
                  <th className="text-left px-2 py-2 bg-green-50">อุณหภูมิ 2</th>
                  <th className="text-left px-2 py-2 bg-blue-50">ความดัน (PSI)</th>
                  <th className="text-left px-2 py-2 bg-orange-50">ALC 1 (%)</th>
                  <th className="text-left px-2 py-2 bg-orange-50">ALC 2 (%)</th>
                  <th className="text-left px-2 py-2">หมายเหตุ</th>
                </tr></thead>
                <tbody>
                  {ngvData.qualityReadings.map((qr, i) => (
                    <tr key={i} className="border-b border-border-light">
                      <td className="text-center px-2 py-1.5 font-semibold">{i + 1}</td>
                      <td className="px-2 py-1.5">
                        <select className="border border-border rounded px-1 py-0.5 text-xs w-full">
                          {NGV_QUALITY_STATIONS.map((st, si) => (
                            <option key={si} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1.5"><input type="number" defaultValue={0} step={0.1} className="border border-border rounded px-1 py-0.5 text-xs w-14" /></td>
                      <td className="px-2 py-1.5"><input type="number" defaultValue={0} step={0.1} className="border border-border rounded px-1 py-0.5 text-xs w-14" /></td>
                      <td className="px-2 py-1.5"><input type="number" defaultValue={0} className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                      <td className="px-2 py-1.5"><input type="number" defaultValue={0} step={0.01} className="border border-border rounded px-1 py-0.5 text-xs w-14" /></td>
                      <td className="px-2 py-1.5"><input type="number" defaultValue={0} step={0.01} className="border border-border rounded px-1 py-0.5 text-xs w-14" /></td>
                      <td className="px-2 py-1.5"><input type="text" placeholder="Note" className="border border-border rounded px-1 py-0.5 text-xs w-full" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NGV Gas Detail — before/after readings */}
          <div className="mt-3">
            <h4 className="text-table font-semibold text-green-700 mb-2 flex items-center gap-2">
              Gas Detail — ก่อนลง / หลังลง
              <label className="ml-4 flex items-center gap-1.5 text-xs font-normal">
                <input type="checkbox" checked={ngvData.gasNotBroken} onChange={e => setNgvData(d => ({ ...d, gasNotBroken: e.target.checked }))} className="w-4 h-4 accent-green-600" />
                <span className="text-green-700">ไม่เสีย (Not broken)</span>
              </label>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border-light rounded">
                <thead><tr className="bg-purple-50 border-b border-border">
                  <th className="px-2 py-2 w-8">#</th>
                  <th className="px-2 py-2 bg-green-50" colSpan={2}>ก่อนลง (Before)</th>
                  <th className="px-2 py-2 bg-orange-50" colSpan={2}>หลังลง (After)</th>
                </tr>
                <tr className="bg-gray-50 border-b border-border text-[10px]">
                  <th></th>
                  <th className="px-2 py-1 bg-green-50">แรงดัน/น้ำหนัก/อุณหภูมิ</th><th className="px-2 py-1 bg-green-50">PSI / KG</th>
                  <th className="px-2 py-1 bg-orange-50">แรงดัน/น้ำหนัก/อุณหภูมิ</th><th className="px-2 py-1 bg-orange-50">PSI / KG</th>
                </tr></thead>
                <tbody>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(n => (
                    <tr key={n} className="border-b border-border-light">
                      <td className="text-center px-2 py-1 font-semibold">{n}</td>
                      <td className="px-2 py-1"><input type="number" defaultValue={0} className="border border-border rounded px-1 py-0.5 text-xs w-20" /></td>
                      <td className="px-2 py-1"><input type="number" defaultValue={0} className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                      <td className="px-2 py-1"><input type="number" defaultValue={0} className="border border-border rounded px-1 py-0.5 text-xs w-20" /></td>
                      <td className="px-2 py-1"><input type="number" defaultValue={0} className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* --- FUEL/WO DATA --- */}
      {currentProduct === 'FUEL' && (
        <CollapsibleSection title={t('shipmentForm.fuelWOData')} badge={t('shipmentForm.fuelWOBadge')}>
          <InfoStrip variant="info" icon="ℹ️">
            {t('shipmentForm.fuelWOInfo')}
          </InfoStrip>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('shipmentForm.shipmentCustomer')}</label>
              <div className="flex">
                <input type="text" value={fuelData.shipCust} onChange={e => setFuelData(d => ({ ...d, shipCust: e.target.value }))} placeholder="Customer Code"
                  className="flex-1 border border-border rounded-l px-2.5 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary" />
                <button className="px-2.5 py-1.5 border border-l-0 border-border rounded-r bg-gray-50 hover:bg-gray-100 text-sm">{t('shipmentForm.search')}</button>
              </div>
            </div>
            <FormField label={t('shipmentForm.custName')} value={fuelData.custName} disabled />
            <FormField label={t('shipmentForm.custCode')} value={fuelData.custCode} disabled />
          </div>

          {/* Fuel Load Stage Timestamps */}
          <h4 className="text-table font-semibold text-orange-700 mt-3 mb-2">เวลาเติมน้ำมัน (Loading Timestamps)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <FormField label="วันเวลารับใบเติม" type="datetime-local" value={fuelData.loadReceiveSlip} onChange={v => setFuelData(d => ({ ...d, loadReceiveSlip: v }))} />
            <FormField label="วันเวลาเริ่มเติม" type="datetime-local" value={fuelData.loadStartTime} onChange={v => setFuelData(d => ({ ...d, loadStartTime: v }))} />
            <FormField label="วันเวลาเติมเสร็จ" type="datetime-local" value={fuelData.loadEndTime} onChange={v => setFuelData(d => ({ ...d, loadEndTime: v }))} />
            <FormField label="เวลารับตั๋ว" type="datetime-local" value={fuelData.loadTicketTime} onChange={v => setFuelData(d => ({ ...d, loadTicketTime: v }))} />
          </div>

          {/* Fuel Unload Stage Timestamps */}
          <h4 className="text-table font-semibold text-blue-700 mb-2">เวลาลงน้ำมัน (Unloading Timestamps)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <FormField label="วันเวลาเริ่มลง" type="datetime-local" value={fuelData.unloadStartTime} onChange={v => setFuelData(d => ({ ...d, unloadStartTime: v }))} />
            <FormField label="วันเวลาลงเสร็จ" type="datetime-local" value={fuelData.unloadEndTime} onChange={v => setFuelData(d => ({ ...d, unloadEndTime: v }))} />
          </div>

          {/* Customer Delivery Table */}
          <h4 className="text-table font-semibold text-blue-700 mb-2">{t('shipmentForm.customerDelivery')} — รายการจัดส่ง</h4>
          <div className="overflow-x-auto border border-border-light rounded">
            <table className="w-full text-xs min-w-[1100px]">
              <thead><tr className="bg-gray-50 border-b border-border">
                <th className="px-2 py-2 w-8">#</th>
                <th className="px-2 py-2">Ship To</th><th className="px-2 py-2">Cust Name</th><th className="px-2 py-2">Cust Code</th><th className="px-2 py-2">Delivery No.</th>
                {[1,2,3,4,5,6,7,8].map(n => {
                  const bg = ['bg-blue-50','bg-orange-50','bg-pink-50','bg-green-50','bg-purple-50','bg-yellow-50','bg-cyan-50','bg-red-50'][n-1];
                  return <React.Fragment key={n}>
                    <th className={`px-2 py-2 ${bg}`}>Comp {n}</th><th className={`px-2 py-2 ${bg}`}>QTY {n}</th><th className={`px-2 py-2 ${bg}`}>Status {n}</th>
                  </React.Fragment>;
                })}
              </tr></thead>
              <tbody>
                {fuelData.deliveries.map((del, i) => (
                  <tr key={i} className="border-b border-border-light">
                    <td className="text-center px-2 py-1.5">{i + 1}</td>
                    <td className="px-2 py-1.5"><input type="text" value={del.shipTo} className="border border-border rounded px-1 py-0.5 text-xs w-16" readOnly /></td>
                    <td className="px-2 py-1.5 text-xs">{del.name}</td>
                    <td className="px-2 py-1.5 text-xs">{del.code}</td>
                    <td className="px-2 py-1.5"><input type="text" value={del.deliveryNo} className="border border-border rounded px-1 py-0.5 text-xs w-24" readOnly /></td>
                    {del.comps.map((c, ci) => (
                      <React.Fragment key={ci}>
                        <td className="px-2 py-1.5"><select className="border border-border rounded px-1 py-0.5 text-xs w-12"><option>{c.comp}</option></select></td>
                        <td className="px-2 py-1.5"><input type="number" defaultValue={c.qty} className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                        <td className="px-2 py-1.5"><select className="border border-border rounded px-1 py-0.5 text-xs w-16"><option>{c.status}</option><option>N ยกเลิก</option><option>P รอดำเนิน</option></select></td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setFuelData(d => ({ ...d, deliveries: [...d.deliveries, { shipTo: '', name: '', code: '', deliveryNo: '', comps: Array.from({ length: 8 }, () => ({ comp: '—', qty: 0, status: '—' })) }] }))} className="mt-2 px-3 py-1 rounded border border-border text-table text-text-sec hover:bg-bg text-xs">{t('shipmentForm.addDelivery')}</button>

          {/* Compartment Data per Stage */}
          {stages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-table font-semibold text-orange-700 mb-2">Compartment Data per Stage</h4>
              <div className="overflow-x-auto border border-border-light rounded">
                <table className="w-full text-xs">
                  <thead><tr className="bg-orange-50 border-b border-border">
                    <th className="px-2 py-2">#</th><th className="px-2 py-2">Destination</th><th className="px-2 py-2">Ship-To</th><th className="px-2 py-2">Type</th><th className="px-2 py-2">Delivery No.</th>
                    <th className="px-2 py-2 bg-blue-50">Comp 1</th><th className="px-2 py-2 bg-orange-50">Comp 2</th><th className="px-2 py-2 bg-pink-50">Comp 3</th>
                  </tr></thead>
                  <tbody>
                    {stages.filter(s => s.type === 'Transport' || s.type === 'Customer').map((s, i) => (
                      <tr key={i} className="border-b border-border-light">
                        <td className="text-center px-2 py-1.5">{i + 1}</td>
                        <td className="px-2 py-1.5 font-medium">{s.destination}</td>
                        <td className="px-2 py-1.5"><input type="text" placeholder="Ship-To" className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                        <td className="px-2 py-1.5"><select className="border border-border rounded px-1 py-0.5 text-xs"><option>Diesel B7</option><option>G95</option><option>G91</option><option>Diesel B20</option></select></td>
                        <td className="px-2 py-1.5"><input type="text" placeholder="Delivery No." className="border border-border rounded px-1 py-0.5 text-xs w-24" /></td>
                        {[1,2,3].map(n => (
                          <td key={n} className="px-2 py-1.5"><input type="number" placeholder={`Comp ${n}`} className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                        ))}
                      </tr>
                    ))}
                    {stages.filter(s => s.type === 'Transport' || s.type === 'Customer').length === 0 && (
                      <tr><td colSpan={8} className="text-center py-3 text-text-muted">No delivery stages configured. Add stages above.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fuel Price Reference */}
          <div className="mt-3 p-3 bg-gray-50 border border-border rounded-lg">
            <div className="flex gap-4 items-center text-xs">
              <span className="font-semibold text-text-sec">{t('shipmentForm.fuelPriceRef')}:</span>
              <span>Type: <strong>DIEB07</strong></span>
              <span>Rate: <strong>D (รายวัน)</strong></span>
              <span>Comp: <strong>PTT</strong></span>
              <span>Price: <strong className="text-primary">฿30.44</strong></span>
              <span className="text-text-muted">Date: 25.12.2025</span>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* --- CONTAINER DATA --- */}
      {currentProduct === 'CONTAINER' && (
        <CollapsibleSection title={t('shipmentForm.containerData')} badge={t('shipmentForm.containerTransport')}>
          <InfoStrip variant="info" icon="ℹ️">
            {t('shipmentForm.containerInfo')}
          </InfoStrip>
          {/* Job Type */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 mb-3">
            <FormField label="ประเภทงาน (Job Type)" type="select" value={containerData.jobType} onChange={v => setContainerData(d => ({ ...d, jobType: v }))} required
              options={[
                { value: 'Import', label: 'Import — นำเข้า' },
                { value: 'Export', label: 'Export — ส่งออก' },
                { value: 'Domestic', label: 'Domestic — ในประเทศ' },
                { value: 'Transit', label: 'Transit — ผ่านแดน' },
                { value: 'Empty', label: 'Empty — ตู้เปล่า' },
              ]} placeholder="— เลือกประเภทงาน —" />
          </div>

          {/* Business Partner */}
          <h4 className="text-table font-semibold text-orange-700 mb-2">Business Partner — คู่ค้า</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <FormField label="Agent" value={containerData.agent} onChange={v => setContainerData(d => ({ ...d, agent: v }))} placeholder="Agent code" />
            <FormField label="Agent Name" value={containerData.agentName} onChange={v => setContainerData(d => ({ ...d, agentName: v }))} placeholder="Agent name" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            {['Ship To', 'Sold To', 'Payer', 'Bill To'].map((lbl, i) => (
              <div key={i}>
                <label className="block text-xs font-medium text-text-sec mb-1">{i < 2 && <span className="text-error">* </span>}{lbl}</label>
                <div className="flex">
                  <input type="text" placeholder={`${lbl} Code`} className="flex-1 border border-border rounded-l px-2 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary" />
                  <button className="px-2 py-1.5 border border-l-0 border-border rounded-r bg-gray-50 hover:bg-gray-100 text-xs">Search</button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <FormField label={t('shipmentForm.shipToName')} value={containerData.shipToName} disabled />
            <FormField label={t('shipmentForm.soldToName')} value={containerData.soldToName} disabled />
            <FormField label={t('shipmentForm.payerName')} value={containerData.payerName} disabled />
            <FormField label={t('shipmentForm.billToName')} value={containerData.billToName} disabled />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <FormField label={t('shipmentForm.bookingRef')} value={containerData.booking} onChange={v => setContainerData(d => ({ ...d, booking: v }))} placeholder="BKG-EV-2026-0142" />
            <FormField label={t('shipmentForm.shippingLine')} value={containerData.shippingLine} onChange={v => setContainerData(d => ({ ...d, shippingLine: v }))} placeholder="Evergreen / ONE / Hapag" />
            <FormField label={t('shipmentForm.vesselVoyage')} value={containerData.vessel} onChange={v => setContainerData(d => ({ ...d, vessel: v }))} placeholder="MV EVER GIVEN / V.123" />
            <FormField label={t('shipmentForm.noContainers')} type="number" value={containerData.containerCount} onChange={v => setContainerData(d => ({ ...d, containerCount: v }))} required />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <FormField label="BL No." value={containerData.blNo} onChange={v => setContainerData(d => ({ ...d, blNo: v }))} placeholder="Bill of Lading No." />
            <FormField label="Port of Loading" value={containerData.portOfLoading} onChange={v => setContainerData(d => ({ ...d, portOfLoading: v }))} placeholder="e.g. Bangkok" />
            <FormField label="Port of Discharge" value={containerData.portOfDischarge} onChange={v => setContainerData(d => ({ ...d, portOfDischarge: v }))} placeholder="e.g. Singapore" />
            <FormField label="Place of Delivery" value={containerData.placeOfDelivery} onChange={v => setContainerData(d => ({ ...d, placeOfDelivery: v }))} placeholder="Final destination" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <FormField label="Remark 1" value={containerData.remark1} onChange={v => setContainerData(d => ({ ...d, remark1: v }))} />
            <FormField label="Remark 2" value={containerData.remark2} onChange={v => setContainerData(d => ({ ...d, remark2: v }))} />
          </div>

          {/* Container List */}
          <h4 className="text-table font-semibold text-orange-700 mb-2">{t('shipmentForm.containerList')}</h4>
          <div className="overflow-x-auto border border-border-light rounded">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 border-b border-border">
                <th className="px-2 py-2 w-8">#</th><th className="px-2 py-2">Container No.</th><th className="px-2 py-2">Size</th><th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Container Type</th><th className="px-2 py-2">Seal No.</th><th className="px-2 py-2">Booking</th><th className="px-2 py-2">Agent</th><th className="px-2 py-2">Weight (kg)</th><th className="px-2 py-2">Tare (kg)</th><th className="px-2 py-2">VGM (kg)</th><th className="px-2 py-2">Temp</th><th className="px-2 py-2">Status</th>
              </tr></thead>
              <tbody>
                {containerData.containers.map((c, i) => (
                  <tr key={i} className="border-b border-border-light">
                    <td className="text-center px-2 py-1.5">{i + 1}</td>
                    <td className="px-2 py-1.5"><input type="text" value={c.no} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, no: e.target.value } : cc) }))} className="border border-border rounded px-1 py-0.5 text-xs w-32" /></td>
                    <td className="px-2 py-1.5"><select value={c.size} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, size: e.target.value } : cc) }))} className="border border-border rounded px-1 py-0.5 text-xs">
                      {['20ft', '40ft', '40ft HC', '45ft'].map(s => <option key={s}>{s}</option>)}
                    </select></td>
                    <td className="px-2 py-1.5"><select value={c.type} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, type: e.target.value } : cc) }))} className="border border-border rounded px-1 py-0.5 text-xs"><option>FCL</option><option>LCL</option><option>Empty</option></select></td>
                    <td className="px-2 py-1.5"><select value={c.containerType} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, containerType: e.target.value } : cc) }))} className="border border-border rounded px-1 py-0.5 text-xs">
                      {['GP', 'HC', 'Dry', 'Reefer', 'Open Top', 'Flat Rack', 'Tank'].map(s => <option key={s}>{s}</option>)}
                    </select></td>
                    <td className="px-2 py-1.5"><input type="text" value={c.seal} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, seal: e.target.value } : cc) }))} placeholder="Seal No." className="border border-border rounded px-1 py-0.5 text-xs w-24" /></td>
                    <td className="px-2 py-1.5"><input type="text" value={c.booking || containerData.booking} className="border border-border rounded px-1 py-0.5 text-xs w-24" readOnly /></td>
                    <td className="px-2 py-1.5"><input type="text" value={c.agent || containerData.agent} className="border border-border rounded px-1 py-0.5 text-xs w-20" readOnly /></td>
                    <td className="px-2 py-1.5"><input type="number" value={c.weight} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, weight: Number(e.target.value) } : cc) }))} className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                    <td className="px-2 py-1.5"><input type="number" value={c.tare} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, tare: Number(e.target.value) } : cc) }))} className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                    <td className="px-2 py-1.5"><input type="number" value={c.vgm} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, vgm: Number(e.target.value) } : cc) }))} className="border border-border rounded px-1 py-0.5 text-xs w-16" /></td>
                    <td className="px-2 py-1.5">{c.containerType === 'Reefer' ? <input type="text" value={c.temp} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, temp: e.target.value } : cc) }))} placeholder="°C" className="border border-border rounded px-1 py-0.5 text-xs w-14" /> : <span className="text-text-muted">—</span>}</td>
                    <td className="px-2 py-1.5"><select value={c.status} onChange={e => setContainerData(d => ({ ...d, containers: d.containers.map((cc, ci) => ci === i ? { ...cc, status: e.target.value } : cc) }))} className="border border-border rounded px-1 py-0.5 text-xs">
                      {['Empty', 'Loaded', 'Damaged'].map(s => <option key={s}>{s}</option>)}
                    </select></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setContainerData(d => ({ ...d, containers: [...d.containers, { no: '', size: '40ft HC', type: 'FCL', containerType: 'Dry', seal: '', weight: 0, tare: 0, vgm: 0, temp: '', status: 'Empty' }] }))} className="mt-2 px-3 py-1 rounded border border-border text-table text-text-sec hover:bg-bg text-xs">{t('shipmentForm.addContainer')}</button>
        </CollapsibleSection>
      )}

      {/* --- CAR CARRIER DATA --- */}
      {currentProduct === 'SCA' && (
        <CollapsibleSection title={t('shipmentForm.carCarrierData')} badge={t('shipmentForm.scaCarCarrier')}>
          <InfoStrip variant="info" icon="ℹ️">
            {t('shipmentForm.scaInfo')}
          </InfoStrip>
          <h4 className="text-table font-semibold text-amber-700 mt-3 mb-2">{t('shipmentForm.shipmentParams')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <FormField label="Yard No." type="select" value={scaData.yardNo} onChange={v => setScaData(d => ({ ...d, yardNo: v }))} options={YARD_OPTIONS} required placeholder="— Select Yard —" />
            <FormField label="Trans. Type" type="select" value={scaData.transType} onChange={v => setScaData(d => ({ ...d, transType: v }))}
              options={[{ value: 'I', label: 'I — Gate In' }, { value: 'O', label: 'O — Gate Out' }, { value: 'R', label: 'R — Round Trip' }]} />
            <FormField label="Calling No." value={scaData.callingNo} onChange={v => setScaData(d => ({ ...d, callingNo: v }))} placeholder="e.g. CALL-2026-0142" />
            <div>
              <label className="block text-xs font-medium text-text-sec mb-1">Group No. / Trip</label>
              <div className="flex gap-1">
                <input type="text" value={scaData.groupNo} onChange={e => setScaData(d => ({ ...d, groupNo: e.target.value }))} placeholder="Group" className="flex-1 border border-border rounded px-2 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary" />
                <input type="text" value={scaData.trip} onChange={e => setScaData(d => ({ ...d, trip: e.target.value }))} placeholder="Trip" className="w-16 border border-border rounded px-2 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <FormField label="Transport Fee" type="select" value={scaData.transportFee} onChange={v => setScaData(d => ({ ...d, transportFee: v }))} options={SCA_TRANSPORT_FEE_OPTIONS} />
            <FormField label="Trip Pay" type="select" value={scaData.tripPay} onChange={v => setScaData(d => ({ ...d, tripPay: v }))} options={SCA_TRIP_PAY_OPTIONS} />
            <FormField label={t('shipmentForm.shipType')} value="01 — Truck" disabled />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded">
                <input type="checkbox" checked={scaData.brokenMiles} onChange={e => setScaData(d => ({ ...d, brokenMiles: e.target.checked }))} className="w-4 h-4 accent-orange-600" />
                <span className="text-table font-medium text-orange-700">ไมล์เสีย (Broken Miles)</span>
              </label>
            </div>
          </div>

          {/* 11-Position Visual Layout */}
          <h4 className="text-table font-semibold text-amber-700 mt-3 mb-2">{t('shipmentForm.positionLayout')} — ตำแหน่งบนรถ</h4>
          <div className="flex gap-4 items-start mb-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <div className="flex-shrink-0">
              <div className="text-xs text-text-muted text-center mb-1">{t('shipmentForm.carCarrier11')}</div>
              <div className="w-64 bg-white border-2 border-amber-500 rounded-lg p-2">
                <div className="text-xs font-semibold text-amber-700 mb-1">▲ {t('shipmentForm.upperDeck')}</div>
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {SCA_POSITIONS.upper.map(pos => {
                    const hasVehicle = scaData.vehicles.some(v => v.pos === pos);
                    return (
                      <div key={pos} className={`text-center py-1 rounded text-xs font-semibold border ${hasVehicle ? 'bg-green-50 border-green-400 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                        {pos}<br /><span className="text-[10px]">{hasVehicle ? '✓' : '—'}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs font-semibold text-amber-900 mb-1">▼ {t('shipmentForm.lowerDeck')}</div>
                <div className="grid grid-cols-3 gap-1">
                  {SCA_POSITIONS.lower.map(pos => {
                    const hasVehicle = scaData.vehicles.some(v => v.pos === pos);
                    return (
                      <div key={pos} className={`text-center py-1 rounded text-xs font-semibold border ${hasVehicle ? 'bg-green-50 border-green-400 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                        {pos}<br /><span className="text-[10px]">{hasVehicle ? '✓' : '—'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-xs text-center mt-1 text-text-muted">{t('shipmentForm.loadedSlots')}: <strong className="text-green-600">{scaData.vehicles.length}</strong> / 11 {t('shipmentForm.slots')}</div>
            </div>

            {/* Position Summary Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-white border-b border-border"><th className="px-2 py-1.5 w-10">Pos</th><th className="px-2 py-1.5">VIN No.</th><th className="px-2 py-1.5">Model</th><th className="px-2 py-1.5">Ship To</th><th className="px-2 py-1.5 w-12">Status</th></tr></thead>
                <tbody>
                  {scaData.vehicles.map((v, i) => (
                    <tr key={i} className="border-b border-border-light">
                      <td className="text-center px-2 py-1 font-semibold text-amber-700">{v.pos}</td>
                      <td className="px-2 py-1">{v.vin}</td>
                      <td className="px-2 py-1">{v.model}</td>
                      <td className="px-2 py-1">{v.shipToName}</td>
                      <td className="text-center px-2 py-1"><span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">✓</span></td>
                    </tr>
                  ))}
                  {[...SCA_POSITIONS.upper, ...SCA_POSITIONS.lower].filter(pos => !scaData.vehicles.some(v => v.pos === pos)).map(pos => (
                    <tr key={pos} className="border-b border-border-light opacity-40">
                      <td className="text-center px-2 py-1">{pos}</td>
                      <td colSpan={3} className="px-2 py-1 text-text-muted">— {t('shipmentForm.emptySlot')} —</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehicle Data Table */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-table font-semibold text-amber-700">{t('shipmentForm.vehicleData')} — รายการรถที่ขนส่ง</h4>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-400 text-amber-700 text-xs font-medium hover:bg-amber-50 cursor-pointer">
              <span>{'📁'}</span> Upload Excel
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => {
                if (e.target.files?.[0]) {
                  window.alert(`File "${e.target.files[0].name}" selected.\nIn production, this would parse the Excel and populate the vehicle table.`);
                  e.target.value = '';
                }
              }} />
            </label>
          </div>
          <div className="overflow-x-auto border border-border-light rounded">
            <table className="w-full text-xs min-w-[900px]">
              <thead><tr className="bg-gray-50 border-b border-border">
                <th className="px-1.5 py-2">VIN No.</th>
                <th className="px-1.5 py-2">Calling No.</th>
                <th className="px-1.5 py-2 w-10">Pos</th>
                <th className="px-1.5 py-2">Model</th>
                <th className="px-1.5 py-2">Sold To</th>
                <th className="px-1.5 py-2">Sold To Address</th>
                <th className="px-1.5 py-2">Ship To</th>
                <th className="px-1.5 py-2">Ship To Name</th>
                <th className="px-1.5 py-2 w-20">รถกลับ</th>
              </tr></thead>
              <tbody>
                {scaData.vehicles.map((v, i) => (
                  <tr key={i} className="border-b border-border-light">
                    <td className="px-1.5 py-1.5"><input type="text" value={v.vin} className="border border-border rounded px-1 py-0.5 text-xs w-28" readOnly /></td>
                    <td className="px-1.5 py-1.5"><input type="text" value={v.calling || ''} onChange={e => setScaData(d => ({ ...d, vehicles: d.vehicles.map((ve, vi) => vi === i ? { ...ve, calling: e.target.value } : ve) }))} placeholder="Calling" className="border border-border rounded px-1 py-0.5 text-xs w-24" /></td>
                    <td className="text-center px-1.5 py-1.5 font-semibold text-amber-700">{v.pos}</td>
                    <td className="px-1.5 py-1.5"><input type="text" value={v.model} className="border border-border rounded px-1 py-0.5 text-xs w-20" readOnly /></td>
                    <td className="px-1.5 py-1.5 text-[11px]">{v.soldTo}</td>
                    <td className="px-1.5 py-1.5 text-[11px]">{v.dealer}</td>
                    <td className="px-1.5 py-1.5 text-[11px]">{v.shipTo}</td>
                    <td className="px-1.5 py-1.5 text-[11px]">{v.shipToName}</td>
                    <td className="px-1.5 py-1.5">
                      <select className="border border-border rounded px-1 py-0.5 text-xs w-full"
                        value={v.returnStatus || 'ไม่ใช่รถกลับ'}
                        onChange={e => setScaData(d => ({ ...d, vehicles: d.vehicles.map((ve, vi) => vi === i ? { ...ve, returnStatus: e.target.value } : ve) }))}>
                        <option value="ไม่ใช่รถกลับ">ไม่ใช่รถกลับ</option>
                        <option value="ใช่">ใช่</option>
                        <option value="แลกเปลี่ยน">แลกเปลี่ยน</option>
                        <option value="มือสอง">มือสอง</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Collection Status Summary */}
          <h4 className="text-table font-semibold text-amber-700 mt-3 mb-2">สถานะเก็บเงิน (Collection Status Summary)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 border border-border rounded-lg">
            <div className="text-center p-3 bg-white rounded border border-border-light">
              <div className="text-xs text-text-muted">{t('shipmentForm.totalVehicles')}</div>
              <div className="text-2xl font-bold text-amber-700">{scaData.vehicles.length}</div>
            </div>
            <div className="text-center p-3 bg-white rounded border border-border-light">
              <div className="text-xs text-text-muted">{t('shipmentForm.shipToDestinations')}</div>
              <div className="text-2xl font-bold text-blue-700">1</div>
              <div className="text-xs text-text-muted">LCB แหลมฉบัง</div>
            </div>
            <div className="text-center p-3 bg-white rounded border border-border-light">
              <div className="text-xs text-text-muted">{t('shipmentForm.soldToLabel')}</div>
              <div className="text-2xl font-bold text-purple-700">1</div>
              <div className="text-xs text-text-muted">1100297</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded border border-green-200">
              <div className="text-xs text-text-muted">{t('shipmentForm.collectionFlag')}</div>
              <div className="text-sm font-bold text-green-700">✓ {scaData.transportFee}</div>
              <div className="text-xs text-text-muted">{t('shipmentForm.soSettlementReady')}</div>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* ===== SECTION 7: TRANSPORT FEE & TRIP PAY ===== */}
      <CollapsibleSection title={t('shipmentForm.transportFeeSection')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <FormField label="ค่าขนส่ง (Transport Fee)" type="select" value={form.transportFee} onChange={v => updateForm('transportFee', v)}
              options={[{ value: 'เก็บ', label: 'เก็บ (Collect)' }, { value: 'ไม่เก็บ', label: 'ไม่เก็บ (No Collect)' }]} />
            <span className="text-xs text-text-muted">Default: เก็บ · บาท/ลิตร, เพิ่มเติม รถเช่า</span>
          </div>
          <div>
            <FormField label="ค่าเที่ยว (Trip Pay)" type="select" value={form.tripPay} onChange={v => updateForm('tripPay', v)}
              options={[{ value: 'จ่าย', label: 'จ่าย (Pay)' }, { value: 'ไม่จ่าย', label: 'ไม่จ่าย (No Pay)' }]} />
            <span className="text-xs text-text-muted">Default: จ่าย · บาท/รอบ</span>
          </div>
        </div>
        <label className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg w-fit">
          <input type="checkbox" checked={form.brokenMiles} onChange={e => updateForm('brokenMiles', e.target.checked)} className="w-4 h-4 accent-orange-600" />
          <span className="text-table font-medium text-orange-700">ไมล์เสีย (Broken Miles)</span>
          <span className="text-xs text-text-muted ml-2">— If checked, validates with broken miles criteria (config 004, 005)</span>
        </label>
      </CollapsibleSection>

      {/* ===== FOOTER ===== */}
      <div className="sticky bottom-0 bg-white border-t border-border py-3 px-4 flex items-center justify-between rounded-lg shadow-lg z-10">
        <div className="flex gap-4 text-table text-text-muted">
          <span>{t('shipmentForm.statusLabel')}: <strong className="text-text">{isEditMode ? shipment?.status || 'OPEN' : t('shipmentForm.newStatus')}</strong></span>
          <span>|</span>
          <span>{t('shipmentForm.fosLabel')}: <strong className="text-text">{consolidatedFOs.length + (selectedFO ? 1 : 0)}</strong></span>
          <span>|</span>
          <span>{t('shipmentForm.totalQty')}: <strong className="text-text">{selectedFO?.qty || '—'}</strong></span>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="px-4 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg">
            {t('shipmentForm.cancel')}
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg">
            {t('shipmentForm.saveDraft')}
          </button>
          {!isEditMode ? (
            <>
              <button onClick={handleSave} className="px-4 py-1.5 rounded bg-primary text-white text-table font-medium hover:bg-primary-hover">
                {t('shipmentForm.createShipment')}
              </button>
              <button onClick={handleDispatch} className="px-4 py-1.5 rounded bg-success text-white text-table font-medium hover:bg-green-700">
                {t('shipmentForm.createAndDispatch')}
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="px-4 py-1.5 rounded bg-primary text-white text-table font-medium hover:bg-primary-hover">
                {t('shipmentForm.saveChanges')}
              </button>
              <button onClick={handleDispatch} className="px-4 py-1.5 rounded bg-success text-white text-table font-medium hover:bg-green-700">
                {t('shipmentForm.dispatch')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===== MODALS ===== */}
      <TruckSearchModal open={showTruckSearch} onClose={() => setShowTruckSearch(false)} onSelect={handleTruckSelect} />
      <FleetSuggestModal open={showFleetSuggest} onClose={() => setShowFleetSuggest(false)} onSelect={handleTruckSelect} product={currentProduct} />
      <EmployeeSearchModal open={!!empSearchTarget} onClose={() => setEmpSearchTarget(null)} onSelect={handleEmployeeSelect}
        roleFilter={empSearchTarget?.startsWith('helper') ? 'helper' : 'driver'} />
      <StageSwapModal open={!!showStageSwap} onClose={() => setShowStageSwap(null)}
        stageIndex={showStageSwap?.index} direction={showStageSwap?.direction} onConfirm={confirmStageSwap} />
    </div>
  );
}
