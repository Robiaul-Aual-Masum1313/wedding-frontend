"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const { data, error } = await authClient.getSession();

        if (error || !data?.user) {
          router.replace("/sign-in");
          return;
        }

        const role = data.user.role;

        if (role === "Vendor") {
          router.replace("/dashboard/vendor");
        } else {
          router.replace("/dashboard/customer");
        }
      } catch (error) {
        console.error("Authentication redirect error:", error);
        router.replace("/sign-in");
      }
    };

    redirectUser();
  }, [router]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
      <Loader2 className="size-9 animate-spin text-primary" />

      <p className="text-sm text-muted-foreground">
        Completing your authentication...
      </p>
    </div>
  );
}