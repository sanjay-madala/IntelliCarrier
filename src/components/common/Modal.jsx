import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ open, onClose, title, size = 'md', children, footer }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-xl ${sizes[size]} w-full mx-4 max-h-[90vh] flex flex-col`}>
        {title && (
          <div className="sticky top-0 bg-white border-b border-border px-5 py-3 rounded-t-lg flex items-center justify-between">
            <h3 className="text-base font-semibold text-text">{title}</h3>
            <button onClick={onClose} className="text-text-muted hover:text-text text-lg leading-none">&times;</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
        {footer && (
          <div className="sticky bottom-0 bg-white border-t border-border px-5 py-3 rounded-b-lg flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
