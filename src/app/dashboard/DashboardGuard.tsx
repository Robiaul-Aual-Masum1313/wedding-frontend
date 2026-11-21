
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";

type DashboardRole = "customer" | "vendor" | "admin";

const roleDashboard: Record<DashboardRole, string> = {
  customer: "/dashboard/customer",
  vendor: "/dashboard/vendor",
  admin: "/dashboard/admin",
};

const isDashboardRole = (
  role: string | undefined
): role is DashboardRole => {
  return (
    role === "customer" ||
    role === "vendor" ||
    role === "admin"
  );
};

type DashboardGuardProps = {
  children: ReactNode;
};

const DashboardGuard = ({ children }: DashboardGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userRole = user?.role?.toLowerCase();
  const requestedRole = pathname.split("/")[2]?.toLowerCase();

  useEffect(() => {
    if (isPending) return;

    // Not logged in
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // Invalid or missing role
    if (!isDashboardRole(userRole)) {
      router.replace("/");
      return;
    }

    const correctDashboard = roleDashboard[userRole];

    // Send users to their own dashboard
    // if they try to open another role's dashboard.
    if (
      !isDashboardRole(requestedRole) ||
      requestedRole !== userRole
    ) {
      router.replace(correctDashboard);
    }
  }, [
    isPending,
    user,
    userRole,
    requestedRole,
    router,
  ]);

  if (isPending || !user || !isDashboardRole(userRole)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Checking your account access...
          </p>
        </div>
      </div>
    );
  }

  if (
    !isDashboardRole(requestedRole) ||
    requestedRole !== userRole
  ) {
    return null;
  }

  return <>{children}</>;
};

export default DashboardGuard;
