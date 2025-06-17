import { createSlice, type PayloadAction } from "@reduxjs/toolkit"; // Use type-only import
import type { User } from "@/types/user";
// Import the correct User type

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // Add token field
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null, // Initialize token
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Update payload type to use the imported User
    loginSuccess: (state, action: PayloadAction<User & { token: string }>) => {
      // Payload is User data + token
      const { token, ...userData } = action.payload; // Separate token from user data
      state.isAuthenticated = true;
      state.user = userData; // Store only user data
      state.token = token; // Store token separately
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null; // Clear token on logout
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
