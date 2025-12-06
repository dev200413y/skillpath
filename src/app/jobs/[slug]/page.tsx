import { getAllJobs, getJobBySlug } from "@/lib/jobs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react";

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
                    <div className="flex flex-wrap items-center gap-6 text-[var(--text-muted)]">
                        <span className="text-xl text-[var(--primary)] font-medium">{job.company}</span>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            {job.location}
                        </div>
                        {job.datePosted && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {job.datePosted}
                            </div>
                        )}
                    </div>
                </header>

                <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>

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
