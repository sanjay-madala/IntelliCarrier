import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';

export default function Shell() {
  const { language, toggleLanguage, t } = useLanguage();
  const { state } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: 'FO-2026-0003 ready for review', time: '2m ago', icon: '⏳' },
    { id: 2, text: 'SHP-2026-002 dispatched', time: '15m ago', icon: '🚀' },
    { id: 3, text: 'Miles violation on Stage 2', time: '1h ago', icon: '⚠️' },
  ];
  const notifCount = notifications.length;

  const moduleNames = {
    shipments: t('modules.shipments'),
    reportin: t('modules.reportIn'),
    settlement: t('modules.settlement'),
  };

  const subtitle = moduleNames[state.activeModule] || t('app.subtitle');

  return (
    <header className="sticky top-0 z-50 h-14 shell-gradient text-white">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Logo + subtitle */}
        <div className="flex items-center gap-3">
          <span className="text-xl">{'📦'}</span>
          <span className="font-bold text-base tracking-wide">{t('app.title')}</span>
          <span className="opacity-40 mx-1">|</span>
          <span className="text-sm opacity-80">{subtitle}</span>
        </div>

        {/* Right: Language toggle + icons */}
        <div className="flex items-center gap-4">
          {/* Language Toggle Pill */}
          <div className="bg-white/20 rounded-full p-0.5 flex items-center">
            <button
              onClick={language === 'th' ? toggleLanguage : undefined}
              className={`px-3 py-0.5 rounded-full text-xs font-medium transition-colors ${
                language === 'en'
                  ? 'bg-white text-shell font-semibold'
                  : 'text-white/70 cursor-pointer hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={language === 'en' ? toggleLanguage : undefined}
              className={`px-3 py-0.5 rounded-full text-xs font-medium transition-colors ${
                language === 'th'
                  ? 'bg-white text-shell font-semibold'
                  : 'text-white/70 cursor-pointer hover:text-white'
              }`}
            >
              TH
            </button>
          </div>

          <div className="relative">
            <button onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }} className="text-white/70 hover:text-white text-sm relative">
              {'🔔'}
              {notifCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{notifCount}</span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-8 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 text-text">
                <div className="px-3 py-2 border-b border-gray-100 font-semibold text-xs text-text-sec">Notifications</div>
                {notifications.map(n => (
                  <div key={n.id} className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 text-xs flex gap-2">
                    <span>{n.icon}</span>
                    <div className="flex-1">
                      <div className="text-text">{n.text}</div>
                      <div className="text-text-muted text-[10px]">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => window.alert('Settings panel coming soon.')} className="text-white/70 hover:text-white text-sm">{'⚙️'}</button>
          <div className="relative">
            <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }} className="text-white/70 hover:text-white text-sm">{'👤'}</button>
            {showUserMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 text-text text-xs">
                <div className="px-3 py-2.5 border-b border-gray-100">
                  <div className="font-semibold">Somchai K.</div>
                  <div className="text-text-muted text-[10px]">Dispatcher • BU: LPG</div>
                </div>
                <button onClick={() => { setShowUserMenu(false); window.alert('Profile settings coming soon.'); }} className="w-full text-left px-3 py-2 hover:bg-gray-50">{'👤'} Profile</button>
                <button onClick={() => { setShowUserMenu(false); window.alert('Logged out successfully.'); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600">{'🚪'} Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
