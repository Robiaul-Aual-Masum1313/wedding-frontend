
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  BriefcaseBusiness,
  Headset,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";

type Subscription = {
  plan: "Free" | "Premium";
  expiresAt: string | null;
  isPremium: boolean;
};

type SubscriptionResponse = {
  success: boolean;
  subscription: Subscription;
};

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
  },
  {
    name: "Premium",
    description: "Grow your wedding business faster.",
    price: 9.99,
    period: "year",
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
  },
];

export default function VendorSubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch the vendor's actual subscription from the backend.
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response: SubscriptionResponse = await apiFetch(
          "/api/vendor/subscription"
        );

        setSubscription(response.subscription);
      } catch (error) {
        console.error("Fetch subscription error:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load subscription information."
        );
      } finally {
        setIsSubscriptionLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Start Stripe Checkout.
  const handleUpgrade = async () => {
    if (!subscription || subscription.isPremium) return;

    setLoading(true);

    try {
      const response = await apiFetch(
        "/api/vendor/subscription/checkout",
        {
          method: "POST",
        }
      );

      if (!response?.url) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      // Redirect the vendor to Stripe Checkout.
      window.location.href = response.url;
    } catch (error) {
      console.error("Unable to start checkout:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again."
      );

      setLoading(false);
    }
  };

  const currentPlan = subscription?.plan;

  const formattedExpiryDate = subscription?.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">Vendor Dashboard</p>

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

              {!isSubscriptionLoading && subscription && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active
                </span>
              )}
            </div>

            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground">
              {isSubscriptionLoading
                ? "Loading..."
                : subscription
                  ? `${subscription.plan} Plan`
                  : "Unable to load plan"}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {isSubscriptionLoading
                ? "Checking your subscription information..."
                : subscription?.isPremium
                  ? "You're currently enjoying WedPlan Premium benefits."
                  : subscription
                    ? "You're currently using the WedPlan Free Plan."
                    : "Please refresh the page to try again."}
            </p>

            {subscription?.isPremium && formattedExpiryDate && (
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Expires on: {formattedExpiryDate}
              </p>
            )}
          </div>

          <div className="rounded-xl bg-secondary/60 p-5 sm:min-w-48">
            <p className="text-sm text-muted-foreground">
              Current subscription
            </p>

            <p className="mt-1 text-3xl font-bold text-foreground">
              {isSubscriptionLoading
                ? "..."
                : subscription?.isPremium
                  ? "$9.99"
                  : subscription
                    ? "$0"
                    : "--"}

              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {subscription?.isPremium ? "year" : "forever"}
              </span>
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              {subscription?.isPremium
                ? "Premium subscription"
                : subscription
                  ? "No payment required"
                  : "Subscription unavailable"}
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
                    ${plan.price.toFixed(2)}
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

              {/* Plan action */}
              {isSubscriptionLoading ? (
                <button
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-muted-foreground"
                >
                  <Loader2 size={17} className="animate-spin" />
                  Loading Plan...
                </button>
              ) : !subscription ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-muted-foreground"
                >
                  Subscription Unavailable
                </button>
              ) : isCurrent ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-muted-foreground"
                >
                  Your Current Plan
                </button>
              ) : plan.name === "Free" && subscription.isPremium ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-muted-foreground"
                >
                  Included in Premium
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
              description: "Get priority assistance when you need help.",
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
    </div>
  );
}
