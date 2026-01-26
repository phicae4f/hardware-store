import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import applicationSlice from "./slices/applicationsSlice";
import reviewsSlice from "./slices/reviewsSlice";
import workerAuthSlice from "./slices/workerSlice"


export const store = configureStore({
    reducer: {
        auth: authSlice,
        applications: applicationSlice,
        reviews: reviewsSlice,
        worker: workerAuthSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch