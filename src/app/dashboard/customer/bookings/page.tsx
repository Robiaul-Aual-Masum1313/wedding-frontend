
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch } from "@/lib/api";

interface Vendor {
  name: string;
  email: string;
  image: string;
  businessName: string;
}

interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
  createdAt: string;
  vendor: Vendor | null;
}

interface BookingResponse {
  success: boolean;
  total: number;
  bookings: Booking[];
}

const statusStyles: Record<Booking["status"], string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        const result: BookingResponse = await apiFetch(
          "/api/bookings/my-bookings"
        );

        if (isMounted) {
          setBookings(result.bookings || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your bookings."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancel = async () => {
    if (!bookingToCancel || isCancelling) return;

    try {
      setIsCancelling(true);

      const result = await apiFetch(
        `/api/bookings/${bookingToCancel}/cancel`,
        {
          method: "PATCH",
        }
      );

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingToCancel
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );

      toast.success(result.message || "Booking cancelled successfully.");

      setBookingToCancel(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to cancel booking."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div>
          <p className="text-sm text-destructive">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Customer Dashboard
          </p>

          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
            My Bookings
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage and track your wedding service requests.
          </p>
        </div>

        {/* Booking List */}
        <div className="space-y-5">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-xl border border-border bg-card p-5 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-heading text-lg font-semibold text-foreground">
                        {booking.serviceTitle}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Vendor:{" "}
                      {booking.vendor?.businessName ||
                        booking.vendor?.name ||
                        "Vendor information unavailable"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-primary" />
                        {formatDate(booking.eventDate)}
                      </span>

                      <span className="flex items-center gap-2">
                        <MapPin className="size-4 text-primary" />
                        {booking.eventLocation}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                    {booking.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() => setBookingToCancel(booking._id)}
                        className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-white"
                      >
                        <XCircle className="size-4" />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
              <CalendarDays className="mx-auto size-12 text-muted-foreground" />

              <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
                No bookings yet
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Your wedding service booking requests will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !isCancelling && setBookingToCancel(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="cancel-booking-title"
              className="font-heading text-xl font-semibold text-foreground"
            >
              Cancel Booking?
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Are you sure you want to cancel this booking request? This action
              will change its status to Cancelled.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setBookingToCancel(null)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancel}
                className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
