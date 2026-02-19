import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';

const tabs = [
  { key: 'shipments',     icon: '🚛', labelKey: 'modules.shipments' },
  { key: 'reportin',      icon: '📥', labelKey: 'modules.reportIn' },
  { key: 'settlement',    icon: '💰', labelKey: 'modules.settlement' },
];

export default function ModuleTabs() {
  const { t } = useLanguage();
  const { state, dispatch } = useApp();

  const getCounts = () => {
    const shp = state.shipments?.filter(s => s.status === 'OPEN' || s.status === 'DISPATCHED').length || 0;
    const ri = state.shipments?.filter(s =>
      s.riStatus === 'pending' || s.riStatus === 'awaiting' || s.riStatus === 'draft' || s.riStatus === 'in_progress'
    ).length || 0;
    const stl = state.awaitingRows?.filter(r => r.status === 'awaiting').length || 0;
    return { shipments: shp, reportin: ri, settlement: stl };
  };

  const counts = getCounts();

  return (
    <div className="bg-surface border-b border-border">
      <div className="flex items-center gap-1 px-6">
        {tabs.map(tab => {
          const isActive = state.activeModule === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => dispatch({ type: 'SET_MODULE', payload: tab.key })}
              className={`flex items-center gap-2 px-5 py-3 text-sm transition-colors border-b-2 whitespace-nowrap
                ${isActive
                  ? 'border-primary font-semibold text-primary'
                  : 'border-transparent text-text-sec hover:text-text hover:border-border'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{t(tab.labelKey)}</span>
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium
                ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-muted'}`}>
                {counts[tab.key] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
