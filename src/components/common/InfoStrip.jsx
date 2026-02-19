const variants = {
  info:    'border-l-primary bg-blue-50 text-primary',
  warning: 'border-l-warning bg-amber-50 text-warning',
  success: 'border-l-success bg-green-50 text-success',
  error:   'border-l-error bg-red-50 text-error',
};

export default function InfoStrip({ variant = 'info', icon, children }) {
  return (
    <div className={`border-l-4 rounded-r-lg px-4 py-3 text-table flex items-start gap-2.5 ${variants[variant]}`}>
      {icon && <span className="text-base mt-0.5">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}
