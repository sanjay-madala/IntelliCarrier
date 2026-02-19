import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Modal from '../../components/common/Modal';
import UploadZone from '../../components/common/UploadZone';

export default function UploadModal({ open, onClose, onConfirm }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    if (!open) { setStep(1); setFiles([]); setDrafts([]); setSelected(new Set()); }
  }, [open]);

  const handleFiles = (newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
    setProcessing(true);
    // Simulate OCR processing
    setTimeout(() => {
      const newDrafts = newFiles.map((f, i) => ({
        id: `draft-${Date.now()}-${i}`,
        filename: f.name,
        confidence: Math.floor(Math.random() * 20) + 80,
        customer: 'Auto-detected Customer',
        qty: Math.floor(Math.random() * 20000) + 5000,
        selected: true,
      }));
      setDrafts(prev => [...prev, ...newDrafts]);
      setSelected(new Set(newDrafts.map(d => d.id)));
      setProcessing(false);
      setStep(3);
    }, 2000);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Files" size="lg"
      footer={
        step === 3 ? (
          <>
            <button onClick={() => setStep(2)} className="px-3 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg">
              {t('shipments.upload.uploadMore')}
            </button>
            <button
              onClick={() => onConfirm?.(drafts.filter(d => selected.has(d.id)))}
              className="px-3 py-1.5 rounded bg-primary text-white text-table hover:bg-primary-hover"
              disabled={selected.size === 0}
            >
              {t('shipments.upload.confirmSelected')} ({selected.size})
            </button>
          </>
        ) : null
      }
    >
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-1">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-text-muted'}`}>{s}</span>
            <span className={`text-table ${step >= s ? 'text-text' : 'text-text-muted'}`}>
              {s === 1 ? t('shipments.upload.step1Title') : s === 2 ? t('shipments.upload.step2Title') : t('shipments.upload.step3Title')}
            </span>
            {s < 3 && <span className="mx-2 text-border">→</span>}
          </div>
        ))}
      </div>

      {/* Step 2: Upload */}
      {(step === 1 || step === 2) && (
        <div>
          {processing ? (
            <div className="text-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-table text-text-sec">{t('shipments.upload.processing')}</p>
            </div>
          ) : (
            <UploadZone label={t('shipments.upload.dragDrop')} accept=".pdf,.xlsx,.csv" onFiles={handleFiles} />
          )}
        </div>
      )}

      {/* Step 3: Review Drafts */}
      {step === 3 && (
        <div className="space-y-2">
          {drafts.map(d => (
            <div
              key={d.id}
              onClick={() => toggleSelect(d.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${selected.has(d.id) ? 'border-primary bg-highlight' : 'border-border-light hover:border-border'}`}
            >
              <input type="checkbox" checked={selected.has(d.id)} readOnly className="rounded" />
              <div className="flex-1">
                <div className="text-table font-medium">{d.filename}</div>
                <div className="text-label text-text-sec">Customer: {d.customer} | Qty: {d.qty.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-label font-medium ${d.confidence >= 90 ? 'text-success' : 'text-warning'}`}>
                  OCR {d.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
