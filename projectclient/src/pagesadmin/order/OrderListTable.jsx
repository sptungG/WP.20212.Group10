import {
  Col,
  Descriptions,
  Divider,
  Image,
  List,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { BsBoxSeam, BsThreeDots } from "react-icons/bs";
import { NOT_FOUND_IMG } from "src/common/constant";
import { checkValidColor, formatDate, setColorByStatus, sorterByDate } from "src/common/utils";
import Button from "src/components/button/Button";
import ChipTag from "src/components/chip/ChipTag";
import PaymentInfoTag from "src/components/chip/PaymentInfoTag";
import styled from "styled-components";
import { getTotalByDatakey } from "../DashboardPage";

const OrderListTable = ({
  data = [],
  onClickShowDetail = (p) => console.log(p),
  onClickChangeStatus = (p) => console.log(p),
}) => {
  const columns = [
    {
      title: "Thông tin đơn hàng",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
      render: (text, record) => <Typography.Text strong>{`#${text}`}</Typography.Text>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (text, { createdAt }) => (
        <Typography.Text>{formatDate(createdAt, "DD/MM/YYYY HH:mm:ss")}</Typography.Text>
      ),
      sorter: (a, b) => sorterByDate("createdAt")(a, b),
    },
    {
      title: "Khách hàng",
      dataIndex: ["shippingInfo", "name"],
      key: "shippingInfo",
      width: 180,
      ellipsis: true,
      render: (text, { shippingInfo }) => (
        <Space wrap={false} split={"·"} size={4}>
          <Typography.Text>{shippingInfo.name}</Typography.Text>
          <Typography.Text>{shippingInfo.phoneNo}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentInfo",
      key: "paymentInfo",
      width: 200,
      render: (text, { paymentInfo }) => <PaymentInfoTag paymentInfo={paymentInfo} />,
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 160,
      render: (text, { orderStatus }) => (
        <Tag color={setColorByStatus(orderStatus.value)}>{orderStatus.name}</Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 160,
      ellipsis: true,
      render: (text, { itemsPrice, shippingPrice, totalPrice, orderItems }) => (
        <Statistic
          prefix={
            <Typography.Text style={{ fontSize: 16, color: "#262626" }}>Tổng tiền:</Typography.Text>
          }
          groupSeparator=","
          value={totalPrice}
          className="justify-between"
          valueStyle={{ fontSize: 18, color: "#000" }}
          suffix={"$"}
        />
      ),
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: <BsThreeDots size={24} />,
      dataIndex: "_id",
      key: "action",
      width: 260,
      render: (text, record) => (
        <Space size={8} style={{ width: "100%" }}>
          <Button block onClick={() => onClickShowDetail(text)}>
            Xem chi tiết
          </Button>
          <Button block onClick={() => onClickChangeStatus(text)}>
            Đổi trạng thái
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <TableWrapper>
      <Table
        columns={columns}
        footer={() => ""}
        loading={!data}
        rowKey={(record) => record._id}
        dataSource={data}
        size="default"
        className="table-fixed-pagination"
        pagination={{
          total: data.length,
          showTotal: (total) => (
            <p style={{ marginRight: 16 }}>
              Tổng <b>{total}</b> đơn
            </p>
          ),
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
        }}
        expandable={{
          expandedRowRender: (record) => (
            <Row
              justify="end"
              gutter={[24, 0]}
              wrap={false}
              style={{
                marginLeft: 42,
                marginTop: 0,
              }}
            >
              <Col span={6} style={{ paddingTop: 12 }}>
                <List
                  grid={{ gutter: 12, column: 1 }}
                  loading={!data}
                  style={{ marginTop: -8 }}
                  dataSource={record.orderItems}
                  renderItem={(item) => (
                    <List.Item key={item._id}>
                      <List.Item.Meta
                        avatar={
                          <div className="orderitems-image">
                            <Image
                              src={item.saved_image}
                              fallback={NOT_FOUND_IMG}
                              preview={false}
                            />
                            <div className="orderitems-quantity">
                              <ChipTag icon={<BsBoxSeam size={16.5} />}>
                                x{item.saved_quantity}
                              </ChipTag>
                            </div>
                          </div>
                        }
                        title={
                          <Typography.Text ellipsis className="orderitems-name">
                            {item.saved_name}
                          </Typography.Text>
                        }
                        description={
                          <div className="orderitems-variant">
                            <Descriptions column={1} size="small">
                              {item.saved_variant.map((o, index) => (
                                <Descriptions.Item
                                  label={o.name}
                                  span={1}
                                  key={`variant_options_${o._id}_${index}`}
                                >
                                  {checkValidColor(o.value) ? (
                                    <Tag
                                      color={o.value}
                                      className={"tag"}
                                      style={{ height: 22, width: 22, margin: 0 }}
                                    >
                                      {" "}
                                    </Tag>
                                  ) : (
                                    <Tag
                                      color={"default"}
                                      className={"tag"}
                                      style={{ maxWidth: 43, margin: 0 }}
                                    >
                                      <Typography.Text ellipsis>{o.value}</Typography.Text>
                                    </Tag>
                                  )}
                                </Descriptions.Item>
                              ))}
                            </Descriptions>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Col>
              <Col span={6} className="border-lf">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Tên người nhận" span={2}>
                    <Typography.Text ellipsis style={{ maxWidth: 168 }}>
                      {record.shippingInfo.name}
                    </Typography.Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại" span={2}>
                    {record.shippingInfo.phoneNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="Khu vực" span={2}>
                    {record.shippingInfo.area}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tỉnh thành" span={2}>
                    {record.shippingInfo.city}
                  </Descriptions.Item>
                  <Descriptions.Item className="flex-col" label="Địa chỉ cụ thể" span={2}>
                    <Typography.Paragraph
                      ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
                      style={{ maxWidth: 260 }}
                    >
                      {record.shippingInfo.address}
                    </Typography.Paragraph>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={6} className="border-lf">
                <Descriptions size="small" layout="vertical">
                  <Descriptions.Item label="Ghi chú từ khách hàng">
                    <Typography.Paragraph
                      ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
                      style={{ maxWidth: 260 }}
                    >
                      {record.orderNote}
                    </Typography.Paragraph>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={6} style={{ display: "flex" }} className="border-lf">
                <Space
                  direction="vertical"
                  size={2}
                  style={{ marginLeft: "auto", width: "100%", maxWidth: 230 }}
                >
                  <Statistic
                    prefix={
                      <Typography.Text style={{ fontSize: 16, color: "#262626" }}>
                        Sản phẩm:
                      </Typography.Text>
                    }
                    groupSeparator=","
                    value={getTotalByDatakey(record.orderItems, "saved_quantity")}
                    className="justify-between"
                    valueStyle={{ fontSize: 18, color: "#000" }}
                  />
                  <Statistic
                    prefix={
                      <Typography.Text style={{ fontSize: 16, color: "#262626" }}>
                        Tạm tính:
                      </Typography.Text>
                    }
                    groupSeparator=","
                    value={record.itemsPrice}
                    className="justify-between"
                    valueStyle={{ fontSize: 18, color: "#000" }}
                    suffix={"$"}
                  />
                  <Statistic
                    prefix={
                      <Typography.Text style={{ fontSize: 16, color: "#262626" }}>
                        Phí vận chuyển:
                      </Typography.Text>
                    }
                    groupSeparator=","
                    value={record.shippingPrice}
                    className="justify-between"
                    valueStyle={{ fontSize: 18, color: "#000" }}
                    suffix={"$"}
                  />
                  <Divider plain style={{ margin: 0 }} />
                  <Statistic
                    prefix={
                      <Typography.Text style={{ fontSize: 16, color: "#262626" }}>
                        Tổng tiền:
                      </Typography.Text>
                    }
                    groupSeparator=","
                    value={record.totalPrice}
                    className="justify-between"
                    valueStyle={{ fontSize: 18, color: "#000" }}
                    suffix={"$"}
                  />
                </Space>
              </Col>
            </Row>
          ),
        }}
      />
    </TableWrapper>
  );
};
const TableWrapper = styled.div`
  background: #fff;
  padding-bottom: 24px;
  & .payment-tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    gap: 4px;
    overflow: hidden;
    margin-right: 0;
    transform: translateY(1.8px);
  }
  & .flex-col .ant-descriptions-item-container {
    flex-direction: column;
    & .ant-typography {
      margin: 0;
    }
  }
  & .justify-between .ant-statistic-content {
    width: 100%;
    display: flex;
    align-items: center;
    & .ant-statistic-content-value {
      margin-left: auto;
    }
  }
  & .ant-space-item .ant-tag {
    margin-right: 0;
  }
  & .w-full {
    width: 100%;
    & .ant-space-item .ant-tag {
      width: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
    }
  }
  & .border-lf.ant-col {
    border-left: 1px solid #eee;
  }
  & .orderitems {
    &-image {
      position: relative;
      width: 108px;
      height: 96px;
      & .ant-image {
        width: 100%;
        height: 100%;
      }
      & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &-image .orderitems-quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 6px 4px 4px 6px;
      border-radius: 8px 0 0 0;
      background: #d9d9d9;
    }
    &-item {
      & .ant-list-item-meta {
        margin: 0;
      }
    }
  }
`;

export default OrderListTable;
