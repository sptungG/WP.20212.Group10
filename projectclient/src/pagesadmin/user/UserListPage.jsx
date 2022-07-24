import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Image,
  List,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  BsBoxArrowUpRight,
  BsBoxSeam,
  BsCartCheck,
  BsChatLeftText,
  BsEye,
  BsHeart,
  BsLayoutWtf,
  BsStar,
  BsThreeDots,
} from "react-icons/bs";
import { rgba } from "polished";
import { Link } from "react-router-dom";
import { NOT_FOUND_IMG } from "src/common/constant";
import { checkValidColor, sorterByWords } from "src/common/utils";
import Button from "src/components/button/Button";
import MasonryLayout from "src/components/images/MasonryLayout";
import LocalSearch from "src/components/input/LocalSearch";
import AdminLayout from "src/layout/AdminLayout";
import { useGetAllProductsFilteredQuery } from "src/stores/product/product.query";
import { useGetFilteredUsersQuery } from "src/stores/user/user.query";
import styled from "styled-components";

const findImageById = (id, images) => {
  return images.find((item) => item._id === id);
};

const UserListPage = () => {
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [usersFilterValue, setUsersFilterValue] = useState({ keyword: "", sort: "" });

  const { data: usersFilteredQuery, isSuccess: getUsersSuccess } =
    useGetFilteredUsersQuery(usersFilterValue);

  const handleLocalSearch = (values) => {
    setUsersFilterValue({ ...usersFilterValue, keyword: values.keySearch });
  };

  useEffect(() => {
    if (usersFilteredQuery?.data) {
      setSelectedUsers(usersFilteredQuery?.data[0]);
    }
  }, [usersFilteredQuery?.data]);

  const handleRemove = (productId) => {
    console.log("handleRemove ~ productId", productId);
  };
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => (
        <Space>
          <Avatar size={48} src={record.picture} fallback={NOT_FOUND_IMG} key={`table_${record._id}`} />
          <Space size={2} direction="vertical">
            <Typography.Text ellipsis>{text}</Typography.Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => sorterByWords("name")(a, b),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 320,
      ellipsis: true,
      render: (text, record) => <Typography.Text ellipsis>{text}</Typography.Text>,
      sorter: (a, b) => sorterByWords("email")(a, b),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (text, record) => <Typography.Text ellipsis>{text}</Typography.Text>,
      sorter: (a, b) => sorterByWords("role")(a, b),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (text, record) => <Typography.Text ellipsis>{text}</Typography.Text>,
      sorter: (a, b) => sorterByWords("status")(a, b),
    },
    {
      title: <BsThreeDots size={24} />,
      dataIndex: "_id",
      key: "actions",
      width: 160,
      render: (text, record) => (
        <Typography.Link target="_blank" onClick={() => {setSelectedUsers(record)}}>
          <Link to={`/admin/users/${selectedUsers?._id}`}>Xem chi tiết</Link>
        </Typography.Link>
      ),
    },
  ];
  return (
    <AdminLayout>
      <ContentWrapper>
        <LocalSearch onFinish={handleLocalSearch} />
        <Row gutter={24} wrap={false}>
          <Col flex="auto">
            <Card
              title="Danh sách người dùng"
              loading={!getUsersSuccess}
            >
              {getUsersSuccess && (
                <Table
                  className="table-fixed-pagination"
                  rowKey={(record) => record._id}
                  rowSelection={{
                    type: "radio",
                    selectedRowKeys: [selectedUsers?._id],
                    defaultSelectedRowKeys: [usersFilteredQuery.data[0]?._id],
                    onChange: (selectedRowKeys, selectedRows) => {
                      setSelectedUsers(selectedRows[0]);
                      console.log(
                        `selectedRowKeys: ${selectedRowKeys}`,
                        "selectedRows: ",
                        selectedRows
                      );
                    },
                  }}
                  columns={columns}
                  footer={() => ""}
                  dataSource={usersFilteredQuery.data}
                  size="default"
                  pagination={{
                    total: usersFilteredQuery.data.length,
                    showTotal: (total) => (
                      <p style={{ marginRight: 16 }}>
                        Tổng <b>{total}</b>
                      </p>
                    ),
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "30", "50"],
                  }}
                />
              )}
            </Card>
          </Col>
        </Row>
      </ContentWrapper>
    </AdminLayout>
  );
};

const ContentWrapper = styled.div`
  margin-bottom: 68px;
  & .content-top {
    margin-bottom: 24px;
  }
  & .content-middle {
    background: #fff;
    padding: 24px;
  }
  & .card-reactions {
    height: fit-content;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    margin-bottom: 16px;
    & .reaction {
      width: fit-content;
      height: fit-content;
      padding: 2px 8px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      background: transparent;
      color: ${(props) => props.theme.generatedColors[9]};
      font-size: 14px;
      border-radius: 5px;

      margin-top: 0px;
      overflow: hidden;
      &::before {
        content: "";
        width: 100%;
        height: 100%;
        background-color: #f8f9fa;
        position: absolute;
        z-index: -1;
        top: 0px;
        left: 0px;
      }
      & > span {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
      }
      & > h4 {
        font-size: inherit;
        color: inherit;
        margin-bottom: 0;
      }

      &:nth-child(1) {
        color: #00b4d8;
        background: ${rgba("#00b4d8", 0.25)};
      }
      &:nth-child(2) {
        color: #ffb703;
        background: ${rgba("#ffb703", 0.25)};
      }
      &:nth-child(3) {
        color: #ffb703;
        background: ${rgba("#ffb703", 0.25)};
      }
      &:nth-child(4) {
        color: #ff0054;
        background: ${rgba("#ff0054", 0.25)};
      }
    }
  }
`;

export default UserListPage;
