import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { data: [] },
  reducers: {
    setCart(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setCart } = cartSlice.actions;

export default cartSlice.reducer;
