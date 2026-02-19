import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../utils/helpers';
import InfoStrip from '../../components/common/InfoStrip';

const placeTypes = [
  { value: 'warehouse',  labelKey: 'parking.placeType.warehouse' },
  { value: 'factory',    labelKey: 'parking.placeType.factory' },
  { value: 'port',       labelKey: 'parking.placeType.port' },
  { value: 'depot',      labelKey: 'parking.placeType.depot' },
  { value: 'other',      labelKey: 'parking.placeType.other' },
];

export default function ParkingTab({ shipment, onTotalChange }) {
  const { t } = useLanguage();
  const [entries, setEntries] = useState([
    {
      id: 1,
      stage: 1,
      location: 'Rest Area Km.120',
      placeType: 'warehouse',
      start: '2026-02-19T08:00',
      end: '2026-02-19T10:00',
      reason: 'Mandatory rest / waiting for unload slot',
      amount: 100,
    },
  ]);

  const totalParking = useMemo(() =>
    entries.reduce((s, e) => s + (e.amount || 0), 0),
    [entries]
  );

  useEffect(() => { onTotalChange?.(totalParking); }, [totalParking, onTotalChange]);

  const addParking = () => {
    setEntries(prev => [...prev, {
      id: Date.now(),
      stage: 1,
      location: '',
      placeType: 'other',
      start: '',
      end: '',
      reason: '',
      amount: 0,
    }]);
  };

  const removeEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id));

  const updateEntry = (id, field, value) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e;
      const updated = { ...e, [field]: field === 'amount' || field === 'stage' ? Number(value) : value };
      // Auto-fill location from stage destination
      if (field === 'stage') {
        const stageObj = shipment.stages.find(s => s.no === Number(value) || s.n === Number(value));
        if (stageObj) {
          updated.location = stageObj.dest || stageObj.to || stageObj.destination || '';
        }
      }
      return updated;
    }));
  };

  const calcDuration = (start, end) => {
    if (!start || !end) return '—';
    const s = new Date(start);
    const e = new Date(end);
    const diffMs = e - s;
    if (diffMs <= 0) return '—';
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const inputClass = 'w-full border border-border rounded px-2 py-1 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className="space-y-5">
      {/* Info Strip */}
      <InfoStrip variant="info" icon={'🅿️'}>
        <span className="font-medium">{t('parking.infoStrip.title')}</span> {t('parking.infoStrip.body')}
      </InfoStrip>

      {/* Table */}
      <div className="overflow-x-auto border border-border-light rounded-lg">
        <table className="w-full text-table">
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-3 py-2.5 font-medium text-text-sec w-10">#</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec w-20">{t('parking.table.stage')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('parking.table.location')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('parking.table.type')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('parking.table.start')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('parking.table.end')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec w-24">{t('parking.table.duration')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('parking.table.reason')}</th>
              <th className="text-right px-3 py-2.5 font-medium text-text-sec w-24">{t('parking.table.amount')}</th>
              <th className="text-center px-3 py-2.5 font-medium text-text-sec w-16">{t('common.delete')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={entry.id} className="border-b border-border-light hover:bg-bg/30 transition-colors">
                <td className="px-3 py-2 text-text-sec">{idx + 1}</td>
                <td className="px-3 py-2">
                  <select
                    value={entry.stage}
                    onChange={e => updateEntry(entry.id, 'stage', e.target.value)}
                    className="border border-border rounded px-1.5 py-1 text-table w-full"
                  >
                    {(shipment.stages || []).map(s => (
                      <option key={s.no} value={s.no}>{t('parking.table.stagePrefix')} {s.no}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    value={entry.location}
                    onChange={e => updateEntry(entry.id, 'location', e.target.value)}
                    className={inputClass}
                    placeholder={t('parking.table.locationPlaceholder')}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={entry.placeType}
                    onChange={e => updateEntry(entry.id, 'placeType', e.target.value)}
                    className="border border-border rounded px-1.5 py-1 text-table"
                  >
                    {placeTypes.map(pt => (
                      <option key={pt.value} value={pt.value}>{t(pt.labelKey)}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="datetime-local"
                    value={entry.start}
                    onChange={e => updateEntry(entry.id, 'start', e.target.value)}
                    className="border border-border rounded px-1.5 py-1 text-table"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="datetime-local"
                    value={entry.end}
                    onChange={e => updateEntry(entry.id, 'end', e.target.value)}
                    className="border border-border rounded px-1.5 py-1 text-table"
                  />
                </td>
                <td className="px-3 py-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
                    style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}
                  >
                    {calcDuration(entry.start, entry.end)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <input
                    value={entry.reason}
                    onChange={e => updateEntry(entry.id, 'reason', e.target.value)}
                    className={inputClass}
                    placeholder={t('parking.table.reasonPlaceholder')}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={entry.amount}
                    onChange={e => updateEntry(entry.id, 'amount', e.target.value)}
                    className="border border-border rounded px-2 py-1 text-table w-full text-right"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-error hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    {'🗑'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Parking Display */}
      <div
        className="rounded-lg p-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)' }}
      >
        <div className="text-table text-text-sec">
          {'🅿️'} {entries.length} {entries.length === 1 ? t('parking.summary.entry') : t('parking.summary.entries')}
        </div>
        <div className="text-lg font-bold" style={{ color: '#7c3aed' }}>
          {t('parking.summary.totalParking')}: {formatCurrency(totalParking)}
        </div>
      </div>

      {/* Add Parking Button */}
      <button
        onClick={addParking}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded border-2 border-dashed text-table font-medium transition-colors hover:bg-purple-50"
        style={{ borderColor: '#c084fc', color: '#7c3aed' }}
      >
        {t('reportIn.form.addParking')}
      </button>
    </div>
  );
}
