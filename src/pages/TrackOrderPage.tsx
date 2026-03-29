import { useState } from "react";
import { useLazyAdminTrackOrderQuery } from "@/redux/features/order/orderApi";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Download } from "lucide-react";
import { formetDateAndTime } from "@/utils/dateFormet";
import { downloadInvoiceFromApi } from "@/utils/downloadInvoice";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  pending: "অপেক্ষমান",
  approved: "অনুমোদিত",
  completed: "সম্পন্ন",
  declined: "বাতিল",
  cancelled: "বাতিল করা হয়েছে",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState("");
  const [triggerSearch, { data, isFetching, isError }] = useLazyAdminTrackOrderQuery();
  const [dlLoading, setDlLoading] = useState<"admin" | "user" | null>(null);

  const handleDownload = async (type: "admin" | "user") => {
    const order = data?.data;
    if (!order) return;
    setDlLoading(type);
    try {
      await downloadInvoiceFromApi(String(order._id), order.orderId, type);
    } catch {
      toast.error("Invoice download করা সম্ভব হয়নি");
    } finally {
      setDlLoading(null);
    }
  };

  const handleSearch = () => {
    if (!orderId.trim()) return;
    triggerSearch(orderId.trim());
  };

  const order = data?.data;

  return (
    <div className="py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">অর্ডার ট্র্যাক করুন</h1>
        <p className="text-muted-foreground text-sm mt-1">অর্ডার আইডি দিয়ে যেকোনো অর্ডারের তথ্য দেখুন</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="অর্ডার আইডি লিখুন (যেমন: MF-20260323-0001)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isFetching}>
          <Search size={16} className="mr-2" />
          খুঁজুন
        </Button>
      </div>

      {isFetching && <p className="text-muted-foreground">লোড হচ্ছে...</p>}

      {isError && <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600 text-sm">অর্ডার খুঁজে পাওয়া যায়নি।</div>}

      {order && (
        <div className="rounded-2xl border bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <p className="text-xs text-muted-foreground">অর্ডার আইডি</p>
              <p className="font-mono font-semibold">{order.orderId}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload("user")}
                disabled={!!dlLoading}
                className="gap-1.5 text-xs"
              >
                <Download size={13} />
                {dlLoading === "user" ? "..." : "User Invoice"}
              </Button>
              <Button
                size="sm"
                onClick={() => handleDownload("admin")}
                disabled={!!dlLoading}
                className="gap-1.5 text-xs"
              >
                <Download size={13} />
                {dlLoading === "admin" ? "..." : "Admin Invoice"}
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Detail label="নাম" value={order.name} />
              <Detail label="ফোন" value={order.phone} />
              {order.email && <Detail label="ইমেইল" value={order.email} />}
              <Detail label="জেলা" value={order.district} />
              <Detail label="এলাকা" value={order.insideDhaka ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"} />
              <div className="col-span-2"><Detail label="ঠিকানা" value={order.address} /></div>
              {order.note && <div className="col-span-2"><Detail label="নোট" value={order.note} /></div>}
            </div>

            {/* Price Breakdown */}
            <div className="rounded-xl border overflow-hidden text-sm">
              <div className="px-4 py-2" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
                <p className="font-semibold text-xs uppercase tracking-wide text-yellow-400">মূল্য বিবরণ</p>
              </div>
              <div className="divide-y">
                <PriceRow label={`প্রতি কিট (৳${order.pricePerKit?.toLocaleString()})`} value={`× ${order.quantity} = ৳${(order.pricePerKit * order.quantity)?.toLocaleString()}`} />
                <PriceRow label="ডেলিভারি চার্জ" value={`৳${order.deliveryFee?.toLocaleString()}`} />
                {order.couponCode && (
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-muted-foreground">
                      কুপন ছাড়
                      <span className="ml-1.5 font-mono text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{order.couponCode}</span>
                    </span>
                    <span className="font-medium text-green-600">-৳{order.discountAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-3" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
                  <span className="font-bold text-white">মোট পরিশোধযোগ্য</span>
                  <span className="text-lg font-bold text-yellow-400">৳{order.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm pt-1 border-t">
              <Detail label="অর্ডারের তারিখ" value={formetDateAndTime(order.orderDate)} />
              <Detail label="সর্বশেষ আপডেট" value={formetDateAndTime(order.updatedAt)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PriceRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between px-4 py-2.5">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default TrackOrderPage;
