
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-[#070709] text-white">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glass-card border border-purple-500/30 purple-glow">
                <FileQuestion className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">404 - Page Not Found</h1>
            <p className="mt-2 max-w-sm text-xs text-slate-400">
                The exam page or seating route you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl purple-gradient-btn px-5 py-3 text-xs font-bold text-white shadow-lg active:scale-95 transition-all"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
            </Link>
        </div>
    );
}