import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import CreateReportModal from './CreateReportModal';

import { useLanguage } from '../../contexts/LanguageContext';
export default function AwaitingTab({ onReportCreated }) {
  const { t } = useLanguage();
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    let list = state.awaitingSettlement.filter(a => a.status === 'awaiting');
    if (filterProduct) list = list.filter(a => a.product === filterProduct);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.shipmentNo.toLowerCase().includes(q) ||
        a.soldToName?.toLowerCase().includes(q) ||
        a.shipToName?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [state.awaitingSettlement, filterProduct, search]);

  return (
    <div className="space-y-4">
      {/* Panel Header */}
      <div className="bg-white rounded-lg border border-border-light shadow-sm">
        <div className="border-b border-border-light px-4 py-2.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text">{'📦'} {t('settlement.tabs.awaiting')}</h3>
            <p className="text-[10px] text-text-sec">{t('settlement.awaiting.customerStageNote')}</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 rounded text-white text-xs font-medium flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #2196f3, #1976d2)' }}
          >
            {'📋'} {t('settlement.createReport')}
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2.5 border-b border-border-light flex items-center gap-2 flex-wrap bg-gray-50">
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs border border-border rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={filterProduct}
            onChange={e => setFilterProduct(e.target.value)}
            className="border border-border rounded px-3 py-1.5 text-xs"
          >
            <option value="">All Products</option>
            <option value="LPG">LPG</option>
            <option value="NGV">NGV</option>
            <option value="TUG">TUG</option>
          </select>
          <span className="text-[10px] text-text-sec ml-auto">{filtered.length} rows</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.table.shipment')}</th>
                <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('shipments.table.product')}</th>
                {filterProduct === 'TUG' ? (
                  <>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.tug.orderId')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.tug.vessel')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">GRT</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.tug.activity')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.tug.port')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.tug.salesNo')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.tug.items')}</th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.table.stage')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.table.soldTo')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.table.shipTo')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.table.customerDoc')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.table.ticketQty')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.table.billingDist')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('settlement.table.gasUnload')}</th>
                  </>
                )}
                <th className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">{t('cashAdvance.table.date')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const productBadge = row.product === 'LPG' ? 'badge-lpg' : row.product === 'NGV' ? 'badge-ngv' : 'bg-teal-50 text-teal-700';
                const productIcon = row.product === 'LPG' ? '🔥' : row.product === 'NGV' ? '🟢' : '🚢';
                return (
                <tr key={row.id} className="border-b border-border-light border-l-4 border-l-orange-400 hover:bg-orange-50/30 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap font-mono text-primary">
                    <button
                      onClick={() => {
                        window.parent.postMessage({ type: 'NAVIGATE_TO_SHIPMENT', shipmentId: row.shipmentNo }, '*');
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      {row.shipmentNo}
                    </button>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`badge-pill ${productBadge}`}>
                      {productIcon} {row.product}
                    </span>
                  </td>
                  {row.product === 'TUG' ? (
                    <>
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{row.orderId}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium">{row.vessel}</div>
                        <div className="text-[10px] text-text-sec">LOA: {row.loa} ft | Draf: {row.draf} m</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right font-semibold">{row.grt?.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="badge-pill bg-teal-50 text-teal-700">{row.activityOperation}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.port}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{row.salesNo || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <span className="badge-pill bg-blue-50 text-blue-700">{row.items?.length || 0}</span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2 whitespace-nowrap">{row.stage || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium">{row.soldToName}</div>
                        <div className="text-[10px] text-text-sec">{row.soldTo}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium">{row.shipToName}</div>
                        <div className="text-[10px] text-text-sec">{row.shipTo}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.custDoc || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        {(row.ticketQty || row.gasQty)?.toLocaleString() || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right">
                        {(row.billingDist || row.distance) ? `${row.billingDist || row.distance} km` : '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {row.product === 'LPG' ? (
                          row.cannotUnload
                            ? <span className="badge-pill bg-red-100 text-red-700">{'❌'}{t('settlement.gasUnload.cannot')}</span>
                            : <span className="badge-pill bg-green-100 text-green-700">{'✅'}{t('settlement.gasUnload.can')}</span>
                        ) : (
                          <span className="text-text-sec">-</span>
                        )}
                      </td>
                    </>
                  )}
                  <td className="px-3 py-2 whitespace-nowrap">{row.docDate || '-'}</td>
                </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-text-muted text-xs">
                    No shipments awaiting settlement
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateReportModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onReportCreated={onReportCreated} />
    </div>
  );
}
