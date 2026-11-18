
"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays, Loader2, MapPin, MessageSquare } from "lucide-react";

interface BookingRequestFormProps {
  serviceId: string;
  serviceName: string;
  onClose: () => void;
}

const BookingRequestForm = ({
  serviceId,
  serviceName,
  onClose,
}: BookingRequestFormProps) => {
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!eventDate || !eventLocation.trim() || !message.trim()) {
      setError("Please complete all fields.");
      return;
    }

    if (eventDate < today) {
      setError("Event date cannot be in the past.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Temporary frontend demonstration.
      // We will replace this with the actual Express API request.
      const bookingData = {
        serviceId,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim(),
      };

      console.log("Booking request:", bookingData);

      alert("Booking form is ready! API integration is coming next.");
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="eventDate"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Event Date
        </label>

        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="eventDate"
            type="date"
            min={today}
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
            required
            className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="eventLocation"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Event Location
        </label>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="eventLocation"
            type="text"
            placeholder="Enter your event location"
            value={eventLocation}
            onChange={(event) => setEventLocation(event.target.value)}
            required
            maxLength={200}
            className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Additional Message
        </label>

        <div className="relative">
          <MessageSquare className="absolute left-3 top-4 size-4 text-muted-foreground" />
          <textarea
            id="message"
            rows={4}
            placeholder="Tell the vendor about your wedding requirements..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            maxLength={1000}
            className="w-full resize-none rounded-md border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <p className="mt-1 text-right text-xs text-muted-foreground">
          {message.length}/1000
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Send Request"}
        </button>
      </div>
    </form>
  );
};

export default BookingRequestForm;
