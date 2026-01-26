import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Worker {
  id: number;
  email: string;
  name: string;
  phone: string;
  specialty: string;
  role: "worker";
}

interface WorkerAuthState {
  worker: Worker | null;
  workerToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkerAuthState = {
  worker: localStorage.getItem("worker")
    ? JSON.parse(localStorage.getItem("worker")!)
    : null,
  workerToken: localStorage.getItem("workerToken"),
  isLoading: false,
  error: null,
};

export const registerWorker = createAsyncThunk(
  "workerAuth/registerWorker",
  async (
    credentials: {
      email: string;
      password: string;
      name: string;
      phone: string;
      specialty: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/worker-auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка регистрации");
      }

      const data = await response.json();

      return data.data;
    } catch (error: any) {
      rejectWithValue(error.message || "Ошибка регистрации");
    }
  },
);

export const loginWorker = createAsyncThunk(
  "workerAuth/loginWorker",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/worker-auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка входа в аккаунт");
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка входа в аккаунт");
    }
  },
);

const workerAuthSlice = createSlice({
  name: "workerAuth",
  initialState,
  reducers: {
    workerLogout: (state) => {
      state.worker = null;
      state.workerToken = null;
      localStorage.removeItem("worker");
      localStorage.removeItem("workerToken");
    },
    clearErrorWorkerAuth: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //REGISTER
      .addCase(registerWorker.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerWorker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.worker = action.payload.worker;
        state.workerToken = action.payload.token;
        localStorage.setItem("worker", JSON.stringify(action.payload.worker));
        localStorage.setItem("workerToken", action.payload.token);
      })
      .addCase(registerWorker.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Ошибка регистрации";
      })
      //LOGIN
      .addCase(loginWorker.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWorker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.worker = action.payload.worker;
        state.workerToken = action.payload.token;

        localStorage.setItem("worker", JSON.stringify(action.payload.worker));
        localStorage.setItem("workerToken", action.payload.token);
      })

      .addCase(loginWorker.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Ошибка авторизации";
      });
  },
});

export const { workerLogout, clearErrorWorkerAuth } = workerAuthSlice.actions;
export default workerAuthSlice.reducer;
