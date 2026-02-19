import { useState } from 'react';

export default function CollapsibleSection({ title, defaultOpen = true, children, badge }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border-light rounded-lg bg-white mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-bg/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs text-text-muted transition-transform ${open ? 'rotate-90' : ''}`}>&#9654;</span>
          <span className="text-sm font-semibold text-text">{title}</span>
          {badge && <span className="badge-pill bg-primary/10 text-primary">{badge}</span>}
        </div>
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  );
}
