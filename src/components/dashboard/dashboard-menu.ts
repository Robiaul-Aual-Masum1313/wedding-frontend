
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
  PlusCircle,
  ClipboardList,
  CreditCard,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type UserRole = "Customer" | "Vendor" | "Admin";

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardMenus: Record<UserRole, MenuItem[]> = {
  Customer: [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      label: "My Bookings",
      href: "/dashboard/customer/bookings",
      icon: CalendarDays,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],

  Vendor: [
    {
      label: "Overview",
      href: "/dashboard/vendor",
      icon: LayoutDashboard,
    },
    {
      label: "My Services",
      href: "/dashboard/vendor/services",
      icon: BriefcaseBusiness,
    },
    {
      label: "Add Service",
      href: "/dashboard/vendor/services/add",
      icon: PlusCircle,
    },
    {
      label: "Booking Requests",
      href: "/dashboard/vendor/bookings",
      icon: ClipboardList,
    },
    {
      label: "Subscription",
      href: "/dashboard/vendor/subscription",
      icon: CreditCard,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/vendor/profile",
      icon: UserRound,
    },
  ],

  Admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Manage Services",
      href: "/dashboard/admin/services",
      icon: BriefcaseBusiness,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/admin/profile",
      icon: Settings,
    },
  ],
};
