
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  Store,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Eye,
  X,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import Image from "next/image";

type UserRole = "Customer" | "Vendor" | "Admin";
type UserStatus = "Active" | "Blocked";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  image: string;
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Sophia Williams",
    email: "sophia@example.com",
    role: "Customer",
    status: "Active",
    joinedAt: "Nov 15, 2026",
    image: "https://i.pravatar.cc/100?img=47",
  },
  {
    id: "2",
    name: "James Anderson",
    email: "james@example.com",
    role: "Vendor",
    status: "Active",
    joinedAt: "Nov 14, 2026",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: "3",
    name: "Olivia Brown",
    email: "olivia@example.com",
    role: "Customer",
    status: "Blocked",
    joinedAt: "Nov 12, 2026",
    image: "https://i.pravatar.cc/100?img=44",
  },
  {
    id: "4",
    name: "William Davis",
    email: "william@example.com",
    role: "Vendor",
    status: "Active",
    joinedAt: "Nov 10, 2026",
    image: "https://i.pravatar.cc/100?img=13",
  },
  {
    id: "5",
    name: "Emily Wilson",
    email: "emily@example.com",
    role: "Customer",
    status: "Active",
    joinedAt: "Nov 08, 2026",
    image: "https://i.pravatar.cc/100?img=45",
  },
  {
    id: "6",
    name: "Daniel Miller",
    email: "daniel@example.com",
    role: "Vendor",
    status: "Blocked",
    joinedAt: "Nov 05, 2026",
    image: "https://i.pravatar.cc/100?img=14",
  },
  {
    id: "7",
    name: "Isabella Taylor",
    email: "isabella@example.com",
    role: "Admin",
    status: "Active",
    joinedAt: "Nov 02, 2026",
    image: "https://i.pravatar.cc/100?img=48",
  },
];

const currentAdminId = "7";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionUser, setActionUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-secondary text-primary",
    },
    {
      label: "Customers",
      value: users.filter((user) => user.role === "Customer").length,
      icon: UserRound,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Vendors",
      value: users.filter((user) => user.role === "Vendor").length,
      icon: Store,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Blocked Users",
      value: users.filter((user) => user.status === "Blocked").length,
      icon: Ban,
      color: "bg-red-50 text-red-600",
    },
  ];

  const confirmStatusChange = () => {
    if (!actionUser) return;

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === actionUser.id
          ? {
              ...user,
              status: user.status === "Active" ? "Blocked" : "Active",
            }
          : user
      )
    );

    setActionUser(null);
  };

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
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customers</option>
            <option value="Vendor">Vendors</option>
            <option value="Admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredUsers.length}</span> of {users.length} users
          </p>

          <button
            onClick={() => {
              setSearch("");
              setRoleFilter("All");
              setStatusFilter("All");
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-foreground">All Users</h2>
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
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-muted/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={200}
                        height={200}
                        className="h-10 w-10 rounded-full object-cover"
                      />
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
                    {user.joinedAt}
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
              ))}

              {filteredUsers.length === 0 && (
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
              <h2 className="text-lg font-semibold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Close user details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center">
              <Image
                src={selectedUser.image}
                alt={selectedUser.name}
                width={400}
                height={200}
                className="mx-auto h-20 w-20 rounded-full object-cover"
              />
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
                <span className="font-medium">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{selectedUser.status}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium">{selectedUser.joinedAt}</span>
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
                className="flex-1 rounded-lg border border-border py-3 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>

              <button
                onClick={confirmStatusChange}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold text-white ${
                  actionUser.status === "Active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {actionUser.status === "Active" ? "Block User" : "Unblock User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
