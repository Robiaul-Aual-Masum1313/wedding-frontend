
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import BookingRequestForm from "@/components/services/BookingRequestForm";

const sampleService = {
  _id: "1",
  serviceName: "Elegant Wedding Photography",
  category: "Photography & Videography",
  description:
    "Your wedding day is one of the most beautiful chapters of your life. Our professional photography team is dedicated to capturing every genuine emotion, beautiful detail, and unforgettable moment. From getting ready to your final dance, we tell your love story through timeless photographs.",
  price: 1200,
  location: "Los Angeles, CA",
  images: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200",
  ],
  status: "Approved",
  isActive: true,
  vendor: {
    name: "Alex Photography Studio",
    email: "alex@example.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    businessName: "Alex Wedding Photography",
  },
};

const ServiceDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const service = sampleService;

  const isAvailable =
    service.status === "Approved" && service.isActive;

  // This is only a temporary UI demonstration.
  // Authentication and booking validation must happen on the backend.
  const handleBooking = () => {
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Services
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-muted">
              <Image
                src={service.images[selectedImage]}
                width={1200}
                height={600}
                alt={service.serviceName}
                className="h-[350px] w-full object-cover sm:h-[480px]"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {service.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-lg border-2 transition ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${service.serviceName} ${index + 1}`}
                    width={1200}
                    height={600}
                    className="h-24 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Service Information */}
          <div className="flex flex-col">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary">
                {service.category}
              </span>

              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                  <CheckCircle2 className="size-4" />
                  Available
                </span>
              ) : (
                <span className="text-xs font-medium text-destructive">
                  Currently unavailable
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {service.serviceName}
            </h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {service.location}
            </div>

            {/* Price */}
            <div className="mt-8 rounded-xl border border-border bg-secondary/40 p-5">
              <p className="text-sm text-muted-foreground">
                Starting price
              </p>
              <p className="mt-1 text-3xl font-bold text-primary">
                ${service.price.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Final pricing may depend on your event requirements.
              </p>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                About This Service
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {service.description}
              </p>
            </div>

            {/* Vendor Information */}
            <div className="mt-8 rounded-xl border border-border p-5">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Service Provider
              </h2>

              <div className="mt-4 flex items-center gap-4">
                <Image
                  src={service.vendor.image}
                  alt={service.vendor.name}
                  width={1200}
                  height={550}
                  className="size-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-foreground">
                    {service.vendor.businessName}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <UserRound className="size-4" />
                    {service.vendor.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleBooking}
                disabled={!isAvailable}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CalendarDays className="size-5" />
                Request Booking
              </button>

              <button
                type="button"
                aria-label="Add to favorites"
                className="flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
              >
                <Heart className="size-5" />
                Save
              </button>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-lg bg-muted p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground">
                Booking requests are subject to vendor confirmation. Your
                booking is not confirmed until the vendor accepts your request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Temporary Booking Modal */}
{isBookingOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => setIsBookingOpen(false)}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      <h2
        id="booking-modal-title"
        className="font-heading text-2xl font-semibold text-foreground"
      >
        Request a Booking
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Submit your event details to {service.vendor.businessName}.
      </p>

      <BookingRequestForm
        serviceId={params.id}
        serviceName={service.serviceName}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  </div>
)}
    </div>
  );
};

export default ServiceDetailsPage;
