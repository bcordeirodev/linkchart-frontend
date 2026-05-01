/**
 * The module for importing CSS files.
 */
declare module '*.css' {
	const content: Record<string, string>;
	export default content;
}

/**
 * The type definition for the Node.js process object with additional properties.
 */
type ProcessType = NodeJS.Process & {
	browser: boolean;
	env: Record<string, string | undefined>;
};

/**
 * The global process object.
 */
declare let process: ProcessType;

/**
 * The type definition for the Hot Module object.
 */
// Note: Vite HMR module declaration removed — not applicable in Next.js
// interface HotModule { hot?: { status: () => string }; }
// declare const module: HotModule;

declare module '*?raw' {
	const content: string;
	export default content;
}
