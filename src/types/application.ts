export interface AgentProfile {
    name: string;
    email: string;
    phone: string;
    resumeUrl: string;
    coverLetter: string;
}

export interface Application {
    id: string;
    jobSlug: string;
    jobTitle: string;
    company: string;
    jobLink: string;
    location: string;
    appliedAt: string;
    profile: AgentProfile;
    status: 'applied' | 'pending';
}
