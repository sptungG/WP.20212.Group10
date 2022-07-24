import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: { products: [], filter: null },
  reducers: {
    setProductsFiltered(state, action) {
      state.emailVerifiedValue = action.payload;
    },
  },
});

export const { setProductsFiltered } = productsSlice.actions;

export default productsSlice.reducer;
