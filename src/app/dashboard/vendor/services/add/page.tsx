
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  X,
  ImagePlus,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function AddServicePage() {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    const remainingSlots = 5 - images.length;
    const newFiles = selectedFiles.slice(0, remainingSlots);

    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith("image/")) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    });

    const newPreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((previous) => [...previous, ...validFiles]);
    setPreviews((previous) => [...previous, ...newPreviews]);

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );

    setPreviews((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Service name is required.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (formData.description.trim().length < 30) {
      newErrors.description =
        "Description must contain at least 30 characters.";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (images.length === 0) {
      newErrors.images = "Please upload at least one service image.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Demo only: replace this with ImgBB uploads and your backend API.
      const serviceData = {
        ...formData,
        price: Number(formData.price),
        images: images.map((image) => image.name),
        status: "Pending",
        isActive: false,
      };

      console.log("New service:", serviceData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch {
      setErrors({
        submit: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2 size={34} />
          </div>

          <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">
            Service Submitted!
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your service has been submitted for admin review. Once approved,
            customers will be able to discover it on WedPlan.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/dashboard/vendor/services"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Go to My Services
            </Link>

            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  serviceName: "",
                  category: "",
                  description: "",
                  price: "",
                  location: "",
                });
                previews.forEach((preview) =>
                  URL.revokeObjectURL(preview)
                );
                setImages([]);
                setPreviews([]);
                setErrors({});
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Add Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/vendor/services"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to My Services
        </Link>

        <p className="text-sm font-medium text-primary">
          Vendor Dashboard
        </p>

        <h1 className="mt-1 font-heading text-3xl font-bold text-foreground">
          Add New Service
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Share your wedding service with couples planning their special day.
        </p>
      </div>

      {/* Approval notice */}
      <div className="rounded-xl border border-primary/20 bg-secondary/60 p-4">
        <p className="text-sm leading-6 text-foreground">
          <strong>Before you submit:</strong> Every new service is reviewed by
          the WedPlan admin team. Your listing will remain pending until it is
          approved.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-7 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8"
      >
        {/* Basic information */}
        <section className="space-y-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Basic Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell customers what service you provide.
            </p>
          </div>

          <div>
            <label
              htmlFor="serviceName"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Service Name <span className="text-red-500">*</span>
            </label>

            <input
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="e.g. Premium Wedding Photography"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
            />

            {errors.serviceName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.serviceName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Service Category <span className="text-red-500">*</span>
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Service Description <span className="text-red-500">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service, experience, packages, and what makes it special..."
              className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
            />

            <div className="mt-1 flex justify-between gap-3">
              {errors.description ? (
                <p className="text-xs text-red-500">
                  {errors.description}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Minimum 30 characters.
                </p>
              )}

              <span className="text-xs text-muted-foreground">
                {formData.description.length} characters
              </span>
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Pricing and location */}
        <section className="space-y-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Pricing & Location
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Help customers understand your starting price and service area.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Starting Price ($) <span className="text-red-500">*</span>
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="1"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 1200"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />

              {errors.price && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Service Location <span className="text-red-500">*</span>
              </label>

              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, USA"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />

              {errors.location && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.location}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Images */}
        <section className="space-y-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Service Images
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload up to 5 high-quality images. Maximum 5MB per image.
            </p>
          </div>

          <label
            htmlFor="images"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-5 py-10 text-center transition hover:border-primary hover:bg-secondary/40"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
              <ImagePlus size={27} />
            </div>

            <p className="mt-4 text-sm font-semibold text-foreground">
              Click to upload images
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPG or WEBP (up to 5MB each)
            </p>

            <input
              id="images"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {errors.images && (
            <p className="text-xs text-red-500">{errors.images}</p>
          )}

          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {previews.map((preview, index) => (
                <div
                  key={preview}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border"
                >
                  <Image
                    src={preview}
                    alt={`Service preview ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />

                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                      Main image
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow transition hover:bg-red-50"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submit errors */}
        {errors.submit && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.submit}
          </p>
        )}

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/vendor/services"
            className="rounded-lg border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload size={17} />
                Submit for Approval
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
