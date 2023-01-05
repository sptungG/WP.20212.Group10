import { Avatar, Card, Col, message, Popconfirm, Row, Space, Table, Tag, Typography } from "antd";
import { rgba } from "polished";
import { useEffect, useState } from "react";
import { BsCheckLg, BsThreeDots, BsXLg } from "react-icons/bs";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NOT_FOUND_IMG } from "src/common/constant";
import { useAuth } from "src/common/useAuth";
import { formatDate, sorterByWords } from "src/common/utils";
import Button from "src/components/button/Button";
import LocalSearch from "src/components/input/LocalSearch";
import { dateFormat } from "src/components/picker/RangePicker";
import AdminLayout from "src/layout/AdminLayout";
import { useGetFilteredUsersQuery, useUpdateUserMutation } from "src/stores/user/user.query";
import styled from "styled-components";

const isActive = (status) => status === "active";

const UserListPage = () => {
  const { user } = useAuth();
  const [usersFilterValue, setUsersFilterValue] = useState({ keyword: "", sort: "" });

  const { data: usersFilteredQuery, isSuccess: getUsersSuccess } =
    useGetFilteredUsersQuery(usersFilterValue);
  const [updateUser, { isLoading: updateUserLoading }] = useUpdateUserMutation();
  const usersFilteredData = getUsersSuccess ? usersFilteredQuery?.data : [];

  const handleUnlock = async (userId) => {
    try {
      message.loading("Đang xử lý...");
      const updateUserRes = await updateUser({ userId, initdata: { status: "active" } }).unwrap();
      message.success("Cập nhật trạng thái thành công");
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleLock = async (userId) => {
    try {
      message.loading("Đang xử lý...");
      const updateUserRes = await updateUser({ userId, initdata: { status: "inactive" } }).unwrap();
      message.info("Khóa tài khoản thành công");
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleLocalSearch = (values) => {
    setUsersFilterValue({ ...usersFilterValue, keyword: values.keySearch });
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => (
        <Space>
          <Avatar
            size={48}
            src={record.picture}
            fallback={NOT_FOUND_IMG}
            key={`table_${record._id}`}
          />
          <Space size={2} direction="vertical">
            <Space size={4} wrap={false}>
              <Typography.Text ellipsis>{text}</Typography.Text>
              <Tag>{record.role}</Tag>
            </Space>
            <Typography.Text ellipsis>{record.email}</Typography.Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => sorterByWords("name")(a, b),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 240,
      render: (text, record) => (
        <Typography.Text ellipsis>{formatDate(text, "DD-MM-YYYY HH:mm:ss")}</Typography.Text>
      ),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 240,
      render: (text, record) => (
        <Typography.Text ellipsis>{formatDate(text, "DD-MM-YYYY HH:mm:ss")}</Typography.Text>
      ),
    },
    {
      title: <BsThreeDots size={24} />,
      dataIndex: "",
      key: "action",
      width: 180,
      render: (text, record) => (
        <Space size="middle">
          {isActive(record.status) ? (
            <Popconfirm
              title={
                <p style={{ margin: 0 }}>
                  Bạn chắc chắn muốn khoá tài khoản <b>{record._id}</b> ?
                </p>
              }
              placement="topRight"
              okText={<BsCheckLg />}
              cancelText={<BsXLg />}
              onConfirm={() => handleLock(record._id)}
            >
              <Button size="large" type="text" danger icon={<FaLock />}></Button>
            </Popconfirm>
          ) : (
            <Button
              size="large"
              type="link"
              onClick={() => handleUnlock(record._id)}
              icon={<FaUnlockAlt />}
            ></Button>
          )}
        </Space>
      ),
    },
  ];
  return (
    <AdminLayout>
      <ContentWrapper>
        <LocalSearch
          placeholder="Tìm kiếm người dùng theo Tên, email..."
          onFinish={handleLocalSearch}
          onValuesChange={handleLocalSearch}
        />
        <Row gutter={24} wrap={false}>
          <Col flex="auto">
            <Card title="Danh sách người dùng" loading={!getUsersSuccess} bodyStyle={{ padding: 0 }}>
              {getUsersSuccess && (
                <Table
                  className="table-fixed-pagination"
                  rowKey={(record) => record._id}
                  columns={columns}
                  footer={() => ""}
                  dataSource={usersFilteredData}
                  size="default"
                  rowClassName={(record) => record._id === user._id && "disabled-row"}
                  pagination={{
                    total: usersFilteredData.length,
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
  & .disabled-row {
    background-color: #f5f5f5;
    pointer-events: none;
  }
`;

export default UserListPage;
