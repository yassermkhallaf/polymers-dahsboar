import { useDashboardDataContext } from "@/features/batches/context/use-dashboard-data-context";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "next-themes";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const ExternalInternalPieChart = ({ externalInternalData }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const labels = Object.keys(externalInternalData).map((key) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  });
  const values = Object.values(externalInternalData);

  const data = {
    labels,
    datasets: [
      {
        label: "Customer Type",
        data: values,
        backgroundColor: [
          "#BE2429", // external
          isDark ? "#6A7282" : "#E5E7EB", // internal
        ],
        borderColor: ["#BE2429", isDark ? "#6A7282" : "#E5E7EB"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: {
          color: "#1f2937", // Tailwind gray-800
          usePointStyle: true, // ✅ use shapes instead of squares
          pointStyle: "circle",
          font: {
            size: 16,
            weight: "bold",
            family: "Montserrat Alternates",
          },
          padding: 20,
          boxWidth: 20,
        },
      },
      title: { display: false, text: "Internal vs External" },
      datalabels: {
        // 👈 لإظهار النسبة على القطاعات
        color: (context) => {
          if (context.dataIndex === 1) {
            return isDark ? "#E5E7EB" : "#BE2429"; // red
          } else if (context.dataIndex === 0) {
            return "#E5E7EB"; // gray-800
          }
        },
        font: {
          weight: "bold",
          size: 18,
          family: "Montserrat Alternates",
        },
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(0);
          return percentage + "%";
        },
      },
      tooltip: {
        backgroundColor: "#1f2937", // خلفية داكنة (Tailwind gray-800)
        titleColor: "#fff", // لون العنوان
        bodyColor: "#f9fafb", // لون النص
        borderColor: "#e5e7eb", // لون البوردر (Tailwind gray-200)
        borderWidth: 1,
        bodyFont: {
          size: 16,
          weight: "bold",
          family: "Montserrat Alternates",
        },
        padding: 16,

        displayColors: true, // يظهر اللون بجانب التولتيب
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const total = context.chart._metasets[0].total;
            const percentage = ((value / total) * 100).toFixed(1);
            return `  ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };
  return <Doughnut data={data} options={options} />;
};

export default ExternalInternalPieChart;
