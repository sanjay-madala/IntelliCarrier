import { useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
export default function TMSModal({ onClose, onImport }) {
  const { t } = useLanguage();
  const [tmsSystem, setTmsSystem] = useState('TTMS — Thai Transport Management');
  const [dateFrom, setDateFrom] = useState('2026-02-01');
  const [dateTo, setDateTo] = useState('2026-02-02');
  const [buFilter, setBuFilter] = useState('');
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);

  const handleFetch = () => {
    setFetching(true);
    setResult(null);
    setTimeout(() => {
      const count = Math.floor(Math.random() * 4) + 1;
      const newOrders = [];
      for (let i = 0; i < count; i++) {
        newOrders.push({
          id: `FO-2026-${String(100 + i).padStart(4, '0')}`,
          source: 'TMS API',
          bu: buFilter || 'SCC',
          shipmentType: '0603 — Chemical',
          productType: 'Chemical',
          customerName: `TMS Customer ${i + 1}`,
          customerEmail: 'tms@example.com',
          customerPhone: '+66 2 XXX',
          route: 'MTP-BKK',
          wbs: '025.MTP.TMS.AUTO',
          shippingType: '01 - Truck',
          pickupAddress: 'TMS Origin',
          deliveryAddress: 'TMS Destination',
          products: [{ name: 'Chemical Product', quantity: 28000, unit: 'KG', weight: 28000 }],
          totalWeight: 28000,
          totalVolume: 35,
          requestedPickupDate: '2026-02-05',
          requestedDeliveryDate: '2026-02-05',
          specialInstructions: 'Imported from TMS API',
          status: 'PENDING_REVIEW',
          ocrConfidence: null,
          createdAt: new Date().toLocaleString(),
          createdBy: 'System (TMS API)',
          language: null,
          originalDocument: null,
          reviewedBy: null,
          reviewedAt: null,
          approver: null,
          approverComments: null,
          estimatedValue: Math.floor(Math.random() * 80000 + 30000),
        });
      }
      setResult({ count, orders: newOrders });
      setFetching(false);
    }, 2000);
  };

  const handleImport = () => {
    if (result && result.orders) {
      onImport(result.orders);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[2000] overflow-y-auto p-4"
      onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b border-[#d9d9d9] sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold">🔗 {t('tmsModal.title')}</h2>
            <p className="text-xs text-[#6a6d70] mt-0.5">{t('tmsModal.subtitle')}</p>
          </div>
          <button onClick={onClose} className="text-xl text-[#89919a] hover:text-[#32363a] p-1">✕</button>
        </div>
        {/* Body */}
        <div className="p-6">
          <div className="p-3 rounded-md text-sm flex items-center gap-2 mb-4 bg-[#ebf5ff] border-l-[3px] border-[#0854a0] text-[#1a4971]">
            ℹ️ {t('tmsModal.apiInfo')}
          </div>
          <div className="space-y-3">
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-medium text-[#6a6d70]">{t('tmsModal.tmsSystem')}</label>
              <select className="fc" value={tmsSystem} onChange={e => setTmsSystem(e.target.value)}>
                <option>TTMS — Thai Transport Management</option>
                <option>SAP TM — S/4HANA</option>
                <option>Custom API Endpoint</option>
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-medium text-[#6a6d70]">{t('tmsModal.dateRange')}</label>
              <div className="flex gap-2">
                <input type="date" className="fc flex-1" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                <input type="date" className="fc flex-1" value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-medium text-[#6a6d70]">{t('tmsModal.buFilter')}</label>
              <select className="fc" value={buFilter} onChange={e => setBuFilter(e.target.value)}>
                <option value="">{t('freightOrders.filters.allBU')}</option>
                <option>SCC</option>
                <option>SCA</option>
                <option>SPL</option>
                <option>SCM</option>
              </select>
            </div>
          </div>
          <div className="text-center mt-4">
            <button onClick={handleFetch} disabled={fetching}
              className="px-4 py-2 text-xs rounded bg-[#0854a0] text-white hover:bg-[#0a6ed1] font-medium disabled:opacity-50">
              {fetching ? '⏳ ' + t('tmsModal.fetching') : '🔗 ' + t('tmsModal.fetchFromTMS')}
            </button>
          </div>
          {result && (
            <div className="mt-4 p-3 rounded-md text-sm flex items-center gap-2 bg-[#e8f5e9] border-l-[3px] border-[#107e3e] text-[#1b5e20]">
              ✅ {t('tmsModal.foundOrders').replace('{0}', result.count)}
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-[#d9d9d9] sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]">{t('common.close')}</button>
          {result && (
            <button onClick={handleImport}
              className="px-4 py-1.5 text-xs rounded bg-[#107e3e] text-white hover:bg-[#0d6b34] font-medium">
              ✅ {t('tmsModal.importOrders').replace('{0}', result.count)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
