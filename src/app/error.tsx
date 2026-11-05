
"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-[#070709] text-white">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/50 border border-red-500/30">
                <AlertOctagon className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong!</h2>
            <p className="mt-2 max-w-xs text-xs text-slate-400">
                An unexpected error occurred while loading this page.
            </p>
            <button
                onClick={reset}
                className="mt-6 flex items-center gap-2 rounded-xl purple-gradient-btn px-4 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
            >
                <RotateCcw className="h-4 w-4" />
                <span>Try Again</span>
            </button>
        </div>
    );
}