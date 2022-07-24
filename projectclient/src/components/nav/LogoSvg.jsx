import React from "react";
import { useChangeThemeProvider } from "src/common/useChangeThemeProvider";

const LogoSvg = () => {
  const { themeProvider } = useChangeThemeProvider();
  const { generatedColors } = themeProvider;
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width="212px"
      height="212px"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        width: "100%",
        height: "100%",
        backgroundSize: "initial",
        backgroundRepeatY: "initial",
        backgroundRepeatX: "initial",
        backgroundPositionY: "initial",
        backgroundPositionX: "initial",
        backgroundOrigin: "initial",
        backgroundColor: "initial",
        backgroundClip: "initial",
        backgroundAttachment: "initial",
        animationPlayState: "paused",
      }}
    >
      <g
        className="ldl-scale"
        style={{
          transformOrigin: "50% 50%",
          transform: "rotate(0deg) scale(1, 1)",
          animationPlayState: "paused",
        }}
      >
        <path
          fill={generatedColors[2]}
          d="M58.904 70c0 4.399-3.206 8.063-7.404 8.778V88.5h27.328c5.333 0 9.672-4.339 9.672-9.672V51.5H75.904V50c0-3.256-2.648-5.905-5.904-5.905S64.096 46.744 64.096 50v1.5H51.5v9.722c4.198.715 7.404 4.379 7.404 8.778z"
          style={{ fill: generatedColors[2], animationPlayState: "paused" }}
        ></path>
        <path
          fill={generatedColors[6]}
          d="M70 41.095c4.398 0 8.063 3.206 8.778 7.405H88.5V21.172c0-5.333-4.339-9.672-9.672-9.672H51.5v12.595H50c-3.256 0-5.904 2.649-5.904 5.905s2.648 5.905 5.904 5.905h1.5V48.5h9.722c.716-4.199 4.38-7.405 8.778-7.405z"
          style={{ fill: generatedColors[6], animationPlayState: "paused" }}
        ></path>
        <path
          fill={generatedColors[9]}
          d="M41.096 30c0-4.399 3.206-8.063 7.404-8.778V11.5H21.172c-5.333 0-9.672 4.339-9.672 9.672V48.5h12.596V50c0 3.256 2.648 5.905 5.904 5.905s5.904-2.649 5.904-5.905v-1.5H48.5v-9.722c-4.198-.715-7.404-4.379-7.404-8.778z"
          style={{ fill: generatedColors[9], animationPlayState: "paused" }}
        ></path>
        <path
          fill={generatedColors[3]}
          d="M30 58.905c-4.398 0-8.063-3.206-8.778-7.405H11.5v27.328c0 5.333 4.339 9.672 9.672 9.672H48.5V75.905H50c3.256 0 5.904-2.649 5.904-5.905S53.256 64.095 50 64.095h-1.5V51.5h-9.722c-.716 4.199-4.38 7.405-8.778 7.405z"
          style={{ fill: generatedColors[3], animationPlayState: "paused" }}
        ></path>
        <metadata xmlnsd="https://loading.io/stock/" style={{ animationPlayState: "paused" }}>
          <dName style={{ animationPlayState: "paused" }}>puzzle</dName>

          <dTags style={{ animationPlayState: "paused" }}>
            puzzle,maze,merge,combine,solve,step,flow,infographics
          </dTags>

          <dLicense style={{ animationPlayState: "paused" }}>by</dLicense>

          <dSlug style={{ animationPlayState: "paused" }}>acogix</dSlug>
        </metadata>
      </g>
    </svg>
  );
};

export default LogoSvg;
