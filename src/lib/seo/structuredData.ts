export function buildWebApplicationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Link Charts',
		description: 'Free URL shortener with powerful real-time analytics',
		url: process.env.NEXT_PUBLIC_APP_URL,
		applicationCategory: 'UtilityApplication',
		operatingSystem: 'Web',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		}
	};
}

export function buildAnalyticsPageSchema(slug: string, title: string, clicks: number) {
	return {
		'@context': 'https://schema.org',
		'@type': 'DataCatalog',
		name: `Analytics for ${title}`,
		description: `${clicks} clicks tracked for ${title}`,
		url: `${process.env.NEXT_PUBLIC_APP_URL}/public-analytics/${slug}`
	};
}
