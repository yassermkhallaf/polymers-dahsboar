import { eachDayOfInterval, subDays } from "date-fns";
import { format, parseISO } from "date-fns";
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
  const allDays = eachDayOfInterval({
    start: from,
    end: to,
  });

  // Format the result (e.g., dd-MM-yyyy)
  const formattedDays = allDays.map((day) => format(day, "yyyy-MM-dd"));
  const totalsByDay = batches.reduce((acc, item) => {
    // extract only date (without time)
    const day = format(subDays(item.created_at, 1), "yyyy-MM-dd");

    // add quantity
    acc[day] = (acc[day] || 0) + item.quantity;

    return acc;
  }, {});

  const values = [];

  formattedDays.forEach((day) => {
    if (totalsByDay[day]) {
      values.push(totalsByDay[day]);
    } else {
      values.push(0);
    }
  });
  const chartData = {
    labels: formattedDays.map((day) => format(parseISO(day), "dd-MMM")),
    datasets: [
      {
        label: "Total Quantity",
        data: values,
        backgroundColor: "#BE2429",

        fill: true,
        borderColor: isDark ? "#6A7282" : "#E5E7EB",
        tension: 0.1,
        pointRadius: 7, // normal size (default ~3)
        pointHoverRadius: 12, // size when hovering
        pointBorderWidth: 1, // optional outline thickness
        pointBorderColor: isDark ? "#6A7282" : "#fff", // optional outline color
        pointBackgroundColor: "#BE2429",
      },
    ],
  };

  const options = {
    // aspectRatio: 2,
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: "index", // show tooltip for the dataset at the same index
      intersect: false, // allow hover in the area, not just exactly on the point
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#1D1616", // لون الخلفية
        titleColor: "#fff",
        bodyColor: "#E5E7EB",
        borderWidth: 1,
        borderColor: "#BE2429",
        padding: 12,

        bodyFont: {
          size: 16,
          weight: "bold",
          family: "Montserrat Alternates",
        },
        displayColors: false, // يخفي المربع الملون
        callbacks: {
          label: function (context) {
            let value = context.raw;
            return `Quantity: ${value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
          title: function (context) {
            return `Date: ${context[0].label}`;
          },
        },
      },
      legend: {
        display: false,
        position: "top",
      },
      datalabels: {
        display: false,
        align: "top", // position
        anchor: "end",
        color: "#1D1616",

        formatter: (value) => value, // show raw number
      },
      title: {
        display: false,
        text: "Daily Production ",
        font: {
          size: 14,
          weight: "bold",
          family: "Montserrat Alternates",
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#D1D5DC" : "#1D1616", // x-axis label color
          font: {
            size: 16,
            weight: "500",
            family: "Montserrat Alternates",
          },
        },
        grid: {
          display: true,
          drawBorder: true,
          borderColor: isDark ? "#D1D5DC" : "#1D1616",
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
        },
        title: {
          display: false,
          text: "Date",
          color: "#222",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        ticks: {
          color: isDark ? "#D1D5DC" : "#222", // y-axis label color
          callback: function (value) {
            // نحول من كجم إلى طن
            return (value / 1000).toFixed(0);
          },
          font: {
            size: 16,
            weight: "400",
            family: "Roboto Mono",
          },
        },
        grid: {
          display: true,
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
        },
        title: {
          //   display: true,
          text: "Quantity",
          color: "#222",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    onHover: (event, elements, chart) => {
      if (elements.length > 0) {
        const element = elements[0];
        const datasetIndex = element.datasetIndex;
        const index = element.index;
        const value = chart.data.datasets[datasetIndex].data[index];
        const label = chart.data.labels[index];

        // 👇 Your custom action
      }
    },
  };
  return <Line data={chartData} options={options} />;
};
export default ProductivityLineChart;
