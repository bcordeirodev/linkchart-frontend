'use client';

import LinkQRCode from './LinkQRCode';
import { useParams } from 'next/navigation';

const LinkQRCodePage = () => {
	const { id } = useParams<{ id: string }>();

	if (!id) return <p>Carregando...</p>;

	return <LinkQRCode id={id} />;
};

export default LinkQRCodePage;
