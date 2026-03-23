import OverviewCards from "@/Components/Dashboard/Overview/OverviewCards";
import VisitsOrdersChart from "@/Components/Dashboard/Overview/VisitsOrdersChart";
import OrdersByMonthChart from "@/Components/Dashboard/Overview/OrdersByMonthChart";
import StatusDistributionChart from "@/Components/Dashboard/Overview/StatusDistributionChart";
import OrdersByDistrictChart from "@/Components/Dashboard/Overview/OrdersByDistrictChart";
import RevenueByMonthChart from "@/Components/Dashboard/Overview/RevenueByMonthChart";

const OverviewPage = () => {
  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">ম্যাগট-ফ্রি কিটের সার্বিক পরিসংখ্যান</p>
      </div>
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitsOrdersChart />
        <OrdersByMonthChart />
      </div>
      <RevenueByMonthChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistributionChart />
        <OrdersByDistrictChart />
      </div>
    </div>
  );
};
export default OverviewPage;
