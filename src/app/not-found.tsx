/**
 * Página Not Found para Link Charts
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Página não encontrada - Link Charts'
};

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
			<h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
			<p className="text-gray-600 mb-8 text-center">
				A página que você está procurando não existe ou foi movida.
			</p>
			<Link
				href="/"
				className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				Voltar ao início
			</Link>
		</div>
	);
}
