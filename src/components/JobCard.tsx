import Link from 'next/link';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Job } from '@/types/job';

interface JobCardProps {
    job: Job;
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <Link href={`/jobs/${job.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] p-6 transition-all hover:border-[var(--primary)]/50 hover:bg-[var(--bg-card-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/10">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-[var(--primary)] transition-colors">
                            {job.title}
                        </h3>
                        <p className="mt-1 text-lg text-[var(--text-secondary)]">{job.company}</p>
                    </div>
                    <div className="rounded-full bg-white/5 p-2 transition-transform group-hover:-rotate-45 group-hover:bg-[var(--primary)]/20">
                        <ArrowRight className="h-5 w-5 text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                    </div>
                    {job.datePosted && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {job.datePosted}
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {job.keywords.split(',').slice(0, 3).map((keyword, i) => (
                        <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                            {keyword.trim()}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
