
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NoResult({ roll }: { roll: string }) {
    return (
        <div className="glass-card rounded-3xl p-8 text-center space-y-4 border border-[#1f1f30]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#141420] text-slate-400">
                <SearchX className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Seat Found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No seating arrangement found for <strong className="text-white">{roll}</strong> in the live plan.
            </p>
            <Link href="/chat" className="inline-block pt-2">
                <Button variant="outline" size="sm">Ask AI Assistant</Button>
            </Link>
        </div>
    );
}