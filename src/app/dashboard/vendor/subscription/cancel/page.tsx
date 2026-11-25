
import Link from "next/link";
import {
  XCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="size-11 text-red-600" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-600">
          Payment Cancelled
        </p>

        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          Your Payment Was Cancelled
        </h1>

        <p className="mb-8 leading-relaxed text-gray-600">
          No payment was completed, and your subscription
          has not been upgraded. You can return to your
          subscription page and try again whenever you&apos;re ready.
        </p>

        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          <RefreshCw className="size-5" />
          Try Again
        </Link>

        <Link
          href="/dashboard/vendor"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-primary"
        >
          Back to Dashboard
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
