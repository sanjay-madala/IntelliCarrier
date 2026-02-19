import { useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
export default function EditDraftModal({ draft, onClose, onSave, onConfirm }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ ...draft });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const confVal = parseFloat(form.ocrConf || 0);
  const confLevel = confVal >= 90 ? 'high' : confVal >= 80 ? 'medium' : 'low';
  const confBg = { high: 'bg-[#e8f5e9] text-[#2e7d32]', medium: 'bg-[#fff3e0] text-[#e65100]', low: 'bg-[#ffebee] text-[#c62828]' };

  const handleSave = () => {
    onSave(form);
    window.alert('✅ ' + t('editDraft.savedToDraft'));
  };

  const handleConfirm = () => {
    if (!form.customer || !form.route) {
      window.alert('❌ ' + t('editDraft.requiredFields'));
      return;
    }
    onConfirm(form);
  };

  /* Product-specific fields renderer */
  const renderProductFields = () => {
    switch (form.productType) {
      case 'LPG':
        return (
          <SectionCard title="📦 LPG Product Details">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2"><FG label="Product Name"><input className="fc" value={form.productName || 'Propane / Butane'} onChange={e => set('productName', e.target.value)} /></FG></div>
              <FG label="Quantity" required><input className="fc" value={form.quantity || ''} onChange={e => set('quantity', e.target.value)} /></FG>
              <FG label="Unit"><select className="fc" defaultValue="Liters"><option>Liters</option><option>KG</option><option>TON</option></select></FG>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <FG label="Tank No."><input className="fc" value={form.tankNo || ''} onChange={e => set('tankNo', e.target.value)} placeholder="e.g. TK-001" /></FG>
              <FG label="Pressure (PSI)"><input type="number" className="fc" value={form.pressure || ''} onChange={e => set('pressure', e.target.value)} placeholder="e.g. 150" /></FG>
              <FG label="Temperature (°C)"><input type="number" className="fc" value={form.temp || ''} onChange={e => set('temp', e.target.value)} placeholder="e.g. -42" /></FG>
            </div>
          </SectionCard>
        );

      case 'Chem':
        return (
          <SectionCard title="⚠️ Chemical / Hazmat Details">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2"><FG label="Chemical Name"><input className="fc" value={form.productName || ''} onChange={e => set('productName', e.target.value)} /></FG></div>
              <FG label="Quantity" required><input className="fc" value={form.quantity || ''} onChange={e => set('quantity', e.target.value)} /></FG>
              <FG label="Unit"><select className="fc" defaultValue="KG"><option>KG</option><option>Liters</option><option>TON</option></select></FG>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              <FG label="Hazmat Class" required>
                <select className="fc" defaultValue="Class 3 — Flammable Liquid">
                  <option>Class 3 — Flammable Liquid</option>
                  <option>Class 6 — Toxic</option>
                  <option>Class 8 — Corrosive</option>
                  <option>Class 9 — Misc Dangerous</option>
                </select>
              </FG>
              <FG label="UN Number" required><input className="fc" value={form.unNumber || ''} onChange={e => set('unNumber', e.target.value)} placeholder="e.g. UN1203" /></FG>
              <FG label="Flash Point (°C)"><input type="number" className="fc" value={form.flashPoint || ''} onChange={e => set('flashPoint', e.target.value)} placeholder="e.g. 23" /></FG>
              <FG label="Emergency Contact"><input className="fc" value={form.emergencyContact || ''} onChange={e => set('emergencyContact', e.target.value)} placeholder="Phone" /></FG>
            </div>
          </SectionCard>
        );

      case 'Fuel':
        return (
          <SectionCard title="⛽ Fuel Order Details">
            {/* Load Schedule */}
            <div className="bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg p-4 mb-4">
              <div className="font-semibold text-sm text-[#616161] mb-3">📋 {t('editDraft.orderInfo')}</div>
              <div className="grid grid-cols-4 gap-3">
                <FG label="Source Depot" required>
                  <select className="fc" value={form.plant || '130H'} onChange={e => set('plant', e.target.value)}>
                    <option value="130H">130H — Bangchak Sriracha</option>
                    <option value="140H">140H — Bangchak Ayutthaya</option>
                    <option value="150H">150H — Bangchak Saraburi</option>
                    <option value="SHELL">SHELL — Shell Depot</option>
                  </select>
                </FG>
                <FG label="Requested Load Date" required><input type="date" className="fc" value={form.loadDate || ''} onChange={e => set('loadDate', e.target.value)} /></FG>
                <FG label="Requested Load Time"><input type="time" className="fc" value={form.loadTime || '07:30'} onChange={e => set('loadTime', e.target.value)} /></FG>
                <FG label="Reference No."><input className="fc" value={form.shipmentNo || ''} onChange={e => set('shipmentNo', e.target.value)} placeholder="Customer PO / Ref" /></FG>
              </div>
            </div>

            {/* Ship-To locations */}
            <div className="border border-[#e0e0e0] rounded-lg overflow-hidden">
              <div className="bg-[#e3f2fd] px-4 py-3 font-semibold text-sm text-[#1565c0] flex justify-between items-center">
                <span>📍 {t('editDraft.deliveryLocations')}</span>
                <button type="button" className="px-2 py-0.5 text-[10px] rounded border border-[#d9d9d9] bg-[#e0e0e0] text-[#9e9e9e] cursor-not-allowed"
                  disabled
                  title={t('editDraft.addShipToComingSoon')}>
                  + {t('editDraft.addShipTo')}
                </button>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {/* Ship-To #1 */}
                <div className="p-4 border-b border-[#e0e0e0] bg-[#fafafa]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-[#1565c0] text-white px-2 py-0.5 rounded text-[11px] font-semibold">{t('editDraft.shipTo', { number: 1 })}</span>
                    <span className="text-[11px] text-[#89919a]">{t('editDraft.primaryDelivery')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <FG label="Ship-To Code" required><input className="fc text-xs" value={form.shipToList?.[0]?.code || '102807'} readOnly /></FG>
                    <div className="col-span-2"><FG label="Customer Name" required><input className="fc text-xs" value={form.shipToList?.[0]?.name || form.customer || ''} readOnly /></FG></div>
                  </div>
                  <FG label="Delivery Address" className="mt-2"><input className="fc text-xs" value={form.shipToList?.[0]?.address || form.deliveryAddress || ''} readOnly /></FG>
                  <div className="mt-3 p-3 bg-white rounded-md border border-[#e0e0e0]">
                    <div className="text-[11px] font-semibold text-[#616161] mb-2">{t('editDraft.productsVolumes')}</div>
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex-1 min-w-[120px]">
                        <label className="text-[10px] text-[#f57f17]">🛢️ Hi Diesel S (x1000 L)</label>
                        <input type="number" className="fc text-xs" defaultValue={form.totalDiesel || form.shipToList?.[0]?.diesel || 9} />
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <label className="text-[10px] text-[#2e7d32]">⛽ Gasoline 95 (x1000 L)</label>
                        <input type="number" className="fc text-xs" defaultValue={form.totalG95 || form.shipToList?.[0]?.g95 || 8} />
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <label className="text-[10px] text-[#1565c0]">⛽ Gasoline 91 (x1000 L)</label>
                        <input type="number" className="fc text-xs" defaultValue={form.totalG91 || form.shipToList?.[0]?.g91 || ''} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Ship-To #2 if exists */}
                {form.shipToList && form.shipToList.length > 1 && (
                  <div className="p-4 border-b border-[#e0e0e0]">
                    <div className="mb-3">
                      <span className="bg-[#1565c0] text-white px-2 py-0.5 rounded text-[11px] font-semibold">{t('editDraft.shipTo', { number: 2 })}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <FG label="Ship-To Code"><input className="fc text-xs" value={form.shipToList[1]?.code || ''} readOnly /></FG>
                      <div className="col-span-2"><FG label="Customer Name"><input className="fc text-xs" value={form.shipToList[1]?.name || ''} readOnly /></FG></div>
                    </div>
                    <FG label="Delivery Address" className="mt-2"><input className="fc text-xs" value={form.shipToList[1]?.address || ''} readOnly /></FG>
                    <div className="mt-3 p-3 bg-white rounded-md border border-[#e0e0e0]">
                      <div className="text-[11px] font-semibold text-[#616161] mb-2">{t('editDraft.productsVolumes')}</div>
                      <div className="flex gap-3 flex-wrap">
                        <div className="flex-1 min-w-[120px]"><label className="text-[10px] text-[#f57f17]">🛢️ Hi Diesel S</label><input type="number" className="fc text-xs" defaultValue={form.shipToList[1]?.diesel || ''} /></div>
                        <div className="flex-1 min-w-[120px]"><label className="text-[10px] text-[#2e7d32]">⛽ G95</label><input type="number" className="fc text-xs" defaultValue={form.shipToList[1]?.g95 || ''} /></div>
                        <div className="flex-1 min-w-[120px]"><label className="text-[10px] text-[#1565c0]">⛽ G91</label><input type="number" className="fc text-xs" defaultValue={form.shipToList[1]?.g91 || ''} /></div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Ship-To #3 if exists */}
                {form.shipToList && form.shipToList.length > 2 && (
                  <div className="p-4">
                    <div className="mb-3">
                      <span className="bg-[#1565c0] text-white px-2 py-0.5 rounded text-[11px] font-semibold">{t('editDraft.shipTo', { number: 3 })}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <FG label="Ship-To Code"><input className="fc text-xs" value={form.shipToList[2]?.code || ''} readOnly /></FG>
                      <div className="col-span-2"><FG label="Customer Name"><input className="fc text-xs" value={form.shipToList[2]?.name || ''} readOnly /></FG></div>
                    </div>
                    <FG label="Delivery Address" className="mt-2"><input className="fc text-xs" value={form.shipToList[2]?.address || ''} readOnly /></FG>
                    <div className="mt-3 p-3 bg-white rounded-md border border-[#e0e0e0]">
                      <div className="text-[11px] font-semibold text-[#616161] mb-2">{t('editDraft.productsVolumes')}</div>
                      <div className="flex gap-3 flex-wrap">
                        <div className="flex-1 min-w-[120px]"><label className="text-[10px] text-[#f57f17]">🛢️ Hi Diesel S</label><input type="number" className="fc text-xs" defaultValue={form.shipToList[2]?.diesel || ''} /></div>
                        <div className="flex-1 min-w-[120px]"><label className="text-[10px] text-[#2e7d32]">⛽ G95</label><input type="number" className="fc text-xs" defaultValue={form.shipToList[2]?.g95 || ''} /></div>
                        <div className="flex-1 min-w-[120px]"><label className="text-[10px] text-[#1565c0]">⛽ G91</label><input type="number" className="fc text-xs" defaultValue={form.shipToList[2]?.g91 || ''} /></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Total Summary */}
            <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-lg p-4 mt-4">
              <div className="font-semibold text-sm text-[#2e7d32] mb-2">📊 {t('editDraft.orderTotal')}</div>
              <div className="flex gap-8 flex-wrap text-sm">
                <div><span className="text-[#616161]">Total Diesel:</span> <strong className="text-[#f57f17]">{form.totalDiesel || 22}K L</strong></div>
                <div><span className="text-[#616161]">Total G95:</span> <strong className="text-[#2e7d32]">{form.totalG95 || 8}K L</strong></div>
                <div><span className="text-[#616161]">Total G91:</span> <strong className="text-[#1565c0]">{form.totalG91 || 4}K L</strong></div>
                <div><span className="text-[#616161]">Deliveries:</span> <strong>{form.shipToCount || (form.shipToList?.length || 1)}</strong></div>
              </div>
              <div className="mt-3 pt-3 border-t border-dashed border-[#a5d6a7] text-xs text-[#616161]">
                💡 <strong>Note:</strong> {t('editDraft.truckDriverNote')}
              </div>
            </div>
          </SectionCard>
        );

      case 'NGV':
        return (
          <SectionCard title="🔥 NGV Product Details">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2"><FG label="Product"><input className="fc" value="Natural Gas (NGV)" readOnly style={{background:'#e8e8e8'}} /></FG></div>
              <FG label="Volume (SCM)" required><input className="fc" value={form.quantity || ''} onChange={e => set('quantity', e.target.value)} /></FG>
              <FG label="Pressure (Bar)"><input type="number" className="fc" value={form.pressure || '250'} onChange={e => set('pressure', e.target.value)} /></FG>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <FG label="Station Name" required><input className="fc" value={form.station || ''} onChange={e => set('station', e.target.value)} placeholder="e.g. PTT NGV Bangna" /></FG>
              <FG label="Shift">
                <select className="fc" defaultValue="Morning (06:00-14:00)">
                  <option>Morning (06:00-14:00)</option>
                  <option>Afternoon (14:00-22:00)</option>
                  <option>Night (22:00-06:00)</option>
                </select>
              </FG>
              <FG label="Mother Station"><input className="fc" value={form.motherStation || ''} onChange={e => set('motherStation', e.target.value)} placeholder="Source station" /></FG>
            </div>
          </SectionCard>
        );

      case 'Car':
        return (
          <SectionCard title="🚗 Car Carrier Details (SCA)">
            <div className="grid grid-cols-4 gap-3">
              <FG label="Vehicle Count" required><input type="number" className="fc" value={form.quantity || 8} onChange={e => set('quantity', e.target.value)} /></FG>
              <FG label="Carrier Capacity"><input type="number" className="fc" value={form.capacity || 8} readOnly style={{background:'#e8e8e8'}} /></FG>
              <div className="col-span-2"><FG label="Vehicle Models"><input className="fc" value={form.vehicleModels || ''} onChange={e => set('vehicleModels', e.target.value)} placeholder="e.g. Toyota Yaris, Honda City" /></FG></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <FG label="Manufacturer">
                <select className="fc" defaultValue="Toyota">
                  <option>Toyota</option><option>Honda</option><option>Isuzu</option><option>Mitsubishi</option><option>Nissan</option><option>Mixed</option>
                </select>
              </FG>
              <FG label="Dealer / Destination"><input className="fc" value={form.dealer || ''} onChange={e => set('dealer', e.target.value)} placeholder="e.g. Toyota Bangna" /></FG>
              <FG label="Trip Type">
                <select className="fc" defaultValue="Outbound">
                  <option>Outbound</option><option>Return (Manual)</option>
                </select>
              </FG>
            </div>
            {/* Win No section */}
            <div className="bg-[#fff3e0] border border-[#ffcc80] rounded-lg p-3 mt-4">
              <div className="font-semibold text-sm text-[#e65100] mb-2">🔖 Win No. (Vehicle Identification)</div>
              <div className="grid grid-cols-2 gap-3">
                <FG label="Win No."><input className="fc" value={form.winNo || ''} onChange={e => set('winNo', e.target.value)} placeholder="Can be updated later" /></FG>
                <div className="flex items-end">
                  <button type="button" className="w-full px-3 py-2 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]"
                    onClick={() => window.alert('📱 Mobile QR Scan feature\n\nUse the IntelliCarrier Mobile App to scan QR code/Barcode/Vehicle Registration and update Win No. in Shipment.')}>
                    📱 Scan QR (Mobile)
                  </button>
                </div>
              </div>
              <div className="text-xs text-[#f57c00] mt-2">
                💡 <strong>Note:</strong> Win No. can be updated later via Mobile app — scan QR code, Barcode, or Vehicle Registration plate
              </div>
            </div>
          </SectionCard>
        );

      case 'Container':
        return (
          <SectionCard title="📦 Container Details">
            <div className="grid grid-cols-4 gap-3">
              <FG label="Container No." required><input className="fc" value={form.containerNo || ''} onChange={e => set('containerNo', e.target.value)} placeholder="e.g. MSCU1234567" /></FG>
              <FG label="Size" required>
                <select className="fc" defaultValue="20'">
                  <option>20&apos;</option><option>40&apos;</option><option>40&apos;HC</option><option>45&apos;</option>
                </select>
              </FG>
              <FG label="Type">
                <select className="fc" defaultValue="Dry">
                  <option>Dry</option><option>Reefer</option><option>Open Top</option><option>Flat Rack</option><option>Tank</option>
                </select>
              </FG>
              <FG label="Gross Weight (kg)"><input type="number" className="fc" value={String(form.quantity || '').replace(/,/g, '')} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 24000" /></FG>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              <FG label="Seal No."><input className="fc" value={form.sealNo || ''} onChange={e => set('sealNo', e.target.value)} placeholder="e.g. SL-12345" /></FG>
              <FG label="Booking Ref"><input className="fc" value={form.bookingRef || ''} onChange={e => set('bookingRef', e.target.value)} placeholder="e.g. BKG-001" /></FG>
              <FG label="Pickup Port"><input className="fc" value={form.pickupPort || ''} onChange={e => set('pickupPort', e.target.value)} placeholder="e.g. Laem Chabang" /></FG>
              <FG label="Cargo Description"><input className="fc" value={form.productName || ''} onChange={e => set('productName', e.target.value)} placeholder="e.g. Electronics" /></FG>
            </div>
          </SectionCard>
        );

      default:
        return (
          <SectionCard title={"📦 " + t('editDraft.productCargo')}>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2"><FG label="Product Description"><input className="fc" value={form.productName || ''} onChange={e => set('productName', e.target.value)} /></FG></div>
              <FG label="Quantity" required><input className="fc" value={form.quantity || ''} onChange={e => set('quantity', e.target.value)} /></FG>
              <FG label="Unit"><select className="fc" defaultValue="Liters"><option>Liters</option><option>KG</option><option>TON</option><option>pcs</option></select></FG>
            </div>
          </SectionCard>
        );
    }
  };

  const shipTypeMap = { LPG:'0602 — LPG', Chem:'0603 — Chemical', Fuel:'0605 — Fuel', NGV:'0601 — NGV', Car:'00 — SCA Car Carrier', Container:'ML — Coastal Container' };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[2000] overflow-y-auto p-4"
      onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-[1200px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={e => e.stopPropagation()}>
        {/* Green gradient header */}
        <div className="flex justify-between items-start px-6 py-4 border-b-2 border-[#81c784] sticky top-0 z-10"
          style={{ background: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)' }}>
          <div>
            <h2 className="text-base font-semibold text-[#2e7d32]">📋 {t('editDraft.title')}</h2>
            <p className="text-xs text-[#388e3c] mt-0.5">{form.id} — {form.bu} / {form.productType} • OCR Confidence: {form.ocrConf}%</p>
          </div>
          <button onClick={onClose} className="text-xl text-[#89919a] hover:text-[#32363a] p-1">✕</button>
        </div>
        {/* Body */}
        <div className="p-5">
          {/* OCR Confidence banner */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-5 ${confBg[confLevel]}`}>
            <span>🎯</span>
            <span>{t('editDraft.ocrConfidence')}:</span>
            <strong>{form.ocrConf}%</strong>
            <span className="ml-auto text-xs">{t('editDraft.reviewFields')}</span>
          </div>

          {/* BU & Type (read-only) */}
          <SectionCard title={"🏢 " + t('editDraft.buProduct')} subtitle={t('editDraft.fromUpload')} bg="#f5f5f5">
            <div className="grid grid-cols-3 gap-3">
              <FG label="หน่วยงาน (Business Unit)"><input className="fc" value={form.bu} readOnly style={{background:'#e8e8e8'}} /></FG>
              <FG label="ชนิดสินค้า (Product Type)"><input className="fc" value={form.productType} readOnly style={{background:'#e8e8e8'}} /></FG>
              <FG label="Shipment Type">
                <select className="fc" defaultValue={shipTypeMap[form.productType] || ''}>
                  <option>0601 — NGV</option><option>0602 — LPG</option><option>0603 — Chemical</option>
                  <option>0605 — Fuel</option><option>00 — SCA Car Carrier</option><option>ML — Coastal Container</option>
                </select>
              </FG>
            </div>
          </SectionCard>

          {/* Customer */}
          <SectionCard title={"👤 " + t('editDraft.customerInfo')}>
            <div className="grid grid-cols-3 gap-3">
              <FG label="Customer Name" required><input className="fc" value={form.customer || ''} onChange={e => set('customer', e.target.value)} placeholder="Company name" /></FG>
              <FG label="Email"><input type="email" className="fc" value={form.email || 'customer@example.com'} onChange={e => set('email', e.target.value)} /></FG>
              <FG label="Phone" required><input type="tel" className="fc" value={form.phone || '+66 2 XXX XXXX'} onChange={e => set('phone', e.target.value)} /></FG>
            </div>
          </SectionCard>

          {/* Route & Addresses */}
          <SectionCard title={"📍 " + t('editDraft.routeAddresses')}>
            <div className="grid grid-cols-3 gap-3">
              <FG label="เส้นทาง (Route)" required><input className="fc" value={form.route || ''} onChange={e => set('route', e.target.value)} placeholder="e.g. SRC-BKK" /></FG>
              <FG label="สัญญา / WBS" required><input className="fc" value={form.wbs || '025.AUTO.GEN'} onChange={e => set('wbs', e.target.value)} /></FG>
              <FG label="Shipping Type">
                <select className="fc" defaultValue="01 - Truck">
                  <option>01 - Truck</option><option>02 - Trailer</option><option>03 - Vessel</option><option>04 - Tug</option>
                </select>
              </FG>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <FG label="Pickup Address" required><textarea className="fc" rows={2} value={form.pickupAddress || ''} onChange={e => set('pickupAddress', e.target.value)} placeholder="Full pickup address..." /></FG>
              <FG label="Delivery Address" required><textarea className="fc" rows={2} value={form.deliveryAddress || ''} onChange={e => set('deliveryAddress', e.target.value)} placeholder="Full delivery address..." /></FG>
            </div>
          </SectionCard>

          {/* Product-specific fields */}
          {renderProductFields()}

          {/* Schedule & Cargo */}
          <SectionCard title={"📅 " + t('editDraft.scheduleCargo')}>
            <div className="grid grid-cols-4 gap-3">
              <FG label="Pickup Date" required><input type="date" className="fc" value={form.deliveryDate || ''} onChange={e => set('deliveryDate', e.target.value)} /></FG>
              <FG label="Delivery Date" required><input type="date" className="fc" value={form.deliveryDate || ''} onChange={e => set('deliveryDate', e.target.value)} /></FG>
              <FG label="Total Weight (kg)"><input type="number" className="fc" value={form.weight || '10000'} onChange={e => set('weight', e.target.value)} /></FG>
              <FG label="Estimated Value (THB)"><input type="number" className="fc" value={String(form.estimatedValue || '50000').replace(/,/g, '')} onChange={e => set('estimatedValue', e.target.value)} /></FG>
            </div>
            <FG label="Special Instructions" className="mt-3">
              <textarea className="fc" rows={2} value={form.specialInstructions || ''} onChange={e => set('specialInstructions', e.target.value)}
                placeholder="Special handling, temperature requirements..." />
            </FG>
          </SectionCard>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-[#d9d9d9] bg-[#f8f9fa] sticky bottom-0">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]">{t('common.cancel')}</button>
          <button onClick={handleSave} className="px-3 py-1.5 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]">💾 {t('editDraft.saveAsDraft')}</button>
          <button onClick={handleConfirm} className="px-5 py-2 text-xs rounded bg-[#107e3e] text-white hover:bg-[#0d6b34] font-medium">✅ {t('editDraft.confirmCreateFO')}</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */
function SectionCard({ title, subtitle, children, className = '', bg = '#fafafa' }) {
  return (
    <div className={`border border-[#ededed] rounded-lg p-4 mb-3 ${className}`} style={{ background: bg }}>
      <h4 className="text-xs font-semibold text-[#6a6d70] mb-3 flex items-center gap-1">
        {title}
        {subtitle && <span className="text-[11px] text-[#89919a] font-normal">{subtitle}</span>}
      </h4>
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
