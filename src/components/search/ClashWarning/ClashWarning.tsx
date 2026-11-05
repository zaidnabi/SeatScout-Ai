import { AlertCircle } from "lucide-react";

export function ClashWarning() {
    return (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/20 p-4 flex gap-3 text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div>
                <h4 className="text-xs font-bold text-red-300">Exam Clash Detected</h4>
                <p className="text-[11px] text-red-300/80">
                    You have two papers scheduled simultaneously. Please visit the exam office immediately.
                </p>
            </div>
        </div>
    );
}
