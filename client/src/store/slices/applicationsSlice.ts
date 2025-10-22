import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../store"

export interface Application {
    id: number,
    client_name: string,
    phone: string,
    email: string | null,
    note_message: string | null,
    service_type: string,
    status: 'Новая' | 'В работе' | 'Выполнена',
    admin_notes: string | null,
    created_at: string,
    updated_at: string
}

interface ApplicationState {
    applications: Application[],
    isLoading: boolean,
    error: string | null
}

const initialState: ApplicationState = {
    applications: [],
    isLoading: false,
    error: null
}

export const fetchUserApplications = createAsyncThunk(
    "applications/fetchUserApplications",
    async(_, {getState, rejectWithValue}) => {
        try {
            const {auth} = getState() as RootState // функция, которая возвращает ВСЕ состояние Redux
            const token = auth.token

            if(!token) {
                throw new Error("Отсутствует токен")
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/applications/my-applications`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            if(!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Ошибка загрузки заявок")
            }

            const result = await response.json()
            return result.data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка при загрузке заявок")
        }
    }
)

export const fetchAllApplications = createAsyncThunk(
    "applications/fetchAllApplications",
    async(_, {getState, rejectWithValue}) => {
        try {
            const state = getState() as RootState
            const token = state.auth.token

            if(!token) {
                throw new Error("Отсутствует токен")
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/applications/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if(!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Ошибка загрузки всех заявок")
            }
            const result = await response.json()
            return result.data
        } catch (error: any) {
            rejectWithValue(error.message || "Ошибка загрузки всех заявок")
        }
    }
)

export const updateApplication = createAsyncThunk(
    "applications/updateApplication",
    async({ id, status, admin_notes }: { id: number; status?: string; admin_notes?: string }, {getState, rejectWithValue}) => {
        try {
            const state = getState() as RootState
            const token = state.auth.token

            if(!token) {
                throw new Error("Отсутствует токен");
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({status, admin_notes})
            })

            if(!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Ошибка при обновлении заявки")
            }

            const result = await response.json()
            return {id, status, admin_notes, message: result.message}
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка при обновлении заявки")
        }
    }
)

const applicationSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        clearApplications: (state) => {
            state.applications = []
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserApplications.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUserApplications.fulfilled, (state, action) => {
                state.isLoading = false
                state.applications = action.payload
            })
            .addCase(fetchUserApplications.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(fetchAllApplications.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchAllApplications.fulfilled, (state, action) => {
                state.isLoading = false
                state.applications = action.payload
            })
            .addCase(fetchAllApplications.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    }
})

export const {clearApplications} = applicationSlice.actions
export default applicationSlice.reducer