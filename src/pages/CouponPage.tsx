import { useState } from "react";
import { useGetCouponsQuery, useCreateCouponMutation, useToggleCouponMutation, useDeleteCouponMutation } from "@/redux/features/coupon/couponApi";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Trash2, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";

type CouponRecord = { _id: string; [key: string]: any };

const CouponPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isFetching } = useGetCouponsQuery({ page, limit }, { refetchOnMountOrArgChange: true });
  const [createCoupon] = useCreateCouponMutation();
  const [toggleCoupon] = useToggleCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons: CouponRecord[] = data?.data ?? [];
  const pagination = data?.pagination;

  // Create form state
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CouponRecord | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await tryCatchWrapper(
      createCoupon,
      {
        body: {
          code,
          discountType,
          discountValue: Number(discountValue),
          ...(minOrderAmount ? { minOrderAmount: Number(minOrderAmount) } : {}),
          ...(maxUses ? { maxUses: Number(maxUses) } : {}),
          ...(expiresAt ? { expiresAt } : {}),
        },
      },
      "কুপন তৈরি হচ্ছে..."
    );
    if (res?.success) {
      setCode(""); setDiscountValue(""); setMinOrderAmount(""); setMaxUses(""); setExpiresAt("");
      setShowForm(false);
    }
  };

  const handleToggle = (coupon: CouponRecord) => {
    tryCatchWrapper(toggleCoupon, { body: { id: coupon._id } }, coupon.isActive ? "নিষ্ক্রিয় হচ্ছে..." : "সক্রিয় হচ্ছে...");
  };

  const handleDeleteConfirm = async (record: CouponRecord) => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    await tryCatchWrapper(deleteCoupon, { body: { id: record._id } }, "কুপন মুছে ফেলা হচ্ছে...");
  };

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">কুপন ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground text-sm mt-1">ডিসকাউন্ট কুপন কোড তৈরি ও পরিচালনা করুন</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="gap-2">
          <Plus size={16} />
          নতুন কুপন
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border p-5 space-y-4 bg-card">
          <h2 className="font-semibold text-base">নতুন কুপন তৈরি করুন</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">কুপন কোড *</label>
              <Input
                placeholder="SAVE20"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">ধরন *</label>
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">শতাংশ (%)</SelectItem>
                  <SelectItem value="fixed">নির্দিষ্ট মূল্য (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">
                {discountType === "percent" ? "শতাংশ মান *" : "ছাড়ের পরিমাণ (৳) *"}
              </label>
              <Input
                type="number"
                placeholder={discountType === "percent" ? "20" : "50"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                min={1}
                max={discountType === "percent" ? 100 : undefined}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">ন্যূনতম অর্ডার মূল্য (৳)</label>
              <Input
                type="number"
                placeholder="500"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                min={0}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">সর্বোচ্চ ব্যবহার সংখ্যা</label>
              <Input
                type="number"
                placeholder="100"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min={1}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">মেয়াদ শেষের তারিখ</label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit">কুপন তৈরি করুন</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>বাতিল</Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>কুপন কোড</TableHead>
              <TableHead>ধরন</TableHead>
              <TableHead>ছাড়</TableHead>
              <TableHead>ন্যূনতম মূল্য</TableHead>
              <TableHead>ব্যবহার</TableHead>
              <TableHead>মেয়াদ</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : coupons.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">কোনো কুপন পাওয়া যায়নি</TableCell></TableRow>
            ) : coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell className="font-mono font-bold tracking-wider">{coupon.code}</TableCell>
                <TableCell>{coupon.discountType === "percent" ? "শতাংশ" : "নির্দিষ্ট"}</TableCell>
                <TableCell className="font-semibold text-green-600">
                  {coupon.discountType === "percent" ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}
                </TableCell>
                <TableCell>{coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : "—"}</TableCell>
                <TableCell>
                  {coupon.usedCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("bn-BD") : "সীমাহীন"}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggle(coupon)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                      coupon.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {coupon.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {coupon.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </button>
                </TableCell>
                <TableCell>
                  <Button
                    size="icon" variant="ghost"
                    className="h-7 w-7 text-red-500 hover:text-red-700"
                    onClick={() => { setDeleteTarget(coupon); setDeleteModalOpen(true); }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>মোট {pagination.totalCoupons} কুপন</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)}>আগে</Button>
            <span className="px-3 py-1 rounded border text-xs">{pagination.currentPage} / {pagination.totalPages}</span>
            <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)}>পরে</Button>
          </div>
        </div>
      )}

      <ConfirmModal<CouponRecord>
        open={deleteModalOpen}
        onCancel={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
        currentRecord={deleteTarget}
        onConfirm={handleDeleteConfirm}
        title="কুপন মুছে ফেলবেন?"
        description={`কুপন কোড "${deleteTarget?.code}" স্থায়ীভাবে মুছে ফেলা হবে।`}
        confirmText="মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
        iconPreset="delete"
      />
    </div>
  );
};
export default CouponPage;
