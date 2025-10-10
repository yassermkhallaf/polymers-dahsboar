"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTheme } from "next-themes";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

export default function RoutingBarChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sortedData = data.sort((a, b) => b.value - a.value);
  const labels = sortedData.map((d) => d.routingName);

  const values = sortedData.map((d) => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Value",
        data: values,
        backgroundColor: "#BE2429", // simple blue, can change
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: "x", // 👉 makes it horizontal
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index", // show tooltip for the dataset at the same index
      intersect: false, // allow hover in the area, not just exactly on the point
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        color: isDark ? "#fff" : "#000",
        font: {
          weight: isDark ? "200" : "500",
          size: 12,
          family: "Roboto Mono",
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percent = ((value / total) * 100).toFixed(0);
          return `${value.toLocaleString()}\n(${percent}%)`;
        },
      },
      legend: { display: false },
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
        },
      },
    },
    scales: {
      y: {
        // display: false,
        beginAtZero: false,
        suggestedMax: (ctx) => {
          // نجيب أعلى قيمة في الداتا ونزود عليها 100
          const data = ctx.chart.data.datasets[0].data;
          return Math.max(...data) + 200;
        },
        ticks: {
          callback: function (value) {
            // نحول من كجم إلى طن
            return (value / 1000).toFixed(0);
          },
          font: {
            size: 12,
            weight: "700",
            family: "Roboto Mono",
          },
          color: isDark ? "#fff" : "#000",
          //   stepSize: 1000,
        },
        title: {
          display: false,
          text: "Quantity",
          color: "#222",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          drawTicks: true,
          drawBorder: true,
          // color: () => "transparent",
          borderColor: isDark ? "#fff" : "#000", // ✅ خط المحور
          borderWidth: 3,
        },
      },
      x: {
        ticks: {
          color: isDark ? "#fff" : "#000", // x-axis label color
          font: {
            size: 16,
            weight: "700",
            family: "Montserrat Alternates",
          },
        },
        grid: {
          drawTicks: true,
          drawBorder: true,
          // color: () => "transparent",
          borderColor: isDark ? "#fff" : "#000", // ✅ خط المحور
          borderWidth: 3,
        },
      },
    },
  };

  return (
    <div className="h-[100%] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
