import { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../utils/helpers';

export default function ReviewTab({ shipment, costs: costsProp }) {
  const { t } = useLanguage();
  const completedStages = shipment.stages.filter(s => s.status === 'completed');
  const totalStages = shipment.stages.length;

  const totalStdDist = useMemo(() =>
    shipment.stages.reduce((s, st) => s + (st.stdDistance || st.stdDist || st.distance || 0), 0),
    [shipment.stages]
  );

  const totalActualDist = useMemo(() =>
    completedStages.reduce((s, st) =>
      s + (st.milesEnd && st.milesStart ? st.milesEnd - st.milesStart : 0), 0),
    [completedStages]
  );

  // Use actual costs from tabs if available, fallback to defaults for initial display
  const costs = {
    expenses: costsProp?.expenses || 1300,
    fuel: costsProp?.fuel || 3714,
    parking: costsProp?.parking || 100,
  };
  const grandTotal = costs.expenses + costs.fuel + costs.parking;
  const receiptsWithReceipt = costsProp?.receiptsWithReceipt || 0;
  const receiptsTotal = costsProp?.receiptsTotal || 0;

  return (
    <div className="space-y-6">
      {/* Stage Summary Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-semibold text-text flex items-center gap-2">
          {'📊'} {t('reportIn.form.reviewClose')}
        </h3>
        <div className="flex gap-4 text-table">
          <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#eff6ff' }}>
            <span className="text-text-sec">{t('reportIn.form.stages')}:</span>{' '}
            <span className="font-bold" style={{ color: '#2563eb' }}>{completedStages.length}/{totalStages}</span>
          </div>
          <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#f0fdf4' }}>
            <span className="text-text-sec">{t('review.summary.totalStdDist')}:</span>{' '}
            <span className="font-bold" style={{ color: '#16a34a' }}>{totalStdDist} km</span>
          </div>
          <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#fff7ed' }}>
            <span className="text-text-sec">{t('review.summary.totalActual')}:</span>{' '}
            <span className="font-bold" style={{ color: '#ea580c' }}>{totalActualDist} km</span>
          </div>
        </div>
      </div>

      {/* Stage Summary Table */}
      <div className="overflow-x-auto border border-border-light rounded-lg">
        <table className="w-full text-table">
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-3 py-2.5 font-medium text-text-sec w-16">{t('review.table.stage')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('review.table.from')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('review.table.to')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('review.table.type')}</th>
              <th className="text-right px-3 py-2.5 font-medium text-text-sec">{t('review.table.stdDist')}</th>
              <th className="text-right px-3 py-2.5 font-medium text-text-sec">{t('review.table.milesStart')}</th>
              <th className="text-right px-3 py-2.5 font-medium text-text-sec">{t('review.table.milesEnd')}</th>
              <th className="text-right px-3 py-2.5 font-medium text-text-sec">{t('review.table.actualDist')}</th>
              <th className="text-right px-3 py-2.5 font-medium text-text-sec">{t('review.table.variance')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('review.table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {shipment.stages.map((stage, i) => {
              const actual = stage.milesEnd && stage.milesStart ? stage.milesEnd - stage.milesStart : null;
              const std = stage.stdDistance || stage.stdDist || stage.distance || 0;
              const variance = actual != null && std > 0
                ? ((actual - std) / std * 100).toFixed(1)
                : null;
              const varianceOk = variance != null && Math.abs(parseFloat(variance)) <= 15;

              return (
                <tr key={i} className="border-b border-border-light hover:bg-bg/30 transition-colors">
                  <td className="px-3 py-2.5 font-medium">{stage.n ?? stage.no}</td>
                  <td className="px-3 py-2.5">{stage.from || stage.origin}</td>
                  <td className="px-3 py-2.5">{stage.to || stage.dest}</td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-text-sec">
                      {stage.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right">{std} km</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm">
                    {stage.milesStart != null ? stage.milesStart.toLocaleString() : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm">
                    {stage.milesEnd != null ? stage.milesEnd.toLocaleString() : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold">
                    {actual != null ? `${actual} km` : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {variance != null ? (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
                        style={{
                          backgroundColor: varianceOk ? '#dcfce7' : '#fee2e2',
                          color: varianceOk ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {parseFloat(variance) > 0 ? '+' : ''}{variance}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      stage.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-text-sec'
                    }`}>
                      {stage.status === 'completed' && '✓'} {stage.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-bg font-semibold border-t-2 border-border">
              <td colSpan={4} className="px-3 py-2.5 text-right text-text-sec">{t('review.table.totals')}</td>
              <td className="px-3 py-2.5 text-right font-bold">{totalStdDist} km</td>
              <td colSpan={2}></td>
              <td className="px-3 py-2.5 text-right font-bold">{totalActualDist} km</td>
              <td></td>
              <td className="px-3 py-2.5">
                <span className="font-bold" style={{ color: '#2563eb' }}>
                  {completedStages.length}/{totalStages}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cost Summary with color-coded values */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-text">{t('reportIn.form.costSummary')}</h3>
        <div className="rounded-lg border border-border-light overflow-hidden">
          <div className="bg-bg px-4 py-2 border-b border-border">
            <div className="flex justify-between text-table font-medium text-text-sec">
              <span>{t('review.costs.category')}</span>
              <span>{t('review.costs.amount')}</span>
            </div>
          </div>
          <div className="divide-y divide-border-light">
            <CostRow
              icon={'📋'}
              label={t('review.costs.expenses')}
              value={formatCurrency(costs.expenses)}
              color="#dc2626"
            />
            <CostRow
              icon={'⛽'}
              label={t('review.costs.fuel')}
              value={formatCurrency(costs.fuel)}
              color="#d97706"
            />
            <CostRow
              icon={'🅿️'}
              label={t('review.costs.parking')}
              value={formatCurrency(costs.parking)}
              color="#7c3aed"
            />
          </div>
          <div
            className="px-4 py-3 flex justify-between items-center"
            style={{ background: 'linear-gradient(135deg, #fef2f2, #fff1f2)' }}
          >
            <span className="text-table font-bold text-text flex items-center gap-2">
              {'💰'} {t('reportIn.form.grandTotal')}
            </span>
            <span className="text-xl font-bold" style={{ color: '#dc2626' }}>
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          label={t('review.stats.completion')}
          value={totalStages > 0 ? `${Math.round(completedStages.length / totalStages * 100)}%` : '0%'}
          color="#2563eb"
          bg="#eff6ff"
        />
        <SummaryCard
          label={t('review.stats.distanceVariance')}
          value={totalStdDist > 0 ? `${((totalActualDist - totalStdDist) / totalStdDist * 100).toFixed(1)}%` : '0%'}
          color={Math.abs(totalActualDist - totalStdDist) / (totalStdDist || 1) <= 0.15 ? '#16a34a' : '#dc2626'}
          bg={Math.abs(totalActualDist - totalStdDist) / (totalStdDist || 1) <= 0.15 ? '#f0fdf4' : '#fef2f2'}
        />
        <SummaryCard
          label={t('review.stats.costPerKm')}
          value={totalActualDist > 0 ? formatCurrency(grandTotal / totalActualDist) : '—'}
          color="#ca8a04"
          bg="#fffbeb"
        />
        <SummaryCard
          label={t('review.stats.receiptsRatio')}
          value={`${receiptsWithReceipt}/${receiptsTotal}`}
          color="#7c3aed"
          bg="#faf5ff"
        />
      </div>
    </div>
  );
}

function CostRow({ icon, label, value, color }) {
  return (
    <div className="px-4 py-2.5 flex justify-between items-center hover:bg-bg/30 transition-colors">
      <span className="text-table text-text flex items-center gap-2">
        <span>{icon}</span> {label}
      </span>
      <span className="text-table font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

function SummaryCard({ label, value, color, bg }) {
  return (
    <div
      className="rounded-lg p-4 text-center border"
      style={{ backgroundColor: bg, borderColor: color + '30' }}
    >
      <div className="text-label text-text-sec font-medium mb-1">{label}</div>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
