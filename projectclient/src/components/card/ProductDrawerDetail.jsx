import {
  Affix,
  Alert,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Form,
  InputNumber,
  message,
  Radio,
  Rate,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BsArrowLeft,
  BsBoxArrowUpRight,
  BsBoxSeam,
  BsCartCheck,
  BsCartPlus,
  BsChatLeftText,
  BsCheck2Circle,
  BsDashLg,
  BsEye,
  BsHeart,
  BsHeartFill,
  BsPlusLg,
  BsStar,
} from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import styled from "styled-components";
import {
  useAddProductToCartMutation,
  useGetProductQuery,
  useProductViewIncMutation,
  useToggleProductWishlistMutation,
} from "src/stores/product/product.query";
import Button from "../button/Button";
import { useEventListener } from "src/common/useEventListener";
import { rgba } from "polished";
import { NOT_FOUND_IMG } from "src/common/constant";
import { checkValidColor } from "src/common/utils";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { useGetMyCartQuery } from "src/stores/user/user.query";
import { useAddToCart } from "src/common/useAddToCart";
import ReactionChipTags from "../chip/ReactionChipTags";
import { useMediaQuery } from "react-responsive";
import ThumbsSlider from "../silder/ThumbsSlider";
import { isWishlisted, useToggleWishlist } from "src/common/useToggleWishlist";
import { useAuth } from "src/common/useAuth";
import InputNumberGroup from "../input/InputNumberGroup";

const MAX_COUNT_CART = 10;
message.config({
  maxCount: 2,
  duration: 2,
});

const ProductDrawerDetail = ({ productId = null, setSelectedProduct }) => {
  const mediaBelow480 = useMediaQuery({ maxWidth: 480 });
  const mediaAbove1280 = useMediaQuery({ minWidth: 1280 });
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [container, setContainer] = useState(null);
  const drawerBodyRef = useRef(null);
  const { cart, addProductToCart, myCartRefetch } = useAddToCart();
  const { isSignedIn, user, message401 } = useAuth();

  const { data: productQuery, isSuccess: productQuerySuccess } = useGetProductQuery(productId, {
    skip: !productId,
  });
  const [productViewInc, { isLoading: productViewIncLoading }] = useProductViewIncMutation();
  const { handleToggleWishlist, toggleProductWishlistLoading } = useToggleWishlist();
  const [maxCount, setMaxCount] = useState(MAX_COUNT_CART);
  const variantInCart = (variantId = null) =>
    variantId ? cart?.products.find((item) => item.variant._id === variantId) || null : null;
  const variantValue = Form.useWatch("variant", form);
  const quantityValue = Form.useWatch("quantity", form);
  const foundVariantInCart = variantInCart(variantValue);
  const foundVariantInProduct = productQuery?.data.variants.find((v) => v._id === variantValue);
  useEffect(() => {
    if (foundVariantInProduct && foundVariantInProduct.quantity < MAX_COUNT_CART) {
      setMaxCount(foundVariantInProduct.quantity);
    } else setMaxCount(MAX_COUNT_CART);
  }, [foundVariantInProduct]);

  useEffect(() => {
    if (productQuerySuccess) {
      const initialVariant = productQuery.data.variants[0];
      form.setFieldsValue({
        variant: initialVariant?._id,
        quantity: 0,
      });
    }
  }, [productQuery?.data, productQuerySuccess]);

  // useEffect(() => {
  //   if (productQuerySuccess) productViewInc(productId);
  // }, [productId, productQuerySuccess]);
  const handleDecrQuantity = () => {
    form.setFieldsValue({
      quantity: quantityValue > 1 ? quantityValue - 1 : 0,
    });
  };
  const handleIncQuantity = () => {
    const validateValue = quantityValue + (foundVariantInCart?.count || 0);
    if (validateValue < maxCount) {
      form.setFieldsValue({
        quantity: quantityValue + 1,
      });
    } else {
      const newQuantity = maxCount - (foundVariantInCart?.count || 0);
      form.setFieldsValue({
        quantity: newQuantity > 0 ? newQuantity : 0,
      });
      if (newQuantity === MAX_COUNT_CART) message.error(`Vượt quá LIMIT:${MAX_COUNT_CART} rồi!`);
      else message.error(`Sản phẩm chỉ còn lại ${maxCount}!`);
    }
  };

  const handleAddToCart = async (productId, { variant = "", quantity = 0 }) => {
    try {
      if (!quantity) message.error(`Tăng số lượng và thử lại nhé!`);
      if (!productId || !variant || !quantity) throw new Error("Invalid initdata");
      if (!isSignedIn) return message401();
      const cartRes = await addProductToCart({ productId, variantId: variant, quantity }).unwrap();
      await myCartRefetch();
      message.success({
        content: (
          <>
            <div>
              Thêm <b>{quantity}</b> sản phẩm vào giỏ hàng thành công
            </div>
            <Space style={{ color: "#52c41a", textDecoration: "underline" }} wrap={false} size={2}>
              <BsBoxArrowUpRight /> <span>Đến giỏ hàng ngay</span>
            </Space>
          </>
        ),
        style: { cursor: "pointer" },
        onClick: () => {
          navigate("/cart", { replace: true });
          message.destroy();
        },
        duration: 3,
      });
      setSelectedProduct(null);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <Drawer
      destroyOnClose
      visible={!!productId}
      onClose={() => {
        setSelectedProduct(null);
      }}
      closeIcon={<BsArrowLeft size={20} />}
      placement={mediaBelow480 ? "bottom" : "right"}
      height={mediaBelow480 ? "94%" : "100%"}
      width={mediaBelow480 ? "100%" : 480}
      title={mediaBelow480 ? null : "Sản phẩm"}
      footerStyle={{
        padding: "10px 24px",
      }}
      extra={
        productQuerySuccess ? (
          <ReactionChipTags colorful={true} size={16} data={productQuery?.data} />
        ) : (
          <Skeleton.Input active block size="small" />
        )
      }
      // getContainer={false}
      className="hide-scrollbar"
      footer={
        <FooterWrapper>
          <Row wrap={false} gutter={10}>
            <Col flex="auto">
              <Tooltip
                overlayClassName={mediaAbove1280 ? "" : "hidden"}
                placement="topRight"
                destroyTooltipOnHide
                arrowPointAtCenter
                title={isSignedIn ? "Giỏ hàng! Click it" : "Đăng nhập trước nha"}
              >
                <Button
                  type="link"
                  htmlType="submit"
                  form="formDrawer"
                  extraType="btntag"
                  block
                  size="large"
                  icon={<BsCartPlus />}
                  className="btn-cart"
                  loading={!productQuerySuccess}
                  disabled={!productQuerySuccess || productQuery?.data.variants.length < 1}
                >
                  Thêm vào giỏ hàng · {quantityValue}
                </Button>
              </Tooltip>
            </Col>
            <Col flex="none">
              {productQuerySuccess ? (
                <Space
                  wrap={false}
                  split={<Divider type="vertical" />}
                  size={4}
                  className="extra-actions-container"
                >
                  <Tooltip
                    overlayClassName={mediaAbove1280 ? "" : "hidden"}
                    placement="topRight"
                    destroyTooltipOnHide
                    title={
                      isSignedIn
                        ? isWishlisted(productQuery?.data.wishlist, user?._id)
                          ? "Bạn đã thích sản phẩm này"
                          : "Thêm vào Yêu thích"
                        : "Đăng nhập trước nha"
                    }
                  >
                    <button
                      className={classNames("btn-wishlist", {
                        active: isWishlisted(productQuery?.data.wishlist, user?._id),
                      })}
                      onClick={() =>
                        handleToggleWishlist(
                          productId,
                          isWishlisted(productQuery?.data.wishlist, user?._id)
                        )
                      }
                    >
                      {isWishlisted(productQuery?.data.wishlist, user?._id) ? (
                        <BsHeartFill />
                      ) : (
                        <BsHeart />
                      )}
                      ·<span>{productQuery?.data.wishlist.length}</span>
                    </button>
                  </Tooltip>
                  <Tooltip
                    overlayClassName={mediaAbove1280 ? "" : "hidden"}
                    placement="topRight"
                    destroyTooltipOnHide
                    title="Xem sản phẩm"
                    arrowPointAtCenter
                  >
                    <div className="btn-nav">
                      <Link to={`/products/${productId}`}>
                        <BsBoxArrowUpRight />
                      </Link>
                    </div>
                  </Tooltip>
                </Space>
              ) : (
                <Skeleton.Button active block size="large" />
              )}
            </Col>
          </Row>
        </FooterWrapper>
      }
    >
      <ProductDrawerBodyWrapper ref={setContainer}>
        <div className="images-wrapper">
          {productQuerySuccess ? (
            <ThumbsSlider
              images={productQuery.data.images}
              direction={mediaBelow480 ? "y" : "x"}
              actions={
                <Link to={`/products/${productId}`}>
                  <BsBoxArrowUpRight /> Xem sản phẩm
                </Link>
              }
            />
          ) : (
            <Skeleton active />
          )}
        </div>
        {productQuerySuccess ? (
          <div className="product-content">
            <Typography.Title level={4} className="name">
              {productQuery.data.name}
            </Typography.Title>
            <Typography.Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
              className="desc"
            >
              {productQuery.data.desc}
            </Typography.Paragraph>
            <Space
              split={mediaBelow480 ? null : <Divider type="vertical" />}
              size={2}
              wrap={mediaBelow480}
              direction={mediaBelow480 ? "vertical" : "horizontal"}
              align="baseline"
            >
              <Space className="rating" wrap={false} size={8} align="baseline">
                <Rate disabled defaultValue={productQuery.data.avgRating} />
                <span className="rating-value">{`( ${productQuery.data.numOfReviews} đánh giá )`}</span>
              </Space>
              <div>{productQuery.data.numOfViews} · lượt xem</div>
            </Space>
            <Form
              form={form}
              layout="vertical"
              id="formDrawer"
              onFinish={(values) => handleAddToCart(productId, values)}
            >
              <Divider orientation="left" plain>
                Phiên bản · {productQuery.data.variants.length}
              </Divider>

              {productQuery.data.variants.length > 0 ? (
                <Form.Item name="variant" noStyle>
                  <Radio.Group
                    style={{ width: "100%" }}
                    onChange={() => form.setFieldsValue({ quantity: 0 })}
                  >
                    {productQuery.data.variants.map((item) => (
                      <VariantItemWrapper key={item._id} checked={variantValue === item._id}>
                        <Radio value={item._id} id={item._id}>
                          <div className="container">
                            <div className="media">
                              <div className="image-wrapper">
                                <img
                                  alt={item._id}
                                  src={
                                    productQuery.data.images.find((img) => img._id === item.image)
                                      ?.url || NOT_FOUND_IMG
                                  }
                                />
                                <div className="price">
                                  <Statistic
                                    suffix="$"
                                    className="price-tag"
                                    valueStyle={{ fontSize: 14 }}
                                    value={item.price}
                                  ></Statistic>
                                </div>
                                <Tooltip
                                  destroyTooltipOnHide
                                  overlayClassName={mediaAbove1280 ? "hidden" : ""}
                                  color={"#fafafa"}
                                  placement="topLeft"
                                  overlayStyle={{ maxWidth: 132 }}
                                  trigger={"click"}
                                  title={
                                    <Descriptions column={2} size="small">
                                      {!!variantInCart(item._id) && (
                                        <Descriptions.Item label="Giỏ hàng" span={2}>
                                          {variantInCart(item._id).count}
                                        </Descriptions.Item>
                                      )}
                                      <Descriptions.Item label="Đã bán" span={2}>
                                        {item.sold}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Kho" span={2}>
                                        {item.quantity}
                                      </Descriptions.Item>
                                    </Descriptions>
                                  }
                                >
                                  <div className="incart">
                                    {!!variantInCart(item._id) && (
                                      <Space
                                        size={2}
                                        split="·"
                                        className="incart-tag ant-space-center-items"
                                      >
                                        <BsCartCheck size={16.5} />
                                        {variantInCart(item._id).count}
                                      </Space>
                                    )}
                                    {mediaBelow480 && (
                                      <Space wrap={false} size={4}>
                                        <Space
                                          size={2}
                                          split="·"
                                          align="center"
                                          className="incart-tag ant-space-center-items"
                                        >
                                          <BsCheck2Circle size={16.5} />
                                          <span>{item.sold}</span>
                                        </Space>
                                        <Space
                                          size={2}
                                          split="·"
                                          align="center"
                                          className="incart-tag ant-space-center-items"
                                        >
                                          <BsBoxSeam size={14} />
                                          <span>{item.quantity}</span>
                                        </Space>
                                      </Space>
                                    )}
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="content">
                              <Descriptions column={1} size="small">
                                {item.options.map((o, index) => (
                                  <Descriptions.Item
                                    label={o.name}
                                    span={1}
                                    key={`variant_options_${item._id}_${index}`}
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
                            {!mediaBelow480 && (
                              <div className="extra-content">
                                <Tooltip
                                  overlayClassName={mediaAbove1280 ? "" : "hidden"}
                                  destroyTooltipOnHide
                                  color={"#fafafa"}
                                  placement="leftBottom"
                                  overlayStyle={{ maxWidth: 140 }}
                                  title={
                                    <Descriptions column={2} size="small">
                                      <Descriptions.Item label="Đã bán" span={2}>
                                        {item.sold}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Kho" span={2}>
                                        {item.quantity}
                                      </Descriptions.Item>
                                    </Descriptions>
                                  }
                                >
                                  <Space direction="vertical">
                                    <Space size={2} split="·" align="center">
                                      <BsCheck2Circle size={16.5} />
                                      <span>{item.sold}</span>
                                    </Space>
                                    <Space size={2} split="·" align="center">
                                      <BsBoxSeam size={14} />
                                      <span>{item.quantity}</span>
                                    </Space>
                                  </Space>
                                </Tooltip>
                              </div>
                            )}
                            <div className="actions">
                              {variantValue === item._id && (
                                <Form.Item noStyle name={"quantity"}>
                                  <InputNumberGroup
                                    handleDecrQuantity={handleDecrQuantity}
                                    handleIncQuantity={handleIncQuantity}
                                    maxValue={maxCount}
                                  />
                                </Form.Item>
                              )}
                            </div>
                          </div>
                        </Radio>
                      </VariantItemWrapper>
                    ))}
                  </Radio.Group>
                </Form.Item>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Form>
          </div>
        ) : (
          <Skeleton active />
        )}
      </ProductDrawerBodyWrapper>
    </Drawer>
  );
};

const VariantItemWrapper = styled.div`
  background-color: ${(props) => (props.checked ? props.theme.generatedColors[0] : "#fafafa")};
  border: 1px solid ${(props) => (props.checked ? props.theme.generatedColors[3] : "#f5f5f5")};
  padding: 12px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  position: relative;
  width: 100%;
  & .ant-radio-wrapper {
    width: 100%;
    margin-right: 0;
    & > span:nth-child(2) {
      width: 100%;
    }
  }
  &:not(:last-child) {
    margin-bottom: 24px;
  }
  & .container {
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    width: 100%;
    & .content {
      padding-left: 12px;
      border-left: 1px solid #d9d9d9;
      align-self: ${(props) => (props.checked ? "flex-end" : "stretch")};
    }
    @media screen and (max-width: 321.01px) {
      gap: 8px;
      & .content {
        padding-left: 8px;
      }
    }
    & .extra-content {
      align-self: ${(props) => (props.checked ? "flex-end" : "stretch")};
      padding-bottom: 8px;
      & .ant-space-item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    }
  }
  & .image-wrapper {
    flex-shrink: 0;
    width: 160px;
    height: 90px;
    position: relative;
    & img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    & .incart {
      position: absolute;
      bottom: 12px;
      right: 12px;
      z-index: 1;
      transition: all 0.3s;
      display: flex;
      gap: 4px;
      flex-direction: column;
      align-items: flex-end;
      & .incart-tag {
        padding: 0px 6px;
        background-color: ${(props) =>
          rgba(props.checked ? props.theme.generatedColors[1] : "#fafafa", 0.6)};
        backdrop-filter: blur(6px);
        color: ${(props) => (props.checked ? props.theme.generatedColors[5] : "#8c8c8c")};
      }
    }
    & .price {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 1;
      transition: all 0.3s;
      & .price-tag {
        padding: 1px 6px;
        background-color: ${(props) =>
          rgba(props.checked ? props.theme.generatedColors[1] : "#fafafa", 0.6)};
        backdrop-filter: blur(6px);
      }
      & .price-tag .ant-statistic-content {
        color: ${(props) => (props.checked ? props.theme.generatedColors[5] : "#8c8c8c")};
        font-weight: 500;
      }
    }

    @media screen and (max-width: 480.01px) {
      width: 132px;
      height: 108px;
      & .incart {
        gap: 4px;
        flex-direction: column;
        align-items: flex-end;
      }
    }
    @media screen and (max-width: 321.01px) {
      width: 118px;
      height: 108px;
    }
  }
  & .actions {
    height: fit-content;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(13px, -30px);
  }
`;

const FooterWrapper = styled.div`
  & .extra-actions-container {
    border: 1px solid ${(props) => props.theme.generatedColors[0]};
    width: 100%;
    height: 100%;
    padding: 0 12px;
  }
  & .btn-cart {
    border: 1px solid transparent;
    &:hover {
      text-decoration: underline;
      border-color: ${(props) => props.theme.generatedColors[3]};
    }
  }
  & .btn-nav {
    width: 100%;
    height: 100%;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      border-bottom: 1px solid ${(props) => props.theme.primaryColor};
    }
  }
  & .btn-wishlist {
    width: 100%;
    height: 100%;
    background-color: transparent;
    color: #8c8c8c;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    flex-wrap: nowrap;
    border: none;
    outline: none;
    cursor: pointer;

    &.active {
      color: #ff4d4f;
    }
    &:hover {
      color: #ff4d4f;
      border-bottom: 1px solid #ff4d4f;
    }
  }
`;
const ProductDrawerBodyWrapper = styled.div`
  & .product-content {
  }
  & .ant-empty-normal {
    border: 1px dashed #d9d9d9;
    padding: 24px 0;
    margin: 0;
  }
  & .images-wrapper {
    flex-shrink: 0;
    position: relative;
    margin-bottom: 24px;
  }
`;

export default ProductDrawerDetail;
