import Link from "next/link";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-[#161624] bg-[#070709]/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl purple-gradient-btn purple-glow text-white">
                        <Bot className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">SeatScoutAI</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
                    <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="/chat" className="hover:text-white transition-colors">AI Assistant</Link>
                    <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                </nav>

                <div className="rounded-xl border border-[#222238] bg-[#0c0c14]/60 p-0.5 transition-all hover:border-purple-500/40 hover:bg-[#12121c]">
                    <Link href="/admin/login">
                        <Button variant="ghost" size="sm">Login</Button>
                    </Link>

                </div>
            </div>
        </header>
    );
}
