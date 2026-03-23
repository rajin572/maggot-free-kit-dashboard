import { useState } from "react";
import { useGetOrdersByDistrictQuery } from "@/redux/features/analytics/analyticsApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import YearOption from "@/Components/ui/CustomUi/ReuseYearSelect";

const OrdersByDistrictChart = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number | undefined>(undefined);
  const { data } = useGetOrdersByDistrictQuery(year, { refetchOnMountOrArgChange: true });
  const chartData = (data?.data ?? []).map((d: any) => ({ ...d, name: d.district }));

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-semibold mb-1">জেলাভিত্তিক অর্ডার</h2>
          <p className="text-xs text-muted-foreground">শীর্ষ ১০ জেলা{year ? ` (${year})` : " (সব সময়)"}</p>
        </div>
        <YearOption currentYear={currentYear} setThisYear={(y) => setYear(Number(y))} />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
            <Tooltip />
            <Bar dataKey="orders" name="অর্ডার" fill="#facc15" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default OrdersByDistrictChart;
