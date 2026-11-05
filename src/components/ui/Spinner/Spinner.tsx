
import { Loader2 } from "lucide-react";

export function Spinner({ className = "h-8 w-8 text-indigo-600" }: { className?: string }) {
    return (
        <div role="status" aria-label="Loading" className="flex items-center justify-center p-4">
            <Loader2 className={`animate-spin ${className}`} />
            <span className="sr-only">Loading...</span>
        </div>
    );
}