export default function PerformanceLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="flex gap-3">
        <div className="h-10 w-[250px] animate-pulse rounded bg-muted" />
        <div className="h-10 w-[250px] animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[300px] animate-pulse rounded-lg bg-muted" />
        <div className="h-[300px] animate-pulse rounded-lg bg-muted" />
        <div className="h-[300px] animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  )
}
