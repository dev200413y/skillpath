'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { Application, AgentProfile } from '@/types/application';
import { X, Bot, CheckCircle, Loader2, ExternalLink, User, Mail, Phone, FileText, MessageSquare } from 'lucide-react';

const PROFILE_KEY = 'skillpath_agent_profile';
const APPLICATIONS_KEY = 'skillpath_applications';
const STAGGER_DELAY_MS = 600;

function generateApplicationId(slug: string): string {
    return `${slug}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const defaultProfile: AgentProfile = {
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
    coverLetter: '',
};

interface AutoApplyAgentProps {
    selectedJobs: Job[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AutoApplyAgent({ selectedJobs, onClose, onSuccess }: AutoApplyAgentProps) {
    const [profile, setProfile] = useState<AgentProfile>(defaultProfile);
    const [applying, setApplying] = useState(false);
    const [done, setDone] = useState(false);
    const [appliedCount, setAppliedCount] = useState(0);

    // Load saved profile from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(PROFILE_KEY);
            if (saved) {
                setProfile(JSON.parse(saved));
            }
        } catch {
            // ignore parse errors
        }
    }, []);

    const handleChange = (field: keyof AgentProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const isValid = profile.name.trim() !== '' && profile.email.trim() !== '';

    const handleApplyAll = async () => {
        if (!isValid) return;

        // Save profile for next time
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        } catch {
            // ignore storage errors
        }

        setApplying(true);
        setAppliedCount(0);

        // Load existing applications
        let existing: Application[] = [];
        try {
            const raw = localStorage.getItem(APPLICATIONS_KEY);
            if (raw) existing = JSON.parse(raw);
        } catch {
            existing = [];
        }

        const newApplications: Application[] = selectedJobs.map(job => ({
        id: generateApplicationId(job.slug),
            jobSlug: job.slug,
            jobTitle: job.title,
            company: job.company,
            jobLink: job.link,
            location: job.location,
            appliedAt: new Date().toISOString(),
            profile,
            status: 'applied',
        }));

        // Save combined applications
        try {
            localStorage.setItem(
                APPLICATIONS_KEY,
                JSON.stringify([...newApplications, ...existing])
            );
        } catch {
            // ignore storage errors
        }

        // Open each job link in a new tab with a staggered delay, then update counter
        for (let i = 0; i < selectedJobs.length; i++) {
            await new Promise<void>(resolve => setTimeout(resolve, i === 0 ? 0 : STAGGER_DELAY_MS));
            window.open(selectedJobs[i].link, '_blank', 'noopener,noreferrer');
            setAppliedCount(i + 1);
        }

        setApplying(false);
        setDone(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--glass-border)] bg-[#0f0f0f] shadow-2xl shadow-black/50">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--glass-border)] bg-[#0f0f0f] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Auto Apply Agent</h2>
                            <p className="text-xs text-[var(--text-muted)]">
                                {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-white/10 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {done ? (
                        /* ── Success state ── */
                        <div className="flex flex-col items-center gap-4 py-8 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Applications Submitted!</h3>
                            <p className="text-[var(--text-secondary)]">
                                Your profile was submitted to <strong className="text-white">{appliedCount}</strong> job
                                {appliedCount !== 1 ? 's' : ''} and saved to your applications history.
                            </p>
                            <p className="text-sm text-[var(--text-muted)]">
                                Company pages were opened in new tabs. Complete any further steps there.
                            </p>
                            <div className="mt-2 flex flex-wrap justify-center gap-3">
                                <a
                                    href="/applications"
                                    className="btn-primary inline-flex items-center gap-2 text-sm"
                                >
                                    View My Applications
                                </a>
                                <button
                                    onClick={onSuccess}
                                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* ── Selected jobs list ── */}
                            <div className="mb-6">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    Applying to
                                </h3>
                                <ul className="space-y-2">
                                    {selectedJobs.map(job => (
                                        <li
                                            key={job.slug}
                                            className="flex items-center justify-between rounded-lg border border-[var(--glass-border)] bg-white/3 px-4 py-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-white">{job.title}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{job.company} · {job.location}</p>
                                            </div>
                                            <ExternalLink className="h-4 w-4 flex-shrink-0 text-[var(--text-muted)]" />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* ── Profile form ── */}
                            <div className="mb-6">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    Your Profile
                                </h3>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            placeholder="Full Name *"
                                            value={profile.name}
                                            onChange={e => handleChange('name', e.target.value)}
                                            className="w-full rounded-lg border border-[var(--glass-border)] bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="email"
                                            placeholder="Email Address *"
                                            value={profile.email}
                                            onChange={e => handleChange('email', e.target.value)}
                                            className="w-full rounded-lg border border-[var(--glass-border)] bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={profile.phone}
                                            onChange={e => handleChange('phone', e.target.value)}
                                            className="w-full rounded-lg border border-[var(--glass-border)] bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="url"
                                            placeholder="Resume / Portfolio URL"
                                            value={profile.resumeUrl}
                                            onChange={e => handleChange('resumeUrl', e.target.value)}
                                            className="w-full rounded-lg border border-[var(--glass-border)] bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                                        />
                                    </div>

                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
                                        <textarea
                                            rows={3}
                                            placeholder="Cover Letter (optional)"
                                            value={profile.coverLetter}
                                            onChange={e => handleChange('coverLetter', e.target.value)}
                                            className="w-full rounded-lg border border-[var(--glass-border)] bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] resize-none"
                                        />
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-[var(--text-muted)]">
                                    * Required. Your profile is saved locally for future use.
                                </p>
                            </div>

                            {/* ── Apply button ── */}
                            <button
                                onClick={handleApplyAll}
                                disabled={!isValid || applying}
                                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {applying ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Applying… ({appliedCount}/{selectedJobs.length})
                                    </>
                                ) : (
                                    <>
                                        <Bot className="h-4 w-4" />
                                        Apply to All {selectedJobs.length} Job{selectedJobs.length !== 1 ? 's' : ''}
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
