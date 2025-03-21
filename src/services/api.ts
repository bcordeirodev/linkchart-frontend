const createApiService = (baseURL: string) => {
    const request = async <T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        endpoint: string,
        data: unknown = null,
        customHeaders: HeadersInit = {}
    ): Promise<T> => {
        const url = `${baseURL}/${endpoint}`;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        const options: RequestInit = {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
        };

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    };

    return {
        get: <T>(endpoint: string, customHeaders: HeadersInit = {}): Promise<T> => {
            return request<T>('GET', endpoint, null, customHeaders);
        },
        post: <T>(endpoint: string, data: unknown, customHeaders: HeadersInit = {}): Promise<T> => {
            return request<T>('POST', endpoint, data, customHeaders);
        },
        put: <T>(endpoint: string, data: unknown, customHeaders: HeadersInit = {}): Promise<T> => {
            return request<T>('PUT', endpoint, data, customHeaders);
        },
        patch: <T>(endpoint: string, data: unknown, customHeaders: HeadersInit = {}): Promise<T> => {
            return request<T>('PATCH', endpoint, data, customHeaders);
        },
        delete: <T>(endpoint: string, customHeaders: HeadersInit = {}): Promise<T> => {
            return request<T>('DELETE', endpoint, null, customHeaders);
        },
    };
};

const apiService = createApiService(process.env.NEXT_PUBLIC_API_URL ?? '');
export default apiService;
