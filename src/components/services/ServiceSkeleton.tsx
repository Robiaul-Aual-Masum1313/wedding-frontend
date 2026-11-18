
const ServiceSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-60 animate-pulse bg-muted" />

      <div className="space-y-4 p-5">
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-9 w-28 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default ServiceSkeleton;
