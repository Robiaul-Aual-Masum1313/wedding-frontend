"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  X,
  AlertTriangle,
  MapPin,
  DollarSign,
  CalendarDays,
  Check,
  Ban,
} from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

type ServiceStatus = "Pending" | "Approved" | "Rejected";

interface Service {
  id: string;
  name: string;
  vendor: string;
  category: string;
  location: string;
  price: number;
  status: ServiceStatus;
  isActive: boolean;
  submittedAt: string;
  image: string;
  description: string;
}

interface AdminServicesResponse {
  success: boolean;
  totalServices: number;
  totalFiltered: number;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  services: {
    _id: string;
    title: string;
    vendor: string;
    category: string;
    location: string;
    price: number;
    approvalStatus: ServiceStatus;
    isActive: boolean;
    createdAt: string;
    images: string[];
    description: string;
  }[];
}

const categories = [
  "All Categories",
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

function StatusBadge({ status }: { status: ServiceStatus }) {
  const styles: Record<ServiceStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-green-50 text-green-700",
    Rejected: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function AdminManageServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();

  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingServiceId, setUpdatingServiceId] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState(() => searchParams.get("search") || "");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [action, setAction] = useState<{
    service: Service;
    type: "approve" | "reject" | "delete";
  } | null>(null);

  const statusFilter = searchParams.get("status") || "All";

  const categoryFilter = searchParams.get("category") || "All Categories";

  // Update URL search parameters
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(queryString);

    if (!value || value === "All" || value === "All Categories") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const newQuery = params.toString();

    router.push(newQuery ? `${pathname}?${newQuery}` : pathname);
  };

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError("");

        const endpoint = queryString
          ? `/api/admin/services?${queryString}`
          : "/api/admin/services";

        const result = (await apiFetch(endpoint)) as AdminServicesResponse;

        const formattedServices: Service[] = result.services.map((service) => ({
          id: service._id,
          name: service.title,
          vendor: service.vendor,
          category: service.category,
          location: service.location,
          price: service.price,
          status: service.approvalStatus,
          isActive: service.isActive,
          submittedAt: new Date(service.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          image: service.images?.[0] || "",
          description: service.description,
        }));

        setServices(formattedServices);
        setStats(result.stats);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load services.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [queryString]);

  // Search form submission
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateSearchParams("search", search.trim());
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  // Dashboard statistics
  const statsCards = [
    {
      label: "Total Services",
      value: stats.total,
      icon: Store,
      style: "bg-secondary text-primary",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock,
      style: "bg-amber-50 text-amber-600",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      style: "bg-green-50 text-green-600",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      style: "bg-red-50 text-red-600",
    },
  ];

  // Approve, reject, or delete service
  const confirmAction = async () => {
    if (!action) return;

    const serviceToUpdate = action.service;

    try {
      setIsSubmitting(true);

      // Delete rejected service
      if (action.type === "delete") {
        const result = await apiFetch(
          `/api/admin/services/${serviceToUpdate.id}`,
          {
            method: "DELETE",
          },
        );

        if (!result.success) {
          throw new Error(result.message || "Failed to delete service");
        }

        // Remove deleted service from frontend
        setServices((previousServices) =>
          previousServices.filter(
            (service) => service.id !== serviceToUpdate.id,
          ),
        );

        // Update total service statistics
        setStats((previousStats) => ({
          ...previousStats,
          total: previousStats.total - 1,
          rejected: previousStats.rejected - 1,
        }));

        setAction(null);
        return;
      }

      // Approve or reject service
      const approvalStatus =
        action.type === "approve" ? "Approved" : "Rejected";

      const result = await apiFetch(
        `/api/admin/services/${serviceToUpdate.id}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approvalStatus }),
        },
      );

      if (!result.success) {
        throw new Error(result.message || "Failed to update service");
      }

      setServices((previousServices) =>
        previousServices.map((service) =>
          service.id === serviceToUpdate.id
            ? {
                ...service,
                status: approvalStatus,
                isActive: approvalStatus === "Approved",
              }
            : service,
        ),
      );

      setStats((previousStats) => ({
        ...previousStats,
        pending:
          serviceToUpdate.status === "Pending"
            ? previousStats.pending - 1
            : previousStats.pending,
        approved:
          previousStats.approved +
          (approvalStatus === "Approved" ? 1 : 0) -
          (serviceToUpdate.status === "Approved" ? 1 : 0),
        rejected:
          previousStats.rejected +
          (approvalStatus === "Rejected" ? 1 : 0) -
          (serviceToUpdate.status === "Rejected" ? 1 : 0),
      }));

      setAction(null);
    } catch (error) {
      console.error("Admin service action error:", error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Temporary frontend-only availability toggle
  // Activate or deactivate an approved service
  const toggleAvailability = async (serviceId: string) => {
    const service = services.find((item) => item.id === serviceId);

    if (!service || service.status !== "Approved") {
      return;
    }

    const nextIsActive = !service.isActive;

    try {
      setUpdatingServiceId(serviceId);

      const result = await apiFetch(
        `/api/admin/services/${serviceId}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: nextIsActive,
          }),
        },
      );

      if (!result.success) {
        throw new Error(
          result.message || "Failed to update service availability",
        );
      }

      // Update frontend state only after backend success
      setServices((previousServices) =>
        previousServices.map((item) =>
          item.id === serviceId
            ? {
                ...item,
                isActive: result.isActive,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Update service availability error:", error);

      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setUpdatingServiceId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Heading */}
      <div>
        <p className="mb-2 text-sm font-medium text-primary">Administration</p>

        <h1 className="font-heading text-3xl font-bold text-foreground">
          Manage Services
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review vendor submissions and manage the services available on
          WedPlan.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-white p-5"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.style}`}
              >
                <Icon size={21} />
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{stat.label}</p>

              <h2 className="mt-1 text-2xl font-bold text-foreground">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Pending review notice */}
      {stats.pending > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Clock size={20} className="mt-0.5 shrink-0 text-amber-600" />

          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Services need your attention
            </h3>

            <p className="mt-1 text-sm text-amber-800">
              There are {stats.pending} services waiting for approval. Review
              them before they appear publicly.
            </p>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="rounded-xl border border-border bg-white p-5">
        <form onSubmit={handleSearch}>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search service or vendor..."
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(event) =>
                updateSearchParams("category", event.target.value)
              }
              className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {services.length}
              </span>{" "}
              of {stats.total} services
            </p>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm font-medium text-primary hover:underline"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Service cards */}
      {isLoading ? (
        <div className="rounded-xl border border-border bg-white py-16 text-center text-muted-foreground">
          Loading services...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 py-10 text-center text-red-600">
          {error}
        </div>
      ) : services.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={700}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                    <Store size={40} />
                  </div>
                )}

                <div className="absolute left-3 top-3">
                  <StatusBadge status={service.status} />
                </div>

                <div className="absolute right-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-sm font-bold text-foreground">
                  ${service.price.toLocaleString()}
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-medium text-primary">
                    {service.category}
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    {service.name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    By {service.vendor}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  {service.location}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span
                    className={`text-xs font-medium ${
                      service.isActive
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {service.status !== "Approved"
                      ? "Not publicly available"
                      : service.isActive
                        ? "Active listing"
                        : "Inactive listing"}
                  </span>

                  <button
                    onClick={() => setSelectedService(service)}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <Eye size={16} />
                    Details
                  </button>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {service.status === "Pending" ? (
                    <>
                      <button
                        onClick={() =>
                          setAction({
                            service,
                            type: "approve",
                          })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                      >
                        <Check size={16} />
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          setAction({
                            service,
                            type: "reject",
                          })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </>
                  ) : service.status === "Approved" ? (
                    <button
                      onClick={() => toggleAvailability(service.id)}
                      disabled={
                        service.status !== "Approved" ||
                        updatingServiceId === service.id
                      }
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                        service.isActive
                          ? "border border-amber-200 text-amber-700 hover:bg-amber-50"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {updatingServiceId === service.id ? (
                        "Updating..."
                      ) : service.isActive ? (
                        <>
                          <Ban size={16} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Activate
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setAction({
                          service,
                          type: "delete",
                        })
                      }
                      className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete Rejected Service
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white px-5 py-16 text-center">
          <Store size={40} className="mx-auto text-muted-foreground/50" />

          <h3 className="mt-4 font-semibold text-foreground">
            No services found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      )}

      {/* Details modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="relative h-56">
              {selectedService.image ? (
                <Image
                  src={selectedService.image}
                  alt={selectedService.name}
                  width={600}
                  height={300}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                  <Store size={40} />
                </div>
              )}

              <button
                onClick={() => setSelectedService(null)}
                className="absolute right-3 top-3 rounded-full bg-white p-2 text-foreground shadow"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status={selectedService.status} />

                <span className="font-bold text-primary">
                  ${selectedService.price.toLocaleString()}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedService.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedService.category}
                </p>
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                {selectedService.description}
              </p>

              <div className="space-y-3 rounded-xl bg-muted p-4 text-sm">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-primary" />
                  Vendor: {selectedService.vendor}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  {selectedService.location}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-primary" />
                  Submitted: {selectedService.submittedAt}
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-primary" />
                  Price: ${selectedService.price.toLocaleString()}
                </div>
              </div>

              {selectedService.status === "Pending" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setAction({
                        service: selectedService,
                        type: "approve",
                      })
                    }
                    className="rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Approve Service
                  </button>

                  <button
                    onClick={() =>
                      setAction({
                        service: selectedService,
                        type: "reject",
                      })
                    }
                    className="rounded-lg border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Reject Service
                  </button>
                </div>
              )}

              <button
                onClick={() => setSelectedService(null)}
                className="w-full rounded-lg border border-border py-3 text-sm font-medium hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {action && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle size={26} />
            </div>

            <h2 className="mt-4 text-center text-lg font-semibold text-foreground">
              {action.type === "approve"
                ? "Approve this service?"
                : action.type === "reject"
                  ? "Reject this service?"
                  : "Delete this rejected service?"}
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
              {action.type === "approve"
                ? "This service will be approved and made active."
                : action.type === "reject"
                  ? "This service will be rejected and will not appear publicly."
                  : "Are you sure you want to permanently delete this rejected service? This action cannot be undone."}
            </p>

            <p className="mt-2 text-center text-sm font-semibold text-foreground">
              {action.service.name}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAction(null)}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-border py-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmAction}
                disabled={isSubmitting}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold text-white ${
                  action.type === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {isSubmitting
                  ? "Processing..."
                  : action.type === "approve"
                    ? "Approve Service"
                    : action.type === "reject"
                      ? "Reject Service"
                      : "Delete Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminManageServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-center text-muted-foreground">
          Loading services...
        </div>
      }
    >
      <AdminManageServicesContent />
    </Suspense>
  );
}
