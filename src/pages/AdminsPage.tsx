import { useState } from "react";
import { useGetAdminsQuery, useAddAdminMutation, useRemoveAdminMutation } from "@/redux/features/admin/adminApi";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Trash2, Plus, ShieldCheck } from "lucide-react";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import useUserData from "@/hooks/useUserData";

type AdminRecord = { _id: string; [key: string]: any };

const AdminsPage = () => {
  const currentUser = useUserData();
  const { data, isFetching } = useGetAdminsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [addAdmin] = useAddAdminMutation();
  const [removeAdmin] = useRemoveAdminMutation();

  const admins: AdminRecord[] = data?.data ?? [];

  // Add form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminRecord | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await tryCatchWrapper(
      addAdmin,
      { body: { name, email, password } },
      "অ্যাডমিন তৈরি হচ্ছে..."
    );
    if (res?.success) {
      setName(""); setEmail(""); setPassword("");
      setShowForm(false);
    }
  };

  const handleRemoveConfirm = async (record: AdminRecord) => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
    await tryCatchWrapper(removeAdmin, { body: { id: record._id } }, "অ্যাডমিন মুছে ফেলা হচ্ছে...");
  };

  return (
    <div className="py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">অ্যাডমিন ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground text-sm mt-1">অ্যাডমিন অ্যাকাউন্ট যোগ বা মুছে ফেলুন</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="gap-2">
          <Plus size={16} />
          নতুন অ্যাডমিন
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="rounded-2xl border p-5 space-y-4 bg-card">
          <h2 className="font-semibold text-base">নতুন অ্যাডমিন তৈরি করুন</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">পুরো নাম *</label>
              <Input
                placeholder="Admin Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">ইমেইল *</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">পাসওয়ার্ড *</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "লুকান" : "দেখুন"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">৮+ অক্ষর, বড় হাতের অক্ষর, ছোট হাতের অক্ষর, সংখ্যা ও বিশেষ চিহ্ন</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit">অ্যাডমিন তৈরি করুন</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>বাতিল</Button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>নাম</TableHead>
              <TableHead>ইমেইল</TableHead>
              <TableHead>যোগদানের তারিখ</TableHead>
              <TableHead>রোল</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
            ) : admins.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">কোনো অ্যাডমিন পাওয়া যায়নি</TableCell></TableRow>
            ) : admins.map((admin) => (
              <TableRow key={admin._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-blue-500 flex-shrink-0" />
                    {admin.name}
                    {admin.email === currentUser?.email && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">আপনি</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString("bn-BD") : "—"}
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Admin</span>
                </TableCell>
                <TableCell>
                  {admin.email !== currentUser?.email && (
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-red-500 hover:text-red-700"
                      onClick={() => { setDeleteTarget(admin); setDeleteModalOpen(true); }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal<AdminRecord>
        open={deleteModalOpen}
        onCancel={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
        currentRecord={deleteTarget}
        onConfirm={handleRemoveConfirm}
        title="অ্যাডমিন সরিয়ে ফেলবেন?"
        description={`"${deleteTarget?.name}" (${deleteTarget?.email}) এর অ্যাডমিন অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলা হবে।`}
        confirmText="মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
        iconPreset="delete"
      />
    </div>
  );
};
export default AdminsPage;
