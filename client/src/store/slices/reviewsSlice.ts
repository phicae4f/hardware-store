import { createSlice } from "@reduxjs/toolkit";

interface Review {
    id: number,
    application_id: number,
    user_id: number,
    client_name: string,
    rating: number,
    comment: string,

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

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {

    }
})