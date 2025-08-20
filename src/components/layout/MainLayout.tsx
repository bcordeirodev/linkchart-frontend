'use client';

import { FuseLayoutProps } from '@fuse/core/FuseLayout/FuseLayout';
import FuseLayout from '@fuse/core/FuseLayout';
import { useMemo } from 'react';
import { themeLayouts } from '@/themes';

type MainLayoutProps = Omit<FuseLayoutProps, 'layouts'> & {
	navbar?: boolean;
	toolbar?: boolean;
	footer?: boolean;
};

function MainLayout(props: MainLayoutProps) {
	const {
		children,
		navbar,
		toolbar,
		footer,
		settings = {}, // Default to an empty object if settings is undefined
		...rest
	} = props;

	const mergedSettings = useMemo(() => {
		const shorthandSettings = {
			config: {
				...(navbar !== undefined && { navbar: { display: navbar } }),
				...(toolbar !== undefined && { toolbar: { display: toolbar } }),
				...(footer !== undefined && { footer: { display: footer } })
			}
		};
		return { ...settings, ...shorthandSettings };
	}, [settings, navbar, toolbar, footer]);

	return (
		<FuseLayout
			{...rest}
			layouts={themeLayouts}
			settings={mergedSettings}
		>
			{children}
		</FuseLayout>
	);
}

export default MainLayout;
