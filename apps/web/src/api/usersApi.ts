import { api } from '@/store/api'

export interface UserProfile {
    id: string
    email: string
    createdAt: string
}

export interface UpdateMeInput {
    email?: string
}

export const usersApi = api.injectEndpoints({
    endpoints: (build) => ({
        getMe: build.query<UserProfile, void>({
            query: () => ({ url: '/users/me', method: 'GET' }),
            transformResponse: (raw: { success: true; data: UserProfile }) => raw.data,
            providesTags: [{ type: 'User' as const, id: 'ME' }],
        }),
        updateMe: build.mutation<UserProfile, UpdateMeInput>({
            query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
            transformResponse: (raw: { success: true; data: UserProfile }) => raw.data,
            invalidatesTags: [{ type: 'User' as const, id: 'ME' }],
        }),
    }),
    overrideExisting: false,
})

export const { useGetMeQuery, useUpdateMeMutation } = usersApi
