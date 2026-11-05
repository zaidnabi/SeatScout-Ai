import Link from "next/link";
import { Bot } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
            <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-black text-white">S</div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">SeatScout</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        href="/chat"
                        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>AI Assistant</span>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}