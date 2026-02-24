import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../utils/helpers';
import InfoStrip from '../../components/common/InfoStrip';

const fuelTypes = ['Diesel B7', 'Diesel B20', 'NGV', 'Gasohol 95', 'Gasohol 91'];
const fillTypes = ['Fleet Card', 'Cash', 'Credit', 'Store Fuel'];

const FUEL_PRICE = 30.94;

export default function FuelTab({ shipment, onTotalChange }) {
  const { t } = useLanguage();
  const [fuelEntries, setFuelEntries] = useState([
    {
      id: 1,
      date: new Date().toISOString().slice(0, 16),
      fillType: 'Fleet Card',
      site: shipment?.site || 'SCG',
      licensePlate: shipment?.plate || '',
      refiller: shipment?.driver1 || 'สมชาย พลเดช',
      billNo: '',
      milesBefore: shipment?.lastTruckMiles || 0,
      milesNotMatch: false,
      fleetCard: `FC-${shipment?.vehicleNo || 'V1001'}`,
      fuelType: 'Diesel B7',
      fuelAmount: 120,
      amount: 120 * FUEL_PRICE,
      gasStation: 'PTT Station Km.45',
      receiptFile: null,
      receiptName: 'fuel_receipt.jpg',
      // Store Fuel specific fields
      store: '',
      refillId: '',
      meterBefore: 0,
      meterAfter: 0,
    },
  ]);

  const totalFuel = useMemo(() => ({
    liters: fuelEntries.reduce((s, e) => s + (e.fuelAmount || 0), 0),
    amount: fuelEntries.reduce((s, e) => s + (e.amount || 0), 0),
  }), [fuelEntries]);

  useEffect(() => { onTotalChange?.(totalFuel.amount); }, [totalFuel.amount, onTotalChange]);

  const addFuel = () => {
    setFuelEntries(prev => [...prev, {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 16),
      fillType: 'Fleet Card',
      site: shipment?.site || 'SCG',
      licensePlate: shipment?.plate || '',
      refiller: shipment?.driver1 || '',
      billNo: '',
      milesBefore: prev.length > 0 ? prev[prev.length - 1].milesBefore : (shipment?.lastTruckMiles || 0),
      milesNotMatch: false,
      fleetCard: `FC-${shipment?.vehicleNo || 'V1001'}`,
      fuelType: 'Diesel B7',
      fuelAmount: 0,
      amount: 0,
      gasStation: '',
      receiptFile: null,
      receiptName: '',
      store: '',
      refillId: '',
      meterBefore: 0,
      meterAfter: 0,
    }]);
  };

  const removeFuel = (id) => setFuelEntries(prev => prev.filter(e => e.id !== id));

  const updateFuel = (id, field, value) => {
    setFuelEntries(prev => prev.map(e => {
      if (e.id !== id) return e;
      const updated = { ...e, [field]: value };
      // Auto-calc amount when fuelAmount changes
      if (field === 'fuelAmount') {
        updated.amount = Number(value) * FUEL_PRICE;
      }
      return updated;
    }));
  };

  const inputClass = 'w-full border border-border rounded px-2.5 py-1.5 text-table text-text focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-bg disabled:text-text-muted';

  return (
    <div className="space-y-5">
      {/* Info Strip */}
      <InfoStrip variant="info" icon={'⛽'}>
        <span className="font-medium">{t('fuel.infoStrip.title')}</span> {t('fuel.infoStrip.body')}
      </InfoStrip>

      {/* Vehicle Info Header */}
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
        {fuelEntries.map((entry, i) => {
          const isStoreFuel = entry.fillType === 'Store Fuel';
          return (
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

            {/* Row 1: Date, Fuel Record Type, Site, License Plate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.date')}</label>
                <input type="datetime-local" value={entry.date} onChange={e => updateFuel(entry.id, 'date', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.fillType')}</label>
                <select value={entry.fillType} onChange={e => updateFuel(entry.id, 'fillType', e.target.value)} className={inputClass}>
                  {fillTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.site')}</label>
                <input value={entry.site} onChange={e => updateFuel(entry.id, 'site', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.licensePlate')}</label>
                <input value={entry.licensePlate} onChange={e => updateFuel(entry.id, 'licensePlate', e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Row 2: Refiller, Bill No / Store+Bill (conditional), Miles Before */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.refiller')}</label>
                <input value={entry.refiller} onChange={e => updateFuel(entry.id, 'refiller', e.target.value)} className={inputClass} placeholder="Driver Name" />
              </div>
              {isStoreFuel ? (
                <>
                  <div>
                    <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.store')}</label>
                    <select value={entry.store} onChange={e => updateFuel(entry.id, 'store', e.target.value)} className={inputClass}>
                      <option value="">— Select —</option>
                      <option value="Store A">Store A</option>
                      <option value="Store B">Store B</option>
                      <option value="Store C">Store C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.billNo')}</label>
                    <input value={entry.billNo} onChange={e => updateFuel(entry.id, 'billNo', e.target.value)} className={inputClass} placeholder="Free text" />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.billNo')}</label>
                  <input value={entry.billNo} onChange={e => updateFuel(entry.id, 'billNo', e.target.value)} className={inputClass} placeholder="Free text" />
                </div>
              )}
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.milesBefore')}</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={entry.milesBefore} onChange={e => updateFuel(entry.id, 'milesBefore', Number(e.target.value))} className={inputClass} />
                  <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <input type="checkbox" checked={entry.milesNotMatch} onChange={e => updateFuel(entry.id, 'milesNotMatch', e.target.checked)} className="w-3.5 h-3.5" />
                    <span className="text-orange-600">{t('fuel.form.milesNotMatch')}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Store Fuel extra fields: Refill ID, Meter Before, Meter After */}
            {isStoreFuel && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.refillId')}</label>
                  <input value={entry.refillId} onChange={e => updateFuel(entry.id, 'refillId', e.target.value)} className={inputClass} placeholder="Free text" />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.meterBefore')}</label>
                  <input type="number" value={entry.meterBefore} onChange={e => updateFuel(entry.id, 'meterBefore', Number(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.meterAfter')}</label>
                  <input type="number" value={entry.meterAfter} onChange={e => updateFuel(entry.id, 'meterAfter', Number(e.target.value))} className={inputClass} />
                </div>
              </div>
            )}

            {/* Row 3: Fleet Card, Fuel Type, Fuel Amount, Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {!isStoreFuel && (
                <div>
                  <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.fleetCard')}</label>
                  <input
                    value={entry.fleetCard}
                    onChange={e => updateFuel(entry.id, 'fleetCard', e.target.value)}
                    disabled={entry.fillType === 'Cash'}
                    className={inputClass}
                    placeholder={entry.fillType === 'Cash' ? t('fuel.form.naCash') : 'Auto from license plate'}
                  />
                </div>
              )}
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.fuelType')}</label>
                <select value={entry.fuelType} onChange={e => updateFuel(entry.id, 'fuelType', e.target.value)} className={inputClass}>
                  {fuelTypes.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.fuelAmount')}</label>
                <input type="number" value={entry.fuelAmount} onChange={e => updateFuel(entry.id, 'fuelAmount', Number(e.target.value))} className={inputClass} />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.amount')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={entry.amount?.toFixed(2) || '0.00'}
                    disabled
                    className={inputClass + ' pr-8 font-bold'}
                    style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-label text-text-sec">{'฿'}</span>
                </div>
              </div>
            </div>

            {/* Row 4: Gas Station, Receipt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-label font-medium text-text-sec mb-1"><span className="text-error">*</span> {t('fuel.form.gasStation')}</label>
                <input value={entry.gasStation} onChange={e => updateFuel(entry.id, 'gasStation', e.target.value)} className={inputClass} placeholder="Master" />
              </div>
              <div>
                <label className="block text-label font-medium text-text-sec mb-1">{t('fuel.form.receipt')}</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs font-medium hover:bg-gray-50 cursor-pointer">
                    {'📷'} {t('fuel.form.attachReceipt')}
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      if (e.target.files?.[0]) {
                        updateFuel(entry.id, 'receiptName', e.target.files[0].name);
                        e.target.value = '';
                      }
                    }} />
                  </label>
                  {entry.receiptName && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      {'📷'} {entry.receiptName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          );
        })}
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
