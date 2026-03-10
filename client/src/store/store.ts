import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import applicationSlice from "./slices/applicationsSlice";
import reviewsSlice from "./slices/reviewsSlice";
import workerSlice from "./slices/workerSlice";


export const store = configureStore({
    reducer: {
        auth: authSlice,
        applications: applicationSlice,
        reviews: reviewsSlice,
        worker: workerSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch