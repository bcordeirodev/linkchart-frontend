import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
	MRT_GlobalFilterTextField,
	MRT_LinearProgressBar,
	MRT_TablePagination,
	MRT_ToolbarAlertBanner,
	MRT_ToolbarDropZone,
	MRT_ToolbarInternalButtons
} from 'material-react-table';

import parseFromValuesOrFunc from '@/shared/ui/data-display/utils/parseFromValuesOrFunc';

import type { MRT_RowData, MRT_TableInstance } from 'material-react-table';

export interface MRT_TopToolbarProps<TData extends MRT_RowData> {
	table: MRT_TableInstance<TData>;
}

function DataTableTopToolbar<TData extends MRT_RowData>({ table }: MRT_TopToolbarProps<TData>) {
	const {
		getState,
		options: {
			enableGlobalFilter,
			enablePagination,
			enableToolbarInternalActions,
			muiTopToolbarProps,
			positionGlobalFilter,
			positionPagination,
			positionToolbarDropZone,
			renderTopToolbarCustomActions
		},
		refs: { topToolbarRef }
	} = table;

	const { isFullScreen, showGlobalFilter } = getState();

	const isMobile = useMediaQuery('(max-width:720px)');
	const isTablet = useMediaQuery('(max-width:1024px)');

	const toolbarProps = parseFromValuesOrFunc(muiTopToolbarProps, { table });

	const stackAlertBanner = isMobile || !!renderTopToolbarCustomActions || (showGlobalFilter && isTablet);

	const globalFilterProps = {
		sx: !isTablet
			? {
					zIndex: 2
				}
			: undefined,
		table
	};
	return (
		<Box
			sx={(theme) => ({
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				py: 0.5,
				px: 1.5,
				borderBottom: `1px solid ${theme.palette.divider}`
			})}
		>
			<Box
				{...toolbarProps}
				ref={(ref: HTMLDivElement) => {
					topToolbarRef.current = ref;

					if (toolbarProps?.ref) {
						// eslint-disable-next-line
						// @ts-ignore
						toolbarProps.ref.current = ref;
					}
				}}
				sx={[
					{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						alignItems: 'center'
					},
					(theme) => ({
						backgroundColor: table.options.mrtTheme.baseBackgroundColor,
						transition: 'all 150ms ease-in-out',
						zIndex: 1,
						...(parseFromValuesOrFunc(toolbarProps?.sx, theme) as unknown as object)
					}),
					isFullScreen
						? {
								position: 'sticky'
							}
						: {
								position: 'relative'
							},
					isFullScreen
						? {
								top: '0'
							}
						: {
								top: null
							}
				]}
			>
				{['both', 'top'].includes(positionToolbarDropZone ?? '') && <MRT_ToolbarDropZone table={table} />}

				<Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
					{enableGlobalFilter && positionGlobalFilter === 'left' ? (
						<MRT_GlobalFilterTextField {...globalFilterProps} />
					) : null}

					<Box sx={{ display: 'flex', flex: 1 }}>{renderTopToolbarCustomActions?.({ table }) ?? null}</Box>

					{enableToolbarInternalActions ? (
						<Box sx={{ display: 'flex', alignItems: 'center', '& > * + *': { ml: 1 } }}>
							{enableGlobalFilter && positionGlobalFilter === 'right' ? (
								<MRT_GlobalFilterTextField
									{...globalFilterProps}
									sx={{
										'& .MuiOutlinedInput-root': { height: 32, minHeight: 32, paddingX: 1 }
									}}
								/>
							) : null}
							<MRT_ToolbarInternalButtons table={table} />
						</Box>
					) : (
						enableGlobalFilter &&
						positionGlobalFilter === 'right' && <MRT_GlobalFilterTextField {...globalFilterProps} />
					)}
				</Box>
				{enablePagination && ['both', 'top'].includes(positionPagination ?? '') ? (
					<MRT_TablePagination
						position='top'
						table={table}
					/>
				) : null}
				<MRT_LinearProgressBar
					isTopToolbar
					table={table}
				/>
			</Box>
			<MRT_ToolbarAlertBanner
				stackAlertBanner={stackAlertBanner}
				table={table}
				sx={{
					mt: 0.5,
					borderRadius: 1,
					display: 'flex',
					justifyContent: 'center',
					'& .MuiStack-root': {
						display: 'flex',
						justifyContent: 'center',
						width: '100%',
						fontSize: 13
					}
				}}
			/>
		</Box>
	);
}

export default DataTableTopToolbar;
