'use client';

import LinkEdit from './LinkEdit';
import { useParams } from 'next/navigation';

const LinkEditPage = () => {
	const { id } = useParams<{ id: string }>();

	if (!id) return <p>Carregando...</p>;

	return <LinkEdit id={id} />;
};

export default LinkEditPage;
