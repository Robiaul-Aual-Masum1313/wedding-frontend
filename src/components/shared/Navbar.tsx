
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
];

const getDashboardHref = (role?: string | null) => {
  switch (role) {
    case "Admin":
      return "/dashboard/admin";
    case "Vendor":
      return "/dashboard/vendor";
    case "Customer":
    default:
      return "/dashboard/customer";
  }
};

const getProfileHref = (role?: string | null) => {
  const roleSlug = role?.toLowerCase() || "customer";
  return `/dashboard/${roleSlug}/profile`;
};

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Get the actual authenticated session from Better Auth.
  const { data: session, isPending } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;
  const isLoggedIn = !!user;

  const dashboardHref = getDashboardHref(user?.role);
  const profileHref = getProfileHref(user?.role);

  // Close menus whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Check active navigation link.
  const isActive = (href: string) => {
    return href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);
  };

  // Handle logout using Better Auth.
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Logout failed.");
      }

      setIsOpen(false);
      setIsProfileOpen(false);

      toast.success("Logged out successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => {
            setIsOpen(false);
            setIsProfileOpen(false);
          }}
        >
          <Heart className="size-7 fill-primary text-primary" />

          <span className="font-heading text-2xl font-semibold text-foreground">
            WedPlan
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          {/* Public links */}
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Authentication state */}
          {isPending ? (
            <div className="flex size-10 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : isLoggedIn ? (
            /* Logged-in profile dropdown */
            <div className="relative">

              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-expanded={isProfileOpen}
                aria-label="Open profile menu"
                className="flex items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 transition hover:bg-secondary"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    unoptimized
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                    {userInitial}
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-medium text-foreground">
                  {user.name}
                </span>

                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown content */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-border bg-white shadow-lg">

                  {/* User information */}
                  <div className="border-b border-border px-4 py-4">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                      {user.role || "Customer"}
                    </span>
                  </div>

                  {/* Dropdown links */}
                  <div className="p-2">

                    <Link
                      href={dashboardHref}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-secondary"
                    >
                      <LayoutDashboard className="size-4 text-muted-foreground" />
                      Dashboard
                    </Link>

                    <Link
                      href={profileHref}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition hover:bg-secondary"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      Profile Settings
                    </Link>

                    <div className="my-2 border-t border-border" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      {loggingOut ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <LogOut className="size-4" />
                      )}

                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out actions */
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="rounded-md p-2 text-foreground transition-colors hover:bg-secondary md:hidden"
        >
          {isOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border bg-background px-4 py-5 shadow-sm md:hidden">
          <div className="flex flex-col gap-5">

            {/* Public links */}
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border" />

            {isPending ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="size-5 animate-spin text-primary" />
              </div>
            ) : isLoggedIn ? (
              <>
                {/* Mobile user information */}
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={44}
                      height={44}
                      unoptimized
                      className="size-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-11 items-center justify-center rounded-full bg-secondary font-semibold text-primary">
                      {userInitial}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>

                <Link
                  href={profileHref}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary"
                >
                  <Settings className="size-4" />
                  Profile Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-3 text-left text-sm font-medium text-red-600 disabled:opacity-60"
                >
                  {loggingOut ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}

                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


export default Navbar;
