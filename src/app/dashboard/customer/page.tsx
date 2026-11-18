
"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

const stats = [
  {
    title: "Total Bookings",
    value: 8,
    description: "All your booking requests",
    icon: ClipboardList,
  },
  {
    title: "Pending",
    value: 3,
    description: "Waiting for vendor response",
    icon: Clock,
  },
  {
    title: "Accepted",
    value: 4,
    description: "Confirmed by vendors",
    icon: CheckCircle2,
  },
];

const recentBookings = [
  {
    id: "1",
    service: "Elegant Wedding Photography",
    vendor: "Alex Photography Studio",
    date: "December 20, 2026",
    status: "Accepted",
    price: 1200,
  },
  {
    id: "2",
    service: "Luxury Garden Wedding Venue",
    vendor: "Dream Garden Events",
    date: "January 15, 2027",
    status: "Pending",
    price: 3500,
  },
  {
    id: "3",
    service: "Premium Floral Decoration",
    vendor: "Bloom & Blossom",
    date: "February 10, 2027",
    status: "Rejected",
    price: 1800,
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">
              CUSTOMER DASHBOARD
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Keep track of your wedding planning journey.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Explore Services
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-border bg-card p-6"
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

        {/* Recent Bookings */}
        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Recent Bookings
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your latest service booking requests.
              </p>
            </div>

            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View All
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Vendor</th>
                  <th className="px-6 py-4 font-medium">Event Date</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-t border-border"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {booking.service}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {booking.vendor}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      ${booking.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Planning Reminder */}
        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-secondary/40 p-6 sm:flex-row sm:items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-background">
            <CalendarDays className="size-6 text-primary" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              Your perfect day starts with a plan!
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover more trusted wedding professionals and make your
              celebration unforgettable.
            </p>
          </div>

          <Link
            href="/services"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Browse Services →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
