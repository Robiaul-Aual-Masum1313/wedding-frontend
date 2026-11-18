
import Link from "next/link";
import { MapPin } from "lucide-react";
import Image from "next/image";

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Service Image */}
      <div className="overflow-hidden">
        <Image
          src={service.images?.[0] || "/placeholder.jpg"}
          alt={service.serviceName}
          width={400}
          height={300}
          className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Service Information */}
      <div className="space-y-4 p-5">
        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
          {service.category}
        </span>

        <h3 className="font-heading text-xl font-semibold text-foreground">
          {service.serviceName}
        </h3>

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 text-primary" />
          {service.location}
        </p>

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Starting from
            </p>
            <p className="text-lg font-semibold text-primary">
              ${service.price.toLocaleString()}
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
  );
};

export default ServiceCard;
