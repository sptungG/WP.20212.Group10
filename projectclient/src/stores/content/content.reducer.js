import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: { data: [] },
  reducers: {
    setContent(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setContent } = contentSlice.actions;

export default contentSlice.reducer;
