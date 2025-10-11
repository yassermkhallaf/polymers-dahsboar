"use client";
import Dashboard from "@/components/dashboard";
import { Suspense, useEffect } from "react";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import { useGetDashboardData } from "@/features/batches/api/use-get-dashboard-data";

const DashboardPage = () => {
  const { from, to } = useDashboardDataContext();
  const { data, isLoading } = useGetDashboardData({ from, to });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard data={data} />
      </Suspense>
    </>
  );
};

export default DashboardPage;
