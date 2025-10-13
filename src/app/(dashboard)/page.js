"use client";
import Dashboard from "@/components/dashboard";
import { Suspense, useEffect } from "react";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import { useGetDashboardData } from "@/features/batches/api/use-get-dashboard-data";

const DashboardPage = () => {
  const {
    from,
    to,
    handlePreparingData,
    isPreparingData,
    dashboardData,
    setBatches,
  } = useDashboardDataContext();
  const { data, isLoading } = useGetDashboardData({ from, to });
  useEffect(() => {
    if (data) {
      setBatches(data.batches);
      handlePreparingData(data.batches);
    }
  }, [data, handlePreparingData, setBatches]);

  if (isLoading || isPreparingData || !dashboardData) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </>
  );
};

export default DashboardPage;
