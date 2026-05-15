import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
  token: string | null;
  user: any | null;
  loading: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
  },
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;
