import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '../api/endpoints';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (
	args,
	apiContext,
	extraOptions
) => {
	const result = await fetchBaseQuery({
		baseUrl: API_BASE_URL,
		prepareHeaders: async (headers) => {
			// O novo cliente API já gerencia autenticação automaticamente
			return headers;
		}
	})(args, apiContext, extraOptions);

	// Example of handling specific error codes
	if (result.error && result.error.status === 401) {
		// Logic to handle 401 errors (e.g., refresh token)
	}

	return result;
};

export const apiService = createApi({
	baseQuery,
	endpoints: () => ({}),
	reducerPath: 'apiService'
});

export default apiService;
