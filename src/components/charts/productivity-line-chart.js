import {
  eachDayOfInterval,
  eachMonthOfInterval,
  subDays,
  differenceInDays,
  format,
  parseISO,
} from "date-fns";
import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "next-themes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ProductivityLineChart = ({ batches }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { from, to } = useDashboardDataContext();

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const numberOfDays = differenceInDays(toDate, fromDate);

  let formattedLabels = [];
  let totalsByPeriod = {};

  // 👉 If date range ≤ 30 days → group by day
  if (numberOfDays <= 30) {
    const allDays = eachDayOfInterval({ start: fromDate, end: toDate });
    formattedLabels = allDays.map((day) => format(day, "yyyy-MM-dd"));

    totalsByPeriod = batches.reduce((acc, item) => {
      const day = format(subDays(new Date(item.created_at), 1), "yyyy-MM-dd");
      acc[day] = (acc[day] || 0) + item.quantity;
      return acc;
    }, {});
  }
  // 👉 If date range > 30 days → group by month
  else {
    const allMonths = eachMonthOfInterval({ start: fromDate, end: toDate });
    formattedLabels = allMonths.map((month) => format(month, "yyyy-MM"));

    totalsByPeriod = batches.reduce((acc, item) => {
      const month = format(subDays(new Date(item.created_at), 1), "yyyy-MM");
      acc[month] = (acc[month] || 0) + item.quantity;
      return acc;
    }, {});
  }

  const values = formattedLabels.map((label) => totalsByPeriod[label] || 0);

  const chartData = {
    labels:
      numberOfDays <= 30
        ? formattedLabels.map((day) => format(parseISO(day), "dd-MMM"))
        : formattedLabels.map((month) =>
            format(parseISO(month + "-01"), "MMM-yyyy")
          ),
    datasets: [
      {
        label:
          numberOfDays <= 30
            ? "Total Quantity (per day)"
            : "Total Quantity (per month)",
        data: values,
        backgroundColor: "#BE2429",
        fill: true,
        borderColor: isDark ? "#6A7282" : "#E5E7EB",
        tension: 0.1,
        pointRadius: 7,
        pointHoverRadius: 12,
        pointBorderWidth: 1,
        pointBorderColor: isDark ? "#6A7282" : "#fff",
        pointBackgroundColor: "#BE2429",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#1D1616",
        titleColor: "#fff",
        bodyColor: "#E5E7EB",
        borderWidth: 1,
        borderColor: "#BE2429",
        padding: 12,
        bodyFont: { size: 16, weight: "bold", family: "Montserrat Alternates" },
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Quantity: ${(value / 1000).toFixed(2)} Ton`;
          },
          title: (context) => `Date: ${context[0].label}`,
        },
      },
      legend: { display: false },
      datalabels: { display: false },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#D1D5DC" : "#1D1616",
          font: { size: 12, weight: "700", family: "Montserrat Alternates" },
        },
        grid: {
          display: true,
          borderColor: isDark ? "#D1D5DC" : "#1D1616",
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
        },
      },
      y: {
        ticks: {
          color: isDark ? "#D1D5DC" : "#222",
          callback: (value) => (value / 1000).toFixed(0),
          font: { size: 12, weight: "400", family: "Roboto Mono" },
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ProductivityLineChart;
