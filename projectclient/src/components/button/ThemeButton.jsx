import { Dropdown } from "antd";
import { useState } from "react";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { FaMagic, FaSun } from "react-icons/fa";
import { useChangeThemeProvider } from "src/common/useChangeThemeProvider";
import styled from "styled-components";
import SketchColorPicker from "../picker/SketchColorPicker";
import Button from "./Button";

const DropdownWrapper = styled.div`
  margin-top: 8px;
  background-color: #fff;
  box-shadow: rgb(0 0 0 / 25%) 0px 1px 4px;
  padding: 8px;
  overflow: hidden;
  & .twitter-picker {
    box-shadow: none !important;
    margin: -15px -14px -9px -15px;
    & input {
      width: 62px !important;
    }
  }
  & .btn-theme {
    margin-top: 8px;
  }
`;

const ThemeButton = ({ type = "icon", btntype, iconSize = 24, iconColor = "#595959", ...rest }) => {
  const { themeProvider, changeThemeProvider } = useChangeThemeProvider();
  const [visible, setVisible] = useState(false);
  if (type === "icon")
    return (
      <Button
        className="btn-theme-icon"
        type="dashed"
        shape="circle"
        size="large"
        disabled
        onClick={() =>
          changeThemeProvider({
            ...themeProvider,
            mode: themeProvider.mode === "light" ? "dark" : "light",
          })
        }
        style={{ color: themeProvider.primaryColor }}
      >
        {themeProvider.mode === "light" ? <FaSun size={26} /> : <BsFillMoonStarsFill size={24} />}
      </Button>
    );
  return (
    <Dropdown
      trigger={["click"]}
      onVisibleChange={(flag) => setVisible(flag)}
      visible={visible}
      overlay={
        <DropdownWrapper>
          <SketchColorPicker />
          <Button
            className="btn-theme"
            size="middle"
            onClick={() =>
              changeThemeProvider({
                ...themeProvider,
                mode: themeProvider.mode === "light" ? "dark" : "light",
              })
            }
            block
            disabled
          >
            {themeProvider.mode === "light" ? (
              <FaSun size={16} />
            ) : (
              <BsFillMoonStarsFill size={14} />
            )}
            {themeProvider.mode}
          </Button>
        </DropdownWrapper>
      }
    >
      <Button type={btntype} {...rest}>
        <FaMagic size={iconSize} color={iconColor} />
      </Button>
    </Dropdown>
  );
};

export default ThemeButton;
