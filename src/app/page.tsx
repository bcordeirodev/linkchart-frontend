'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FuseLoading from '@fuse/core/FuseLoading';

function MainPage() {
	const router = useRouter();

	useEffect(() => {
		// Redireciona para o dashboard após um pequeno delay
		const timer = setTimeout(() => {
			router.push('/analytics');
		}, 1000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="flex flex-1 flex-col items-center justify-center p-4">
			<FuseLoading />
			<div className="mt-4 text-center">
				<p className="text-sm text-gray-600 dark:text-gray-400">Redirecionando para o dashboard...</p>
			</div>
		</div>
	);
}

export default MainPage;
