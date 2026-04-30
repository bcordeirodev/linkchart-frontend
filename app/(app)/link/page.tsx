import type { Metadata } from 'next';
import LinkListPageContent from '@/pages/links/LinkListPage';
export const metadata: Metadata = { title: 'My Links' };
export default function LinkListPage() { return <LinkListPageContent />; }
