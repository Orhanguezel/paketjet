import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <div className="space-y-3 mt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
      </div>
    </div>
  );
}
