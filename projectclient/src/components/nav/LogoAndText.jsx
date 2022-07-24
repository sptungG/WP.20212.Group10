import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import LogoCube from "./LogoCube";

const gradient = keyframes`
0% {
  background-position: 0 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0 50%;
}`;

const LogoWrapper = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-shrink: 0;
  column-gap: 4;
  .logo-text {
    font-size: ${(props) => props.fontSize + "px"} !important;
    font-weight: ${(props) => props.fontWeight} !important;
    animation: ${gradient} 5s ease-in-out infinite;
    background: ${(props) =>
      `linear-gradient(to right,${props.theme.generatedColors[4]},${props.theme.generatedColors[2]},${props.theme.generatedColors[4]},${props.theme.primaryColor})`};
    background-size: 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const LogoAndText = ({ logoSize = 0, fontSize = 0, fontWeight = 500 }) => {
  return (
    <Link to="/" className="logo-wrapper">
      <LogoWrapper fontSize={fontSize} fontWeight={fontWeight}>
        {logoSize > 0 && <LogoCube size={logoSize} />}
        {fontSize > 0 && <span className="logo-text">SetupStore</span>}
      </LogoWrapper>
    </Link>
  );
};

export default LogoAndText;
