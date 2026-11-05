"use client";

"use client";

import { useState, useEffect } from "react";

export interface SeatResult {
    id: string;
    rollNumber: string;
    courseCode: string;
    courseTitle: string;
    room: string;
    row: string;
    column: string;
    seatNumber: string;
    date: string;
    session: string;
    totalRoomRows?: number;
    totalRoomCols?: number;
}

export function useSearch(rollNumber: string) {
    const [data, setData] = useState<SeatResult[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!rollNumber) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                await new Promise((res) => setTimeout(res, 400));
                if (!isMounted) return;

                // Mock data matching the design screenshot (F25601037 in Room AC-201)
                if (rollNumber.toUpperCase() === "F25601037" || rollNumber.toUpperCase() === "21-CS-100") {
                    setData([
                        {
                            id: "1",
                            rollNumber: rollNumber.toUpperCase(),
                            courseCode: "CE1114",
                            courseTitle: "Computer Engineering Fundamentals",
                            room: "AC-201",
                            row: "Row 3",
                            column: "Col 2",
                            seatNumber: "A-01",
                            date: "Nov 06, 2026",
                            session: "Morning",
                            totalRoomRows: 6,
                            totalRoomCols: 7,
                        },
                    ]);
                } else {
                    setData([]);
                }
            } catch (err) {
                if (isMounted) setError("Failed to fetch seat details.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [rollNumber]);

    return { data, loading, error };
}