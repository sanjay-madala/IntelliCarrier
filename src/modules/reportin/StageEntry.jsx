import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import InfoStrip from '../../components/common/InfoStrip';
import { validateMiles } from '../../utils/validation';
import { productConfig } from '../../data/mockData';

const stageTypeOptions = [
  { value: 'first', labelKey: 'stage.type.first' },
  { value: 'load',  labelKey: 'stage.type.load' },
  { value: 'cust',  labelKey: 'stage.type.cust' },
  { value: 'last',  labelKey: 'stage.type.last' },
  { value: 'hub',   labelKey: 'stage.type.hub' },
];

const dataSourceOptions = [
  { value: 'manual', labelKey: 'stage.dataSource.manual' },
  { value: 'mobile', labelKey: 'stage.dataSource.mobile' },
];

const typeDescriptions = {
  LPG:       { color: '#dc2626', bg: '#fef2f2', icon: '🔥', descKey: 'stage.productDesc.LPG' },
  CHEM:      { color: '#7c3aed', bg: '#f5f3ff', icon: '🧪', descKey: 'stage.productDesc.CHEM' },
  FUEL:      { color: '#ea580c', bg: '#fff7ed', icon: '⛽',        descKey: 'stage.productDesc.FUEL' },
  NGV:       { color: '#16a34a', bg: '#f0fdf4', icon: '🟢', descKey: 'stage.productDesc.NGV' },
  CONTAINER: { color: '#2563eb', bg: '#eff6ff', icon: '📦', descKey: 'stage.productDesc.CONTAINER' },
  SCA:       { color: '#ca8a04', bg: '#fefce8', icon: '🚗', descKey: 'stage.productDesc.SCA' },
};

export default function StageEntry({ shipment }) {
  const { t } = useLanguage();
  const { dispatch } = useApp();
  const [currentStage, setCurrentStage] = useState(0);
  const [dataSource, setDataSource] = useState('manual');
  const [stageData, setStageData] = useState(
    shipment.stages.map(s => ({
      stageType: s.type === 'delivery' ? 'cust' : s.type === 'transfer' ? 'hub' : s.type === 'customer' ? 'cust' : s.type || 'first',
      origin: s.from || s.origin || '',
      destination: s.to || s.dest || '',
      stdDistance: s.stdDistance || s.stdDist || s.distance || 0,
      departureTime: s.departureTime || '',
      arrivalTime: s.arrivalTime || '',
      milesStart: s.milesStart != null ? String(s.milesStart) : '',
      milesEnd: s.milesEnd != null ? String(s.milesEnd) : '',
      gpsDistance: s.gpsDistance != null ? String(s.gpsDistance) : '',
      // Load section
      weightBefore: s.weightBefore != null ? String(s.weightBefore) : '',
      weightAfter: s.weightAfter != null ? String(s.weightAfter) : '',
      // Customer section
      ticketNo: s.ticketNo || '',
      ticketDate: s.ticketDate || '',
      poNo: s.poNo || '',
      faceQty: s.faceQty != null ? String(s.faceQty) : '',
      actualQty: s.actualQty != null ? String(s.actualQty) : '',
      weightBeforeUnload: s.weightBeforeUnload != null ? String(s.weightBeforeUnload) : '',
      weightAfterUnload: s.weightAfterUnload != null ? String(s.weightAfterUnload) : '',
      waitDiscount: s.waitDiscount || false,
      cannotUnload: s.cannotUnload || false,
      planArrival: s.planArrival || '',
      customerPlanTime: s.customerPlanTime || '',
      waitStartTime: s.waitStartTime || '',
      unloadStartTime: s.unloadStartTime || '',
      remarks: s.remarks || '',
      // Fuel loading extra
      receiveDocTime: s.receiveDocTime || '',
      startLoadTime: s.startLoadTime || '',
      finishLoadTime: s.finishLoadTime || '',
      ticketReceiveTime: s.ticketReceiveTime || '',
      // Fuel customer extra
      startUnloadTime: s.startUnloadTime || '',
      finishUnloadTime: s.finishUnloadTime || '',
      // NGV customer
      waitingUnload: s.waitingUnload || false,
      cannotUnloadNgv: s.cannotUnloadNgv || false,
      // Compartment pressure (18 rows, before/after with value + psiKg)
      compartments: s.compartments || Array.from({ length: 18 }, () => ({
        beforeValue: '', beforePsiKg: '',
        afterValue: '', afterPsiKg: '',
      })),
      // SPL container sub-table
      containers: s.containers || [{ booking: '', agent: '', containerNo: '', seal: '', size: '', type: '', status: '' }],
    }))
  );
  const [validation, setValidation] = useState(null);

  const stage = shipment.stages[currentStage];
  const data = stageData[currentStage];
  const typeInfo = typeDescriptions[shipment.product] || typeDescriptions.LPG;

  const actualDistance = useMemo(() => {
    const start = Number(data.milesStart);
    const end = Number(data.milesEnd);
    if (start && end && end > start) return end - start;
    return null;
  }, [data.milesStart, data.milesEnd]);

  const [stageTypeWarning, setStageTypeWarning] = useState(null);

  const updateField = (field, value) => {
    // R105: Warn when changing stage type — route may need re-validation
    if (field === 'stageType') {
      const oldType = stageData[currentStage].stageType;
      if (oldType !== value) {
        setStageTypeWarning(`Stage type changed from "${oldType}" to "${value}". Please verify the route and distance are still correct.`);
        setTimeout(() => setStageTypeWarning(null), 6000);
      }
    }
    setStageData(prev => {
      const next = [...prev];
      next[currentStage] = { ...next[currentStage], [field]: value };
      return next;
    });
  };

  const runValidation = () => {
    // Pre-validation: check required fields
    const missing = [];
    if (!data.departureTime) missing.push(t('stage.form.departure'));
    if (!data.arrivalTime) missing.push(t('stage.form.arrival'));
    if (!data.milesStart) missing.push(t('stage.form.milesStart'));
    if (!data.milesEnd) missing.push(t('stage.form.milesEnd'));
    if (isCustomerStage && isLpgChem) {
      if (!data.ticketNo) missing.push('Ticket No.');
      if (!data.faceQty) missing.push('Face Qty');
    }
    if (missing.length > 0) {
      const result = { passed: false, violations: missing.map(f => ({ rule: 'REQ', message: `${f} is required` })) };
      setValidation(result);
      return result;
    }

    const prevStage = currentStage > 0
      ? { ...shipment.stages[currentStage - 1], milesEnd: Number(stageData[currentStage - 1].milesEnd) || null }
      : null;
    const stageObj = {
      ...stage,
      stdDistance: data.stdDistance || stage.stdDist || stage.distance || 0,
      milesStart: Number(data.milesStart) || null,
      milesEnd: Number(data.milesEnd) || null,
    };
    const result = validateMiles(stageObj, prevStage, shipment.lastTruckMiles);
    setValidation(result);
    return result;
  };

  const handleCheckMiles = () => {
    runValidation();
  };

  const handleSaveStage = () => {
    const result = runValidation();
    if (!result.passed) return;

    const milesEnd = Number(data.milesEnd) || null;

    dispatch({
      type: 'UPDATE_STAGE',
      payload: {
        shipmentId: shipment.id,
        stageIndex: currentStage,
        data: {
          milesStart: Number(data.milesStart) || null,
          milesEnd,
          status: 'completed',
          departureTime: data.departureTime || null,
          arrivalTime: data.arrivalTime || null,
          gpsDistance: Number(data.gpsDistance) || null,
          weightBefore: Number(data.weightBefore) || null,
          weightAfter: Number(data.weightAfter) || null,
          ticketNo: data.ticketNo || null,
          ticketDate: data.ticketDate || null,
          poNo: data.poNo || null,
          faceQty: Number(data.faceQty) || null,
          actualQty: Number(data.actualQty) || null,
          weightBeforeUnload: Number(data.weightBeforeUnload) || null,
          weightAfterUnload: Number(data.weightAfterUnload) || null,
          waitDiscount: data.waitDiscount,
          cannotUnload: data.cannotUnload,
          planArrival: data.planArrival || null,
          customerPlanTime: data.customerPlanTime || null,
          waitStartTime: data.waitStartTime || null,
          unloadStartTime: data.unloadStartTime || null,
          remarks: data.remarks || null,
          receiveDocTime: data.receiveDocTime || null,
          startLoadTime: data.startLoadTime || null,
          finishLoadTime: data.finishLoadTime || null,
          ticketReceiveTime: data.ticketReceiveTime || null,
          startUnloadTime: data.startUnloadTime || null,
          finishUnloadTime: data.finishUnloadTime || null,
          waitingUnload: data.waitingUnload,
          cannotUnloadNgv: data.cannotUnloadNgv,
          compartments: data.compartments,
          containers: data.containers,
        },
      },
    });

    // O169: Keep latest truck miles in truck master
    if (milesEnd && shipment.plate) {
      dispatch({
        type: 'UPDATE_TRUCK_MILES',
        payload: { plate: shipment.plate, lastTruckMiles: milesEnd },
      });
    }
  };

  const handleSimulateMobile = () => {
    const simStart = shipment.lastTruckMiles + (currentStage > 0
      ? (Number(stageData[currentStage - 1].milesEnd) || 0) - shipment.lastTruckMiles
      : 0);
    const simEnd = simStart + (stage.stdDistance || stage.distance) + Math.floor(Math.random() * 10 - 5);
    updateField('milesStart', String(simStart || shipment.lastTruckMiles));
    updateField('milesEnd', String(simEnd));
    updateField('gpsDistance', String((stage.stdDistance || stage.distance) + Math.floor(Math.random() * 6 - 3)));
    updateField('departureTime', '2026-02-19T08:00');
    updateField('arrivalTime', '2026-02-19T11:30');
  };

  const handleClear = () => {
    setStageData(prev => {
      const next = [...prev];
      next[currentStage] = {
        ...next[currentStage],
        milesStart: '', milesEnd: '', gpsDistance: '', departureTime: '', arrivalTime: '',
        weightBefore: '', weightAfter: '', ticketNo: '', ticketDate: '', poNo: '',
        faceQty: '', actualQty: '', weightBeforeUnload: '', weightAfterUnload: '',
        waitDiscount: false, cannotUnload: false, planArrival: '', customerPlanTime: '',
        waitStartTime: '', unloadStartTime: '', remarks: '',
        receiveDocTime: '', startLoadTime: '', finishLoadTime: '', ticketReceiveTime: '',
        startUnloadTime: '', finishUnloadTime: '',
        waitingUnload: false, cannotUnloadNgv: false,
        compartments: Array.from({ length: 18 }, () => ({
          beforeValue: '', beforePsiKg: '',
          afterValue: '', afterPsiKg: '',
        })),
        containers: [{ booking: '', agent: '', containerNo: '', seal: '', size: '', type: '', status: '' }],
      };
      return next;
    });
    setValidation(null);
  };

  const inputClass = 'w-full border border-border rounded px-2.5 py-1.5 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted';

  const isLoadStage = data.stageType === 'load';
  const isCustomerStage = data.stageType === 'cust' || stage.type === 'customer' || stage.type === 'delivery';
  const isLocked = stage.status === 'completed';
  const product = shipment.product;
  const isFuel = product === 'FUEL';
  const isLpgChem = product === 'LPG' || product === 'CHEM';
  const isNgv = product === 'NGV';
  const isSca = product === 'SCA';
  const isSpl = product === 'CONTAINER';
  const isEmptyLoad = isNgv || isSca || isSpl; // These products show only load header, no fields

  const updateCompartment = (index, field, value) => {
    setStageData(prev => {
      const next = [...prev];
      const comps = [...next[currentStage].compartments];
      comps[index] = { ...comps[index], [field]: value };
      next[currentStage] = { ...next[currentStage], compartments: comps };
      return next;
    });
  };

  const updateContainer = (index, field, value) => {
    setStageData(prev => {
      const next = [...prev];
      const ctrs = [...next[currentStage].containers];
      ctrs[index] = { ...ctrs[index], [field]: value };
      next[currentStage] = { ...next[currentStage], containers: ctrs };
      return next;
    });
  };

  const addContainer = () => {
    if (data.containers.length >= 2) return;
    setStageData(prev => {
      const next = [...prev];
      next[currentStage] = {
        ...next[currentStage],
        containers: [...next[currentStage].containers, { booking: '', agent: '', containerNo: '', seal: '', size: '', type: '', status: '' }],
      };
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Type-specific info strip */}
      <div
        className="rounded-lg px-4 py-3 flex items-center gap-3 border"
        style={{ backgroundColor: typeInfo.bg, borderColor: typeInfo.color + '40', color: typeInfo.color }}
      >
        <span className="text-2xl">{typeInfo.icon}</span>
        <div>
          <div className="font-semibold text-sm">{productConfig[shipment.product]?.label || shipment.product} Transport</div>
          <div className="text-xs opacity-80">{t(typeInfo.descKey)}</div>
        </div>
      </div>

      {/* Stage Chips Bar */}
      <div className="flex gap-2 flex-wrap">
        {shipment.stages.map((s, i) => {
          const isActive = i === currentStage;
          const isCompleted = s.status === 'completed';
          let chipClass = 'px-3 py-1.5 rounded-full text-table font-medium transition-all cursor-pointer border ';
          if (isActive) {
            chipClass += 'bg-primary text-white border-primary shadow-sm';
          } else if (isCompleted) {
            chipClass += 'bg-green-50 text-green-700 border-green-300';
          } else {
            chipClass += 'bg-gray-100 text-text-sec border-gray-200';
          }
          return (
            <button
              key={i}
              onClick={() => { setCurrentStage(i); setValidation(null); }}
              className={chipClass}
            >
              {isCompleted && !isActive && <span className="mr-1">{'✓'}</span>}
              {t('stage.chip.stage')} {s.n ?? s.no}: {s.from || s.origin} {'→'} {s.to || s.dest}
            </button>
          );
        })}
      </div>

      {/* Stage Navigator with Back/Next + Stage Type dropdown */}
      <div className="flex items-center justify-between bg-bg rounded-lg p-3">
        <button
          onClick={() => { setCurrentStage(Math.max(0, currentStage - 1)); setValidation(null); }}
          disabled={currentStage === 0}
          className="px-3 py-1.5 rounded text-table text-primary hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {'←'} {t('common.back')}
        </button>
        <div className="flex items-center gap-3">
          <span className="text-table font-semibold text-text">
            {t('stage.chip.stage')} {stage.n ?? stage.no}: {stage.from || stage.origin} {'→'} {stage.to || stage.dest}
          </span>
          <span className="text-label text-text-sec">({data.stdDistance} km)</span>
          <select
            value={data.stageType}
            onChange={e => updateField('stageType', e.target.value)}
            className="border border-border rounded px-2 py-1 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {stageTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setCurrentStage(Math.min(shipment.stages.length - 1, currentStage + 1)); setValidation(null); }}
          disabled={currentStage === shipment.stages.length - 1}
          className="px-3 py-1.5 rounded text-table text-primary hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {t('stage.nav.next')} {'→'}
        </button>
      </div>

      {/* R105: Stage type change warning */}
      {stageTypeWarning && (
        <div className="rounded-lg px-4 py-2.5 flex items-center gap-2 border border-amber-300 bg-amber-50">
          <span className="text-lg">{'⚠️'}</span>
          <span className="text-xs text-amber-800">{stageTypeWarning}</span>
          <button onClick={() => setStageTypeWarning(null)} className="ml-auto text-amber-600 hover:text-amber-800 text-xs font-bold">&times;</button>
        </div>
      )}

      {/* Data Source Selector */}
      <div className="flex items-center gap-3">
        <label className="text-table font-medium text-text-sec">{t('stage.form.dataSource')}:</label>
        <select
          value={dataSource}
          onChange={e => setDataSource(e.target.value)}
          className="border border-border rounded px-3 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {dataSourceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
          ))}
        </select>
      </div>

      {/* Locked Stage Banner */}
      {isLocked && (
        <div className="rounded-lg px-4 py-3 flex items-center gap-2 border-2 border-green-400 bg-green-50">
          <span className="text-xl">{'🔒'}</span>
          <div>
            <div className="text-sm font-semibold text-green-800">{t('stage.locked.title') || 'Stage Completed & Locked'}</div>
            <div className="text-xs text-green-600">{t('stage.locked.desc') || 'This stage has been validated and saved. Fields are read-only.'}</div>
          </div>
        </div>
      )}

      {/* Default Fields -- 3 columns */}
      <div>
        <h4 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.section.locationDistance')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">
              {t('stage.form.origin')} <span className="text-error">*</span>
            </label>
            <input value={data.origin} disabled className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">
              {t('stage.form.destination')} <span className="text-error">*</span>
            </label>
            <input value={data.destination} disabled className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('stage.form.stdDistance')}</label>
            <div className="relative">
              <input value={data.stdDistance} disabled className={inputClass + ' pr-10'} />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Datetime Fields -- 2 columns */}
      <div>
        <h4 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.section.dateTime')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">
              {t('stage.form.departure')} <span className="text-error">*</span>
            </label>
            <input type="datetime-local" value={data.departureTime} onChange={e => updateField('departureTime', e.target.value)} disabled={isLocked} className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">
              {t('stage.form.arrival')} <span className="text-error">*</span>
            </label>
            <input type="datetime-local" value={data.arrivalTime} onChange={e => updateField('arrivalTime', e.target.value)} disabled={isLocked} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Miles Fields -- 4 columns */}
      <div>
        <h4 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.section.mileage')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">
              {t('stage.form.milesStart')} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={data.milesStart}
                onChange={e => updateField('milesStart', e.target.value)}
                disabled={isLocked}
                className={inputClass + ' pr-10'}
                placeholder="0"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
            </div>
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">
              {t('stage.form.milesEnd')} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={data.milesEnd}
                onChange={e => updateField('milesEnd', e.target.value)}
                disabled={isLocked}
                className={inputClass + ' pr-10'}
                placeholder="0"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
            </div>
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('stage.form.gpsDistance')}</label>
            <div className="relative">
              <input
                type="number"
                value={data.gpsDistance}
                onChange={e => updateField('gpsDistance', e.target.value)}
                disabled={isLocked}
                className={inputClass + ' pr-10'}
                placeholder="GPS"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
            </div>
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('stage.form.actualDistance')}</label>
            <div className="relative">
              <input
                value={actualDistance != null ? actualDistance : '—'}
                disabled
                className={inputClass + ' pr-10 font-bold'}
                style={actualDistance != null ? { backgroundColor: '#f0fdf4', color: '#16a34a' } : {}}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Strip */}
      {validation && (
        <InfoStrip variant={validation.passed ? 'success' : 'error'} icon={validation.passed ? '✅' : '❌'}>
          <div className="font-medium">{validation.passed ? t('stage.validation.passed') : t('stage.validation.failed')}</div>
          {validation.violations.map((v, i) => (
            <div key={i} className="text-label mt-1">{t('stage.validation.rule')} {v.rule}: {v.message}</div>
          ))}
          {validation.bypassed && (
            <div className="text-label mt-1 font-medium" style={{ color: '#d97706' }}>
              {'⚠️'} {t('stage.validation.bypassActive')}
            </div>
          )}
        </InfoStrip>
      )}

      {/* Conditional: Load Section */}
      {isLoadStage && (
        <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: '#f97316' }}>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#ea580c' }}>
            {'🏭'} {t('stage.loading.sectionHeader')}
          </h4>

          {/* LPG/CHEM: Standard weight fields */}
          {isLpgChem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">
                  {t('stage.loading.weightBefore')} <span className="text-error">*</span>
                </label>
                <input type="number" value={data.weightBefore} onChange={e => updateField('weightBefore', e.target.value)} disabled={isLocked} className={inputClass} placeholder="kg" />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.loading.weightAfter')}</label>
                <input type="number" value={data.weightAfter} onChange={e => updateField('weightAfter', e.target.value)} disabled={isLocked} className={inputClass} placeholder="kg" />
              </div>
            </div>
          )}

          {/* FUEL: Only 4 datetime fields */}
          {isFuel && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.receiveDocTime')}</label>
                <input type="datetime-local" value={data.receiveDocTime} onChange={e => updateField('receiveDocTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.startLoadTime')}</label>
                <input type="datetime-local" value={data.startLoadTime} onChange={e => updateField('startLoadTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.finishLoadTime')}</label>
                <input type="datetime-local" value={data.finishLoadTime} onChange={e => updateField('finishLoadTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.ticketReceiveTime')}</label>
                <input type="datetime-local" value={data.ticketReceiveTime} onChange={e => updateField('ticketReceiveTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
            </div>
          )}

          {/* NGV/SCA/SPL: Empty — just header, no fields */}
          {isEmptyLoad && (
            <div className="text-xs text-text-muted italic">{t('stage.loading.noFields')}</div>
          )}
        </div>
      )}

      {/* Conditional: Customer Section — Product-specific */}
      {isCustomerStage && (
        <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: '#22c55e' }}>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#16a34a' }}>
            {'👤'} {t('stage.customer.sectionHeader')}
          </h4>

          {/* ===== LPG/CHEM: Full standard customer fields ===== */}
          {isLpgChem && (<>
            {/* Ticket Fields */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.customer.ticketInfo')}</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.ticketDocNo')} <span className="text-error">*</span></label>
                  <input value={data.ticketNo} onChange={e => updateField('ticketNo', e.target.value)} disabled={isLocked} className={inputClass} placeholder="Ticket No." />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.ticketDocDate')} <span className="text-error">*</span></label>
                  <input type="date" value={data.ticketDate} onChange={e => updateField('ticketDate', e.target.value)} disabled={isLocked} className={inputClass} />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.customer.poNo')}</label>
                  <input value={data.poNo} onChange={e => updateField('poNo', e.target.value)} disabled={isLocked} className={inputClass} placeholder={t('stage.customer.poPlaceholder')} />
                </div>
              </div>
            </div>
            {/* Quantity Fields */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.customer.quantity')}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.faceQty')} <span className="text-error">*</span></label>
                  <input type="number" value={data.faceQty} onChange={e => updateField('faceQty', e.target.value)} disabled={isLocked} className={inputClass} placeholder="Face Qty" />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.actualQty')} <span className="text-error">*</span></label>
                  <input type="number" value={data.actualQty} onChange={e => updateField('actualQty', e.target.value)} disabled={isLocked} className={inputClass} placeholder="Actual Qty" />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.weightBeforeUnload')}</label>
                  <input type="number" value={data.weightBeforeUnload} onChange={e => updateField('weightBeforeUnload', e.target.value)} disabled={isLocked} className={inputClass} placeholder="kg" />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.weightAfterUnload')}</label>
                  <input type="number" value={data.weightAfterUnload} onChange={e => updateField('weightAfterUnload', e.target.value)} disabled={isLocked} className={inputClass} placeholder="kg" />
                </div>
              </div>
            </div>
            {/* Checkboxes */}
            <div className="mb-4 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data.waitDiscount} onChange={e => updateField('waitDiscount', e.target.checked)} disabled={isLocked} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-table text-text">{t('stage.fields.waitDiscount')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data.cannotUnload} onChange={e => updateField('cannotUnload', e.target.checked)} disabled={isLocked} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-table text-text">{t('stage.fields.cannotUnload')}</span>
              </label>
            </div>
            {/* Timing — Plan Arrival removed per v3 */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.customer.timing')}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.customerPlanTime')}</label>
                  <input type="datetime-local" value={data.customerPlanTime} onChange={e => updateField('customerPlanTime', e.target.value)} disabled={isLocked} className={inputClass} />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.waitStartTime')}</label>
                  <input type="datetime-local" value={data.waitStartTime} onChange={e => updateField('waitStartTime', e.target.value)} disabled={isLocked} className={inputClass} />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.unloadStartTime')}</label>
                  <input type="datetime-local" value={data.unloadStartTime} onChange={e => updateField('unloadStartTime', e.target.value)} disabled={isLocked} className={inputClass} />
                </div>
              </div>
            </div>
            {/* Remarks */}
            <div className="mb-4">
              <label className="block text-label font-medium text-text-sec mb-1">{t('stage.customer.remarks')}</label>
              <textarea value={data.remarks} onChange={e => updateField('remarks', e.target.value)} disabled={isLocked} rows={3} className={inputClass} placeholder={t('stage.customer.remarksPlaceholder')} />
            </div>
            {/* Compartment Pressure Table — 4-column layout */}
            <div>
              <h5 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.fields.compartmentPressure')}</h5>
              <div className="overflow-x-auto border border-border-light rounded">
                <table className="w-full text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th rowSpan={2} className="px-2 py-1.5 bg-gray-50 w-8">{t('stage.fields.compartmentNo')}</th>
                      <th colSpan={2} className="px-2 py-1.5 text-center" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>{t('stage.fields.beforeSection')}</th>
                      <th colSpan={2} className="px-2 py-1.5 text-center" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>{t('stage.fields.afterSection')}</th>
                    </tr>
                    <tr className="border-b border-border">
                      <th className="px-2 py-1" style={{ backgroundColor: '#f0fdf4' }}>{t('stage.fields.pressureWeightTemp')}</th>
                      <th className="px-2 py-1" style={{ backgroundColor: '#f0fdf4' }}>PSI / KG</th>
                      <th className="px-2 py-1" style={{ backgroundColor: '#fff7ed' }}>{t('stage.fields.pressureWeightTemp')}</th>
                      <th className="px-2 py-1" style={{ backgroundColor: '#fff7ed' }}>PSI / KG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.compartments.map((comp, i) => (
                      <tr key={i} className="border-b border-border-light">
                        <td className="text-center px-2 py-1 bg-gray-50 font-semibold">{i + 1}</td>
                        <td className="px-1 py-1" style={{ backgroundColor: '#f0fdf408' }}>
                          <input type="number" value={comp.beforeValue} onChange={e => updateCompartment(i, 'beforeValue', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full" placeholder="0" />
                        </td>
                        <td className="px-1 py-1" style={{ backgroundColor: '#f0fdf408' }}>
                          <input type="number" value={comp.beforePsiKg} onChange={e => updateCompartment(i, 'beforePsiKg', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full" placeholder="0" />
                        </td>
                        <td className="px-1 py-1" style={{ backgroundColor: '#fff7ed08' }}>
                          <input type="number" value={comp.afterValue} onChange={e => updateCompartment(i, 'afterValue', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full" placeholder="0" />
                        </td>
                        <td className="px-1 py-1" style={{ backgroundColor: '#fff7ed08' }}>
                          <input type="number" value={comp.afterPsiKg} onChange={e => updateCompartment(i, 'afterPsiKg', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full" placeholder="0" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>)}

          {/* ===== FUEL: Only 2 datetime fields ===== */}
          {isFuel && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.startUnloadTime')}</label>
                <input type="datetime-local" value={data.startUnloadTime} onChange={e => updateField('startUnloadTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.finishUnloadTime')}</label>
                <input type="datetime-local" value={data.finishUnloadTime} onChange={e => updateField('finishUnloadTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
            </div>
          )}

          {/* ===== NGV: Checkboxes + 3 fields ===== */}
          {isNgv && (<>
            <div className="mb-4 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data.waitingUnload} onChange={e => updateField('waitingUnload', e.target.checked)} disabled={isLocked} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-table text-text">{t('stage.fields.waitingUnload')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data.cannotUnloadNgv} onChange={e => updateField('cannotUnloadNgv', e.target.checked)} disabled={isLocked} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-table text-text">{t('stage.fields.cannotUnloadNgv')}</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.waitStartTime')}</label>
                <input type="datetime-local" value={data.waitStartTime} onChange={e => updateField('waitStartTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.unloadStartTime')}</label>
                <input type="datetime-local" value={data.unloadStartTime} onChange={e => updateField('unloadStartTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-label font-medium text-text-sec mb-1">{t('stage.customer.remarks')}</label>
              <textarea value={data.remarks} onChange={e => updateField('remarks', e.target.value)} disabled={isLocked} rows={3} className={inputClass} placeholder={t('stage.customer.remarksPlaceholder')} />
            </div>
          </>)}

          {/* ===== SCA: Only 3 fields ===== */}
          {isSca && (<>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.waitStartTime')}</label>
                <input type="datetime-local" value={data.waitStartTime} onChange={e => updateField('waitStartTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.unloadStartTime')}</label>
                <input type="datetime-local" value={data.unloadStartTime} onChange={e => updateField('unloadStartTime', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-label font-medium text-text-sec mb-1">{t('stage.customer.remarks')}</label>
              <textarea value={data.remarks} onChange={e => updateField('remarks', e.target.value)} disabled={isLocked} rows={3} className={inputClass} placeholder={t('stage.customer.remarksPlaceholder')} />
            </div>
          </>)}

          {/* ===== SPL: Only container sub-table ===== */}
          {isSpl && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-semibold text-text-sec uppercase tracking-wide">{t('stage.customer.containerHeader')}</h5>
                {data.containers.length < 2 && !isLocked && (
                  <button onClick={addContainer} className="text-xs px-2 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50">+ {t('stage.fields.addContainer')}</button>
                )}
              </div>
              <div className="overflow-x-auto border border-border-light rounded">
                <table className="w-full text-xs">
                  <thead><tr className="bg-gray-50 border-b border-border">
                    <th className="px-2 py-1.5">Booking</th>
                    <th className="px-2 py-1.5">Agent</th>
                    <th className="px-2 py-1.5">Container No.</th>
                    <th className="px-2 py-1.5">Seal No.</th>
                    <th className="px-2 py-1.5">Size</th>
                    <th className="px-2 py-1.5">Type</th>
                    <th className="px-2 py-1.5">Status</th>
                  </tr></thead>
                  <tbody>
                    {data.containers.map((ctr, i) => (
                      <tr key={i} className="border-b border-border-light">
                        <td className="px-1 py-1"><input type="text" value={ctr.booking} onChange={e => updateContainer(i, 'booking', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full" /></td>
                        <td className="px-1 py-1"><input type="text" value={ctr.agent} onChange={e => updateContainer(i, 'agent', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full" /></td>
                        <td className="px-1 py-1"><input type="text" value={ctr.containerNo} onChange={e => updateContainer(i, 'containerNo', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full" /></td>
                        <td className="px-1 py-1"><input type="text" value={ctr.seal} onChange={e => updateContainer(i, 'seal', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full" /></td>
                        <td className="px-1 py-1">
                          <select value={ctr.size} onChange={e => updateContainer(i, 'size', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full">
                            <option value="">—</option><option value="20ft">20ft</option><option value="40ft">40ft</option><option value="40ft HC">40ft HC</option><option value="45ft">45ft</option>
                          </select>
                        </td>
                        <td className="px-1 py-1">
                          <select value={ctr.type} onChange={e => updateContainer(i, 'type', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full">
                            <option value="">—</option><option value="FCL">FCL</option><option value="LCL">LCL</option><option value="Dry">Dry</option><option value="Reefer">Reefer</option>
                          </select>
                        </td>
                        <td className="px-1 py-1">
                          <select value={ctr.status} onChange={e => updateContainer(i, 'status', e.target.value)} disabled={isLocked} className="border border-border rounded px-1 py-0.5 text-xs w-full">
                            <option value="">—</option><option value="Loaded">Loaded</option><option value="Empty">Empty</option><option value="Damaged">Damaged</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!isLocked && (
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={handleSimulateMobile}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg transition-colors"
        >
          {'📱'} {t('stage.actions.simulateMobile')}
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg transition-colors"
        >
          {'🔄'} {t('stage.actions.clear')}
        </button>
        <button
          onClick={handleCheckMiles}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-blue-300 text-table text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          {'🔍'} {t('stage.actions.checkMiles')}
        </button>
        <button
          onClick={handleSaveStage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-white text-table hover:bg-primary-hover transition-colors"
        >
          {'💾'} {t('stage.actions.saveStage')}
        </button>
      </div>
      )}
    </div>
  );
}
