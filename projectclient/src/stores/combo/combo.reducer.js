import { createSlice } from "@reduxjs/toolkit";

const comboSlice = createSlice({
  name: "combo",
  initialState: { data: [] },
  reducers: {
    setCombo(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setCombo } = comboSlice.actions;

export default comboSlice.reducer;
