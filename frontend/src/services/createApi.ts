import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { navigateTo } from './navigation';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
});

// wrapper
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        const result = await baseQuery(args, api, extraOptions);
        const errorStatusCode = result.error?.status;

        if (errorStatusCode === 401) {
            navigateTo('/login')
        }
        return result;
    }

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ["getUser", "GET_PRODUCTS"],
    endpoints: () => ({}),
});