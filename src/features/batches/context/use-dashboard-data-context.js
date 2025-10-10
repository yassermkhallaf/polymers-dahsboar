"use client";

import { differenceInDays } from "date-fns";
import { createContext, useContext, useState, useEffect } from "react";
import { useGetDashboardData } from "../api/use-get-dashboard-data";

const DashboardDataContext = createContext(null);

export const useDashboardDataContext = () => {
  const context = useContext(DashboardDataContext);
  if (!context) throw new Error("Must be used inside DashboardDataProvider");
  return context;
};

export const DashboardDataProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const thisYear = new Date().getFullYear();
  const [from, setFrom] = useState(`${thisYear}-01-01`);
  const [to, setTo] = useState(`${thisYear}-12-31`);
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
