
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function LatestPlanInfo() {
    return (
        <Card variant="highlight" className="flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <Badge variant="success">Live Plan</Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Midterm Exams</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Fall 2026 Regular Exams
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Published</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Nov 02, 2026</p>
            </div>
        </Card>
    );
}