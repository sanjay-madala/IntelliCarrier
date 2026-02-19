import { useState, useMemo } from 'react';
import Modal from '../../components/common/Modal';
import { EMPLOYEE_DATA } from './shipmentConstants';

import { useLanguage } from '../../contexts/LanguageContext';
export default function EmployeeSearchModal({ open, onClose, onSelect, roleFilter }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = EMPLOYEE_DATA;
    if (roleFilter) {
      list = list.filter(e => e.role === roleFilter);
    }
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.phone.includes(q)
    );
  }, [search, roleFilter]);

  const handleSelect = (emp) => {
    onSelect(emp);
    setSearch('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t('employeeSearch.title')} size="md">
      <div className="space-y-3">
        {/* Search */}
        <div className="flex border border-border rounded overflow-hidden">
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-table focus:outline-none"
          />
          <button className="px-3 bg-primary text-white text-sm">{t('truckSearch.search')}</button>
        </div>

        {/* Employee List */}
        <div className="space-y-1 max-h-[350px] overflow-y-auto">
          {filtered.map(emp => (
            <button
              key={emp.id}
              onClick={() => handleSelect(emp)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-50/50 text-left border border-border-light transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${emp.role === 'driver' ? 'bg-primary' : 'bg-accent'}`} />
                <div>
                  <div className="text-table font-medium text-text">{emp.name}</div>
                  <div className="text-xs text-text-sec">{emp.id} — {emp.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {emp.intern && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">{t('employeeSearch.intern')}</span>
                )}
                {emp.license && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    emp.licenseValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {emp.licenseValid ? '✓' : '✗'} {emp.license}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  emp.role === 'driver' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
                }`}>
                  {emp.role === 'driver' ? 'พขร.' : 'พตร.'}
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-6 text-text-muted text-table">{t('employeeSearch.noEmployeesFound')}</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
