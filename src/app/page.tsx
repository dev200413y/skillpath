import { getAllJobs } from "@/lib/jobs";
import JobCard from "@/components/JobCard";

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
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.slug} job={job} />
        ))}
      </div>
    </div>
  );
}
