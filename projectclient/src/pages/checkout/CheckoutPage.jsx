import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  Alert,
  Avatar,
  Badge,
  Card,
  Col,
  Descriptions,
  Divider,
  Input,
  message,
  Popover,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useLayoutEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useCreateOrderCODMutation, useCreateOrderMutation } from "src/stores/order/order.query";
import { useCreatePaymentIntentMutation } from "src/stores/stripe/stripe.query";
import styled from "styled-components";
import OrderDetailTable from "./OrderDetailTable";
import "./stripe.css";
import ThankyouOrderModal from "./ThankyouOrderModal";
const getTotalCount = (products = []) => {
  return products.reduce((currentValue, nextValue) => {
    return currentValue + nextValue.count;
  }, 0);
};
const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
const validateMessages = {
  required: "Trường này chưa nhập giá trị!",
  // ...
};


// https://stripe.com/docs/payments/card-element
// https://stripe.com/docs/js/payment_intents/confirm_card_payment
// https://stripe.com/docs/payments/accept-card-payments?platform=web&ui=elements&html-or-react=react
const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, isSignedIn } = useAuth();
  const { cart, myCartRefetch } = useAddToCart();
  const [updateAddressVisible, setUpdateAddressVisible] = useState(false);
  const [createPaymentIntent, { isSuccess: createPaymentIntentSuccess }] =
    useCreatePaymentIntentMutation();
  const [createOrder, { isSuccess: createOrderSuccess }] = useCreateOrderMutation();
  const [createOrderCOD, { isSuccess: createOrderCODSuccess }] = useCreateOrderCODMutation();
  const { data: getMyAddressListQuery, isSuccess: getMyAddressListSuccess } =
    useGetMyAddressListQuery();
  const [clientSecret, setClientSecret] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(user?.defaultAddress || null);
  const [orderNote, setOrderNote] = useState("");
  const myAddressList = getMyAddressListSuccess ? getMyAddressListQuery?.data : [];
  const productItems = cart?.products || [];
  const SHIPPING = productItems.length;
  useLayoutEffect(() => {
    myCartRefetch();
  }, []);

  useEffect(() => {
    if (productItems.length > 0 && isSignedIn) {
      // Create PaymentIntent as soon as the page loads
      async function getStripApiKey() {
        const { client_secret } = await createPaymentIntent().unwrap();
        setClientSecret(client_secret);
      }
      getStripApiKey();
    }
  }, [isSignedIn, productItems.length]);

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (e) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
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
    setProcessing(true);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.name,
          email: user.email,
        },
      },
      receipt_email: user.email,
      shipping: {
        name: user.name,
        phone: foundAddress.phoneNo,
        address: {
          country: "VN",
          line1: foundAddress.address,
          line2: `${foundAddress.area},${foundAddress.city}`,
          postal_code: foundAddress.postalCode,
          city: foundAddress.area,
          state: foundAddress.city,
        },
      },
    });
    if (result.error) {
      // Show error to your customer (for example, insufficient funds)
      setError(`Payment failed ${result.error.message}`);
      setProcessing(false);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        const { id, amount, currency, status, created, payment_method_types } =
          result.paymentIntent;
        const createOrderRes = await createOrder({
          shippingInfo: foundAddress,
          shippingPrice: SHIPPING,
          paymentInfo: {
            id,
            amount: amount / 100,
            currency,
            status,
            created,
            payment_method_types,
          },
          orderNote,
        });
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        myCartRefetch();
      }
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
                      disabled={processing}
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
                  dataSource={cart?.products}
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
                          disabled={processing}
                        />
                      </Space>
                      <Space direction="vertical" size={4}>
                        <div className="item">
                          <span>Tổng sản phẩm:</span>
                          <span>
                            <Statistic
                              prefix="x"
                              groupSeparator=","
                              value={getTotalCount(cart?.products)}
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
                extra={
                  <Popover
                    placement="bottomRight"
                    overlayInnerStyle={{ maxWidth: 360 }}
                    content={
                      <PopoverContent>
                        <div className="payment-list">
                          <div className="payment-item">
                            <span>Payment succeeds</span>
                            <Typography.Link strong copyable>
                              4242 4242 4242 4242
                            </Typography.Link>
                          </div>
                          <div className="payment-item">
                            <span>Authentication required</span>
                            <Typography.Link strong copyable>
                              4000 0025 0000 3155
                            </Typography.Link>
                          </div>
                          <div className="payment-item">
                            <span>Payment is declined</span>
                            <Typography.Link strong copyable>
                              4000 0000 0000 9995
                            </Typography.Link>
                          </div>
                        </div>
                        <p>
                          These test card numbers work with any CVC, postal code and future expiry
                          date.
                        </p>
                      </PopoverContent>
                    }
                  >
                    <Typography.Link>Test payment</Typography.Link>
                  </Popover>
                }
              >
                {!succeeded && <Alert message="No coupon applied" type="error" />}
                <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
                  <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
                  <button
                    className="stripe-button"
                    disabled={productItems.length < 1 || processing || disabled || succeeded}
                  >
                    <span id="button-text">
                      {processing ? <div className="spinner" id="spinner"></div> : "Thanh toán"}
                    </span>
                  </button>
                  {error && <Typography.Text type="danger">{error}</Typography.Text>}
                  {succeeded && (
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
                  {succeeded && <ThankyouOrderModal initvisible={succeeded} />}
                </form>
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

const PopoverContent = styled.div`
  & .payment {
    &-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }
    &-item {
      display: flex;
      justify-content: space-between;
    }
  }
`;
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

export default CheckoutPage;
