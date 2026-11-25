
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  CreditCard,
} from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="size-11 text-green-600" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-600">
          Payment Successful
        </p>

        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome to WedPlan Premium!
        </h1>

        <p className="mb-8 leading-relaxed text-gray-600">
          Thank you for upgrading your account. Your payment
          was submitted successfully. We&apos;re confirming your
          subscription and updating your account.
        </p>

        <div className="mb-8 rounded-xl bg-gray-50 p-5 text-left">
          <div className="flex items-center gap-3">
            <CreditCard className="size-6 text-green-600" />

            <div>
              <p className="font-semibold text-gray-900">
                Premium Subscription
              </p>
              <p className="text-sm text-gray-500">
                $9.99 / year
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          View My Subscription
          <ArrowRight className="size-5" />
        </Link>

        <p className="mt-5 text-sm text-gray-500">
          Thank you for choosing WedPlan!
        </p>
      </div>
    </div>
  );
}
