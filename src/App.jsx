import { LanguageProvider } from './contexts/LanguageContext';
import { AppProvider, useApp } from './contexts/AppContext';
import Shell from './components/Shell';
import LiveTicker from './components/LiveTicker';
import ModuleTabs from './components/ModuleTabs';
import Footer from './components/Footer';
import ShipmentList from './modules/shipments/ShipmentList';
import ReportInList from './modules/reportin/ReportInList';
import CashAdvanceModule from './modules/cashadvance/CashAdvanceModule';
import SettlementMain from './modules/settlement/SettlementMain';
import FuelAllocationModule from './modules/fuelallocation/FuelAllocationModule';

function ModuleRouter() {
  const { state } = useApp();

  switch (state.activeModule) {
    case 'shipments':
      return <ShipmentList />;
    case 'reportin':
      return <ReportInList />;
    case 'cashadvance':
      return <CashAdvanceModule />;
    case 'settlement':
      return <SettlementMain />;
    case 'fuelAllocation':
      return <FuelAllocationModule />;
    default:
      return <ShipmentList />;
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <div className="min-h-screen bg-bg">
          <Shell />
          <LiveTicker />
          <ModuleTabs />

          <main className="px-6 pt-6 pb-14">
            <ModuleRouter />
          </main>

          <Footer />
        </div>
      </AppProvider>
    </LanguageProvider>
  );
}
