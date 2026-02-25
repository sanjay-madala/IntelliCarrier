import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import AwaitingTab from './AwaitingTab';
import ReportsTab from './ReportsTab';
import ReportDetailTab from './ReportDetailTab';
import SalesOrdersTab from './SalesOrdersTab';

import { useLanguage } from '../../contexts/LanguageContext';
const flowStepDefs = [
  { key: 'awaiting',        labelKey: 'settlement.flowSteps.awaiting', color: '#4caf50' },
  { key: 'createReport',    labelKey: 'settlement.flowSteps.createReport', color: '#ff9800' },
  { key: 'displayRecheck',  labelKey: 'settlement.flowSteps.displayRecheck', color: '#e91e63' },
  { key: 'createSO',        labelKey: 'settlement.flowSteps.createSO', color: '#2196f3' },
  { key: 'postToSAP',       labelKey: 'settlement.flowSteps.postToSAP', color: '#9c27b0' },
  { key: 'stampSO',          labelKey: 'settlement.flowSteps.stampSO', color: '#00bcd4' },
  { key: 'completed',       labelKey: 'settlement.flowSteps.completed', color: '#4caf50' },
];

// Map active tab + state to active flow step
const tabToStepMap = {
  awaiting: 0,
  reports: 1,
  reportDetail: 2,
  salesOrders: 4,
};

const tabDefs = [
  { key: 'awaiting',     icon: '📦', labelKey: 'settlement.tabs.awaiting' },
  { key: 'reports',      icon: '📋', labelKey: 'settlement.tabs.reports' },
  { key: 'reportDetail', icon: '🔍', labelKey: 'settlement.tabs.reportDetail' },
  { key: 'salesOrders',  icon: '✅', labelKey: 'settlement.tabs.salesOrders' },
];

export default function SettlementMain() {
  const { t } = useLanguage();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('awaiting');
  const [selectedReport, setSelectedReport] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const kpis = useMemo(() => ({
    awaiting: state.awaitingSettlement.filter(a => a.status === 'awaiting').length,
    lpgAwaiting: state.awaitingSettlement.filter(a => a.product === 'LPG' && a.status === 'awaiting').length,
    ngvAwaiting: state.awaitingSettlement.filter(a => a.product === 'NGV' && a.status === 'awaiting').length,
    tugAwaiting: state.awaitingSettlement.filter(a => a.product === 'TUG' && a.status === 'awaiting').length,
    reportsCreated: state.settlementReports.length,
    soPosted: state.salesOrders.filter(so => so.status === 'posted').length,
  }), [state.awaitingSettlement, state.settlementReports, state.salesOrders]);

  const handleViewReport = useCallback((report) => {
    setSelectedReport(report);
    setActiveTab('reportDetail');
  }, []);

  // Keep selectedReport in sync with global state (e.g., after Create SO updates the report)
  const syncedReport = selectedReport
    ? state.settlementReports.find(r => r.id === selectedReport.id) || selectedReport
    : null;

  const handleRefresh = () => setRefreshKey(k => k + 1);

  // Dynamic flow step based on active tab and report state
  const activeStepIndex = useMemo(() => {
    if (activeTab === 'reportDetail' && syncedReport) {
      if (syncedReport.status === 'so_posted') return 5; // stampSO
      return 2; // displayRecheck / createSO
    }
    if (activeTab === 'salesOrders') {
      const hasPending = state.salesOrders.some(so => so.status === 'pending');
      return hasPending ? 4 : 6; // postToSAP or completed
    }
    return tabToStepMap[activeTab] ?? 0;
  }, [activeTab, syncedReport, state.salesOrders]);

  const flowSteps = flowStepDefs.map((step, i) => ({
    ...step,
    active: i <= activeStepIndex,
    current: i === activeStepIndex,
  }));

  return (
    <div className="space-y-4" key={refreshKey}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">{'💰'} {t('settlement.pageTitle')}</h1>
          <p className="text-xs text-text-sec mt-0.5">
            {t('settlement.flowDescription')}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-3 py-1.5 rounded border border-border text-table text-text-sec hover:bg-bg flex items-center gap-1.5"
        >
          {'🔄'} {t('reportIn.refresh')}
        </button>
      </div>

      {/* Flow Banner */}
      <div className="bg-white rounded-lg border border-border-light p-4 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto gap-1">
          {flowSteps.map((step, i) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center min-w-[90px]">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{
                    background: step.color,
                    opacity: step.active ? 1 : 0.35,
                    boxShadow: step.current ? `0 0 8px ${step.color}60` : 'none',
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-[10px] text-center mt-1.5 leading-tight font-medium"
                  style={{ color: step.active ? step.color : '#bbb' }}
                >
                  {t(step.labelKey)}
                </span>
              </div>
              {i < flowSteps.length - 1 && (
                <span className="text-border mx-1 text-xs">{'→'}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Note */}
      <div className="border-l-4 rounded-r-lg px-4 py-2.5 text-xs flex items-start gap-2 border-l-blue-500 bg-blue-50 text-blue-800">
        <span className="text-base mt-0.5">{'ℹ️'}</span>
        <div>
          <strong>{t('settlement.infoNote')}</strong>{' '}
          {t('settlement.infoNoteBody') || 'Select shipments from the Awaiting tab, create settlement reports, generate Sales Orders, and post to SAP for billing.'}

        </div>
      </div>

      {/* KPI Tiles */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {[
          { icon: '📦', labelKey: 'settlement.kpi.awaiting', count: kpis.awaiting,      borderColor: '#ff9800', iconBg: '#fff3e0', tab: 'awaiting' },
          { icon: '🔵', labelKey: 'settlement.kpi.lpgAwaiting', count: kpis.lpgAwaiting,   borderColor: '#2196f3', iconBg: '#e3f2fd', tab: 'awaiting' },
          { icon: '🟢', labelKey: 'settlement.kpi.ngvAwaiting', count: kpis.ngvAwaiting,   borderColor: '#4caf50', iconBg: '#e8f5e9', tab: 'awaiting' },
          { icon: '🚢', labelKey: 'settlement.kpi.tugAwaiting', count: kpis.tugAwaiting,   borderColor: '#0d9488', iconBg: '#f0fdfa', tab: 'awaiting' },
          { icon: '📋', labelKey: 'settlement.kpi.reportsCreated', count: kpis.reportsCreated, borderColor: '#9c27b0', iconBg: '#f3e5f5', tab: 'reports' },
          { icon: '✅', labelKey: 'settlement.kpi.soPosted', count: kpis.soPosted,       borderColor: '#4caf50', iconBg: '#e8f5e9', tab: 'salesOrders' },
        ].map((kpi) => (
          <button
            key={kpi.labelKey}
            onClick={() => setActiveTab(kpi.tab)}
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-lg border-2 bg-white min-w-[120px] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            style={{ borderColor: kpi.borderColor }}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{ background: kpi.iconBg }}
            >
              {kpi.icon}
            </span>
            <span className="text-2xl font-bold" style={{ color: kpi.borderColor }}>
              {kpi.count}
            </span>
            <span className="text-[10px] text-text-sec whitespace-nowrap font-medium">{t(kpi.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* Tabs with arrows */}
      <div className="flex border-b border-border">
        {tabDefs.map((tab, i) => (
          <div key={tab.key} className="flex items-center">
            {i > 0 && <span className="text-text-muted mx-1 text-xs">{'→'}</span>}
            <button
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5
                ${activeTab === tab.key
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-text-sec hover:text-text'}`}
            >
              <span>{tab.icon}</span>
              <span>{t(tab.labelKey)}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'awaiting' && <AwaitingTab onReportCreated={handleViewReport} />}
      {activeTab === 'reports' && <ReportsTab onViewReport={handleViewReport} onCreateReport={() => setActiveTab('awaiting')} />}
      {activeTab === 'reportDetail' && (
        <ReportDetailTab report={syncedReport} onBack={() => setActiveTab('reports')} />
      )}
      {activeTab === 'salesOrders' && <SalesOrdersTab />}
    </div>
  );
}
