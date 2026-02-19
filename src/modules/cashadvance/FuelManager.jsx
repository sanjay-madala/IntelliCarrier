import { useState, useMemo } from 'react';
import KPITile from '../../components/common/KPITile';
import { formatCurrency, formatDate } from '../../utils/helpers';

import { useLanguage } from '../../contexts/LanguageContext';
const FUEL_TYPES = ['All', 'Diesel B7', 'Diesel B20', 'Gasohol E20'];

export default function FuelManager({ fuelEntries, setFuelEntries, shipments }) {
  const { t } = useLanguage();
  const [filterFuelType, setFilterFuelType] = useState('All');
  const [filterShipment, setFilterShipment] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const emptyForm = { shipmentNo: '', driver: '', plate: '', fillType: 'Full', station: '', fuelType: 'Diesel B7', liters: 0, pricePerLiter: 32.50, milesBefore: 0, milesAfter: 0, fleetCard: '', date: '' };
  const [form, setForm] = useState(emptyForm);

  const shipmentNos = useMemo(() => ['All', ...new Set(fuelEntries.map(f => f.shipmentNo))], [fuelEntries]);

  /* Filtered + sorted */
  const filtered = useMemo(() => {
    let list = [...fuelEntries];
    if (filterFuelType !== 'All') list = list.filter(f => f.fuelType === filterFuelType);
    if (filterShipment !== 'All') list = list.filter(f => f.shipmentNo === filterShipment);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = (a.date || '').localeCompare(b.date || '');
      else if (sortKey === 'liters') cmp = a.liters - b.liters;
      else if (sortKey === 'cost') cmp = (a.liters * a.pricePerLiter) - (b.liters * b.pricePerLiter);
      else if (sortKey === 'shipmentNo') cmp = a.shipmentNo.localeCompare(b.shipmentNo);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [fuelEntries, filterFuelType, filterShipment, sortKey, sortDir]);

  /* Aggregate KPIs */
  const stats = useMemo(() => {
    const totalLiters = fuelEntries.reduce((s, f) => s + f.liters, 0);
    const totalCost = fuelEntries.reduce((s, f) => s + f.liters * f.pricePerLiter, 0);
    const avgPrice = totalLiters > 0 ? totalCost / totalLiters : 0;
    const fullFills = fuelEntries.filter(f => f.fillType === 'Full').length;
    const partialFills = fuelEntries.filter(f => f.fillType === 'Partial').length;
    const fleetCards = new Set(fuelEntries.map(f => f.fleetCard).filter(Boolean));

    /* Consumption: km/liter for entries where mileage data exists */
    const withMileage = fuelEntries.filter(f => f.milesAfter > f.milesBefore && f.liters > 0);
    const totalKm = withMileage.reduce((s, f) => s + (f.milesAfter - f.milesBefore), 0);
    const totalL = withMileage.reduce((s, f) => s + f.liters, 0);
    const kmPerLiter = totalL > 0 ? (totalKm / totalL).toFixed(2) : '—';

    return { totalLiters, totalCost, avgPrice, fullFills, partialFills, fleetCardCount: fleetCards.size, kmPerLiter };
  }, [fuelEntries]);

  /* Fleet card reconciliation */
  const cardSummary = useMemo(() => {
    const map = {};
    fuelEntries.forEach(f => {
      const card = f.fleetCard || 'No Card';
      if (!map[card]) map[card] = { liters: 0, cost: 0, fills: 0 };
      map[card].liters += f.liters;
      map[card].cost += f.liters * f.pricePerLiter;
      map[card].fills += 1;
    });
    return Object.entries(map);
  }, [fuelEntries]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  const addEntry = () => {
    if (!form.shipmentNo || !form.station) return;
    setFuelEntries(prev => [...prev, { ...form, id: `FUEL-${Date.now()}` }]);
    setForm(emptyForm);
    setShowAdd(false);
  };

  const startEdit = (entry) => { setEditId(entry.id); setForm({ ...entry }); };

  const saveEdit = () => {
    setFuelEntries(prev => prev.map(f => f.id === editId ? { ...form, id: editId } : f));
    setEditId(null);
    setForm(emptyForm);
  };

  const deleteEntry = (id) => setFuelEntries(prev => prev.filter(f => f.id !== id));

  const exportCSV = () => {
    const header = 'ID,Shipment,Driver,Plate,Fill Type,Station,Fuel Type,Liters,Price/L,Cost,Miles Before,Miles After,Fleet Card,Date';
    const rows = filtered.map(f =>
      `${f.id},${f.shipmentNo},${f.driver},${f.plate},${f.fillType},"${f.station}",${f.fuelType},${f.liters},${f.pricePerLiter},${(f.liters * f.pricePerLiter).toFixed(2)},${f.milesBefore},${f.milesAfter},${f.fleetCard},${f.date}`
    );
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fuel_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="flex gap-3 flex-wrap">
        <KPITile label={t('fuelManager.totalLiters')}  count={stats.totalLiters.toLocaleString()} color="text-primary" />
        <KPITile label={t('fuelManager.totalCost')}    count={formatCurrency(stats.totalCost)}     color="text-error" />
        <KPITile label={t('fuelManager.avgPrice')}   count={formatCurrency(stats.avgPrice)}      color="text-warning" />
        <KPITile label={t('fuelManager.kmPerLiter')}      count={stats.kmPerLiter}                    color="text-success" />
        <KPITile label={t('fuelManager.fullFills')}    count={stats.fullFills}                     color="text-blue-600" />
        <KPITile label={t('fuelManager.partialFills')} count={stats.partialFills}                  color="text-purple" />
      </div>

      {/* Fleet Card Reconciliation */}
      <div className="border border-border-light rounded-lg p-4 bg-white">
        <h4 className="text-sm font-semibold mb-3">{t('fuelManager.fleetCardReconciliation')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {cardSummary.map(([card, data]) => (
            <div key={card} className="border border-border-light rounded-lg p-3">
              <div className="text-label font-medium text-text">{card}</div>
              <div className="flex justify-between mt-1 text-label">
                <span className="text-text-sec">{t('fuelManager.fills')}</span>
                <span className="font-medium">{data.fills}</span>
              </div>
              <div className="flex justify-between text-label">
                <span className="text-text-sec">{t('fuelManager.liters')}</span>
                <span className="font-medium">{data.liters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-label border-t border-border-light mt-1 pt-1">
                <span className="text-text-sec">{t('fuelManager.cost')}</span>
                <span className="font-bold text-primary">{formatCurrency(data.cost)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterFuelType} onChange={e => setFilterFuelType(e.target.value)}
          className="border border-border rounded px-2.5 py-1.5 text-table">
          {FUEL_TYPES.map(ft => <option key={t} value={t}>{t === 'All' ? t('fuelManager.allFuelTypes') : t}</option>)}
        </select>
        <select value={filterShipment} onChange={e => setFilterShipment(e.target.value)}
          className="border border-border rounded px-2.5 py-1.5 text-table">
          {shipmentNos.map(s => <option key={s} value={s}>{s === 'All' ? t('fuelManager.allShipments') : s}</option>)}
        </select>

        <div className="flex-1" />

        <button onClick={() => { setShowAdd(true); setForm(emptyForm); }}
          className="px-3 py-1.5 bg-primary text-white rounded text-table hover:bg-primary-hover transition-colors">
          {t('fuelManager.addFuelEntry')}
        </button>
        <button onClick={exportCSV}
          className="px-3 py-1.5 border border-border rounded text-table text-text-sec hover:bg-bg transition-colors">
          {t('fuelManager.exportCSV')}
        </button>
      </div>

      {/* Add / Edit Form */}
      {(showAdd || editId) && (
        <div className="border border-primary/30 bg-blue-50/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-3">{editId ? t('fuelManager.editFuelEntry') : t('fuelManager.addNewFuelEntry')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-label text-text-sec mb-1">{t('fuelManager.shipment')}</label>
              <select value={form.shipmentNo} onChange={e => {
                const shp = shipments.find(s => s.shipmentNo === e.target.value);
                setForm(f => ({ ...f, shipmentNo: e.target.value, driver: shp?.driver1Name || '', plate: shp?.plate || '', fleetCard: shp ? `FC-${shp.vehicleNo}` : '' }));
              }} className="w-full border border-border rounded px-2.5 py-1.5 text-table">
                <option value="">{t('fuelManager.select')}</option>
                {shipments.map(s => <option key={s.id} value={s.shipmentNo}>{s.shipmentNo}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('fuelManager.fillType')}</label>
              <select value={form.fillType} onChange={e => setForm(f => ({ ...f, fillType: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table">
                <option>Full</option><option>Partial</option>
              </select>
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('fuelManager.station')}</label>
              <input value={form.station} onChange={e => setForm(f => ({ ...f, station: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" placeholder="Station name" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('fuelManager.fuelType')}</label>
              <select value={form.fuelType} onChange={e => setForm(f => ({ ...f, fuelType: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table">
                {FUEL_TYPES.filter(ft => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('fuelManager.liters')}</label>
              <input type="number" value={form.liters} onChange={e => setForm(f => ({ ...f, liters: Number(e.target.value) }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('fuelManager.pricePerLiter')}</label>
              <input type="number" step="0.01" value={form.pricePerLiter} onChange={e => setForm(f => ({ ...f, pricePerLiter: Number(e.target.value) }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('fuelManager.milesBefore')}</label>
              <input type="number" value={form.milesBefore} onChange={e => setForm(f => ({ ...f, milesBefore: Number(e.target.value) }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('fuelManager.milesAfter')}</label>
              <input type="number" value={form.milesAfter} onChange={e => setForm(f => ({ ...f, milesAfter: Number(e.target.value) }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('expenseManager.date')}</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
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
        </div>
      )}

      {/* Fuel Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-border-light">
        <table className="w-full text-table">
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('shipmentNo')}>{t('settlement.table.shipment')}{sortIcon('shipmentNo')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('shipments.table.driver')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.plate')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('fuelManager.fill')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.station')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.fuelType')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('liters')}>{t('cashAdvance.table.liters')}{sortIcon('liters')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.pricePerLiter')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('cost')}>{t('fuelManager.cost')}{sortIcon('cost')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('fuelManager.kmDriven')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.fleetCard')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('date')}>{t('cashAdvance.table.date')}{sortIcon('date')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('freightOrders.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={13} className="text-center py-8 text-text-sec">{t('fuelManager.noFuelMatch')}</td></tr>
            )}
            {filtered.map(entry => {
              const cost = entry.liters * entry.pricePerLiter;
              const kmDriven = entry.milesAfter > entry.milesBefore ? entry.milesAfter - entry.milesBefore : '—';
              return (
                <tr key={entry.id} className="border-b border-border-light hover:bg-bg/50">
                  <td className="px-3 py-2 font-medium">{entry.shipmentNo}</td>
                  <td className="px-3 py-2">{entry.driver}</td>
                  <td className="px-3 py-2">{entry.plate}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${entry.fillType === 'Full' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {entry.fillType}
                    </span>
                  </td>
                  <td className="px-3 py-2">{entry.station}</td>
                  <td className="px-3 py-2">{entry.fuelType}</td>
                  <td className="px-3 py-2 font-medium">{entry.liters.toLocaleString()}</td>
                  <td className="px-3 py-2">{formatCurrency(entry.pricePerLiter)}</td>
                  <td className="px-3 py-2 font-medium">{formatCurrency(cost)}</td>
                  <td className="px-3 py-2">{typeof kmDriven === 'number' ? `${kmDriven} km` : kmDriven}</td>
                  <td className="px-3 py-2 text-text-sec">{entry.fleetCard}</td>
                  <td className="px-3 py-2">{formatDate(entry.date)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(entry)} className="text-primary hover:text-primary-hover text-xs">{t('common.edit')}</button>
                      <button onClick={() => deleteEntry(entry.id)} className="text-error hover:text-red-700 text-xs">{t('common.delete')}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-right text-label text-text-sec">
        {t('fuelManager.showingOf').replace('{0}', filtered.length).replace('{1}', fuelEntries.length)}
      </div>
    </div>
  );
}
