import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemeProvider } from "src/stores/theme/theme.reducer";

export function useChangeThemeProvider() {
  const providerValue = useSelector((state) => state.themeProvider);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (providerValue === "light") window.less.modifyVars(lightVars);
  //   else window.less.modifyVars(darkVars);
  // }, [providerValue])

  return {
    themeProvider: providerValue,
    changeThemeProvider: (value) => dispatch(setThemeProvider(value)),
  };
}
