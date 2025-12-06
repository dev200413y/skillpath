import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--glass-border)] bg-[var(--bg-dark)]/80 backdrop-blur-md">
                    </Link>
                    <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Companies
                    </Link>
                    <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Resources
                    </Link>
                </div >

        <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all">
            Post a Job
        </button>
            </div >
        </nav >
    );
}
