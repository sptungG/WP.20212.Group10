import React from "react";
import Gallery from "src/components/images/Gallery";
import styled from "styled-components";
import LogoAndText from "src/components/nav/LogoAndText";
import { useMediaQuery } from "react-responsive";
import SideBar from "src/components/nav/SideBar";
import Header from "src/components/nav/Header";
import { Row } from "antd";
import AnimateBgSquares from "src/components/images/AnimateBgSquares";

const PageStyles = styled.div`
  position: relative;
  overflow: hidden;
  .modal-overlay #area {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-width: 1440px;
    z-index: -1;
    flex-shrink: 0;
  }

  .modal-content {
    width: 100%;
    margin: 0 auto;
    z-index: 10;
  }
`;

const GalleryBgLayoutWithHeader = ({ hideSearch = false, children, backgroundClassName = "" }) => {
  const mediaBelow768 = useMediaQuery({ maxWidth: 768 });
  return (
    <PageStyles>
      <div className="modal-overlay">
        {!mediaBelow768 && (
          <AnimateBgSquares count={24} column={4} className={backgroundClassName} />
        )}
      </div>
      <Header hideSearch={hideSearch} />
      <SideBar />
      <div className="modal-content">{children}</div>
    </PageStyles>
  );
};

export default GalleryBgLayoutWithHeader;
