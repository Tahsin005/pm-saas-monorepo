import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@repo/shared-types'
import type { RootState } from './index'

interface AuthState {
    user: User | null
    accessToken: string | null
    hydrating: boolean
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    hydrating: true,
}

export function syncToken(token: string | null) {
    ;(window as Window & { __AUTH_TOKEN__?: string | null }).__AUTH_TOKEN__ = token
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, { payload }: PayloadAction<{ user: User; accessToken: string }>) {
            state.user = payload.user
            state.accessToken = payload.accessToken
            state.hydrating = false
            syncToken(payload.accessToken)
        },
        setUser(state, { payload }: PayloadAction<User>) {
            state.user = payload
            state.hydrating = false
        },
        setAccessToken(state, { payload }: PayloadAction<string>) {
            state.accessToken = payload
            syncToken(payload)
        },
        setHydrating(state, { payload }: PayloadAction<boolean>) {
            state.hydrating = payload
        },
        clearCredentials(state) {
            state.user = null
            state.accessToken = null
            state.hydrating = false
            syncToken(null)
        },
    },
})

export const { setCredentials, setUser, setAccessToken, setHydrating, clearCredentials } =
    authSlice.actions
export default authSlice.reducer

export const selectIsAuthenticated = (state: RootState) => state.auth.accessToken !== null
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectAuthHydrating = (state: RootState) => state.auth.hydrating
