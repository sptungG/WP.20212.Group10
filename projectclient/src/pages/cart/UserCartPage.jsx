import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Empty,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useLayoutEffect, useState } from "react";
import { useAddToCart } from "src/common/useAddToCart";
import Button from "src/components/button/Button";
import CheckoutSteps from "src/components/nav/CheckoutSteps";

import {
  BsCashStack,
  BsCheckLg,
  BsCreditCard,
  BsCreditCard2Front,
  BsThreeDots,
  BsTrash,
  BsXLg,
} from "react-icons/bs";
import { RiCouponLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { NOT_FOUND_IMG } from "src/common/constant";
import { useAuth } from "src/common/useAuth";
import { checkValidColor, findImageById } from "src/common/utils";
import InputNumberGroup from "src/components/input/InputNumberGroup";
import GalleryBgLayoutWithHeader from "src/layout/GalleryBgLayoutWithHeader";
import styled from "styled-components";
import AnimatedButton from "src/components/button/AnimatedButton";

const getTotalCount = (products = []) => {
  return products.reduce((currentValue, nextValue) => {
    return currentValue + nextValue.count;
  }, 0);
};
message.config({
  maxCount: 2,
});
const UserCartPage = () => {
  let navigate = useNavigate();
  const [formApplyCoupon] = Form.useForm();
  const { user, isSignedIn, message401 } = useAuth();
  const { cart, myCartRefetch, addProductToCart, removeProductFromCart } = useAddToCart();

  const handleCheckoutCart = () => {
    navigate("/checkout", { replace: true });
  };

  const handleCheckoutCODCart = () => {
    navigate("/checkout/cod", { replace: true });
  };

  const handleDecrQuantity = async (productId, variantId, current) => {
    try {
      if (current > 1) {
        message.loading("Đang xử lý...", 3);
        const decRes = await addProductToCart({ productId, variantId, quantity: -1 }).unwrap();
        await myCartRefetch();
        message.success("Giảm thành công!");
      } else {
        message.loading({
          content: (
            <>
              <div>Bạn muốn xóa sản phẩm này khỏi giỏ hàng?</div>
              <Space
                style={{ color: "#cf1322", textDecoration: "underline" }}
                wrap={false}
                size={2}
              >
                <BsTrash /> <span>Xác nhận</span>
              </Space>
            </>
          ),
          style: { cursor: "pointer" },
          onClick: async () => {
            try {
              await removeProductFromCart({ productId, variantId }).unwrap();
              message.destroy();
            } catch (err) {
              message.destroy();
              return;
            } finally {
              myCartRefetch();
            }
          },
          duration: 4,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleIncQuantity = async (productId, variantId, current) => {
    try {
      message.loading("Đang xử lý...", 3);
      const incRes = await addProductToCart({ productId, variantId, quantity: 1 }).unwrap();
      message.success("Thêm thành công!");
    } catch (err) {
      console.log("err", err);
      message.error("Đã có lỗi xảy ra");
    }
  };
  const handleRemoveFromCart = async (productId, variantId) => {
    try {
      message.loading("Đang xử lý...", 3);
      const incRes = await removeProductFromCart({ productId, variantId }).unwrap();
      message.info("Xóa khỏi giỏ hàng thành công!");
    } catch (err) {
      console.log("err", err);
    } finally {
      myCartRefetch();
    }
  };
  const handleApplyCoupon = () => {};

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
      render: (text, { product, variant }) => {
        const foundVariantImage = findImageById(variant.image, product.images);
        return (
          <Space>
            <Avatar
              size={48}
              src={foundVariantImage.url}
              fallback={NOT_FOUND_IMG}
              key={`table_${foundVariantImage._id}`}
            />
            <Space size={2} direction="vertical" style={{ maxWidth: 320, paddingRight: 16 }}>
              <Typography.Text ellipsis>{product.name}</Typography.Text>
              <Typography.Text type="secondary" ellipsis>
                {product.desc}
              </Typography.Text>
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Đã chọn",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
      width: 160,
      render: (text, { product, variant }) => {
        const foundVariantImage = findImageById(variant.image, product.images);
        return (
          <Space>
            <Descriptions column={1} size="small">
              {variant.options.map((o, index) => (
                <Descriptions.Item
                  label={o.name}
                  span={1}
                  key={`variant_options_${variant._id}_${index}`}
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
                    <Tag color={"default"} className={"tag"} style={{ maxWidth: 43, margin: 0 }}>
                      <Typography.Text ellipsis>{o.value}</Typography.Text>
                    </Tag>
                  )}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Space>
        );
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 160,
      align: "center",
      render: (text) => <Statistic value={text} groupSeparator="." prefix="$"></Statistic>,

      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
      width: 160,
      align: "center",
      render: (text, { product, variant }) => {
        return (
          <InputNumberGroup
            handleDecrQuantity={() => handleDecrQuantity(product._id, variant._id, text)}
            handleIncQuantity={() => handleIncQuantity(product._id, variant._id, text)}
            maxValue={10}
            value={text}
          />
        );
      },

      sorter: (a, b) => a.count - b.count,
    },
    {
      title: <BsThreeDots size={24} />,
      dataIndex: "",
      key: "action",
      width: 160,
      align: "center",
      render: (text, { product, variant }) => (
        <Popconfirm
          title={
            <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 200, margin: 0 }}>
              Bạn chắc chắc muôn xóa <b>{variant._id}</b> ?
            </Typography.Paragraph>
          }
          placement="topRight"
          okText={<BsCheckLg />}
          cancelText={<BsXLg />}
          onConfirm={() => handleRemoveFromCart(product._id, variant._id)}
        >
          <Button size="large" type="text" danger icon={<BsTrash />}></Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <GalleryBgLayoutWithHeader hideSearch={true}>
      <CartWrapper>
        <CheckoutSteps current={0} />
        <Row wrap={false} gutter={[24, 24]}>
          <Col flex="auto">
            {!cart?.products.length ? (
              <Empty
                className="bordered"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" align="center" size={8}>
                    <Typography.Text>Giỏ hàng đang trống trải</Typography.Text>
                    <div>
                      <AnimatedButton onClick={() => navigate("/", { replace: true })}>
                        Tiếp tục mua hàng
                      </AnimatedButton>
                    </div>
                  </Space>
                }
              />
            ) : (
              <Card size="small" style={{ height: "100%" }} bodyStyle={{ padding: 0 }}>
                <Table
                  className="hide-footer hide-title"
                  loading={!cart}
                  columns={columns}
                  rowKey={({ variant }) => variant._id}
                  dataSource={cart?.products}
                  pagination={false}
                />
              </Card>
            )}
          </Col>
          <Col flex="360px" className="right">
            <Card className="coupon-container">
              <Form
                form={formApplyCoupon}
                layout="vertical"
                size="large"
                onFinish={handleApplyCoupon}
              >
                <Typography.Title level={4}>Bạn có mã giảm giá?</Typography.Title>
                <Form.Item name="coupon" style={{ margin: 0 }}>
                  <Input
                    placeholder="Nhập mã..."
                    style={{ padding: "5px 5px 5px 10px" }}
                    allowClear
                    prefix={<RiCouponLine size={24} />}
                    suffix={
                      <Button type="primary" htmlType="submit">
                        Áp dụng
                      </Button>
                    }
                  />
                </Form.Item>
              </Form>
            </Card>
            <Card>
              <Typography.Title level={3}>Tóm tắt giỏ hàng</Typography.Title>
              <div className="cart-summary-list">
                <div className="cart-summary-item">
                  <span>Tổng sản phẩm:</span>
                  <span>x{getTotalCount(cart?.products)}</span>
                </div>
                <div className="cart-summary-item">
                  <span>Tổng giá:</span>
                  <span>
                    <Statistic
                      prefix="$"
                      groupSeparator=","
                      value={cart?.cartTotal || 0}
                      valueStyle={{ fontSize: 16 }}
                    />
                  </span>
                </div>
                <div className="cart-summary-item">
                  <span>Đã giảm:</span>
                  <span>
                    <Statistic
                      prefix="- $"
                      groupSeparator=","
                      value={0}
                      valueStyle={{ fontSize: 16 }}
                    />
                  </span>
                </div>
              </div>
              {isSignedIn ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    size="large"
                    type="primary"
                    onClick={handleCheckoutCart}
                    block
                    disabled={!cart || !cart?.products.length}
                    icon={
                      <Space size={6} className="ant-space-center-items">
                        <BsCreditCard2Front size={18} />
                        <BsCreditCard size={18} />
                      </Space>
                    }
                  >
                    Thanh toán trực tuyến
                  </Button>
                  <Button
                    onClick={handleCheckoutCODCart}
                    size="large"
                    type="link"
                    extraType="btntag"
                    block
                    disabled={!cart || !cart?.products.length}
                    icon={<BsCashStack size={16} />}
                  >
                    Thanh toán khi nhận hàng
                  </Button>
                </Space>
              ) : (
                <Link
                  to={{
                    pathname: "/login",
                    state: { from: "cart" },
                  }}
                >
                  <Button size="large" type="primary" block>
                    Bạn cần đăng nhập
                  </Button>
                </Link>
              )}
              <div className="support-payment-container">
                <Typography.Text type="secondary">Phương thức hỗ trợ: </Typography.Text>
                <Space className="support-payment-list">
                  <div className="support-payment-item">
                    {/* <img
                      alt="PAYPAL"
                      src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-color.svg"
                    /> */}
                  </div>

                  <div className="support-payment-item">
                    <img
                      alt="VISA"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1920px-Visa_2021.svg.png"
                    />
                  </div>
                  <div className="support-payment-item">
                    <img
                      alt="MC"
                      src="https://www.mastercard.com.vn/content/dam/public/mastercardcom/vn/vi/logos/mc-logo-52.svg"
                    />
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </CartWrapper>
    </GalleryBgLayoutWithHeader>
  );
};

const CartWrapper = styled.main`
  padding: 0 96px;
  & .right {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  & .cart-summary {
    &-list {
      display: flex;
      flex-direction: column;
    }
    &-item {
      padding-bottom: 12px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
    }
    &-item > span:nth-child(2) {
      font-weight: 500;
      font-size: 16px;
    }
    &-item:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }
  }
  & .support-payment {
    &-container {
      margin-top: 24px;
    }
    &-item {
      height: 32px;
      & img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  & .ant-empty {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

export default UserCartPage;
