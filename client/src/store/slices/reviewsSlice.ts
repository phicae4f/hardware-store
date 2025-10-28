import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface Review {
    id: number,
    application_id: number,
    user_id: number,
    client_name: string,
    rating: number,
    comment: string,
    created_at: string,

}

interface ReviewState {
    reviews: Review[],
    isLoading: boolean,
    error: string | null
}

const initialState:ReviewState = {
    reviews: [],
    isLoading: false,
    error: null
}

export const createReview = createAsyncThunk(
    "reviews/createReview",
    async ({application_id, client_name, rating, comment}: {application_id: number; client_name: string; rating: number; comment: string},  {getState, rejectWithValue}) => {
        try {
            const state = getState() as RootState
            const token = state.auth.token

            if(!token) {
                throw new Error("Отсутствует токен");
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({application_id, client_name, rating, comment})
            })

            if(!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Ошибка создания отзыва")
            }

            const result = await response.json()
            return result.data
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка при создании отзыва")
        }
    }
)
export const fetchUserReviews = createAsyncThunk(
    "reviews/fetchUserReviews",
    async(_, {getState, rejectWithValue}) => {
        try {
            const state = getState() as RootState
            const token = state.auth.token

            if(!token) {
                throw new Error("Отсутствует токен")
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/my-reviews`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if(!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Ошибка загрузки отзывов")
            }
            const result = await response.json()
            return result.data
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка при загрузке отзывов")
        }
    }
)
export const fetchAllReviews = createAsyncThunk(
    "reviews/fetchAllReviews",
    async(_, {getState, rejectWithValue}) => {
        try {
            const state = getState() as RootState
            const token = state.auth.token

            if(!token) {
                throw new Error("Отсутствует токен")
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if(!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Не удалось загрузить список отзывов")
            }

            const result = await response.json()
            return result.data
        } catch (error: any) {
            rejectWithValue(error.message || "Не удалось загрузить список отзывов")
        }
    }
)

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        //CREATE REVIEW
            .addCase(createReview.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.isLoading = false
                state.reviews.push(action.payload)
            })
            .addCase(createReview.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
        //FETCH USER REVIEWS
            .addCase(fetchUserReviews.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUserReviews.fulfilled, (state, action) => {
                state.isLoading = false
                state.reviews = action.payload
            })
            .addCase(fetchUserReviews.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
        //FETCH ALL REVIEWS
            .addCase(fetchAllReviews.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchAllReviews.fulfilled, (state, action) => {
                state.isLoading = false
                state.reviews = action.payload
            })
            .addCase(fetchAllReviews.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
    }
})


export const { clearReviews, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;