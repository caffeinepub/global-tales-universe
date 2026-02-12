import { Skeleton } from './ui/skeleton';

export default function StoryCardSkeleton() {
  return (
    <div className="flex gap-4 bg-card rounded-lg p-4 border shadow-sm">
      <Skeleton className="w-24 h-32 shrink-0 rounded-md" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
