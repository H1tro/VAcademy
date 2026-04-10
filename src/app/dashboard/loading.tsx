
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-12 w-[350px]" />
          <Skeleton className="h-6 w-[250px]" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
        <Skeleton className="h-[400px] rounded-3xl" />
      </div>
    </div>
  )
}
