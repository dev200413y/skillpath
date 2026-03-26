'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Application } from '@/types/application';
import { ArrowLeft, Bot, Briefcase, MapPin, Clock, ExternalLink, Trash2, User, Mail, Phone } from 'lucide-react';

const APPLICATIONS_KEY = 'skillpath_applications';

function loadApplications(): Application[] {
    try {
        const raw = localStorage.getItem(APPLICATIONS_KEY);
        return raw ? (JSON.parse(raw) as Application[]) : [];
    } catch {
        return [];
    }
}

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
};

export default function ApplicationsClient() {
    const [applications, setApplications] = useState<Application[]>(loadApplications);

    const handleDelete = (id: string) => {
        setApplications(prev => {
            const updated = prev.filter(a => a.id !== id);
            try {
                localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
            } catch {
                // ignore storage errors
            }
            return updated;
        });
    };

    const handleClearAll = () => {
        setApplications([]);
        try {
            localStorage.removeItem(APPLICATIONS_KEY);
        } catch {
            // ignore storage errors
        }
    };

    return (
        <div className="container mx-auto max-w-4xl px-4">
            <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
            </Link>

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                        <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Applications</h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            {applications.length} application{applications.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                </div>

                {applications.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                    </button>
                )}
            </div>

            {applications.length === 0 ? (
                <div className="glass-panel flex flex-col items-center gap-4 py-20 text-center">
                    <Briefcase className="h-12 w-12 text-[var(--text-muted)]" />
                    <h2 className="text-lg font-semibold text-white">No applications yet</h2>
                    <p className="text-sm text-[var(--text-muted)]">
                        Use the Auto Apply Agent on the jobs page to bulk-apply and track your applications here.
                    </p>
                    <Link href="/" className="btn-primary mt-2 text-sm">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <ul className="space-y-4">
                    {applications.map(app => (
                        <li
                            key={app.id}
                            className="glass-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
                        >
                            <div className="flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base font-semibold text-white">{app.jobTitle}</h3>
                                    <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                                        {app.status}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--primary)]">{app.company}</p>
                                <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {app.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatDate(app.appliedAt)}
                                    </span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                                        <span aria-label="Applicant name">{app.profile.name}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                                        <span aria-label="Email">{app.profile.email}</span>
                                    </span>
                                    {app.profile.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                                            <span aria-label="Phone">{app.profile.phone}</span>
                                        </span>
                                    )}
                                    {app.profile.resumeUrl && (
                                        <a
                                            href={app.profile.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-[var(--primary)] hover:underline"
                                        >
                                            Resume <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <a
                                    href={app.jobLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
                                >
                                    View Job <ExternalLink className="h-3 w-3" />
                                </a>
                                <button
                                    onClick={() => handleDelete(app.id)}
                                    aria-label="Remove application"
                                    className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
