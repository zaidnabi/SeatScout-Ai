
import { SeatResult } from "@/hooks/useSearch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function SeatResultCard({ seat }: { seat: SeatResult }) {
    const rows = seat.totalRoomRows || 6;
    const cols = seat.totalRoomCols || 7;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Badge variant="success">✓ Seat Found</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Text Seat Details */}
                <div className="lg:col-span-6 glass-card rounded-3xl p-6 border border-purple-500/20 space-y-6">
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">SEAT DETAILS</span>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <span className="text-xs text-slate-500 block">Roll Number</span>
                            <span className="text-xl font-black text-purple-400">{seat.rollNumber}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">Room</span>
                            <span className="text-xl font-black text-white">{seat.room}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">Session</span>
                            <span className="text-base font-extrabold text-white">{seat.session}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">Subject</span>
                            <span className="text-base font-extrabold text-white">{seat.courseCode}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">Row</span>
                            <span className="text-base font-extrabold text-white">{seat.row}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">Column</span>
                            <span className="text-base font-extrabold text-white">{seat.column}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visual Seat Grid Map */}
                <div className="lg:col-span-6 glass-card rounded-3xl p-6 border border-purple-500/20 space-y-4 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                            ROOM {seat.room} — SEAT MAP
                        </span>

                        {/* Podium Indicator */}
                        <div className="my-3 rounded-lg bg-[#161625] border border-[#232338] py-1 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            PODIUM
                        </div>

                        {/* Grid Matrix */}
                        <div className="grid gap-1.5 pt-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                            {Array.from({ length: rows * cols }).map((_, idx) => {
                                const isUserSeat = idx === 0; // Row 1, Col 1
                                return (
                                    <div
                                        key={idx}
                                        className={`h-7 rounded-lg transition-all ${isUserSeat
                                                ? "bg-purple-500 purple-glow border border-purple-300"
                                                : "bg-[#141420] border border-[#202032]"
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                        <span className="h-3 w-3 rounded-sm bg-purple-500" />
                        <span>Your Seat ({seat.row}, {seat.column})</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/search" className="flex-1">
                    <Button variant="secondary" className="w-full">Search Another</Button>
                </Link>
                <Link href="/chat" className="flex-1">
                    <Button className="w-full">Ask AI Assistant</Button>
                </Link>
            </div>
        </div>
    );
}