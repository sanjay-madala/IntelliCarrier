import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';

const tmsOptions = [
  { value: 'tms_alpha', label: 'TMS Alpha' },
  { value: 'tms_beta', label: 'TMS Beta' },
  { value: 'sap_tm', label: 'SAP TM' },
];

export default function TMSModal({ open, onClose, onFetch }) {
  const { t } = useLanguage();
  const [system, setSystem] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      setResults([
        { id: 'TMS-001', shipmentNo: 'TMS-2026-001', customer: 'Auto Customer A', route: 'Bangkok → Chonburi', qty: 15000 },
        { id: 'TMS-002', shipmentNo: 'TMS-2026-002', customer: 'Auto Customer B', route: 'Rayong → Saraburi', qty: 22000 },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} title="TMS API Fetch" size="lg"
      footer={
        results.length > 0 ? (
          <button onClick={() => onFetch?.(results)} className="px-3 py-1.5 rounded bg-primary text-white text-table hover:bg-primary-hover">
            Import Selected
          </button>
        ) : null
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <FormField label="TMS System" type="select" value={system} onChange={setSystem} options={tmsOptions} />
          <FormField label="Date From" type="date" value={dateFrom} onChange={setDateFrom} />
          <FormField label="Date To" type="date" value={dateTo} onChange={setDateTo} />
        </div>
        <button
          onClick={handleFetch}
          disabled={!system || loading}
          className="px-4 py-1.5 rounded bg-primary text-white text-table hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch from TMS'}
        </button>

        {loading && (
          <div className="text-center py-6">
            <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 border border-border-light rounded-lg hover:bg-highlight">
                <div>
                  <div className="text-table font-medium">{r.shipmentNo}</div>
                  <div className="text-label text-text-sec">{r.customer} — {r.route} — Qty: {r.qty.toLocaleString()}</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
