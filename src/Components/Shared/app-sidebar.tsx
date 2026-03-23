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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">ম্যাগট-ফ্রি</h1>
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
