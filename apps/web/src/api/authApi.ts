import { api } from '@/store/api'
import type { User, LoginInput, RegisterInput } from '@repo/shared-types'

export interface AuthResponse {
    user: User
    accessToken: string
}

export const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<AuthResponse, LoginInput>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
            transformResponse: (raw: { success: true; data: AuthResponse }) => raw.data,
        }),
        register: build.mutation<AuthResponse, RegisterInput>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
            transformResponse: (raw: { success: true; data: AuthResponse }) => raw.data,
        }),
        logout: build.mutation<void, void>({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
        }),
        refresh: build.mutation<{ accessToken: string }, void>({
            query: () => ({ url: '/auth/refresh', method: 'POST' }),
            transformResponse: (raw: { success: true; data: { accessToken: string } }) => raw.data,
        }),
        getMe: build.query<User, void>({
            query: () => ({ url: '/auth/me', method: 'GET' }),
            transformResponse: (raw: { success: true; data: User }) => raw.data,
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
