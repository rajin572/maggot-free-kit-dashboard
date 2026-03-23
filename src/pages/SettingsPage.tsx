import ChangePassword from "@/Components/Dashboard/ProfileSettings/ChangePassword";

const SettingsPage = () => {
  return (
    <div className="py-6 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">সেটিংস</h1>
        <p className="text-muted-foreground text-sm mt-1">পাসওয়ার্ড পরিবর্তন করুন</p>
      </div>
      <div className="rounded-2xl border bg-card p-6">
        <ChangePassword />
      </div>
    </div>
  );
};
export default SettingsPage;
