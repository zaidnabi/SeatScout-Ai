import { AlertTriangle } from "lucide-react";

export function Disclaimer() {
    return (
        <aside
            aria-label="Important Notice"
            className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200/90"
        >
            <div className="flex gap-3 items-start">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <p className="leading-relaxed">
                    <strong className="font-bold text-amber-300">Notice:</strong> SeatScout is an automated PDF parser. Always cross-check your final seat numbers with the physical notice boards outside exam halls.
                </p>
            </div>
        </aside>
    );
}
