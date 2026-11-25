"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
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
import { toast } from "react-toastify";

import { uploadImage } from "@/lib/uploadImage";
import { authClient } from "@/lib/auth-client";

type AccountRole = "Customer" | "Vendor";

type FormData = {
  name: string;
  email: string;
  businessName: string;
  password: string;
  confirmPassword: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  businessName: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<AccountRole>("Customer");
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up temporary image preview URLs.
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Handle input changes.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Handle profile image selection.
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a PNG, JPG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  // Remove selected image.
  const removeImage = () => {
    setImageFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate form fields.
  const validateForm = (): string => {
    const { name, email, businessName, password, confirmPassword } = formData;

    if (!name.trim()) {
      return "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address.";
    }

    if (role === "Vendor" && !businessName.trim()) {
      return "Please enter your business name.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  // Handle email signup.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Upload profile image to ImgBB.
      let imageUrl: string | undefined;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Step 2: Create account using Better Auth.
      const { data, error: authError } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        ...(imageUrl ? { image: imageUrl } : {}),
        ...(role === "Vendor"
          ? { businessName: formData.businessName.trim() }
          : {}),
      });

      if (authError) {
        throw new Error(authError.message || "Registration failed.");
      }

      if (!data) {
        throw new Error("Account creation failed. Please try again.");
      }

      toast.success("Account created successfully!");

      // Step 3: Redirect using the role returned by Better Auth.
      const registeredRole =
        data.user.role === "Vendor" ? "vendor" : "customer";

      router.push(`/dashboard/${registeredRole}`);
    } catch (err) {
      console.error("Signup error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup.
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError("");

      if (role === "Vendor" && !formData.businessName.trim()) {
        throw new Error("Please enter your business name.");
      }

      const { error: authError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/redirect`,
        additionalData: {
          role,
          businessName: role === "Vendor" ? formData.businessName.trim() : "",
        },
      });

      if (authError) {
        throw new Error(authError.message || "Google sign-up failed.");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Google sign-up failed. Please try again.";

      setError(message);
      toast.error(message);
      setLoading(false);
    }
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
            priority
            unoptimized
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
              Discover trusted vendors, find beautiful venues, and bring your
              dream wedding to life with WedPlan.
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className="px-5 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-md">
            {/* Heading */}
            <div className="mb-8 text-center lg:text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary lg:hidden">
                <Heart size={24} />
              </div>

              <p className="text-sm font-semibold text-primary">JOIN WEDPLAN</p>

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
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  {/* Keep your existing four Google SVG paths here */}
                </svg>
              )}

              {loading ? "Connecting..." : "Continue with Google"}
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
                        unoptimized
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
                      onClick={removeImage}
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
                  accept="image/png,image/jpeg,image/webp"
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
                  autoComplete="name"
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
                  autoComplete="email"
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
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
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

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Terms */}
              <p className="text-xs leading-5 text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-primary hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Submit button */}
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

            {/* Sign in link */}
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
