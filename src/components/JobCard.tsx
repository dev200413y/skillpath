import Link from 'next/link';
import { MapPin, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Job } from '@/types/job';

interface JobCardProps {
    job: Job;
    isSelected?: boolean;
    onSelect?: (slug: string) => void;
}

export default function JobCard({ job, isSelected, onSelect }: JobCardProps) {
    return (
        <div className="relative">
            {/* Selection checkbox */}
            {onSelect && (
                <button
                    onClick={() => onSelect(job.slug)}
                    aria-label={isSelected ? `Deselect ${job.title}` : `Select ${job.title}`}
                    className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full transition-colors"
                >
                    {isSelected ? (
                        <CheckCircle2 className="h-6 w-6 text-[var(--primary)]" />
                    ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-white/30 hover:border-[var(--primary)]" />
                    )}
                </button>
            )}

            <Link href={`/jobs/${job.slug}`} className="group block">
                <div className={`relative overflow-hidden rounded-xl border p-6 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/10 ${
                    isSelected
                        ? 'border-[var(--primary)]/70 bg-[var(--bg-card-hover)] shadow-lg shadow-[var(--primary)]/10'
                        : 'border-[var(--glass-border)] bg-[var(--bg-card)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-card-hover)]'
                }`}>
                    <div className="flex items-start justify-between">
                        <div className={onSelect ? 'pr-6' : ''}>
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
        </div>
    );
}
