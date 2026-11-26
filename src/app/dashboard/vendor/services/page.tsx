
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Crown,
  BriefcaseBusiness,
  X,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type ServiceStatus = "Pending" | "Approved" | "Rejected";

interface VendorService {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  approvalStatus: ServiceStatus;
  isActive: boolean;
  createdAt: string;
}

interface Subscription {
  plan: string;
  expiresAt: string | null;
  isPremium: boolean;
}

interface SubscriptionResponse {
  success: boolean;
  subscription: Subscription;
}

const statusStyles: Record<ServiceStatus, string> = {
  Approved: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Rejected: "bg-red-50 text-red-700",
};

const statusIcons = {
  Approved: CheckCircle2,
  Pending: Clock,
  Rejected: XCircle,
};

export default function VendorServicesPage() {
  const [services, setServices] = useState<VendorService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState("");
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(
    null,
  );

  const fetchMyServices = async () => {
    try {
      setIsLoading(true);
      setFetchError("");

      const result = await apiFetch("/api/services/my-services");

      setServices(result.services);
    } catch (error) {
      console.error("Failed to fetch services:", error);

      setFetchError(
        error instanceof Error
          ? error.message
          : "Unable to load your services.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      setSubscriptionLoading(true);
      setSubscriptionError("");

      const result: SubscriptionResponse = await apiFetch(
        "/api/vendor/subscription",
      );

      setSubscription(result.subscription);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);

      setSubscriptionError(
        error instanceof Error
          ? error.message
          : "Unable to load your subscription.",
      );
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
    fetchSubscription();
  }, []);

  const isPremium = subscription?.isPremium === true;

  const activeServices = services.filter((service) => service.isActive).length;

  const maxFreeServices = 3;
  const remainingSlots = Math.max(0, maxFreeServices - activeServices);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        activeFilter === "All" || service.approvalStatus === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, activeFilter]);

  const handleToggleAvailability = async (service: VendorService) => {
    const newAvailability = !service.isActive;

    if (newAvailability && service.approvalStatus !== "Approved") {
      setActionError("Only approved services can be activated.");
      return;
    }

    setUpdatingServiceId(service._id);
    setActionError("");

    try {
      const result = await apiFetch(
        `/api/services/${service._id}/availability`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: newAvailability,
          }),
        },
      );

      setServices((previousServices) =>
        previousServices.map((item) =>
          item._id === service._id ? result.service : item,
        ),
      );
    } catch (error) {
      console.error("Availability update error:", error);

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update service availability.",
      );
    } finally {
      setUpdatingServiceId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeletingServiceId(deleteId);
    setActionError("");

    try {
      await apiFetch(`/api/services/${deleteId}`, {
        method: "DELETE",
      });

      setServices((previousServices) =>
        previousServices.filter((service) => service._id !== deleteId),
      );

      setDeleteId(null);
      setFeedback("Service deleted successfully.");
    } catch (error) {
      console.error("Delete service error:", error);

      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete this service.",
      );
    } finally {
      setDeletingServiceId(null);
    }
  };

  const selectedService = services.find((service) => service._id === deleteId);

  return (
    <div className="space-y-8 px-7 py-11">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Vendor Dashboard
          </p>

          <h1 className="font-heading text-3xl font-bold text-foreground">
            My Services
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your wedding services, availability, and listings.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/services/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Add New Service
        </Link>
      </div>

      {/* Subscription information */}
      {subscriptionLoading ? (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Loader2 className="size-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Checking your subscription...
            </p>
          </div>
        </div>
      ) : subscriptionError ? (
        <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-red-600">{subscriptionError}</p>

          <button
            type="button"
            onClick={fetchSubscription}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      ) : isPremium ? (
        /* Premium vendor section */
        <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                <Crown size={24} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-foreground">
                    You're a Premium Member!
                  </h2>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    PREMIUM
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Enjoy unlimited active service listings. You can grow your
                  wedding business without the Free plan's service limit.
                </p>

                {subscription?.expiresAt && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Subscription expires on{" "}
                    <span className="font-semibold text-foreground">
                      {new Date(subscription.expiresAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 px-5 py-4 sm:min-w-44">
              <div className="flex items-center gap-2 text-amber-700">
                <Sparkles size={18} />
                <span className="text-sm font-semibold">
                  Unlimited Services
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-foreground">
                {activeServices}
              </p>

              <p className="text-xs text-muted-foreground">
                Active services
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Free vendor section */
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-secondary p-3 text-primary">
                <Crown size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">Free Plan</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  You can have up to {maxFreeServices} active approved services.
                </p>
              </div>
            </div>

            <div className="sm:min-w-52">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Active services
                </span>

                <span className="font-semibold text-foreground">
                  {activeServices}/{maxFreeServices}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(
                      (activeServices / maxFreeServices) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                {remainingSlots} active slot(s) remaining
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium to enjoy unlimited active services.
            </p>

            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Crown size={16} />
              Upgrade to Premium
            </Link>
          </div>
        </div>
      )}

      {/* Feedback message */}
      {feedback && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground">
          <p>{feedback}</p>

          <button
            onClick={() => setFeedback("")}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Search and filters */}
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search your services..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Approved", "Pending", "Rejected"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service count */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Your Listings
        </h2>

        <span className="text-sm text-muted-foreground">
          {filteredServices.length} service(s) found
        </span>
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </div>
      )}

      {/* Service cards */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-border bg-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />

            <p className="text-sm text-muted-foreground">
              Loading your services...
            </p>
          </div>
        </div>
      ) : fetchError ? (
        <div className="rounded-xl border border-red-200 bg-white px-5 py-12 text-center">
          <p className="text-sm text-red-600">{fetchError}</p>

          <button
            type="button"
            onClick={fetchMyServices}
            className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => {
            const StatusIcon = statusIcons[service.approvalStatus];

            return (
              <div
                key={service._id}
                className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-48 bg-secondary">
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />

                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[service.approvalStatus]}`}
                  >
                    <StatusIcon size={14} />
                    {service.approvalStatus}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-medium text-primary">
                      {service.category}
                    </p>

                    <h3 className="mt-1 line-clamp-1 font-heading text-lg font-semibold text-foreground">
                      {service.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin size={15} />
                      {service.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-y border-border py-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Starting price
                      </p>

                      <p className="mt-1 text-lg font-bold text-foreground">
                        ${service.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Availability
                      </p>

                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(service)}
                        disabled={
                          updatingServiceId === service._id ||
                          (!service.isActive &&
                            service.approvalStatus !== "Approved")
                        }
                        className={`mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          service.isActive
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-secondary text-foreground hover:bg-secondary/70"
                        }`}
                      >
                        {updatingServiceId === service._id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : service.isActive ? (
                          "Deactivate"
                        ) : (
                          "Activate"
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(service.createdAt).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/services/${service._id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                    >
                      <Eye size={16} />
                      View
                    </Link>

                    <Link
                      href={`/dashboard/vendor/services/${service._id}/edit`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/70"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteId(service._id)}
                      className="rounded-lg border border-red-200 px-3 text-red-600 transition hover:bg-red-50"
                      aria-label={`Delete ${service.title}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
            <BriefcaseBusiness size={25} />
          </div>

          <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
            No services found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {searchTerm || activeFilter !== "All"
              ? "Try changing your search or filter."
              : "You haven't added any services yet. Create your first listing to get started."}
          </p>

          <Link
            href="/dashboard/vendor/services/add"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus size={17} />
            Add Your First Service
          </Link>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={24} />
            </div>

            <h3 className="mt-4 text-center font-heading text-xl font-semibold text-foreground">
              Delete this service?
            </h3>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                {selectedService.title}
              </strong>
              ? This action cannot be undone.
            </p>

            {actionError && (
              <p className="mt-4 text-center text-sm text-red-600">
                {actionError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deletingServiceId !== null}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingServiceId === deleteId}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingServiceId === deleteId ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete Service"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
