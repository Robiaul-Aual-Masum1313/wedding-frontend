
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
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

const sampleService = {
  serviceName: "Premium Wedding Photography",
  category: "Photography & Videography",
  description:
    "Capture every beautiful moment of your special day with our professional wedding photography team. We provide high-quality photographs, creative portraits, and complete event coverage.",
  price: "1200",
  location: "New York, USA",
  images: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
  ],
};

export default function EditServicePage() {
  const params = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    serviceName: sampleService.serviceName,
    category: sampleService.category,
    description: sampleService.description,
    price: sampleService.price,
    location: sampleService.location,
  });

  const [existingImages, setExistingImages] = useState<string[]>(
    sampleService.images
  );

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

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

    const remainingSlots =
      5 - existingImages.length - newImages.length;

    const selectedWithinLimit = selectedFiles.slice(0, remainingSlots);

    const validFiles = selectedWithinLimit.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 5 * 1024 * 1024
    );

    const previews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setNewImages((previous) => [...previous, ...validFiles]);
    setNewPreviews((previous) => [...previous, ...previews]);

    event.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);

    setNewImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );

    setNewPreviews((previous) =>
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

    if (existingImages.length + newImages.length === 0) {
      newErrors.images = "At least one service image is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Demo only: upload new images and update the service through your API later.
      const updatedService = {
        id: params.id,
        ...formData,
        price: Number(formData.price),
        existingImages,
        newImages: newImages.map((image) => image.name),
      };

      console.log("Updated service:", updatedService);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch {
      setErrors({
        submit: "Unable to update service. Please try again.",
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
            Service Updated!
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your service information has been updated successfully.
          </p>

          <Link
            href="/dashboard/vendor/services"
            className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Back to My Services
          </Link>
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
          Edit Service
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Update your service details and images.
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
              Update the information customers see about your service.
            </p>
          </div>

          <div>
            <label
              htmlFor="serviceName"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Service Name *
            </label>

            <input
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="Enter service name"
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
              Category *
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
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your service..."
              className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
            />

            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description}
              </p>
            )}
          </div>
        </section>

        <div className="border-t border-border" />

        {/* Price and location */}
        <section className="space-y-5">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Pricing & Location
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Starting Price ($) *
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="1"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
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
                Service Location *
              </label>

              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
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
              Keep existing images or add new ones. Maximum 5 images total.
            </p>
          </div>

          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {existingImages.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border"
                >
                  <Image
                    src={image}
                    alt={`Existing service image ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                    Existing
                  </span>

                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50"
                    aria-label="Remove existing image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {newPreviews.map((preview, index) => (
                <div
                  key={preview}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border"
                >
                  <Image
                    src={preview}
                    alt={`New service image ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <span className="absolute bottom-2 left-2 rounded-md bg-primary px-2 py-1 text-xs text-white">
                    New
                  </span>

                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50"
                    aria-label="Remove new image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {existingImages.length + newImages.length < 5 && (
            <label
              htmlFor="images"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-5 py-8 text-center transition hover:border-primary hover:bg-secondary/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                <ImagePlus size={24} />
              </div>

              <p className="mt-3 text-sm font-semibold text-foreground">
                Add more images
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG or WEBP. Maximum 5MB each.
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
          )}

          {errors.images && (
            <p className="text-xs text-red-500">{errors.images}</p>
          )}
        </section>

        {errors.submit && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.submit}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/vendor/services"
            className="rounded-lg border border-border px-6 py-3 text-center text-sm font-semibold text-foreground hover:bg-secondary"
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
                Updating...
              </>
            ) : (
              <>
                <Upload size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
