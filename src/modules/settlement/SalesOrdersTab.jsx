import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/helpers';
import SODetailModal from './SODetailModal';

import { useLanguage } from '../../contexts/LanguageContext';
export default function SalesOrdersTab() {
  const { t } = useLanguage();
  const { state, dispatch } = useApp();
  const [selectedSO, setSelectedSO] = useState(null);
  const [postingId, setPostingId] = useState(null);

  const handlePostToSAP = (so, e) => {
    if (e) e.stopPropagation();
    setPostingId(so.id);
    // Simulate SAP posting with a short delay
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_SALES_ORDER',
        payload: { id: so.id, status: 'posted', sapPostedAt: new Date().toISOString() },
      });
      setPostingId(null);
      window.alert(`${t('settlement.postToSAP.success')}\n\nSO: ${so.soNo}\nSAP Status: Posted`);
    }, 1200);
  };

  const pendingCount = state.salesOrders.filter(so => so.status === 'pending').length;
  const postedCount = state.salesOrders.filter(so => so.status === 'posted').length;

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      {pendingCount > 0 && (
        <div className="rounded-lg px-4 py-3 text-xs border border-yellow-300 flex items-center justify-between" style={{ background: '#fffde7' }}>
          <div className="flex items-center gap-2">
            <span className="text-base">{'⚠️'}</span>
            <span className="text-yellow-800 font-medium">
              {pendingCount} {t('settlement.postToSAP.pendingOrders')} | {postedCount} {t('settlement.postToSAP.postedOrders')}
            </span>
          </div>
          <button
            onClick={() => {
              const pending = state.salesOrders.filter(so => so.status === 'pending');
              if (pending.length === 0) return;
              pending.forEach(so => handlePostToSAP(so));
            }}
            className="px-3 py-1.5 rounded text-white text-xs font-medium flex items-center gap-1"
            style={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)' }}
          >
            {'🚀'} {t('settlement.postToSAP.postAll')}
          </button>
        </div>
      )}

      {/* Panel */}
      <div className="bg-white rounded-lg border border-border-light shadow-sm">
        <div className="border-b border-border-light px-4 py-2.5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">{'✅'} {t('settlement.tabs.salesOrders')}</h3>
          <button
            onClick={() => {
              if (!state.salesOrders.length) return;
              const headers = 'SO No,Report,Product,Sold To,SO Type,Rows,Total,Status';
              const rows = state.salesOrders.map(so =>
                `"${so.soNo}","${so.reportNo}","${so.product}","${so.soldToName}","${so.soType}",${so.numRows || so.rows?.length || 0},${so.total},"${so.status}"`
              ).join('\n');
              const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'sales_orders.csv'; a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-3 py-1.5 rounded border border-border text-xs text-text-sec hover:bg-bg flex items-center gap-1"
          >
            {'📊'} {t('common.export')}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.soNumber')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.report')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('shipments.table.product')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.soldTo')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.soType')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.rows')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.total')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.sapStatus')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec">{t('freightOrders.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {state.salesOrders.map((so) => (
                <tr
                  key={so.id}
                  onClick={() => setSelectedSO(so)}
                  className={`border-b border-border-light hover:bg-green-50/30 transition-colors cursor-pointer ${
                    so.status === 'posted'
                      ? 'border-l-4 border-l-green-500'
                      : 'border-l-4 border-l-yellow-400'
                  }`}
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="font-mono font-bold text-primary hover:underline">{so.soNo}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="font-mono text-purple-700 hover:underline">{so.reportNo}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`badge-pill ${so.product === 'LPG' ? 'badge-lpg' : 'badge-ngv'}`}>
                      {so.product === 'LPG' ? '🔥' : '🟢'} {so.product}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-xs font-medium">{so.soldToName}</div>
                    <div className="text-[10px] text-text-sec">{so.soldTo}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="badge-pill bg-orange-100 text-orange-700">{so.soType}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">{so.numRows || so.rows?.length || 0}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-right font-medium">
                    {formatCurrency(so.total)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {so.status === 'posted' ? (
                      <span className="badge-pill bg-green-100 text-green-700">{'✅'} {t('settlement.status.posted')}</span>
                    ) : postingId === so.id ? (
                      <span className="badge-pill bg-blue-100 text-blue-700">{'⏳'} {t('settlement.postToSAP.posting')}</span>
                    ) : (
                      <span className="badge-pill bg-yellow-100 text-yellow-700">{'⏳'} {t('settlement.status.pending')}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedSO(so); }}
                        className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1"
                      >
                        {'👁️'} {t('common.view')}
                      </button>
                      {so.status === 'pending' && (
                        <button
                          onClick={(e) => handlePostToSAP(so, e)}
                          disabled={postingId === so.id}
                          className="text-xs px-2 py-0.5 rounded text-white flex items-center gap-1 disabled:opacity-50"
                          style={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)' }}
                        >
                          {'🚀'} {t('settlement.postToSAP.button')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {state.salesOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-text-muted text-xs">
                    {t('settlement.salesOrders.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SODetailModal
        open={!!selectedSO}
        onClose={() => setSelectedSO(null)}
        salesOrder={selectedSO}
        onPostToSAP={handlePostToSAP}
        postingId={postingId}
      />
    </div>
  );
}
