import { useState } from "react";
import { useGetOrdersByMonthQuery } from "@/redux/features/analytics/analyticsApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import YearOption from "@/Components/ui/CustomUi/ReuseYearSelect";

const OrdersByMonthChart = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data } = useGetOrdersByMonthQuery(year, { refetchOnMountOrArgChange: true });

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-semibold mb-1">মাসিক অর্ডার</h2>
          <p className="text-xs text-muted-foreground">{year} সালে প্রতি মাসে অর্ডার</p>
        </div>
        <YearOption currentYear={currentYear} setThisYear={(y) => setYear(Number(y))} />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data?.data ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="orders" name="অর্ডার" fill="#1a1a2e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default OrdersByMonthChart;
