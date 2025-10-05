import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    user: null | {
        id: number,
        login: string,
        role: "admin" | "user"
    },
    token: string | null,
    isLoading: boolean,
    error: string | null
}


const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    isLoading: false,
    error: null,
}

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: {login: string, password: string}) => {

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Ошибка авторизации")
        }

        return await response.json()
    }
)
export const registerUser = createAsyncThunk(
    "auth/register",
    async (credentials: {login: string, password: string}) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })

        if(!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Ошибка регистрации")
        }

        return await response.json()
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            localStorage.removeItem("token")
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        //LOGIN
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload.data.user
            state.token = action.payload.data.token
            localStorage.setItem("token", action.payload.data.token)
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || "Ошибка авторизации"
        })
        //REGISTER
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.user = action.payload.data.user
            state.token = action.payload.data.token
            localStorage.setItem("token", action.payload.data.token)
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || "Ошибка регистрации"
        })
    }
})
export const {logout, clearError} = authSlice.actions;
export default authSlice.reducer