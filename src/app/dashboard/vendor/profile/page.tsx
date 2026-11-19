
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import {
  Camera,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Save,
  Store,
  UserRound,
} from "lucide-react";

export default function VendorProfilePage() {
  const [formData, setFormData] = useState({
    name: "Alex Morgan",
    email: "alex@example.com",
    businessName: "Elegant Moments",
    phone: "+1 234 567 890",
    location: "New York, USA",
    website: "https://elegantmoments.com",
    bio: "We help couples create beautiful and unforgettable wedding experiences.",
  });

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop"
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setSuccess(false);
    setError("");
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

    setImageFile(file);
    setProfileImage(URL.createObjectURL(file));
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !formData.name.trim() ||
      !formData.businessName.trim() ||
      !formData.phone.trim() ||
      !formData.location.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // TODO: Upload image to ImgBB and save profile
      // through your authenticated backend API.

      console.log("Profile data:", formData);
      console.log("Selected image:", imageFile);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page heading */}
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          Account Management
        </p>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal information and business profile.
        </p>
      </div>

      {/* Profile image */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="relative">
            <Image
              src={profileImage}
              alt="Profile image"
              width={112}
              height={112}
              unoptimized
              className="h-28 w-28 rounded-full border-4 border-secondary object-cover"
            />

            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:bg-primary/90"
            >
              <Camera size={17} />
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold text-foreground">
              Profile Photo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a professional photo for your vendor profile.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              JPG, PNG or WebP. Maximum size 5MB.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal information */}
        <section className="rounded-2xl border border-border bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <UserRound size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Personal Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Your basic account details.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  value={formData.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-muted pr-11`}
                />
                <LockKeyhole
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Email is managed by your authentication account.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        {/* Business information */}
        <section className="rounded-2xl border border-border bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <Store size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Business Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell customers about your wedding business.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your business name"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Website
              </label>
              <input
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Business Description
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                placeholder="Describe your business and services..."
                className={`${inputClass} resize-none`}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>
        </section>

        {/* Account information */}
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="mb-5 font-semibold text-foreground">
            Account Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-muted p-4">
              <p className="text-sm text-muted-foreground">Account Role</p>
              <p className="mt-2 font-semibold text-foreground">Vendor</p>
            </div>

            <div className="rounded-xl bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Subscription Plan
              </p>
              <p className="mt-2 font-semibold text-foreground">Free Plan</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Your account role and subscription plan cannot be changed from
            profile settings.
          </p>
        </section>

        {/* Feedback */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 size={18} />
            Profile updated successfully! (Demo only)
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
