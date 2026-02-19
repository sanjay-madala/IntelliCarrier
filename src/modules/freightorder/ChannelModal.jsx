import { useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
const productTypeMap = {
  SCC: [
    { value: 'Fuel', label: 'Fuel — Fuel Distribution' },
    { value: 'NGV', label: 'NGV — Natural Gas Vehicles' },
    { value: 'LPG', label: 'LPG — Liquefied Petroleum Gas' },
    { value: 'Chem', label: 'Chem — Chemical Transport' },
  ],
  SCA: [{ value: 'Car', label: 'Car — Car Carrier' }],
  SPL: [{ value: 'Container', label: 'Container — Container Transport' }],
};

const channelsByProduct = {
  'SCC-Fuel': {
    channels: ['excel', 'pdf', 'tms', 'email', 'line', 'manual'],
    notes: '📌 <strong>Bangchak:</strong> Excel, PDF &nbsp;|&nbsp; <strong>Shell:</strong> TMS API (direct connection) &nbsp;|&nbsp; <strong>Depot:</strong> Line/Email → centralized inbox',
  },
  'SCC-NGV': {
    channels: ['excel', 'line', 'form', 'manual'],
    notes: '📌 Line → Excel (real-time, not planned). Future: Standard Form for customers to fill.',
  },
  'SCC-LPG': {
    channels: ['excel', 'pdf', 'manual'],
    notes: '📌 Primary source: Excel upload from customers.',
  },
  'SCC-Chem': {
    channels: ['form', 'email', 'manual'],
    notes: '📌 Future: Standard Form for customers. Currently: Manual entry or Email.',
  },
  'SCA-Car': {
    channels: ['excel', 'manual'],
    notes: '📌 Excel: Weekly or before job. Return trips: Manual (separate shipment).<br/>💡 <strong>Win No.</strong> can be updated later via Mobile app (QR/Barcode scan).',
  },
  'SPL-Container': {
    channels: ['manual'],
    notes: '📌 SPL uses Manual Create Shipment only.',
  },
};

const channelDefinitions = {
  excel:    { icon: '📊', title: 'Excel Upload',     desc: 'Batch calling sheet / BFPL format', action: 'upload' },
  pdf:      { icon: '📄', title: 'PDF / OCR Upload', desc: 'Upload PDF, scan & extract',        action: 'upload' },
  tms:      { icon: '🔗', title: 'TMS API',          desc: 'Connect external system (Shell)',   action: 'tms' },
  email:    { icon: '📧', title: 'Email RPA',        desc: 'Fetch from centralized inbox',      action: 'upload' },
  line:     { icon: '💬', title: 'LINE Message',     desc: 'Import from LINE chat',             action: 'upload' },
  form:     { icon: '📝', title: 'Standard Form',    desc: 'Customer fills online form',        action: 'form' },
  manual:   { icon: '✏️', title: 'Manual Entry',     desc: 'Phone / walk-in orders',            action: 'manual' },
  forecast: { icon: '🚢', title: 'Forecast Upload',  desc: 'Vessel schedule / SPL',             action: 'upload' },
};

export default function ChannelModal({ onClose, onSelect }) {
  const { t } = useLanguage();
  const [company, setCompany] = useState('');
  const [productType, setProductType] = useState('');

  const productTypes = company ? (productTypeMap[company] || []) : [];
  const key = company && productType ? `${company}-${productType}` : null;
  const config = key ? (channelsByProduct[key] || { channels: ['manual'], notes: '' }) : null;

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[2000] overflow-y-auto p-4"
      onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-[720px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b border-[#d9d9d9] sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold">➕ Create New Freight Order</h2>
            <p className="text-xs text-[#6a6d70] mt-0.5">Select Business Unit & Product Type to see available intake channels</p>
          </div>
          <button onClick={onClose} className="text-xl text-[#89919a] hover:text-[#32363a] p-1">✕</button>
        </div>
        {/* Body */}
        <div className="p-6">
          {/* Company & Product Selection */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-xs mb-1">🏢 Company (Business Unit)</label>
              <select value={company}
                onChange={e => { setCompany(e.target.value); setProductType(''); }}
                className="w-full px-3 py-2 border-[1.5px] border-[#d9d9d9] rounded-lg text-sm bg-white focus:outline-none focus:border-[#0854a0]">
                <option value="">{t('uploadModal.selectCompany')}</option>
                <option value="SCC">SCC — SC Carrier</option>
                <option value="SCA">SCA — SC Auto</option>
                <option value="SPL">SPL — Container Transport</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-xs mb-1">📦 Product Type</label>
              <select value={productType}
                onChange={e => setProductType(e.target.value)}
                disabled={!company}
                className="w-full px-3 py-2 border-[1.5px] border-[#d9d9d9] rounded-lg text-sm bg-white focus:outline-none focus:border-[#0854a0] disabled:bg-[#f5f5f5] disabled:text-[#89919a]">
                <option value="">{t('uploadModal.selectProductType')}</option>
                {productTypes.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Channel cards or placeholder */}
          {config ? (
            <div>
              <div className="text-sm font-semibold text-[#6a6d70] mb-3 pb-2 border-b border-[#ededed]">
                📥 Available Intake Channels for <span className="text-[#0854a0] font-bold">{company} / {productType}</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 mb-4">
                {config.channels.map(ch => {
                  const def = channelDefinitions[ch];
                  if (!def) return null;
                  return (
                    <div key={ch}
                      onClick={() => onSelect(def.action, company, productType)}
                      className="border-2 border-[#d9d9d9] rounded-[10px] p-4 cursor-pointer transition-all text-center hover:border-[#0854a0] hover:bg-[#ebf5ff]">
                      <div className="text-3xl mb-1">{def.icon}</div>
                      <div className="font-semibold text-sm">{def.title}</div>
                      <div className="text-[11px] text-[#89919a] mt-0.5">{def.desc}</div>
                    </div>
                  );
                })}
              </div>
              {config.notes && (
                <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-lg p-3 text-xs text-[#1565c0] mt-4"
                  dangerouslySetInnerHTML={{ __html: config.notes }} />
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-[#89919a]">
              <div className="text-5xl mb-2">👆</div>
              <div className="font-medium">Select Company and Product Type above</div>
              <div className="text-xs mt-1">Available channels depend on the selected product</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
