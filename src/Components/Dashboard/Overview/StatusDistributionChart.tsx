import { useGetOrderStatusDistributionQuery } from "@/redux/features/analytics/analyticsApi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const STATUS_COLORS: Record<string, string> = {
  Pending: "#d97706",    // amber
  Accepted: "#2563eb",   // blue
  Completed: "#16a34a",  // green
  Declined: "#dc2626",   // red
  Cancelled: "#6b7280",  // gray
};

const StatusDistributionChart = () => {
  const { data } = useGetOrderStatusDistributionQuery(undefined, { refetchOnMountOrArgChange: true });
  const chartData = (data?.data ?? []).filter((d: any) => d.value > 0);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="font-semibold mb-1">অর্ডার স্ট্যাটাস</h2>
      <p className="text-xs text-muted-foreground mb-4">স্ট্যাটাস অনুযায়ী বিতরণ</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
              {chartData.map((entry: any) => (
                <Cell key={entry.label} fill={STATUS_COLORS[entry.label] ?? "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default StatusDistributionChart;
