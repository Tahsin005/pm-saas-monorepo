import { api } from '@/store/api'
import type { UpdateMeInput, User } from '@repo/shared-types'

export const usersApi = api.injectEndpoints({
    endpoints: (build) => ({
        getMe: build.query<User, void>({
            query: () => ({ url: '/users/me', method: 'GET' }),
            transformResponse: (raw: { success: true; data: User }) => raw.data,
            providesTags: [{ type: 'User' as const, id: 'ME' }],
        }),
        updateMe: build.mutation<User, UpdateMeInput>({
            query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
            transformResponse: (raw: { success: true; data: User }) => raw.data,
            invalidatesTags: [{ type: 'User' as const, id: 'ME' }],
        }),
    }),
    overrideExisting: false,
})

export const { useGetMeQuery, useUpdateMeMutation } = usersApi
