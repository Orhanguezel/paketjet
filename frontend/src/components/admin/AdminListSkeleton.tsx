import { SkeletonCard } from "@/components/ui/Skeleton";

interface Props {
  count?: number;
  lines?: number;
}

export function AdminListSkeleton({ count = 5, lines = 2 }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}
