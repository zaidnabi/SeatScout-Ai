"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const ROLL_REGEX = /^[0-9]{2,4}-[A-Z]{2,6}-[0-9]{2,5}$/;

export function SearchBar({ initialValue = "" }: { initialValue?: string }) {
    const [value, setValue] = useState(initialValue);
    const [formatError, setFormatError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uppercaseVal = e.target.value.toUpperCase();
        setValue(uppercaseVal);

        if (uppercaseVal.length > 3 && !ROLL_REGEX.test(uppercaseVal)) {
            setFormatError("Format should match YY-DEPT-ID (e.g. 21-CS-100)");
        } else {
            setFormatError("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanValue = value.trim();
        if (!cleanValue) {
            setFormatError("Please enter a roll number");
            return;
        }
        if (!ROLL_REGEX.test(cleanValue)) {
            setFormatError("Format should match YY-DEPT-ID (e.g. 21-CS-100)");
            return;
        }
        setFormatError("");
        router.push(`/search?roll=${encodeURIComponent(cleanValue)}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-3">
            <Input
                type="text"
                label="Student Roll Number"
                placeholder="e.g. 21-CS-100"
                value={value}
                onChange={handleChange}
                error={formatError}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                className="text-lg font-bold tracking-wider uppercase h-14"
            />
            <Button type="submit" size="lg" className="w-full text-base font-bold shadow-indigo-500/20 shadow-lg flex items-center gap-2">
                <Search className="h-5 w-5" />
                <span>Find My Seat</span>
            </Button>
        </form>
    );
}