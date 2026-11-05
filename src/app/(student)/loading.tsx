import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
}
