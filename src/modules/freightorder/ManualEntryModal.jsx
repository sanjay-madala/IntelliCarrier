import { useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
export default function ManualEntryModal({ onClose, onCreate }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    bu: '', shipType: '', prodType: '',
    custName: '', email: '', phone: '',
    route: '', wbs: '', shippingType: '01 - Truck',
    pickup: '', delivery: '',
    product: '', qty: '', unit: 'Liters',
    pickupDate: '', deliveryDate: '',
    weight: '', volume: '', instructions: '',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleCreate = () => {
    const newOrder = {
      id: `FO-2026-MANUAL`,
      source: 'Manual Entry',
      bu: form.bu || 'SCC',
      shipmentType: form.shipType || '0610 — Work Order',
      productType: form.prodType || 'General Cargo',
      customerName: form.custName || 'Manual Customer',
      customerEmail: form.email || '',
      customerPhone: form.phone || '',
      route: form.route || 'N/A',
      wbs: form.wbs || 'N/A',
      shippingType: form.shippingType || '01 - Truck',
      pickupAddress: form.pickup || 'Manual pickup',
      deliveryAddress: form.delivery || 'Manual delivery',
      products: [{ name: form.product || 'Product', quantity: parseInt(form.qty) || 1, unit: form.unit || 'pcs', weight: 10 }],
      totalWeight: parseInt(form.weight) || 0,
      totalVolume: parseFloat(form.volume) || 0,
      requestedPickupDate: form.pickupDate || '2026-02-05',
      requestedDeliveryDate: form.deliveryDate || '2026-02-06',
      specialInstructions: form.instructions || '',
      status: 'PENDING_REVIEW',
      ocrConfidence: null,
      createdAt: new Date().toLocaleString(),
      createdBy: 'Current User',
      language: null,
      originalDocument: null,
      reviewedBy: null,
      reviewedAt: null,
      approver: null,
      approverComments: null,
      estimatedValue: 25000,
    };
    onCreate(newOrder);
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[2000] overflow-y-auto p-4"
      onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-[1000px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b border-[#d9d9d9] sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold">✏️ {t('manualEntry.title')}</h2>
            <p className="text-xs text-[#6a6d70] mt-0.5">{t('manualEntry.subtitle')}</p>
          </div>
          <button onClick={onClose} className="text-xl text-[#89919a] hover:text-[#32363a] p-1">✕</button>
        </div>
        {/* Body */}
        <div className="p-6">
          {/* BU & Service Type */}
          <SectionCard title={"🏢 " + t('manualEntry.buServiceType')}>
            <div className="grid grid-cols-3 gap-3">
              <FG label="Business Unit" required>
                <select className="fc" value={form.bu} onChange={e => set('bu', e.target.value)}>
                  <option value="">{t('manualEntry.select')}</option>
                  <option value="SCC">SCC — SC Carrier</option>
                  <option value="SCA">SCA — SC Auto</option>
                  <option value="SPL">SPL — SC Container</option>
                  <option value="SCM">SCM — SC Marine</option>
                </select>
              </FG>
              <FG label="Shipment Type" required>
                <select className="fc" value={form.shipType} onChange={e => set('shipType', e.target.value)}>
                  <option value="">— Select —</option>
                  <option>0601 — NGV</option>
                  <option>0602 — LPG</option>
                  <option>0603 — Chemical</option>
                  <option>0605 — Fuel</option>
                  <option>0610 — Work Order</option>
                  <option>00 — SCA Car Carrier</option>
                  <option>ML — Coastal</option>
                  <option>TUG — Tug Boat</option>
                </select>
              </FG>
              <FG label="Product Type" required>
                <select className="fc" value={form.prodType} onChange={e => set('prodType', e.target.value)}>
                  <option value="">— Select —</option>
                  <option>NGV</option><option>LPG</option><option>{t('cashAdvance.tabs.fuel')}</option><option>Chemical</option><option>Car</option><option>Container</option><option>General Cargo</option>
                </select>
              </FG>
            </div>
          </SectionCard>

          {/* Customer Information */}
          <SectionCard title={"👤 " + t('editDraft.customerInfo')}>
            <div className="grid grid-cols-3 gap-3">
              <FG label="Customer Name" required><input className="fc" value={form.custName} onChange={e => set('custName', e.target.value)} placeholder="Company name" /></FG>
              <FG label="Email"><input type="email" className="fc" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@company.com" /></FG>
              <FG label="Phone" required><input type="tel" className="fc" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+66 XXX XXX XXXX" /></FG>
            </div>
          </SectionCard>

          {/* Route & Addresses */}
          <SectionCard title={"📍 " + t('editDraft.routeAddresses')}>
            <div className="grid grid-cols-3 gap-3">
              <FG label="Route" required><input className="fc" value={form.route} onChange={e => set('route', e.target.value)} placeholder="e.g. SRC-BKK" /></FG>
              <FG label="WBS" required><input className="fc" value={form.wbs} onChange={e => set('wbs', e.target.value)} placeholder="e.g. 025.15.JETTYG.HO" /></FG>
              <FG label="Shipping Type">
                <select className="fc" value={form.shippingType} onChange={e => set('shippingType', e.target.value)}>
                  <option>01 - Truck</option><option>02 - Trailer</option><option>03 - Vessel</option><option>04 - Tug</option>
                </select>
              </FG>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <FG label="Pickup Address" required><textarea className="fc" rows={2} value={form.pickup} onChange={e => set('pickup', e.target.value)} placeholder="Full pickup address..." /></FG>
              <FG label="Delivery Address" required><textarea className="fc" rows={2} value={form.delivery} onChange={e => set('delivery', e.target.value)} placeholder="Full delivery address..." /></FG>
            </div>
          </SectionCard>

          {/* Product & Cargo */}
          <SectionCard title={"📦 " + t('editDraft.productCargo')}>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2"><FG label="Product Description"><input className="fc" value={form.product} onChange={e => set('product', e.target.value)} placeholder="Product name" /></FG></div>
              <FG label="Quantity"><input type="number" className="fc" value={form.qty} onChange={e => set('qty', e.target.value)} placeholder="0" /></FG>
              <FG label="Unit">
                <select className="fc" value={form.unit} onChange={e => set('unit', e.target.value)}>
                  <option>Liters</option><option>KG</option><option>TON</option><option>pcs</option><option>boxes</option><option>TEU</option>
                </select>
              </FG>
            </div>
          </SectionCard>

          {/* Schedule & Cargo */}
          <SectionCard title={"📅 " + t('editDraft.scheduleCargo')}>
            <div className="grid grid-cols-4 gap-3">
              <FG label="Pickup Date" required><input type="date" className="fc" value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} /></FG>
              <FG label="Delivery Date" required><input type="date" className="fc" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)} /></FG>
              <FG label="Total Weight (kg)"><input type="number" className="fc" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="0" /></FG>
              <FG label="Volume (m³)"><input type="number" className="fc" value={form.volume} onChange={e => set('volume', e.target.value)} placeholder="0" /></FG>
            </div>
            <FG label="Special Instructions" className="mt-3">
              <textarea className="fc" rows={2} value={form.instructions} onChange={e => set('instructions', e.target.value)}
                placeholder="Special handling, temperature requirements..." />
            </FG>
          </SectionCard>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-[#d9d9d9] sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]">{t('common.cancel')}</button>
          <button onClick={handleCreate} className="px-4 py-1.5 text-xs rounded bg-[#0854a0] text-white hover:bg-[#0a6ed1] font-medium">✏️ {t('manualEntry.createOrder')}</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */
function SectionCard({ title, children }) {
  return (
    <div className="bg-[#fafafa] border border-[#ededed] rounded-lg p-4 mb-3">
      <h4 className="text-xs font-semibold text-[#6a6d70] mb-3 flex items-center gap-1">{title}</h4>
      {children}
    </div>
  );
}

function FG({ label, required, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <label className="text-[11px] font-medium text-[#6a6d70]">
        {required && <span className="text-[#bb0000] font-bold">*</span>} {label}
      </label>
      {children}
    </div>
  );
}
