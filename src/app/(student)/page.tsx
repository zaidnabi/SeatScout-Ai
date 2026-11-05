import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { LatestPlanInfo } from "@/components/search/LatestPlanInfo";
import { Disclaimer } from "@/components/ui/Disclaimer";

export default function StudentHomePage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                    Instant Seat Lookup
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    Enter your roll number to find your exam room and row in seconds.
                </p>
            </div>

            <SearchBar />

            <LatestPlanInfo />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between shadow-sm">
                <div>
                    <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">Confused about schedule?</h2>
                    <p className="text-[11px] text-slate-500">Ask SeatScout AI natural language questions.</p>
                </div>
                <Link
                    href="/chat"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <span>Chat AI</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <Disclaimer />
        </div>
    );
}