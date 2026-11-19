
"use client";

import Link from "next/link";
import {
  Users,
  Store,
  UserRound,
  ClipboardList,
  CalendarCheck,
  DollarSign,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,248",
    change: "+12.5%",
    description: "Compared to last month",
    icon: Users,
  },
  {
    title: "Total Vendors",
    value: "384",
    change: "+8.2%",
    description: "Compared to last month",
    icon: Store,
  },
  {
    title: "Total Customers",
    value: "864",
    change: "+15.3%",
    description: "Compared to last month",
    icon: UserRound,
  },
  {
    title: "Total Services",
    value: "526",
    change: "+10.8%",
    description: "Compared to last month",
    icon: ClipboardList,
  },
  {
    title: "Total Bookings",
    value: "1,092",
    change: "+18.4%",
    description: "Compared to last month",
    icon: CalendarCheck,
  },
  {
    title: "Total Revenue",
    value: "$12,450",
    change: "+22.6%",
    description: "Compared to last month",
    icon: DollarSign,
  },
];

const recentUsers = [
  {
    id: 1,
    name: "Sophia Williams",
    email: "sophia@example.com",
    role: "Customer",
    status: "Active",
  },
  {
    id: 2,
    name: "James Anderson",
    email: "james@example.com",
    role: "Vendor",
    status: "Active",
  },
  {
    id: 3,
    name: "Olivia Brown",
    email: "olivia@example.com",
    role: "Customer",
    status: "Blocked",
  },
  {
    id: 4,
    name: "William Davis",
    email: "william@example.com",
    role: "Vendor",
    status: "Active",
  },
];

const recentServices = [
  {
    id: 1,
    name: "Luxury Wedding Photography",
    vendor: "Elegant Moments",
    category: "Photography",
    price: "$1,200",
    status: "Pending",
  },
  {
    id: 2,
    name: "Grand Garden Wedding Venue",
    vendor: "Royal Events",
    category: "Venue",
    price: "$3,500",
    status: "Approved",
  },
  {
    id: 3,
    name: "Premium Bridal Makeup",
    vendor: "Beauty Studio",
    category: "Makeup",
    price: "$450",
    status: "Pending",
  },
];

const quickActions = [
  {
    title: "Manage Users",
    description: "View, block, or unblock platform users.",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Manage Services",
    description: "Review and manage vendor services.",
    href: "/dashboard/admin/services",
    icon: Store,
  },
  {
    title: "Transactions",
    description: "Monitor successful platform payments.",
    href: "/dashboard/admin/transactions",
    icon: DollarSign,
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-50 text-green-700",
    Blocked: "bg-red-50 text-red-600",
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-[#34302F] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-white/70">
            <ShieldCheck size={17} />
            WedPlan Administration
          </div>

          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            Welcome back, Admin!
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Here&apos;s what&apos;s happening across your wedding planning
            platform. Keep everything running smoothly.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold">Administrator</p>
            <p className="text-xs text-white/60">Full platform access</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Platform Overview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A snapshot of your platform&apos;s performance.
            </p>
          </div>
          <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
            <TrendingUp size={15} />
            Monthly growth
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon size={21} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <TrendingUp size={14} />
                    {stat.change}
                  </span>
                </div>

                <p className="mt-5 text-sm text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">
                  {stat.value}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pending tasks */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-600">
              <Clock size={23} />
            </div>
            <div>
              <p className="text-sm text-amber-800">Pending Approvals</p>
              <h3 className="mt-1 text-2xl font-bold text-amber-900">18</h3>
              <p className="mt-1 text-xs text-amber-700">
                Services waiting for review
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/services"
            className="rounded-lg bg-white p-2 text-amber-700 transition hover:bg-amber-100"
            aria-label="Review pending services"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-green-600">
              <CheckCircle2 size={23} />
            </div>
            <div>
              <p className="text-sm text-green-800">Successful Payments</p>
              <h3 className="mt-1 text-2xl font-bold text-green-900">96</h3>
              <p className="mt-1 text-xs text-green-700">
                Completed transactions this month
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/transactions"
            className="rounded-lg bg-white p-2 text-green-700 transition hover:bg-green-100"
            aria-label="View transactions"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>

      {/* Recent users */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-semibold text-foreground">Recent Users</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest users who joined WedPlan.
            </p>
          </div>

          <Link
            href="/dashboard/admin/users"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {user.role}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent services */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-semibold text-foreground">Recent Services</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Recently submitted vendor services.
            </p>
          </div>

          <Link
            href="/dashboard/admin/services"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Manage Services <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Vendor</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentServices.map((service) => (
                <tr key={service.id} className="hover:bg-muted/40">
                  <td className="px-5 py-4 font-medium text-foreground">
                    {service.name}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {service.vendor}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {service.category}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {service.price}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={service.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-foreground">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the most important parts of your platform.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon size={21} />
                  </div>
                  <ArrowUpRight
                    size={19}
                    className="text-muted-foreground transition group-hover:text-primary"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-foreground">
                  {action.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
