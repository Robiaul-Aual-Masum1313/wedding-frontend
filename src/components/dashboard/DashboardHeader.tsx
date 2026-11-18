
"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X, UserRound } from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  userName: string;
  userRole: string;
}

const DashboardHeader = ({
  onMenuClick,
  userName,
  userRole,
}: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 text-foreground hover:bg-secondary lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Heart className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold text-foreground">
            WedPlan
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-foreground">{userName}</p>
          <p className="text-xs text-muted-foreground">{userRole}</p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full bg-secondary">
          <UserRound className="size-5 text-primary" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
