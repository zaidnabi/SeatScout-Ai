
import { SeatResultCard } from "@/components/search/SeatResultCard";
import { SeatResult } from "@/hooks/useSearch";

export function SeatResultList({ seats }: { seats: SeatResult[] }) {
    return (
        <div className="space-y-4">
            {seats.map((seat) => (
                <SeatResultCard key={seat.id} seat={seat} />
            ))}
        </div>
    );
}