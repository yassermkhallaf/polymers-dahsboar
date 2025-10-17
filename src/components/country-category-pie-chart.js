"use client";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes";

const CountryCategoryPieChart = ({ countryCategoryData }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getCategoryColor = (category) => {
    switch (category) {
      case "White":
        return "#f8f9fa";
      case "Natural":
        return "#d9d9d9";
      case "Blue":
        return "#4a90e2";
      case "Green":
        return "#50b83c";
      case "Red":
        return "#e63946";
      case "Yellow":
        return "#FCF259";
      case "Gray":
        return "#C9CDCF";
      case "Orange":
        return "#FF7800";
      case "Brown":
        return "#7B542F";
      case "Silver":
        return "#44444E";
      case "Beige":
        return "#FAEAB1";
      case "Golden":
        return "#B6771D";
      case "Rose":
        return "#F7CAC9";
      case "Violet":
        return "#713D91";
      case "Turquoise":
        return "#91C4C3";
      default:
        return "#8884d8";
    }
  };

  const pieData = countryCategoryData
    .sort((a, b) => b.qty - a.qty)
    .map((c) => ({
      id: c.category,
      label: c.category,
      value: c.qty,
      color: getCategoryColor(c.category),
    }));

  return (
    <div className="h-[250px] ">
      <ResponsivePie
        data={pieData}
        margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
        // height={200}
        innerRadius={0.5}
        padAngle={20}
        activeOuterRadiusOffset={5}
        // enableArcLinkLabels={false}
        isInteractive={true}
        arcLinkLabelsSkipAngle={0}
        cornerRadius={4}
        colors={{ datum: "data.color" }}
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Montserrat Alternates",
        }}
        theme={{
          text: {
            fontSize: 14,
            fill: isDark ? "#f9fafb" : "#1f2937",
            fontFamily: "Montserrat Alternates",
            offset: 10,
          },
          tooltip: {
            container: {
              background: isDark ? "#f9fafb" : "#1f2937",
              color: isDark ? "#f9fafb" : "#1f2937",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: "bold",
              padding: 12,
            },
          },
        }}
        arcLabel={""}
        tooltip={({ datum }) => (
          <div className="bg-black text-white p-2 h-[60px] w-[180px] rounded">
            <strong>{datum.id}</strong>: {datum.value.toLocaleString()} (
            {(
              (datum.value / pieData.reduce((a, b) => a + b.value, 0)) *
              100
            ).toFixed(1)}
            %)
          </div>
        )}
      />
    </div>
  );
};

export default CountryCategoryPieChart;
