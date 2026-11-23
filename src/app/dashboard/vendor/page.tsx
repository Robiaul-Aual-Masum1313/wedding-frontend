
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck,
  Clock,
  Plus,
  TrendingUp,
  Crown,
  Eye,
  ClipboardList,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  pendingBookings: number;
}

interface VendorDashboardResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name?: string;
    email?: string;
  };
  stats: DashboardStats;
}

const recentRequests = [
  {
    id: "1",
    customer: "Sarah Johnson",
    service: "Elegant Wedding Photography",
    eventDate: "December 20, 2026",
    location: "Los Angeles, CA",
    status: "Pending",
  },
  {
    id: "2",
    customer: "Michael Brown",
    service: "Wedding Cinematography",
    eventDate: "January 15, 2027",
    location: "New York, NY",
    status: "Accepted",
  },
  {
    id: "3",
    customer: "Emily Davis",
    service: "Premium Wedding Photography",
    eventDate: "February 10, 2027",
    location: "Chicago, IL",
    status: "Pending",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const VendorDashboard = () => {
  const subscriptionPlan = "Free";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Vendor Dashboard
            </p>

            <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
              Welcome, Alex!
            </h1>

            <p className="mt-2 text-muted-foreground">
              Here&apos;s what&apos;s happening with your wedding business.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/services/add"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Add New Service
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-border bg-card p-6 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-foreground">
                      {stat.value}
                    </h2>
                  </div>

                  <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
                    <Icon className="size-6 text-primary" />
                  </div>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Subscription Plan */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Crown className="size-6 text-primary" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    Your Subscription
                  </h2>

                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                    {subscriptionPlan} Plan
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  You can have up to 3 active services with your current plan.
                </p>

                <p className="mt-3 text-sm font-medium text-foreground">
                  2 of 3 active service slots used
                </p>

                <div className="mt-2 h-2 w-full max-w-sm overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-primary" />
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Upgrade Plan
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Recent Booking Requests */}
        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Recent Booking Requests
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Stay updated with your latest customer requests.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/bookings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View All
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Event Date</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t border-border transition hover:bg-muted/30"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {request.customer}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {request.service}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {request.eventDate}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {request.location}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[request.status]
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <h2 className="mb-5 font-heading text-xl font-semibold text-foreground">
            Quick Actions
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/dashboard/vendor/services/add"
              className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <Plus className="size-7 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">
                Add a New Service
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Showcase another wedding service to potential customers.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Add Service
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/dashboard/vendor/services"
              className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <BriefcaseBusiness className="size-7 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">
                Manage Services
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Update your service information and availability.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Manage Services
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/dashboard/vendor/bookings"
              className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <ClipboardList className="size-7 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">
                Booking Requests
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Review and respond to customer booking requests.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                View Requests
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>

        {/* Business Tip */}
        <div className="mt-10 flex items-start gap-4 rounded-xl border border-border bg-secondary/40 p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background">
            <TrendingUp className="size-5 text-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-foreground">
              Grow your wedding business
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Keep your service information updated, respond to booking
              requests promptly, and showcase your best work to attract more
              customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
