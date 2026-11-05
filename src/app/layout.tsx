import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SeatScoutAI - Instant Exam Seat Finder",
    description: "Find your exam room and seat allocation instantly with AI.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-[#070709] text-white antialiased">
                {children}
            </body>
        </html>
    );
}