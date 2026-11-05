import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
    const variants = {
        default: "bg-slate-800 text-slate-300 border border-slate-700",
        success: "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40",
        warning: "bg-amber-950/60 text-amber-400 border border-amber-500/40",
        danger: "bg-red-950/60 text-red-400 border border-red-500/40",
        info: "bg-purple-950/60 text-purple-300 border border-purple-500/40",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
