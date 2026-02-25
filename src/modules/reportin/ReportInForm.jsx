import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { ProductBadge, StatusBadge } from '../../components/common/Badge';
import StageEntry from './StageEntry';
import TugStagesTab from './TugStagesTab';
import ExpenseTab from './ExpenseTab';
import FuelTab from './FuelTab';
import ParkingTab from './ParkingTab';
import ReviewTab from './ReviewTab';

// Shared cost state lifted to form level so ReviewTab can read actuals
const useCostState = () => {
  const [costs, setCosts] = useState({ expenses: 0, fuel: 0, parking: 0, receiptsWithReceipt: 0, receiptsTotal: 0 });
  return { costs, setCosts };
};

const innerTabs = [
  { key: 'vehicleInfo',  icon: '🚛', labelKey: 'reportIn.form.vehicleInfo' },
  { key: 'stages',       icon: '📍', labelKey: 'reportIn.form.stages' },
  { key: 'expenses',     icon: '💰', labelKey: 'reportIn.form.expenses' },
  { key: 'fuel',         icon: '⛽',        labelKey: 'reportIn.form.fuel' },
  { key: 'parking',      icon: '🅿️', labelKey: 'reportIn.form.parking' },
  { key: 'reviewClose',  icon: '✅', labelKey: 'reportIn.form.reviewClose' },
];

export default function ReportInForm({ shipment, onBack }) {
  const { t } = useLanguage();
  const { dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('vehicleInfo');
  const { costs, setCosts } = useCostState();

  // Vehicle info state
  const [vehicleData, setVehicleData] = useState({
    driver: shipment.driver || '',
    driverId: shipment.driverId || '',
    vehiclePlate: shipment.plate || '',
    trailer: shipment.trailer || '',
    vehicleType: shipment.vehicleType || '',
    vehicleAge: shipment.vehicleAge != null && shipment.vehicleAge <= 8 ? 'lte8' : 'gt8',
    odometerStart: shipment.lastTruckMiles || 0,
    odometerEnd: '',
    lastTruckMiles: shipment.lastTruckMiles || 0,
    milesSource: 'SAP',
  });

  const handleSubmit = () => {
    dispatch({ type: 'SUBMIT_FOR_REVIEW', payload: shipment.id });
    window.alert(t('reportIn.submitSuccess') || 'Report-In submitted for review.');
    onBack();
  };

  const handleSaveDraft = () => {
    dispatch({ type: 'SAVE_REPORT_IN_DRAFT', payload: shipment.id });
    window.alert(t('reportIn.draftSaved') || 'Draft saved.');
  };

  const handleApprove = () => {
    // Mark completed and generate awaiting settlement rows
    dispatch({ type: 'COMPLETE_REPORT_IN', payload: shipment.id });
    // Create awaiting settlement rows from completed stages
    const customerStages = shipment.stages?.filter(s =>
      s.type === 'customer' || s.type === 'delivery' || s.type === 'cust'
    ) || [];
    if (customerStages.length > 0) {
      const awaitingRows = customerStages.map((s, i) => ({
        id: `AW-${shipment.id}-${i}`,
        shipmentNo: shipment.shipmentNo || shipment.id,
        stage: `S${s.n ?? s.no ?? i + 1}`,
        product: shipment.product,
        soldTo: s.soldTo || shipment.customer || '',
        soldToName: s.soldToName || shipment.customer || '',
        shipTo: s.shipToCode || '',
        shipToName: s.shipToName || s.to || s.dest || '',
        ticketQty: s.faceQty || 0,
        actualQty: s.actualQty || 0,
        billingQty: s.actualQty || 0,
        billingDist: s.stdDistance || s.stdDist || s.distance || 0,
        actualDist: s.milesEnd && s.milesStart ? s.milesEnd - s.milesStart : 0,
        cannotUnload: s.cannotUnload || false,
        plate: shipment.plate || '',
        driver: shipment.driver || '',
        vehicleType: shipment.vehicleType || '',
        vehicleAge: shipment.vehicleAge || '',
        custDoc: s.custDoc || '',
        docDate: s.docDate || '',
        wbs: s.wbs || shipment.wbs || '',
        site: s.site || shipment.bu || '',
        status: 'awaiting',
      }));
      dispatch({ type: 'ADD_AWAITING_ROWS', payload: awaitingRows });
    }
    window.alert(t('reportIn.approveSuccess') || 'Report-In approved and closed.');
    onBack();
  };

  const handleReject = () => {
    dispatch({ type: 'REJECT_REPORT_IN', payload: shipment.id });
    window.alert(t('reportIn.rejectSuccess') || 'Report-In rejected. Driver must correct and resubmit.');
    onBack();
  };

  // C204: Re-edit after report-in (revert to in_progress)
  const handleReEdit = () => {
    dispatch({ type: 'SAVE_REPORT_IN_DRAFT', payload: shipment.id });
    window.alert('Report-In re-opened for editing. Status reverted to In Progress.');
  };

  const completedStages = shipment.stages?.filter(s => s.status === 'completed').length || 0;
  const totalStages = shipment.stages?.length || 0;

  return (
    <div className="space-y-4">
      {/* Header with breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={onBack} className="text-primary hover:text-primary-hover text-sm font-medium">
            {`← ${t('common.backToList')}`}
          </button>
          <span className="text-text-sec">/</span>
          <h1 className="text-lg font-bold text-text">{t('reportIn.formTitle')}: {shipment.shipmentNo}</h1>
          <ProductBadge product={shipment.product} />
          <StatusBadge status={shipment.status} />
        </div>
      </div>

      {/* Summary Strip with gradient background */}
      <div
        className="rounded-lg p-4 flex flex-wrap gap-6 text-table"
        style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)' }}
      >
        <div>
          <span className="text-text-sec text-xs uppercase tracking-wide">{t('reportIn.form.summaryStrip.route')}</span>
          <div className="font-semibold text-text">{shipment.routeName}</div>
        </div>
        <div>
          <span className="text-text-sec text-xs uppercase tracking-wide">{t('reportIn.form.summaryStrip.driver')} ({t('shipments.table.truck')})</span>
          <div className="font-semibold text-text">{shipment.driver} <span className="text-text-sec">({shipment.plate})</span></div>
        </div>
        <div>
          <span className="text-text-sec text-xs uppercase tracking-wide">{t('reportIn.form.summaryStrip.vehicle')}</span>
          <div className="font-semibold text-text">{shipment.vehicleType}</div>
        </div>
        <div>
          <span className="text-text-sec text-xs uppercase tracking-wide">{t('reportIn.form.summaryStrip.customer')}</span>
          <div className="font-semibold text-text">{shipment.customer}</div>
        </div>
        <div>
          <span className="text-text-sec text-xs uppercase tracking-wide">{t('reportIn.form.summaryStrip.lastTruckMiles')}</span>
          <div className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded inline-block">
            {'⚠️'} {shipment.lastTruckMiles?.toLocaleString()} km
          </div>
        </div>
        <div>
          <span className="text-text-sec text-xs uppercase tracking-wide">{t('reportIn.form.stages')}</span>
          <div className="font-semibold text-text">{completedStages} / {totalStages}</div>
        </div>
      </div>

      {/* R151: Per-stage report-in buttons */}
      {shipment.stages?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-text-sec uppercase tracking-wide mr-1">Stage Report-In:</span>
          {shipment.stages.map((s, i) => {
            const isComplete = s.status === 'completed';
            return (
              <button key={i}
                onClick={() => { setActiveTab('stages'); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isComplete
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                }`}>
                {isComplete ? '✓ ' : ''}{`S${s.n ?? s.no ?? i + 1}: ${s.from || s.origin || ''} → ${s.to || s.dest || ''}`}
              </button>
            );
          })}
        </div>
      )}

      {/* 6 Inner Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {innerTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-table border-b-2 transition-colors whitespace-nowrap
              ${activeTab === tab.key
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-text-sec hover:text-text'}`}
          >
            <span>{tab.icon}</span> {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-border-light shadow-sm p-4">
        {activeTab === 'vehicleInfo' && (
          <VehicleInfoTab
            shipment={shipment}
            vehicleData={vehicleData}
            setVehicleData={setVehicleData}
          />
        )}
        {activeTab === 'stages' && (
          shipment.product === 'TUG'
            ? <TugStagesTab shipment={shipment} />
            : <StageEntry shipment={shipment} />
        )}
        {activeTab === 'expenses' && <ExpenseTab shipment={shipment} onTotalChange={(total, receiptInfo) => setCosts(prev => ({ ...prev, expenses: total, ...(receiptInfo || {}) }))} allCosts={costs} />}
        {activeTab === 'fuel' && <FuelTab shipment={shipment} onTotalChange={(total) => setCosts(prev => ({ ...prev, fuel: total }))} />}
        {activeTab === 'parking' && <ParkingTab shipment={shipment} onTotalChange={(total) => setCosts(prev => ({ ...prev, parking: total }))} />}
        {activeTab === 'reviewClose' && <ReviewTab shipment={shipment} costs={costs} />}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-4 bg-white border border-border rounded-lg py-3 px-4 flex items-center justify-between shadow-lg z-10">
        <div className="text-table text-text-sec">
          {t('common.status.label')}: <span className="font-medium text-text">{shipment.riStatus === 'in_progress' ? t('reportIn.status.draftInProgress') : shipment.riStatus === 'awaiting' ? t('reportIn.status.awaitingEntry') : shipment.riStatus}</span>
          <span className="mx-2">|</span>
          {t('reportIn.form.stages')}: {completedStages}/{totalStages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg transition-colors"
          >
            {t('common.saveDraft')}
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded bg-primary text-white text-table hover:bg-primary-hover transition-colors"
          >
            {t('common.submitForReview')}
          </button>
          {/* C204: Re-edit button for rejected/submitted status */}
          {(shipment.riStatus === 'rejected' || shipment.riStatus === 'pending_review') && (
            <button
              onClick={handleReEdit}
              className="px-4 py-1.5 rounded border border-orange-400 text-orange-700 text-table hover:bg-orange-50 transition-colors"
            >
              Re-Edit
            </button>
          )}
          {/* Shown for reviewers when status is pending_review */}
          {shipment.riStatus === 'pending_review' && (
            <>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 rounded bg-red-500 text-white text-table hover:bg-red-600 transition-colors"
              >
                {t('common.reject')}
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-1.5 rounded bg-success text-white text-table hover:bg-green-700 transition-colors"
              >
                {t('common.approveClose')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Vehicle Info Tab
   ============================================================ */
function VehicleInfoTab({ shipment, vehicleData, setVehicleData }) {
  const { t } = useLanguage();
  const updateField = (field, value) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const inputClass = 'w-full border border-border rounded px-2.5 py-1.5 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted';

  return (
    <div className="space-y-6">
      {/* Vehicle & Driver Fields -- 5 columns */}
      <div>
        <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-1.5">
          {'🚛'} {t('reportIn.vehicleInfo.sectionHeader')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.driver')}</label>
            <input value={vehicleData.driver} disabled className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.driverId')}</label>
            <input value={vehicleData.driverId} disabled className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.vehiclePlate')}</label>
            <input value={vehicleData.vehiclePlate} onChange={e => updateField('vehiclePlate', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.trailer')}</label>
            <input value={vehicleData.trailer} onChange={e => updateField('trailer', e.target.value)} className={inputClass} placeholder={t('reportIn.vehicleInfo.trailerPlaceholder')} />
          </div>
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.vehicleType')}</label>
            <input value={vehicleData.vehicleType} disabled className={inputClass} />
          </div>
        </div>
      </div>

      {/* Second Row -- 5 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.vehicleAge')}</label>
          <select value={vehicleData.vehicleAge} onChange={e => updateField('vehicleAge', e.target.value)} className={inputClass}>
            <option value="lte8">{'≤'} 8 {'ปี'}</option>
            <option value="gt8">&gt; 8 {'ปี'}</option>
          </select>
        </div>
        <div>
          <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.odometerStart')}</label>
          <div className="relative">
            <input
              type="number"
              value={vehicleData.odometerStart}
              onChange={e => updateField('odometerStart', e.target.value)}
              className={inputClass + ' pr-10'}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
          </div>
        </div>
        <div>
          <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.odometerEnd')}</label>
          <div className="relative">
            <input
              type="number"
              value={vehicleData.odometerEnd}
              onChange={e => updateField('odometerEnd', e.target.value)}
              className={inputClass + ' pr-10'}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
          </div>
        </div>
        <div>
          <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.lastTruckMiles')}</label>
          <div
            className="rounded px-2.5 py-1.5 text-table font-bold border-2"
            style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b', color: '#92400e' }}
          >
            {'⚠️'} {vehicleData.lastTruckMiles?.toLocaleString()} km
          </div>
        </div>
        <div>
          <label className="block text-label font-medium text-text-sec mb-1">{t('reportIn.vehicleInfo.milesSource')}</label>
          <select value={vehicleData.milesSource} onChange={e => updateField('milesSource', e.target.value)} className={inputClass}>
            <option value="SAP">SAP</option>
            <option value="GPS">GPS</option>
            <option value="Manual">{t('reportIn.vehicleInfo.manual')}</option>
          </select>
        </div>
      </div>

      {/* Miles Checking Config Panel -- red border */}
      <div className="border-2 rounded-lg p-4" style={{ borderColor: '#ef4444' }}>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#ef4444' }}>
          {'🚨'} {t('reportIn.form.milesConfig')}
        </h4>
        <div className="space-y-0">
          <ConfigRow
            rule="001"
            desc="First stage start miles vs Last Truck Miles tolerance"
            value="50 km"
            detail="| milesStart - lastTruckMiles | must be ≤ 50 km"
          />
          <ConfigRow
            rule="002"
            desc="Stage-to-stage gap tolerance (previous end vs current start)"
            value="10 km"
            detail="| prevStage.milesEnd - currStage.milesStart | must be ≤ 10 km"
          />
          <ConfigRow
            rule="003"
            desc="Distance variance tolerance (actual vs standard distance)"
            value="15%"
            detail="| (actualDist - stdDist) / stdDist | must be ≤ 15%"
          />
          <ConfigRow
            rule="004"
            desc="Dummy route distance tolerance (stdDistance = 0)"
            value="100 km"
            detail="Actual distance on zero-std routes must be ≤ 100 km"
          />
          <ConfigRow
            rule="005"
            desc="Broken miles bypass mode"
            value="Enabled"
            detail="When enabled, violations produce warnings instead of hard blocks"
          />
        </div>
      </div>
    </div>
  );
}

function ConfigRow({ rule, desc, value, detail }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-2 border-b border-border-light last:border-0 hover:bg-red-50/30 transition-colors rounded">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-mono font-bold"
          style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}
        >
          {rule}
        </span>
        <div>
          <div className="text-table font-medium text-text">{desc}</div>
          {detail && <div className="text-label text-text-sec mt-0.5">{detail}</div>}
        </div>
      </div>
      <span className="font-bold text-table text-text ml-4 whitespace-nowrap">{value}</span>
    </div>
  );
}
