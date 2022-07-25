import {
  Avatar,
  BackTop,
  Card,
  Carousel,
  Col,
  Comment,
  Descriptions,
  Divider,
  Empty,
  Form,
  Image,
  Input,
  List,
  message,
  Modal,
  Progress,
  Radio,
  Rate,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import classNames from "classnames";
import { rgba } from "polished";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BsBoxSeam,
  BsCartPlus,
  BsChatSquareText,
  BsCheck2Circle,
  BsHandThumbsDown,
  BsHandThumbsDownFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsHeart,
  BsHeartFill,
  BsLayoutWtf,
  BsListStars,
  BsPerson,
  BsStar,
  BsStarFill,
  BsStars,
} from "react-icons/bs";
import { RiFilterOffLine } from "react-icons/ri";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router-dom";
import { NOT_FOUND_IMG, THANKYOU_IMG } from "src/common/constant";
import { useAuth } from "src/common/useAuth";
import { useChangeThemeProvider } from "src/common/useChangeThemeProvider";
import { isWishlisted, useToggleWishlist } from "src/common/useToggleWishlist";
import { formatDate } from "src/common/utils";
import Button from "src/components/button/Button";
import ProductCard, { ProductCardLoading, renderTagStatus } from "src/components/card/ProductCard";
import ProductDrawerDetail from "src/components/card/ProductDrawerDetail";
import ChipTag from "src/components/chip/ChipTag";
import ReactionChipTags from "src/components/chip/ReactionChipTags";
import { PreviewMd } from "src/components/form/MdEditor";
import Loader from "src/components/loader/Loader";
import PostersSlider from "src/components/silder/PostersSlider";
import MainLayout from "src/layout/MainLayout";
import {
  useGetProductQuery,
  useGetProductsFilteredQuery,
  useProductViewIncMutation,
} from "src/stores/product/product.query";
import {
  useCreateReviewMutation,
  useGetReviewsByProductQuery,
} from "src/stores/review/review.query";
import styled from "styled-components";

export const getTotalInventoryQuantity = (variants) =>
  variants.reduce((currentValue, nextValue) => {
    return currentValue + (nextValue?.quantity || 0);
  }, 0);
export const getTotalInventorySold = (variants) =>
  variants.reduce((currentValue, nextValue) => {
    return currentValue + (nextValue?.sold || 0);
  }, 0);

const getReviewed = (reviewerList = [], userId) =>
  userId ? reviewerList?.find((u) => u.createdBy?._id === userId) : null;

const ProductDetailPage = () => {
  const [reviewForm] = Form.useForm();
  const [reviewsFilterForm] = Form.useForm();
  const mediaBelow625 = useMediaQuery({ maxWidth: 625 });
  const mediaBelow1024 = useMediaQuery({ maxWidth: 1024 });
  const mediaBelow1124 = useMediaQuery({ maxWidth: 1124 });
  const mediaAbove1280 = useMediaQuery({ minWidth: 1280 });
  let navigate = useNavigate();
  const { productId } = useParams();
  const { themeProvider } = useChangeThemeProvider();
  const { isSignedIn, user, message401 } = useAuth();
  const { handleToggleWishlist, toggleProductWishlistLoading } = useToggleWishlist();
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [productReviewsFilter, setProductReviewsFilter] = useState({
    page: 1,
    limit: 10,
    sort: "",
    rating: "",
  });
  const [productViewInc, { isLoading: productViewIncLoading }] = useProductViewIncMutation();
  const [createReview, { isLoading: createReviewLoading, isSuccess: createReviewSuccess }] =
    useCreateReviewMutation();
  const {
    data: productQuery,
    isSuccess: productQuerySuccess,
    refetch: productQueryRefetch,
  } = useGetProductQuery(productId, {
    skip: !productId,
  });
  const { data: productReviewsQuery, isSuccess: productReviewsQuerySuccess } =
    useGetReviewsByProductQuery(
      { productId, filter: productReviewsFilter },
      {
        skip: !productId,
      }
    );
  const productData = productQuerySuccess ? productQuery?.data : null;
  const productCategory = productData?.category || null;
  const { data: productsFilteredQuery, isSuccess: getProductsSuccess } =
    useGetProductsFilteredQuery(
      { category: productCategory?._id || "", page: 1, limit: 6 },
      {
        skip: !productId || !productCategory,
      }
    );
  const relativeProductsData =
    productId && getProductsSuccess
      ? productsFilteredQuery?.data.filter((p) => p._id !== productId)
      : [];
  const totalQuantity = productData ? getTotalInventoryQuantity(productData.variants) : 0;
  const totalSold = productData ? getTotalInventorySold(productData.variants) : 0;
  const productReviewsRes = productReviewsQuerySuccess ? productReviewsQuery : null;
  const myReview = getReviewed(productReviewsRes?.reviewers || [], user?._id);
  const [activeKey, setActiveKey] = useState("content");
  const [selectedProductId, setSelectedProductId] = useState(null);
  // const ratingFilterValue = Form.useWatch("rating", reviewsFilterForm);
  // const ratingValue = Form.useWatch("rating", reviewForm);
  // const commentValue = Form.useWatch("comment", reviewForm);
  const [ratingValue, setRatingValue] = useState(5);
  const [commentValue, setCommentValue] = useState("");
  const [upvoteValue, setUpvoteValue] = useState(0);
  const [downvoteValue, setDownvoteValue] = useState(0);

  useLayoutEffect(() => {
    if (productQuerySuccess) {
      productViewInc(productId);
    }
  }, [productId, productQuerySuccess]);

  useEffect(() => {
    if (myReview) {
      const { rating, comment } = myReview;
      reviewForm.setFieldsValue({
        rating,
        comment,
      });
      setRatingValue(rating);
      setCommentValue(comment);
    }
  }, [productReviewsQuerySuccess]);

  const handleCreateReview = async (values) => {
    try {
      if (!isSignedIn) return message401();
      const { rating, comment } = values;
      const createReviewRes = await createReview({
        productId,
        initdata: { rating, comment },
      }).unwrap();
      message.success("Thêm vào đánh giá thành công");
      productQueryRefetch();
      // setReviewFormVisible(false);
      setActiveKey("reviews");
    } catch (err) {
      message.error("Đã có lỗi xảy ra");
      console.log(err);
      setReviewFormVisible(false);
    }
  };

  const handleFilterReviews = (changedValues, allValues) => {
    const { rating } = allValues;
    setProductReviewsFilter({ ...productReviewsFilter, rating });
  };
  const handleResetRatingFilter = () => {
    reviewsFilterForm.resetFields();
    setProductReviewsFilter({ ...productReviewsFilter, rating: "" });
  };

  const handleReviewChange = (changedValues, allValues) => {
    const { rating, comment } = allValues;
    setRatingValue(rating);
    setCommentValue(comment);
  };

  return (
    <MainLayout>
      {productData ? (
        <ProductDetailWrapper>
          <div className="container-big-banner">
            <img src={productData.images[0]?.url || NOT_FOUND_IMG} alt={productData._id} />
          </div>
          <div className="container-main">
            {/* <div className="ellipse-box-1"></div> */}
            {/* <div className="ellipse-box-2"></div> */}
            <div className="container-info">
              <Row wrap={mediaBelow1124} gutter={24} justify={"center"}>
                <Col flex="none">
                  <PostersSlider
                    images={productData.images}
                    thumbSize={52}
                    actions={
                      <div className="price">
                        <span>Giá ~</span>
                        <Statistic
                          suffix="$"
                          className="price-tag"
                          value={productData.price}
                        ></Statistic>
                      </div>
                    }
                  />
                </Col>
                <Col flex="auto" className="left-info">
                  <div className="left-info-top">
                    <Typography.Title
                      level={mediaAbove1280 ? 1 : 3}
                      className="title"
                      ellipsis={{ rows: 2, tooltip: productData.name }}
                    >
                      {productData.name}
                    </Typography.Title>
                    <Typography.Title
                      level={productData.desc.length > 150 ? 5 : 4}
                      ellipsis={{ rows: 2 }}
                      type="secondary"
                      className="desc"
                    >
                      {productData.desc}
                    </Typography.Title>
                    <Space
                      wrap={false}
                      split={<Divider type="vertical" />}
                      style={{ marginTop: "auto" }}
                    >
                      <ReactionChipTags colorful={false} size={16} data={productData} />
                      {productData.variants && renderTagStatus(productData.variants)}
                    </Space>
                  </div>
                  <Row className="left-info-bottom" gutter={24} wrap={false}>
                    <Col flex="auto" className="bottom-left">
                      <Space
                        wrap={true}
                        size={2}
                        split={<Divider type="vertical" />}
                        className="rating-wrapper ant-space-center-items"
                        onClick={() => setActiveKey("reviews")}
                      >
                        <Space
                          className="rating ant-space-center-items"
                          wrap={false}
                          size={8}
                          align="center"
                        >
                          <Rate disabled defaultValue={productData.avgRating} allowHalf />
                          <span className="rating-value">{`( ${productData.numOfReviews} đánh giá )`}</span>
                        </Space>
                        {productReviewsRes?.reviewers.length > 0 && (
                          <Avatar.Group maxCount={10} size={36}>
                            {productReviewsRes?.reviewers.map(({ createdBy: item }) => (
                              <Avatar src={item.picture} key={`reviewer_${item._id}`}>
                                {item.name[0]}
                              </Avatar>
                            ))}
                          </Avatar.Group>
                        )}
                      </Space>
                      <Descriptions column={3} size="small" className="detail">
                        <Descriptions.Item label="Thương hiệu" span={3}>
                          <Typography.Text ellipsis style={{ maxWidth: 240 }}>
                            {productData.brand}
                          </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Danh mục" span={3}>
                          {productData.category ? (
                            <ChipTag
                              icon={<Avatar size={15}>{productData.category.name[0]}</Avatar>}
                              className="colorful rounded"
                              color={"#d9d9d9"}
                            >
                              <Typography.Text ellipsis style={{ maxWidth: 240 }}>
                                {productData.category.name}
                              </Typography.Text>
                            </ChipTag>
                          ) : (
                            <ChipTag
                              icon={<Avatar size={15}>{"404"}</Avatar>}
                              className="colorful rounded"
                              color={"#d9d9d9"}
                            >
                              <Typography.Text ellipsis style={{ maxWidth: 240 }}>
                                Không có
                              </Typography.Text>
                            </ChipTag>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Đã bán" span={2}>
                          <Tooltip
                            placement="topRight"
                            title={
                              <Statistic
                                prefix={
                                  <Typography.Text style={{ fontSize: 14, color: "#eee" }}>
                                    Đã bán:
                                  </Typography.Text>
                                }
                                groupSeparator="."
                                value={totalSold}
                                valueStyle={{ fontSize: 16, color: "#fff" }}
                                suffix={
                                  <Typography.Text style={{ fontSize: 14, color: "#eee" }}>
                                    {" "}
                                    / {totalQuantity + totalSold}
                                  </Typography.Text>
                                }
                              />
                            }
                          >
                            <Progress
                              strokeColor={{
                                from: themeProvider.generatedColors[4],
                                to: themeProvider.generatedColors[1],
                              }}
                              percent={(totalSold > 0
                                ? (totalSold / (totalQuantity + totalSold)) * 100
                                : 0
                              ).toFixed(2)}
                              strokeWidth={12}
                              showInfo={false}
                              status="active"
                            />
                          </Tooltip>
                        </Descriptions.Item>
                      </Descriptions>
                      <span>
                        Phiên bản: <b>{productData.variants.length}</b>
                      </span>
                      <ScrollSnapWrapper>
                        {productData.variants.map((item) => (
                          <ChipVariantItemWrapper key={`ChipVariant_${item._id}`}>
                            <div className="left">
                              <img
                                alt={item._id}
                                src={
                                  productData.images.find((img) => img._id === item.image)?.url ||
                                  NOT_FOUND_IMG
                                }
                              />
                            </div>
                            <div className="right">
                              <div className="price">
                                <Statistic value={item.price} suffix="$" className="price-tag" />
                              </div>
                              <Space wrap={false} size={8}>
                                <ChipTag icon={<BsCheck2Circle size={16.5} />}>{item.sold}</ChipTag>
                                <ChipTag icon={<BsBoxSeam size={14} />}>{item.quantity}</ChipTag>
                              </Space>
                            </div>
                          </ChipVariantItemWrapper>
                        ))}
                      </ScrollSnapWrapper>
                    </Col>
                    <Col flex={mediaBelow1124 ? "none" : "242px"}>
                      <div className={mediaBelow1124 ? "hidden" : "bottom-right"}>
                        <Button
                          type="link"
                          extraType="btntag"
                          block
                          size="large"
                          icon={<BsCartPlus />}
                          className="btn-cart"
                          loading={!productQuerySuccess}
                          disabled={!productQuerySuccess || productData.variants.length < 1}
                          onClick={() => setSelectedProductId(productId)}
                        >
                          Thêm vào giỏ hàng
                        </Button>
                        <Button
                          type="default"
                          block
                          size="large"
                          icon={<BsStar />}
                          className="btn-rating"
                          loading={!productQuerySuccess}
                          disabled={!productQuerySuccess || productData.variants.length < 1}
                          onClick={() => {
                            setReviewFormVisible(true);
                            setActiveKey("reviews");
                          }}
                        >
                          Đánh giá sản phẩm
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="container-detail">
              <div className="detail-top">
                <Tabs
                  defaultActiveKey="content"
                  destroyInactiveTabPane
                  activeKey={activeKey}
                  onChange={(key) => {
                    setActiveKey(key);
                  }}
                >
                  <Tabs.TabPane
                    tab={
                      <ChipTag size={4} fontSize={18} icon={<BsListStars size={16.5} />}>
                        Bài viết
                      </ChipTag>
                    }
                    key="content"
                  >
                    <ProductContentWrapper className={activeKey !== "content" ? "hidden" : ""}>
                      <Row wrap={false} gutter={24}>
                        <Col flex="auto" className="left">
                          <Typography.Title level={2}>
                            {productData.content?.title || ""}
                          </Typography.Title>
                          <PreviewMd value={productData.content?.content || ""} />
                        </Col>
                        {!mediaBelow1024 && (
                          <Col flex="330px" className="right">
                            <Divider orientation="left">
                              Có thể bạn sẽ thích · {relativeProductsData.length}
                            </Divider>
                            <div className="relative-list">
                              {getProductsSuccess ? (
                                relativeProductsData.length > 0 ? (
                                  relativeProductsData.map((p) => (
                                    <ProductCard
                                      key={`relative_productcard_${p._id}`}
                                      product={p}
                                      getSelectedProductId={(p) => setSelectedProductId(p)}
                                      isWishlisted={isWishlisted(p.wishlist, user?._id)}
                                    ></ProductCard>
                                  ))
                                ) : (
                                  <div className="relative-list-empty">
                                    <Empty
                                      className="bordered"
                                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                  </div>
                                )
                              ) : (
                                Array(4)
                                  .fill(null)
                                  .map((i, index) => (
                                    <ProductCardLoading
                                      key={`relative_productCardLoading_${index}`}
                                    />
                                  ))
                              )}
                            </div>
                          </Col>
                        )}
                      </Row>
                    </ProductContentWrapper>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={
                      <ChipTag size={4} fontSize={18} icon={<BsStar size={16.5} />}>
                        Đánh giá
                      </ChipTag>
                    }
                    key="reviews"
                  ></Tabs.TabPane>
                  <Tabs.TabPane
                    tab={
                      <ChipTag size={4} fontSize={18} icon={<BsLayoutWtf size={16.5} />}>
                        Bộ sưu tập
                      </ChipTag>
                    }
                    key="combos"
                  ></Tabs.TabPane>
                </Tabs>
              </div>

              <ProductReviewsWrapper className={activeKey !== "reviews" ? "hidden" : ""}>
                <Row wrap={false} gutter={24}>
                  <Col flex={"auto"} className="left">
                    <List
                      className="comment-list"
                      loading={!productReviewsQuerySuccess}
                      header={
                        <div className="left-top">
                          <Carousel
                            autoplay
                            speed={2000}
                            dots={true}
                            dotPosition="bottom"
                            easing="ease-in"
                            effect="fade"
                            pauseOnHover={false}
                            className="carousel"
                          >
                            {productData.images.length > 0 ? (
                              productData.images.map((item, index) => (
                                <div className="carousel-item" key={`carousel_${item._id}`}>
                                  <img alt={item._id} src={item.url} />
                                </div>
                              ))
                            ) : (
                              <div className="carousel-item" key={"NOT_FOUND_IMG"}>
                                <img alt={"NOT_FOUND_IMG"} src={NOT_FOUND_IMG} />
                              </div>
                            )}
                          </Carousel>
                          <div className="comment-list-header">
                            <Typography.Link strong>
                              {productReviewsRes?.data.length || 0}
                            </Typography.Link>{" "}
                            đánh giá
                          </div>
                        </div>
                      }
                      itemLayout="horizontal"
                      dataSource={productReviewsRes?.data || []}
                      rowKey={(item) => item?._id}
                      renderItem={(item) => (
                        <li>
                          <Comment
                            actions={[
                              <Space wrap={false} size={4} split={<Divider type="vertical" />}>
                                <ChipTag
                                  icon={upvoteValue ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
                                  onClick={() => setUpvoteValue(1)}
                                >
                                  {upvoteValue}
                                </ChipTag>
                                <ChipTag
                                  icon={
                                    downvoteValue ? <BsHandThumbsDownFill /> : <BsHandThumbsDown />
                                  }
                                  onClick={() => setDownvoteValue(1)}
                                >
                                  {downvoteValue}
                                </ChipTag>
                              </Space>,
                            ]}
                            author={
                              <Space
                                className="rating ant-space-center-items"
                                wrap={false}
                                size={8}
                                align="center"
                              >
                                <ChipTag
                                  icon={<BsStarFill />}
                                  className="colorful rounded"
                                  color={"#ffb703"}
                                  size={4}
                                  fontSize={16}
                                >
                                  {item.rating}
                                </ChipTag>
                                <Typography.Text strong={item.createdBy?._id === user?._id}>
                                  {item.createdBy?.name}
                                </Typography.Text>
                              </Space>
                            }
                            avatar={
                              <Avatar size={48} src={item.createdBy?.picture}>
                                {item.createdBy?.name[0]}
                              </Avatar>
                            }
                            content={
                              <Typography.Paragraph
                                ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
                              >
                                {item.comment}
                              </Typography.Paragraph>
                            }
                            datetime={formatDate(item.createdAt)}
                          />
                        </li>
                      )}
                    />
                  </Col>
                  {!mediaBelow625 && (
                    <Col flex={"none"} className="right">
                      <Card size="small">
                        <Form
                          form={reviewsFilterForm}
                          onValuesChange={handleFilterReviews}
                          layout="vertical"
                        >
                          <Divider orientation="left" plain>
                            Đánh giá ·{" "}
                            {productReviewsFilter.rating
                              ? productReviewsFilter.rating < 5
                                ? `${productReviewsFilter.rating} ~ ${
                                    productReviewsFilter.rating + 1
                                  }`
                                : 5
                              : ""}
                          </Divider>
                          <Form.Item name="rating">
                            <Radio.Group>
                              <Space
                                direction="vertical"
                                size={0}
                                style={{ flexDirection: "column-reverse" }}
                              >
                                {Array(5)
                                  .fill(null)
                                  .map((item, index) => (
                                    <Radio value={index + 1} key={`radio_star_${index}`}>
                                      <Rate disabled defaultValue={index + 1} />
                                    </Radio>
                                  ))}
                              </Space>
                            </Radio.Group>
                          </Form.Item>
                          <Form.Item noStyle>
                            <Button
                              htmlType="button"
                              icon={<RiFilterOffLine />}
                              block
                              onClick={handleResetRatingFilter}
                            >
                              Hủy bộ lọc
                            </Button>
                          </Form.Item>
                        </Form>
                      </Card>
                    </Col>
                  )}
                </Row>
              </ProductReviewsWrapper>
              <ProductCombosWrapper className={activeKey !== "combos" ? "hidden" : ""}>
                <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} className="bordered" />
              </ProductCombosWrapper>
            </div>
          </div>
          <div className={mediaBelow1124 ? "fixed-bottom-actions" : "hidden"}>
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
                    extraType="btntag"
                    block
                    size="large"
                    icon={<BsCartPlus />}
                    className="btn-cart"
                    loading={!productQuerySuccess}
                    disabled={!productQuerySuccess || productData.variants.length < 1}
                    onClick={() => setSelectedProductId(productId)}
                  >
                    Thêm vào giỏ hàng
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
                          ? isWishlisted(productData.wishlist, user?._id)
                            ? "Bạn đã thích sản phẩm này"
                            : "Thêm vào Yêu thích"
                          : "Đăng nhập trước nha"
                      }
                    >
                      <button
                        disabled={toggleProductWishlistLoading}
                        className={classNames("btn-wishlist", {
                          active: isWishlisted(productData.wishlist, user?._id),
                          loading: toggleProductWishlistLoading,
                        })}
                        onClick={() =>
                          handleToggleWishlist(
                            productId,
                            isWishlisted(productData.wishlist, user?._id)
                          )
                        }
                      >
                        {isWishlisted(productData.wishlist, user?._id) ? (
                          <BsHeartFill />
                        ) : (
                          <BsHeart />
                        )}
                        ·<span>{productData.wishlist.length}</span>
                      </button>
                    </Tooltip>
                    <Tooltip
                      overlayClassName={mediaAbove1280 ? "" : "hidden"}
                      placement="topRight"
                      destroyTooltipOnHide
                      title="Đánh giá"
                      arrowPointAtCenter
                    >
                      <button className="btn-rating">
                        <BsStar size={16.5} />·<span>{productData.avgRating}</span>
                      </button>
                    </Tooltip>
                  </Space>
                ) : (
                  <Skeleton.Button active block size="large" />
                )}
              </Col>
            </Row>
          </div>
        </ProductDetailWrapper>
      ) : (
        <Loader />
      )}
      {productQuerySuccess && (
        <ProductDrawerDetail
          productId={selectedProductId || null}
          setSelectedProduct={(value) => setSelectedProductId(value)}
        />
      )}
      <BackTop />
      <Modal
        getContainer={false}
        title={!myReview ? "Đánh giá sản phẩm" : null}
        visible={reviewFormVisible}
        okText="Đăng"
        cancelText="Hủy"
        {...(!myReview ? {} : { footer: null })}
        onCancel={() => {
          setReviewFormVisible(false);
        }}
        okButtonProps={{
          loading: createReviewLoading,
          disabled: createReviewLoading || !!myReview || !isSignedIn,
          icon: <BsStars />,
        }}
        onOk={() => {
          reviewForm
            .validateFields()
            .then(({ rating, comment }) => {
              handleCreateReview({ rating, comment });
            })
            .catch((err) => {
              console.log("Validate Failed:", err);
            });
        }}
      >
        <ModalWrapper>
          {!myReview && (
            <Form
              disabled={!!myReview || !isSignedIn}
              form={reviewForm}
              layout="vertical"
              onValuesChange={handleReviewChange}
              initialValues={{
                rating: 5,
              }}
              requiredMark={false}
            >
              <Form.Item
                name="rating"
                label={
                  <ChipTag icon={<BsStar />} size={4}>
                    Đánh giá
                  </ChipTag>
                }
                rules={[
                  { required: true, type: "number", message: "Bạn chưa chọn đánh giá" },
                  { min: 1, type: "number", message: "Bạn chưa chọn đánh giá" },
                ]}
              >
                <Rate allowClear={false} allowHalf />
              </Form.Item>
              <Form.Item
                name="comment"
                label={
                  <ChipTag icon={<BsChatSquareText />} size={4}>
                    Bình luận
                  </ChipTag>
                }
                rules={[{ required: true, message: "Bạn chưa nhập bình luận" }]}
              >
                <Input.TextArea
                  rows={4}
                  showCount
                  autoSize={{ minRows: 4, maxRows: 4 }}
                  placeholder="Nhập bình luận của bạn..."
                />
              </Form.Item>
            </Form>
          )}
          <Divider className={!myReview ? "" : "hidden"} />
          {!!myReview && (
            <div className="thankyou-wrapper">
              <Image
                preview={false}
                src={THANKYOU_IMG}
                alt="THANKYOU_IMG"
                fallback={NOT_FOUND_IMG}
              />
            </div>
          )}
          <Comment
            actions={[
              <Space wrap={false} size={4} split={<Divider type="vertical" />}>
                <ChipTag icon={<BsHandThumbsUp />}>{0}</ChipTag>
                <ChipTag icon={<BsHandThumbsDown />}>{0}</ChipTag>
              </Space>,
            ]}
            author={
              <Space className="rating ant-space-center-items" wrap={false} size={8} align="center">
                <ChipTag
                  icon={<BsStarFill />}
                  className="colorful rounded"
                  color={"#ffb703"}
                  size={4}
                  fontSize={16}
                >
                  {ratingValue || 0}
                </ChipTag>
                <Typography.Text strong>{user?.name}</Typography.Text>
              </Space>
            }
            avatar={
              <Avatar size={48} src={user?.picture} icon={<BsPerson />}>
                {user?.name[0]}
              </Avatar>
            }
            content={
              <Typography.Paragraph
                {...(!commentValue ? { type: "secondary" } : {})}
                ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
              >
                {commentValue || "Bình luận của bạn về sản phẩm..."}
              </Typography.Paragraph>
            }
            datetime={formatDate(myReview?.createdAt)}
          />
        </ModalWrapper>
      </Modal>
    </MainLayout>
  );
};

const ProductDetailWrapper = styled.main`
  & .container-big-banner {
    width: 100%;
    height: 360px;
    overflow: hidden;
    position: relative;
    & > img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: translateY(-64px);
      z-index: 1;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${rgba("#fff", 0.5)};
      backdrop-filter: blur(4px);
      z-index: 2;
    }
  }
  & .container-main {
    border-radius: 8px;
    position: relative;
    z-index: 3;
    background-color: #fff;
    max-width: 1440px;
    min-height: 100vh;
    margin: 0 auto;
    transform: translateY(-120px);
    padding: 0 96px 96px;
    box-shadow: 0 2px 8px #f0f1f2;
    @media screen and (max-width: 1123.98px) {
      padding: 0 48px 48px;
    }
    @media screen and (max-width: 767.98px) {
      padding: 0 24px 24px;
    }
  }
  & .ellipse-box-1 {
    height: 248px;
    background: ${(props) => rgba(props.theme.generatedColors[1], 0.25)};
    clip-path: ellipse(90% 100% at 24% 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  & .ellipse-box-2 {
    height: 256px;
    background: ${(props) => rgba(props.theme.generatedColors[0], 0.25)};
    clip-path: ellipse(90% 100% at 36% 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  & .container-info {
    position: absolute;
    top: 0;
    width: calc(100% - 96px * 2);
    transform: translateY(-200px);
    @media screen and (max-width: 1123.98px) {
      position: relative;
      width: 100%;
    }
  }
  & .container-detail {
    padding-top: 300px;
    @media screen and (max-width: 1123.98px) {
      transform: translateY(-200px);
      padding-top: 24px;
    }
  }
  & .left-info {
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 1123.98px) {
      margin-top: 32px;
    }
    @media screen and (max-width: 767.98px) {
      margin-top: 14px;
    }
  }
  & .left-info-top {
    height: 200px;
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
    & .title {
      margin-bottom: 8px;
    }
    & .desc {
      margin-top: 0;
      margin-bottom: 8px;
    }
    @media screen and (max-width: 1123.98px) {
      height: auto;
    }
  }
  & .left-info-bottom {
    margin-top: 12px;
    & .bottom-left {
      position: relative;
      display: flex;
      flex-direction: column;
    }
    & .bottom-left::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 248px;
      backdrop-filter: blur(10px);
      background-color: rgba(255, 255, 255, 0.5);
      z-index: -1;
      transform: translateY(-10px) scale(1.1, 1);
      transform-origin: left;
      clip-path: ellipse(100% 84% at 45% 0);
    }
    & .bottom-left .detail {
      margin-top: auto;
    }
    & .bottom-left .rating-wrapper {
      margin-bottom: 12px;
      & .rating-value {
        text-decoration: underline;
      }
    }
    & .bottom-right {
      position: absolute;
      top: 0;
      transform: translateY(-50px);
      padding: 16px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #fff;
      box-shadow: 0 2px 8px #f0f1f2;
    }
    & .btn-cart {
      border: 1px solid ${(props) => props.theme.generatedColors[3]};
      &:hover {
        text-decoration: underline;
        border-color: ${(props) => props.theme.generatedColors[3]};
      }
    }
  }
  & .poster-slider .price {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    padding: 1px 8px;
    background-color: ${(props) => props.theme.generatedColors[1]};
    border-radius: 5px;
    & .price-tag .ant-statistic-content,
    & > span {
      font-size: 15px;
      font-weight: 500;
      color: ${(props) => props.theme.generatedColors[5]};
    }
  }
  & .fixed-bottom-actions {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    z-index: 99;
    background-color: #fff;
    box-shadow: 0px -1px 4px 0px #f0f1f2;
    padding: 8px;
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
    & .btn-wishlist,
    & .btn-rating {
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
      &.loading {
        pointer-events: none;
        cursor: wait;
        color: #d9d9d9 !important;
        border: none !important;
        outline: none !important;
        background: transparent !important;
      }
    }
    & .btn-wishlist {
      &.active {
        color: #ff4d4f;
      }
      &:hover {
        color: #ff4d4f;
        border-bottom: 1px solid #ff4d4f;
      }
    }
    & .btn-rating {
      &.active {
        color: #ffb703;
      }
      &:hover {
        color: #ffb703;
        border-bottom: 1px solid #ffb703;
      }
    }
  }
`;

const ChipVariantItemWrapper = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  background: ${(props) => rgba(props.theme.generatedColors[2], 0.2)};
  backdrop-filter: blur(4px);
  flex-wrap: nowrap;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  & .left {
    border-radius: 2px;
    position: relative;
    width: 56px;
    height: 56px;
    cursor: pointer;
    overflow: hidden;
    & img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.2s ease;
    }
  }
  & .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 6px;
    height: 100%;
    & .chip-tag {
      border-radius: 2px;
      padding: 0 6px;
      background: ${(props) => rgba(props.theme.generatedColors[0], 0.6)};
      color: ${(props) => rgba(props.theme.primaryColor, 0.8)};
    }
    & .price {
      padding: 0 6px;
      background: ${(props) => rgba(props.theme.generatedColors[0], 0.6)};
      & .ant-statistic-content {
        color: ${(props) => rgba(props.theme.primaryColor, 0.8)};
        font-size: 16px;
      }
    }
  }
  &:hover {
    border-color: ${(props) => rgba(props.theme.primaryColor, 0.8)};
    background: ${(props) => rgba(props.theme.generatedColors[1], 0.25)};
    & .left > img {
      transform: scale(1.2);
      transform-origin: center;
    }
    & .chip-tag {
      color: ${(props) => props.theme.generatedColors[5]};
      background-color: ${(props) => rgba(props.theme.generatedColors[1], 0.6)};
    }
    & .price {
      background-color: ${(props) => rgba(props.theme.generatedColors[1], 0.6)};
      & .ant-statistic-content {
        color: ${(props) => props.theme.generatedColors[5]};
      }
    }
  }
`;

const ProductContentWrapper = styled.section`
  & .relative-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  & .relative-list-empty {
    padding-left: 24px;
  }
`;
const ProductReviewsWrapper = styled.section`
  & .left,
  & .right {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  & .left-top {
    position: relative;
    height: 64px;
    & .carousel-item {
      position: relative;
      overflow: hidden;
      height: 64px;
      & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${rgba("#fff", 0.5)};
        backdrop-filter: blur(8px);
        z-index: 2;
      }
    }
    & .comment-list-header {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: ${(props) => props.theme.generatedColors[0]};
      padding: 4px 8px;
      border-radius: 2px;
    }
  }
  & .comment {
    &-list {
      position: relative;
      & .ant-comment-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &-list .ant-list-header {
      padding-top: 0;
    }
    &-list::before {
      content: "";
      width: 2px;
      height: calc(100% - 64px);
      background: #c7cacb;
      position: absolute;
      left: 16px;
      top: 0;
      transform: translate(8px, 64px);
    }
    &-list::after {
      content: "";
      position: absolute;
      background: #c7cacb;
      bottom: -1px;
      left: 12px;
      width: 10px;
      height: 10px;
      border: 3px solid #999;
      border-radius: 50%;
      transform: translate(8px, 0);
    }
  }
`;
const ProductCombosWrapper = styled.section``;
const ModalWrapper = styled.div`
  & .ant-comment-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  & .ant-comment-inner {
    padding: 0;
  }
  & .thankyou-wrapper {
    width: 100%;
    height: 360px;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
const ScrollSnapWrapper = styled.div`
  margin-top: 8px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  width: 100%;
  max-width: 100%;
  display: grid !important;
  justify-content: flex-start !important;
  grid-auto-columns: max-content;
  grid-template-columns: unset;
  grid-column-gap: 16px;
  overflow-x: scroll;
  grid-auto-flow: column;
  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;
  & > * {
    scroll-snap-align: center;
    width: auto;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default ProductDetailPage;
