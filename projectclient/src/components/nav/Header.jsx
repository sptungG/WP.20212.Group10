import { Avatar, Badge, Divider, Dropdown, Menu, Space, Typography } from "antd";
import CollapsedButton from "src/components/button/CollapsedButton";
import AutocompleteSearch from "src/components/input/AutocompleteSearch";
import React, { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import LogoAndText from "./LogoAndText";
import { Link } from "react-router-dom";
import ProfileDropdownMenu from "./ProfileDropdown";
import Button from "../button/Button";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaSignInAlt, FaStore, FaUserAlt, FaUserPlus } from "react-icons/fa";
import ThemeButton from "../button/ThemeButton";
import { useMediaQuery } from "react-responsive";
import { useRef } from "react";
import { BsBoxArrowInRight, BsPersonFill, BsPersonPlus } from "react-icons/bs";
import { useAddToCart } from "src/common/useAddToCart";
import { rgba } from "polished";
import { useAuth } from "src/common/useAuth";

const MenuItemWrapper = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  gap: 16px;
  color: #595959;
  a {
    color: #595959;
  }
`;

const HeaderWrapper = styled.header`
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  gap: 24px;
  flex-wrap: nowrap;
  position: relative;
  background-color: ${rgba("#fff", 0.5)};
  backdrop-filter: blur(10px);

  z-index: 1;
  .header-center {
    max-width: 480px;
    margin: 0 auto;
    flex: 1 0 auto;
  }
  @media screen and (min-width: 1280px) {
    .header-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      max-width: 480px;
    }
  }
`;

const Header = ({ hideSearch = false }) => {
  const mediaBelow768 = useMediaQuery({ maxWidth: 768 });
  const mediaAbove1280 = useMediaQuery({ minWidth: 1280 });
  const mediaAbove1350 = useMediaQuery({ minWidth: 1350 });
  const { cart, myCartRefetch } = useAddToCart();
  const { isSignedIn, user, credential } = useAuth();
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const headerState = useSelector((state) => state.headerState);

  useEffect(() => {
    function handleResize() {
      setWidth(ref.current.getBoundingClientRect().width);
    }
    window.addEventListener("resize", handleResize);
    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });
  useLayoutEffect(() => {
    if (isSignedIn) myCartRefetch();
  }, [isSignedIn]);

  const items = [
    {
      label: (
        <MenuItemWrapper>
          <Link to="/login">Đăng nhập</Link>
          <BsBoxArrowInRight size={22} />
        </MenuItemWrapper>
      ),
      key: "login",
    },
    {
      label: (
        <MenuItemWrapper>
          <Link to="/register">Đăng kí</Link>
          <BsPersonPlus size={22} />
        </MenuItemWrapper>
      ),
      key: "register",
    },
  ];

  const menu = <Menu style={{ borderRadius: 8, padding: 8 }} items={items} />;

  return (
    <HeaderWrapper>
      <div className="header-left">
        <Space wrap={false}>
          <LogoAndText fontSize={24} logoSize={24} />
          {!mediaBelow768 && <CollapsedButton />}
        </Space>
      </div>

      <div className="header-center" ref={ref}>
        {!hideSearch && !mediaBelow768 && <AutocompleteSearch width={width || 480} />}
      </div>
      <div className="header-right">
        {!mediaBelow768 && (
          <Space split={<Divider type="vertical" />} wrap={false}>
            {isSignedIn && <ProfileDropdownMenu />}

            {!isSignedIn && mediaAbove1280 && (
              <Space wrap={false}>
                <Button
                  shape="round"
                  type="link"
                  extraType="btntag"
                  disabled={headerState.dataRedirectStatus === "loading"}
                  loading={headerState.dataRedirectStatus === "loading"}
                >
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  disabled={headerState.dataRedirectStatus === "loading"}
                >
                  <Link to="/register">Đăng kí</Link>
                </Button>
              </Space>
            )}

            {!isSignedIn && !mediaAbove1280 && (
              <Dropdown
                trigger={["click"]}
                overlay={menu}
                placement="bottomRight"
                overlayStyle={{ top: 54 }}
              >
                <Button
                  disabled={headerState.dataRedirectStatus === "loading"}
                  loading={headerState.dataRedirectStatus === "loading"}
                  icon={<BsPersonFill size={28} />}
                  shape="circle"
                  style={{ padding: 2 }}
                ></Button>
              </Dropdown>
            )}

            <Space wrap={false} size={16}>
              <Link to="/store">
                <FaStore size={30} />
              </Link>
              <Badge count={cart ? cart.products.length : 0} overflowCount={99}>
                <Link to="/cart">
                  <FaShoppingCart size={28} />
                </Link>
              </Badge>
            </Space>

            {mediaAbove1350 && (
              <ThemeButton
                className="btn-themedropdown"
                type="dropdown"
                btntype={"text"}
                iconColor={"#595959"}
              />
            )}
          </Space>
        )}
        {mediaBelow768 && <CollapsedButton />}
      </div>
    </HeaderWrapper>
  );
};

export default Header;
