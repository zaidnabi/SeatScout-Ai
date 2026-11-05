
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "highlight";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
    const baseStyles = "rounded-2xl border p-5 shadow-sm transition-all";
    const variants = {
        default: "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
        highlight: "border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-950/20",
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </div>
    );
}