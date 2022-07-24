import { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { categories: [], filter: null },
  reducers: {
    setCategoriesFiltered(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { setCategoriesFiltered } = categoriesSlice.actions;

export default categoriesSlice.reducer;
