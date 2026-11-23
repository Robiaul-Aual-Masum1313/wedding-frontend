
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  MapPin,
  Flower2,
  Utensils,
  Sparkles,
  Shirt,
  Heart,
  ShieldCheck,
  CalendarCheck,
  Users,
  Search,
} from "lucide-react";
import Image from "next/image";

type FeaturedService = {
  _id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  images: string[];
  vendor: {
    name: string;
    image: string;
    businessName: string;
  } | null;
};

type FeaturedServicesResponse = {
  success: boolean;
  services: FeaturedService[];
};

const getFeaturedServices = async (): Promise<FeaturedService[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/featured`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured services");
    }

    const data: FeaturedServicesResponse = await response.json();

    return data.success ? data.services : [];
  } catch (error) {
    console.error("Featured services error:", error);
    return [];
  }
};

const categories = [
  { name: "Photography & Videography", icon: Camera },
  { name: "Wedding Venues", icon: MapPin },
  { name: "Decoration & Florist", icon: Flower2 },
  { name: "Catering Services", icon: Utensils },
  { name: "Makeup & Styling", icon: Sparkles },
  { name: "Wedding Fashion", icon: Shirt },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "Discover experienced wedding professionals and quality services for your special day.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description:
      "Explore services and send booking requests without complicated processes.",
  },
  {
    icon: Users,
    title: "Everything in One Place",
    description:
      "Find the services you need and manage your wedding planning in one convenient platform.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover Services",
    description:
      "Explore a variety of wedding services and find the perfect vendors for your needs.",
    icon: Search,
  },
  {
    number: "02",
    title: "Request a Booking",
    description:
      "Choose your preferred service and send a booking request with your event details.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Celebrate Your Day",
    description:
      "Connect with your chosen professionals and enjoy your beautiful wedding day.",
    icon: Heart,
  },
];

const HomePage = async () => {
  const featuredServices = await getFeaturedServices();
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Heart className="size-4 fill-primary" />
              Your journey to forever starts here
            </span>

            <h1 className="max-w-xl font-heading text-4xl leading-tight font-semibold text-foreground sm:text-5xl lg:text-6xl">
              Make Your Dream Wedding a{" "}
              <span className="text-primary">Beautiful Reality.</span>
            </h1>

            <p className="max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
              Discover trusted wedding professionals, explore beautiful
              services, and bring every detail of your special day together
              with WedPlan.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Explore Services
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/sign-up"
                className="rounded-md border border-primary px-6 py-3.5 font-medium text-primary transition hover:bg-primary/5"
              >
                Get Started
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Trusted Vendors
              </span>
              <span className="flex items-center gap-2">
                <Heart className="size-4 text-primary" />
                Stress-free Planning
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />

            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200"
              alt="Beautiful outdoor wedding celebration"
              width={1200}
              height={400}
              className="relative h-[380px] w-full rounded-2xl object-cover shadow-xl sm:h-[480px]"
            />

            <div className="absolute -bottom-5 left-4 rounded-xl border border-border bg-background p-4 shadow-lg sm:left-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Heart className="size-5 fill-primary text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Your Perfect Day
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Starts with the perfect plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Handpicked for you
            </p>
            <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              Featured Wedding Services
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Explore some of the best services to make your celebration
              unforgettable.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
          >
            View All Services
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
  {featuredServices.length > 0 ? (
    featuredServices.map((service) => (
      <article
        key={service._id}
        className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="relative overflow-hidden">
          <Image
            src={
              service.images?.[0] ||
              "https://placehold.co/800x350?text=Wedding+Service"
            }
            alt={service.title}
            width={800}
            height={350}
            className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground">
            {service.category}
          </span>
        </div>

        <div className="space-y-4 p-5">
          <h3 className="font-heading text-xl font-semibold text-foreground">
            {service.title}
          </h3>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            {service.location}
          </p>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Provided by
            </p>

            <p className="text-sm font-medium text-foreground">
              {service.vendor?.businessName ||
                service.vendor?.name ||
                "Wedding Professional"}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Starting from
              </p>

              <p className="text-lg font-semibold text-primary">
                ${Number(service.price).toLocaleString()}
              </p>
            </div>

            <Link
              href={`/services/${service._id}`}
              className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              View Details
            </Link>
          </div>
        </div>
      </article>
    ))
  ) : (
    <div className="col-span-full rounded-xl border border-border bg-card px-6 py-12 text-center">
      <Heart className="mx-auto mb-4 size-10 text-primary/50" />

      <h3 className="text-lg font-semibold text-foreground">
        No Featured Services Yet
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;re preparing some amazing wedding services for you.
        Please check back soon!
      </p>
    </div>
  )}
</div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Explore by category
            </p>
            <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              Everything Your Wedding Needs
            </h2>
            <p className="text-muted-foreground">
              Find the right professionals for every beautiful detail of your
              celebration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group flex min-h-40 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-background p-5 text-center transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
                >
                  <div className="rounded-full bg-secondary p-4 transition-colors group-hover:bg-primary">
                    <Icon className="size-7 text-primary group-hover:text-white" />
                  </div>

                  <h3 className="text-sm leading-6 font-medium text-foreground">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose WedPlan */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Why WedPlan?
            </p>

            <h2 className="font-heading text-3xl leading-tight font-semibold text-foreground sm:text-4xl">
              Planning Your Wedding Should Be as Beautiful as the Day Itself.
            </h2>

            <p className="leading-8 text-muted-foreground">
              We bring wedding services and professionals together in one
              convenient place. Spend less time searching and more time
              enjoying the excitement of your special journey.
            </p>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
            >
              Start Exploring
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className={`rounded-xl border border-border bg-card p-6 ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="mb-4 inline-flex rounded-lg bg-secondary p-3">
                    <Icon className="size-6 text-primary" />
                  </div>

                  <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                    {benefit.title}
                  </h3>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Simple and easy
            </p>
            <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              How WedPlan Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to bring your dream wedding closer.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-xl border border-border bg-background p-8 text-center"
                >
                  <span className="absolute right-5 top-5 font-heading text-3xl font-semibold text-primary/20">
                    {step.number}
                  </span>

                  <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-secondary">
                    <Icon className="size-7 text-primary" />
                  </div>

                  <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-primary px-6 py-14 text-center sm:px-12">
          <Heart className="mx-auto mb-5 size-10 fill-white text-white" />

          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold text-white sm:text-4xl">
            Ready to Plan Your Dream Wedding?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-white/85">
            Your perfect day deserves the perfect team. Start discovering
            trusted wedding professionals today.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 font-medium text-primary transition hover:bg-white/90"
          >
            Explore Services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
