
import { AlertTriangle } from "lucide-react";

export function Disclaimer() {
    return (
        <aside
            aria-label="Important Notice"
            className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200"
        >
            <div className="flex gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed">
                    <strong className="font-semibold">Notice:</strong> SeatScout is an automated reader. Always verify your seat details with the officially posted physical notice boards prior to entry.
                </p>
            </div>
        </aside>
    );
}