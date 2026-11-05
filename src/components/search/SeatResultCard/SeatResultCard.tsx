
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SeatResult } from "@/hooks/useSearch";

export function SeatResultCard({ seat }: { seat: SeatResult }) {
    return (
        <Card className="relative overflow-hidden border-2 border-indigo-100 dark:border-slate-800">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{seat.courseCode}</span>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{seat.courseTitle}</h2>
                </div>
                <Badge variant="info">{seat.session}</Badge>
            </div>

            <div className="my-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Room / Hall</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{seat.room}</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-3 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Row / Seat</span>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {seat.row} <span className="text-xs font-normal text-slate-500">({seat.seatNumber})</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                    {seat.date}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    {seat.startTime}
                </span>
            </div>
        </Card>
    );
}