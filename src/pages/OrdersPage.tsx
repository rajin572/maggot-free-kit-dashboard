import { useState } from "react";
import { useGetOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation } from "@/redux/features/order/orderApi";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Trash2, Download, Clock, FileText } from "lucide-react";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import { getBaseUrl } from "@/helpers/config/envConfig";
import Cookies from "js-cookie";
import { downloadInvoiceFromApi } from "@/utils/downloadInvoice";
import { toast } from "sonner";

const STATUS_OPTIONS = ["all", "pending", "approved", "completed", "declined", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS_BN: Record<string, string> = {
  pending: "অপেক্ষমান",
  approved: "অনুমোদিত",
  completed: "সম্পন্ন",
  declined: "প্রত্যাখ্যাত",
  cancelled: "বাতিল",
};

type OrderRecord = { _id: string; [key: string]: any };

// ── CSV Export ────────────────────────────────────────────────────────────────
function exportToCSV(orders: any[]) {
  const headers = [
    "Order ID", "Name", "Phone", "Email", "District", "Area",
    "Quantity", "Price/Kit", "Delivery Fee", "Discount", "Total",
    "Coupon Code", "Status", "Date",
  ];
  const rows = orders.map((o) => [
    o.orderId ?? "",
    o.name ?? "",
    o.phone ?? "",
    o.email ?? "",
    o.district ?? "",
    o.insideDhaka ? "Dhaka" : "Outside Dhaka",
    o.quantity ?? "",
    o.pricePerKit ?? "",
    o.deliveryFee ?? "",
    o.discountAmount ?? 0,
    o.totalPrice ?? "",
    o.couponCode ?? "",
    o.status ?? "",
    o.orderDate ? new Date(o.orderDate).toLocaleDateString("en-GB") : "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Timeline Modal ────────────────────────────────────────────────────────────
function TimelineModal({ order, onClose }: { order: OrderRecord | null; onClose: () => void }) {
  if (!order) return null;
  const history: any[] = order.statusHistory ?? [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-background rounded-2xl border p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-lg">অর্ডার টাইমলাইন</h2>
            <p className="text-xs text-muted-foreground font-mono">{order.orderId}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
        </div>

        {history.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">কোনো ইতিহাস পাওয়া যায়নি</p>
        ) : (
          <ol className="relative border-l border-border ml-3 space-y-5">
            {history.map((entry, i) => (
              <li key={i} className="ml-6">
                <span className={`absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background ${STATUS_COLORS[entry.status] ?? "bg-gray-100"}`}>
                  <Clock size={10} />
                </span>
                <div>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[entry.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABELS_BN[entry.status] ?? entry.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(entry.changedAt).toLocaleString("bn-BD")}
                  </p>
                  {entry.reason && (
                    <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded px-2 py-1 mt-1">
                      কারণ: {entry.reason}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [insideDhaka, setInsideDhaka] = useState("all");
  const [sortBy, setSortBy] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OrderRecord | null>(null);

  // Cancel/Decline modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<OrderRecord | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string>("cancelled");

  // Timeline modal
  const [timelineOrder, setTimelineOrder] = useState<OrderRecord | null>(null);

  const params: Record<string, string> = { page: String(page), limit: "15", sortBy, sortOrder };
  if (search) params.search = search;
  if (status !== "all") params.status = status;
  if (insideDhaka !== "all") params.insideDhaka = insideDhaka;

  const { data, isFetching } = useGetOrdersQuery(params, { refetchOnMountOrArgChange: true });
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const orders = data?.data ?? [];
  const pagination = data?.pagination;

  const handleStatusChange = async (order: OrderRecord, newStatus: string) => {
    if (newStatus === "cancelled" || newStatus === "declined") {
      setCancelTarget(order);
      setPendingStatus(newStatus);
      setCancelModalOpen(true);
      return;
    }
    await tryCatchWrapper(updateStatus, { body: { id: order._id, status: newStatus } }, "স্ট্যাটাস আপডেট হচ্ছে...");
  };

  const handleCancelConfirm = async (record: OrderRecord, reason?: string) => {
    setCancelModalOpen(false);
    setCancelTarget(null);
    await tryCatchWrapper(updateStatus, { body: { id: record._id, status: pendingStatus, reason } }, "স্ট্যাটাস আপডেট হচ্ছে...");
  };

  const handleDeleteClick = (order: OrderRecord) => {
    setDeleteTarget(order);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (record: OrderRecord) => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    await tryCatchWrapper(deleteOrder, { body: { id: record._id } }, "অর্ডার মুছে ফেলা হচ্ছে...");
  };

  const handleExportCSV = async () => {
    const token = Cookies.get("maggot_dashboard_accessToken") ?? "";
    const qs = new URLSearchParams({ page: "1", limit: "100000", sortBy, sortOrder });
    if (search) qs.set("search", search);
    if (status !== "all") qs.set("status", status);
    if (insideDhaka !== "all") qs.set("insideDhaka", insideDhaka);

    try {
      const res = await fetch(`${getBaseUrl()}/orders?${qs.toString()}`, {
        headers: { token },
      });
      const json = await res.json();
      exportToCSV(json?.data ?? []);
    } catch {
      exportToCSV(orders); // fallback to current page
    }
  };

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground text-sm mt-1">সকল অর্ডার দেখুন ও পরিচালনা করুন</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
          <Download size={15} />
          CSV Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="নাম, অর্ডার আইডি বা ফোন খুঁজুন..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64"
        />
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="স্ট্যাটাস" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{s === "all" ? "সব স্ট্যাটাস" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={insideDhaka} onValueChange={(v) => { setInsideDhaka(v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="ডেলিভারি এলাকা" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব এলাকা</SelectItem>
            <SelectItem value="true">ঢাকার ভেতরে</SelectItem>
            <SelectItem value="false">ঢাকার বাইরে</SelectItem>
          </SelectContent>
        </Select>
        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => { const [s, o] = v.split("-"); setSortBy(s); setSortOrder(o); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="সাজান" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="orderDate-desc">তারিখ (নতুন আগে)</SelectItem>
            <SelectItem value="orderDate-asc">তারিখ (পুরনো আগে)</SelectItem>
            <SelectItem value="quantity-desc">পরিমাণ (বেশি আগে)</SelectItem>
            <SelectItem value="quantity-asc">পরিমাণ (কম আগে)</SelectItem>
            <SelectItem value="totalPrice-desc">মূল্য (বেশি আগে)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>অর্ডার আইডি</TableHead>
              <TableHead>নাম</TableHead>
              <TableHead>ফোন</TableHead>
              <TableHead>জেলা</TableHead>
              <TableHead>এলাকা</TableHead>
              <TableHead>কিট</TableHead>
              <TableHead>মোট</TableHead>
              <TableHead>তারিখ</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow><TableCell colSpan={10} className="text-center py-10 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={10} className="text-center py-10 text-muted-foreground">কোনো অর্ডার পাওয়া যায়নি</TableCell></TableRow>
            ) : orders.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono text-xs">{order.orderId}</TableCell>
                <TableCell className="font-medium">{order.name}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.district}</TableCell>
                <TableCell>{order.insideDhaka ? "ঢাকা" : "বাইরে"}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell className="font-semibold">
                  ৳{order.totalPrice?.toLocaleString()}
                  {order.couponCode && (
                    <span className="ml-1 text-xs text-green-600 font-normal">({order.couponCode})</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(order.orderDate).toLocaleDateString("bn-BD")}
                </TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(v) => handleStatusChange(order, v)}>
                    <SelectTrigger className={`w-32 text-xs h-7 ${STATUS_COLORS[order.status] ?? ""}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      title="টাইমলাইন দেখুন"
                      onClick={() => setTimelineOrder(order)}
                    >
                      <Clock size={14} />
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-blue-500 hover:text-blue-700"
                      title="Admin Invoice"
                      onClick={async () => {
                        try {
                          await downloadInvoiceFromApi(String(order._id), order.orderId, "admin");
                        } catch {
                          toast.error("Invoice download ব্যর্থ হয়েছে");
                        }
                      }}
                    >
                      <FileText size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(order)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>মোট {pagination.totalOrders} অর্ডার</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)}>আগে</Button>
            <span className="px-3 py-1 rounded border text-xs">{pagination.currentPage} / {pagination.totalPages}</span>
            <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)}>পরে</Button>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      <TimelineModal order={timelineOrder} onClose={() => setTimelineOrder(null)} />

      {/* Delete Confirm Modal */}
      <ConfirmModal<OrderRecord>
        open={deleteModalOpen}
        onCancel={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
        currentRecord={deleteTarget}
        onConfirm={handleDeleteConfirm}
        title="অর্ডার মুছে ফেলবেন?"
        description={`অর্ডার "${deleteTarget?.orderId}" স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি আর ফেরানো যাবে না।`}
        confirmText="মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
        iconPreset="delete"
      />

      {/* Cancel/Decline with Reason Modal */}
      <ConfirmModal<OrderRecord>
        open={cancelModalOpen}
        onCancel={() => { setCancelModalOpen(false); setCancelTarget(null); }}
        currentRecord={cancelTarget}
        onConfirm={handleCancelConfirm}
        title={pendingStatus === "declined" ? "অর্ডার প্রত্যাখ্যান করবেন?" : "অর্ডার বাতিল করবেন?"}
        description={`অর্ডার "${cancelTarget?.orderId}" ${pendingStatus === "declined" ? "প্রত্যাখ্যান" : "বাতিল"} করা হবে। কারণটি গ্রাহকের ইমেইলে পাঠানো হবে।`}
        confirmText={pendingStatus === "declined" ? "প্রত্যাখ্যান করুন" : "বাতিল করুন"}
        cancelText="ফিরে যান"
        variant="warning"
        iconPreset="cancel"
        withReason
        reasonLabel={pendingStatus === "declined" ? "প্রত্যাখ্যানের কারণ" : "বাতিলের কারণ"}
        reasonRequired
      />
    </div>
  );
};
export default OrdersPage;
