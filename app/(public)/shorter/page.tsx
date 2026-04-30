import type { Metadata } from 'next';
import ShorterClientPage from './ShorterClientPage';

export const metadata: Metadata = {
	title: 'Free URL Shortener',
	description:
		'Shorten any URL for free. Track clicks, analyze your audience, and grow with data-driven insights.',
	openGraph: {
		title: 'Link Charts — Free URL Shortener with Analytics',
		description:
			'Shorten any URL for free. Track clicks, analyze your audience, and grow with data-driven insights.',
		type: 'website'
	}
};

export default function ShorterPage() {
	return <ShorterClientPage />;
}
