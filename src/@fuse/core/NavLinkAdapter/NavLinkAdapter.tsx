import Link from '@fuse/core/Link';
import { CSSProperties, ReactNode } from 'react';
import { usePathname, useNavigate } from '@/shared/hooks';
import clsx from 'clsx';

export type NavLinkAdapterPropsType = {
	activeClassName?: string;
	activeStyle?: CSSProperties;
	children?: ReactNode;
	to?: string;
	href?: string;
	className?: string;
	style?: CSSProperties;
	role?: string;
	exact?: boolean;
	ref?: React.RefObject<HTMLAnchorElement>;
};

/**
 * The NavLinkAdapter component is a wrapper around the React.js Link component.
 * It adds the ability to navigate programmatically using the useRouter hook.
 * The component is memoized to prevent unnecessary re-renders.
 */
function NavLinkAdapter(props: NavLinkAdapterPropsType) {
	const {
		children,
		activeClassName = 'active',
		activeStyle,
		role = 'button',
		to,
		href,
		exact,
		ref,
		..._props
	} = props;

	const navigate = useNavigate();
	const pathname = usePathname();

	const targetUrl = (to || href || '/') as string;

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		navigate(targetUrl);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			navigate(targetUrl);
		}
	};

	const isActive = exact ? pathname === targetUrl : pathname.startsWith(targetUrl);

	return (
		<Link
			to={targetUrl}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={clsx(
				_props.className,
				isActive ? activeClassName : '',
				pathname === targetUrl && 'pointer-events-none'
			)}
			style={isActive ? { ..._props.style, ...activeStyle } : _props.style}
			role={role}
		>
			{children}
		</Link>
	);
}

export default NavLinkAdapter;
