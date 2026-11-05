"use client";

"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.querySelector("main")?.setAttribute("aria-hidden", "true");
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.querySelector("main")?.removeAttribute("aria-hidden");
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="w-full max-w-md rounded-2xl bg-[#101018] p-6 border border-[#25253b] purple-glow">
                <div className="flex items-center justify-between pb-3 border-b border-[#1f1f30]">
                    <h3 id="modal-title" className="text-base font-bold text-white">{title}</h3>
                    <button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="pt-4">{children}</div>
            </div>
        </div>
    );
}