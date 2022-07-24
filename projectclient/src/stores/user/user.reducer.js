import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "user",
  initialState: { data: null },
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
