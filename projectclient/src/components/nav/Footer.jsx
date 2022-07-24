import { Row, Space } from "antd";
import React from "react";
import styled from "styled-components";
import LogoAndText from "./LogoAndText";

const FooterWrapper = styled.footer`
  margin-top: auto;
  border-top: 2px solid #f0f0f0;
  background-color: #262626;
  color: #f0f0f0;
  padding: 16px 48px 32px 48px;
  .copyright-text {
    padding-left: 4px;
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <Row className="footer-wrap" align="middle" justify="space-between">
        <Space direction="vertical" size={8}>
          <LogoAndText logoSize={40} fontSize={20} />
          <span className="copyright-text">Copyright © Team02</span>
        </Space>
        <Space size={8}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png"
            height={"32px"}
            width={"64px"}
            alt="Visa_Inc"
          />
          <img
            src="https://alodaohan.com/wp-content/uploads/2020/11/the-mastercard-la-gi-4.jpg"
            height={"32px"}
            width={"64px"}
            alt="mastercard"
          />
          <img
            src="https://subiz.com.vn/blog/wp-content/uploads/2014/05/paypal.jpg"
            height={"32px"}
            width={"64px"}
            alt="paypal"
          />
        </Space>
      </Row>
    </FooterWrapper>
  );
};

export default Footer;
