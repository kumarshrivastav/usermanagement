import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    signInUserLoading: (state) => {
      state.user = null;
      state.error = null;
      state.loading = true;
    },
    signInUserSuccess: (state, action) => {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
    signInUserFailure: (state, action) => {
      state.user = null;
      state.error = action.payload;
      state.loading = false;
    },
    logoutLoading: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
  },
});

export const {
  signInUserFailure,
  signInUserLoading,
  signInUserSuccess,
  logoutFailure,
  logoutLoading,
  logoutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} = userSlice.actions;
export default userSlice.reducer;
