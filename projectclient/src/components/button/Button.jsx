import React from "react";
import { Button as AntdButton } from "antd";
import styled from "styled-components";
import classNames from "classnames";
import { useChangeThemeProvider } from "src/common/useChangeThemeProvider";

const BtnContent = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
`;

const Button = ({
  icon = null,
  loading = false,
  disabled = false,
  type = "default",
  block = false,
  children,
  shape = "default",
  className = "",
  htmlType = "button",
  ghost = false,
  size = "middle",
  extraType = "",
  onClick = () => null,
  style = {},
  ...rest
}) => {
  const { themeProvider } = useChangeThemeProvider();

  let btnstyle = style;

  if (extraType === "btntag" && type === "link") {
    btnstyle.backgroundColor = themeProvider.generatedColors[0];
  }

  return (
    <AntdButton
      className={className}
      type={type}
      shape={shape}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      block={block}
      htmlType={htmlType}
      icon={icon}
      ghost={ghost}
      size={size}
      style={btnstyle}
      {...rest}
    >
      {children}
    </AntdButton>
  );
};

export default Button;
