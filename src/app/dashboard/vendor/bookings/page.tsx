"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  CalendarDays,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  MessageSquare,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";

type BookingStatus = "Pending" | "Accepted" | "Rejected" | "Cancelled";

interface Booking {
  _id: string;
  serviceName: string;
  serviceImage: string;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
}

interface VendorBookingResponse {
  _id: string;
  serviceTitle: string;
  serviceImage: string;
  customer: {
    name?: string;
    email?: string;
  } | null;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
}

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Accepted: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
};

const statusIcons = {
  Pending: Clock,
  Accepted: CheckCircle2,
  Rejected: XCircle,
  Cancelled: XCircle,
};

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [confirmation, setConfirmation] = useState<{
    bookingId: string;
    action: "Accepted" | "Rejected";
  } | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchVendorBookings = async () => {
      try {
        const result = await apiFetch("/api/bookings/vendor-requests");

        if (ignore) return;

        const formattedBookings: Booking[] = (
          result.bookings as VendorBookingResponse[]
        ).map((booking) => ({
          _id: booking._id,
          serviceName: booking.serviceTitle,
          serviceImage: booking.serviceImage || "",
          customerName: booking.customer?.name || "Unknown Customer",
          customerEmail: booking.customer?.email || "No email available",
          eventDate: booking.eventDate,
          eventLocation: booking.eventLocation,
          message: booking.message || "",
          status: booking.status,
          createdAt: booking.createdAt,
        }));

        setBookings(formattedBookings);
      } catch (error) {
        if (ignore) return;

        setFeedback(
          error instanceof Error
            ? error.message
            : "Unable to load booking requests.",
        );
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchVendorBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "Accepted",
  ).length;

  const rejectedCount = bookings.filter(
    (booking) => booking.status === "Rejected",
  ).length;

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        activeFilter === "All" || booking.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, activeFilter]);


const updateBookingStatus = async () => {
  if (!confirmation || isUpdating) return;

  const { bookingId, action } = confirmation;

  setIsUpdating(true);

  try {
    const endpoint =
      action === "Accepted" ? "accept" : "reject";

    await apiFetch(`/api/bookings/${bookingId}/${endpoint}`, {
      method: "PATCH",
    });

    setBookings((previous) =>
      previous.map((booking) =>
        booking._id === bookingId
          ? { ...booking, status: action }
          : booking
      )
    );

    setConfirmation(null);
    setSelectedBooking(null);

    setFeedback(
      `Booking request ${action.toLowerCase()} successfully.`
    );
  } catch (error) {
    setFeedback(
      error instanceof Error
        ? error.message
        : `Unable to ${action.toLowerCase()} booking request.`
    );
  } finally {
    setIsUpdating(false);
  }
};


  const formatDate = (date: string) => {
    const dateOnly = date.split("T")[0];

    return new Date(`${dateOnly}T00:00:00`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = [
    {
      title: "Total Requests",
      value: bookings.length,
      icon: BriefcaseBusiness,
      color: "bg-secondary text-primary",
    },
    {
      title: "Pending Requests",
      value: pendingCount,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Accepted",
      value: acceptedCount,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">Vendor Dashboard</p>

        <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">
          Booking Requests
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Review customer booking requests and manage your event schedule.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground">
          <p>{feedback}</p>
          <button onClick={() => setFeedback("")} aria-label="Dismiss message">
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
              placeholder="Search customer or service..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "Accepted", "Rejected", "Cancelled"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeFilter === filter
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                  {filter === "Pending" && pendingCount > 0 && (
                    <span className="ml-1.5">({pendingCount})</span>
                  )}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Booking list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Customer Requests
          </h2>

          <span className="text-sm text-muted-foreground">
            {filteredBookings.length} request(s)
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-border bg-white px-5 py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

            <p className="mt-4 text-sm text-muted-foreground">
              Loading booking requests...
            </p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status];

              return (
                <div
                  key={booking._id}
                  className="rounded-xl border border-border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* Service image */}
                    <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-36 sm:w-44">
                      <Image
                        src={booking.serviceImage}
                        alt={booking.serviceName}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="176px"
                      />
                    </div>

                    {/* Booking details */}
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                        >
                          <StatusIcon size={13} />
                          {booking.status}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          Requested {booking.createdAt}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {booking.serviceName}
                        </h3>

                        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <UserRound size={15} />
                          {booking.customerName}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-5">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {formatDate(booking.eventDate)}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin size={15} />
                          {booking.eventLocation}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                      >
                        <Eye size={16} />
                        View Details
                      </button>

                      {booking.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              setConfirmation({
                                bookingId: booking._id,
                                action: "Accepted",
                              })
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            <CheckCircle2 size={16} />
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              setConfirmation({
                                bookingId: booking._id,
                                action: "Rejected",
                              })
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </>
                      )}
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
              No booking requests found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try another filter or wait for new customer requests.
            </p>

            <Link
              href="/dashboard/vendor/services"
              className="mt-5 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Manage Services
            </Link>
          </div>
        )}
      </div>

      {/* Booking details modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">
                  Booking Details
                </p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-foreground">
                  {selectedBooking.customerName}
                </h2>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Close booking details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative mt-5 h-48 overflow-hidden rounded-xl">
              <Image
                src={selectedBooking.serviceImage}
                alt={selectedBooking.serviceName}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Requested service
                </p>
                <p className="mt-1 font-semibold text-foreground">
                  {selectedBooking.serviceName}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Customer email
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-foreground">
                    {selectedBooking.customerEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Event date</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(selectedBooking.eventDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Event location
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {selectedBooking.eventLocation}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Request status
                  </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedBooking.status]}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/60 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MessageSquare size={16} />
                  Customer Message
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {selectedBooking.message}
                </p>
              </div>
            </div>

            {selectedBooking.status === "Pending" && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    setConfirmation({
                      bookingId: selectedBooking._id,
                      action: "Accepted",
                    })
                  }
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Accept Request
                </button>

                <button
                  onClick={() =>
                    setConfirmation({
                      bookingId: selectedBooking._id,
                      action: "Rejected",
                    })
                  }
                  className="flex-1 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Reject Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accept / Reject confirmation modal */}
      {confirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                confirmation.action === "Accepted"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {confirmation.action === "Accepted" ? (
                <CheckCircle2 size={27} />
              ) : (
                <XCircle size={27} />
              )}
            </div>

            <h3 className="mt-4 text-center font-heading text-xl font-semibold text-foreground">
              {confirmation.action === "Accepted"
                ? "Accept this booking?"
                : "Reject this booking?"}
            </h3>

            <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
              {confirmation.action === "Accepted"
                ? "The customer request will be marked as accepted."
                : "The customer request will be marked as rejected."}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmation(null)}
                disabled={isUpdating}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={updateBookingStatus}
                disabled={isUpdating}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmation.action === "Accepted"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isUpdating ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
