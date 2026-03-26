export type OrgType = 'Startup' | 'Company' | 'Organization';

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
    // HR contact
    hrEmail?: string;
    hrPhone?: string;
    // Categorisation
    type?: string[];       // e.g. ["Paid Internship"], ["Full-time"], ["Unpaid Internship"]
    orgType?: OrgType;     // Startup | Company | Organization
    salary?: string;
    deadline?: string;
    category?: string;
    experience?: string;
    skills?: string[];
    companyLogo?: string;
}
