import { useState } from 'react';

export default function DataTable({ columns, data, onRowClick, emptyMessage = 'No data found' }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  if (!data.length) {
    return (
      <div className="text-center py-10 text-text-muted text-table">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-table">
        <thead>
          <tr className="bg-bg border-b border-border">
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                {...(col.sortable !== false && {
                  role: 'button',
                  tabIndex: 0,
                  onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort(col.key);
                    }
                  },
                })}
                className={`text-left px-4 py-3 font-medium text-text-sec whitespace-nowrap
                  ${col.sortable !== false ? 'cursor-pointer hover:text-text select-none' : ''}`}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1 text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              {...(onRowClick && {
                role: 'button',
                tabIndex: 0,
                onKeyDown: (e) => {
                  if (e.key === 'Enter') {
                    onRowClick(row);
                  }
                },
              })}
              className={`border-b border-border-light hover:bg-highlight transition-colors
                ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
