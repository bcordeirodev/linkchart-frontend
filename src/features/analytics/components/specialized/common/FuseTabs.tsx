import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import { TabsProps } from '@mui/material/Tabs/Tabs';
import Box from '@mui/material/Box';
import clsx from 'clsx';

type StyledTabsProps = TabsProps;

const FuseTabs: React.ComponentType<StyledTabsProps> = styled((props: StyledTabsProps) => (
	<Tabs
		indicatorColor="primary"
		textColor="inherit"
		variant="scrollable"
		scrollButtons={false}
		className={clsx('w-full min-h-0', props.className)}
		classes={{
			indicator: 'flex justify-center bg-transparent w-full h-full'
		}}
		TabIndicatorProps={{
			children: (
				<Box
					sx={{ bgcolor: 'primary.main' }}
					className="w-full h-full rounded-lg opacity-30"
				/>
			)
		}}
		{...props}
	/>
))(() => ({
	minHeight: 48,
	position: 'relative',
	zIndex: 10,
	backgroundColor: 'background.paper',
	borderBottom: '1px solid',
	borderColor: 'divider',
	'& .MuiTabs-flexContainer': {
		height: 48
	},
	'& .MuiTab-root:not(:last-of-type)': {
		marginRight: 4
	},
	'& .MuiTab-root': {
		minHeight: 48,
		padding: '12px 16px',
		borderRadius: '8px 8px 0 0',
		transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
		fontWeight: 500,
		'&:hover': {
			backgroundColor: 'rgba(10, 116, 218, 0.08)',
			color: 'primary.main'
		},
		'&.Mui-selected': {
			backgroundColor: 'rgba(10, 116, 218, 0.12)',
			color: 'primary.main',
			fontWeight: 600
		}
	}
}));

export default FuseTabs;
