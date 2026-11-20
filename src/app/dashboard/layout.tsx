"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import type { UserRole } from "@/components/dashboard/dashboard-menu";
import DashboardGuard from "./DashboardGuard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Temporary role detection for UI development only.
  // Replace this with the authenticated user's role from Better Auth.
  const role: UserRole = pathname.startsWith("/dashboard/admin")
    ? "Admin"
    : pathname.startsWith("/dashboard/vendor")
      ? "Vendor"
      : "Customer";

  const userName = "Wedding User";

  return (
    <DashboardGuard>
      <div className="min-h-screen bg-background lg:flex">
        <DashboardSidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <DashboardHeader
            userName={userName}
            userRole={role}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </DashboardGuard>
  );
};

export default DashboardLayout;
