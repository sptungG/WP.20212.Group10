import { createSlice } from "@reduxjs/toolkit";
const initialHeaderState = {
  visibletype: "",
  dataRedirectStatus: "noLoading",
};

const headerSlice = createSlice({
  name: "header",
  initialState: initialHeaderState,
  reducers: {
    setVisibleType(state, action) {
      state.visibletype = action.payload;
    },
    setDataRedirectStatus(state, action) {
      state.dataRedirectStatus = action.payload;
    },
  },
});

export const { setDataRedirectStatus, setVisibleType } =
  headerSlice.actions;

export default headerSlice.reducer;
