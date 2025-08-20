/**
 * Enhanced session redirect URL management with better error handling and validation
 */
const sessionStorageKey = 'fuseRedirectUrl';
const maxRedirectAge = 30 * 60 * 1000; // 30 minutes in milliseconds

interface StoredRedirectData {
	url: string;
	timestamp: number;
	origin?: string;
}

/**
 * Check if sessionStorage is available
 */
const isSessionStorageAvailable = (): boolean => {
	try {
		return typeof window !== 'undefined' && 'sessionStorage' in window;
	} catch {
		return false;
	}
};

/**
 * Validate redirect URL to prevent malicious redirects
 */
const isValidRedirectUrl = (url: string): boolean => {
	try {
		// Allow relative URLs and same-origin URLs
		if (url.startsWith('/')) return true;

		const urlObj = new URL(url, window.location.origin);
		return urlObj.origin === window.location.origin;
	} catch {
		return false;
	}
};

/**
 * Get session redirect url with expiration check
 */
export const getSessionRedirectUrl = (): string | null => {
	if (!isSessionStorageAvailable()) return null;

	try {
		const storedData = window.sessionStorage.getItem(sessionStorageKey);

		if (!storedData) return null;

		const data: StoredRedirectData = JSON.parse(storedData);
		const now = Date.now();

		// Check if the stored redirect has expired
		if (now - data.timestamp > maxRedirectAge) {
			resetSessionRedirectUrl();
			return null;
		}

		// Validate the URL before returning
		if (!isValidRedirectUrl(data.url)) {
			resetSessionRedirectUrl();
			return null;
		}

		return data.url;
	} catch (error) {
		// Failed to retrieve session redirect URL
		resetSessionRedirectUrl();
		return null;
	}
};

/**
 * Set session redirect url with timestamp and validation
 */
export const setSessionRedirectUrl = (url: string): boolean => {
	if (!isSessionStorageAvailable()) return false;

	// Validate URL before storing
	if (!isValidRedirectUrl(url)) {
		// Invalid redirect URL attempted
		return false;
	}

	try {
		const data: StoredRedirectData = {
			url,
			timestamp: Date.now(),
			origin: window.location.origin
		};

		window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(data));
		return true;
	} catch (error) {
		// Failed to set session redirect URL
		return false;
	}
};

/**
 * Reset session redirect url with error handling
 */
export const resetSessionRedirectUrl = (): void => {
	if (!isSessionStorageAvailable()) return;

	try {
		window.sessionStorage.removeItem(sessionStorageKey);
	} catch (error) {
		// Failed to reset session redirect URL
	}
};

/**
 * Check if there's a valid redirect URL stored
 */
export const hasValidRedirectUrl = (): boolean => {
	return getSessionRedirectUrl() !== null;
};
