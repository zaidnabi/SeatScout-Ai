import Link from "next/link";
import { Search, Sparkles, Bot, FileText, Database, ArrowRight, Zap, RefreshCw, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function StudentHomePage() {
    return (
        <div className="space-y-24 pb-12">
            {/* 1. HERO SECTION */}
            <section className="pt-8 md:pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300">
                            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                            <span>AI-Powered Exam Seating Assistant</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                            Find Your Exam <br />
                            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">
                                Seat In Seconds
                            </span>
                        </h1>

                        <p className="text-slate-400 text-base max-w-xl">
                            Stop scrolling through 15-page seating PDFs. Search instantly using your roll number or ask the AI assistant.
                        </p>



                        <div className="pt-2 flex flex-wrap items-center gap-8">
                            <Link href="/chat">
                                <Button variant="secondary" size="lg" className="gap-2">
                                    <Bot className="h-4 w-4 text-purple-400" />
                                    <span>Chat With AI</span>
                                </Button>
                            </Link>

                            <Link href="/search">
                                <Button
                                    size="lg"
                                    className="purple-gradient-btn purple-glow text-white font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all duration-300"
                                >
                                    <span>Find My Seat</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 text-xs font-medium text-slate-400 pt-4">
                            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-purple-400" /> Instant Search</span>
                            <span className="flex items-center gap-1.5"><Bot className="h-4 w-4 text-purple-400" /> AI Assistant</span>
                            <span className="flex items-center gap-1.5"><RefreshCw className="h-4 w-4 text-purple-400" /> Real-Time Updates</span>
                        </div>
                    </div>

                    <div className="lg:col-span-5" >
                        <div className="glass-card rounded-3xl animate-slight-bounce p-6 border border-purple-500/20 purple-glow space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#222236]">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg purple-gradient-btn flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-white">SeatScoutAI Assistant</h3>
                                        <span className="text-[10px] text-emerald-400">● Online</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <div className="rounded-2xl rounded-tr-none bg-purple-600/30 border border-purple-500/40 p-3 text-xs text-purple-200">
                                    F23607022
                                </div>
                            </div>

                            <div className="rounded-2xl bg-[#0d0d16] border border-[#25253b] p-4 space-y-3">
                                <span className="text-[10px] font-bold text-purple-400 uppercase">SEAT FOUND</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[10px] text-slate-500 block">Room</span>
                                        <span className="text-lg font-extrabold text-white">AC-201</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 block">Session</span>
                                        <span className="text-lg font-extrabold text-white">Morning</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 block">Row</span>
                                        <span className="text-sm font-bold text-purple-300">Row 1</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 block">Column</span>
                                        <span className="text-sm font-bold text-purple-300">Col 1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. PROCESS SECTION */}
            <section id="how-it-works" className="text-center space-y-12">
                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">PROCESS</span>
                    <h2 className="text-3xl font-extrabold text-white">How ExamAI Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { step: "01", title: "Staff Upload PDFs", desc: "University administrators upload seating plan PDFs.", icon: FileText },
                        { step: "02", title: "AI Extracts Data", desc: "Our AI model reads and parses seating information automatically.", icon: Bot },
                        { step: "03", title: "Database Updates", desc: "Extracted data is structured and stored in real-time.", icon: Database },
                        { step: "04", title: "Students Search", desc: "Find your seat instantly using roll number or AI chat.", icon: Search },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="group glass-card glass-card-hover rounded-3xl p-6 border border-[#1f1f30] flex flex-col items-center text-center space-y-4"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-500/20 purple-glow">
                                <item.icon className="h-6 w-6 text-purple-400 transition-colors duration-300 group-hover:text-purple-300" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-extrabold text-purple-400 tracking-wider block">{item.step}</span>
                                <h3 className="text-base font-bold text-white transition-colors duration-300 group-hover:text-purple-200">{item.title}</h3>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed max-w-xs transition-colors duration-300 group-hover:text-slate-300">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. FEATURES SECTION */}
            <section id="features" className="space-y-12">
                <div className="text-center space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">FEATURES</span>
                    <h2 className="text-3xl font-extrabold text-white">Built for Speed & Intelligence</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: "Instant Seat Search", tag: "Core Feature", desc: "Find your room and seat within seconds using your roll number.", icon: Search },
                        { title: "AI Assistant", tag: "AI Powered", desc: "Ask questions naturally in plain English and receive intelligent answers.", icon: Bot },
                        { title: "Smart PDF Processing", tag: "Automation", desc: "Automatically extracts and normalizes data from university PDFs.", icon: FileText },
                        { title: "Real-Time Updates", tag: "Live", desc: "Always displays the latest uploaded seating information.", icon: RefreshCw },
                    ].map((feat, idx) => (
                        <div
                            key={idx}
                            className="group glass-card glass-card-hover rounded-3xl p-6 border border-[#1f1f30] space-y-4 cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-500/20">
                                    <feat.icon className="h-5 w-5 text-purple-400 transition-colors duration-300 group-hover:text-purple-300" />
                                </div>
                                <span className="text-[10px] font-bold text-purple-300 border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 rounded-full transition-colors duration-300 group-hover:border-purple-400/50 group-hover:bg-purple-500/20">
                                    {feat.tag}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-purple-200">
                                {feat.title}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed transition-colors duration-300 group-hover:text-slate-300">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI ASSISTANT SHOWCASE SECTION */}
            <section id="ai-assistant" className="pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Column: Heading, Subtitle & Clickable Sample Prompts */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                                AI ASSISTANT
                            </span>
                            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                                Ask Anything About <br />
                                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">
                                    Your Exam Seating
                                </span>
                            </h2>
                            <p className="text-slate-400 text-sm max-w-md pt-1">
                                Natural language search powered by AI. No forms, no filters — just ask.
                            </p>
                        </div>

                        {/* Suggested Prompts List */}
                        <div className="space-y-3 pt-2">
                            {[
                                "Where is F23605033 sitting?",
                                "Which room contains CS-23 students?",
                                "How many students are in AC-201?",
                            ].map((question, idx) => (
                                <div
                                    key={idx}
                                    className="group flex items-center gap-3 rounded-2xl border border-[#1e1e2d] bg-[#0c0c14] px-4 py-3.5 text-xs text-slate-300 transition-all hover:border-purple-500/40 hover:bg-[#12121c] hover:text-white cursor-pointer"
                                >
                                    <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
                                    <span className="font-medium">{question}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Simulated Chat Window */}
                    <div className="lg:col-span-6">
                        <div className="glass-card rounded-3xl p-6 border border-purple-500/20 purple-glow space-y-5">

                            {/* Chat Window Header */}
                            <div className="flex items-center gap-2 pb-3 border-b border-[#1f1f30]">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold text-white">SeatScoutAI Chat</span>
                            </div>

                            {/* Conversation Message History */}
                            <div className="space-y-4 pt-1">
                                {/* User Message 1 */}
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-purple-600/30 border border-purple-500/40 px-4 py-3 text-xs text-purple-100">
                                        Which room contains AI-23 students?
                                    </div>
                                </div>

                                {/* AI Response 1 */}
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-[#0e0e17] border border-[#222236] px-4 py-3 text-xs text-slate-300 leading-relaxed">
                                        AI-23 students are allocated to rooms AC-201, AC-202, and AC-301 for the morning session.
                                    </div>
                                </div>

                                {/* User Message 2 */}
                                <div className="flex justify-end pt-1">
                                    <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-purple-600/30 border border-purple-500/40 px-4 py-3 text-xs text-purple-100">
                                        How many total students in AC-201?
                                    </div>
                                </div>

                                {/* AI Response 2 */}
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-[#0e0e17] border border-[#222236] px-4 py-3 text-xs text-slate-300 leading-relaxed">
                                        AC-201 contains 42 students across 6 rows and 7 columns for CE1114.
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Input Field Box */}
                            <div className="pt-3">
                                <div className="relative flex items-center rounded-2xl border border-[#232338] bg-[#0a0a10] p-1.5 focus-within:border-purple-500/60">
                                    <input
                                        type="text"
                                        placeholder="Type a question..."
                                        disabled
                                        className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                                    />
                                    <button
                                        aria-label="Send query"
                                        disabled
                                        className="flex h-9 w-9 items-center justify-center rounded-xl purple-gradient-btn text-white opacity-90 shrink-0"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* READY FOR YOUR NEXT EXAM CTA SECTION */}
            <section className="py-16 text-center space-y-6 border-b border-[#141420]">
                {/* Large Bold Heading */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                    Ready For Your Next Exam?
                </h2>

                {/* Subtitle Text */}
                <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
                    Find your room and seat instantly with AI.
                </p>

                {/* Glowing CTA Button */}
                <div className="pt-2">
                    <Link href="/search" className="inline-block">
                        <Button
                            size="lg"
                            className="purple-gradient-btn purple-glow text-white font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 hover:scale-105 transition-all duration-300"
                        >
                            <span>Find My Seat</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}