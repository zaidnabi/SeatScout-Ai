import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-[#070709] text-white">
            <Navbar />
            <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-8 md:px-12 py-10">
                {children}
            </main>
            <Footer />
        </div>
    );
}