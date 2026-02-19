import { useState, useRef, useCallback } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
const productTypeMap = {
  SCC: [
    { value: 'LPG', label: 'LPG — Liquefied Petroleum Gas' },
    { value: 'Chem', label: 'Chem — Chemical Transport' },
    { value: 'Fuel', label: 'Fuel — Fuel Distribution' },
    { value: 'NGV', label: 'NGV — Natural Gas Vehicles' },
  ],
  SCA: [{ value: 'Car', label: 'Car — Car Carrier' }],
  SPL: [{ value: 'Container', label: 'Container — Container Transport' }],
};

export default function UploadModal({ type, preSelectedBU, preSelectedProduct, onClose, onEditDraft, onConfirmDrafts }) {
  const { t } = useLanguage();
  const hasPreSelection = !!(preSelectedBU && preSelectedProduct);
  const [step, setStep] = useState(hasPreSelection ? 2 : 1);
  const [company, setCompany] = useState(preSelectedBU || '');
  const [productType, setProductType] = useState(preSelectedProduct || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingPct, setProcessingPct] = useState(0);
  const [draftFOs, setDraftFOs] = useState([]);
  const [selectedIdxs, setSelectedIdxs] = useState([]);
  const intervalRef = useRef(null);

  const productTypes = company ? (productTypeMap[company] || []) : [];

  /* Go to step 2 */
  const goNext = () => {
    if (step === 1) {
      if (!company || !productType) { window.alert('Please select Company and Product Type'); return; }
      setStep(2);
    }
  };

  /* Simulate upload & OCR processing */
  const simulateUpload = useCallback(() => {
    setIsProcessing(true);
    setProcessingPct(0);
    const steps = ['Detecting language...', 'Running OCR...', 'Parsing order data...', 'Validating fields...', 'Extraction complete!'];
    let idx = 0;
    setProcessingStep(steps[0]);
    intervalRef.current = setInterval(() => {
      idx++;
      const pct = Math.min(idx * 25, 100);
      setProcessingPct(pct);
      setProcessingStep(steps[Math.min(idx, steps.length - 1)]);
      if (pct >= 100) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          const generated = generateDrafts(company, productType);
          setDraftFOs(generated);
          setSelectedIdxs([]);
          setIsProcessing(false);
          setStep(3);
        }, 500);
      }
    }, 600);
  }, [company, productType]);

  /* Generate mock draft FOs based on product type */
  const generateDrafts = (bu, pt) => {
    const numFOs = Math.floor(Math.random() * 3) + 2;
    const drafts = [];
    const ts = String(Date.now()).slice(-4);

    if (pt === 'Fuel') {
      const plants = ['130H', '140H', '150H'];
      const shipToData = [
        { name: 'หจก.จริงใจบริการ', code: '102807', addr: 'จ.นนทบุรี ต.วัดชลอ อ.บางกรวย' },
        { name: 'บริษัท ทอง ซุพรีม จำกัด', code: '229732', addr: 'จ.พระนครศรีอยุธยา' },
        { name: 'บริษัท นาคณครา จำกัด', code: '200865', addr: 'จ.ปทุมธานี' },
        { name: 'หสน. เจริญสุขอยุธยา', code: '101347', addr: 'จ.พระนครศรีอยุธยา' },
        { name: 'หจก. ดุษดีพาณิชย์', code: '102212', addr: 'จ.ปทุมธานี' },
      ];
      for (let i = 0; i < numFOs; i++) {
        const plant = plants[i % plants.length];
        const numShipTo = Math.floor(Math.random() * 3) + 1;
        const shipToList = [];
        let totalDiesel = 0, totalG95 = 0, totalG91 = 0;
        for (let j = 0; j < numShipTo; j++) {
          const st = shipToData[(i * 2 + j) % shipToData.length];
          const diesel = Math.floor(Math.random() * 12) + 4;
          const g95 = Math.random() > 0.4 ? Math.floor(Math.random() * 6) + 2 : 0;
          const g91 = Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 2 : 0;
          totalDiesel += diesel; totalG95 += g95; totalG91 += g91;
          shipToList.push({ name: st.name, code: st.code, address: st.addr, diesel, g95: g95 || null, g91: g91 || null });
        }
        drafts.push({
          id: `FO-DRAFT-${ts}-${i + 1}`, bu, productType: pt, status: 'Draft',
          ocrConf: (88 + Math.random() * 10).toFixed(1),
          customer: shipToList[0].name + (numShipTo > 1 ? ` +${numShipTo - 1} more` : ''),
          route: `${plant}-MULTI`,
          quantity: ((totalDiesel + totalG95 + totalG91) * 1000).toLocaleString(),
          unit: 'L', deliveryDate: `2026-02-0${Math.floor(Math.random() * 7) + 3}`,
          plant, shipToList, shipToCount: numShipTo, totalDiesel, totalG95, totalG91,
          pickupAddress: `คลังน้ำมัน Bangchak ${plant}`,
          deliveryAddress: `${numShipTo} Ship-To locations`,
          loadDate: `2026-02-0${Math.floor(Math.random() * 7) + 3}`,
          loadTime: `0${Math.floor(Math.random() * 4) + 6}:30`,
          specialInstructions: '',
        });
      }
    } else if (pt === 'Car') {
      const carCustomers = ['Toyota Motor Thailand', 'Honda Automobile Thailand', 'Isuzu Motors', 'Mitsubishi Motors Thailand'];
      for (let i = 0; i < numFOs; i++) {
        const vc = Math.floor(Math.random() * 6) + 3;
        drafts.push({
          id: `FO-DRAFT-${ts}-${i + 1}`, bu, productType: pt, status: 'Draft',
          ocrConf: (90 + Math.random() * 8).toFixed(1),
          customer: carCustomers[Math.floor(Math.random() * carCustomers.length)],
          route: 'LCH-BKK', quantity: vc, unit: 'units',
          deliveryDate: `2026-02-0${Math.floor(Math.random() * 7) + 3}`,
          vehicleCount: vc, vehicleModels: 'Yaris, City, Swift', winNo: '',
          pickupAddress: 'Laem Chabang Port', deliveryAddress: 'Toyota Dealer Bangkok',
          specialInstructions: 'Win No. to be updated via Mobile QR scan',
        });
      }
    } else {
      const defaultCustomers = ['PTT Public Co.', 'SCG Logistics', 'Thai Oil PCL', 'Bangchak Corp', 'IRPC PCL'];
      const defaultRoutes = ['BKK-RYG', 'LCH-KRT', 'MTP-SRB', 'SRC-CNB'];
      for (let i = 0; i < numFOs; i++) {
        drafts.push({
          id: `FO-DRAFT-${ts}-${i + 1}`, bu, productType: pt, status: 'Draft',
          ocrConf: (85 + Math.random() * 12).toFixed(1),
          customer: defaultCustomers[Math.floor(Math.random() * defaultCustomers.length)],
          route: defaultRoutes[Math.floor(Math.random() * defaultRoutes.length)],
          quantity: `${(Math.floor(Math.random() * 40) + 10)},000`,
          unit: pt === 'Container' ? 'TEU' : 'L',
          deliveryDate: `2026-02-0${Math.floor(Math.random() * 7) + 3}`,
          pickupAddress: '123 Industrial Zone, Map Ta Phut',
          deliveryAddress: '456 Factory Road, Rayong',
          productName: pt, specialInstructions: '',
        });
      }
    }
    return drafts;
  };

  const toggleSelect = (idx) => {
    setSelectedIdxs(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };
  const toggleAll = () => {
    setSelectedIdxs(prev => prev.length === draftFOs.length ? [] : draftFOs.map((_, i) => i));
  };

  const stepClasses = (n) => {
    if (n < step) return 'text-[#107e3e] font-semibold';
    if (n === step) return 'text-[#0854a0] font-semibold';
    return 'text-[#89919a]';
  };
  const stepNumClasses = (n) => {
    if (n < step) return 'bg-[#107e3e] text-white';
    if (n === step) return 'bg-[#0854a0] text-white';
    return 'bg-[#d9d9d9] text-[#89919a]';
  };

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[2000] overflow-y-auto p-4"
      onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-[720px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b border-[#d9d9d9] sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold">📄 {t('uploadModal.title')}</h2>
            <p className="text-xs text-[#6a6d70] mt-0.5">{t('uploadModal.subtitle')}</p>
          </div>
          <button onClick={onClose} className="text-xl text-[#89919a] hover:text-[#32363a] p-1">✕</button>
        </div>
        {/* Body */}
        <div className="p-6">
          {/* Step bar */}
          <div className="flex justify-center gap-8 mb-5 pb-4 border-b border-[#ededed]">
            {[{n:1,label:t('uploadModal.selectType')},{n:2,label:t('uploadModal.uploadFile')},{n:3,label:t('uploadModal.reviewDrafts')}].map(s => (
              <div key={s.n} className={`flex items-center gap-2 text-xs ${stepClasses(s.n)}`}>
                <span className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold ${stepNumClasses(s.n)}`}>
                  {s.n < step ? '✓' : s.n}
                </span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Company & Product */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-xs mb-1">🏢 {t('uploadModal.company')}</label>
                  <select value={company} onChange={e => { setCompany(e.target.value); setProductType(''); }}
                    className="w-full px-3 py-2 border-[1.5px] border-[#d9d9d9] rounded-lg text-sm bg-white focus:outline-none focus:border-[#0854a0]">
                    <option value="">{t('uploadModal.selectCompany')}</option>
                    <option value="SCC">SCC — SC Carrier</option>
                    <option value="SCA">SCA — SC Auto</option>
                    <option value="SPL">SPL — Container Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-xs mb-1">📦 {t('uploadModal.productType')}</label>
                  <select value={productType} onChange={e => setProductType(e.target.value)} disabled={!company}
                    className="w-full px-3 py-2 border-[1.5px] border-[#d9d9d9] rounded-lg text-sm bg-white focus:outline-none focus:border-[#0854a0] disabled:bg-[#f5f5f5] disabled:text-[#89919a]">
                    <option value="">{t('uploadModal.selectProductType')}</option>
                    {productTypes.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-3 text-xs text-[#1565c0] mt-4">
                ℹ️ <strong>{t('uploadModal.whySelect')}</strong><br />
                {t('uploadModal.whySelectDesc')}
              </div>
            </div>
          )}

          {/* Step 2: Upload zone */}
          {step === 2 && !isProcessing && (
            <div>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#e3f2fd] text-[#0854a0]">{company}</span>
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[#fff3e0] text-[#e65100]">{productType}</span>
              </div>
              <div onClick={simulateUpload}
                className="border-2 border-dashed border-[#d9d9d9] rounded-[10px] p-8 text-center cursor-pointer transition-all hover:border-[#0854a0] hover:bg-[#ebf5ff]">
                <div className="text-5xl mb-2">📤</div>
                <div className="font-medium text-[#32363a]">{t('uploadModal.dropFiles')}</div>
                <div className="text-xs text-[#89919a] mt-1">{t('uploadModal.fileFormats')}</div>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-blue-700">🇬🇧 English</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-50 text-[#e65100]">🇹🇭 Thai</span>
                </div>
              </div>
              <div className="text-center mt-3">
                <button onClick={simulateUpload}
                  className="px-3 py-1 text-xs rounded border border-[#0854a0] text-[#0854a0] hover:bg-[#ebf5ff]">
                  🎬 {t('uploadModal.runDemo')}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Processing animation */}
          {step === 2 && isProcessing && (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">🔄</div>
              <div className="font-medium">{t('uploadModal.processing')}</div>
              <div className="text-xs text-[#89919a] mt-1">{processingStep}</div>
              <div className="max-w-[350px] mx-auto mt-4">
                <div className="h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0854a0] rounded-full transition-all duration-300" style={{ width: `${processingPct}%` }} />
                </div>
                <div className="text-center text-xs font-semibold mt-1">{processingPct}%</div>
              </div>
            </div>
          )}

          {/* Step 3: Draft FO list */}
          {step === 3 && (
            <div>
              {/* Bulk bar */}
              <div className="flex justify-between items-center p-3 bg-[#f8f9fa] rounded-lg mb-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={selectedIdxs.length === draftFOs.length && draftFOs.length > 0}
                    onChange={toggleAll} className="w-[18px] h-[18px] cursor-pointer" />
                  <label className="font-semibold text-sm cursor-pointer" onClick={toggleAll}>{t('uploadModal.selectAll')}</label>
                  <span className="text-xs text-[#89919a] ml-2">({selectedIdxs.length} {t('uploadModal.selected')})</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setStep(2); setIsProcessing(false); setProcessingPct(0); }}
                    className="px-3 py-1 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]">
                    ← {t('uploadModal.uploadMore')}
                  </button>
                  <button disabled={selectedIdxs.length === 0}
                    onClick={() => {
                      const selected = selectedIdxs.map(i => draftFOs[i]);
                      onConfirmDrafts(selected);
                    }}
                    className="px-3 py-1 text-xs rounded bg-[#107e3e] text-white hover:bg-[#0d6b34] disabled:opacity-40 disabled:cursor-not-allowed font-medium">
                    ✅ {t('uploadModal.confirmSelected')}
                  </button>
                </div>
              </div>
              {/* Draft list */}
              <div className="max-h-[350px] overflow-y-auto">
                {draftFOs.map((fo, idx) => {
                  const isSelected = selectedIdxs.includes(idx);
                  let extraInfo = null;
                  if (fo.productType === 'Fuel') {
                    extraInfo = (
                      <>
                        <span className="flex items-center gap-1">🏭 {fo.plant || '-'}</span>
                        <span className="flex items-center gap-1">📍 {fo.shipToCount || 1} Ship-To</span>
                        <span className="flex items-center gap-1">⛽ D:{fo.totalDiesel || 0}K + G95:{fo.totalG95 || 0}K</span>
                      </>
                    );
                  } else if (fo.productType === 'Car') {
                    extraInfo = (
                      <>
                        <span className="flex items-center gap-1">🚗 {fo.vehicleCount || '-'} units</span>
                        <span className="flex items-center gap-1 text-[#e65100]">{fo.winNo ? '✓ Win:' + fo.winNo : '⚠️ Win No. pending'}</span>
                      </>
                    );
                  } else {
                    extraInfo = <span className="flex items-center gap-1">📦 {fo.quantity} {fo.unit}</span>;
                  }
                  return (
                    <div key={fo.id}
                      onClick={() => toggleSelect(idx)}
                      className={`flex items-center gap-3 p-3 border-[1.5px] rounded-[10px] mb-2 cursor-pointer transition-all
                        ${isSelected ? 'border-[#0854a0] bg-[#e3f2fd]' : 'border-[#d9d9d9] hover:border-[#0854a0] hover:bg-[#ebf5ff]'}`}>
                      <input type="checkbox" checked={isSelected}
                        onChange={() => toggleSelect(idx)}
                        onClick={e => e.stopPropagation()}
                        className="w-[18px] h-[18px] cursor-pointer flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#0854a0] text-sm">{fo.id}</span>
                          <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-semibold ${fo.status === 'Draft' ? 'bg-[#fff3cd] text-[#856404]' : 'bg-[#d4edda] text-[#155724]'}`}>{fo.status}</span>
                          <span className="text-[11px] text-[#89919a]">🎯 {fo.ocrConf}%</span>
                          {fo.productType === 'Fuel' && (
                            <span className="bg-[#fff3e0] text-[#e65100] px-1.5 rounded text-[10px] font-semibold">BFPL</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-[#6a6d70]">
                          <span className="flex items-center gap-1">🏢 {fo.customer}</span>
                          <span className="flex items-center gap-1">📍 {fo.route}</span>
                          {extraInfo}
                          <span className="flex items-center gap-1">📅 {fo.deliveryDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); onEditDraft(fo); }}
                          className="px-2 py-1 text-xs rounded-md border border-[#0854a0] bg-white text-[#0854a0] hover:bg-[#0854a0] hover:text-white font-medium">
                          ✏️ {t('freightOrders.actions.review')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-[#d9d9d9] sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded border border-[#d9d9d9] bg-[#f5f5f5] text-[#32363a] hover:bg-[#e8e8e8]">{t('common.cancel')}</button>
          {step < 3 && !isProcessing && (
            <button onClick={step === 1 ? goNext : simulateUpload}
              className="px-4 py-1.5 text-xs rounded bg-[#0854a0] text-white hover:bg-[#0a6ed1] font-medium">
              {step === 1 ? t('uploadModal.next') + ' →' : t('uploadModal.upload') + ' →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
