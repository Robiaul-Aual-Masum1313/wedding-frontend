
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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

const initialServices: Service[] = [
  {
    id: "1",
    name: "Luxury Wedding Photography",
    vendor: "Elegant Moments",
    category: "Photography & Videography",
    location: "New York, USA",
    price: 1200,
    status: "Pending",
    isActive: false,
    submittedAt: "Nov 18, 2026",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=700",
    description:
      "Professional wedding photography with creative portraits, candid moments, and beautifully edited photographs.",
  },
  {
    id: "2",
    name: "Grand Garden Wedding Venue",
    vendor: "Royal Events",
    category: "Wedding Venues",
    location: "Los Angeles, USA",
    price: 3500,
    status: "Approved",
    isActive: true,
    submittedAt: "Nov 16, 2026",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700",
    description:
      "A beautiful garden venue with elegant outdoor spaces for unforgettable wedding celebrations.",
  },
  {
    id: "3",
    name: "Premium Bridal Makeup",
    vendor: "Beauty Studio",
    category: "Makeup & Styling",
    location: "Chicago, USA",
    price: 450,
    status: "Pending",
    isActive: false,
    submittedAt: "Nov 17, 2026",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=700",
    description:
      "Professional bridal makeup services with personalized looks and premium beauty products.",
  },
  {
    id: "4",
    name: "Luxury Wedding Decoration",
    vendor: "Dream Decor",
    category: "Decoration & Florist",
    location: "Miami, USA",
    price: 1800,
    status: "Approved",
    isActive: true,
    submittedAt: "Nov 12, 2026",
    image:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=700",
    description:
      "Beautiful floral arrangements and elegant wedding decoration tailored to your celebration.",
  },
  {
    id: "5",
    name: "Classic Wedding Catering",
    vendor: "Taste & Celebrate",
    category: "Catering Services",
    location: "Dallas, USA",
    price: 2200,
    status: "Rejected",
    isActive: false,
    submittedAt: "Nov 10, 2026",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=700",
    description:
      "A complete wedding catering experience with customizable menus and professional service.",
  },
  {
    id: "6",
    name: "Bridal Fashion Collection",
    vendor: "The Bridal House",
    category: "Wedding Fashion",
    location: "Houston, USA",
    price: 950,
    status: "Approved",
    isActive: false,
    submittedAt: "Nov 08, 2026",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=700",
    description:
      "A curated bridal fashion collection featuring elegant wedding dresses and accessories.",
  },
];

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

export default function AdminManageServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [action, setAction] = useState<{
    service: Service;
    type: "approve" | "reject" | "delete";
  } | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const term = search.toLowerCase();

      const matchesSearch =
        service.name.toLowerCase().includes(term) ||
        service.vendor.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || service.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        service.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [services, search, statusFilter, categoryFilter]);

  const stats = [
    {
      label: "Total Services",
      value: services.length,
      icon: Store,
      style: "bg-secondary text-primary",
    },
    {
      label: "Pending Review",
      value: services.filter((s) => s.status === "Pending").length,
      icon: Clock,
      style: "bg-amber-50 text-amber-600",
    },
    {
      label: "Approved",
      value: services.filter((s) => s.status === "Approved").length,
      icon: CheckCircle2,
      style: "bg-green-50 text-green-600",
    },
    {
      label: "Rejected",
      value: services.filter((s) => s.status === "Rejected").length,
      icon: XCircle,
      style: "bg-red-50 text-red-600",
    },
  ];

  const confirmAction = () => {
    if (!action) return;

    setServices((previous) => {
      if (action.type === "delete") {
        return previous.filter((s) => s.id !== action.service.id);
      }

      return previous.map((s) => {
        if (s.id !== action.service.id) return s;

        if (action.type === "approve") {
          return { ...s, status: "Approved", isActive: true };
        }

        return { ...s, status: "Rejected", isActive: false };
      });
    });

    if (selectedService?.id === action.service.id) {
      setSelectedService(null);
    }

    setAction(null);
  };

  const toggleAvailability = (serviceId: string) => {
    setServices((previous) =>
      previous.map((service) =>
        service.id === serviceId && service.status === "Approved"
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Heading */}
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          Administration
        </p>
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
        {stats.map((stat) => {
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

      {/* Pending review notice */}
      {services.some((service) => service.status === "Pending") && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Clock size={20} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Services need your attention
            </h3>
            <p className="mt-1 text-sm text-amber-800">
              There are{" "}
              {services.filter((s) => s.status === "Pending").length} services
              waiting for approval. Review them before they appear publicly.
            </p>
          </div>
        </div>
      )}

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
              placeholder="Search service or vendor..."
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
              {filteredServices.length}
            </span>{" "}
            of {services.length} services
          </p>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setCategoryFilter("All Categories");
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Service cards */}
      {filteredServices.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-xl border border-border bg-white transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />

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
                    <Eye size={16} /> Details
                  </button>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {service.status === "Pending" ? (
                    <>
                      <button
                        onClick={() =>
                          setAction({ service, type: "approve" })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                      >
                        <Check size={16} /> Approve
                      </button>

                      <button
                        onClick={() =>
                          setAction({ service, type: "reject" })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <X size={16} /> Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleAvailability(service.id)}
                        disabled={service.status !== "Approved"}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium disabled:opacity-50 ${
                          service.isActive
                            ? "border border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {service.isActive ? (
                          <>
                            <Ban size={16} /> Deactivate
                          </>
                        ) : (
                          <>
                            <Check size={16} /> Activate
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          setAction({ service, type: "delete" })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white px-5 py-16 text-center">
          <Store
            size={40}
            className="mx-auto text-muted-foreground/50"
          />
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
              <Image
                src={selectedService.image}
                alt={selectedService.name}
                width={600}
                height={300}
                className="h-full w-full object-cover"
              />
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
                      setAction({ service: selectedService, type: "approve" })
                    }
                    className="rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Approve Service
                  </button>
                  <button
                    onClick={() =>
                      setAction({ service: selectedService, type: "reject" })
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
                  : "Delete this service?"}
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
              {action.type === "approve"
                ? "This service will be approved and made active."
                : action.type === "reject"
                  ? "This service will be rejected and will not appear publicly."
                  : "This action will permanently remove this service from the platform."}
            </p>

            <p className="mt-2 text-center text-sm font-semibold text-foreground">
              {action.service.name}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAction(null)}
                className="flex-1 rounded-lg border border-border py-3 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>

              <button
                onClick={confirmAction}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold text-white ${
                  action.type === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {action.type === "approve"
                  ? "Approve"
                  : action.type === "reject"
                    ? "Reject"
                    : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
