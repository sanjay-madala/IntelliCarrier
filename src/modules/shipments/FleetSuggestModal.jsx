import { useState, useMemo } from 'react';
import Modal from '../../components/common/Modal';
import { FLEET_DATA, pCfg } from './shipmentConstants';

import { useLanguage } from '../../contexts/LanguageContext';
export default function FleetSuggestModal({ open, onClose, onSelect, product }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const pc = pCfg(product);

  const suggestions = useMemo(() => {
    return FLEET_DATA.filter(t => t.product === product && t.status === 'available');
  }, [product]);

  const handleConfirm = () => {
    if (selected) {
      onSelect({
        plate: selected.plate,
        trailer: selected.trailer,
        vehicleNo: selected.vehicleNo,
        type: selected.type,
      });
      setSelected(null);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('fleetSuggest.title')}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`px-4 py-1.5 rounded text-table font-medium ${
              selected ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {t('fleetSuggest.confirmSelection')}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {/* Info strip */}
        <div className="border-l-4 border-l-primary bg-blue-50 rounded-r px-4 py-2 text-table text-primary flex items-center gap-2">
          Showing trucks for: <strong>{pc.icon} {pc.label}</strong>
        </div>

        {/* Fleet Cards */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {suggestions.length === 0 && (
            <div className="text-center py-8 text-text-muted">{t('fleetSuggest.noAvailableTrucks')} {pc.label}</div>
          )}
          {suggestions.map(truck => (
            <button
              key={truck.id}
              onClick={() => setSelected(truck)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selected?.id === truck.id
                  ? 'border-primary bg-blue-50 shadow-sm ring-1 ring-primary'
                  : 'border-border-light hover:border-primary hover:bg-blue-50/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-primary text-sm">{pc.icon} {truck.plate}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {t('fleetSuggest.available')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-text-sec">
                <span>{t('fleetSuggest.trailer')}: {truck.trailer || '—'}</span>
                <span>{t('fleetSuggest.vehicle')}: {truck.vehicleNo}</span>
                <span>{t('fleetSuggest.type')}: {truck.type}</span>
                <span>{t('fleetSuggest.capacity')}: {truck.capacity}</span>
                <span>{t('fleetSuggest.location')}: {truck.location}</span>
                <span>{t('fleetSuggest.last')}: {truck.lastDate}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
