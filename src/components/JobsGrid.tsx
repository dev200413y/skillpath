'use client';

import { useState, useCallback } from 'react';
import JobCard from '@/components/JobCard';
import AutoApplyAgent from '@/components/AutoApplyAgent';
import { Job } from '@/types/job';
import { Bot } from 'lucide-react';

interface JobsGridProps {
    jobs: Job[];
}

export default function JobsGrid({ jobs }: JobsGridProps) {
    const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
    const [agentOpen, setAgentOpen] = useState(false);

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

    const selectedJobs = jobs.filter(j => selectedSlugs.has(j.slug));

    const handleAgentClose = () => {
        setAgentOpen(false);
    };

    const handleAgentSuccess = () => {
        setSelectedSlugs(new Set());
        setAgentOpen(false);
    };

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <JobCard
                        key={job.slug}
                        job={job}
                        isSelected={selectedSlugs.has(job.slug)}
                        onSelect={toggleSelect}
                    />
                ))}
            </div>

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
