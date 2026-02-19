import { statusConfig, sourceConfig, productConfig } from '../../data/mockData';

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
  return (
    <span className={`badge-pill gap-1 ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function SourceBadge({ source }) {
  const cfg = sourceConfig[source] || { icon: '📋', color: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`badge-pill gap-1 ${cfg.color}`}>
      {cfg.icon} {source}
    </span>
  );
}

export function ProductBadge({ product }) {
  const cfg = productConfig[product] || { icon: '📦', badge: 'bg-gray-100 text-gray-700', label: product };
  return (
    <span className={`badge-pill gap-1 ${cfg.badge}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}
