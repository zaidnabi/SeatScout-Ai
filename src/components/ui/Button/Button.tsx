
"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
        const baseStyles =
            "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

        const variants = {
            primary: "purple-gradient-btn text-white shadow-lg shadow-purple-900/30",
            secondary: "bg-[#161622] text-white hover:bg-[#202030] border border-[#2b2b40]",
            outline: "border border-purple-500/40 text-purple-300 hover:bg-purple-500/10",
            ghost: "text-slate-300 hover:text-white hover:bg-white/5",
            danger: "bg-red-600/90 text-white hover:bg-red-600 border border-red-500/40",
        };

        const sizes = {
            sm: "h-9 px-3.5 text-xs min-h-[36px]",
            md: "h-11 px-5 text-sm min-h-[44px]",
            lg: "h-13 px-7 text-base min-h-[52px]",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";