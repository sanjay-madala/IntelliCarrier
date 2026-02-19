import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../utils/helpers';
import InfoStrip from '../../components/common/InfoStrip';

const expenseTypes = ['Toll', 'Meal', 'Overnight', 'Ferry', 'Tip', 'Other'];
const payTypes = ['Cash', 'Card'];

export default function ExpenseTab({ shipment, onTotalChange, allCosts }) {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState([
    { id: 1, type: 'Toll', description: 'Motorway toll Bangkok-Chonburi', payType: 'Cash', amount: 350, receipt: true, status: 'approved' },
    { id: 2, type: 'Meal', description: 'Driver lunch', payType: 'Cash', amount: 150, receipt: false, status: 'pending' },
    { id: 3, type: 'Overnight', description: 'Rest stop accommodation', payType: 'Cash', amount: 800, receipt: true, status: 'approved' },
  ]);

  const totals = useMemo(() => ({
    tolls: expenses.filter(e => e.type === 'Toll').reduce((s, e) => s + e.amount, 0),
    meals: expenses.filter(e => e.type === 'Meal').reduce((s, e) => s + e.amount, 0),
    overnight: expenses.filter(e => e.type === 'Overnight').reduce((s, e) => s + e.amount, 0),
    other: expenses.filter(e => !['Toll', 'Meal', 'Overnight'].includes(e.type)).reduce((s, e) => s + e.amount, 0),
    total: expenses.reduce((s, e) => s + e.amount, 0),
  }), [expenses]);

  const receiptsWithReceipt = expenses.filter(e => e.receipt).length;
  const receiptsTotal = expenses.length;

  useEffect(() => { onTotalChange?.(totals.total, { receiptsWithReceipt, receiptsTotal }); }, [totals.total, receiptsWithReceipt, receiptsTotal, onTotalChange]);

  const cashAdvance = 5000;
  const totalSpent = (allCosts?.expenses || totals.total) + (allCosts?.fuel || 0) + (allCosts?.parking || 0);

  const addExpense = () => {
    setExpenses(prev => [...prev, {
      id: Date.now(),
      type: 'Other',
      description: '',
      payType: 'Cash',
      amount: 0,
      receipt: false,
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

  const inputClass = 'w-full border border-border rounded px-2 py-1 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary';

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

      {/* Expense Table */}
      <div className="overflow-x-auto border border-border-light rounded-lg">
        <table className="w-full text-table">
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-3 py-2.5 font-medium text-text-sec w-10">#</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('expense.table.type')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('expense.table.description')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('expense.table.payType')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('expense.table.amount')}</th>
              <th className="text-center px-3 py-2.5 font-medium text-text-sec">{t('expense.table.receipt')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('expense.table.status')}</th>
              <th className="text-center px-3 py-2.5 font-medium text-text-sec w-16">{t('common.delete')}</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, idx) => (
              <tr key={exp.id} className="border-b border-border-light hover:bg-bg/30 transition-colors">
                <td className="px-3 py-2 text-text-sec">{idx + 1}</td>
                <td className="px-3 py-2">
                  <select
                    value={exp.type}
                    onChange={e => updateExpense(exp.id, 'type', e.target.value)}
                    className="border border-border rounded px-2 py-1 text-table"
                  >
                    {expenseTypes.map(et => <option key={et} value={et}>{et}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    value={exp.description}
                    onChange={e => updateExpense(exp.id, 'description', e.target.value)}
                    className={inputClass}
                    placeholder={t('expense.table.descriptionPlaceholder')}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={exp.payType}
                    onChange={e => updateExpense(exp.id, 'payType', e.target.value)}
                    className="border border-border rounded px-2 py-1 text-table"
                  >
                    {payTypes.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={exp.amount}
                    onChange={e => updateExpense(exp.id, 'amount', e.target.value)}
                    className="border border-border rounded px-2 py-1 text-table w-24 text-right"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  {exp.receipt ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      {'📷'} {t('common.yes')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                      {t('common.no')}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    exp.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : exp.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {exp.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => removeExpense(exp.id)}
                    className="text-error hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    {'🗑'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-bg font-semibold">
              <td colSpan={4} className="px-3 py-2.5 text-right text-text-sec">{t('expense.table.totalExpenses')}:</td>
              <td className="px-3 py-2.5 text-right text-text font-bold">{formatCurrency(totals.total)}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
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
              {expenses.filter(e => e.receipt).length}/{expenses.length} {t('expense.cashAdvance.receipts')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
