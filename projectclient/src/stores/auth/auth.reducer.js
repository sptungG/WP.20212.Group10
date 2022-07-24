import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { authtoken: null, refreshToken: null, emailVerifiedValue: "" },
  reducers: {
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
    setAuthtokenCredential(state, action) {
      state.authtoken = action.payload;
    },
    setEmailVerifiedValue(state, action) {
      state.emailVerifiedValue = action.payload;
    },
  },
});

export const { setEmailVerifiedValue, setAuthtokenCredential, setRefreshToken } = authSlice.actions;

export default authSlice.reducer;
