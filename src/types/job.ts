export interface Job {
    slug: string;
    title: string;
    company: string;
    link: string;
    location: string;
    description: string; // HTML
    seoTitle: string;
    keywords: string;
    summary: string;
    schema: string; // JSON-LD string
    datePosted?: string;
}
