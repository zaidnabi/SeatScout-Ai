import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2 text-center">
                <Skeleton className="mx-auto h-8 w-48" />
                <Skeleton className="mx-auto h-4 w-64" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>

            {/* Latest Plan Info Skeleton */}
            <Skeleton className="h-20 w-full" />

            {/* Chat AI Banner Skeleton */}
            <Skeleton className="h-16 w-full" />

            {/* Disclaimer Skeleton */}
            <Skeleton className="h-16 w-full" />
        </div>
    );
}