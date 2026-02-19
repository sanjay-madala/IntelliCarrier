import { useState, useMemo } from 'react';
import KPITile from '../../components/common/KPITile';
import { formatCurrency, formatDate } from '../../utils/helpers';

import { useLanguage } from '../../contexts/LanguageContext';
const PLACE_TYPES = ['All', 'Rest Area', 'Gas Station', 'Warehouse', 'Other'];

/* Compute duration between two datetime-local strings */
function calcDuration(start, end) {
  if (!start || !end) return '—';
  const ms = new Date(end) - new Date(start);
  if (ms <= 0) return '—';
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function durationMinutes(start, end) {
  if (!start || !end) return 0;
  const ms = new Date(end) - new Date(start);
  return ms > 0 ? Math.round(ms / 60000) : 0;
}

export default function ParkingManager({ parkingEntries, setParkingEntries, shipments }) {
  const { t } = useLanguage();
  const [filterPlace, setFilterPlace] = useState('All');
  const [filterShipment, setFilterShipment] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [sortKey, setSortKey] = useState('start');
  const [sortDir, setSortDir] = useState('desc');

  const emptyForm = { shipmentNo: '', driver: '', stage: 1, location: '', placeType: 'Rest Area', start: '', end: '', reason: '', amount: 0 };
  const [form, setForm] = useState(emptyForm);

  const shipmentNos = useMemo(() => ['All', ...new Set(parkingEntries.map(p => p.shipmentNo))], [parkingEntries]);

  /* Filtered + sorted */
  const filtered = useMemo(() => {
    let list = [...parkingEntries];
    if (filterPlace !== 'All') list = list.filter(p => p.placeType === filterPlace);
    if (filterShipment !== 'All') list = list.filter(p => p.shipmentNo === filterShipment);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'start') cmp = (a.start || '').localeCompare(b.start || '');
      else if (sortKey === 'amount') cmp = a.amount - b.amount;
      else if (sortKey === 'shipmentNo') cmp = a.shipmentNo.localeCompare(b.shipmentNo);
      else if (sortKey === 'duration') cmp = durationMinutes(a.start, a.end) - durationMinutes(b.start, b.end);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [parkingEntries, filterPlace, filterShipment, sortKey, sortDir]);

  /* KPIs */
  const stats = useMemo(() => {
    const totalAmount = parkingEntries.reduce((s, p) => s + p.amount, 0);
    const totalMinutes = parkingEntries.reduce((s, p) => s + durationMinutes(p.start, p.end), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const byPlace = {};
    parkingEntries.forEach(p => {
      if (!byPlace[p.placeType]) byPlace[p.placeType] = { count: 0, amount: 0, minutes: 0 };
      byPlace[p.placeType].count += 1;
      byPlace[p.placeType].amount += p.amount;
      byPlace[p.placeType].minutes += durationMinutes(p.start, p.end);
    });
    const byStage = {};
    parkingEntries.forEach(p => {
      const key = `Stage ${p.stage}`;
      if (!byStage[key]) byStage[key] = { count: 0, amount: 0, minutes: 0 };
      byStage[key].count += 1;
      byStage[key].amount += p.amount;
      byStage[key].minutes += durationMinutes(p.start, p.end);
    });
    const paidEntries = parkingEntries.filter(p => p.amount > 0).length;
    return { totalAmount, totalHours, totalMinutes, byPlace: Object.entries(byPlace), byStage: Object.entries(byStage), paidEntries, total: parkingEntries.length };
  }, [parkingEntries]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  const addEntry = () => {
    if (!form.shipmentNo || !form.location) return;
    setParkingEntries(prev => [...prev, { ...form, id: `PKG-${Date.now()}` }]);
    setForm(emptyForm);
    setShowAdd(false);
  };

  const startEdit = (entry) => { setEditId(entry.id); setForm({ ...entry }); };

  const saveEdit = () => {
    setParkingEntries(prev => prev.map(p => p.id === editId ? { ...form, id: editId } : p));
    setEditId(null);
    setForm(emptyForm);
  };

  const deleteEntry = (id) => setParkingEntries(prev => prev.filter(p => p.id !== id));

  const exportCSV = () => {
    const header = 'ID,Shipment,Driver,Stage,Location,Place Type,Start,End,Duration,Reason,Amount';
    const rows = filtered.map(p =>
      `${p.id},${p.shipmentNo},${p.driver},${p.stage},"${p.location}",${p.placeType},${p.start},${p.end},"${calcDuration(p.start, p.end)}","${p.reason}",${p.amount}`
    );
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parking_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="flex gap-3 flex-wrap">
        <KPITile label={t('parkingManager.totalEntries')}  count={stats.total}                            color="text-primary" />
        <KPITile label={t('parkingManager.totalHours')}    count={stats.totalHours}                       color="text-blue-600" />
        <KPITile label={t('parkingManager.totalCost')}     count={formatCurrency(stats.totalAmount)}      color="text-error" />
        <KPITile label={t('parkingManager.paidStops')}     count={stats.paidEntries}                      color="text-warning" />
        <KPITile label={t('parkingManager.freeStops')}     count={stats.total - stats.paidEntries}        color="text-success" />
      </div>

      {/* Summary by Place Type + Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* By Place Type */}
        <div className="border border-border-light rounded-lg p-4 bg-white">
          <h4 className="text-sm font-semibold mb-3">{t('parkingManager.summaryByLocation')}</h4>
          <div className="space-y-2">
            {stats.byPlace.map(([place, data]) => (
              <div key={place} className="flex items-center justify-between text-table border-b border-border-light pb-2">
                <div>
                  <span className="font-medium">{place}</span>
                  <span className="text-text-sec ml-2">({data.count} stops)</span>
                </div>
                <div className="flex gap-4 text-right">
                  <span className="text-text-sec">{(data.minutes / 60).toFixed(1)}h</span>
                  <span className="font-medium">{formatCurrency(data.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Stage */}
        <div className="border border-border-light rounded-lg p-4 bg-white">
          <h4 className="text-sm font-semibold mb-3">{t('parkingManager.summaryByStage')}</h4>
          <div className="space-y-2">
            {stats.byStage.map(([stage, data]) => (
              <div key={stage} className="flex items-center justify-between text-table border-b border-border-light pb-2">
                <div>
                  <span className="font-medium">{stage}</span>
                  <span className="text-text-sec ml-2">({data.count} stops)</span>
                </div>
                <div className="flex gap-4 text-right">
                  <span className="text-text-sec">{(data.minutes / 60).toFixed(1)}h</span>
                  <span className="font-medium">{formatCurrency(data.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterPlace} onChange={e => setFilterPlace(e.target.value)}
          className="border border-border rounded px-2.5 py-1.5 text-table">
          {PLACE_TYPES.map(pt => <option key={t} value={t}>{t === 'All' ? t('parkingManager.allPlaceTypes') : t}</option>)}
        </select>
        <select value={filterShipment} onChange={e => setFilterShipment(e.target.value)}
          className="border border-border rounded px-2.5 py-1.5 text-table">
          {shipmentNos.map(s => <option key={s} value={s}>{s === 'All' ? t('parkingManager.allShipments') : s}</option>)}
        </select>

        <div className="flex-1" />

        <button onClick={() => { setShowAdd(true); setForm(emptyForm); }}
          className="px-3 py-1.5 bg-primary text-white rounded text-table hover:bg-primary-hover transition-colors">
          {t('parkingManager.addParkingEntry')}
        </button>
        <button onClick={exportCSV}
          className="px-3 py-1.5 border border-border rounded text-table text-text-sec hover:bg-bg transition-colors">
          {t('parkingManager.exportCSV')}
        </button>
      </div>

      {/* Add / Edit Form */}
      {(showAdd || editId) && (
        <div className="border border-primary/30 bg-blue-50/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-3">{editId ? t('parkingManager.editParkingEntry') : t('parkingManager.addNewParkingEntry')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-label text-text-sec mb-1">{t('parkingManager.shipment')}</label>
              <select value={form.shipmentNo} onChange={e => {
                const shp = shipments.find(s => s.shipmentNo === e.target.value);
                setForm(f => ({ ...f, shipmentNo: e.target.value, driver: shp?.driver1Name || '' }));
              }} className="w-full border border-border rounded px-2.5 py-1.5 text-table">
                <option value="">{t('parkingManager.shipment')}...</option>
                {shipments.map(s => <option key={s.id} value={s.shipmentNo}>{s.shipmentNo}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('parkingManager.stage')}</label>
              <input type="number" min="1" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: Number(e.target.value) }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('parkingManager.location')}</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" placeholder="Location name" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('parkingManager.placeType')}</label>
              <select value={form.placeType} onChange={e => setForm(f => ({ ...f, placeType: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table">
                {PLACE_TYPES.filter(pt => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('parkingManager.start')}</label>
              <input type="datetime-local" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('parkingManager.end')}</label>
              <input type="datetime-local" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('parkingManager.reason')}</label>
              <input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" placeholder="Reason for stop" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('parkingManager.amount')}</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div className="flex items-end gap-2">
              {editId ? (
                <>
                  <button onClick={saveEdit} className="px-3 py-1.5 bg-primary text-white rounded text-table hover:bg-primary-hover">{t('common.save')}</button>
                  <button onClick={() => { setEditId(null); setForm(emptyForm); }} className="px-3 py-1.5 border border-border rounded text-table text-text-sec">{t('common.cancel')}</button>
                </>
              ) : (
                <>
                  <button onClick={addEntry} className="px-3 py-1.5 bg-primary text-white rounded text-table hover:bg-primary-hover">{t('common.create')}</button>
                  <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 border border-border rounded text-table text-text-sec">{t('common.cancel')}</button>
                </>
              )}
            </div>
          </div>
          {/* Auto-calculated duration preview */}
          {form.start && form.end && (
            <div className="mt-3 text-table text-text-sec">
              {t('parkingManager.autoCalculatedDuration')}: <span className="font-medium text-text">{calcDuration(form.start, form.end)}</span>
            </div>
          )}
        </div>
      )}

      {/* Parking Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-border-light">
        <table className="w-full text-table">
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('shipmentNo')}>{t('settlement.table.shipment')}{sortIcon('shipmentNo')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('shipments.table.driver')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.stage')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.location')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.placeType')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('start')}>{t('cashAdvance.table.start')}{sortIcon('start')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.end')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('duration')}>{t('cashAdvance.table.duration')}{sortIcon('duration')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.reason')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('amount')}>{t('cashAdvance.table.amount')}{sortIcon('amount')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('freightOrders.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={11} className="text-center py-8 text-text-sec">{t('parkingManager.noParkingMatch')}</td></tr>
            )}
            {filtered.map(entry => (
              <tr key={entry.id} className="border-b border-border-light hover:bg-bg/50">
                <td className="px-3 py-2 font-medium">{entry.shipmentNo}</td>
                <td className="px-3 py-2">{entry.driver}</td>
                <td className="px-3 py-2 text-center">{entry.stage}</td>
                <td className="px-3 py-2">{entry.location}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium
                    ${entry.placeType === 'Rest Area' ? 'bg-green-100 text-green-700' :
                      entry.placeType === 'Gas Station' ? 'bg-amber-100 text-amber-700' :
                      entry.placeType === 'Warehouse' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'}`}>
                    {entry.placeType}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.start ? new Date(entry.start).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{entry.end ? new Date(entry.end).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                <td className="px-3 py-2 font-medium">{calcDuration(entry.start, entry.end)}</td>
                <td className="px-3 py-2">{entry.reason}</td>
                <td className="px-3 py-2 font-medium">{entry.amount > 0 ? formatCurrency(entry.amount) : t('parkingManager.free')}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(entry)} className="text-primary hover:text-primary-hover text-xs">{t('common.edit')}</button>
                    <button onClick={() => deleteEntry(entry.id)} className="text-error hover:text-red-700 text-xs">{t('common.delete')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-right text-label text-text-sec">
        {t('parkingManager.showingOf').replace('{0}', filtered.length).replace('{1}', parkingEntries.length)}
      </div>
    </div>
  );
}
