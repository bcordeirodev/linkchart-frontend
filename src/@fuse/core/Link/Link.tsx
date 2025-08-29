import { Link as RouterLink } from 'react-router-dom';
import { ReactNode, forwardRef, AnchorHTMLAttributes } from 'react';

type CustomLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	to?: string;
	href?: string;
	children?: ReactNode;
	className?: string;
	role?: string;
	target?: string;
	rel?: string;
	sx?: unknown;
};

const Link = forwardRef<HTMLAnchorElement, CustomLinkProps>((props, ref) => {
	const { to, href, children, className, role, target, rel, sx, ...rest } = props;
	const linkTo = to || href || '';

	// If it's an external link, use a regular anchor tag
	if (linkTo.startsWith('http') || linkTo.startsWith('mailto:') || linkTo.startsWith('tel:')) {
		return (
			<a
				href={linkTo}
				className={className}
				role={role}
				target={target}
				rel={rel}
				ref={ref}
				{...rest}
			>
				{children}
			</a>
		);
	}

	// Otherwise use React Router Link
	return (
		<RouterLink
			to={linkTo}
			className={className}
			role={role}
			target={target}
			ref={ref}
			{...rest}
		>
			{children}
		</RouterLink>
	);
});

export default Link;
