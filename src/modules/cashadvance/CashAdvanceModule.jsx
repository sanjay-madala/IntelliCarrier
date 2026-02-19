import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import KPITile from '../../components/common/KPITile';
import InfoStrip from '../../components/common/InfoStrip';
import { formatCurrency } from '../../utils/helpers';
import ExpenseManager from './ExpenseManager';
import FuelManager from './FuelManager';
import ParkingManager from './ParkingManager';

import { useLanguage } from '../../contexts/LanguageContext';
const tabs = [
  { key: 'expenses', icon: '💰', labelKey: 'cashAdvanceModule.expenses' },
  { key: 'fuel',     icon: '⛽',       labelKey: 'cashAdvanceModule.fuelEntries' },
  { key: 'parking',  icon: '🅿️', labelKey: 'cashAdvanceModule.parking' },
];

/* ---- Seed data shared across the module ---- */

const seedExpenses = [
  { id: 'EXP-001', shipmentNo: 'SHP-2026-001', driver: 'สมชาย พลเดช', type: 'Toll',      description: 'Motorway toll Bang Na',    payType: 'Cash',       amount: 350,  receipt: true,  status: 'approved', date: '2026-02-15' },
  { id: 'EXP-002', shipmentNo: 'SHP-2026-001', driver: 'สมชาย พลเดช', type: 'Meal',      description: 'Driver lunch',             payType: 'Cash',       amount: 150,  receipt: false, status: 'pending',  date: '2026-02-15' },
  { id: 'EXP-003', shipmentNo: 'SHP-2026-002', driver: 'วิชัย สุขสวัสดิ์', type: 'Overnight', description: 'Rest stop Saraburi',       payType: 'Cash',       amount: 800,  receipt: true,  status: 'approved', date: '2026-02-16' },
  { id: 'EXP-004', shipmentNo: 'SHP-2026-003', driver: 'ประเสริฐ แก้วมณี',   type: 'Toll',      description: 'Highway toll Korat',       payType: 'Fleet Card', amount: 420,  receipt: true,  status: 'approved', date: '2026-02-14' },
  { id: 'EXP-005', shipmentNo: 'SHP-2026-003', driver: 'ประเสริฐ แก้วมณี',   type: 'Other',     description: 'Vehicle wash at depot',    payType: 'Cash',       amount: 200,  receipt: false, status: 'pending',  date: '2026-02-14' },
  { id: 'EXP-006', shipmentNo: 'SHP-2026-004', driver: 'อนุชา บุญมาก',   type: 'Toll',      description: 'Motorway Sriracha-Korat',  payType: 'Cash',       amount: 580,  receipt: true,  status: 'approved', date: '2026-02-12' },
  { id: 'EXP-007', shipmentNo: 'SHP-2026-004', driver: 'อนุชา บุญมาก',   type: 'Meal',      description: 'Driver dinner + breakfast', payType: 'Cash',       amount: 250,  receipt: true,  status: 'approved', date: '2026-02-12' },
  { id: 'EXP-008', shipmentNo: 'SHP-2026-004', driver: 'อนุชา บุญมาก',   type: 'Overnight', description: 'Khon Kaen rest area',      payType: 'Cash',       amount: 600,  receipt: true,  status: 'approved', date: '2026-02-13' },
];

const seedFuel = [
  { id: 'FUEL-001', shipmentNo: 'SHP-2026-001', driver: 'สมชาย พลเดช', plate: '1กข-1234', fillType: 'Full',    station: 'PTT Station Km.45',      fuelType: 'Diesel B7',  liters: 120,  pricePerLiter: 32.50, milesBefore: 45230, milesAfter: 45380, fleetCard: 'FC-V1001', date: '2026-02-15' },
  { id: 'FUEL-002', shipmentNo: 'SHP-2026-002', driver: 'วิชัย สุขสวัสดิ์', plate: '5กฉ-7890', fillType: 'Full',    station: 'Shell Rayong',           fuelType: 'Diesel B7',  liters: 200,  pricePerLiter: 32.80, milesBefore: 32100, milesAfter: 32350, fleetCard: 'FC-V1005', date: '2026-02-16' },
  { id: 'FUEL-003', shipmentNo: 'SHP-2026-003', driver: 'ประเสริฐ แก้วมณี',   plate: '4กจ-3456', fillType: 'Full',    station: 'Bangchak Don Mueang',    fuelType: 'Diesel B7',  liters: 180,  pricePerLiter: 32.50, milesBefore: 67800, milesAfter: 67980, fleetCard: 'FC-V1004', date: '2026-02-14' },
  { id: 'FUEL-004', shipmentNo: 'SHP-2026-003', driver: 'ประเสริฐ แก้วมณี',   plate: '4กจ-3456', fillType: 'Partial', station: 'PTT Pak Chong',          fuelType: 'Diesel B7',  liters: 80,   pricePerLiter: 32.60, milesBefore: 67980, milesAfter: 68060, fleetCard: 'FC-V1004', date: '2026-02-14' },
  { id: 'FUEL-005', shipmentNo: 'SHP-2026-004', driver: 'อนุชา บุญมาก',   plate: '2กค-5678', fillType: 'Full',    station: 'PTT Sriracha',           fuelType: 'Diesel B20', liters: 250,  pricePerLiter: 31.90, milesBefore: 89200, milesAfter: 89500, fleetCard: 'FC-V1002', date: '2026-02-12' },
  { id: 'FUEL-006', shipmentNo: 'SHP-2026-004', driver: 'อนุชา บุญมาก',   plate: '2กค-5678', fillType: 'Partial', station: 'Esso Korat',             fuelType: 'Diesel B20', liters: 100,  pricePerLiter: 32.00, milesBefore: 89500, milesAfter: 89680, fleetCard: 'FC-V1002', date: '2026-02-13' },
];

const seedParking = [
  { id: 'PKG-001', shipmentNo: 'SHP-2026-002', driver: 'วิชัย สุขสวัสดิ์', stage: 1, location: 'Rest Area Km.120',        placeType: 'Rest Area',   start: '2026-02-16T22:00', end: '2026-02-17T04:00', reason: 'Mandatory rest',     amount: 100 },
  { id: 'PKG-002', shipmentNo: 'SHP-2026-003', driver: 'ประเสริฐ แก้วมณี',   stage: 1, location: 'Pak Chong Warehouse',    placeType: 'Warehouse',   start: '2026-02-14T10:00', end: '2026-02-14T12:30', reason: 'Waiting for unload', amount: 0 },
  { id: 'PKG-003', shipmentNo: 'SHP-2026-003', driver: 'ประเสริฐ แก้วมณี',   stage: 2, location: 'PTT Gas Station Korat',  placeType: 'Gas Station', start: '2026-02-14T18:00', end: '2026-02-15T05:00', reason: 'Overnight rest',     amount: 150 },
  { id: 'PKG-004', shipmentNo: 'SHP-2026-004', driver: 'อนุชา บุญมาก',   stage: 1, location: 'Nakhon Ratchasima Depot', placeType: 'Warehouse',   start: '2026-02-12T14:00', end: '2026-02-12T16:00', reason: 'Queuing for unload', amount: 0 },
  { id: 'PKG-005', shipmentNo: 'SHP-2026-004', driver: 'อนุชา บุญมาก',   stage: 2, location: 'Rest Area Km.310',        placeType: 'Rest Area',   start: '2026-02-12T22:00', end: '2026-02-13T04:30', reason: 'Mandatory rest',     amount: 80 },
];

/* ---- Cash advance balances per shipment ---- */

const cashAdvances = {
  'SHP-2026-001': 5000,
  'SHP-2026-002': 8000,
  'SHP-2026-003': 10000,
  'SHP-2026-004': 12000,
  'SHP-2026-005': 6000,
};

export default function CashAdvanceModule() {
  const { t } = useLanguage();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState(seedExpenses);
  const [fuelEntries, setFuelEntries] = useState(seedFuel);
  const [parkingEntries, setParkingEntries] = useState(seedParking);

  /* ---- Aggregate KPIs ---- */
  const summary = useMemo(() => {
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalFuel = fuelEntries.reduce((s, f) => s + f.liters * f.pricePerLiter, 0);
    const totalParking = parkingEntries.reduce((s, p) => s + p.amount, 0);
    const totalAdvanced = Object.values(cashAdvances).reduce((s, v) => s + v, 0);
    const totalSpent = totalExpenses + totalFuel + totalParking;

    return {
      totalExpenses,
      totalFuel,
      totalParking,
      totalAdvanced,
      totalSpent,
      remaining: totalAdvanced - totalSpent,
      expenseCount: expenses.length,
      fuelCount: fuelEntries.length,
      parkingCount: parkingEntries.length,
      pendingCount: expenses.filter(e => e.status === 'pending').length,
      totalLiters: fuelEntries.reduce((s, f) => s + f.liters, 0),
    };
  }, [expenses, fuelEntries, parkingEntries]);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-border-light p-5">
        <h2 className="text-lg font-bold text-text flex items-center gap-2">
          <span className="text-xl">{'💰'}</span> {t('cashAdvance.pageTitle')} {'—'} {t('cashAdvanceModule.expenseFuelParking')}
        </h2>
        <p className="text-sm text-text-sec mt-1">
          {t('cashAdvanceModule.moduleDescription')}
        </p>
      </div>

      {/* Info Note */}
      <InfoStrip variant="info" icon={'ℹ️'}>
        {t('cashAdvanceModule.crossShipmentInfo')}
      </InfoStrip>

      {/* Summary Panel */}
      <div className="bg-white rounded-lg border border-border-light p-4">
        <h3 className="text-sm font-semibold text-text-sec mb-3">{t('cashAdvance.summary')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-label text-text-sec">{t('cashAdvance.totalAdvanced')}</div>
            <div className="text-base font-bold text-primary">{formatCurrency(summary.totalAdvanced)}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-label text-text-sec">{t('cashAdvance.totalSpent')}</div>
            <div className="text-base font-bold text-error">{formatCurrency(summary.totalSpent)}</div>
          </div>
          <div className={`${summary.remaining >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-3 text-center`}>
            <div className="text-label text-text-sec">{t('cashAdvance.remaining')}</div>
            <div className={`text-base font-bold ${summary.remaining >= 0 ? 'text-success' : 'text-error'}`}>{formatCurrency(summary.remaining)}</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <div className="text-label text-text-sec">{t('cashAdvance.tabs.expenses')}</div>
            <div className="text-base font-bold text-warning">{formatCurrency(summary.totalExpenses)}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-label text-text-sec">{t('cashAdvance.fuelCost')}</div>
            <div className="text-base font-bold text-purple">{formatCurrency(summary.totalFuel)}</div>
          </div>
          <div className="bg-cyan-50 rounded-lg p-3 text-center">
            <div className="text-label text-text-sec">{t('cashAdvance.tabs.parking')}</div>
            <div className="text-base font-bold text-cyan-700">{formatCurrency(summary.totalParking)}</div>
          </div>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        <KPITile icon={'💰'} label={t('cashAdvanceModule.expenses')}       count={summary.expenseCount} color="text-warning"   active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
        <KPITile icon={'⛽'}       label={t('cashAdvanceModule.fuelEntries')}    count={summary.fuelCount}    color="text-purple"    active={activeTab === 'fuel'}     onClick={() => setActiveTab('fuel')} />
        <KPITile icon={'🅿️'} label={t('cashAdvanceModule.parking')}  count={summary.parkingCount} color="text-cyan-600"  active={activeTab === 'parking'}  onClick={() => setActiveTab('parking')} />
        <KPITile icon={'⏳'}       label={t('cashAdvanceModule.pendingReview')}  count={summary.pendingCount} color="text-yellow-600" />
        <KPITile icon={'⛽'}       label={t('cashAdvanceModule.totalLiters')}    count={summary.totalLiters.toLocaleString()}  color="text-blue-600" />
        <KPITile icon={'🚚'} label={t('cashAdvanceModule.shipments')}      count={state.shipments.length} color="text-green-600" />
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-table border-b-2 transition-colors flex items-center gap-1.5
              ${activeTab === tab.key ? 'border-primary text-primary font-medium' : 'border-transparent text-text-sec hover:text-text'}`}
          >
            <span>{tab.icon}</span> {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'expenses' && (
        <ExpenseManager
          expenses={expenses}
          setExpenses={setExpenses}
          cashAdvances={cashAdvances}
          shipments={state.shipments}
        />
      )}
      {activeTab === 'fuel' && (
        <FuelManager
          fuelEntries={fuelEntries}
          setFuelEntries={setFuelEntries}
          shipments={state.shipments}
        />
      )}
      {activeTab === 'parking' && (
        <ParkingManager
          parkingEntries={parkingEntries}
          setParkingEntries={setParkingEntries}
          shipments={state.shipments}
        />
      )}
    </div>
  );
}
