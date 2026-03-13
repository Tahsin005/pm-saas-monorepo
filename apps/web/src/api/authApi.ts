import { api } from '@/store/api'
import type { User, LoginInput, RegisterInput } from '@repo/shared-types'
import { clearCredentials, setCredentials, setHydrating, setUser } from '@/store/authSlice'

export interface AuthResponse {
    user: User
    accessToken: string
}

export const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<AuthResponse, LoginInput>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
            transformResponse: (raw: { success: true; data: AuthResponse }) => raw.data,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials(data))
                } catch {
                    // ignore
                }
            },
        }),
        register: build.mutation<AuthResponse, RegisterInput>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
            transformResponse: (raw: { success: true; data: AuthResponse }) => raw.data,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials(data))
                } catch {
                    // ignore
                }
            },
        }),
        logout: build.mutation<void, void>({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                } finally {
                    dispatch(clearCredentials())
                    dispatch(api.util.resetApiState())
                }
            },
        }),
        refresh: build.mutation<{ accessToken: string }, void>({
            query: () => ({ url: '/auth/refresh', method: 'POST' }),
            transformResponse: (raw: { success: true; data: { accessToken: string } }) => raw.data,
        }),
        getMe: build.query<User, void>({
            query: () => ({ url: '/auth/me', method: 'GET' }),
            transformResponse: (raw: { success: true; data: User }) => raw.data,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                dispatch(setHydrating(true))
                try {
                    const { data } = await queryFulfilled
                    dispatch(setUser(data))
                } catch {
                    dispatch(clearCredentials())
                } finally {
                    dispatch(setHydrating(false))
                }
            },
        }),
    }),
    overrideExisting: false,
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshMutation,
    useLazyGetMeQuery,
} = authApi
