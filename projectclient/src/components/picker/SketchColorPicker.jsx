import React from "react";
import { TwitterPicker } from "react-color";
import { useChangeThemeProvider } from "src/common/useChangeThemeProvider";
import "./style.css";

const SketchColorPicker = () => {
  const { themeProvider, changeThemeProvider } = useChangeThemeProvider();

  const onColorChange = (value) => {
    changeThemeProvider({ ...themeProvider, primaryColor: value });
  };

  return (
    <TwitterPicker
      width="134px"
      triangle="hide"
      colors={["#D4380D", "#1D39C4", "#772ce8"]}
      color={themeProvider.primaryColor}
      onChange={({ hex }) => {
        onColorChange(hex);
      }}
    ></TwitterPicker>
  );
};

export default SketchColorPicker;
