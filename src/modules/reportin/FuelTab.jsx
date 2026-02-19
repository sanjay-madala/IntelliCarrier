import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../utils/helpers';
import InfoStrip from '../../components/common/InfoStrip';

const fuelTypes = ['Diesel B7', 'NGV', 'Diesel B20'];
const fillTypes = ['Fleet Card', 'Cash'];

const FUEL_PRICE = 30.94;

export default function FuelTab({ shipment, onTotalChange }) {
  const { t } = useLanguage();
  const [fuelEntries, setFuelEntries] = useState([
    {
      id: 1,
      fillType: 'Fleet Card',
      station: 'PTT Station Km.45',
      fuelType: 'Diesel B7',
      liters: 120,
      amount: 120 * FUEL_PRICE,
      mileageBefore: shipment.lastTruckMiles,
      mileageAfter: shipment.lastTruckMiles + 150,
      fleetCardNo: `FC-${shipment.vehicleNo}`,
      receipt: true,
    },
  ]);

  const totalFuel = useMemo(() => ({
    liters: fuelEntries.reduce((s, e) => s + (e.liters || 0), 0),
    amount: fuelEntries.reduce((s, e) => s + (e.amount || 0), 0),
  }), [fuelEntries]);

  useEffect(() => { onTotalChange?.(totalFuel.amount); }, [totalFuel.amount, onTotalChange]);

  const addFuel = () => {
    setFuelEntries(prev => [...prev, {
      id: Date.now(),
      fillType: 'Fleet Card',
      station: '',
      fuelType: 'Diesel B7',
      liters: 0,
      amount: 0,
      mileageBefore: prev.length > 0 ? prev[prev.length - 1].mileageAfter : shipment.lastTruckMiles,
      mileageAfter: 0,
      fleetCardNo: `FC-${shipment.vehicleNo}`,
      receipt: false,
    }]);
  };

  const removeFuel = (id) => setFuelEntries(prev => prev.filter(e => e.id !== id));

  const updateFuel = (id, field, value) => {
    setFuelEntries(prev => prev.map(e => {
      if (e.id !== id) return e;
      const updated = { ...e, [field]: value };
      // Auto-calc amount when liters change
      if (field === 'liters') {
        updated.amount = Number(value) * FUEL_PRICE;
      }
      return updated;
    }));
  };

  const getConsumption = (entry) => {
    const dist = (entry.mileageAfter || 0) - (entry.mileageBefore || 0);
    if (dist > 0 && entry.liters > 0) {
      return (dist / entry.liters).toFixed(2);
    }
    return '—';
  };

  const inputClass = 'w-full border border-border rounded px-2.5 py-1.5 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted';

  return (
    <div className="space-y-5">
      {/* Info Strip */}
      <InfoStrip variant="info" icon={'⛽'}>
        <span className="font-medium">{t('fuel.infoStrip.title')}</span> {t('fuel.infoStrip.body')}
      </InfoStrip>

      {/* Vehicle Info Header with gradient */}
      <div
        className="rounded-lg p-4 flex flex-wrap gap-6"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)' }}
      >
        <div className="text-center">
          <div className="text-xs text-blue-200 uppercase tracking-wider">{'🚛'} {t('fuel.header.vehicle')}</div>
          <div className="text-white font-bold text-sm mt-0.5">{shipment.plate}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-blue-200 uppercase tracking-wider">{'📏'} {t('fuel.header.lastMileage')}</div>
          <div className="text-white font-bold text-sm mt-0.5">{shipment.lastTruckMiles?.toLocaleString()} km</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-blue-200 uppercase tracking-wider">{'⛽'} {t('fuel.header.fuelPrice')}</div>
          <div className="text-white font-bold text-sm mt-0.5">{'฿'}{FUEL_PRICE}/L</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-blue-200 uppercase tracking-wider">{'💳'} {t('fuel.header.fleetCard')}</div>
          <div className="text-white font-bold text-sm mt-0.5">FC-{shipment.vehicleNo}</div>
        </div>
      </div>

      {/* Fuel Entry Cards */}
      <div className="space-y-4">
        {fuelEntries.map((entry, i) => (
          <div key={entry.id} className="border border-border-light rounded-lg p-4 hover:shadow-sm transition-shadow">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-text">{t('fuel.entry.title')} #{i + 1}</span>
              </div>
              {fuelEntries.length > 1 && (
                <button onClick={() => removeFuel(entry.id)} className="text-error text-xs hover:text-red-700 font-medium transition-colors">
                  {t('fuel.entry.remove')}
                </button>
              )}
            </div>

            {/* Row 1: Fill Type, Station, Fuel Type, Liters, Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.fillType')}</label>
                <select
                  value={entry.fillType}
                  onChange={e => updateFuel(entry.id, 'fillType', e.target.value)}
                  className={inputClass}
                >
                  {fillTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.station')}</label>
                <input
                  value={entry.station}
                  onChange={e => updateFuel(entry.id, 'station', e.target.value)}
                  className={inputClass}
                  placeholder={t('fuel.form.stationPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.fuelType')}</label>
                <select
                  value={entry.fuelType}
                  onChange={e => updateFuel(entry.id, 'fuelType', e.target.value)}
                  className={inputClass}
                >
                  {fuelTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.liters')}</label>
                <input
                  type="number"
                  value={entry.liters}
                  onChange={e => updateFuel(entry.id, 'liters', Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.amount')}</label>
                <div className="relative">
                  <input
                    value={entry.amount?.toFixed(2) || '0.00'}
                    disabled
                    className={inputClass + ' pr-8 font-bold'}
                    style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">{'฿'}</span>
                </div>
              </div>
            </div>

            {/* Row 2: Mileage Before, Mileage After, Consumption, Fleet Card, Receipt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.mileageBefore')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={entry.mileageBefore}
                    onChange={e => updateFuel(entry.id, 'mileageBefore', Number(e.target.value))}
                    className={inputClass + ' pr-10'}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
                </div>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.mileageAfter')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={entry.mileageAfter}
                    onChange={e => updateFuel(entry.id, 'mileageAfter', Number(e.target.value))}
                    className={inputClass + ' pr-10'}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km</span>
                </div>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.consumption')}</label>
                <div className="relative">
                  <input
                    value={getConsumption(entry)}
                    disabled
                    className={inputClass + ' pr-12 font-bold'}
                    style={{ backgroundColor: '#fefce8', color: '#a16207' }}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">km/L</span>
                </div>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.fleetCardNo')}</label>
                <input
                  value={entry.fleetCardNo}
                  onChange={e => updateFuel(entry.id, 'fleetCardNo', e.target.value)}
                  disabled={entry.fillType === 'Cash'}
                  className={inputClass}
                  placeholder={entry.fillType === 'Cash' ? t('fuel.form.naCash') : 'FC-XXXX'}
                />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.receipt')}</label>
                <label className="flex items-center gap-2 mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={entry.receipt}
                    onChange={e => updateFuel(entry.id, 'receipt', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-table">{entry.receipt ? '📷 ' + t('fuel.form.receiptAttached') : t('fuel.form.noReceipt')}</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Fuel Display */}
      <div
        className="rounded-lg p-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)' }}
      >
        <div className="text-table text-text-sec">
          {t('common.total')}: <span className="font-bold text-text">{totalFuel.liters.toFixed(1)} {t('fuel.total.liters')}</span>
        </div>
        <div className="text-lg font-bold" style={{ color: '#0369a1' }}>
          {t('common.total')}: {formatCurrency(totalFuel.amount)}
        </div>
      </div>

      {/* Add Fuel Button */}
      <button
        onClick={addFuel}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded border-2 border-dashed border-primary/40 text-table text-primary hover:bg-primary/5 hover:border-primary/60 transition-colors font-medium"
      >
        {t('reportIn.form.addFuel')}
      </button>
    </div>
  );
}
