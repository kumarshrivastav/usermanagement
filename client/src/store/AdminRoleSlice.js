import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  error: null,
  loading: false,
};

export const AdminRoleSlice = createSlice({
  name: "adminroleslice",
  initialState,
  reducers: {
    updateUserByAdminStart: (state) => {
      state.loading = true;
      state.user = null;
      state.error = null;
    },
    updateUserByAdminSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    updateUserByAdminFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    userAddedByAdminStart: (state) => {
      state.loading = true;
      state.error = null;
      state.user = null;
    },
    userAddedByAdminSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    userAddedByAdminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    },
  },
});

export const {
  updateUserByAdminStart,
  updateUserByAdminFailure,
  updateUserByAdminSuccess,
  userAddedByAdminFailure,
  userAddedByAdminSuccess,
  userAddedByAdminStart,
} = AdminRoleSlice.actions;
export default AdminRoleSlice.reducer;
