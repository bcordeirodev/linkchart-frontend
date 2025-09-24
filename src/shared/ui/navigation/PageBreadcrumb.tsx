import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';

import { Link } from '@/shared/components';
import { usePathname } from '@/shared/hooks';

import type { BreadcrumbsProps } from '@mui/material/Breadcrumbs';

type PageBreadcrumbProps = BreadcrumbsProps & {
	className?: string;
	skipHome?: boolean;
};

function PageBreadcrumb(props: PageBreadcrumbProps) {
	const { className, skipHome = false, ...rest } = props;
	const pathname = usePathname();

	const crumbs = pathname
		.split('/')
		.filter(Boolean)
		.reduce(
			(acc: { title: string; url: string }[], part, index, array) => {
				const url = `/${array.slice(0, index + 1).join('/')}`;
				// Título simples baseado no path
				const title = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');

				acc.push({ title, url });
				return acc;
			},
			skipHome ? [] : []
		);

	return (
		<Breadcrumbs
			classes={{ ol: 'list-none m-0 p-0' }}
			className={clsx('flex w-full', className)}
			aria-label='breadcrumb'
			color='primary'
			{...rest}
		>
			{crumbs.map((item, index) => (
				<Typography
					component={item.url ? Link : 'span'}
					to={item.url}
					key={index}
					className='block font-medium tracking-tight capitalize max-w-32 truncate'
					role='button'
				>
					{item.title}
				</Typography>
			))}
		</Breadcrumbs>
	);
}

export default PageBreadcrumb;
