import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useGetRevenueByMonthQuery } from "@/redux/features/analytics/analyticsApi";
import YearOption from "@/Components/ui/CustomUi/ReuseYearSelect";

const RevenueByMonthChart = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data, isFetching } = useGetRevenueByMonthQuery(year, { refetchOnMountOrArgChange: true });
  const chartData = data?.data ?? [];

  const totalRevenue = chartData.reduce((sum: number, d: any) => sum + d.revenue, 0);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">মাসিক রাজস্ব</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            মোট: ৳{totalRevenue.toLocaleString()} (অনুমোদিত + সম্পন্ন)
          </p>
        </div>
        <YearOption currentYear={currentYear} setThisYear={(y) => setYear(Number(y))} />
      </div>

      {isFetching ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">লোড হচ্ছে...</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip
              formatter={(value: number) => [`৳${value.toLocaleString()}`, "রাজস্ব"]}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="revenue" name="রাজস্ব (৳)" fill="#1a1a2e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
export default RevenueByMonthChart;
