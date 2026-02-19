import { useApp } from '../../contexts/AppContext';

import { useLanguage } from '../../contexts/LanguageContext';
const statusMap = {
  pending_so: { label: 'Pending SO', color: 'bg-yellow-100 text-yellow-700' },
  so_posted:  { label: 'SO Posted',  color: 'bg-green-100 text-green-700' },
};

export default function ReportsTab({ onViewReport, onCreateReport }) {
  const { t } = useLanguage();
  const { state } = useApp();

  return (
    <div className="space-y-4">
      {/* Panel Header */}
      <div className="bg-white rounded-lg border border-border-light shadow-sm">
        <div className="border-b border-border-light px-4 py-2.5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{'📋'} {t('settlement.tabs.reports')}</h3>
          <button
            onClick={onCreateReport}
            className="px-3 py-1.5 rounded text-white text-xs font-medium flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #ff9800, #f57c00)' }}
          >
            {'➕'} {t('settlement.createReport')}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.reportNo')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('shipments.table.product')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.period')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.site')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.rows')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.total')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('freightOrders.table.status')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.soNo')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('freightOrders.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {state.settlementReports.map((rpt) => {
                const isPosted = rpt.status === 'so_posted';
                const sCfg = statusMap[rpt.status] || { label: rpt.status, color: 'bg-gray-100 text-gray-700' };
                const soNums = rpt.soNumbers || (rpt.soNo ? [rpt.soNo] : []);
                return (
                  <tr
                    key={rpt.id}
                    className={`border-b border-border-light hover:bg-blue-50/30 transition-colors cursor-pointer
                      ${isPosted ? 'bg-green-50/40' : 'bg-blue-50/20'}`}
                    onClick={() => onViewReport?.(rpt)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="font-mono font-medium text-purple-700 hover:underline cursor-pointer">
                        {rpt.reportNo}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`badge-pill ${rpt.product === 'LPG' ? 'badge-lpg' : 'badge-ngv'}`}>
                        {rpt.product === 'LPG' ? '🔥' : '🟢'} {rpt.product}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{rpt.period}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{rpt.site}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-center">{rpt.rows}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-right font-medium">
                      {'฿'}{Number(rpt.total).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`badge-pill ${sCfg.color}`}>{sCfg.label}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {soNums.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="badge-pill bg-green-100 text-green-700 font-mono">{soNums[0]}</span>
                          {soNums.length > 1 && (
                            <span className="badge-pill bg-green-100 text-green-700 text-[10px]">+{soNums.length - 1} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewReport?.(rpt); }}
                        className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1"
                      >
                        {'👁️'} View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {state.settlementReports.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-text-muted text-xs">
                    No settlement reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
