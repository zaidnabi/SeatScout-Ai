import { Bot } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-[#141420] py-10 text-xs text-slate-500">
            <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md purple-gradient-btn flex items-center justify-center text-white">
                        <Bot className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-bold text-white">SeatScoutAI</span>
                </div>
                <p>Built for Students • Powered by AI</p>
            </div>
        </footer>
    );
}
