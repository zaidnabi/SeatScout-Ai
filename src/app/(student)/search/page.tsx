
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { SeatResultList } from "@/components/search/SeatResultList";
import { NoResult } from "@/components/search/NoResult";
import { Skeleton } from "@/components/ui/Skeleton";
import { Disclaimer } from "@/components/ui/Disclaimer";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const roll = searchParams.get("roll") || "";
    const { data, loading, error } = useSearch(roll);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Search</span>
                </Link>
            </div>

            {!roll ? (
                <div className="text-center space-y-6 py-12">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl purple-gradient-btn purple-glow text-white">
                        <Search className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white">Find Your Seat</h1>
                        <p className="text-xs text-slate-400">Enter your roll number to get instant results</p>
                    </div>
                    <div className="max-w-xl mx-auto">
                        <SearchBar />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <SearchBar initialValue={roll} />

                    {loading && (
                        <div className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-red-500/40 bg-red-950/20 p-4 text-xs font-semibold text-red-400">
                            {error}
                        </div>
                    )}

                    {!loading && !error && data && data.length > 0 && <SeatResultList seats={data} />}

                    {!loading && !error && data && data.length === 0 && <NoResult roll={roll} />}

                    <Disclaimer />
                </div>
            )}
        </div>
    );
}