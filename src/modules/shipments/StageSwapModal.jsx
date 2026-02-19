import Modal from '../../components/common/Modal';
import InfoStrip from '../../components/common/InfoStrip';

import { useLanguage } from '../../contexts/LanguageContext';
export default function StageSwapModal({ open, onClose, stageIndex, direction, onConfirm }) {
  const { t } = useLanguage();
  const targetIdx = direction === 'up' ? (stageIndex - 1) : (stageIndex + 1);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('stageSwap.title')}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg">
            {t('common.cancel')}
          </button>
          <button onClick={onConfirm} className="px-4 py-1.5 rounded bg-primary text-white text-table font-medium hover:bg-primary-hover">
            {t('stageSwap.confirmSearchRoute')}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <InfoStrip variant="warning" icon="⚠️">
          {t('stageSwap.warning')}
        </InfoStrip>
        <p className="text-table text-text">
          Stage <strong>{stageIndex}</strong> {t('stageSwap.swapStages')} <strong>{targetIdx}</strong>.
        </p>
        <p className="text-table text-text-sec">
          {t('stageSwap.dummyRouteInfo')}
        </p>
      </div>
    </Modal>
  );
}
