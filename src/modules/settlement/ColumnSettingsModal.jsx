import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ColumnSettingsModal({ open, onClose, columns, onChange }) {
  const { language, t } = useLanguage();

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const toggleCol = (key) => {
    onChange(columns.map(c => c.key === key ? { ...c, show: !c.show } : c));
  };

  const showAll = () => onChange(columns.map(c => ({ ...c, show: true })));
  const hideAll = () => onChange(columns.map(c => ({ ...c, show: false })));

  if (!open) return null;

  const visibleCount = columns.filter(c => c.show).length;

  return createPortal(
    <div className="fixed inset-0 z-[600] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[85vh] flex flex-col">
        {/* Header - Green Gradient */}
        <div
          className="rounded-t-lg px-5 py-3 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #4caf50, #388e3c)' }}
        >
          <div>
            <h3 className="text-base font-bold text-white">{'⚙️'} {t('columnSettings.title')}</h3>
            <p className="text-[10px] text-white/70">{t('columnSettings.subtitle')} ({visibleCount} / {columns.length} {t('columnSettings.visible')})</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {/* Show/{t('columnSettings.hideAll')} Buttons */}
          <div className="flex gap-2">
            <button
              onClick={showAll}
              className="px-3 py-1 rounded border border-green-300 text-xs text-green-700 hover:bg-green-50"
            >
              {t('columnSettings.showAll')}
            </button>
            <button
              onClick={hideAll}
              className="px-3 py-1 rounded border border-red-300 text-xs text-red-700 hover:bg-red-50"
            >
              {t('columnSettings.hideAll')}
            </button>
          </div>

          {/* 2-column Grid of Checkboxes */}
          <div className="grid grid-cols-2 gap-1.5">
            {columns.map(col => (
              <label
                key={col.key}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors text-xs
                  ${col.show ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <input
                  type="checkbox"
                  checked={col.show}
                  onChange={() => toggleCol(col.key)}
                  className="rounded text-green-600"
                />
                <span className={col.show ? 'text-text font-medium' : 'text-text-sec'}>
                  {language === 'th' ? col.labelTh : col.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3 rounded-b-lg flex justify-end gap-2 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-border text-xs text-text-sec hover:bg-white"
          >
            {t('columnSettings.close')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-white text-xs font-medium"
            style={{ background: 'linear-gradient(135deg, #4caf50, #388e3c)' }}
          >
            {'✅'} {t('columnSettings.apply')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
