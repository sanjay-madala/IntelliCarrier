export default function KPITile({ icon, label, count, active, onClick, color = 'text-primary' }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg border transition-all min-w-[100px]
        ${active ? 'border-primary bg-highlight shadow-sm' : 'border-border-light bg-white hover:border-border hover:shadow-sm'}`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className={`text-xl font-bold ${color}`}>{count}</span>
      <span className="text-label text-text-sec whitespace-nowrap">{label}</span>
    </button>
  );
}
