import { Menu, Button } from "antd";
import React from "react";
import {
  AppstoreOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";

import { Logo } from "./LogoAndText";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const ViewButton = (props) => {
  const { collapsed,setCollapsed } = props;
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <span
      role="img"
      aria-label="desktop"
      className="anticon anticon-desktop ant-menu-item-icon"
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          
        }}
      >
        {<UnorderedListOutlined />}
      </Button>
    </span>
  );
};

const items = (collapsed,setCollapsed)=>{ 
  return [
  getItem(
    "SetUpStore",
    "1",
    <Logo logoSize={36} fontSize={24} fontWeight={500} />
  ),
  getItem(collapsed?"view all":"close view", "13", <ViewButton collapsed={collapsed} setCollapsed={setCollapsed} />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("Option 3", "3", <ContainerOutlined />),
  getItem("Navigation One", "sub1", <MailOutlined />, [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
    getItem("Option 7", "7"),
    getItem("Option 8", "8"),
  ]),
  getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 11", "11"),
      getItem("Option 12", "12"),
    ]),
  ]),
  
];
}

const HomeMenu = (props) => {
  const { collapsed, setCollapsed } = props;

  return (
    <div
      style={{
        width: "80%",
        display: "flex",
        "flexDirection": "row",
        "justifyContent": "center",
        "alignItems": "center",
      }}
    >
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items(collapsed,setCollapsed)}
      />
    </div>
  );
};



export default HomeMenu;
