
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  BriefcaseBusiness,
  CalendarCheck,
  Headset,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Everything you need to get started.",
    price: 0,
    period: "forever",
    features: [
      "Up to 3 active services",
      "Receive customer booking requests",
      "Basic vendor profile",
      "Standard listing visibility",
      "Basic booking management",
    ],
    unavailable: [
      "Premium vendor badge",
      "Priority service visibility",
      "Priority customer support",
    ],
    current: true,
  },
  {
    name: "Premium",
    description: "Grow your wedding business faster.",
    price: 29,
    period: "month",
    features: [
      "Unlimited active services",
      "Receive customer booking requests",
      "Premium vendor badge",
      "Priority service visibility",
      "Advanced booking management",
      "Priority customer support",
      "Enhanced vendor profile",
    ],
    unavailable: [],
    current: false,
  },
];

export default function VendorSubscriptionPage() {
  const [currentPlan] = useState<"Free" | "Premium">("Free");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      // TODO: Call your Express backend to create a Stripe Checkout session.
      // Example:
      // const response = await fetch(`${API_URL}/api/payments/create-checkout-session`, ...)
      // const data = await response.json();
      // window.location.href = data.url;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowConfirmation(true);
    } catch (error) {
      console.error("Unable to start checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">
          Vendor Dashboard
        </p>

        <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">
          Subscription Plans
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Choose a plan that helps your wedding business grow.
        </p>
      </div>

      {/* Current plan */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-secondary/70 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                CURRENT PLAN
              </span>

              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Active
              </span>
            </div>

            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground">
              {currentPlan} Plan
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;re currently using the WedPlan Free Plan.
            </p>
          </div>

          <div className="rounded-xl bg-secondary/60 p-5 sm:min-w-48">
            <p className="text-sm text-muted-foreground">
              Current subscription
            </p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              $0
              <span className="text-sm font-normal text-muted-foreground">
                {" "} / forever
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              No payment required
            </p>
          </div>
        </div>
      </div>

      {/* Plan heading */}
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Choose Your Perfect Plan
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start for free or unlock more opportunities with Premium.
        </p>
      </div>

      {/* Plans */}
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm sm:p-8 ${
                plan.name === "Premium"
                  ? "border-primary ring-1 ring-primary/20"
                  : "border-border"
              }`}
            >
              {plan.name === "Premium" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`rounded-xl p-3 ${
                    plan.name === "Premium"
                      ? "bg-secondary text-primary"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {plan.name === "Premium" ? (
                    <Crown size={24} />
                  ) : (
                    <BriefcaseBusiness size={24} />
                  )}
                </div>

                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mt-7 border-b border-border pb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {plan.period}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 py-6">
                <p className="text-sm font-semibold text-foreground">
                  What&apos;s included:
                </p>

                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}

                {plan.unavailable.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 opacity-50"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <X size={13} />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {isCurrent ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-muted-foreground"
                >
                  Your Current Plan
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Preparing Checkout...
                    </>
                  ) : (
                    <>
                      Upgrade to Premium
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Benefits */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Why Upgrade to Premium?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Give your wedding business more room to grow.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Zap,
              title: "More Visibility",
              description:
                "Give your services priority visibility to potential customers.",
            },
            {
              icon: BriefcaseBusiness,
              title: "Unlimited Services",
              description:
                "Create as many approved active service listings as you need.",
            },
            {
              icon: ShieldCheck,
              title: "Premium Badge",
              description:
                "Build trust with a distinctive Premium vendor badge.",
            },
            {
              icon: Headset,
              title: "Priority Support",
              description:
                "Get priority assistance when you need help.",
            },
          ].map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon size={23} />
                </div>

                <h3 className="mt-4 font-semibold text-foreground">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ / support */}
      <div className="rounded-xl border border-border bg-secondary/40 p-6 text-center">
        <Sparkles className="mx-auto text-primary" size={25} />

        <h3 className="mt-3 font-heading text-xl font-semibold text-foreground">
          Have questions about Premium?
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Our team is here to help you choose the right plan for your business.
        </p>

        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Contact Support
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Demo checkout message */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
              <Crown size={27} />
            </div>

            <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
              Checkout Integration Pending
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The Premium plan interface is ready. Stripe Checkout will be
              connected when we integrate your Express backend.
            </p>

            <button
              onClick={() => setShowConfirmation(false)}
              className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
