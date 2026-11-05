import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "highlight";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
    const baseStyles = "rounded-2xl border p-6 transition-all";
    const variants = {
        default: "glass-card border-[#1f1f30]",
        highlight: "glass-card border-purple-500/30 purple-glow",
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </div>
    );
}
