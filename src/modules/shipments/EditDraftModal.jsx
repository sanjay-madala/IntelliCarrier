import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import CollapsibleSection from '../../components/common/CollapsibleSection';

export default function EditDraftModal({ open, onClose, draft, onSave }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    customer: draft?.customer || '',
    qty: draft?.qty || '',
    route: draft?.route || '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title="Edit Draft" size="lg"
      footer={
        <>
          <button onClick={onClose} className="px-3 py-1.5 rounded border border-border text-table hover:bg-bg">{t('common.cancel')}</button>
          <button onClick={() => onSave?.({ ...draft, ...form })} className="px-3 py-1.5 rounded bg-primary text-white text-table hover:bg-primary-hover">{t('common.save')}</button>
        </>
      }
    >
      {/* OCR Confidence Header */}
      {draft?.confidence && (
        <div className={`mb-4 px-3 py-2 rounded text-table font-medium
          ${draft.confidence >= 90 ? 'bg-green-50 text-success' : 'bg-amber-50 text-warning'}`}>
          OCR Confidence: {draft.confidence}% — {draft.confidence >= 90 ? 'High confidence' : 'Review recommended'}
        </div>
      )}

      <CollapsibleSection title="Shipment Details">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Customer" value={form.customer} onChange={v => update('customer', v)} />
          <FormField label="Quantity" type="number" value={form.qty} onChange={v => update('qty', v)} />
          <FormField label="Route" value={form.route} onChange={v => update('route', v)} />
        </div>
      </CollapsibleSection>
    </Modal>
  );
}
