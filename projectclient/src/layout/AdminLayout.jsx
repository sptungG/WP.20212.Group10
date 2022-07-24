import { Affix, Col, Layout, Menu, Row } from "antd";
import { useState } from "react";
import {
  BsBoxSeam,
  BsCollection,
  BsFileText,
  BsGear,
  BsHouseDoor,
  BsLayoutWtf,
  BsPeople,
  BsStar,
} from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "src/components/nav/Breadcrumb";
import HeaderAdmin from "src/components/nav/HeaderAdmin";
import LogoAndText from "src/components/nav/LogoAndText";
import SideBarAdmin from "src/components/nav/SideBarAdmin";
import styled from "styled-components";

const ContentWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  & .layout-content {
    margin: 24px;
  }
`;
const MenuWrapper = styled.div`
  & .side-menu .side-menu-item {
    display: flex;
    align-items: center;
    padding-left: calc(50% - 12px);
    & > * {
      flex-shrink: 0;
    }
  }
`;

const LogoWrapper = styled.div`
  height: 64px;
  padding: 16px 24px;
  width: 100%;
`;

const items = [
  {
    label: <Link to="/admin/dashboard">Tổng quan</Link>,
    icon: <BsHouseDoor size={22} />,
    key: "/admin/dashboard",
    className: "side-menu-item",
  },
  {
    label: <Link to="/admin/orders">Đơn hàng</Link>,
    icon: <BsFileText size={22} />,
    key: "/admin/orders",
    className: "side-menu-item",
  },
  {
    label: <Link to="/admin/categories">Danh mục</Link>,
    icon: <BsCollection size={22} />,
    key: "/admin/categories",
    className: "side-menu-item",
  },
  {
    label: <Link to="/admin/products">Sản phẩm</Link>,
    icon: <BsBoxSeam size={22} />,
    key: "/admin/products",
    className: "side-menu-item",
  },
  {
    label: <Link to="/admin/combos">Bộ sưu tập</Link>,
    icon: <BsLayoutWtf size={22} />,
    key: "/admin/combos",
    className: "side-menu-item",
  },
  {
    label: <Link to="/admin/reviews">Đánh giá</Link>,
    icon: <BsStar size={22} />,
    key: "/admin/reviews",
    className: "side-menu-item",
  },
  {
    label: <Link to="/admin/users">Khách hàng</Link>,
    icon: <BsPeople size={22} />,
    key: "/admin/users",
    className: "side-menu-item",
  },
  {
    label: <Link to="/admin/setting">Cài đặt</Link>,
    icon: <BsGear size={22} />,
    key: "/admin/setting",
    className: "side-menu-item",
  },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  let { pathname } = useLocation();

  return (
    <Layout>
      <Affix offsetTop={0.001}>
        <Layout.Sider
          id="admin-sidebar"
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ minHeight: "100vh", overflow: "auto" }}
        >
          <LogoWrapper>
            <LogoAndText fontSize={!collapsed ? 24 : 0} logoSize={!collapsed ? 24 : 30} />
          </LogoWrapper>
          <MenuWrapper>
            <Menu
              theme="dark"
              defaultSelectedKeys={[pathname]}
              style={{ height: "auto" }}
              mode="inline"
              className="side-menu"
              items={items}
            />
          </MenuWrapper>
        </Layout.Sider>
      </Affix>
      <ContentWrapper>
        <HeaderAdmin />
        <Layout.Content className="layout-content">
          <SideBarAdmin />
          <Breadcrumb/>
          {children}
        </Layout.Content>
      </ContentWrapper>
    </Layout>
  );
};

export default AdminLayout;
