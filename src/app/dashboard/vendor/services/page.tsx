
"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
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
} from "lucide-react";

type ServiceStatus = "Pending" | "Approved" | "Rejected";

interface VendorService {
  _id: string;
  serviceName: string;
  category: string;
  price: number;
  location: string;
  image: string;
  status: ServiceStatus;
  isActive: boolean;
  createdAt: string;
}

const initialServices: VendorService[] = [
  {
    _id: "1",
    serviceName: "Premium Wedding Photography",
    category: "Photography & Videography",
    price: 1200,
    location: "New York, USA",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    status: "Approved",
    isActive: true,
    createdAt: "Nov 12, 2026",
  },
  {
    _id: "2",
    serviceName: "Luxury Wedding Decoration",
    category: "Decoration & Florist",
    price: 850,
    location: "Brooklyn, USA",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
    status: "Approved",
    isActive: true,
    createdAt: "Nov 10, 2026",
  },
  {
    _id: "3",
    serviceName: "Elegant Wedding Catering",
    category: "Catering Services",
    price: 1500,
    location: "Queens, USA",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    status: "Pending",
    isActive: false,
    createdAt: "Nov 15, 2026",
  },
  {
    _id: "4",
    serviceName: "Bridal Makeup Package",
    category: "Makeup & Styling",
    price: 450,
    location: "Manhattan, USA",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
    status: "Rejected",
    isActive: false,
    createdAt: "Nov 08, 2026",
  },
];

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
  const [services, setServices] = useState(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const activeServices = services.filter(
    (service) => service.status === "Approved" && service.isActive
  ).length;

  const maxFreeServices = 3;
  const remainingSlots = Math.max(0, maxFreeServices - activeServices);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.serviceName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        activeFilter === "All" || service.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, activeFilter]);

  const handleToggleAvailability = (id: string) => {
    const selectedService = services.find((service) => service._id === id);

    if (!selectedService) return;

    if (
      !selectedService.isActive &&
      selectedService.status === "Approved" &&
      activeServices >= maxFreeServices
    ) {
      setFeedback("You've reached your Free Plan limit. Upgrade to Premium to activate more services.");
      return;
    }

    setServices((previous) =>
      previous.map((service) =>
        service._id === id
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );

    setFeedback("Service availability updated successfully.");
  };

  const handleDelete = () => {
    if (!deleteId) return;

    setServices((previous) =>
      previous.filter((service) => service._id !== deleteId)
    );

    setDeleteId(null);
    setFeedback("Service deleted successfully.");
  };

  const selectedService = services.find(
    (service) => service._id === deleteId
  );

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

      {/* Free plan information */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-secondary p-3 text-primary">
              <Crown size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Free Plan
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You can have up to {maxFreeServices} active approved services.
              </p>
            </div>
          </div>

          <div className="sm:min-w-52">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Active services</span>
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
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {remainingSlots} active slot(s) remaining
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <Link
            href="/dashboard/vendor/subscription"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Upgrade to Premium for unlimited services →
          </Link>
        </div>
      </div>

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

      {/* Service cards */}
      {filteredServices.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => {
            const StatusIcon = statusIcons[service.status];

            return (
              <div
                key={service._id}
                className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
                <div className="relative h-48 bg-secondary">
                  <Image
                    src={service.image}
                    alt={service.serviceName}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />

                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[service.status]}`}
                  >
                    <StatusIcon size={14} />
                    {service.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-medium text-primary">
                      {service.category}
                    </p>
                    <h3 className="mt-1 line-clamp-1 font-heading text-lg font-semibold text-foreground">
                      {service.serviceName}
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
                        disabled={service.status !== "Approved"}
                        onClick={() =>
                          handleToggleAvailability(service._id)
                        }
                        className={`mt-1 rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          service.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {service.status !== "Approved"
                          ? "Not available"
                          : service.isActive
                            ? "Active"
                            : "Inactive"}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created: {service.createdAt}
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
                      aria-label={`Delete ${service.serviceName}`}
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
                {selectedService.serviceName}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
