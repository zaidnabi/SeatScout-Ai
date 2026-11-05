"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SearchBar({ initialValue = "" }: { initialValue?: string }) {
    const [value, setValue] = useState(initialValue);
    const [formatError, setFormatError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uppercaseVal = e.target.value.toUpperCase();
        setValue(uppercaseVal);
        if (formatError) setFormatError("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanValue = value.trim();
        if (!cleanValue) {
            setFormatError("Please enter your roll number");
            return;
        }
        router.push(`/search?roll=${encodeURIComponent(cleanValue)}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="relative flex items-center rounded-2xl border border-[#222238] bg-[#0c0c14] p-2 focus-within:border-purple-500 purple-glow">
                <Search className="ml-3 h-5 w-5 text-slate-500 shrink-0" />
                <input
                    type="text"
                    placeholder="Roll Number (e.g. F23607022)"
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                    autoCapitalize="characters"
                    className="w-full bg-transparent px-3 py-2 text-base font-semibold uppercase tracking-wider text-white placeholder-slate-500 focus:outline-none"
                />
                <Button type="submit" size="md" className="shrink-0 flex items-center gap-1.5 px-6">
                    <span>Search</span>
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
            {formatError && <p className="text-xs text-red-400 pl-2">{formatError}</p>}
        </form>
    );
}
