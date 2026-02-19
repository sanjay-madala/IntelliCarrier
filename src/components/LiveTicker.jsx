import { useApp } from '../contexts/AppContext';

export default function LiveTicker() {
  const { state } = useApp();
  const { liveTickerData } = state;

  const fields = [
    { label: 'FO', value: liveTickerData.fo },
    { label: 'SHP', value: liveTickerData.shipment },
    { label: 'Driver', value: liveTickerData.driver },
    { label: 'Product', value: liveTickerData.product },
    { label: 'Customer', value: liveTickerData.customer },
  ];

  return (
    <div className="live-ticker">
      <div className="live-badge">
        <span className="live-badge-dot" />
        LIVE
      </div>
      <div className="live-ticker-fields">
        {fields.map((f, i) => (
          <div key={f.label} className="live-ticker-field">
            {i > 0 && <span className="live-ticker-sep" />}
            <span className="live-ticker-label">{f.label}:</span>
            <span className="live-ticker-value">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
