import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { TUG_TIME_STAGES } from '../shipments/shipmentConstants';

const formatDuration = (startStr, endStr) => {
  if (!startStr || !endStr) return '—';
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diff = end - start;
  if (diff < 0 || isNaN(diff)) return '—';
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hrs}h ${mins}m`;
};

const formatDurationMinutes = (startStr, endStr) => {
  if (!startStr || !endStr) return 0;
  const diff = new Date(endStr) - new Date(startStr);
  return diff > 0 ? diff / 60000 : 0;
};

export default function TugStagesTab({ shipment }) {
  const { t } = useLanguage();
  const [activeReport, setActiveReport] = useState('actual'); // 'actual' | 'billing'

  // Initialize stages with start/end times for both actual and billing
  const [actualStages, setActualStages] = useState(() =>
    TUG_TIME_STAGES.map(s => ({ key: s.key, label: s.label, required: s.required, startTime: '', endTime: '', status: 'pending' }))
  );

  const [billingStages, setBillingStages] = useState(() =>
    TUG_TIME_STAGES.map(s => ({ key: s.key, label: s.label, required: s.required, startTime: '', endTime: '', status: 'pending' }))
  );

  const updateActualStage = (key, field, value) => {
    setActualStages(prev => {
      const updated = prev.map(s => s.key === key ? { ...s, [field]: value, status: 'recorded' } : s);
      // Auto-copy to billing
      setBillingStages(billing =>
        billing.map(b => b.key === key ? { ...b, [field]: value, status: 'recorded' } : b)
      );
      return updated;
    });
  };

  const updateBillingStage = (key, field, value) => {
    setBillingStages(prev => prev.map(s => s.key === key ? { ...s, [field]: value, status: 'recorded' } : s));
  };

  const recordNow = (key) => {
    const now = new Date().toISOString().slice(0, 16);
    updateActualStage(key, 'startTime', now);
  };

  // Calculate durations
  const actualDurations = useMemo(() => {
    return actualStages.map(s => ({
      key: s.key,
      duration: formatDuration(s.startTime, s.endTime),
      minutes: formatDurationMinutes(s.startTime, s.endTime),
    }));
  }, [actualStages]);

  const billingDurations = useMemo(() => {
    return billingStages.map(s => ({
      key: s.key,
      duration: formatDuration(s.startTime, s.endTime),
      minutes: formatDurationMinutes(s.startTime, s.endTime),
    }));
  }, [billingStages]);

  const totalActualMinutes = actualDurations.reduce((sum, d) => sum + d.minutes, 0);
  const totalBillingMinutes = billingDurations.reduce((sum, d) => sum + d.minutes, 0);

  const formatTotalDuration = (mins) => {
    const hrs = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${hrs}h ${m}m`;
  };

  const allActualRecorded = actualStages.filter(s => s.required).every(s => s.startTime && s.endTime);

  const stages = activeReport === 'actual' ? actualStages : billingStages;
  const updateFn = activeReport === 'actual' ? updateActualStage : updateBillingStage;
  const durations = activeReport === 'actual' ? actualDurations : billingDurations;
  const totalMinutes = activeReport === 'actual' ? totalActualMinutes : totalBillingMinutes;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-text">{t('tug.reportIn.title') || 'Report-In — Time Stages'}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          activeReport === 'actual'
            ? 'bg-orange-50 text-orange-600 border-orange-300'
            : 'bg-blue-50 text-blue-600 border-blue-300'
        }`}>
          {activeReport === 'actual' ? 'ACTUAL' : 'BILLING'}
        </span>
      </div>

      {/* Start Customer Report button */}
      {activeReport === 'actual' && (
        <button
          onClick={() => setActiveReport('billing')}
          className="px-4 py-2 rounded bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          {t('tug.reportIn.startCustomerReport') || 'Start Customer Report'}
        </button>
      )}

      {/* Tab toggle: Actual | Billing */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveReport('actual')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeReport === 'actual' ? 'border-primary text-primary' : 'border-transparent text-text-sec hover:text-text'
          }`}
        >
          {t('tug.reportIn.actualTab') || 'Actual'}
        </button>
        <button
          onClick={() => setActiveReport('billing')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeReport === 'billing' ? 'border-primary text-primary' : 'border-transparent text-text-sec hover:text-text'
          }`}
        >
          {t('tug.reportIn.billingTab') || 'Billing'}
        </button>
      </div>

      {/* All recorded message */}
      {allActualRecorded && activeReport === 'billing' && (
        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {t('tug.reportIn.allRecorded') || 'All stages recorded. Admin can review and close.'}
        </div>
      )}

      {/* Timeline Stages */}
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200"></div>

        {stages.map((stage, i) => {
          const dur = durations.find(d => d.key === stage.key);
          const hasData = stage.startTime || stage.endTime;
          const dotColor = hasData ? 'bg-green-500' : (stage.required ? 'bg-blue-500' : 'bg-gray-300');

          return (
            <div key={stage.key} className="relative mb-6 last:mb-0">
              {/* Dot */}
              <div className={`absolute -left-3 top-1 w-3 h-3 rounded-full ${dotColor} border-2 border-white shadow-sm`}></div>

              <div className="ml-4">
                {/* Stage label */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-text">{stage.label}</span>
                  <span className={`text-xs ${stage.required ? 'text-red-500 font-medium' : 'text-text-muted'}`}>
                    {stage.required ? 'Required' : 'Optional'}
                  </span>
                </div>

                {/* For actual tab - show Record Now button for first stage, or start/end display */}
                {activeReport === 'actual' && !hasData && stage.key === 'start' ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => recordNow(stage.key)}
                      className="px-4 py-1.5 rounded bg-primary text-white text-xs font-medium hover:bg-primary-hover"
                    >
                      {t('tug.reportIn.recordNow') || 'Record Now (Start Time)'}
                    </button>
                    <span className="text-xs text-text-muted">{t('tug.reportIn.orEnterManually') || 'Or enter manually:'}</span>
                    <input
                      type="datetime-local"
                      value={stage.startTime}
                      onChange={e => updateFn(stage.key, 'startTime', e.target.value)}
                      className="border border-border rounded px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => {}}
                      className="px-3 py-1 rounded border border-border text-xs hover:bg-gray-50"
                    >
                      {t('tug.reportIn.save') || 'Save'}
                    </button>
                  </div>
                ) : !hasData ? (
                  <span className="text-xs text-text-muted italic">Pending</span>
                ) : (
                  <div>
                    {/* Show start/end time info */}
                    <div className="text-xs text-text-muted mb-1">
                      {stage.startTime && `Start Time: ${new Date(stage.startTime).toLocaleString('en-GB')}`}
                      {stage.endTime && ` — End Time: ${new Date(stage.endTime).toLocaleString('en-GB')}`}
                    </div>
                    {/* Input fields */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="datetime-local"
                        value={stage.startTime}
                        onChange={e => updateFn(stage.key, 'startTime', e.target.value)}
                        className="border border-border rounded px-2 py-1 text-xs"
                      />
                      <input
                        type="datetime-local"
                        value={stage.endTime}
                        onChange={e => updateFn(stage.key, 'endTime', e.target.value)}
                        className="border border-border rounded px-2 py-1 text-xs"
                      />
                      {dur && dur.duration !== '—' && (
                        <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {dur.duration}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Duration Summary */}
      <div className="border-t border-border-light pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text">{t('tug.reportIn.totalDuration') || 'Total Duration'}:</span>
          </div>
          <div className="flex gap-4">
            <div className="px-3 py-1.5 rounded bg-orange-50 border border-orange-200">
              <span className="text-xs text-text-muted">Actual: </span>
              <span className="font-bold text-orange-700">{formatTotalDuration(totalActualMinutes)}</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-blue-50 border border-blue-200">
              <span className="text-xs text-text-muted">Billing: </span>
              <span className="font-bold text-blue-700">{formatTotalDuration(totalBillingMinutes)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
