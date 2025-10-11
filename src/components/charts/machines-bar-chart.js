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
        borderWidth: 1,
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
        offset: 0.005,
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
          return `${(value / 1000)
            .toFixed(2)
            .toLocaleString()} Ton\n(${percent}%)`;
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
        titleFont: {
          size: 16,
          weight: "bold",
          family: "Montserrat Alternates",
        },
        bodyFont: {
          size: 16,
          weight: "bold",
          family: "Montserrat Alternates",
        },
        displayColors: false, // يخفي المربع الملون
        callbacks: {
          label: function (context) {
            let value = context.raw;
            return `${(value / 1000).toFixed(2).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} Ton`;
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
            weight: "500",
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
          display: true,
          drawBorder: true,
          borderColor: isDark ? "#D1D5DC" : "#1D1616",
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
        },
      },
      x: {
        ticks: {
          color: isDark ? "#fff" : "#000", // x-axis label color
          font: {
            size: 12,
            weight: "700",
            family: "Montserrat Alternates",
          },
        },
        grid: {
          display: true,
          drawBorder: true,
          borderColor: isDark ? "#D1D5DC" : "#1D1616",
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
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
