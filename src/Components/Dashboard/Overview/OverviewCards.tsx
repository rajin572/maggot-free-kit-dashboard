import { useGetDashboardCardsQuery, useGetRevenueStatsQuery } from "@/redux/features/analytics/analyticsApi";
import { ShoppingCart, Clock, CheckCircle, XCircle, Package, TrendingUp, DollarSign } from "lucide-react";

const OverviewCards = () => {
  const { data } = useGetDashboardCardsQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: revenueData } = useGetRevenueStatsQuery(undefined, { refetchOnMountOrArgChange: true });
  const stats = data?.data;
  const revenue = revenueData?.data;

  const cards = [
    { label: "মোট অর্ডার", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "#1a1a2e", format: "number" },
    { label: "অপেক্ষমান", value: stats?.pending ?? 0, icon: Clock, color: "#d97706", format: "number" },
    { label: "অনুমোদিত", value: stats?.accepted ?? 0, icon: CheckCircle, color: "#2563eb", format: "number" },
    { label: "সম্পন্ন", value: stats?.completed ?? 0, icon: Package, color: "#16a34a", format: "number" },
    { label: "বাতিল", value: (stats?.cancelled ?? 0) + (stats?.declined ?? 0), icon: XCircle, color: "#dc2626", format: "number" },
    { label: "মোট রাজস্ব", value: revenue?.totalRevenue ?? 0, icon: TrendingUp, color: "#059669", format: "currency" },
    { label: "গড় অর্ডার মূল্য", value: revenue?.averageOrderValue ?? 0, icon: DollarSign, color: "#7c3aed", format: "currency" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border bg-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <card.icon size={18} style={{ color: card.color }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: card.color }}>
            {card.format === "currency" ? `৳${(card.value as number).toLocaleString()}` : card.value}
          </p>
        </div>
      ))}
    </div>
  );
};
export default OverviewCards;
