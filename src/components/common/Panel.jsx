export default function Panel({ header, children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-border-light shadow-sm ${className}`}>
      {header && (
        <div className="border-b border-border-light px-4 py-2.5">
          {typeof header === 'string' ? (
            <h3 className="text-sm font-semibold text-text">{header}</h3>
          ) : header}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
