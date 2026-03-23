import { useState } from "react";
import { useGetVisitsAndOrdersQuery } from "@/redux/features/analytics/analyticsApi";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import YearOption from "@/Components/ui/CustomUi/ReuseYearSelect";

const VisitsOrdersChart = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data } = useGetVisitsAndOrdersQuery(year, { refetchOnMountOrArgChange: true });

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-semibold mb-1">ভিজিট ও অর্ডার</h2>
          <p className="text-xs text-muted-foreground">{year} সালের মাসিক তুলনা</p>
        </div>
        <YearOption currentYear={currentYear} setThisYear={(y) => setYear(Number(y))} />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data?.data ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1a2e" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#1a1a2e" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#facc15" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend iconType="circle" iconSize={8} />
            <Area type="monotone" dataKey="visits" name="ভিজিট" stroke="#1a1a2e" fill="url(#gVisits)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="orders" name="অর্ডার" stroke="#facc15" fill="url(#gOrders)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default VisitsOrdersChart;
