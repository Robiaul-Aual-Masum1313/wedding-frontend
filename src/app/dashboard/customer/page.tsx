
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ArrowRight,
  ClipboardList,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Types
interface Booking {
  _id: string;
  serviceTitle: string;
  serviceImage?: string;
  eventDate: string;
  eventLocation: string;
  status: string;
  createdAt: string;
  vendor?: {
    name?: string;
    businessName?: string;
    email?: string;
    image?: string;
  };
}

interface MyBookingsResponse {
  success: boolean;
  message: string;
  total: number;
  bookings: Booking[];
}

const statsConfig = [
  {
    title: "Total Bookings",
    description: "All your booking requests",
    icon: ClipboardList,
    key: "total",
  },
  {
    title: "Pending",
    description: "Waiting for vendor response",
    icon: Clock,
    key: "pending",
  },
  {
    title: "Accepted",
    description: "Confirmed by vendors",
    icon: CheckCircle2,
    key: "accepted",
  },
] as const;

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const formatDate = (date: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response: MyBookingsResponse = await apiFetch(
        "/api/bookings/my-bookings"
      );

      setBookings(response.bookings || []);
    } catch (error) {
      console.error("Customer dashboard error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Calculate statistics from the customer's bookings.
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "Accepted"
  ).length;

  // API already returns bookings newest first.
  const recentBookings = bookings.slice(0, 3);

  const stats = statsConfig.map((stat) => {
    let value = 0;

    if (stat.key === "total") {
      value = totalBookings;
    } else if (stat.key === "pending") {
      value = pendingBookings;
    } else if (stat.key === "accepted") {
      value = acceptedBookings;
    }

    return {
      ...stat,
      value,
    };
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-9 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
        <AlertCircle className="size-10 text-red-500" />

        <div>
          <h2 className="font-semibold text-foreground">
            Unable to load your dashboard
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

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
                  <th className="px-6 py-4 font-medium">Event Location</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-t border-border"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {booking.serviceTitle}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {booking.vendor?.businessName ||
                          booking.vendor?.name ||
                          "Unknown Vendor"}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(booking.eventDate)}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {booking.eventLocation || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[booking.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <ClipboardList className="size-10 text-muted-foreground/50" />

                        <p className="mt-3 font-medium text-foreground">
                          No bookings yet
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Explore wedding services and make your first booking.
                        </p>

                        <Link
                          href="/services"
                          className="mt-4 text-sm font-semibold text-primary hover:underline"
                        >
                          Explore Services →
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
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
