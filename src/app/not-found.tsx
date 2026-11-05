import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-slate-950">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800">
                <FileQuestion className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Page Not Found</h1>
            <p className="mt-2 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                The route or page you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/"
                className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
            </Link>
        </div>
    );
}
