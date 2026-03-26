import { OrgType } from '@/types/job';

export const ALL_TYPES = ['Full-time', 'Paid Internship', 'Unpaid Internship', 'Part-time'];
export const ALL_ORG_TYPES: OrgType[] = ['Startup', 'Company', 'Organization'];

export const typeColors: Record<string, string> = {
    'Full-time': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Paid Internship': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Unpaid Internship': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Internship': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Part-time': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

export const orgTypeColors: Record<string, string> = {
    'Startup': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Company': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    'Organization': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};
