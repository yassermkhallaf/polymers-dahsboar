"use client";

import ProductionDashboard from "@/components/productions-dashboard";
import MapDisplay from "@/components/map-display";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
const Dashboard = () => {
  const { activePage, setActivePage } = useDashboardDataContext();
  return (
    <div>
      {activePage === "production" && <ProductionDashboard />}
      {activePage === "map" && <MapDisplay />}
    </div>
  );
};
export default Dashboard;
