import OverviewPage from "@/pages/OverviewPage";
import OrdersPage from "@/pages/OrdersPage";
import ProductPage from "@/pages/ProductPage";
import TrackOrderPage from "@/pages/TrackOrderPage";
import SettingsPage from "@/pages/SettingsPage";
import CouponPage from "@/pages/CouponPage";
import AdminsPage from "@/pages/AdminsPage";
import { LayoutDashboard, ShoppingCart, Package, Search, Settings, Tag, ShieldCheck } from "lucide-react";

export const adminRoutes = [
  {
    title: "",
    items: [
      {
        title: "Overview",
        url: "overview",
        icon: LayoutDashboard,
        element: <OverviewPage />,
      },
      {
        title: "Orders",
        url: "orders",
        icon: ShoppingCart,
        element: <OrdersPage />,
      },
      {
        title: "Coupons",
        url: "coupons",
        icon: Tag,
        element: <CouponPage />,
      },
      {
        title: "Product",
        url: "product",
        icon: Package,
        element: <ProductPage />,
      },
      {
        title: "Track Order",
        url: "track-order",
        icon: Search,
        element: <TrackOrderPage />,
      },
      {
        title: "Admins",
        url: "admins",
        icon: ShieldCheck,
        element: <AdminsPage />,
      },
      {
        title: "Settings",
        url: "settings",
        icon: Settings,
        element: <SettingsPage />,
      },
    ],
  },
];
