import dynamic from 'next/dynamic';

// Render client-only: this page relies entirely on localStorage
const ApplicationsClient = dynamic(
    () => import('./ApplicationsClient'),
    { ssr: false }
);

export default function ApplicationsPage() {
    return <ApplicationsClient />;
}
