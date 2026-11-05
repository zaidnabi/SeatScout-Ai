
import { Badge } from "@/components/ui/Badge";

export function LatestPlanInfo() {
    return (
        <div className="glass-card rounded-2xl p-4 border border-purple-500/20 flex items-center justify-between">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Badge variant="success">Live</Badge>
                    <span className="text-xs text-slate-400">Midterm Seating Plan</span>
                </div>
                <p className="text-xs font-bold text-white">Fall 2026 Active Plan</p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Updated Today</span>
        </div>
    );
}