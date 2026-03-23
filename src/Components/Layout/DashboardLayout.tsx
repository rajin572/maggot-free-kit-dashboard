import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../Shared/app-sidebar";
import Container from "../ui/CustomUi/Container";

export default function DashboardLayout() {
  const path = useLocation().pathname;

  const pathName = [
    {
      title: "Overview",
      url: "/admin/overview",
    },
    {
      title: "Passengers",
      url: "/admin/passengers",
    },
    {
      title: "Drivers",
      url: "/admin/drivers/all-drivers",
    },
    {
      title: "Driver Request",
      url: "/admin/drivers/driver-request",
    },
    {
      title: "Earnings",
      url: "/admin/earnings",
    },
    {
      title: "Rides Management",
      url: "/admin/rides-management",
    },
    {
      title: "Fare Management",
      url: "/admin/fare-management",
    },
    {
      title: "Reports",
      url: "/admin/reports",
    },
    {
      title: "Cancelled Rides",
      url: "/admin/cancelled-rides",
    },
    {
      title: "User Feedback",
      url: "/admin/user-feedback",
    },
    {
      title: "Promo",
      url: "/admin/promo",
    },
    {
      title: "Profile Settings",
      url: "/admin/profile-settings",
    },
  ]
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-x-hidden relative">
        <div className="p-4 flex items-center gap-4 border-b w-full bg-background z-10 fixed! top-0">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">{pathName.find((item) => item.url === path)?.title}</h1>
        </div>
        <div className="mt-16">
          <Container>
            <Outlet />
          </Container>
        </div>
      </main>
    </SidebarProvider>
  );
}
