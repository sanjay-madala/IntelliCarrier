import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Modal from '../../components/common/Modal';
import { channelsByProduct, channelDefs, productTypeMap } from '../../data/mockData';

const buOptions = [
  { value: 'SCC', label: 'SCC — SC Group Chemical' },
  { value: 'SCA', label: 'SCA — SC Asset' },
  { value: 'SPL', label: 'SPL — SC Logistics' },
];

export default function ChannelSelectionModal({ open, onClose, onSelect }) {
  const { t } = useLanguage();
  const [bu, setBU] = useState('');
  const [product, setProduct] = useState('');

  const productOptions = bu ? (productTypeMap[bu] || []).map(p => ({ value: p, label: p })) : [];

  const buProductKey = bu && product ? `${bu}-${product}` : '';
  const channels = buProductKey ? (channelsByProduct[buProductKey] || []) : [];

  const handleSelect = (channelKey) => {
    const def = channelDefs[channelKey];
    onSelect({ ...def, bu, product });
    setBU('');
    setProduct('');
  };

  return (
    <Modal open={open} onClose={onClose} title={t('shipments.newShipment')} size="lg">
      <div className="space-y-4">
        {/* BU Selection */}
        <div>
          <label className="block text-label font-medium text-text-sec mb-1">{t('shipments.channels.selectBU')}</label>
          <div className="grid grid-cols-3 gap-2">
            {buOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setBU(opt.value); setProduct(''); }}
                className={`px-3 py-2 rounded border text-table text-left transition-colors
                  ${bu === opt.value ? 'border-primary bg-highlight font-medium' : 'border-border hover:border-primary/50'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Selection */}
        {bu && (
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('shipments.channels.selectProduct')}</label>
            <div className="grid grid-cols-3 gap-2">
              {productOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setProduct(opt.value)}
                  className={`px-3 py-2 rounded border text-table text-left transition-colors
                    ${product === opt.value ? 'border-primary bg-highlight font-medium' : 'border-border hover:border-primary/50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Channel Cards */}
        {channels.length > 0 && (
          <div>
            <label className="block text-label font-medium text-text-sec mb-1">{t('shipments.channels.availableChannels')}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {channels.map(chKey => {
                const def = channelDefs[chKey];
                return (
                  <button
                    key={chKey}
                    onClick={() => handleSelect(chKey)}
                    className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-highlight transition-colors"
                  >
                    <span className="text-2xl">{def.icon}</span>
                    <span className="text-table font-medium">{t(`shipments.channels.${chKey}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {bu && product && channels.length === 0 && (
          <div className="text-center py-6 text-text-muted text-table">
            No channels configured for {bu}-{product}
          </div>
        )}
      </div>
    </Modal>
  );
}
