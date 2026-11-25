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
  ClipboardList,
  Loader2,
} from "lucide-react";

interface Service {
  _id: string;
  title: string;
  category: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  isActive: boolean;
  createdAt: string;
}

interface Vendor {
  name?: string;
  email?: string;
}

interface Booking {
  _id: string;
  serviceTitle: string;
  eventDate: string;
  eventLocation: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
  createdAt: string;
  customer?: {
    name?: string;
    email?: string;
  } | null;
}

interface ServicesResponse {
  success: boolean;
  totalServices: number;
  services: Service[];
}

interface BookingsResponse {
  success: boolean;
  total: number;
  bookings: Booking[];
}
interface SubscriptionResponse {
  success: boolean;
  subscription: {
    plan: "Free" | "Premium";
    expiresAt: string | null;
    isPremium: boolean;
  };
}
interface DashboardStats {
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  pendingBookings: number;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const VendorDashboard = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
const [subscription, setSubscription] = useState<
  SubscriptionResponse["subscription"] | null
>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [servicesResponse, bookingsResponse, subscriptionResponse] =
          await Promise.all([
            apiFetch("/api/services/my-services") as Promise<ServicesResponse>,
            apiFetch(
              "/api/bookings/vendor-requests",
            ) as Promise<BookingsResponse>,
            apiFetch("/api/vendor/subscription", {
              cache: "no-store",
            }) as Promise<SubscriptionResponse>,
          ]);

        setServices(servicesResponse.services || []);
        setBookings(bookingsResponse.bookings || []);
        setSubscription(subscriptionResponse.subscription);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.isActive === true,
  ).length;

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const recentRequests = [...bookings]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 3);

  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      description: "All your listed services",
      icon: BriefcaseBusiness,
    },
    {
      title: "Active Services",
      value: activeServices,
      description: "Currently active services",
      icon: CalendarCheck,
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      description: "All customer requests",
      icon: ClipboardList,
    },
    {
      title: "Pending Requests",
      value: pendingBookings,
      description: "Requests waiting for your response",
      icon: Clock,
    },
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

const subscriptionPlan = subscription?.plan || "Free";
const isPremium = subscription?.isPremium === true;
const serviceLimit = isPremium ? null : 3;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Unable to load dashboard
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
console.log(subscription);

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
              Welcome to Your Dashboard!
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

        {isPremium ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Enjoy unlimited active services with your Premium plan.
            </p>

            <p className="mt-3 text-sm font-medium text-foreground">
              Unlimited active service slots
            </p>

            {subscription?.expiresAt && (
              <p className="mt-2 text-sm text-muted-foreground">
                Expires on:{" "}
                <span className="font-medium text-foreground">
                  {formatDate(subscription.expiresAt)}
                </span>
              </p>
            )}
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              You can have up to 3 active services with your current plan.
            </p>

            <p className="mt-3 text-sm font-medium text-foreground">
              {activeServices} of 3 active service slots used
            </p>

            <div className="mt-2 h-2 w-full max-w-sm overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min((activeServices / 3) * 100, 100)}%`,
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>

    <Link
      href="/dashboard/vendor/subscription"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
    >
      {isPremium ? "Manage Plan" : "Upgrade Plan"}
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
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="border-t border-border transition hover:bg-muted/30"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {request.customer?.name || "Unknown Customer"}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {request.serviceTitle}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(request.eventDate)}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {request.eventLocation}
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No booking requests yet. Your customer requests will
                      appear here.
                    </td>
                  </tr>
                )}
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
              Keep your service information updated, respond to booking requests
              promptly, and showcase your best work to attract more customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
