import { Space, Typography } from "antd";
import classNames from "classnames";
import { rgba } from "polished";
import React from "react";
import styled from "styled-components";
const ChipWrapper = styled.div`
  &.colorful {
    color: ${(props) => props.color || "#434343"};
    background: ${(props) => rgba(props.color || "#434343", 0.2)};
  }
  &.rounded.colorful {
    padding: 0 6px;
    border-radius: 6px;
  }
  & .content {
    font-size: ${(props) => props.fontSize};
  }
  & .ant-space-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;

const ChipTag = ({
  fontSize = 16,
  size = 2,
  split = "·",
  icon,
  color = "#434343",
  children,
  className,
  onClick = () => console.log(),
}) => {
  return (
    <ChipWrapper fontSize={fontSize} color={color} className={classNames("chip-tag", className)}>
      <Space size={size} split={split} align="center" onClick={onClick}>
        {icon}
        {fontSize > 0 && <span className="content">{children}</span>}
      </Space>
    </ChipWrapper>
  );
};

export default ChipTag;
