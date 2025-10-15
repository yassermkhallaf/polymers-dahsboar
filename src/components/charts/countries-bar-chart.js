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

export default function CountriesBarChart({ data, onClick }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sortedData = data.sort((a, b) => b.value - a.value);
  const labels = sortedData.map((d) => d.customerCountry);

  const values = sortedData.map((d) => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Value",
        data: values,
        backgroundColor: "#BE2429", // simple blue, can change
        borderRadius: Number.MAX_VALUE,
        barThickness: 25,
        borderSkipped: false,
        borderWidth: 1.5,
        borderColor: isDark ? "#fff" : "#000",
      },
    ],
  };

  const options = {
    indexAxis: "y", // 👉 makes it horizontal
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      axis: "y",
      intersect: false,
    },
    plugins: {
      datalabels: {
        display: false,
        anchor: "center",
        align: "center",

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
        borderColor: isDark ? "#BE2429" : "#1D1616",
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
            const total = context.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
            const percent = ((value / total) * 100).toFixed(0);
            return `${(value / 1000).toFixed(2).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} Ton \n (${percent}%)`;
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
          return Math.max(...data);
        },
        ticks: {
          font: {
            // size: 25,
            weight: "700",
            family: "Montserrat Alternates",
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
          display: false,
          drawBorder: false,
          borderColor: isDark ? "#D1D5DC" : "#1D1616",
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
        },
      },
      x: {
        ticks: {
          display: false,
          color: isDark ? "#fff" : "#000", // x-axis label color
          callback: function (value) {
            // نحول من كجم إلى طن
            return (value / 1000).toFixed(0);
          },
          font: {
            size: 12,
            weight: "500",
            family: "Roboto Mono",
          },
        },
        grid: {
          display: false,
          drawBorder: false,
          borderColor: isDark ? "#D1D5DC" : "#1D1616",
          color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
        },
      },
    },
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chart.data.labels[index];
        const value = chart.data.datasets[0].data[index];

        onClick(label);

        // 👉 Example: call function to zoom/focus map
        // focusOnCountry(label);

        // or update a React state
        // setActiveCountry(label);
      }
    },
  };

  return (
    <div className="h-[100%] my-auto w-full ">
      <Bar data={chartData} options={options} />
    </div>
  );
}
