import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& > .badge': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

/**
 * The logo component.
 */
function Logo() {
	return (
		<Root className="flex flex-1 items-center space-x-4">
			<div className="flex flex-1 items-center space-x-4 px-3">
				<Box
					className="flex items-center justify-center w-12 h-12 rounded-2xl logo-icon relative overflow-hidden"
					sx={{
						background: 'linear-gradient(135deg, #0A74DA 0%, #1976D2 50%, #00A4EF 100%)',
						boxShadow: '0 8px 24px rgba(10, 116, 218, 0.4), 0 4px 8px rgba(0, 164, 239, 0.3)',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
							borderRadius: 'inherit'
						},
						'&:hover': {
							transform: 'scale(1.05)',
							transition: 'transform 0.2s ease-in-out'
						}
					}}
				>
					<FuseSvgIcon
						className="text-white relative z-10"
						size={24}
					>
						heroicons-outline:link
					</FuseSvgIcon>
				</Box>
				<div className="logo-text flex flex-auto items-center gap-3">
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<Typography
								className="text-2xl tracking-tight font-bold leading-none"
								sx={{
									color: '#ffffff',
									fontWeight: 800,
									letterSpacing: '-0.02em',
									textShadow: '0 2px 4px rgba(0,0,0,0.3)'
								}}
							>
								Link Charts
							</Typography>
						</div>
					</div>
				</div>
			</div>
			{/* <MainProjectSelection /> */}
		</Root>
	);
}

export default Logo;
