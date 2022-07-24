import { Badge, Divider, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useAuth } from "src/common/useAuth";
import { setVisibleType } from "src/stores/header/header.reducer";
import styled from "styled-components";
import Button from "../button/Button";
import ThemeButton from "../button/ThemeButton";
import AutocompleteSearchAdmin from "../input/AutocompleteSearchAdmin";
import ProfileDropdownMenu from "./ProfileDropdown";

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
  background-color: #fff;
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  gap: 24px;
  flex-wrap: nowrap;
  position: relative;
  .header-left {
    max-width: 480px;
    flex: 1 0 auto;
  }
`;

const HeaderAdmin = () => {
  const mediaBelow768 = useMediaQuery({ maxWidth: 768 });
  const mediaAbove1280 = useMediaQuery({ minWidth: 1280 });
  const mediaAbove1350 = useMediaQuery({ minWidth: 1350 });
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const { isSignedIn, user, credential } = useAuth();
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

  return (
    <HeaderWrapper>
      <div className="header-left" ref={ref}>
        <AutocompleteSearchAdmin width={width || 480} inputRounded={10} isAdmin />
      </div>

      <div className="header-center"></div>
      <div className="header-right">
        <Space split={<Divider type="vertical" />} wrap={false} size={2}>
          {isSignedIn && <ProfileDropdownMenu />}

          {!isSignedIn && (
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

          <Space wrap={false} size={16} style={{ margin: "0 8px" }}>
            <Badge count={1}>
              <FaBell
                size={22}
                color="#595959"
                style={{ cursor: "pointer" }}
                onClick={() => dispatch(setVisibleType("sideadminnotivisible"))}
              />
            </Badge>
          </Space>

          <ThemeButton
            className="btn-themedropdown"
            type="dropdown"
            btntype={"text"}
            iconSize={22}
            iconColor={"#595959"}
          />
        </Space>
      </div>
    </HeaderWrapper>
  );
};

export default HeaderAdmin;
