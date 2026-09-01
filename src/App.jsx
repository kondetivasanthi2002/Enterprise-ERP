import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AIChatAssistant } from './components/common/AIChatAssistant';

import { DashboardModule } from './components/modules/DashboardModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { SalesCRMModule } from './components/modules/SalesCRMModule';
import { HCMModule } from './components/modules/HCMModule';
import { ProcurementModule } from './components/modules/ProcurementModule';
import { ManufacturingModule } from './components/modules/ManufacturingModule';
import { ProjectsModule } from './components/modules/ProjectsModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { AdminModule } from './components/modules/AdminModule';

const MainContent = () => {
  const { activeModule } = useERP();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'finance':
        return <FinanceModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'sales':
        return <SalesCRMModule />;
      case 'hcm':
        return <HCMModule />;
      case 'procurement':
        return <ProcurementModule />;
      case 'mrp':
        return <ManufacturingModule />;
      case 'projects':
        return <ProjectsModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'admin':
        return <AdminModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-layout">
        <Header />
        <main className="content-viewport">
          {renderModule()}
        </main>
      </div>
      <AIChatAssistant />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainContent />
    </ERPProvider>
  );
}
