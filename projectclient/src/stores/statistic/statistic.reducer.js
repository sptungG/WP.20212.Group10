import { createSlice } from "@reduxjs/toolkit";

const statisticSlice = createSlice({
  name: "statistic",
  initialState: { data: [] },
  reducers: {
    setStatistic(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setStatistic } = statisticSlice.actions;

export default statisticSlice.reducer;
