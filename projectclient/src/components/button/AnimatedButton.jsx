import { rgba } from "polished";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import styled, { keyframes } from "styled-components";

const AnimatedButton = ({ onClick = () => "", children = "Tiếp tục mua hàng" }) => {
  return (
    <ButtonWrapper className="ctan" onClick={onClick}>
      <span>{children}</span>
      <div className="icon">
        <BsArrowRight size={18} />
      </div>
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.primaryColor};
  background: none;
  border: none;
  padding: 12px 18px;
  position: relative;
  & span {
    font-weight: 500;
    text-decoration: underline;
  }
  & .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
    color: ${(props) => props.theme.primaryColor};
    transition: transform 0.25s 0.4s cubic-bezier(0, 0, 0.5, 2);
  }
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%) translateX(calc(100% + 64px));
    width: 45px;
    height: 45px;
    background: ${(props) => rgba(props.theme.generatedColors[1], 0.6)};
    border: 1px solid ${(props) => props.theme.generatedColors[0]};
    border-radius: 50px;
    transition: transform 0.25s 0.25s cubic-bezier(0, 0, 0.5, 2),
      width 0.25s cubic-bezier(0, 0, 0.5, 2);
    z-index: -1;
  }
  &:hover {
    & span {
      text-decoration: none;
    }
    &::before {
      width: 100%;
      transform: translateY(-50%) translateX(-18px);
      transition: transform 0.25s cubic-bezier(0, 0, 0.5, 2),
        width 0.25s 0.25s cubic-bezier(0, 0, 0.5, 2);
    }
    & .icon {
      transform: translateX(3px);
    }
  }
`;

export default AnimatedButton;
