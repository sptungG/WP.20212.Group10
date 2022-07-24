import { Avatar, Button, Dropdown, Menu, Space, Typography } from "antd";
import { auth } from "src/common/firebase-config";
import { signOut } from "firebase/auth";
import React from "react";
import { FaAlignRight, FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiHistoryFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setAuthtokenCredential, setRefreshToken } from "src/stores/auth/auth.reducer";
import { setUser } from "src/stores/user/user.reducer";

const AvatarWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
  position: relative;
`;

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

const dropdownTextStyle = {
  padding: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontWeight: 600,
  gap: 16,
};

const LogoutItem = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(setUser(null));
      dispatch(setAuthtokenCredential(null));
      dispatch(setRefreshToken(null));
      navigate("/");
    } catch (error) {
      console.log("handleLogout ~ error", error);
    }
  };
  return (
    <div style={dropdownTextStyle} onClick={logout}>
      <span style={{ fontWeight: "normal" }}>Logout</span> <FiLogOut size={22} />
    </div>
  );
};

const ProfileDropdownMenu = () => {
  let navigate = useNavigate();
  const { data: user } = useSelector((state) => state.user);

  const items = [
    {
      label: (
        <Link to="/profile" style={dropdownTextStyle}>
          <Space direction="vertical" size={0}>
            <Typography.Text>Tài khoản</Typography.Text>
            <Typography.Text type="secondary" style={{ width: 100 }} ellipsis>
              {user.name}
            </Typography.Text>
          </Space>
          <FaRegUserCircle size={22} />
        </Link>
      ),
      key: "profile",
    },
    {
      label: (
        <Link to="/profile" style={dropdownTextStyle}>
          Đơn hàng <RiHistoryFill size={22} />
        </Link>
      ),
      key: "history",
    },
    {
      label: <LogoutItem />,
      key: "logout",
    },
  ];

  const menu = <Menu style={{ borderRadius: 8, padding: 8 }} items={items} />;
  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
      <Button size="large" shape="circle" onClick={() => ""} title="Đi đến trang cá nhân">
        <AvatarWrapper>
          <Avatar
            size={33}
            src={user.picture ?? "https://source.unsplash.com/random?vietnam,nature"}
            alt="avatar"
          />
        </AvatarWrapper>
      </Button>
    </Dropdown>
  );
};

export default ProfileDropdownMenu;
