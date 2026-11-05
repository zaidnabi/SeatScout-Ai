import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function StudentChatPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Search</span>
                </Link>
            </div>

            <div className="text-center space-y-1">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Bot className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">SeatScout AI Assistant</h1>
                <p className="text-xs text-slate-500">Ask any schedule or seating questions in plain language.</p>
            </div>

            <Card className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Chat interface module ready for Phase 5 integration.
            </Card>
        </div>
    );
}
