import { createSlice } from "@reduxjs/toolkit";

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

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    }
})

export default authSlice.reducer