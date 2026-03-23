import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export interface AreaChartData {
  month: string;
  drivers: number;
  passengers: number;
}

const Area_Chart = ({ data }: { data: AreaChartData[] }) => {
  const tickStyle = { fill: "#000", fontSize: 12 };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorDrivers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#0284c7" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorPassengers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#0d9488" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#E5E5EF" strokeDasharray="0" />
          <XAxis dataKey="month" tick={{ ...tickStyle }} tickMargin={6} />
          <YAxis
            tickCount={5}
            tick={{ ...tickStyle }}
            tickMargin={16}
            axisLine={{ stroke: "#ffffff", strokeWidth: 2, strokeDasharray: "7 7" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px" }}
            labelStyle={{ color: "#202020", fontWeight: 600 }}
            labelFormatter={(label: string) => `Month: ${label}`}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: 12, color: "#555", textTransform: "capitalize" }}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="drivers"
            name="Drivers"
            stroke="#0284c7"
            strokeWidth={2.5}
            fill="url(#colorDrivers)"
            dot={false}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#0284c7" }}
          />
          <Area
            type="monotone"
            dataKey="passengers"
            name="Passengers"
            stroke="#0d9488"
            strokeWidth={2.5}
            fill="url(#colorPassengers)"
            dot={false}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#0d9488" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Area_Chart;
