import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { generateId } from '../../utils/helpers';
import { createPortal } from 'react-dom';

import { useLanguage } from '../../contexts/LanguageContext';
export default function CreateReportModal({ open, onClose, onReportCreated }) {
  const { t } = useLanguage();
  const { state, dispatch } = useApp();
  const [filterProduct, setFilterProduct] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [filterRoute, setFilterRoute] = useState('');
  const [filterWbs, setFilterWbs] = useState('');
  const [filterCanUnload, setFilterCanUnload] = useState('');
  const [fromDate, setFromDate] = useState('2026-02-01');
  const [toDate, setToDate] = useState('2026-02-19');
  const [ngvRate, setNgvRate] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [searched, setSearched] = useState(false);

  const awaiting = useMemo(() => {
    if (!searched) return [];
    let list = state.awaitingSettlement.filter(a => a.status === 'awaiting');
    if (filterProduct) list = list.filter(a => a.product === filterProduct);
    if (filterSite) {
      list = list.filter(a => (a.route || '').startsWith(filterSite) || (a.wbs || '').includes(filterSite));
    }
    if (filterRoute) list = list.filter(a => a.route === filterRoute);
    if (filterCanUnload === 'yes') list = list.filter(a => a.cannotUnload === false);
    if (filterCanUnload === 'no') list = list.filter(a => a.cannotUnload === true);
    if (filterWbs) list = list.filter(a => (a.wbs || '').toLowerCase().includes(filterWbs.toLowerCase()));
    if (fromDate) list = list.filter(a => {
      const d = a.docDate || a.billingDate;
      return !d || d >= fromDate; // rows without dates pass the filter
    });
    if (toDate) list = list.filter(a => {
      const d = a.docDate || a.billingDate;
      return !d || d <= toDate; // rows without dates pass the filter
    });
    return list;
  }, [state.awaitingSettlement, filterProduct, filterSite, filterRoute, filterCanUnload, filterWbs, fromDate, toDate, searched]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === awaiting.length) setSelected(new Set());
    else setSelected(new Set(awaiting.map(a => a.id)));
  };

  const handleSearch = () => setSearched(true);

  const handleCreate = () => {
    const selectedRows = awaiting.filter(a => selected.has(a.id));
    if (!selectedRows.length) return;

    const product = selectedRows[0].product;
    if (product === 'NGV' && (!ngvRate || parseFloat(ngvRate) <= 0)) {
      window.alert(t('settlement.createModal.ngvRateRequired') || 'NGV Rate is required for NGV reports');
      return;
    }

    const reportId = generateId('RPT');
    const total = selectedRows.reduce((s, r) => s + (r.billingQty || r.totalCost || 0), 0);

    dispatch({
      type: 'ADD_SETTLEMENT_REPORT',
      payload: {
        id: reportId,
        reportNo: reportId,
        product,
        period: `${fromDate} to ${toDate}`,
        site: filterSite || 'All',
        status: 'pending_so',
        rows: selectedRows.length,
        total,
        soNumbers: [],
        ngvRate: product === 'NGV' ? parseFloat(ngvRate) || 0 : undefined,
        items: selectedRows.map(r => ({ ...r, status: 'in_report' })),
      },
    });

    selectedRows.forEach(r => {
      dispatch({ type: 'UPDATE_AWAITING', payload: { id: r.id, status: 'in_report' } });
    });

    const createdReport = {
      id: reportId,
      reportNo: reportId,
      product,
      period: `${fromDate} to ${toDate}`,
      site: filterSite || 'All',
      status: 'pending_so',
      rows: selectedRows.length,
      total,
      soNumbers: [],
      ngvRate: product === 'NGV' ? parseFloat(ngvRate) || 0 : undefined,
      items: selectedRows.map(r => ({ ...r, status: 'in_report' })),
    };

    setSelected(new Set());
    setSearched(false);
    onClose();
    onReportCreated?.(createdReport);
  };

  const handleClose = () => {
    setSelected(new Set());
    setSearched(false);
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[600] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header - Orange Gradient */}
        <div
          className="rounded-t-lg px-5 py-3 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #ff9800, #f57c00)' }}
        >
          <div>
            <h3 className="text-base font-bold text-white">{'📋'} {t('settlement.createReport')}</h3>
            <p className="text-[10px] text-white/70">{t('settlement.createModal.subtitle')}</p>
          </div>
          <button onClick={handleClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Filters Section */}
          <div className="grid grid-cols-3 gap-3">
            {/* Site */}
            <div>
              <label className="block text-[10px] text-text-sec font-medium mb-1">{t('settlement.createModal.site')}</label>
              <select
                value={filterSite}
                onChange={e => setFilterSite(e.target.value)}
                className="w-full border border-border rounded px-3 py-1.5 text-xs"
              >
                <option value="">{t('common.all')}</option>
                <option value="BPK">BPK</option>
                <option value="SRB">SRB</option>
                <option value="MTP">MTP</option>
              </select>
            </div>
            {/* From Date */}
            <div>
              <label className="block text-[10px] text-text-sec font-medium mb-1">{t('settlement.createModal.fromDate')}</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="w-full border border-border rounded px-3 py-1.5 text-xs"
              />
            </div>
            {/* To Date */}
            <div>
              <label className="block text-[10px] text-text-sec font-medium mb-1">{t('settlement.createModal.toDate')}</label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="w-full border border-border rounded px-3 py-1.5 text-xs"
              />
            </div>
            {/* Product */}
            <div>
              <label className="block text-[10px] text-text-sec font-medium mb-1">{t('settlement.createModal.product')}</label>
              <select
                value={filterProduct}
                onChange={e => { setFilterProduct(e.target.value); setSelected(new Set()); setSearched(false); }}
                className="w-full border border-border rounded px-3 py-1.5 text-xs"
              >
                <option value="">{t('common.all')}</option>
                <option value="LPG">LPG</option>
                <option value="NGV">NGV</option>
                <option value="FUEL">FUEL</option>
                <option value="CHEM">Chemical</option>
                <option value="CONTAINER">Container</option>
                <option value="SCA">SCA</option>
              </select>
            </div>
            {/* Route */}
            <div>
              <label className="block text-[10px] text-text-sec font-medium mb-1">{t('settlement.createModal.route')}</label>
              <select
                value={filterRoute}
                onChange={e => setFilterRoute(e.target.value)}
                className="w-full border border-border rounded px-3 py-1.5 text-xs"
              >
                <option value="">{t('common.all')}</option>
                <option value="0C3415">0C3415</option>
                <option value="0C2801">0C2801</option>
                <option value="0N2001">0N2001</option>
              </select>
            </div>
            {/* WBS */}
            <div>
              <label className="block text-[10px] text-text-sec font-medium mb-1">{t('settlement.createModal.wbs')}</label>
              <input
                type="text"
                value={filterWbs}
                onChange={e => setFilterWbs(e.target.value)}
                placeholder={t('settlement.createModal.wbsPlaceholder')}
                className="w-full border border-border rounded px-3 py-1.5 text-xs"
              />
            </div>
            {/* Can Unload */}
            <div>
              <label className="block text-[10px] text-text-sec font-medium mb-1">{t('settlement.gasUnload.canUnload')}/{t('settlement.gasUnload.cannotShort')}</label>
              <select
                value={filterCanUnload}
                onChange={e => setFilterCanUnload(e.target.value)}
                className="w-full border border-border rounded px-3 py-1.5 text-xs"
              >
                <option value="">{t('common.all')}</option>
                <option value="no">{t('settlement.gasUnload.cannotUnload')}</option>
                <option value="yes">{t('settlement.gasUnload.canUnload')}</option>
              </select>
            </div>
            {/* NGV Rate */}
            <div>
              <label className="block text-[10px] text-text-sec font-medium mb-1">{t('settlement.reportDetail.ngvRate')}</label>
              <input
                type="number"
                step="0.01"
                value={ngvRate}
                onChange={e => setNgvRate(e.target.value)}
                placeholder={t('settlement.createModal.ngvRatePlaceholder')}
                className="w-full border-2 border-orange-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>
            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full px-3 py-1.5 rounded text-white text-xs font-medium"
                style={{ background: 'linear-gradient(135deg, #2196f3, #1565c0)' }}
              >
                {'🔍'} {t('common.search')}
              </button>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-text">{'📦'} {t('settlement.createModal.selectShipTos')}</h4>
                <span className="text-[10px] text-text-sec">{awaiting.length} {t('settlement.createModal.rowsFound')}, {selected.size} {t('settlement.createModal.selected')}</span>
              </div>

              {/* Checkbox table */}
              <div className="overflow-x-auto border border-border-light rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-border">
                      <th className="px-3 py-2 w-8">
                        <input
                          type="checkbox"
                          checked={selected.size === awaiting.length && awaiting.length > 0}
                          onChange={toggleAll}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.shipment')}</th>
                      <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.stage')}</th>
                      <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.shipTo')}</th>
                      <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.createModal.shipToName')}</th>
                      <th className="text-left px-3 py-2 font-medium text-text-sec">{t('shipments.table.product')}</th>
                      <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.createModal.volume')}</th>
                      <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.billingDist')}</th>
                      <th className="text-left px-3 py-2 font-medium text-text-sec">{t('settlement.table.gasUnload')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awaiting.map(row => (
                      <tr
                        key={row.id}
                        onClick={() => toggleSelect(row.id)}
                        className={`border-b border-border-light cursor-pointer transition-colors
                          ${selected.has(row.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-3 py-2">
                          <input type="checkbox" checked={selected.has(row.id)} readOnly className="rounded" />
                        </td>
                        <td className="px-3 py-2 font-mono text-primary">{row.shipmentNo}</td>
                        <td className="px-3 py-2">{row.stage || '-'}</td>
                        <td className="px-3 py-2">{row.shipTo}</td>
                        <td className="px-3 py-2">{row.shipToName}</td>
                        <td className="px-3 py-2">
                          <span className={`badge-pill ${row.product === 'LPG' ? 'badge-lpg' : 'badge-ngv'}`}>
                            {row.product}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">{(row.ticketQty || row.gasQty)?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{(row.billingDist || row.distance)} km</td>
                        <td className="px-3 py-2">
                          {row.product === 'LPG' ? (
                            row.cannotUnload
                              ? <span className="badge-pill bg-red-100 text-red-700">{'❌'}</span>
                              : <span className="badge-pill bg-green-100 text-green-700">{'✅'}</span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                    {awaiting.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center py-6 text-text-muted text-xs">
                          {t('settlement.createModal.noRowsMatch')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {selected.size > 0 && (
                    <tfoot>
                      <tr className="bg-blue-50 font-semibold text-xs border-t-2 border-primary">
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2 text-primary">{selected.size} selected</td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2 text-right text-primary">
                          {awaiting.filter(r => selected.has(r.id)).reduce((s, r) => s + (r.ticketQty || r.gasQty || 0), 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-right text-primary">
                          {awaiting.filter(r => selected.has(r.id)).reduce((s, r) => s + (r.billingDist || r.distance || 0), 0)} km
                        </td>
                        <td className="px-3 py-2"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3 rounded-b-lg flex justify-end gap-2 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded border border-border text-xs text-text-sec hover:bg-white"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleCreate}
            disabled={selected.size === 0}
            className="px-4 py-1.5 rounded text-white text-xs font-medium disabled:opacity-50"
            style={{ background: selected.size > 0 ? 'linear-gradient(135deg, #4caf50, #388e3c)' : '#ccc' }}
          >
            {'✅'} {t('settlement.createModal.createButton')} ({selected.size})
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
