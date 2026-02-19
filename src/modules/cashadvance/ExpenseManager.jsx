import { useState, useMemo } from 'react';
import KPITile from '../../components/common/KPITile';
import { formatCurrency, formatDate } from '../../utils/helpers';

import { useLanguage } from '../../contexts/LanguageContext';
const EXPENSE_TYPES = ['All', 'Toll', 'Meal', 'Overnight', 'Other'];
const STATUSES = ['All', 'approved', 'pending'];

export default function ExpenseManager({ expenses, setExpenses, cashAdvances, shipments }) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterShipment, setFilterShipment] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  /* New expense form state */
  const emptyForm = { shipmentNo: '', driver: '', type: 'Toll', description: '', payType: 'Cash', amount: 0, receipt: false, status: 'pending', date: '' };
  const [form, setForm] = useState(emptyForm);

  /* Unique shipment numbers from the data */
  const shipmentNos = useMemo(() => ['All', ...new Set(expenses.map(e => e.shipmentNo))], [expenses]);

  /* Filtered + sorted list */
  const filtered = useMemo(() => {
    let list = [...expenses];
    if (filterType !== 'All') list = list.filter(e => e.type === filterType);
    if (filterStatus !== 'All') list = list.filter(e => e.status === filterStatus);
    if (filterShipment !== 'All') list = list.filter(e => e.shipmentNo === filterShipment);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = (a.date || '').localeCompare(b.date || '');
      else if (sortKey === 'amount') cmp = a.amount - b.amount;
      else if (sortKey === 'shipmentNo') cmp = a.shipmentNo.localeCompare(b.shipmentNo);
      else if (sortKey === 'type') cmp = a.type.localeCompare(b.type);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [expenses, filterType, filterStatus, filterShipment, sortKey, sortDir]);

  /* Totals for KPI */
  const totals = useMemo(() => ({
    tolls: expenses.filter(e => e.type === 'Toll').reduce((s, e) => s + e.amount, 0),
    meals: expenses.filter(e => e.type === 'Meal').reduce((s, e) => s + e.amount, 0),
    overnight: expenses.filter(e => e.type === 'Overnight').reduce((s, e) => s + e.amount, 0),
    other: expenses.filter(e => !['Toll', 'Meal', 'Overnight'].includes(e.type)).reduce((s, e) => s + e.amount, 0),
    total: expenses.reduce((s, e) => s + e.amount, 0),
    receipts: expenses.filter(e => e.receipt).length,
  }), [expenses]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  const addExpense = () => {
    if (!form.shipmentNo || !form.description) return;
    setExpenses(prev => [...prev, { ...form, id: `EXP-${Date.now()}` }]);
    setForm(emptyForm);
    setShowAdd(false);
  };

  const startEdit = (exp) => {
    setEditId(exp.id);
    setForm({ ...exp });
  };

  const saveEdit = () => {
    setExpenses(prev => prev.map(e => e.id === editId ? { ...form, id: editId } : e));
    setEditId(null);
    setForm(emptyForm);
  };

  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  const exportCSV = () => {
    const header = 'ID,Shipment,Driver,Type,Description,Pay Type,Amount,Receipt,Status,Date';
    const rows = filtered.map(e =>
      `${e.id},${e.shipmentNo},${e.driver},${e.type},"${e.description}",${e.payType},${e.amount},${e.receipt},${e.status},${e.date}`
    );
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="flex gap-3 flex-wrap">
        <KPITile label={t('expenseManager.tolls')}     count={formatCurrency(totals.tolls)}     color="text-primary" />
        <KPITile label={t('expenseManager.meals')}     count={formatCurrency(totals.meals)}     color="text-accent" />
        <KPITile label={t('expenseManager.overnight')} count={formatCurrency(totals.overnight)} color="text-purple" />
        <KPITile label={t('expenseManager.other')}     count={formatCurrency(totals.other)}     color="text-text-sec" />
        <KPITile label={t('expenseManager.total')}     count={formatCurrency(totals.total)}     color="text-error" />
        <KPITile label={t('expenseManager.receipts')}  count={`${totals.receipts}/${expenses.length}`} color="text-success" />
      </div>

      {/* Cash Advance Summary per shipment */}
      <div className="border border-border-light rounded-lg p-4 bg-white">
        <h4 className="text-sm font-semibold mb-3">{t('cashAdvance.balancesByShipment')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(cashAdvances).map(([shpNo, advanced]) => {
            const spent = expenses.filter(e => e.shipmentNo === shpNo).reduce((s, e) => s + e.amount, 0);
            const remaining = advanced - spent;
            return (
              <div key={shpNo} className="border border-border-light rounded-lg p-3">
                <div className="text-label font-medium text-text">{shpNo}</div>
                <div className="flex justify-between mt-1 text-label">
                  <span className="text-text-sec">{t('cashAdvance.advanced')}</span>
                  <span className="font-medium text-primary">{formatCurrency(advanced)}</span>
                </div>
                <div className="flex justify-between text-label">
                  <span className="text-text-sec">{t('cashAdvance.spent')}</span>
                  <span className="font-medium text-error">{formatCurrency(spent)}</span>
                </div>
                <div className="flex justify-between text-label border-t border-border-light mt-1 pt-1">
                  <span className="text-text-sec">{t('cashAdvance.remaining')}</span>
                  <span className={`font-bold ${remaining >= 0 ? 'text-success' : 'text-error'}`}>{formatCurrency(remaining)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar: Filters + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="border border-border rounded px-2.5 py-1.5 text-table">
          {EXPENSE_TYPES.map(tp => <option key={t} value={t}>{t === 'All' ? t('expenseManager.allTypes') : t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-border rounded px-2.5 py-1.5 text-table">
          {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? t('expenseManager.allStatus') : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={filterShipment} onChange={e => setFilterShipment(e.target.value)}
          className="border border-border rounded px-2.5 py-1.5 text-table">
          {shipmentNos.map(s => <option key={s} value={s}>{s === 'All' ? t('expenseManager.allShipments') : s}</option>)}
        </select>

        <div className="flex-1" />

        <button onClick={() => { setShowAdd(true); setForm(emptyForm); }}
          className="px-3 py-1.5 bg-primary text-white rounded text-table hover:bg-primary-hover transition-colors">
          {t('expenseManager.addExpense')}
        </button>
        <button onClick={exportCSV}
          className="px-3 py-1.5 border border-border rounded text-table text-text-sec hover:bg-bg transition-colors">
          {t('expenseManager.exportCSV')}
        </button>
      </div>

      {/* Add / Edit Form */}
      {(showAdd || editId) && (
        <div className="border border-primary/30 bg-blue-50/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-3">{editId ? t('expenseManager.editExpense') : t('expenseManager.addNewExpense')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-label text-text-sec mb-1">{t('expenseManager.shipment')}</label>
              <select value={form.shipmentNo} onChange={e => setForm(f => ({ ...f, shipmentNo: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table">
                <option value="">{t('expenseManager.select')}</option>
                {shipments.map(s => <option key={s.id} value={s.shipmentNo}>{s.shipmentNo}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('expenseManager.type')}</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table">
                {EXPENSE_TYPES.filter(tp => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('expenseManager.description')}</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" placeholder="Enter description" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('expenseManager.payType')}</label>
              <select value={form.payType} onChange={e => setForm(f => ({ ...f, payType: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table">
                <option>Cash</option><option>Fleet Card</option><option>Company Account</option>
              </select>
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('expenseManager.amount')}</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div>
              <label className="block text-label text-text-sec mb-1">{t('expenseManager.date')}</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-border rounded px-2.5 py-1.5 text-table" />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-1.5 text-table">
                <input type="checkbox" checked={form.receipt} onChange={e => setForm(f => ({ ...f, receipt: e.target.checked }))} />
                {t('expenseManager.hasReceipt')}
              </label>
            </div>
            <div className="flex items-end gap-2">
              {editId ? (
                <>
                  <button onClick={saveEdit} className="px-3 py-1.5 bg-primary text-white rounded text-table hover:bg-primary-hover">{t('common.save')}</button>
                  <button onClick={() => { setEditId(null); setForm(emptyForm); }} className="px-3 py-1.5 border border-border rounded text-table text-text-sec">{t('common.cancel')}</button>
                </>
              ) : (
                <>
                  <button onClick={addExpense} className="px-3 py-1.5 bg-primary text-white rounded text-table hover:bg-primary-hover">{t('common.create')}</button>
                  <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 border border-border rounded text-table text-text-sec">{t('common.cancel')}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expense Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-border-light">
        <table className="w-full text-table">
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('shipmentNo')}>{t('settlement.table.shipment')}{sortIcon('shipmentNo')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('shipments.table.driver')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('type')}>{t('reportIn.table.type')}{sortIcon('type')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.description')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.payType')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('amount')}>{t('cashAdvance.table.amount')}{sortIcon('amount')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('cashAdvance.table.receipt')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('freightOrders.table.status')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec cursor-pointer" onClick={() => handleSort('date')}>{t('cashAdvance.table.date')}{sortIcon('date')}</th>
              <th className="text-left px-3 py-2 font-medium text-text-sec">{t('freightOrders.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="text-center py-8 text-text-sec">{t('expenseManager.noExpensesMatch')}</td></tr>
            )}
            {filtered.map(exp => (
              <tr key={exp.id} className="border-b border-border-light hover:bg-bg/50">
                <td className="px-3 py-2 font-medium">{exp.shipmentNo}</td>
                <td className="px-3 py-2">{exp.driver}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium
                    ${exp.type === 'Toll' ? 'bg-blue-100 text-blue-700' :
                      exp.type === 'Meal' ? 'bg-orange-100 text-orange-700' :
                      exp.type === 'Overnight' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'}`}>
                    {exp.type}
                  </span>
                </td>
                <td className="px-3 py-2">{exp.description}</td>
                <td className="px-3 py-2">{exp.payType}</td>
                <td className="px-3 py-2 font-medium">{formatCurrency(exp.amount)}</td>
                <td className="px-3 py-2">{exp.receipt ? '✅' : '—'}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium
                    ${exp.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {exp.status}
                  </span>
                </td>
                <td className="px-3 py-2">{formatDate(exp.date)}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(exp)} className="text-primary hover:text-primary-hover text-xs">{t('common.edit')}</button>
                    <button onClick={() => deleteExpense(exp.id)} className="text-error hover:text-red-700 text-xs">{t('common.delete')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="text-right text-label text-text-sec">
        {t('expenseManager.showingOf').replace('{0}', filtered.length).replace('{1}', expenses.length)}
      </div>
    </div>
  );
}
