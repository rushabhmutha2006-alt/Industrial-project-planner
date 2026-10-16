/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';

// Views
import { DashboardView } from './views/DashboardView';
import { CompanyDirectoryView } from './views/CompanyDirectoryView';
import { AiPlannerView } from './views/AiPlannerView';
import { VisitManagementView } from './views/VisitManagementView';
import { VisitDetailsView } from './views/VisitDetailsView';
import { StudentManagementView } from './views/StudentManagementView';
import { BudgetCalculatorView } from './views/BudgetCalculatorView';
import { ApprovalsView } from './views/ApprovalsView';
import { CalendarTransportationView } from './views/CalendarTransportationView';
import { ReportsAnalyticsView } from './views/ReportsAnalyticsView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Body with Sidebar + View Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'directory' && <CompanyDirectoryView />}
          {activeTab === 'ai-planner' && <AiPlannerView />}
          {activeTab === 'visits' && <VisitManagementView />}
          {activeTab === 'visit-details' && <VisitDetailsView />}
          {activeTab === 'students' && <StudentManagementView />}
          {activeTab === 'budget' && <BudgetCalculatorView />}
          {activeTab === 'approvals' && <ApprovalsView />}
          {activeTab === 'calendar' && <CalendarTransportationView />}
          {activeTab === 'reports' && <ReportsAnalyticsView />}
          {activeTab === 'notifications' && <NotificationsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Floating Alerts */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
