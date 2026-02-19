import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="fixed bottom-0 w-full z-[500] h-10 bg-shell text-white text-xs flex items-center justify-between px-6">
      <span>{t('app.title')} {t('app.version')}</span>
      <span>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
    </footer>
  );
}
