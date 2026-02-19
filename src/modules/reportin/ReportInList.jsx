import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { ProductBadge, StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';
import ReportInForm from './ReportInForm';

const outerTabs = [
  { key: 'awaiting',       icon: '⏳', labelKey: 'reportIn.tabs.awaiting' },
  { key: 'draft',          icon: '📝', labelKey: 'reportIn.tabs.draft' },
  { key: 'pendingReview',  icon: '🔍', labelKey: 'reportIn.tabs.pendingReview' },
  { key: 'rejected',       icon: '🔁', labelKey: 'reportIn.tabs.rejected' },
  { key: 'completed',      icon: '✅', labelKey: 'reportIn.tabs.completed' },
];

const typeOptions = [
  { value: '', labelKey: 'reportIn.filters.allTypes' },
  { value: 'LPG', labelKey: 'common.products.LPG' },
  { value: 'CHEM', labelKey: 'common.products.CHEM' },
  { value: 'NGV', labelKey: 'common.products.NGV' },
  { value: 'FUEL', labelKey: 'common.products.FUEL' },
  { value: 'SCA', labelKey: 'common.products.SCA' },
  { value: 'CONTAINER', labelKey: 'common.products.CONTAINER' },
];

const buOptions = [
  { value: '', labelKey: 'reportIn.filters.allBU' },
  { value: '0609-BRP', labelKey: '' },
  { value: '060A-SRT', labelKey: '' },
  { value: '060C-BPK', labelKey: '' },
  { value: '060E-NKC', labelKey: '' },
];

const tabStatusMap = {
  awaiting: 'awaiting',
  draft: 'in_progress',
  pendingReview: 'pending_review',
  rejected: 'rejected',
  completed: 'completed',
};

export default function ReportInList() {
  const { t } = useLanguage();
  const { state } = useApp();
  const [view, setView] = useState('list');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [activeTab, setActiveTab] = useState('awaiting');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterBU, setFilterBU] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter shipments in report-in scope
  const riShipments = useMemo(() =>
    state.shipments.filter(s => ['DISPATCHED', 'REPORT_IN', 'COMPLETED'].includes(s.status)),
    [state.shipments]
  );

  const kpis = useMemo(() => ({
    awaiting: riShipments.filter(s => s.riStatus === 'awaiting').length,
    inProgress: riShipments.filter(s => s.riStatus === 'in_progress').length,
    pendingReview: riShipments.filter(s => s.riStatus === 'pending_review').length,
    completed: riShipments.filter(s => s.riStatus === 'completed').length,
    rejected: riShipments.filter(s => s.riStatus === 'rejected').length,
  }), [riShipments]);

  const kpiCards = [
    { key: 'awaiting',       labelKey: 'reportIn.kpi.awaiting', count: kpis.awaiting,       bg: '#fff8f0', border: '#fed7aa', color: '#ea580c', icon: '⏳' },
    { key: 'draft',          labelKey: 'reportIn.kpi.inProgress', count: kpis.inProgress,    bg: '#e8f4fd', border: '#93c5fd', color: '#2563eb', icon: '🔄' },
    { key: 'pendingReview',  labelKey: 'reportIn.kpi.pendingReview', count: kpis.pendingReview, bg: '#fff8e1', border: '#fde68a', color: '#ca8a04', icon: '👁' },
    { key: 'completed',      labelKey: 'reportIn.kpi.completed', count: kpis.completed,     bg: '#f1fdf6', border: '#86efac', color: '#16a34a', icon: '✅' },
    { key: 'rejected',       labelKey: 'reportIn.kpi.rejected', count: kpis.rejected,      bg: '#fff0f0', border: '#fca5a5', color: '#dc2626', icon: '❌' },
  ];

  const filtered = useMemo(() => {
    let list = riShipments.filter(s => s.riStatus === tabStatusMap[activeTab]);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.shipmentNo.toLowerCase().includes(q) ||
        s.customer?.toLowerCase().includes(q) ||
        s.driver?.toLowerCase().includes(q) ||
        s.routeName?.toLowerCase().includes(q)
      );
    }
    if (filterType) {
      list = list.filter(s => s.product === filterType);
    }
    if (filterBU) {
      list = list.filter(s => s.bu === filterBU);
    }
    return list;
  }, [riShipments, activeTab, search, filterType, filterBU]);

  const handleOpen = (shipment) => {
    setSelectedShipment(shipment);
    setView('form');
  };

  if (view === 'form' && selectedShipment) {
    return (
      <ReportInForm
        shipment={selectedShipment}
        onBack={() => { setView('list'); setSelectedShipment(null); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-bold text-text flex items-center gap-2">
            <span>📋</span> {t('reportIn.pageTitle')}
            
          </h1>
          <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <span>📱</span> {t('reportIn.autoReady')}
          </span>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg transition-colors"
        >
          <span>🔄</span> {t('reportIn.refresh')}
        </button>
      </div>

      {/* 5 KPI Cards */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {kpiCards.map(kpi => (
          <button
            key={kpi.key}
            onClick={() => setActiveTab(kpi.key)}
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-lg border-2 transition-all min-w-[140px] flex-shrink-0"
            style={{
              backgroundColor: kpi.bg,
              borderColor: activeTab === kpi.key ? kpi.color : kpi.border,
              boxShadow: activeTab === kpi.key ? `0 0 0 1px ${kpi.color}` : 'none',
            }}
          >
            <span className="text-lg">{kpi.icon}</span>
            <span className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.count}</span>
            <span className="text-xs text-text-sec whitespace-nowrap">{t(kpi.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* 5 Outer Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {outerTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-table border-b-2 transition-colors whitespace-nowrap
              ${activeTab === tab.key
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-text-sec hover:text-text'}`}
          >
            <span>{tab.icon}</span> {t(tab.labelKey)}
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-600">
              {tab.key === 'awaiting' ? kpis.awaiting
                : tab.key === 'draft' ? kpis.inProgress
                : tab.key === 'pendingReview' ? kpis.pendingReview
                : tab.key === 'rejected' ? kpis.rejected
                : kpis.completed}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder={t('common.search') + '...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[280px] max-w-md border border-border rounded px-3 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-border rounded px-3 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {typeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
          ))}
        </select>
        <select
          value={filterBU}
          onChange={e => setFilterBU(e.target.value)}
          className="border border-border rounded px-3 py-1.5 text-table focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {buOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.labelKey ? t(opt.labelKey) : (opt.value || t('reportIn.filters.allBU'))}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border-light shadow-sm overflow-x-auto">
        <table className="w-full text-table">
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="text-left px-3 py-2.5 font-medium text-text-sec w-10">#</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.shipmentNo')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.type')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.route')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.driverPlate')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.customer')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.dispatchDate')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.stageProgress')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.status')}</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-sec">{t('reportIn.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-text-sec">{t('common.noDataFound')}</td>
              </tr>
            ) : (
              filtered.map((row, idx) => {
                const doneStages = row.stages?.filter(s => s.status === 'completed').length || 0;
                const totalStages = row.stages?.length || 0;
                return (
                  <tr
                    key={row.id}
                    onClick={() => handleOpen(row)}
                    className="border-b border-border-light hover:bg-bg/50 cursor-pointer transition-colors"
                  >
                    <td className="px-3 py-2.5 text-text-sec">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-medium text-primary">{row.shipmentNo}</td>
                    <td className="px-3 py-2.5"><ProductBadge product={row.product} /></td>
                    <td className="px-3 py-2.5">{row.routeName}</td>
                    <td className="px-3 py-2.5">
                      <div>{row.driver}</div>
                      <div className="text-label text-text-sec">{row.plate}</div>
                    </td>
                    <td className="px-3 py-2.5">{row.customer}</td>
                    <td className="px-3 py-2.5">{formatDate(row.created)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {row.stages?.map((s, i) => (
                            <div
                              key={i}
                              className="h-2 rounded-full"
                              style={{
                                width: `${Math.max(16, 48 / totalStages)}px`,
                                backgroundColor: s.status === 'completed' ? '#16a34a' : '#e5e7eb',
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-label text-text-sec ml-1">{doneStages}/{totalStages}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      {row.riStatus === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{'✅'} Completed</span>
                      ) : row.riStatus === 'pending_review' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">{'👁'} Pending Review</span>
                      ) : row.riStatus === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{'🔁'} Rejected</span>
                      ) : row.riStatus === 'in_progress' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{'🔄'} In Progress</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{'⏳'} Awaiting</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpen(row); }}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors"
                      >
                        <span>📝</span> {t('common.status.open')}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
