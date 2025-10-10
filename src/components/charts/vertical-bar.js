"use client";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Customized,
} from "recharts";
const VerticalBar = ({ data }) => {
  const list = [...data].sort((a, b) => b.value - a.value);

  const fmt = (v) =>
    typeof v === "number"
      ? v.toLocaleString(undefined, { maximumFractionDigits: 0 })
      : v;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="90%" height="100%" className="overflow-none">
        <ComposedChart
          layout="vertical"
          width={500}
          height={400}
          data={list}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          {/* <CartesianGrid stroke="#f5f5f5" /> */}
          <XAxis type="number" domain={[0, "auto"]} />
          <YAxis
            dataKey="customerCountry"
            type="category"
            scale="band"
            width={200}
            tick={({ x, y, payload }) => {
              return (
                <text
                  x={x - 10} // مسافة صغيرة شمال البار
                  y={y + 37} // يخلي النص في النص عمودياً
                  textAnchor="end"
                  //   begin={0}
                  //   end={1}
                  //   fill="#fff" // لون النص
                  //   style={{ fontSize: "12px" }}
                  className="font-montserrat-alternates w-5 text-[1vw] tracking-wider font-semibold text-black"
                >
                  {payload.value}
                </text>
              );
            }}
          />

          <Tooltip />
          {/* <Legend /> */}
          {/* <Area dataKey="value" fill="#8884d8" stroke="#8884d8" /> */}
          <Bar
            dataKey="value"
            barSize={60}
            radius={[0, 50, 50, 0]}
            className="shadow-lg relative"
            fill="#413ea0"
          >
            {/* <LabelList
              dataKey="value"
              formatter={fmt}
              className=" font-montserrat-alternates w-5 text-[1vw] tracking-wider font-semibold text-black "
            /> */}
          </Bar>
          <Customized
            content={({ bars }) => (
              <>
                {bars.map((bar, i) => {
                  return (
                    <text
                      key={i}
                      x={bar.x + bar.width + 20} // 👈 مطلق حسب مكان العمود
                      y={bar.y + bar.height / 2}
                      fill="black"
                      fontSize="14"
                      fontWeight="bold"
                      alignmentBaseline="middle"
                    >
                      {Math.abs(bar.value)}
                    </text>
                  );
                })}
              </>
            )}
          />
          {/* <Line dataKey="value" stroke="#ff7300" /> */}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
export default VerticalBar;
