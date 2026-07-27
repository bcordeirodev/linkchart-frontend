/**
 * Maximum number of active API keys per account. Mirrors the backend limit
 * (`POST /api/api-keys` responds 422 beyond it) so the UI can hide the create
 * form pre-emptively; the server remains the real enforcer.
 */
export const MAX_API_KEYS_PER_USER = 5;

/**
 * Maximum length of an API key name, mirroring the backend validation rule
 * on `POST /api/api-keys` (`name` required, max 60).
 */
export const API_KEY_NAME_MAX_LENGTH = 60;

/**
 * Public base URL of the API that keys authenticate against, used to build
 * the copy-pasteable `curl` examples in the usage guide. Hardcoded on purpose:
 * the examples must show the real production host a script would call, not the
 * dashboard's relative proxy path.
 */
export const PUBLIC_API_BASE_URL = "https://api.linkcharts.com.br";
