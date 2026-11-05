
"use client";

import { X } from "lucide-react";

export function Toast({ message, type = "info", onClose }: { message: string; type?: "info" | "error" | "success"; onClose: () => void }) {
    const bg = type === "error" ? "bg-red-600" : type === "success" ? "bg-emerald-600" : "bg-slate-900 dark:bg-slate-100";
    const textColor = type === "error" || type === "success" ? "text-white" : "text-white dark:text-slate-900";

    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl ${bg} ${textColor}`}
        >
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} aria-label="Close toast" className="rounded p-1 hover:opacity-80">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}