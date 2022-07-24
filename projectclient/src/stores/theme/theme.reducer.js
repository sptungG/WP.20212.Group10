import { createSlice } from "@reduxjs/toolkit";
import { generate } from "@ant-design/colors";

const initialThemeProvider = {
  mode: "light",
  locale: "vi",
  generatedColors: ['#f8f0ff', '#ebd4ff', '#d5abff', '#bc82ff', '#9b56f5', '#772ce8', '#581bc2', '#3d0e9c', '#260575', '#17024f'],
  primaryColor: "#772ce8",
};

const themeProviderSlice = createSlice({
  name: "themeProvider",
  initialState: initialThemeProvider,
  reducers: {
    setThemeProvider(state, action) {
      const { mode = "light", locale = "vi", primaryColor = "#772ce8" } = action.payload;
      state.mode = mode;
      state.locale = locale;
      state.primaryColor = primaryColor;
      state.generatedColors = generate(primaryColor);
    },
  },
});

export const { setThemeProvider } = themeProviderSlice.actions;

export default themeProviderSlice.reducer;
