"use client";

import { useState, useEffect } from "react";

export interface SeatResult {
    id: string;
    courseCode: string;
    courseTitle: string;
    room: string;
    row: string;
    seatNumber: string;
    date: string;
    session: string;
    startTime: string;
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
                const res = await fetch(`/api/search?roll=${encodeURIComponent(rollNumber)}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch seating arrangements");
                }
                const json = await res.json();
                if (isMounted) setData(json.data || []);
            } catch (err: unknown) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Something went wrong.");
                }
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