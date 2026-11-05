"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearch, SeatResult } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { SeatResultList } from "@/components/search/SeatResultList";
import { ClashWarning } from "@/components/search/ClashWarning";
import { NoResult } from "@/components/search/NoResult";
import { Skeleton } from "@/components/ui/Skeleton";
import { Disclaimer } from "@/components/ui/Disclaimer";

function checkForClash(seats: SeatResult[]): boolean {
    if (seats.length < 2) return false;
    const set = new Set();
    for (const s of seats) {
        const key = `${s.date}-${s.session}`;
        if (set.has(key)) return true;
        set.add(key);
    }
    return false;
}

export default function StudentSearchPage() {
    const searchParams = useSearchParams();
    const roll = searchParams.get("roll") || "";
    const { data, loading, error } = useSearch(roll);

    const hasClash = data ? checkForClash(data) : false;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Search</span>
                </Link>
                <span className="text-xs text-slate-500 font-mono font-bold">{roll}</span>
            </div>

            <SearchBar initialValue={roll} />

            {loading && (
                <div className="space-y-4">
                    <Skeleton className="h-44 w-full" />
                    <Skeleton className="h-44 w-full" />
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                    {error}
                </div>
            )}

            {!loading && !error && data && data.length > 0 && (
                <div className="space-y-4">
                    {hasClash && <ClashWarning />}
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Exam Papers Found ({data.length})
                        </h2>
                    </div>
                    <SeatResultList seats={data} />
                </div>
            )}

            {!loading && !error && data && data.length === 0 && <NoResult roll={roll} />}

            <Disclaimer />
        </div>
    );
}
