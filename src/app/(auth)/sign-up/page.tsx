
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Eye,
  EyeOff,
  Heart,
  ImagePlus,
  Loader2,
  User,
  Store,
  X,
} from "lucide-react";
import Image from "next/image";

type AccountRole = "Customer" | "Vendor";

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<AccountRole>("Customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5MB.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (role === "Vendor" && !formData.businessName.trim()) {
      return "Please enter your business name.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!/[A-Z]/.test(formData.password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(formData.password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    // Demo only. Replace with Better Auth sign-up integration.
    const signupData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role,
      ...(role === "Vendor"
        ? { businessName: formData.businessName.trim() }
        : {}),
      imageFile,
    };

    console.log("Sign up data:", signupData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);

    // Temporary navigation for UI testing only.
    router.push("/sign-in");
  };

  const handleGoogleSignUp = () => {
    // Connect Better Auth Google sign-up here later.
    setError("Google sign-up integration is coming soon.");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-white shadow-xl lg:grid-cols-2">
        {/* Left visual section */}
        <div className="relative hidden min-h-[760px] lg:block">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85"
            alt="Beautiful wedding celebration"
            width={600}
            height={600}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

          <div className="absolute left-10 top-10 flex items-center gap-2 text-white">
            <Heart size={25} fill="currentColor" />
            <span className="font-heading text-2xl font-bold">WedPlan</span>
          </div>

          <div className="absolute bottom-12 left-10 right-10 text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Your journey starts here
            </p>
            <h2 className="font-heading text-4xl font-bold leading-tight">
              Every beautiful wedding begins with a perfect plan.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/85">
              Discover trusted vendors, find beautiful venues, and bring
              your dream wedding to life with WedPlan.
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className="px-5 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary lg:hidden">
                <Heart size={24} />
              </div>

              <p className="text-sm font-semibold text-primary">
                JOIN WEDPLAN
              </p>

              <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Start planning your perfect wedding today.
              </p>
            </div>

            {/* Google signup */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/50"
            >
              <svg
                viewBox="0 0 48 48"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.3 5.66c4.27-3.94 6.46-9.75 6.46-17.31Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.3-5.66c-2.02 1.35-4.6 2.15-8.6 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                OR REGISTER WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account role */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  I want to join as
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("Customer")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                      role === "Customer"
                        ? "border-primary bg-secondary text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <User size={17} />
                    Customer
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("Vendor")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                      role === "Vendor"
                        ? "border-primary bg-secondary text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Store size={17} />
                    Vendor
                  </button>
                </div>
              </div>

              {/* Profile image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Profile Photo{" "}
                  <span className="font-normal text-muted-foreground">
                    (Optional)
                  </span>
                </label>

                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Profile preview"
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={25} className="text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary"
                    >
                      <ImagePlus size={15} />
                      Choose Photo
                    </button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG or WebP. Max 5MB.
                    </p>
                  </div>

                  {preview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreview("");
                        setImageFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="text-muted-foreground hover:text-red-500"
                      aria-label="Remove profile photo"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  required
                />
              </div>

              {/* Business name */}
              {role === "Vendor" && (
                <div>
                  <label
                    htmlFor="businessName"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    required
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Minimum 6 characters, including one uppercase and one
                  lowercase letter.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Terms */}
              <p className="text-xs leading-5 text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="font-semibold text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
