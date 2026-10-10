import type { ComponentType, SVGProps } from "react";
import {
  IconBoxes,
  IconCreditCard,
  IconDashboard,
  IconFactory,
  IconFileText,
  IconMegaphone,
  IconPackage,
  IconSettings,
  IconShoppingCart,
  IconStore,
  IconTrendingUp,
  IconTruck,
  IconUndo2,
  IconWallet,
} from "@/components/ui/icons";

export interface NavItem {
  label: string;
  href: string;
  moduleKey: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", moduleKey: "dashboard", icon: IconDashboard },
      { label: "Profit & Loss", href: "/profit-loss", moduleKey: "dashboard", icon: IconTrendingUp },
      { label: "Reports", href: "/reports", moduleKey: "dashboard", icon: IconFileText },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Orders", href: "/orders", moduleKey: "orders", icon: IconShoppingCart },
      { label: "Couriers", href: "/couriers", moduleKey: "orders", icon: IconTruck },
      { label: "Returns", href: "/returns", moduleKey: "returns", icon: IconUndo2 },
    ],
  },
  {
    title: "Money",
    items: [
      { label: "Payments", href: "/payments", moduleKey: "payments", icon: IconCreditCard },
      { label: "Expenses", href: "/expenses", moduleKey: "expenses", icon: IconWallet },
      { label: "Advertising", href: "/marketing/ads", moduleKey: "marketing", icon: IconMegaphone },
    ],
  },
  {
    title: "Inventory & Suppliers",
    items: [
      { label: "Raw Materials", href: "/inventory/materials", moduleKey: "inventory", icon: IconBoxes },
      { label: "Packaging", href: "/inventory/packaging", moduleKey: "inventory", icon: IconPackage },
      { label: "Finished Goods", href: "/inventory/finished-goods", moduleKey: "inventory", icon: IconStore },
      { label: "Production", href: "/inventory/production", moduleKey: "inventory", icon: IconFactory },
      { label: "Suppliers", href: "/suppliers", moduleKey: "suppliers", icon: IconStore },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Store Connection", href: "/settings/store", moduleKey: "settings", icon: IconSettings },
      { label: "Connected Stores", href: "/settings/stores", moduleKey: "settings", icon: IconStore },
    ],
  },
];

export const allModuleKeys = Array.from(
  new Set(navGroups.flatMap((g) => g.items.map((i) => i.moduleKey))),
);