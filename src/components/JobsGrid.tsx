'use client';

import { useState, useCallback, useMemo } from 'react';
import JobCard from '@/components/JobCard';
import AutoApplyAgent from '@/components/AutoApplyAgent';
import { Job, OrgType } from '@/types/job';
import { Bot, SlidersHorizontal, X } from 'lucide-react';
import { ALL_TYPES, ALL_ORG_TYPES } from '@/lib/jobConstants';

interface JobsGridProps {
    jobs: Job[];
}

export default function JobsGrid({ jobs }: JobsGridProps) {
    const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
    const [agentOpen, setAgentOpen] = useState(false);
    const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());
    const [activeOrgTypes, setActiveOrgTypes] = useState<Set<OrgType>>(new Set());

    const toggleSelect = useCallback((slug: string) => {
        setSelectedSlugs(prev => {
            const next = new Set(prev);
            if (next.has(slug)) {
                next.delete(slug);
            } else {
                next.add(slug);
            }
            return next;
        });
    }, []);

    const toggleType = (type: string) => {
        setActiveTypes(prev => {
            const next = new Set(prev);
            if (next.has(type)) next.delete(type); else next.add(type);
            return next;
        });
    };

    const toggleOrgType = (orgType: OrgType) => {
        setActiveOrgTypes(prev => {
            const next = new Set(prev);
            if (next.has(orgType)) next.delete(orgType); else next.add(orgType);
            return next;
        });
    };

    const clearFilters = () => {
        setActiveTypes(new Set());
        setActiveOrgTypes(new Set());
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const typeMatch =
                activeTypes.size === 0 ||
                (job.type ?? []).some(t => activeTypes.has(t));
            const orgMatch =
                activeOrgTypes.size === 0 ||
                (job.orgType != null && activeOrgTypes.has(job.orgType));
            return typeMatch && orgMatch;
        });
    }, [jobs, activeTypes, activeOrgTypes]);

    const selectedJobs = filteredJobs.filter(j => selectedSlugs.has(j.slug));

    const hasActiveFilters = activeTypes.size > 0 || activeOrgTypes.size > 0;

    const handleAgentClose = () => setAgentOpen(false);
    const handleAgentSuccess = () => {
        setSelectedSlugs(new Set());
        setAgentOpen(false);
    };

    return (
        <>
            {/* ── Filter bar ── */}
            <div className="mb-8 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] p-4">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <SlidersHorizontal className="h-4 w-4 text-[var(--text-muted)]" />
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">Filter by Type</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {ALL_TYPES.map(type => (
                        <button
                            key={type}
                            onClick={() => toggleType(type)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                                activeTypes.has(type)
                                    ? 'border-[var(--primary)] bg-[var(--primary)]/20 text-white'
                                    : 'border-white/20 bg-white/5 text-gray-400 hover:border-white/40 hover:text-white'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">Filter by Organisation</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {ALL_ORG_TYPES.map(orgType => (
                        <button
                            key={orgType}
                            onClick={() => toggleOrgType(orgType)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                                activeOrgTypes.has(orgType)
                                    ? 'border-[var(--primary)] bg-[var(--primary)]/20 text-white'
                                    : 'border-white/20 bg-white/5 text-gray-400 hover:border-white/40 hover:text-white'
                            }`}
                        >
                            {orgType}
                        </button>
                    ))}

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="ml-2 inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all"
                        >
                            <X className="h-3 w-3" />
                            Clear
                        </button>
                    )}
                </div>

                {hasActiveFilters && (
                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                        Showing <strong className="text-white">{filteredJobs.length}</strong> of {jobs.length} listings
                    </p>
                )}
            </div>

            {/* ── Job grid ── */}
            {filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <p className="text-lg text-[var(--text-secondary)]">No listings match your filters.</p>
                    <button onClick={clearFilters} className="text-sm text-[var(--primary)] underline underline-offset-2">
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <JobCard
                            key={job.slug}
                            job={job}
                            isSelected={selectedSlugs.has(job.slug)}
                            onSelect={toggleSelect}
                        />
                    ))}
                </div>
            )}

            {/* Floating Auto Apply Agent button */}
            {selectedSlugs.size > 0 && !agentOpen && (
                <div className="fixed bottom-6 right-6 z-40">
                    <button
                        onClick={() => setAgentOpen(true)}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50"
                    >
                        <Bot className="h-5 w-5" />
                        Auto Apply ({selectedSlugs.size})
                    </button>
                </div>
            )}

            {agentOpen && (
                <AutoApplyAgent
                    selectedJobs={selectedJobs}
                    onClose={handleAgentClose}
                    onSuccess={handleAgentSuccess}
                />
            )}
        </>
    );
}
