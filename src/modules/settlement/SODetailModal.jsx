import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { formatCurrency } from '../../utils/helpers';

import { useLanguage } from '../../contexts/LanguageContext';
export default function SODetailModal({ open, onClose, salesOrder, onPostToSAP, postingId }) {
  const { t } = useLanguage();
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !salesOrder) return null;

  const isPosting = postingId === salesOrder.id;
  const isPending = salesOrder.status === 'pending';

  return createPortal(
    <div className="fixed inset-0 z-[600] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col">
        {/* Header - Blue Gradient */}
        <div
          className="rounded-t-lg px-5 py-3 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #2196f3, #1565c0)' }}
        >
          <div>
            <h3 className="text-base font-bold text-white">{'📋'} {t('settlement.soDetail.title')}</h3>
            <p className="text-[10px] text-white/70">{t('settlement.soDetail.soPrefix')}: {salesOrder.soNo}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* 3-col Info Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-text-sec block text-[10px]">{t('settlement.soDetail.soNumber')}</span>
              <span className="font-mono font-bold text-primary">{salesOrder.soNo}</span>
            </div>
            <div>
              <span className="text-text-sec block text-[10px]">{t('settlement.soDetail.report')}</span>
              <span className="font-mono text-purple-700">{salesOrder.reportNo}</span>
            </div>
            <div>
              <span className="text-text-sec block text-[10px]">{t('settlement.soDetail.product')}</span>
              <span className={`badge-pill ${salesOrder.product === 'LPG' ? 'badge-lpg' : 'badge-ngv'}`}>
                {salesOrder.product === 'LPG' ? '🔥' : '🟢'} {salesOrder.product}
              </span>
            </div>
            <div>
              <span className="text-text-sec block text-[10px]">{t('settlement.soDetail.soldTo')}</span>
              <div className="font-medium">{salesOrder.soldToName}</div>
              <div className="text-[10px] text-text-sec">{salesOrder.soldTo}</div>
            </div>
            <div>
              <span className="text-text-sec block text-[10px]">{t('settlement.soDetail.soType')}</span>
              <span className="badge-pill bg-orange-100 text-orange-700">{salesOrder.soType}</span>
            </div>
            <div>
              <span className="text-text-sec block text-[10px]">{t('settlement.soDetail.sapStatus')}</span>
              {salesOrder.status === 'posted' ? (
                <span className="badge-pill bg-green-100 text-green-700">{'✅'} {t('settlement.status.posted')}</span>
              ) : isPosting ? (
                <span className="badge-pill bg-blue-100 text-blue-700">{'⏳'} {t('settlement.postToSAP.posting')}</span>
              ) : (
                <span className="badge-pill bg-yellow-100 text-yellow-700">{'⏳'} {t('settlement.status.pending')}</span>
              )}
            </div>
          </div>

          {/* Post to SAP action banner (if pending) */}
          {isPending && (
            <div
              className="rounded-lg px-4 py-3 flex items-center justify-between border-2"
              style={{ borderColor: '#9c27b0', background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{'🚀'}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#7b1fa2' }}>
                    {t('settlement.postToSAP.readyTitle')}
                  </div>
                  <div className="text-xs" style={{ color: '#9c27b0' }}>
                    {t('settlement.postToSAP.readyDesc')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onPostToSAP && onPostToSAP(salesOrder)}
                disabled={isPosting}
                className="px-4 py-2 rounded text-white text-xs font-medium disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)' }}
              >
                {isPosting ? t('settlement.postToSAP.posting') : t('settlement.postToSAP.button')}
              </button>
            </div>
          )}

          {/* Rows Stamped Table */}
          <div>
            <h4 className="text-xs font-semibold text-text mb-2">{t('settlement.soDetail.rowsStamped')}</h4>
            <div className="overflow-x-auto border border-border-light rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.shipment')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.soldTo')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.createModal.shipToName')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.soDetail.custDoc')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.soDetail.quantity')}</th>
                    <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.soNo')}</th>
                  </tr>
                </thead>
                <tbody>
                  {salesOrder.rows?.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border-light border-l-4 border-l-green-500 hover:bg-green-50/30"
                    >
                      <td className="px-3 py-2 font-mono text-primary">{row.shipmentNo || '-'}</td>
                      <td className="px-3 py-2">{row.soldTo || salesOrder.soldTo}</td>
                      <td className="px-3 py-2">{row.shipToName}</td>
                      <td className="px-3 py-2">{row.custDoc || '-'}</td>
                      <td className="px-3 py-2 text-right">{row.qty?.toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <span className="badge-pill bg-green-100 text-green-700 font-mono">
                          {row.soNo || salesOrder.soNo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-medium">
                    <td colSpan={4} className="px-3 py-2 text-right">{t('cashAdvance.total')}</td>
                    <td className="px-3 py-2 text-right">{salesOrder.rows?.reduce((s, r) => s + (r.qty || 0), 0).toLocaleString()}</td>
                    <td className="px-3 py-2 font-bold">{formatCurrency(salesOrder.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3 rounded-b-lg flex justify-end gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] text-xs font-medium hover:bg-[#e8e8e8] flex items-center gap-1"
          >
            {'🖨️'} {t('common.print') || 'Print'}
          </button>
          {isPending && (
            <button
              onClick={() => onPostToSAP && onPostToSAP(salesOrder)}
              disabled={isPosting}
              className="px-4 py-1.5 rounded text-white text-xs font-medium disabled:opacity-50 flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)' }}
            >
              {'🚀'} {isPosting ? t('settlement.postToSAP.posting') : t('settlement.postToSAP.button')}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-primary text-white text-xs font-medium hover:bg-primary-hover"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
