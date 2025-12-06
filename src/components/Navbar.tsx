import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--glass-border)] bg-[var(--bg-dark)]/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        JobPilot
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Find Jobs
                    </Link>
                    <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Companies
                    </Link>
                    <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Resources
                    </Link>
                </div>

                <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all">
                    Post a Job
                </button>
            </div>
        </nav>
    );
}
