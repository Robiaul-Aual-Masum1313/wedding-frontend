
"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import {
  Search,
  Users,
  UserRound,
  Store,
  Ban,
  Eye,
  X,
  AlertTriangle,
  UserCheck,
  Loader2,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import Image from "next/image";

type UserRole = "Customer" | "Vendor" | "Admin";
type UserStatus = "Active" | "Blocked";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string | null;
  image: string;
}

interface AdminUsersResponse {
  success: boolean;
  totalUsers: number;
  totalFiltered: number;
  stats: {
    total: number;
    customers: number;
    vendors: number;
    admins: number;
    blocked: number;
  };
  users: User[];
}

const initialStats = {
  total: 0,
  customers: 0,
  vendors: 0,
  admins: 0,
  blocked: 0,
};

const formatDate = (date: string | null) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

function ManageUsersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();

  // API data
  const [users, setUsers] = useState<User[]>([]);
  const [statsData, setStatsData] = useState(initialStats);
  const [totalFiltered, setTotalFiltered] = useState(0);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Refresh users after a successful mutation
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionUser, setActionUser] = useState<User | null>(null);

  // Block/unblock request loading state
  const [actionLoading, setActionLoading] = useState(false);

  // Read filters from URL
  const search = searchParams.get("search") || "";
  const roleFilter = searchParams.get("role") || "All";
  const statusFilter = searchParams.get("status") || "All";

  // Fetch users whenever URL search parameters or refreshKey change
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const query = queryString ? `?${queryString}` : "";

        const result = (await apiFetch(
          `/api/admin/users${query}`,
          {
            signal: controller.signal,
          }
        )) as AdminUsersResponse;

        setUsers(result.users);
        setStatsData(result.stats);
        setTotalFiltered(result.totalFiltered);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load users."
        );

        setUsers([]);
        setTotalFiltered(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [queryString, refreshKey]);

  // Update URL search parameters
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const updatedQuery = params.toString();

    router.push(
      updatedQuery ? `${pathname}?${updatedQuery}` : pathname,
      { scroll: false }
    );
  };

  // Search form submission
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const searchValue = String(
      formData.get("search") || ""
    ).trim();

    updateSearchParams("search", searchValue);
  };

  // Clear all filters
  const handleClearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // Block or unblock user
  const handleUpdateUserStatus = async () => {
    if (!actionUser || actionLoading) return;

    const isBlocked = actionUser.status === "Active";

    try {
      setActionLoading(true);

      const result = (await apiFetch(
        `/api/admin/users/${actionUser.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isBlocked,
          }),
        }
      )) as {
        success: boolean;
        message: string;
      };

      toast.success(
        result.message ||
          (isBlocked
            ? "User blocked successfully."
            : "User unblocked successfully.")
      );

      // Close confirmation modal
      setActionUser(null);

      // Fetch updated users and statistics
      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update user status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Statistics from backend
  const stats = [
    {
      label: "Total Users",
      value: statsData.total,
      icon: Users,
      color: "bg-secondary text-primary",
    },
    {
      label: "Customers",
      value: statsData.customers,
      icon: UserRound,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Vendors",
      value: statsData.vendors,
      icon: Store,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Blocked Users",
      value: statsData.blocked,
      icon: Ban,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Heading */}
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          Administration
        </p>

        <h1 className="font-heading text-3xl font-bold text-foreground">
          Manage Users
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage customer accounts, vendors, and platform access.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {stat.label}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-foreground">
                {loading ? "..." : stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              key={search}
              name="search"
              defaultValue={search}
              placeholder="Search name or email..."
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </form>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(event) =>
              updateSearchParams("role", event.target.value)
            }
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customers</option>
            <option value="Vendor">Vendors</option>
            <option value="Admin">Admins</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(event) =>
              updateSearchParams("status", event.target.value)
            }
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {totalFiltered}
            </span>{" "}
            users
          </p>

          <button
            onClick={handleClearFilters}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-foreground">
            All Users
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Review account information and manage access.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Joined</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-muted-foreground"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="font-medium text-red-600">
                      {error}
                    </p>

                    <button
                      onClick={() =>
                        setRefreshKey((previous) => previous + 1)
                      }
                      className="mt-3 text-sm font-medium text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Users
                      size={35}
                      className="mx-auto text-muted-foreground/50"
                    />

                    <h3 className="mt-3 font-semibold text-foreground">
                      No users found
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-muted/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={100}
                            height={100}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-semibold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(user.joinedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          title="View user"
                          className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-primary hover:text-primary"
                        >
                          <Eye size={17} />
                        </button>

                        {user.role !== "Admin" && (
                          <button
                            onClick={() => setActionUser(user)}
                            title={
                              user.status === "Active"
                                ? "Block user"
                                : "Unblock user"
                            }
                            className={`rounded-lg border p-2 transition ${
                              user.status === "Active"
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {user.status === "Active" ? (
                              <Ban size={17} />
                            ) : (
                              <UserCheck size={17} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User details modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                User Details
              </h2>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close user details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center">
              {selectedUser.image ? (
                <Image
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  width={100}
                  height={100}
                  className="mx-auto h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-semibold text-primary">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
              )}

              <h3 className="mt-3 text-lg font-semibold">
                {selectedUser.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {selectedUser.email}
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-xl bg-muted p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">
                  {selectedUser.role}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">
                  {selectedUser.status}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium">
                  {formatDate(selectedUser.joinedAt)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-5 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Block / unblock confirmation */}
      {actionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle size={26} />
            </div>

            <h2 className="mt-4 text-center text-lg font-semibold">
              {actionUser.status === "Active"
                ? "Block this user?"
                : "Unblock this user?"}
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
              {actionUser.status === "Active"
                ? `Are you sure you want to block ${actionUser.name}? They will lose access to protected platform features.`
                : `Are you sure you want to restore access for ${actionUser.name}?`}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setActionUser(null)}
                disabled={actionLoading}
                className="flex-1 rounded-lg border border-border py-3 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateUserStatus}
                disabled={actionLoading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                  actionUser.status === "Active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {actionLoading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Processing...
                  </>
                ) : actionUser.status === "Active" ? (
                  "Block User"
                ) : (
                  "Unblock User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-muted-foreground">
          Loading users page...
        </div>
      }
    >
      <ManageUsersContent />
    </Suspense>
  );
}
