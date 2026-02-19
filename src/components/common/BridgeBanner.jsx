const gradients = {
  green: 'bridge-green',
  blue: 'bridge-blue',
  purple: 'bridge-purple',
  primary: 'bridge-gradient-primary',
  accent: 'bridge-gradient-accent',
  warning: 'bridge-gradient-warning',
};

export default function BridgeBanner({ icon, title, subtitle, action, onAction, gradient = 'green' }) {
  return (
    <div className={`${gradients[gradient] || gradients.green} text-white rounded-lg p-5 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <div className="font-semibold text-sm">{title}</div>
          {subtitle && <div className="text-xs opacity-80 mt-0.5">{subtitle}</div>}
        </div>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded text-sm font-medium transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
}
