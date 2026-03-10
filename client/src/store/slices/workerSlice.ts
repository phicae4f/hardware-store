import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface Worker {
  id: number;
  name: string;
  phone: string;
  email: string;
  specialty: string;
  login: string;
  isActive?: boolean;
  requiresPasswordChange?: boolean;
}

interface WorkerState {
  workers: Worker[];
  currentWorker: Worker | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  tempPassword: string | null;
  successMessage: string | null;
}

const initialState: WorkerState = {
  workers: [],
  currentWorker: localStorage.getItem("worker")
    ? JSON.parse(localStorage.getItem("worker")!)
    : null,
  token: localStorage.getItem("workerToken"),
  isLoading: false,
  error: null,
  tempPassword: null,
  successMessage: null
};

export const createWorker = createAsyncThunk(
  "worker/createWorker",
  async (
    workerData: {
      name: string;
      login: string;
      phone: string;
      email: string;
      specialty: string;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error("Требуется авторизация");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/workers/create-worker`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Не удалось зарегистрировать работника",
        );
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Не удалось зарегистрировать работника");
    }
  },
);

const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    clearWorkerError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    clearTempPassword: (state) => {
      state.tempPassword = null
    },
    logoutWorker: (state) => {
      state.currentWorker = null
      state.token = null
      localStorage.removeItem("workerToken")
      localStorage.removeItem("token")
    }
  },
  extraReducers: (builder) => {
    builder
      //CREATE NEW WORKER
      .addCase(createWorker.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.tempPassword = null;
        state.successMessage = null
      })
      .addCase(createWorker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || "Рабочий успешно создан";

        if (action.payload.data?.tempPassword) {
          state.tempPassword = action.payload.data.tempPassword;
        }

        if (action.payload.data) {
          const workerData = action.payload.data;
          const newWorker: Worker = {
            id: workerData.id,
            name: workerData.name,
            login: workerData.login,
            email: workerData.email,
            phone: workerData.phone,
            specialty: workerData.specialty,
            isActive: workerData.is_active !== false,
            requiresPasswordChange: workerData.requires_password_change || true,
          };
          state.workers.push(newWorker);
        }
      })
      .addCase(createWorker.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Не удалось создать работника";
      });
  },
});


export const { clearWorkerError, clearSuccessMessage, clearTempPassword, logoutWorker } = workerSlice.actions;

export const selectWorkers = (state: RootState) => state.worker.workers
export const selectCurrentWorker = (state: RootState) => state.worker.currentWorker
export const selectWorkerToken = (state: RootState) => state.worker.token
export const selectWorkerLoading  = (state: RootState) => state.worker.isLoading
export const selectWorkerError  = (state: RootState) => state.worker.error
export const selectWorkerTempPassword   = (state: RootState) => state.worker.tempPassword

export default workerSlice.reducer;
