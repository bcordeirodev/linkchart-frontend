import type { LinkResponse } from '@/types';

export type LinkStatus = 'active' | 'inactive' | 'scheduled' | 'expired';

export const STATUS_MAP: Record<LinkStatus, { color: string; label: string }> = {
	active: { color: 'success.main', label: 'Ativo' },
	inactive: { color: 'error.main', label: 'Inativo' },
	scheduled: { color: 'warning.main', label: 'Não iniciado' },
	expired: { color: 'error.main', label: 'Expirado' }
};

export function getLinkStatus(link: LinkResponse): LinkStatus {
	const now = new Date();

	if (link.starts_in && new Date(link.starts_in) > now) {
		return 'scheduled';
	}

	if (link.expires_at && new Date(link.expires_at) < now) {
		return 'expired';
	}

	return link.is_active ? 'active' : 'inactive';
}
