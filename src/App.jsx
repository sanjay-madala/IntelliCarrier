import { LanguageProvider } from './contexts/LanguageContext';
import { AppProvider, useApp } from './contexts/AppContext';
import Shell from './components/Shell';
import ModuleTabs from './components/ModuleTabs';
import Footer from './components/Footer';
import ShipmentList from './modules/shipments/ShipmentList';
import ReportInList from './modules/reportin/ReportInList';
import SettlementMain from './modules/settlement/SettlementMain';

function ModuleRouter() {
  const { state } = useApp();

  switch (state.activeModule) {
    case 'shipments':
      return <ShipmentList />;
    case 'reportin':
      return <ReportInList />;
    case 'settlement':
      return <SettlementMain />;
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
