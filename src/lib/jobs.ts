import { Job } from '@/types/job';
import fs from 'fs';
import path from 'path';

export async function getAllJobs(): Promise<Job[]> {
  const filePath = path.join(process.cwd(), 'data', 'jobs.json');

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const jobs: Job[] = JSON.parse(fileContents);
    return jobs;
  } catch (error) {
    console.error("Error reading jobs.json:", error);
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const jobs = await getAllJobs();
  return jobs.find(job => job.slug === slug);
}
