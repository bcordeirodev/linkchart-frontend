'use client';

import { useParams } from 'next/navigation';
import LinkAnalytics from './LinkAnalytics';

function Page() {
	const params = useParams();
	const id = params.id as string;

	return <LinkAnalytics id={id} />;
}

export default Page;
