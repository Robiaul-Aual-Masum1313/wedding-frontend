
"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ServiceCard, { type Service } from "@/components/services/ServiceCard";
// import ServiceSkeleton from "@/components/services/ServiceSkeleton";

const categories = [
  "All Categories",
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const sampleServices: Service[] = [
  {
    _id: "1",
    serviceName: "Elegant Wedding Photography",
    category: "Photography & Videography",
    description:
      "Capture every beautiful moment of your special day with our professional wedding photography team.",
    price: 1200,
    location: "Los Angeles, CA",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900",
    ],
  },
  {
    _id: "2",
    serviceName: "Luxury Garden Wedding Venue",
    category: "Wedding Venues",
    description:
      "Celebrate your love in a beautiful outdoor garden surrounded by nature and elegant decorations.",
    price: 3500,
    location: "New York, NY",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900",
    ],
  },
  {
    _id: "3",
    serviceName: "Premium Floral Decoration",
    category: "Decoration & Florist",
    description:
      "Transform your wedding venue with stunning floral arrangements and custom wedding decorations.",
    price: 1800,
    location: "Chicago, IL",
    images: [
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=900",
    ],
  },
  {
    _id: "4",
    serviceName: "Wedding Catering Package",
    category: "Catering Services",
    description:
      "Delight your guests with delicious food, carefully prepared and beautifully presented.",
    price: 2500,
    location: "Los Angeles, CA",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900",
    ],
  },
  {
    _id: "5",
    serviceName: "Bridal Makeup & Styling",
    category: "Makeup & Styling",
    description:
      "Look and feel your best with professional bridal makeup and personalized styling.",
    price: 650,
    location: "Miami, FL",
    images: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900",
    ],
  },
  {
    _id: "6",
    serviceName: "Designer Wedding Collection",
    category: "Wedding Fashion",
    description:
      "Discover beautiful wedding outfits designed to make your special day unforgettable.",
    price: 950,
    location: "New York, NY",
    images: [
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900",
    ],
  },
];

const BrowseServicesPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [sort, setSort] = useState("default");

  // These sample records represent approved and active services.
  const services = sampleServices;

  const locations = useMemo(
    () => [...new Set(services.map((service) => service.location))],
    [services]
  );

  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      const matchesSearch = service.serviceName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" || service.category === category;

      const matchesLocation =
        location === "All Locations" || service.location === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, search, category, location, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setLocation("All Locations");
    setSort("default");
  };

  const hasActiveFilters =
    search !== "" ||
    category !== "All Categories" ||
    location !== "All Locations";

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
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            <span>Find what you need</span>
          </div>
        </div>

        {/* Service Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
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
              We couldn&apos;t find any services matching your search. Try
              changing your search term or filters.
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

export default BrowseServicesPage;
