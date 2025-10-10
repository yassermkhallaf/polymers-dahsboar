"use client";
import Dashboard from "@/components/dashboard";
import { useEffect } from "react";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import { useGetDashboardData } from "@/features/batches/api/use-get-dashboard-data";
import ExternalInternalPieChart from "@/components/charts/external-internal-pie-chart";

const DashboardPage = () => {
  const { setDashboardData, from, to } = useDashboardDataContext();
  const { data, isLoading, error } = useGetDashboardData({ from, to });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Dashboard data={data} />
    </>
  );
};

export default DashboardPage;
