import {
  Avatar, Badge,
  Divider, Drawer, List, Space, Typography
} from "antd";
import VirtualList from "rc-virtual-list";
import { useEffect, useRef, useState } from "react";
import {
  BsArrowClockwise,
  BsArrowUpRight, BsCheck2,
  BsCheck2All
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setVisibleType } from "src/stores/header/header.reducer";
import styled from "styled-components";
import Button from "../button/Button";

const SideMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  & .side-item {
    padding: 8px 24px;
    width: 100%;
  }
  & .side-item.side-item-nav {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 8px;
    & .side-icon {
      flex: 0 0 32px;
      font-size: 20px;
      color: ${(props) => props.theme.generatedColors[5]};
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    & .side-content {
      flex: 1 1 auto;
      font-size: 16px;
    }
  }

  & .side-user {
    margin-top: auto;
  }

  & .side-item:hover {
    background-color: ${(props) => props.theme.generatedColors[0]};
  }
`;

const DrawerTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const fakeDataUrl =
  "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo";

const SideBarAdmin = ({ type = "notification" }) => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const ref = useRef(null);
  const [containerHeight, setContainerHeight] = useState(400);
  const headerState = useSelector((state) => state.headerState);
  const [data, setData] = useState([]);

  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(body.results);
      });
  };

  useEffect(() => {
    if (headerState.visibletype === "sideadminnotivisible") {
      setContainerHeight(ref.current.getBoundingClientRect().height);
      appendData();
    }
  }, [headerState.visibletype === "sideadminnotivisible"]);

  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === containerHeight) {
      appendData();
    }
  };

  const onRefresh = () => {
    console.log("");
  };

  return (
    <Drawer
      closeIcon={null}
      title={
        type === "notification" ? (
          <DrawerTitleWrapper>
            <Badge count={1} overflowCount={99}>
              <Typography.Title level={4} style={{ margin: 0 }}>
                Thông báo
              </Typography.Title>
            </Badge>
            <Space size={2} split={<Divider type="vertical" />}>
              <Button
                icon={<BsCheck2All size={20} />}
                shape={"circle"}
                type="dashed"
                onClick={onRefresh}
                disabled
              ></Button>
              <Button
                icon={<BsArrowClockwise size={20} />}
                shape={"circle"}
                type="dashed"
                onClick={onRefresh}
                disabled
              ></Button>
            </Space>
          </DrawerTitleWrapper>
        ) : null
      }
      placement={type === "notification" ? "right" : "left"}
      onClose={() => dispatch(setVisibleType(""))}
      visible={headerState.visibletype === "sideadminnotivisible"}
      width={376}
      className="hide-close"
      bodyStyle={{ padding: "4px 12px 24px 24px" }}
    >
      {/* <SideMenuWrapper></SideMenuWrapper> */}
      <div ref={ref} style={{ height: "100%" }}>
        <List>
          <VirtualList
            data={data}
            height={containerHeight}
            itemHeight={47}
            itemKey="email"
            onScroll={onScroll}
          >
            {(item) => (
              <List.Item key={item.email}>
                <List.Item.Meta
                  avatar={<Avatar size={40} src={item.picture.large} />}
                  title={item.name.last}
                  description={
                    <Typography.Paragraph type="secondary" ellipsis className="paragraph" style={{marginBottom: 1}}>
                      {item.email}
                    </Typography.Paragraph>
                  }
                />
                <Space size={0} split={<Divider type="vertical" />}>
                  <Button
                    icon={<BsCheck2 size={20} />}
                    shape={"circle"}
                    type="text"
                    onClick={onRefresh}
                  ></Button>
                  <Button type="link">
                    <Link to={`/admin/dashboard`}>
                      <BsArrowUpRight />
                    </Link>
                  </Button>
                </Space>
              </List.Item>
            )}
          </VirtualList>
        </List>
      </div>
    </Drawer>
  );
};

const NotiItem = ({ icon, children, linkto = "/" }) => {
  return (
    <Link to={linkto} className="side-item side-item-noti">
      <div className="side-icon">{icon}</div>
      <div className="side-content">{children}</div>
    </Link>
  );
};

const NavItem = ({ icon, children, linkto = "/" }) => {
  return (
    <Link to={linkto} className="side-item side-item-nav">
      <div className="side-icon">{icon}</div>
      <div className="side-content">{children}</div>
    </Link>
  );
};

export default SideBarAdmin;
