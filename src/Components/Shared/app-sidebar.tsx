import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { adminRoutes } from "@/Routes/admin.route";
import useUserData from "@/hooks/useUserData";

export function AppSidebar() {
  const userData = useUserData();
  return (
    <Sidebar collapsible={"icon"} variant={"sidebar"}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-1 py-2">
          <img
            src="/images/logo.png"
            alt="ম্যাগট-ফ্রি কিট"
            className="w-9 h-9 rounded-xl object-contain shrink-0"
          />
          <span className="text-lg font-bold text-foreground truncate group-data-[collapsible=icon]:hidden">
            ম্যাগট-ফ্রি কিট
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {adminRoutes?.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
