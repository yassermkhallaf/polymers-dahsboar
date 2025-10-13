"use client";

import { differenceInDays } from "date-fns";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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
  const [batches, setBatches] = useState(null);
  const [query, setQuery] = useState({});
  const [isPreparingData, setIsPreparingData] = useState(false);
  const searchParams = useSearchParams();

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

  const handleChangeDateFrom = (date) => {
    setFrom(date);
    if (differenceInDays(date, to) > 0) {
      setTo(date);
    }
  };
  const handleChangeDateTo = (date) => {
    setTo(date);
  };

  const handlePreparingData = useCallback((batches) => {
    setIsPreparingData(true);
    const routingNames = [
      "C1",
      "C2",
      "J1",
      "J2",
      "J3",
      "L1",
      "L2",
      "L3",
      "L4",
      "L7",
    ];

    const routingNamesMap = new Map();
    routingNames.forEach((routingName) => {
      routingNamesMap.set(routingName, 0);
    });
    batches.forEach((batch) => {
      const qty = batch.quantity;
      const routingName = batch.routing_no;
      if (routingName) {
        routingNamesMap.set(
          routingName,
          routingNamesMap.get(routingName) + qty
        );
      }
    });
    const categoryMap = new Map();
    batches.forEach((batch) => {
      const category = batch.item_category;
      if (category) {
        categoryMap.set(
          category,
          (categoryMap.get(category) || 0) + batch.quantity
        );
      }
    });
    const customerTypeMap = new Map();
    batches.forEach((batch) => {
      const customerType = batch.cust_type;

      if (customerType) {
        customerTypeMap.set(
          customerType,
          (customerTypeMap.get(customerType) || 0) + batch.quantity
        );
      }
    });
    const customerCountryMap = new Map();
    batches.forEach((batch) => {
      const customerCountry = batch.cust_country;
      if (customerCountry) {
        customerCountryMap.set(
          customerCountry,
          (customerCountryMap.get(customerCountry) || 0) + batch.quantity
        );
      }
    });
    const salesRepMap = new Map();
    batches.forEach((batch) => {
      const salesRep = batch.sales_rep;
      if (salesRep) {
        salesRepMap.set(
          salesRep,
          (salesRepMap.get(salesRep) || 0) + batch.quantity
        );
      }
    });
    const totalQty = batches.reduce(
      (total, batch) => total + batch.quantity,
      0
    );
    const customerTypeObj = { external: 0, internal: 0 };
    batches.forEach((batch, i) => {
      if (batch.cust_type === "External") {
        customerTypeObj.external += batch.quantity;
      } else {
        customerTypeObj.internal += batch.quantity;
      }
    });
    setDashboardData({
      customerTypeObj,
      totalQty,
      customerType: Array.from(customerTypeObj, ([key, value]) => {
        return {
          type: key,
          value,
        };
      }),
      batches,
      routingData: Array.from(routingNamesMap, ([routingName, qty]) => ({
        routingName,
        value: qty,
      })),
      categoryData: Array.from(categoryMap, ([category, qty]) => ({
        category,
        value: qty,
      })),
      customerTypeData: Array.from(customerTypeMap, ([customerType, qty]) => ({
        customerType,
        value: qty,
      })),
      customerCountryData: Array.from(
        customerCountryMap,
        ([customerCountry, qty]) => ({
          customerCountry,
          value: qty,
        })
      ),
      salesRepData: Array.from(salesRepMap, ([salesRep, qty]) => ({
        salesRep,
        value: qty,
      })),
    });
    setIsPreparingData(false);
  }, []);
  const handleQueryData = (field, value) => {
    setQuery((prev) => {
      if (prev[field]) {
        if (prev[field].includes(value)) {
          return {
            ...prev,
            [field]: prev[field].filter((item) => item !== value),
          };
        } else {
          return {
            ...prev,
            [field]: [...prev[field], value],
          };
        }
      } else {
        return {
          ...prev,
          [field]: [value],
        };
      }
    });
  };
  useEffect(() => {
    console.log(query);
    console.log(batches);
    const categoriesArray = query.item_category || [];
    if (batches) {
      const updatedBatches = batches.filter((item) =>
        categoriesArray.includes(item.item_category)
      );
      handlePreparingData(
        Object.keys(updatedBatches).length > 0 ? updatedBatches : batches
      );
    }
  }, [query, batches, handlePreparingData]);
  return (
    <DashboardDataContext.Provider
      value={{
        dashboardData,
        setDashboardData,
        batches,
        setBatches,
        from,
        setFrom,
        handleQueryData,
        to,
        handlePreparingData,
        handleChangeDateFrom,
        handleChangeDateTo,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};
