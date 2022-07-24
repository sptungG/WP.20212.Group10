import React from "react";
import styled, { keyframes } from "styled-components";

const cube = keyframes`
  0% {
    transform: rotate(45deg) rotateX(-25deg) rotateY(25deg); }
  50% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(25deg); }
  100% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(385deg); }
`;

const CubeWrapper = styled.div`
  width: ${(props) => props.size + "px"};
  height: ${(props) => props.size + "px"};
  transform-style: preserve-3d;
  &:hover {
    animation: ${cube} 4s infinite ease;
  }
  & div {
    background-color: transparent;
    height: 100%;
    position: absolute;
    width: 100%;
    border: ${(props) => `2px solid ${props.theme.generatedColors[4]}`};
  }
  & div:nth-of-type(1) {
    transform: translateZ(calc(${(props) => -20 * (props.size / 40) + "px"})) rotateY(180deg);
  }
  & div:nth-of-type(2) {
    transform: rotateY(-270deg) translateX(50%);
    transform-origin: top right;
  }
  & div:nth-of-type(3) {
    transform: rotateY(270deg) translateX(-50%);
    transform-origin: center left;
  }
  & div:nth-of-type(4) {
    transform: rotateX(90deg) translateY(-50%);
    transform-origin: top center;
  }
  & div:nth-of-type(5) {
    transform: rotateX(-90deg) translateY(50%);
    transform-origin: bottom center;
  }
  & div:nth-of-type(6) {
    transform: translateZ(calc(${(props) => 20 * (props.size / 40) + "px"}));
  }
`;
const CubeLoadingWrapper = styled.div`
  width: ${(props) => props.size + "px"};
  height: ${(props) => props.size + "px"};
  transform-style: preserve-3d;
  animation: ${cube} 4s infinite ease;
  & div {
    background-color: transparent;
    height: 100%;
    position: absolute;
    width: 100%;
    border: ${(props) => `2px solid ${props.theme.generatedColors[4]}`};
  }
  & div:nth-of-type(1) {
    transform: translateZ(calc(${(props) => -20 * (props.size / 40) + "px"})) rotateY(180deg);
  }
  & div:nth-of-type(2) {
    transform: rotateY(-270deg) translateX(50%);
    transform-origin: top right;
  }
  & div:nth-of-type(3) {
    transform: rotateY(270deg) translateX(-50%);
    transform-origin: center left;
  }
  & div:nth-of-type(4) {
    transform: rotateX(90deg) translateY(-50%);
    transform-origin: top center;
  }
  & div:nth-of-type(5) {
    transform: rotateX(-90deg) translateY(50%);
    transform-origin: bottom center;
  }
  & div:nth-of-type(6) {
    transform: translateZ(calc(${(props) => 20 * (props.size / 40) + "px"}));
  }
`;
const LogoCube = ({ loading = false, size = 40 }) => {
  if (loading)
    return (
      <CubeLoadingWrapper size={size} id="logo-cube">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </CubeLoadingWrapper>
    );
  return (
    <CubeWrapper size={size} id="logo-cube">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </CubeWrapper>
  );
};

export default LogoCube;
