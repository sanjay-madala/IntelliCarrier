import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency, generateId } from '../../utils/helpers';
import { lpgCols, ngvCols, tugHeaderCols, tugItemCols, tugPricingZtable1, tugPricingZtable2 } from '../../data/mockData';
import ColumnSettingsModal from './ColumnSettingsModal';

export default function ReportDetailTab({ report, onBack }) {
  const { language, t } = useLanguage();
  const { dispatch } = useApp();
  const [showColSettings, setShowColSettings] = useState(false);
  const [columns, setColumns] = useState(
    report?.product === 'TUG' ? [...tugHeaderCols] :
    report?.product === 'LPG' ? [...lpgCols] : [...ngvCols]
  );
  const [expandedHeaders, setExpandedHeaders] = useState(new Set());

  if (!report) {
    return (
      <div className="text-center py-10 text-text-muted text-xs">
        {t('settlement.reportDetail.selectReport')}
      </div>
    );
  }

  const visibleCols = columns.filter(c => c.show);
  const isPosted = report.status === 'so_posted';

  const handleCreateSO = () => {
    const items = report.items || [];
    const allSOs = [];

    if (report.product === 'TUG') {
      // TUG: Group by salesNo
      const groups = {};
      items.forEach(item => {
        const key = item.salesNo || 'unknown';
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      });

      Object.entries(groups).forEach(([salesNo, groupItems]) => {
        const soNo = `TUG-SO-${String(Date.now()).slice(-3)}-${allSOs.length + 1}`;
        const tugTotal = groupItems.reduce((s, r) => {
          const itemsTotal = (r.items || []).reduce((is, it) => is + (it.amount || 0), 0);
          return s + itemsTotal;
        }, 0);
        allSOs.push({
          id: generateId('SO'),
          soNo,
          reportNo: report.reportNo,
          product: 'TUG',
          soldTo: groupItems[0].soldTo || '',
          soldToName: groupItems[0].soldToName || '',
          soType: `Sales: ${salesNo}`,
          total: tugTotal,
          status: 'pending',
          created: new Date().toISOString().split('T')[0],
          numRows: groupItems.length,
          rows: groupItems.map(item => ({
            shipmentNo: item.shipmentNo || item.orderId,
            soldTo: item.soldTo,
            shipToName: item.vessel || item.soldToName,
            custDoc: item.orderId || '-',
            qty: (item.items || []).length,
            soNo,
          })),
        });
      });
    } else if (report.product === 'LPG') {
      // LPG: Group by soldTo + cannotUnload (canGas vs cannotGas)
      const groups = {};
      items.forEach(item => {
        const key = `${item.soldTo || 'unknown'}_${item.cannotUnload ? 'no' : 'yes'}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      });

      Object.entries(groups).forEach(([key, groupItems]) => {
        const canGas = key.endsWith('_yes');
        const soNo = `80979-${String(Date.now()).slice(-3)}-${allSOs.length + 1}`;
        allSOs.push({
          id: generateId('SO'),
          soNo,
          reportNo: report.reportNo,
          product: 'LPG',
          soldTo: groupItems[0].soldTo || '',
          soldToName: groupItems[0].soldToName || '',
          soType: canGas ? t('settlement.gasUnload.canUnload') : t('settlement.gasUnload.cannotUnload'),
          total: groupItems.reduce((s, r) => s + (r.billingQty || r.totalCost || 0), 0),
          status: 'pending',
          created: new Date().toISOString().split('T')[0],
          numRows: groupItems.length,
          rows: groupItems.map(item => ({
            shipmentNo: item.shipmentNo,
            soldTo: item.soldTo,
            shipToName: item.shipToName,
            custDoc: item.custDoc || '-',
            qty: item.billingQty || item.gasQty,
            soNo,
          })),
        });
      });
    } else {
      // NGV: Split by distance threshold (≤200km vs >200km), max 2 SO
      const near = items.filter(it => (it.billingDist || it.distance || 0) <= 200);
      const far = items.filter(it => (it.billingDist || it.distance || 0) > 200);

      [{ bucket: near, label: '≤200km' }, { bucket: far, label: '>200km' }].forEach(({ bucket, label }) => {
        if (bucket.length === 0) return;
        const soNo = `21060-${String(Date.now()).slice(-3)}-${allSOs.length + 1}`;
        allSOs.push({
          id: generateId('SO'),
          soNo,
          reportNo: report.reportNo,
          product: 'NGV',
          soldTo: bucket[0].soldTo || '',
          soldToName: bucket[0].soldToName || '',
          soType: label,
          total: bucket.reduce((s, r) => s + (r.gasQty || r.totalCost || 0), 0),
          status: 'pending',
          created: new Date().toISOString().split('T')[0],
          numRows: bucket.length,
          rows: bucket.map(item => ({
            shipmentNo: item.shipmentNo,
            soldTo: item.soldTo,
            shipToName: item.shipToName,
            custDoc: item.custDoc || '-',
            qty: item.gasQty || item.billingQty,
            soNo,
          })),
        });
      });
    }

    // Stamp SO numbers back onto report items
    const soNoMap = {};
    allSOs.forEach(so => {
      so.rows.forEach(r => { soNoMap[r.shipmentNo] = so.soNo; });
    });

    if (allSOs.length === 0) {
      window.alert('⚠️ No Sales Orders could be created. Please check report items.');
      return;
    }

    dispatch({ type: 'ADD_SALES_ORDERS', payload: allSOs });
    dispatch({
      type: 'UPDATE_REPORT',
      payload: {
        id: report.id,
        status: 'so_posted',
        soNumbers: allSOs.map(so => so.soNo),
        items: items.map(item => ({ ...item, soNo: soNoMap[item.shipmentNo] || item.soNo })),
      },
    });

    window.alert(`✅ ${allSOs.length} Sales Order(s) created!\n\n${allSOs.map(so => `${so.soNo} — ${so.soType} (${so.numRows} rows)`).join('\n')}\n\nSO numbers have been stamped back to the report.`);
  };

  // Grouped SO stamps
  const soGroups = {};
  report.items?.forEach(item => {
    if (item.soNo) {
      if (!soGroups[item.soNo]) soGroups[item.soNo] = [];
      soGroups[item.soNo].push(item);
    }
  });

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button onClick={onBack} className="text-primary hover:text-primary-hover text-xs flex items-center gap-1">
        {'←'} {t('settlement.reportDetail.backToReports')}
      </button>

      {/* Report Header - Green Gradient */}
      <div
        className="rounded-lg p-4 text-white shadow-sm"
        style={{ background: 'linear-gradient(135deg, #43a047, #2e7d32)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            {'📋'} {report.reportNo}
            <span className={`badge-pill text-[10px] ${isPosted ? 'bg-white/20 text-white' : 'bg-yellow-300 text-yellow-900'}`}>
              {isPosted ? '✅ ' + t('common.status.soPosted') : '⏳ ' + t('common.status.pendingSO')}
            </span>
          </h2>
          <span className={`badge-pill ${report.product === 'LPG' ? 'bg-red-500/20 text-white' : report.product === 'TUG' ? 'bg-teal-300/20 text-white' : 'bg-green-300/20 text-white'}`}>
            {report.product === 'LPG' ? '🔥' : report.product === 'TUG' ? '🚢' : '🟢'} {report.product}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div>
            <span className="text-white/60">{t('settlement.table.period')}</span>
            <div className="font-medium">{report.period}</div>
          </div>
          <div>
            <span className="text-white/60">{t('settlement.table.site')}</span>
            <div className="font-medium">{report.site}</div>
          </div>
          <div>
            <span className="text-white/60">{t('settlement.reportDetail.selectedRows')}</span>
            <div className="font-medium">{report.rows}</div>
          </div>
          <div>
            <span className="text-white/60">{t('settlement.table.status')}</span>
            <div className="font-medium">{isPosted ? t('common.status.soPosted') : t('common.status.pendingSO')}</div>
          </div>
          {report.product === 'NGV' && report.ngvRate && (
            <div>
              <span className="text-white/60">{t('settlement.reportDetail.ngvRate')}</span>
              <div className="font-medium">{report.ngvRate} {t('settlement.reportDetail.ngvRateUnit')}</div>
            </div>
          )}
        </div>
      </div>

      {/* SO Split Rules */}
      <div className="rounded-lg px-4 py-3 text-xs border border-yellow-300" style={{ background: '#fffde7' }}>
        <h4 className="font-bold text-yellow-900 mb-1">{'📐'} {t('settlement.reportDetail.soSplitRules')}</h4>
        {report.product === 'TUG' ? (
          <ul className="text-yellow-800 space-y-0.5 list-disc list-inside">
            <li>{t('settlement.splitRules.tug.rule1') || 'Group by Sales No. — each Sales No. becomes one SO'}</li>
            <li>{t('settlement.splitRules.tug.rule2') || 'Amount = GRT × Price/Unit (min price applies)'}</li>
            <li>{t('settlement.splitRules.tug.rule3') || 'Discount from Ztable2 applies based on site/job type/date'}</li>
          </ul>
        ) : report.product === 'LPG' ? (
          <ul className="text-yellow-800 space-y-0.5 list-disc list-inside">
            <li>{t('settlement.splitRules.lpg.rule1')}</li>
            <li>{t('settlement.splitRules.lpg.rule2')}</li>
            <li>{t('settlement.splitRules.lpg.rule3')}</li>
          </ul>
        ) : (
          <ul className="text-yellow-800 space-y-0.5 list-disc list-inside">
            <li>Split by distance: &gt;200km vs {'≤'}200km</li>
            <li>{t('settlement.splitRules.ngv.rule2')}</li>
            <li>{t('settlement.splitRules.ngv.rule3')}</li>
          </ul>
        )}
      </div>

      {/* Report Data Panel */}
      <div className="bg-white rounded-lg border border-border-light shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-border-light px-4 py-2.5 flex items-center gap-2 flex-wrap bg-gray-50">
          <button
            onClick={() => setShowColSettings(true)}
            className="px-3 py-1.5 rounded border border-border text-xs text-text-sec hover:bg-white flex items-center gap-1"
          >
            {'⚙️'} {t('settlement.columnSettings')}
          </button>
          <button
            onClick={() => {
              // Generate CSV from report items
              if (!report.items?.length) return;
              const headers = visibleCols.map(c => language === 'th' ? c.labelTh : c.label).join(',');
              const rows = report.items.map(item => visibleCols.map(c => {
                const val = c.key === 'no' ? '' : (item[c.key] ?? '');
                return `"${String(val).replace(/"/g, '""')}"`;
              }).join(',')).join('\n');
              const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `${report.reportNo}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-3 py-1.5 rounded border border-border text-xs text-text-sec hover:bg-white flex items-center gap-1"
          >
            {'📊'} {t('settlement.exportExcel')}
          </button>
          {!isPosted && (
            <button
              onClick={handleCreateSO}
              className="px-3 py-1.5 rounded text-white text-xs font-medium flex items-center gap-1 ml-auto"
              style={{ background: 'linear-gradient(135deg, #2196f3, #1565c0)' }}
            >
              {'📋'} {t('settlement.createSalesOrder')}
            </button>
          )}
        </div>

        {/* Dynamic Column Table */}
        <div className="overflow-x-auto">
          {report.product === 'TUG' ? (
            /* TUG Two-Level Expandable Table */
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="px-2 py-2 w-8"></th>
                  {visibleCols.map(col => (
                    <th key={col.key} className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">
                      {language === 'th' ? col.labelTh : col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.items?.map((header, i) => {
                  const hasSO = !!header.soNo;
                  const isExpanded = expandedHeaders.has(header.id || header.orderId);
                  const toggleExpand = () => {
                    setExpandedHeaders(prev => {
                      const next = new Set(prev);
                      const key = header.id || header.orderId;
                      if (next.has(key)) next.delete(key); else next.add(key);
                      return next;
                    });
                  };
                  const headerTotal = (header.items || []).reduce((s, it) => s + (it.amount || 0), 0);

                  return (
                    <>{/* Header Row */}
                    <tr
                      key={`h-${i}`}
                      onClick={toggleExpand}
                      className={`border-b cursor-pointer transition-colors font-semibold
                        ${hasSO
                          ? 'border-l-4 border-l-green-500 bg-green-50/30 hover:bg-green-50/60'
                          : 'border-l-4 border-l-teal-500 bg-teal-50/30 hover:bg-teal-50/60'
                        } border-b-border-light`}
                    >
                      <td className="px-2 py-2 text-center">
                        <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                      </td>
                      {visibleCols.map(col => (
                        <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                          {col.key === 'no' ? i + 1 :
                           col.key === 'grt' ? (header.grt?.toLocaleString() ?? '—') :
                           col.key === 'activityOperation' ? (
                             <span className="badge-pill bg-teal-50 text-teal-700">{header.activityOperation}</span>
                           ) :
                           (header[col.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                    {/* Expanded Item Rows */}
                    {isExpanded && (header.items || []).map((item, j) => {
                      const itemVisibleCols = tugItemCols.filter(c => c.show);
                      return (
                        <tr
                          key={`i-${i}-${j}`}
                          className="border-b border-b-border-light bg-white hover:bg-gray-50/50"
                        >
                          <td className="px-2 py-1.5"></td>
                          <td colSpan={visibleCols.length} className="px-3 py-1.5">
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                              <span><span className="text-text-sec">Item:</span> {item.itemNo}</span>
                              <span><span className="text-text-sec">Mat:</span> {item.matNo}</span>
                              <span className="font-medium">{item.matDescription}</span>
                              <span><span className="text-text-sec">Qty:</span> {item.qty} {item.uom}</span>
                              <span><span className="text-text-sec">WBS:</span> {item.wbsNo}</span>
                              <span><span className="text-text-sec">{language === 'th' ? 'ชม.จริง' : 'Actual Hr'}:</span> {item.actualHour}</span>
                              <span><span className="text-text-sec">{language === 'th' ? 'ชม.เรียกเก็บ' : 'Billing Hr'}:</span> {item.billingHour}</span>
                              <span>
                                <span className="text-text-sec">Status:</span>{' '}
                                <span className={`badge-pill ${item.itemStatus === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {item.itemStatus}
                                </span>
                              </span>
                              <span><span className="text-text-sec">{language === 'th' ? 'เริ่ม' : 'Start'}:</span> {item.startDate} {item.startTime}</span>
                              <span><span className="text-text-sec">{language === 'th' ? 'สิ้นสุด' : 'End'}:</span> {item.endDate} {item.endTime}</span>
                              <span className="font-bold text-teal-700">
                                <span className="text-text-sec">{language === 'th' ? 'จำนวนเงิน' : 'Amount'}:</span> {formatCurrency(item.amount)}
                              </span>
                              <span><span className="text-text-sec">Price/Unit:</span> {item.pricePerUnit}</span>
                              {item.comCompanyPct > 0 && (
                                <span><span className="text-text-sec">{language === 'th' ? 'คอม.บริษัท' : 'Com.Co'}:</span> {item.comCompanyPct}%</span>
                              )}
                              {item.comPersonPct > 0 && (
                                <span><span className="text-text-sec">{language === 'th' ? 'คอม.บุคคล' : 'Com.Person'}:</span> {item.comPersonPct}%</span>
                              )}
                              {item.discountPct > 0 && (
                                <span><span className="text-text-sec">{language === 'th' ? 'ส่วนลด' : 'Discount'}:</span> {item.discountPct}%</span>
                              )}
                              {item.remark && (
                                <span className="text-text-muted italic">{item.remark}</span>
                              )}
                            </div>
                            {/* Time stages mini-timeline */}
                            {(item.stageStart || item.stageEnd) && (
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-text-sec">
                                <span className="font-medium">{language === 'th' ? 'ขั้นตอนเวลา' : 'Time Stages'}:</span>
                                {item.stageStart && <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">Start {item.stageStart}</span>}
                                {item.stageStandBy1 && <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">SB1 {item.stageStandBy1}</span>}
                                {item.stageWorking1 && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">W1 {item.stageWorking1}</span>}
                                {item.stageStandBy2 && <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">SB2 {item.stageStandBy2}</span>}
                                {item.stageWorking2 && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">W2 {item.stageWorking2}</span>}
                                {item.stageStandBy3 && <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700">SB3 {item.stageStandBy3}</span>}
                                {item.stageWorking3 && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">W3 {item.stageWorking3}</span>}
                                {item.stageEnd && <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700">End {item.stageEnd}</span>}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Header total row when expanded */}
                    {isExpanded && (
                      <tr key={`t-${i}`} className="border-b border-b-border-light bg-teal-50/50">
                        <td className="px-2 py-1.5"></td>
                        <td colSpan={visibleCols.length} className="px-3 py-1.5 text-right">
                          <span className="text-xs font-semibold text-teal-700">
                            {language === 'th' ? 'รวมคำสั่ง' : 'Order Total'}: {formatCurrency(headerTotal)}
                            {' '}({(header.items || []).length} {language === 'th' ? 'รายการ' : 'items'})
                          </span>
                        </td>
                      </tr>
                    )}
                    </>
                  );
                })}
              </tbody>
            </table>
          ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                {visibleCols.map(col => (
                  <th key={col.key} className="text-left px-3 py-2 font-medium text-text-sec whitespace-nowrap">
                    {language === 'th' ? col.labelTh : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.items?.map((item, i) => {
                const hasSO = !!item.soNo;
                return (
                  <tr
                    key={i}
                    className={`border-b transition-colors
                      ${hasSO
                        ? 'border-l-4 border-l-green-500 bg-green-50/30 hover:bg-green-50/60'
                        : 'border-l-4 border-l-orange-400 bg-orange-50/20 hover:bg-orange-50/40'
                      } border-b-border-light`}
                  >
                    {visibleCols.map(col => (
                      <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                        {col.key === 'no' ? i + 1 :
                         col.key === 'soNo' && item.soNo ? (
                           <span className="badge-pill bg-green-100 text-green-700 font-mono">{item.soNo}</span>
                         ) :
                         col.key === 'cannotUnload' ? (
                           item.cannotUnload
                             ? <span className="badge-pill bg-red-100 text-red-700">{'❌'}</span>
                             : <span className="badge-pill bg-green-100 text-green-700">{'✅'}</span>
                         ) :
                         col.key === 'billingQty' || col.key === 'actualQty' || col.key === 'ticketQty' || col.key === 'gasQty'
                           ? (item[col.key]?.toLocaleString() ?? '—')
                           : col.key === 'totalFreight' || col.key === 'grandTotal' || col.key === 'fuelSurcharge' || col.key === 'otherCharge' || col.key === 'totalCost' || col.key === 'stationCost'
                             ? (item[col.key] != null ? formatCurrency(item[col.key]) : '—')
                             : (item[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>

        {/* Summary */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-border-light flex items-center justify-between text-xs">
          <span className="text-text-sec">
            {report.rows} {t('settlement.reportDetail.rows')} | {visibleCols.length}/{columns.length} {t('settlement.reportDetail.colsVisible')}
          </span>
          <span className="font-bold">{t('common.total')}: {formatCurrency(report.total)}</span>
        </div>
      </div>

      {/* {t('settlement.reportDetail.soStampedBack')} Section */}
      {Object.keys(soGroups).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text">{'✅'} {t('settlement.reportDetail.soStampedBack')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(soGroups).map(([soNo, items]) => (
              <div key={soNo} className="rounded-lg border-2 border-green-300 bg-green-50/50 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-green-700 text-sm">{soNo}</span>
                  <span className="badge-pill bg-green-100 text-green-700">{items.length} {t('settlement.reportDetail.rows')}</span>
                </div>
                <div className="space-y-1 text-xs text-text-sec">
                  {items.map((it, j) => (
                    <div key={j} className="flex justify-between">
                      <span>{it.shipToName || it.soldToName}</span>
                      <span className="font-medium text-text">
                        {(it.billingQty || it.gasQty)?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ColumnSettingsModal
        open={showColSettings}
        onClose={() => setShowColSettings(false)}
        columns={columns}
        onChange={setColumns}
      />
    </div>
  );
}
