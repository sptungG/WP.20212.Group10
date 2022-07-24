import {
  Alert,
  Avatar,
  Badge,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useLayoutEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NOT_FOUND_IMG } from "src/common/constant";
import { useAddToCart } from "src/common/useAddToCart";
import { useAuth } from "src/common/useAuth";
import { checkValidColor, findImageById } from "src/common/utils";
import Button from "src/components/button/Button";
import UpdateAddressDrawer from "src/components/form/UpdateAddressDrawer";
import InputNumberGroup from "src/components/input/InputNumberGroup";
import CheckoutSteps from "src/components/nav/CheckoutSteps";
import GalleryBgLayoutWithHeader from "src/layout/GalleryBgLayoutWithHeader";
import { useGetMyAddressListQuery } from "src/stores/address/address.query";
import { useCreateOrderCODMutation } from "src/stores/order/order.query";
import styled from "styled-components";
import OrderDetailTable from "./OrderDetailTable";
import ThankyouOrderModal from "./ThankyouOrderModal";
const getTotalCount = (products = []) => {
  return products.reduce((currentValue, nextValue) => {
    return currentValue + nextValue.count;
  }, 0);
};

const validateMessages = {
  required: "Trường này chưa nhập giá trị!",
  // ...
};

message.config({
  maxCount: 2,
});
const CheckoutCODPage = () => {
  const [form] = Form.useForm();
  const { user, isSignedIn } = useAuth();
  const { cart, myCartRefetch } = useAddToCart();
  const [updateAddressVisible, setUpdateAddressVisible] = useState(false);
  const [createOrderCOD, { isSuccess: createOrderCODSuccess, isLoading: createOrderCODLoading }] =
    useCreateOrderCODMutation();
  const { data: getMyAddressListQuery, isSuccess: getMyAddressListSuccess } =
    useGetMyAddressListQuery();
  const [selectedAddress, setSelectedAddress] = useState(user?.defaultAddress || null);
  const [orderNote, setOrderNote] = useState("");
  const myAddressList = getMyAddressListSuccess ? getMyAddressListQuery?.data : [];
  const productItems = cart?.products || [];
  const SHIPPING = productItems.length;

  useLayoutEffect(() => {
    myCartRefetch();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (!selectedAddress) {
        message.error("Bạn chưa có địa chỉ giao hàng!");
        setUpdateAddressVisible(true);
        return;
      }
      const foundAddress = findImageById(selectedAddress, myAddressList);
      if (!foundAddress) {
        message.error("Lỗi khi tìm kiếm địa chỉ của bạn!");
        return;
      }
      message.loading("Đang xử lý...", 3);
      const createOrderRes = await createOrderCOD({
        shippingInfo: foundAddress,
        shippingPrice: SHIPPING,
        paymentInfo: {
          amount: cart.cartTotal,
          currency: "usd",
        },
        orderNote,
      });
      console.log("handleSubmit ~ createOrderRes", createOrderRes);
      await message.success("Tạo đơn hàng thành công");
      myCartRefetch();
    } catch (err) {
      message.error("Đã có lỗi xảy ra");
      console.log("err", err);
    }
  };

  const handleSelectAddress = (value, option) => {
    setSelectedAddress(value);
  };

  return (
    <GalleryBgLayoutWithHeader hideSearch={true}>
      <CheckoutWrapper>
        <CheckoutSteps current={1} />
        <div className="forms-wrapper">
          <Row gutter={[24, 24]} justify="center" align="middle">
            <Col span={24}>
              <Card
                id="shippingInfo"
                title="Thông tin giao hàng"
                extra={
                  <Button size="middle" onClick={() => setUpdateAddressVisible(true)}>
                    Chỉnh sửa
                  </Button>
                }
              >
                <Row wrap={false} gutter={24} align="middle">
                  <Col flex="none">
                    <Typography.Text>
                      <FaMapMarkerAlt /> Đơn hàng sẽ được giao đến:
                    </Typography.Text>
                  </Col>
                  <Col flex="auto">
                    <Select
                      placeholder="Chọn địa chỉ..."
                      bordered={false}
                      value={selectedAddress}
                      defaultValue={user?.defaultAddress}
                      onSelect={handleSelectAddress}
                      style={{ width: "100%" }}
                      optionLabelProp="children"
                      disabled={createOrderCODLoading}
                    >
                      {myAddressList.map((item) => (
                        <Select.Option value={item._id} key={item._id}>
                          <Badge
                            status={user?.defaultAddress === item._id ? "success" : "default"}
                            text={
                              <Space direction="vertical" size={2} style={{ width: "100%" }}>
                                <Space size={0} wrap={false} split={<Divider type="vertical" />}>
                                  <Typography.Text ellipsis>{item.name}</Typography.Text>
                                  <Typography.Text ellipsis>{item.phoneNo}</Typography.Text>
                                  <Typography.Text ellipsis>{item.area}</Typography.Text>
                                  <Typography.Text ellipsis>{item.city}</Typography.Text>
                                  <Typography.Text ellipsis>{item.postalCode}</Typography.Text>
                                </Space>
                                <Typography.Text ellipsis>{item.address}</Typography.Text>
                              </Space>
                            }
                          />
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card id="orderDetail" title="Chi tiết đơn hàng" bodyStyle={{ padding: 0 }}>
                <OrderDetailTable
                  dataSource={productItems}
                  footer={() => (
                    <div className="table-footer-container">
                      <Space direction="vertical" size={4} style={{ width: "100%", maxWidth: 360 }}>
                        <Input.TextArea
                          rows={5}
                          showCount
                          autoSize={{ minRows: 5, maxRows: 5 }}
                          placeholder="Ghi chú đơn hàng..."
                          value={orderNote}
                          onChange={(e) => setOrderNote(e.target.value)}
                          disabled={createOrderCODLoading}
                        />
                      </Space>
                      <Space direction="vertical" size={4}>
                        <div className="item">
                          <span>Tổng sản phẩm:</span>
                          <span>
                            <Statistic
                              prefix="x"
                              groupSeparator=","
                              value={getTotalCount(productItems)}
                              valueStyle={{ fontSize: 16 }}
                            />
                          </span>
                        </div>
                        <div className="item">
                          <span>Tổng giá sản phẩm:</span>
                          <span>
                            <Statistic
                              prefix="$"
                              groupSeparator=","
                              value={cart?.cartTotal || 0}
                              valueStyle={{ fontSize: 16 }}
                            />
                          </span>
                        </div>
                        <div className="item">
                          <span>Phí giao hàng:</span>
                          <span>
                            <Statistic
                              prefix="$"
                              groupSeparator=","
                              value={SHIPPING}
                              valueStyle={{ fontSize: 16 }}
                            />
                          </span>
                        </div>
                        <div className="item">
                          <span>Giảm giá:</span>
                          <span>
                            <Statistic
                              prefix="- $"
                              groupSeparator=","
                              value={0}
                              valueStyle={{ fontSize: 16 }}
                            />
                          </span>
                        </div>
                        <div className="item">
                          <span>Tổng giá:</span>
                          <span>
                            <Statistic
                              prefix="$"
                              groupSeparator=","
                              value={(cart?.cartTotal || 0) + SHIPPING}
                              valueStyle={{ fontSize: 16 }}
                            />
                          </span>
                        </div>
                      </Space>
                    </div>
                  )}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                id="orderPayment"
                title={
                  <Space split={"·"} size={4}>
                    <span>Thanh toán đơn hàng</span>
                    <Statistic
                      prefix="$"
                      groupSeparator=","
                      value={(cart?.cartTotal || 0) + SHIPPING}
                      valueStyle={{ fontSize: 16 }}
                    />
                  </Space>
                }
                bodyStyle={{ padding: 0 }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  disabled={productItems.length === 0 || createOrderCODLoading}
                >
                  <Form.Item noStyle>
                    <Button block size="large" type="primary" htmlType="submit">
                      Xác nhận thanh toán khi nhận hàng
                    </Button>
                  </Form.Item>
                </Form>
                {createOrderCODSuccess && (
                  <Alert
                    message={
                      <Typography.Text className="result-message">
                        Thanh toán thành công.{" "}
                        <Link to="/user/history">Đi đến lịch sử đơn hàng của bạn.</Link>
                      </Typography.Text>
                    }
                    style={{ marginTop: 24 }}
                    type="success"
                    showIcon
                  />
                )}
                {createOrderCODSuccess && <ThankyouOrderModal initvisible={true} />}
              </Card>
            </Col>
          </Row>
        </div>
      </CheckoutWrapper>
      <UpdateAddressDrawer
        updateAddressVisible={updateAddressVisible}
        setUpdateAddressVisible={setUpdateAddressVisible}
        selectedInitAddress={selectedAddress}
      />
    </GalleryBgLayoutWithHeader>
  );
};

const CheckoutWrapper = styled.div`
  padding: 0 96px 96px;
  width: fit-content;
  margin: 0 auto;
  position: relative;
  background-color: #fff;
  & .forms-wrapper {
    max-width: 960px;
    margin: 0 auto;
  }
  & .table-footer-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 24px;
    & .item {
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }
    & .ant-space-vertical .ant-space-item:last-child {
      border-top: 1px solid #eee;
    }
    & .item > span:nth-child(2) {
      font-weight: 500;
    }
  }
`;

export default CheckoutCODPage;
