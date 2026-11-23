
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CalendarDays, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Tag,
  User,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

type Vendor = {
  name: string;
  image: string;
  businessName: string;
  email: string;
};

type Service = {
  _id: string;
  title: string;
  serviceName: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  location: string;
  vendor: Vendor | null;
};


export default function ServiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventDate, setEventDate] = useState("");
const [eventLocation, setEventLocation] = useState("");
const [message, setMessage] = useState("");
const [isBooking, setIsBooking] = useState(false);

const today = new Date().toLocaleDateString("en-CA");

const handleBooking = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!eventDate || !eventLocation.trim()) {
    toast.error("Please provide the event date and location.");
    return;
  }

  try {
    setIsBooking(true);

    const result = await apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        serviceId: service?._id,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim(),
      }),
    });

    toast.success(result.message || "Booking request submitted successfully!");

    setEventDate("");
    setEventLocation("");
    setMessage("");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to submit booking request."
    );
  } finally {
    setIsBooking(false);
  }
};

  useEffect(() => {
    let isMounted = true;

    const fetchService = async () => {
      try {
        const { data: session, error: sessionError } =
          await authClient.getSession();

        if (sessionError || !session?.user) {
          router.replace("/sign-in");
          return;
        }

        const result = await apiFetch(
          `/api/services/details/${params.id}`
        );

        if (isMounted) {
          setService(result.service);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load service details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      isMounted = false;
    };
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />

        <h2 className="text-2xl font-bold text-gray-900">
          Unable to Load Service
        </h2>

        <p className="mt-2 text-gray-600">
          {error || "This service could not be found."}
        </p>

        <Link
          href="/services"
          className="mt-6 rounded-lg bg-rose-500 px-5 py-3 font-medium text-white transition hover:bg-rose-600"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-gray-600 transition hover:text-rose-500"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Service Images */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
              {service.images?.[0] ? (
                <Image
                  src={service.images[0]}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {service.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {service.images.slice(1).map((image) => (
                  <div
                    key={image}
                    className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                  >
                    <Image
                      src={image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 33vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Information */}
          <div>
            <span className="inline-block rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
              {service.title}
            </h1>

            <p className="mt-5 text-3xl font-bold text-rose-500">
              ${service.price.toLocaleString()}
            </p>

            <div className="mt-6 space-y-4 border-y border-gray-200 py-6">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="text-rose-500" size={20} />
                <span>{service.location}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <Tag className="text-rose-500" size={20} />
                <span>{service.category}</span>
              </div>
            </div>

            <h2 className="mt-7 text-xl font-semibold text-gray-900">
              About This Service
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
              {service.description}
            </p>

            {/* Vendor Information */}
            {service.vendor && (
              <div className="mt-8 rounded-2xl border border-gray-200 p-5">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Vendor Information
                </h2>

                <div className="flex items-center gap-4">
                  {service.vendor.image ? (
                    <Image
                      src={service.vendor.image}
                      alt={service.vendor.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                      <User size={25} />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {service.vendor.businessName ||
                        service.vendor.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {service.vendor.name}
                    </p>
                  </div>
                </div>

                {service.vendor.email && (
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={17} />
                    <span>{service.vendor.email}</span>
                  </div>
                )}
              </div>
            )}

            {/* Booking button will be implemented later */}

<div className="mt-8 rounded-2xl border border-gray-200 p-6">
  <div className="mb-6">
    <h2 className="text-xl font-bold text-gray-900">
      Request a Booking
    </h2>
    <p className="mt-2 text-sm text-gray-500">
      Share your event details with the vendor to request this service.
    </p>
  </div>

  <form onSubmit={handleBooking} className="space-y-5">
    {/* Event Date */}
    <div>
      <label
        htmlFor="eventDate"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Event Date
      </label>

      <div className="relative">
        <CalendarDays
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id="eventDate"
          type="date"
          min={today}
          value={eventDate}
          onChange={(event) => setEventDate(event.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
        />
      </div>
    </div>

    {/* Event Location */}
    <div>
      <label
        htmlFor="eventLocation"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Event Location
      </label>

      <div className="relative">
        <MapPin
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id="eventLocation"
          type="text"
          placeholder="Enter your event location"
          value={eventLocation}
          onChange={(event) => setEventLocation(event.target.value)}
          required
          maxLength={200}
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
        />
      </div>
    </div>

    {/* Additional Message */}
    <div>
      <label
        htmlFor="message"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Additional Message
        <span className="ml-1 font-normal text-gray-400">
          (Optional)
        </span>
      </label>

      <textarea
        id="message"
        rows={4}
        maxLength={1000}
        placeholder="Tell the vendor about your wedding plans..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isBooking}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isBooking ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Submitting Request...
        </>
      ) : (
        <>
          <Send size={18} />
          Submit Booking Request
        </>
      )}
    </button>
  </form>
</div>

          </div>
        </div>
      </div>
    </main>
  );
}
