"use client";

import { Moon } from "lucide-react";

export function ThemeToggle() {
    return (
        <button
            aria-label="Theme fixed to dark"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#202030] bg-[#0c0c14] text-purple-400"
        >
            <Moon className="h-4 w-4" />
        </button>
    );
}
