export function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-[#181826] ${className}`} />;
}
