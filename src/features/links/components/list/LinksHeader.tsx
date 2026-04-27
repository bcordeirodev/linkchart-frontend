import { Link2 } from 'lucide-react';
import { ICON_XL } from '@/lib/theme/iconDefaults';

import { PageHeader } from '@/shared/ui/base/PageHeader';

import { LinksHeaderActions } from './LinksHeaderActions';

interface LinksHeaderProps {
	onCreateNew?: () => void;
}

/**
 * Header da página de gerenciamento de links
 */
export function LinksHeader({ onCreateNew }: LinksHeaderProps) {
	return (
		<PageHeader
			title='Gerenciar Links'
			subtitle='Crie, edite e monitore seus links encurtados'
			icon={<Link2 {...ICON_XL} />}
			variant='default'
			showDecorative
			actions={<LinksHeaderActions onCreateNew={onCreateNew} />}
		/>
	);
}

export default LinksHeader;
