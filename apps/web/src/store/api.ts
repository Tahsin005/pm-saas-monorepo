import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { setAccessToken, clearCredentials } from './authSlice'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers, api) => {
        const state = api.getState() as { auth?: { accessToken?: string | null } }
        const token = state?.auth?.accessToken
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
})

let refreshPromise: Promise<string | null> | null = null

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        let result = await rawBaseQuery(args, api, extraOptions)

        const isRefreshCall =
            typeof args === 'string'
                ? args.includes('/auth/refresh')
                : args.url?.includes('/auth/refresh')

        if (result.error && result.error.status === 401 && !isRefreshCall) {
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const refreshResult = await rawBaseQuery(
                        { url: '/auth/refresh', method: 'POST' },
                        api,
                        extraOptions
                    )
                    const data = refreshResult.data as
                        | { success: true; data: { accessToken: string } }
                        | undefined
                    return data?.data?.accessToken ?? null
                })()
            }

            const newToken = await refreshPromise
            refreshPromise = null

            if (newToken) {
                api.dispatch(setAccessToken(newToken))
                result = await rawBaseQuery(args, api, extraOptions)
            } else {
                api.dispatch(clearCredentials())
            }
        }

        return result
    }

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
})
