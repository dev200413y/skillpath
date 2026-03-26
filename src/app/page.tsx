import { getAllJobs } from "@/lib/jobs";
import JobsGrid from "@/components/JobsGrid";

export default async function Home() {
  const jobs = await getAllJobs();

  return (
    <div className="container mx-auto px-4">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-7xl">
          Find Your <span className="gradient-text">Dream Job</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[var(--text-secondary)]">
          AI-curated job listings with enhanced descriptions and insights to help you land your next role.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-muted)]">
          Select multiple jobs and use the <strong className="text-white">Auto Apply Agent</strong> to apply to all of them at once.
        </p>
      </section>

      <JobsGrid jobs={jobs} />
    </div>
  );
}
