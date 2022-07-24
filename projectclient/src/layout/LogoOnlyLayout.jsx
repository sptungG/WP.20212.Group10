import { Layout } from "antd";
import ThemeButton from "src/components/button/ThemeButton";
import LogoAndText from "src/components/nav/LogoAndText";
import styled from "styled-components";
const PageStyles = styled.div`
  padding: 48px;
  .header{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
  }
`;
const LogoOnlyLayout = ({ children }) => {
  return (
    <PageStyles>
      <header className="header">
        <LogoAndText logoSize={40} fontSize={24} />
        <ThemeButton type="dropdown" btntype="dashed" shape="circle" size="large"/>
      </header>
      <Layout.Content>{children}</Layout.Content>
    </PageStyles>
  );
};

export default LogoOnlyLayout;
