import { getAllJobs, getJobBySlug } from "@/lib/jobs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, ExternalLink, Mail, Phone, Building2, Briefcase } from "lucide-react";
import { typeColors, orgTypeColors } from "@/lib/jobConstants";

interface PageProps {
    params: {
        slug: string;
    };
}

// Generate static params for SSG
export async function generateStaticParams() {
    const jobs = await getAllJobs();
    return jobs.map((job) => ({
        slug: job.slug,
    }));
}

export default async function JobPage({ params }: PageProps) {
    const job = await getJobBySlug(params.slug);

    if (!job) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-4xl px-4">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
            </Link>

            <article className="glass-panel overflow-hidden p-8 md:p-10">
                <header className="mb-8 border-b border-[var(--glass-border)] pb-8">
                    <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">{job.title}</h1>

                    {/* Type & OrgType badges */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        {job.type?.map((t, i) => (
                            <span key={i} className={`rounded-full border px-3 py-1 text-xs font-medium ${typeColors[t] ?? 'bg-white/10 text-gray-300 border-white/20'}`}>
                                {t}
                            </span>
                        ))}
                        {job.orgType && (
                            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${orgTypeColors[job.orgType] ?? 'bg-white/10 text-gray-300 border-white/20'}`}>
                                <Building2 className="h-3 w-3" />
                                {job.orgType}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-[var(--text-muted)]">
                        <span className="text-xl text-[var(--primary)] font-medium">{job.company}</span>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            {job.location}
                        </div>
                        {job.datePosted && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {new Date(job.datePosted).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        )}
                        {job.salary && (
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                {job.salary}
                            </div>
                        )}
                    </div>
                </header>

                {/* HR Contact box */}
                {(job.hrEmail || job.hrPhone) && (
                    <div className="mb-8 rounded-xl border border-green-500/30 bg-green-500/5 p-5">
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-400">HR Contact</h2>
                        <div className="flex flex-wrap gap-6">
                            {job.hrEmail && (
                                <a
                                    href={`mailto:${job.hrEmail}`}
                                    className="flex items-center gap-2 text-sm text-white hover:text-green-400 transition-colors"
                                >
                                    <Mail className="h-4 w-4 text-green-400" />
                                    {job.hrEmail}
                                </a>
                            )}
                            {job.hrPhone && (
                                <a
                                    href={`tel:${job.hrPhone}`}
                                    className="flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors"
                                >
                                    <Phone className="h-4 w-4 text-blue-400" />
                                    {job.hrPhone}
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>

                {job.skills && job.skills.length > 0 && (
                    <div className="mt-8 border-t border-[var(--glass-border)] pt-6">
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, i) => (
                                <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-10 flex flex-col gap-4 border-t border-[var(--glass-border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Interested in this role?</p>
                        <p className="text-xs text-[var(--text-muted)]">You will be redirected to the official company page.</p>
                    </div>
                    <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </div>
            </article>

            {/* JSON-LD Schema for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: job.schema }}
            />
        </div>
    );
}
