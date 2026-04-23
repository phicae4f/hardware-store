import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: null | {
    id: number;
    login: string;
    role: "admin" | "user" | "worker";
    //worker
    workerId?: string;
    name?: string;
    phone?: string;
    email?: string;
    specialty?: string;
    isActive?: boolean;
    requiresPasswordChange?: boolean;
  };
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: (() => {
    const userData = localStorage.getItem("user");
    const workerData = localStorage.getItem("worker");
    if (userData) {
      return JSON.parse(userData);
    }
    if (workerData) {
      return JSON.parse(workerData);
    }
    return null;
  })(),
  token: localStorage.getItem("token") || localStorage.getItem("workerToken"),
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { login: string; password: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка авторизации");
    }

    return await response.json();
  },
);
export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: { login: string; password: string }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
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

    return await response.json();
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("workerToken");
      localStorage.removeItem("worker");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      if (action.payload?.role === "worker") {
        localStorage.setItem("worker", JSON.stringify(action.payload));
      } else {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;

        if (action.payload.data.user.role === "worker") {
          localStorage.setItem("workerToken", action.payload.data.token);
          localStorage.setItem(
            "worker",
            JSON.stringify(action.payload.data.user),
          );
        } else {
          localStorage.setItem("token", action.payload.data.token);
          localStorage.setItem(
            "user",
            JSON.stringify(action.payload.data.user),
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Ошибка авторизации";
      })
      //REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem("token", action.payload.data.token);
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Ошибка регистрации";
      });
  },
});
export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
