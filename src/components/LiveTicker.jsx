import { useApp } from '../contexts/AppContext';

export default function LiveTicker() {
  const { state } = useApp();
  const data = state.liveTickerData || {};

  const fields = [
    { label: 'FO', value: data.fo || '—' },
    { label: 'SHP', value: data.shipment || '—' },
    { label: 'Driver', value: data.driver || '—' },
    { label: 'Product', value: data.product || '—' },
    { label: 'Customer', value: data.customer || '—' },
  ];

  return (
    <div className="flex items-center gap-2 px-6 py-1.5 bg-gray-900 text-white text-xs overflow-hidden">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-bold text-red-400">LIVE</span>
      </div>
      <div className="flex items-center gap-3 overflow-x-auto">
        {fields.map((f, i) => (
          <div key={f.label} className="flex items-center gap-1 whitespace-nowrap">
            {i > 0 && <span className="text-gray-600 mx-1">|</span>}
            <span className="text-gray-400 font-medium">{f.label}:</span>
            <span className="text-white font-semibold">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
