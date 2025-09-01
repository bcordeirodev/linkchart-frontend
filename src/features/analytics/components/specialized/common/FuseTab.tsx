import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import { TabProps } from '@mui/material/Tab/Tab';

type StyledTabProps = TabProps;

const FuseTab: React.ComponentType<StyledTabProps> = styled((props: StyledTabProps) => (
	<Tab
		disableRipple
		{...props}
	/>
))(() => ({
	height: 48,
	maxHeight: 48,
	minHeight: '48px !important',
	minWidth: 80,
	padding: '12px 16px !important',
	fontSize: 14,
	borderRadius: '8px 8px 0 0',
	fontWeight: 500,
	transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
	'&:hover': {
		backgroundColor: 'rgba(10, 116, 218, 0.08)'
	},
	'&.Mui-selected': {
		backgroundColor: 'rgba(10, 116, 218, 0.12)',
		fontWeight: 600
	}
}));

export default FuseTab;
