import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: { data: [] },
  reducers: {
    setReview(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setReview } = reviewSlice.actions;

export default reviewSlice.reducer;
