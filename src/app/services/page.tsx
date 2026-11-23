
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

import ServiceCard, {
  type Service,
} from "@/components/services/ServiceCard";

const categories = [
  "All Categories",
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

type ServicesResponse = {
  success: boolean;
  totalServices: number;
  locations: string[];
  services: Service[];
};

type BrowseServicesContentProps = {
  initialCategory: string;
};

const BrowseServicesContent = ({
  initialCategory,
}: BrowseServicesContentProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState("default");

  const [services, setServices] = useState<Service[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch services whenever search, filters, or sorting changes
  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category !== "All Categories") {
          params.set("category", category);
        }

        if (location !== "All Locations") {
          params.set("location", location);
        }

        if (sort !== "default") {
          params.set("sort", sort);
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured");
        }

        const response = await fetch(
          `${apiUrl}/api/services?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data: ServicesResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to load services");
        }

        setServices(data.services);
        setLocations(data.locations);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Browse services error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );

        setServices([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search, category, location, sort]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setLocation("All Locations");
    setSort("default");
  };

  const hasActiveFilters =
    search !== "" ||
    category !== "All Categories" ||
    location !== "All Locations" ||
    sort !== "default";

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Find your perfect match
          </p>

          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Explore Wedding Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Discover trusted wedding professionals and find everything you
            need to make your special day unforgettable.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="All Locations">All Locations</option>

              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Price Sorting */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <X className="size-4" />
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Available Services
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading
                ? "Updating services..."
                : `Showing ${services.length} services`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            <span>Find what you need</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-9 animate-spin text-primary" />

              <p className="text-sm text-muted-foreground">
                Finding wedding services...
              </p>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="rounded-xl border border-destructive/30 bg-card px-6 py-16 text-center">
            <h3 className="font-heading text-xl font-semibold text-foreground">
              Unable to load services
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Clear Filters
            </button>
          </div>
        ) : services.length > 0 ? (
          /* Service Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-secondary">
              <Search className="size-7 text-primary" />
            </div>

            <h3 className="font-heading text-xl font-semibold text-foreground">
              No services found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We couldn&apos;t find any services matching your search.
              Try changing your search term or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

// Read category from the URL
const BrowseServicesPageContent = () => {
  const searchParams = useSearchParams();

  const requestedCategory = searchParams.get("category") || "";

  const initialCategory = categories.includes(requestedCategory)
    ? requestedCategory
    : "All Categories";

  return (
    <BrowseServicesContent
      key={initialCategory}
      initialCategory={initialCategory}
    />
  );
};

const BrowseServicesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-9 animate-spin text-primary" />
        </div>
      }
    >
      <BrowseServicesPageContent />
    </Suspense>
  );
};

export default BrowseServicesPage;
