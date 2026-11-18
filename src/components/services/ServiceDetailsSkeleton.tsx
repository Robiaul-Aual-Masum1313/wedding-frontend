
const ServiceDetailsSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="h-[420px] rounded-xl bg-muted" />

        <div className="space-y-5">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="h-10 w-3/4 rounded bg-muted" />
          <div className="h-5 w-1/2 rounded bg-muted" />
          <div className="h-24 rounded bg-muted" />
          <div className="h-12 w-40 rounded bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsSkeleton;
