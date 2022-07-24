import React from "react";
import Gallery from "src/components/images/Gallery";
import styled from "styled-components";
import LogoAndText from "src/components/nav/LogoAndText";
import { useMediaQuery } from "react-responsive";

const PageStyles = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 1440px;
    height: 234px;
    background: url("https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/valley-white.svg?alt=media&token=15f3857c-980e-4c0f-9c81-6adca8636525")
      top right / cover no-repeat;
    transform: translate(200px, -520px) rotate(152deg) scale(2);
    z-index: 19;
  }
  .modal-overlay #gallery {
    position: fixed;
    top: 0;
    left: 0;
    transform: rotate(-28deg) translateY(-36%);
    width: 100vw;
    height: 100vh;
    min-width: 1440px;
    z-index: 0;
    flex-shrink: 0;
  }
  .modal-overlay #gallery .gallery-skeleton {
    height: 300px;
  }
  .header .logo-wrapper {
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 20;
  }
  .modal-content {
    z-index: 20;
    padding: 0 48px;
    min-width: 320px;
    max-width: 480px;
    width: 100%;
    height: 100vh;

    backdrop-filter: blur(10px);
    background-color: ${(props) =>
      props.theme.mode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(20, 20, 20, 0.8)"};
    box-shadow: 0px 0px 16px 16px rgba(140, 140, 140, 0.25);
    @media screen and (max-width: 374.98px) {
      padding: 0 24px;
      height: 100%;
      max-height: 100%;
    }
  }
  .modal-content form {
    width: 100%;
  }
`;

const GalleryBgLayout = ({ children }) => {
  const mediaBelow768 = useMediaQuery({ maxWidth: 768 });
  return (
    <PageStyles>
      <div className="modal-overlay">{!mediaBelow768 && <Gallery count={24} column={4} />}</div>
      <header className="header">
        <LogoAndText logoSize={30} fontSize={28} fontWeight={700} />
      </header>
      <div className="modal-content">{children}</div>
    </PageStyles>
  );
};

export default GalleryBgLayout;
