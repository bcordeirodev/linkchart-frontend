import { Navigate } from 'react-router-dom';

type RedirectProps = {
	to: string;
	children?: React.ReactNode;
};

function Redirect(props: RedirectProps) {
	const { to, children = null } = props;

	return (
		<Navigate
			to={to}
			replace
		/>
	);
}

export default Redirect;
