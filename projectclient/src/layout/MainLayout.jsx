import Footer from "src/components/nav/Footer";
import Header from "src/components/nav/Header";
import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import SideBar from "src/components/nav/SideBar";

const MainWrapper = styled.main`
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const MainLayout = ({ hideSearch = false, children }) => {
  return (
    <>
      <Header hideSearch={hideSearch} />
      <SideBar />
      <MainWrapper>{children}</MainWrapper>
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
