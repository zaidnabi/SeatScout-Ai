
"use client";

import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", error, label, id, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-purple-300">
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={`flex h-12 w-full rounded-xl border bg-[#0b0b12] px-4 text-sm font-medium text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${error ? "border-red-500 focus:ring-red-500" : "border-[#222235] hover:border-purple-500/40"
                        } ${className}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className="text-xs font-medium text-red-400" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";