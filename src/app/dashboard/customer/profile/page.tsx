
"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Camera,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import Image from "next/image";

export default function CustomerProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    bio: "Planning our special day and looking for the perfect wedding services.",
  });

  const [image, setImage] = useState("/images/default-avatar.png");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setSuccess(false);
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage("/images/default-avatar.png");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!profile.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (profile.phone && !/^[+()\d\s-]{7,20}$/.test(profile.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    // Demo only: replace this with your profile update API.
    console.log("Customer profile:", {
      ...profile,
      imageFile,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-primary">Account Settings</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal information and keep your profile up to date.
        </p>
      </div>

      {/* Profile overview */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-secondary bg-secondary">
              <Image
                src={image}
                alt="Customer profile"
                width={400}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:bg-primary/90"
              aria-label="Upload profile photo"
            >
              <Camera size={17} />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-foreground">
              {profile.name || "Your Name"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.email}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              Customer Account
            </span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            Upload Photo
          </button>

          {imageFile && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <X size={15} />
              Remove
            </button>
          )}

          <p className="text-xs text-muted-foreground">
            JPG, PNG or WebP. Maximum size 5MB.
          </p>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-lg font-semibold text-foreground">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update the information associated with your account.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your registered email cannot be changed here.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Enter your location"
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                About Me
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={profile.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself..."
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        {/* Account information */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">
            Account Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Some account details are managed by the platform.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground">Account Type</p>
              <p className="mt-1 font-semibold text-foreground">Customer</p>
            </div>

            <div className="rounded-xl bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground">Account Status</p>
              <p className="mt-1 font-semibold text-green-700">Active</p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <X size={17} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 size={18} />
            Your profile has been updated successfully.
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
