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

  const updateField = (field, value) => {
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
    if (isCustomerStage) {
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

    dispatch({
      type: 'UPDATE_STAGE',
      payload: {
        shipmentId: shipment.id,
        stageIndex: currentStage,
        data: {
          milesStart: Number(data.milesStart) || null,
          milesEnd: Number(data.milesEnd) || null,
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
        },
      },
    });
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
      };
      return next;
    });
    setValidation(null);
  };

  const inputClass = 'w-full border border-border rounded px-2.5 py-1.5 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted';

  const isLoadStage = data.stageType === 'load' || currentStage === 0;
  const isCustomerStage = stage.type === 'delivery' || data.stageType === 'cust';
  const isLocked = stage.status === 'completed';

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
        </div>
      )}

      {/* Conditional: Customer Section */}
      {isCustomerStage && (
        <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: '#22c55e' }}>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#16a34a' }}>
            {'👤'} {t('stage.customer.sectionHeader')}
          </h4>

          {/* Ticket Fields */}
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.customer.ticketInfo')}</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">
                  {t('stage.fields.ticketDocNo')} <span className="text-error">*</span>
                </label>
                <input value={data.ticketNo} onChange={e => updateField('ticketNo', e.target.value)} disabled={isLocked} className={inputClass} placeholder="Ticket No." />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">
                  {t('stage.fields.ticketDocDate')} <span className="text-error">*</span>
                </label>
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
                <label className="block text-label font-medium text-text-sec mb-1">
                  {t('stage.fields.faceQty')} <span className="text-error">*</span>
                </label>
                <input type="number" value={data.faceQty} onChange={e => updateField('faceQty', e.target.value)} disabled={isLocked} className={inputClass} placeholder="Face Qty" />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">
                  {t('stage.fields.actualQty')} <span className="text-error">*</span>
                </label>
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
              <input
                type="checkbox"
                checked={data.waitDiscount}
                onChange={e => updateField('waitDiscount', e.target.checked)}
                disabled={isLocked}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-table text-text">
                {t('stage.fields.waitDiscount')}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.cannotUnload}
                onChange={e => updateField('cannotUnload', e.target.checked)}
                disabled={isLocked}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-table text-text">
                {t('stage.fields.cannotUnload')}
              </span>
            </label>
          </div>

          {/* Time Fields */}
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-text-sec uppercase tracking-wide mb-2">{t('stage.customer.timing')}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('stage.fields.planArrival')}</label>
                <input type="datetime-local" value={data.planArrival} onChange={e => updateField('planArrival', e.target.value)} disabled={isLocked} className={inputClass} />
              </div>
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
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('stage.customer.remarks')}</label>
            <textarea
              value={data.remarks}
              onChange={e => updateField('remarks', e.target.value)}
              disabled={isLocked}
              rows={3}
              className={inputClass}
              placeholder={t('stage.customer.remarksPlaceholder')}
            />
          </div>
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
