import { useState, useMemo } from 'react';
import Modal from '../../components/common/Modal';
import { FLEET_DATA } from './shipmentConstants';

import { useLanguage } from '../../contexts/LanguageContext';
export default function TruckSearchModal({ open, onClose, onSelect }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return FLEET_DATA;
    const q = search.toLowerCase();
    return FLEET_DATA.filter(t =>
      t.plate.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q) ||
      t.vehicleNo.toLowerCase().includes(q) ||
      t.trailer.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (truck) => {
    onSelect({
      plate: truck.plate,
      trailer: truck.trailer,
      vehicleNo: truck.vehicleNo,
      type: truck.type,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t('truckSearch.title')} size="lg">
      <div className="space-y-3">
        {/* Search Box */}
        <div className="flex border border-border rounded overflow-hidden">
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-table focus:outline-none"
          />
          <button className="px-3 bg-primary text-white text-sm">{t('truckSearch.search')}</button>
        </div>

        {/* Truck Table */}
        <div className="max-h-[350px] overflow-y-auto border border-border-light rounded">
          <table className="w-full text-table">
            <thead className="sticky top-0">
              <tr className="bg-gray-50 border-b border-border">
                <th className="text-left px-3 py-2 font-semibold text-text-sec">{t('truckSearch.truckPlate')}</th>
                <th className="text-left px-3 py-2 font-semibold text-text-sec">{t('truckSearch.trailer')}</th>
                <th className="text-left px-3 py-2 font-semibold text-text-sec">{t('truckSearch.vehicleNo')}</th>
                <th className="text-left px-3 py-2 font-semibold text-text-sec">{t('reportIn.table.type')}</th>
                <th className="text-left px-3 py-2 font-semibold text-text-sec">{t('freightOrders.table.status')}</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(truck => (
                <tr key={truck.id} className="border-b border-border-light hover:bg-blue-50/50">
                  <td className="px-3 py-2 font-mono font-semibold text-primary">{truck.plate}</td>
                  <td className="px-3 py-2">{truck.trailer || '—'}</td>
                  <td className="px-3 py-2">{truck.vehicleNo}</td>
                  <td className="px-3 py-2">{truck.type}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      truck.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {truck.status === 'available' ? t('truckSearch.available') : t('truckSearch.inUse')}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {truck.status === 'available' ? (
                      <button
                        onClick={() => handleSelect(truck)}
                        className="px-3 py-1 rounded bg-primary text-white text-xs font-medium hover:bg-primary-hover"
                      >
                        {t('truckSearch.select')}
                      </button>
                    ) : (
                      <button disabled className="px-3 py-1 rounded bg-gray-200 text-gray-500 text-xs cursor-not-allowed">
                        {t('truckSearch.inUse')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-6 text-text-muted">{t('truckSearch.noTrucksFound')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
