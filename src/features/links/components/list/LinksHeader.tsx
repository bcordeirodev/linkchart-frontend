import { Link } from '@mui/icons-material';

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
			icon={<Link />}
			variant='default'
			showDecorative
			actions={<LinksHeaderActions onCreateNew={onCreateNew} />}
		/>
	);
}

export default LinksHeader;
