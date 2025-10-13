"use client";

import { ResponsiveTreeMap } from "@nivo/treemap";
import { useTheme } from "next-themes";
const ItemCategoryMapTree = ({ categoryData, height, width }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const nivoData = {
    name: "root",
    children: categoryData
      .sort((a, b) => b.value - a.value)
      .map((item) => ({
        name: item.category,
        value: item.value,
      })),
  };
  return (
    <div>
      <div
        className={`w-full  rounded-lg  border    shadow-md `}
        style={{ height: height - 50, borderRadius: "10px", width: width - 50 }}
      >
        <ResponsiveTreeMap
          data={nivoData}
          identity="name"
          value="value"
          leavesOnly
          style={{
            borderRadius: 10,
          }}
          // margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          // 🎨 Custom colors
          colors={({ data }) => {
            switch (data.name) {
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
          }}
          // colorBy="none"
          // ✍️ Font and labels
          //   label={(node) => node.data.name}
          labelTextColor={{ from: "color", modifiers: [["opacity", 1]] }}
          labelSkipSize={20}
          theme={{
            // labels: {
            //   text: {
            //     fontSize: (node) => {
            //       // area of the box
            //       console.log(node);
            //       const area = node.x1 - node.x0;
            //       const size = Math.max(10, Math.min(30, area / 5));
            //       return size;
            //     },
            //     fontWeight: "600",
            //     color: "#222",
            //     fontFamily: "Montserrat Alternates, sans-serif",
            //   },
            // },

            tooltip: {
              container: {
                background: "#222",
                color: "#fff",
                fontSize: 14,
                borderRadius: "8px",
                padding: "8px",
              },
            },
          }}
          // 🛠 Custom tooltip
          tooltip={({ node }) => {
            const { id, value, color } = node;
            return (
              <div className="bg-black text-white p-2 h-[50px] w-[180px] rounded">
                <strong>
                  {id}: {(value / 1000).toFixed(2).toLocaleString()} Ton
                </strong>
              </div>
            );
          }}
          label={(node) => {
            // ناخد أصغر ضلع علشان نقيّم المساحة
            const area = Math.min(node.width, node.height);

            // نحدد حجم الخط (بين 10 و 30)
            const fontSize = Math.max(10, Math.min(20, area / 2));

            // نضيف النسبة المئوية
            const percent = (
              (node.value /
                nivoData.children.reduce((s, c) => s + c.value, 0)) *
              100
            ).toFixed(1);

            return (
              <tspan
                x="0"
                y="0"
                alignmentBaseline="middle"
                textAnchor="middle"
                style={{
                  fontSize,
                  fontWeight: 400,
                  fontFamily: "Montserrat Alternates, sans-serif",
                  fill: isDark ? "#fff" : "#222",
                }}
              >
                {node.data.name}
              </tspan>
            );
          }}
        />
      </div>
    </div>
  );
};

export default ItemCategoryMapTree;
