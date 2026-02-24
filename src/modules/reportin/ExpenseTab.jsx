import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../utils/helpers';
import InfoStrip from '../../components/common/InfoStrip';

const expenseGroupOptions = ['ค่าใช้จ่ายต้นทุน', 'ค่าใช้จ่ายทดแทน'];
const expenseTypes = ['Toll', 'Meal', 'Overnight', 'Ferry', 'Tip', 'Other'];
const payTypeOptions = ['เงินสด (Cash)', 'เครดิต (Credit)'];
const vendorOptions = ['PTT', 'Shell', 'Bangchak', 'Caltex', 'Other'];

export default function ExpenseTab({ shipment, onTotalChange, allCosts }) {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      site: shipment?.site || 'SCG',
      shipmentNo: shipment?.shipmentNo || '',
      expenseGroup: 'ค่าใช้จ่ายต้นทุน',
      date: new Date().toISOString().slice(0, 16),
      refDoc: '',
      driver: shipment?.driver1 || 'สมชาย พลเดช',
      expenseType: 'Toll',
      payType: 'เงินสด (Cash)',
      vendor: '',
      amount: 350,
      remark: 'Motorway toll Bangkok-Chonburi',
      receiptFile: null,
      receiptName: 'toll_receipt.jpg',
      status: 'approved',
    },
    {
      id: 2,
      site: shipment?.site || 'SCG',
      shipmentNo: shipment?.shipmentNo || '',
      expenseGroup: 'ค่าใช้จ่ายต้นทุน',
      date: new Date().toISOString().slice(0, 16),
      refDoc: '',
      driver: shipment?.driver1 || 'สมชาย พลเดช',
      expenseType: 'Meal',
      payType: 'เงินสด (Cash)',
      vendor: '',
      amount: 150,
      remark: 'Driver lunch',
      receiptFile: null,
      receiptName: '',
      status: 'pending',
    },
  ]);

  const totals = useMemo(() => ({
    tolls: expenses.filter(e => e.expenseType === 'Toll').reduce((s, e) => s + e.amount, 0),
    meals: expenses.filter(e => e.expenseType === 'Meal').reduce((s, e) => s + e.amount, 0),
    overnight: expenses.filter(e => e.expenseType === 'Overnight').reduce((s, e) => s + e.amount, 0),
    other: expenses.filter(e => !['Toll', 'Meal', 'Overnight'].includes(e.expenseType)).reduce((s, e) => s + e.amount, 0),
    total: expenses.reduce((s, e) => s + e.amount, 0),
  }), [expenses]);

  const receiptsWithReceipt = expenses.filter(e => e.receiptName).length;
  const receiptsTotal = expenses.length;

  useEffect(() => { onTotalChange?.(totals.total, { receiptsWithReceipt, receiptsTotal }); }, [totals.total, receiptsWithReceipt, receiptsTotal, onTotalChange]);

  const cashAdvance = 5000;
  const totalSpent = (allCosts?.expenses || totals.total) + (allCosts?.fuel || 0) + (allCosts?.parking || 0);

  const addExpense = () => {
    setExpenses(prev => [...prev, {
      id: Date.now(),
      site: shipment?.site || 'SCG',
      shipmentNo: shipment?.shipmentNo || '',
      expenseGroup: 'ค่าใช้จ่ายต้นทุน',
      date: new Date().toISOString().slice(0, 16),
      refDoc: '',
      driver: shipment?.driver1 || '',
      expenseType: 'Other',
      payType: 'เงินสด (Cash)',
      vendor: '',
      amount: 0,
      remark: '',
      receiptFile: null,
      receiptName: '',
      status: 'pending',
    }]);
  };

  const removeExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  const updateExpense = (id, field, value) => {
    setExpenses(prev => prev.map(e =>
      e.id === id ? { ...e, [field]: field === 'amount' ? Number(value) : value } : e
    ));
  };

  const kpiTiles = [
    { icon: '🛣️', label: t('expense.kpi.tolls'),     value: totals.tolls,     bg: '#fef9c3', border: '#fde68a', color: '#a16207' },
    { icon: '🍽️', label: t('expense.kpi.meals'),     value: totals.meals,     bg: '#dcfce7', border: '#86efac', color: '#15803d' },
    { icon: '🏨', label: t('expense.kpi.overnight'), value: totals.overnight, bg: '#dbeafe', border: '#93c5fd', color: '#1d4ed8' },
    { icon: '📋', label: t('expense.kpi.other'),     value: totals.other,     bg: '#fce7f3', border: '#f9a8d4', color: '#be185d' },
    { icon: '💰', label: t('expense.kpi.total'),     value: totals.total,     bg: '#e0f2fe', border: '#7dd3fc', color: '#0369a1' },
  ];

  const inputClass = 'w-full border border-border rounded px-2.5 py-1.5 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted';

  return (
    <div className="space-y-5">
      {/* Info Strip */}
      <InfoStrip variant="info" icon={'ℹ️'}>
        <span className="font-medium">{t('expense.infoStrip.title')}</span> {t('expense.infoStrip.body')}
      </InfoStrip>

      {/* 5 KPI Tiles */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {kpiTiles.map(tile => (
          <div
            key={tile.label}
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-lg border min-w-[120px] flex-shrink-0"
            style={{ backgroundColor: tile.bg, borderColor: tile.border }}
          >
            <span className="text-lg">{tile.icon}</span>
            <span className="text-xl font-bold" style={{ color: tile.color }}>{formatCurrency(tile.value)}</span>
            <span className="text-xs font-semibold tracking-wider" style={{ color: tile.color }}>{tile.label}</span>
          </div>
        ))}
      </div>

      {/* Expense Entry Cards */}
      <div className="space-y-4">
        {expenses.map((exp, i) => (
          <div key={exp.id} className="border border-border-light rounded-lg p-4 hover:shadow-sm transition-shadow">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-text">{t('expense.entry.title')} #{i + 1}</span>
              </div>
              {expenses.length > 1 && (
                <button onClick={() => removeExpense(exp.id)} className="text-error text-xs hover:text-red-700 font-medium transition-colors">
                  {t('expense.entry.remove')}
                </button>
              )}
            </div>

            {/* Row 1: Site, Shipment No., Expense Group, Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('expense.form.site')}</label>
                <input value={exp.site} disabled className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> Shipment no.</label>
                <input value={exp.shipmentNo} disabled className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('expense.form.expenseGroup')}</label>
                <select value={exp.expenseGroup} onChange={e => updateExpense(exp.id, 'expenseGroup', e.target.value)} className={inputClass}>
                  {expenseGroupOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('expense.form.date')}</label>
                <input type="datetime-local" value={exp.date} onChange={e => updateExpense(exp.id, 'date', e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Row 2: Ref Doc, Driver, Expense Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> Ref Doc</label>
                <input value={exp.refDoc} onChange={e => updateExpense(exp.id, 'refDoc', e.target.value)} className={inputClass} placeholder="Free text" />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('expense.form.driver')}</label>
                <input value={exp.driver} onChange={e => updateExpense(exp.id, 'driver', e.target.value)} className={inputClass} placeholder="Driver Master Data" />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('expense.form.expenseType')}</label>
                <select value={exp.expenseType} onChange={e => updateExpense(exp.id, 'expenseType', e.target.value)} className={inputClass}>
                  {expenseTypes.map(et => <option key={et} value={et}>{et}</option>)}
                </select>
              </div>
            </div>

            {/* Row 3: Pay Type, Vendor, Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('expense.form.payType')}</label>
                <select value={exp.payType} onChange={e => updateExpense(exp.id, 'payType', e.target.value)} className={inputClass}>
                  {payTypeOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">Vendor</label>
                <select value={exp.vendor} onChange={e => updateExpense(exp.id, 'vendor', e.target.value)} className={inputClass}>
                  <option value="">— Select Vendor —</option>
                  {vendorOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('expense.form.amount')}</label>
                <input type="number" value={exp.amount} onChange={e => updateExpense(exp.id, 'amount', e.target.value)} className={inputClass + ' text-right'} />
              </div>
            </div>

            {/* Row 4: Remark */}
            <div className="grid grid-cols-1 gap-3 mb-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('expense.form.remark')}</label>
                <input value={exp.remark} onChange={e => updateExpense(exp.id, 'remark', e.target.value)} className={inputClass} placeholder="Free text" />
              </div>
            </div>

            {/* Row 5: Receipt upload */}
            <div>
              <label className="block text-label font-medium text-text-sec mb-1">{t('expense.form.receipt')}</label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs font-medium hover:bg-gray-50 cursor-pointer">
                  {'📷'} {t('expense.form.attachReceipt')}
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    if (e.target.files?.[0]) {
                      updateExpense(exp.id, 'receiptName', e.target.files[0].name);
                      e.target.value = '';
                    }
                  }} />
                </label>
                {exp.receiptName && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    {'📷'} {exp.receiptName}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={addExpense}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded border-2 border-dashed border-primary/40 text-table text-primary hover:bg-primary/5 hover:border-primary/60 transition-colors font-medium"
      >
        {t('reportIn.form.addExpense')}
      </button>

      {/* Cash Advance Summary */}
      <div className="border-t border-border-light pt-4">
        <h4 className="text-sm font-semibold mb-3 text-text">{t('reportIn.form.cashAdvance')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg p-4 text-center border" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
            <div className="text-2xl mb-1">{'💵'}</div>
            <div className="text-label text-text-sec font-medium">{t('expense.cashAdvance.cashAdvance')}</div>
            <div className="text-lg font-bold" style={{ color: '#2563eb' }}>{formatCurrency(cashAdvance)}</div>
          </div>
          <div className="rounded-lg p-4 text-center border" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div className="text-2xl mb-1">{'🧾'}</div>
            <div className="text-label text-text-sec font-medium">{t('expense.cashAdvance.totalSpent')}</div>
            <div className="text-lg font-bold" style={{ color: '#16a34a' }}>{formatCurrency(totalSpent)}</div>
          </div>
          <div className="rounded-lg p-4 text-center border" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
            <div className="text-2xl mb-1">{'💰'}</div>
            <div className="text-label text-text-sec font-medium">{t('expense.cashAdvance.balance')}</div>
            <div className="text-lg font-bold" style={{ color: cashAdvance - totalSpent >= 0 ? '#ca8a04' : '#dc2626' }}>
              {formatCurrency(cashAdvance - totalSpent)}
            </div>
          </div>
          <div className="rounded-lg p-4 text-center border" style={{ backgroundColor: '#faf5ff', borderColor: '#d8b4fe' }}>
            <div className="text-2xl mb-1">{'📊'}</div>
            <div className="text-label text-text-sec font-medium">{t('expense.table.status')}</div>
            <div className="text-lg font-bold" style={{ color: '#7c3aed' }}>
              {expenses.filter(e => e.receiptName).length}/{expenses.length} {t('expense.cashAdvance.receipts')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
