import { Navigate, Route, Routes } from 'react-router-dom';
import { PATHS } from './paths';
import { RouteEffects } from './RouteEffects';
import DashboardPage from '@/pages/P01Dashboard';
import SchedulePage from '@/pages/P02Schedule';
import CustomersPage from '@/pages/P03Customers';
import CustomerDetailPage from '@/pages/P04CustomerDetail';
import HistoryPage from '@/pages/P05History';
import AiInsightsPage from '@/pages/P06AiInsights';
import CampaignsPage from '@/pages/P07Campaigns';
import PerformancePage from '@/pages/P08Performance';
import SettingsPage from '@/pages/P09Settings';
import DesignSystemPage from '@/pages/P00DesignSystem';

export function AppRoutes() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path={PATHS.dashboard} element={<DashboardPage />} />
        <Route path={PATHS.schedule} element={<SchedulePage />} />
        <Route path={PATHS.customers} element={<CustomersPage />} />
        <Route path={PATHS.customerDetail} element={<CustomerDetailPage />} />
        <Route path={PATHS.history} element={<HistoryPage />} />
        <Route path={PATHS.insights} element={<AiInsightsPage />} />
        <Route path={PATHS.campaigns} element={<CampaignsPage />} />
        <Route path={PATHS.performance} element={<PerformancePage />} />
        <Route path={PATHS.settings} element={<SettingsPage />} />
        <Route path={PATHS.designSystem} element={<DesignSystemPage />} />
        <Route path="*" element={<Navigate to={PATHS.dashboard} replace />} />
      </Routes>
    </>
  );
}
