import React from "react";
import styled, { keyframes } from "styled-components";

const waterfall = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-250%); }
  40%,
  60% {
    opacity: 1;
    transform: translateY(0); }
  100% {
    opacity: 0;
    transform: translateY(250%); }
`;

const size = 60;
const ratio = size / 20;

const WaterfallWrapper = styled.div`
  & div {
    animation: ${waterfall} 1.5s infinite;
    background-color: ${(props) => props.theme.generatedColors[0]};
    height: ${size + "px"};
    left: 50%;
    margin-top: -10px;
    opacity: 0;
    position: absolute;
    top: 50%;
    width: ${size + "px"};
  }
  & div:nth-of-type(1) {
    animation-delay: 0.25s;
    margin-left: calc(-10px * ${ratio});
    background-color: ${(props) => props.theme.generatedColors[4]};
  }
  & div:nth-of-type(2) {
    animation-delay: 0.5s;
    margin-left: calc(15px * ${ratio});
    background-color: ${(props) => props.theme.generatedColors[3]};
  }
  & div:nth-of-type(3) {
    animation-delay: 0.75s;
    margin-left: calc(-35px * ${ratio});
    background-color: ${(props) => props.theme.generatedColors[2]};
  }
  & div:nth-of-type(4) {
    animation-delay: 1s;
    margin-left: calc(40px * ${ratio});
    background-color: ${(props) => props.theme.generatedColors[1]};
  }
  & div:nth-of-type(5) {
    animation-delay: 1.25s;
    margin-left: calc(-60px * ${ratio});
  }
`;

const WaterfallLoader = () => {
  return (
    <WaterfallWrapper>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </WaterfallWrapper>
  );
};

export default WaterfallLoader;
