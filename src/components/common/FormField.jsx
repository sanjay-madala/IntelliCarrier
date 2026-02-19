export default function FormField({ label, type = 'text', value, onChange, options, placeholder, disabled, required, className = '' }) {
  const base = 'w-full border border-border rounded-md px-3 py-2 text-table text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-bg disabled:text-text-muted';

  return (
    <div className={className}>
      {label && (
        <label className="block text-label font-medium text-text-sec mb-1.5">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          className={base}
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={3}
          className={base}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}
