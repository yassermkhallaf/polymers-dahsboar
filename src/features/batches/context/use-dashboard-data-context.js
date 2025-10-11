"use client";

import { differenceInDays } from "date-fns";
import { createContext, useContext, useState, useEffect } from "react";
import { useGetDashboardData } from "../api/use-get-dashboard-data";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const DashboardDataContext = createContext(null);

export const useDashboardDataContext = () => {
  const context = useContext(DashboardDataContext);
  if (!context) throw new Error("Must be used inside DashboardDataProvider");
  return context;
};

export const DashboardDataProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const thisDay = new Date().getDate();
  const [from, setFrom] = useState(
    fromParam || `${thisYear}-${thisMonth + 1}-01`
  );
  const [to, setTo] = useState(
    toParam || `${thisYear}-${thisMonth + 1}-${thisDay}`
  );
  const { data } = useGetDashboardData({ from, to });

  useEffect(() => {
    if (data) {
      setDashboardData(data);
    }
  }, [to, from, data]);
  const handleChangeDateFrom = (date) => {
    setFrom(date);
    if (differenceInDays(date, to) > 0) {
      setTo(date);
    }
  };
  const handleChangeDateTo = (date) => {
    setTo(date);
  };
  return (
    <DashboardDataContext.Provider
      value={{
        dashboardData,
        setDashboardData,
        from,
        setFrom,
        to,
        handleChangeDateFrom,
        handleChangeDateTo,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};
