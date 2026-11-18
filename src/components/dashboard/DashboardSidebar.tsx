
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogOut, X } from "lucide-react";
import {
  dashboardMenus,
  type UserRole,
} from "./dashboard-menu";

interface DashboardSidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({
  role,
  isOpen,
  onClose,
}: DashboardSidebarProps) => {
  const pathname = usePathname();
  const menuItems = dashboardMenus[role];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="size-6 fill-primary text-primary" />
            <span className="font-heading text-xl font-bold text-foreground">
              WedPlan
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-md p-2 hover:bg-secondary lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Role */}
        <div className="border-b border-border px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {role} Panel
          </p>
          <p className="mt-1 text-sm text-foreground">
            Manage your wedding journey
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== `/dashboard/${role.toLowerCase()}` &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <Heart className="size-5" />
            Back to Website
          </Link>

          <button
            type="button"
            onClick={() => {
              // Connect Better Auth sign-out here later.
              console.log("Logout clicked");
            }}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
          >
            <LogOut className="size-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
