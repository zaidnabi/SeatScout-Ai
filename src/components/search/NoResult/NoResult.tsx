import Link from "next/link";
import { SearchX } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function NoResult({ roll }: { roll: string }) {
    return (
        <Card className="text-center py-8">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <SearchX className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No Seating Info Found</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 px-4">
                No record found for roll number <strong className="text-slate-800 dark:text-slate-200">{roll}</strong> in the currently published exam plan.
            </p>
            <div className="mt-5 flex flex-col gap-2">
                <p className="text-xs text-slate-500">Need assistance?</p>
                <Link href="/chat">
                    <Button variant="outline" size="sm" className="w-full">
                        Ask AI Assistant
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
