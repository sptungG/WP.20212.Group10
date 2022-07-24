import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: { data: [] },
  reducers: {
    setOrder(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setOrder } = orderSlice.actions;

export default orderSlice.reducer;
