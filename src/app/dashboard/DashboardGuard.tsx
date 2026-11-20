
"use client";

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

type DashboardGuardProps = {
  children: React.ReactNode;
};

const DashboardGuard = ({ children }: DashboardGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userRole = user?.role?.toLowerCase();

  const requestedRole = pathname.split("/")[2]?.toLowerCase();

  const isValidRole = (
    role: string | undefined
  ): role is DashboardRole => {
    return (
      role === "customer" ||
      role === "vendor" ||
      role === "admin"
    );
  };

  useEffect(() => {
    if (isPending) return;

    // Not authenticated: send the user to sign in.
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // Invalid or missing role: don't allow dashboard access.
    if (!isValidRole(userRole)) {
      router.replace("/");
      return;
    }

    const correctDashboard = roleDashboard[userRole];

    // /dashboard or a dashboard belonging to another role:
    // redirect to the user's own dashboard.
    if (
      !isValidRole(requestedRole) ||
      requestedRole !== userRole
    ) {
      router.replace(correctDashboard);
    }
  }, [isPending, user, userRole, requestedRole, router]);

  // Don't render protected content while checking authentication.
  if (isPending || !user || !isValidRole(userRole)) {
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

  // Don't render another role's dashboard while redirecting.
  if (
    !isValidRole(requestedRole) ||
    requestedRole !== userRole
  ) {
    return null;
  }

  return <>{children}</>;
};

export default DashboardGuard;
