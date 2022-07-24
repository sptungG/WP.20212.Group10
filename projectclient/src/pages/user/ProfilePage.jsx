import {
  Affix,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Card,
  Col,
  Collapse,
  Comment,
  Descriptions,
  Divider,
  Image,
  List,
  PageHeader,
  Popconfirm,
  Progress,
  Row,
  Segmented,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Button from "src/components/button/Button";
import { useGetMyAddressListQuery } from "src/stores/address/address.query";
import {
  BsArrowDown,
  BsBoxSeam,
  BsCartPlus,
  BsCash,
  BsChatSquareText,
  BsCheckLg,
  BsCreditCard2Front,
  BsCreditCard2FrontFill,
  BsExclamationLg,
  BsEye,
  BsFileText,
  BsFillPrinterFill,
  BsGear,
  BsHandThumbsDown,
  BsHandThumbsDownFill,
  BsHandThumbsUp,
  BsHandThumbsUpFill,
  BsHeart,
  BsHeartFill,
  BsJournalText,
  BsPencil,
  BsPersonCircle,
  BsPinMap,
  BsPlusCircle,
  BsPrinter,
  BsSliders,
  BsStar,
  BsStarFill,
  BsTelephone,
  BsTrash,
  BsXCircle,
  BsXLg,
} from "react-icons/bs";
import { RiHistoryFill } from "react-icons/ri";
import { useAuth } from "src/common/useAuth";
import ChipTag from "src/components/chip/ChipTag";
import GalleryBgLayoutWithHeader from "src/layout/GalleryBgLayoutWithHeader";
import styled from "styled-components";
import { checkValidColor, findImageById, formatDate, setColorByStatus } from "src/common/utils";
import { useGetReviewsFilteredQuery } from "src/stores/review/review.query";
import { useGetMyOrdersQuery } from "src/stores/order/order.query";
import { useNavigate } from "react-router-dom";
import UpdateAddressDrawer from "src/components/form/UpdateAddressDrawer";
import { useGetProductsWishlistByUserIdQuery } from "src/stores/product/product.query";
import { NOT_FOUND_IMG } from "src/common/constant";
import classNames from "classnames";
import { isWishlisted, useToggleWishlist } from "src/common/useToggleWishlist";
import { getTotalInventoryQuantity, getTotalInventorySold } from "../product/ProductDetailPage";
import { useChangeThemeProvider } from "src/common/useChangeThemeProvider";
import TinyAreaChart from "src/components/chart/TinyAreaChart";
import TinyColumnChart from "src/components/chart/TinyColumnChart";
import { AiOutlineAreaChart, AiOutlineBarChart } from "react-icons/ai";
import LocalSearch from "src/components/input/LocalSearch";
import lodash from "lodash";
import MasonryLayout from "src/components/images/MasonryLayout";
import { rgba } from "polished";
import ProductDrawerDetail from "src/components/card/ProductDrawerDetail";
import UOrderDetailTable from "./UOrderDetailTable";
import UpdatePasswordForm from "./UpdatePasswordForm";
import UpdateInfoForm from "./UpdateInfoForm";
import PaymentInfoTag from "src/components/chip/PaymentInfoTag";
import ModalCancelOrder from "./ModalCancelOrder";

const getTotalCount = (products = []) => {
  return products.reduce((currentValue, nextValue) => {
    return currentValue + nextValue.saved_quantity;
  }, 0);
};

const ProfilePage = () => {
  let navigate = useNavigate();
  const { user } = useAuth();
  const { handleToggleWishlist, toggleProductWishlistLoading } = useToggleWishlist();
  const { themeProvider } = useChangeThemeProvider();
  const { data: getMyAddressListQuery, isSuccess: getMyAddressListSuccess } =
    useGetMyAddressListQuery();
  const { data: getMyReviewsFilteredQuery, isSuccess: getMyReviewsFilteredSuccess } =
    useGetReviewsFilteredQuery(
      { page: 1, limit: 10, onModel: "Product", createdBy: user?._id },
      { skip: !user?._id }
    );
  const {
    data: getMyOrdersQuery,
    isSuccess: getMyOrdersSuccess,
    refetch: getMyOrdersRefetch,
  } = useGetMyOrdersQuery({}, { skip: !user?._id });
  const { data: getMyProductsWishlistQuery, isSuccess: getMyProductsWishlistSuccess } =
    useGetProductsWishlistByUserIdQuery({}, { skip: !user?._id });
  const [activeTabKey, setActiveTabKey] = useState("history");
  const myAddressList = getMyAddressListSuccess ? getMyAddressListQuery?.data : [];
  const foundAddress = findImageById(user?.defaultAddress, myAddressList);
  const myOrdersList = getMyOrdersSuccess ? getMyOrdersQuery?.data : [];
  const myProductsWishlist = getMyProductsWishlistSuccess ? getMyProductsWishlistQuery?.data : [];
  const myProductReviews = getMyReviewsFilteredSuccess ? getMyReviewsFilteredQuery?.data : [];
  const [upvoteValue, setUpvoteValue] = useState(0);
  const [downvoteValue, setDownvoteValue] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [updateAddressVisible, setUpdateAddressVisible] = useState(false);
  const [valueSegment, setValueSegment] = useState("barChart");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderToModal, setSelectedOrderToModal] = useState(null);
  const [myOrdersListFiltered, setMyOrdersListFiltered] = useState([]);
  const dataForTinyChart = (arr = []) =>
    arr
      .filter((item) => !["CANCELLING", "CANCELLED"].includes(item.orderStatus.value))
      .map((item) => item.totalPrice);
  const statusList =
    lodash.uniqBy(
      myOrdersList.map((item) => item.orderStatus),
      "value"
    ) || [];

  useEffect(() => {
    if (getMyOrdersQuery?.data) setMyOrdersListFiltered(getMyOrdersQuery?.data);
  }, [getMyOrdersQuery?.data]);

  const handleCancelMyOrder = ({ _id: orderId, paymentInfo }) => {
    setSelectedOrderToModal({ orderId, paymentInfo });
  };
  const handleDeleteAddress = ({ _id: addressId }) => {
    console.log("addressId", addressId);
  };
  const searched = (keyword) => (c) => c._id.includes(keyword);
  const handleLocalSearch = ({ keySearch = "" }) => {
    const newList = myOrdersList.filter(searched(keySearch));
    setMyOrdersListFiltered(newList);
  };
  const handleChangeChecked = (tag, checked) => {
    const nextSelectedTag = checked ? tag : "";
    const newList = nextSelectedTag
      ? myOrdersList.filter((o) => o.orderStatus.value === nextSelectedTag)
      : myOrdersList;
    setMyOrdersListFiltered(newList);
    setSelectedTag(nextSelectedTag);
  };

  return (
    <GalleryBgLayoutWithHeader backgroundClassName="bg-gray">
      <ProfileWrapper>
        <Row wrap={false} gutter={24} className="profile-wrapper">
          <Col flex="360px" className="left">
            <Affix offsetTop={64}>
              <Card>
                <div className="profile-detail">
                  <div className="avatar-container">
                    <Button
                      size="large"
                      shape="circle"
                      style={{ height: 110, width: 110, padding: 2 }}
                      onClick={() => setActiveTabKey("setting")}
                    >
                      <Avatar size={100} src={user?.picture} />
                    </Button>
                    <div className="name-container">
                      <Typography.Title level={3} ellipsis>
                        {user.name}
                      </Typography.Title>
                      <Typography.Text type="secondary" ellipsis>
                        {user.email}
                      </Typography.Text>
                    </div>
                    <Divider plain style={{ margin: "24px 0" }} />
                    <div className="info-container">
                      {foundAddress ? (
                        <div className="address-container">
                          <Typography.Text type="secondary" ellipsis>
                            Địa chỉ mặc định
                          </Typography.Text>
                          <Space direction="vertical" size={2} style={{ width: "100%" }}>
                            <ChipTag icon={<BsPinMap />}>
                              <Space size={0} wrap={false} split={<Divider type="vertical" />}>
                                <Typography.Text ellipsis>{foundAddress.area}</Typography.Text>
                                <Typography.Text ellipsis>{foundAddress.city}</Typography.Text>
                              </Space>
                            </ChipTag>
                          </Space>
                          <ChipTag icon={<BsTelephone />}>
                            <Typography.Text ellipsis>
                              {foundAddress?.phoneNo || "Chưa có"}
                            </Typography.Text>
                          </ChipTag>
                        </div>
                      ) : (
                        <div className="address-container">
                          <ChipTag icon={<BsPinMap />}>
                            <Typography.Text ellipsis>Chưa có địa chỉ</Typography.Text>
                          </ChipTag>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="detail-container"></div>
                  <Divider plain style={{ margin: "24px 0" }} />
                  <div className="extra-container">
                    <div className="actions">
                      <Segmented
                        options={[
                          {
                            value: "barChart",
                            icon: <AiOutlineBarChart size={16} />,
                          },
                          {
                            value: "areaChart",
                            icon: <AiOutlineAreaChart size={16} />,
                          },
                        ]}
                        value={valueSegment}
                        onChange={setValueSegment}
                      />
                    </div>
                    <Tooltip title="Biến động chi tiêu" placement="bottomRight">
                      <div style={{ maxWidth: 360 }}>
                        {valueSegment === "barChart" && (
                          <TinyColumnChart data={dataForTinyChart(myOrdersList)} autoFit={true} />
                        )}
                        {valueSegment === "areaChart" && (
                          <TinyAreaChart data={dataForTinyChart(myOrdersList)} autoFit={true} />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            </Affix>
          </Col>
          <Col flex="auto" className="right">
            <Card
              style={{ height: "100%" }}
              tabList={[
                {
                  key: "history",
                  tab: (
                    <ChipTag size={4} fontSize={18} icon={<RiHistoryFill size={17} />}>
                      Đơn hàng · {myOrdersList.length}
                    </ChipTag>
                  ),
                },
                {
                  key: "wishlist",
                  tab: (
                    <ChipTag size={4} fontSize={18} icon={<BsHeart size={16} />}>
                      Yêu thích · {myProductsWishlist.length}
                    </ChipTag>
                  ),
                },
                {
                  key: "review",
                  tab: (
                    <ChipTag size={4} fontSize={18} icon={<BsStar size={16.5} />}>
                      Đã đánh giá · {myProductReviews.length}
                    </ChipTag>
                  ),
                },
                {
                  key: "address_list",
                  tab: (
                    <ChipTag size={4} fontSize={18} icon={<BsJournalText size={16.5} />}>
                      Sổ địa chỉ · {myAddressList.length}
                    </ChipTag>
                  ),
                },
                {
                  key: "setting",
                  tab: (
                    <ChipTag size={4} fontSize={18} icon={<BsGear size={16.5} />}>
                      Cài đặt
                    </ChipTag>
                  ),
                },
              ]}
              activeTabKey={activeTabKey}
              onTabChange={(key) => {
                setActiveTabKey(key);
              }}
              bordered={false}
            >
              <div className={activeTabKey !== "history" ? "hidden" : "history-container"}>
                <div className="header-filter">
                  <LocalSearch
                    placeholder="Tìm kiếm đơn hàng theo Mã đơn hàng"
                    onFinish={handleLocalSearch}
                    onValuesChange={(changedValue, values) => handleLocalSearch(values)}
                  />
                  <div className="header-filter-statuses">
                    <Typography.Text type="secondary">
                      <ChipTag icon={<BsSliders />}>Trạng thái đơn hàng:</ChipTag>
                    </Typography.Text>
                    <Space size={0}>
                      {statusList.map((item) => (
                        <Tag.CheckableTag
                          key={item.value}
                          checked={item.value === selectedTag}
                          onChange={(checked) => handleChangeChecked(item.value, checked)}
                          style={{ fontSize: 14 }}
                        >
                          {item.name}
                        </Tag.CheckableTag>
                      ))}
                    </Space>
                  </div>
                </div>
                <List
                  itemLayout="vertical"
                  size="large"
                  loading={!myOrdersListFiltered}
                  pagination={{
                    total: myOrdersListFiltered.length,
                    pageSize: 5,
                  }}
                  bordered={false}
                  dataSource={myOrdersListFiltered}
                  renderItem={(item) => (
                    <Row className="order-item" key={item._id}>
                      <Divider plain orientation="left" orientationMargin={0} style={{ margin: 0 }}>
                        <Tag color={setColorByStatus(item.orderStatus.value)}>
                          {item.orderStatus.name}
                        </Tag>
                        <PaymentInfoTag paymentInfo={item.paymentInfo} />
                      </Divider>
                      <Col span={24}>
                        <List
                          size="small"
                          bordered={false}
                          itemLayout="horizontal"
                          className="orderitems-list"
                          dataSource={item.orderItems}
                          rowKey={(ot) => ot._id}
                          renderItem={(ot) => {
                            return (
                              <List.Item
                                className="orderitems-item"
                                key={ot._id}
                                actions={[
                                  <Space>
                                    <Statistic
                                      prefix="$"
                                      groupSeparator=","
                                      value={ot.saved_price}
                                      valueStyle={{ fontSize: 16 }}
                                    />
                                  </Space>,
                                ]}
                              >
                                <List.Item.Meta
                                  avatar={
                                    <div className="orderitems-image">
                                      <Image
                                        src={ot.saved_image}
                                        fallback={NOT_FOUND_IMG}
                                        preview={false}
                                      />
                                      <div className="orderitems-quantity">
                                        <ChipTag icon={<BsBoxSeam size={16.5} />}>
                                          x{ot.saved_quantity}
                                        </ChipTag>
                                      </div>
                                    </div>
                                  }
                                  title={
                                    <Typography.Text ellipsis className="orderitems-name">
                                      {ot.saved_name}
                                    </Typography.Text>
                                  }
                                  description={
                                    <div className="orderitems-variant">
                                      <Descriptions column={1} size="small">
                                        {ot.saved_variant.map((o, index) => (
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
                                                style={{ margin: 0 }}
                                              >
                                                <Typography.Text ellipsis>
                                                  {o.value}
                                                </Typography.Text>
                                              </Tag>
                                            )}
                                          </Descriptions.Item>
                                        ))}
                                      </Descriptions>
                                    </div>
                                  }
                                />
                              </List.Item>
                            );
                          }}
                        />
                      </Col>
                      <Col span={24} className="order-item-bottom">
                        <div className="container">
                          <Statistic
                            prefix={
                              <Typography.Text style={{ fontSize: 16, color: "#262626" }}>
                                Tổng tiền: $
                              </Typography.Text>
                            }
                            groupSeparator="."
                            value={item.totalPrice}
                            valueStyle={{ fontSize: 18, color: "#000" }}
                          />
                          <Space size={8} wrap={false}>
                            {item.orderStatus.value === "PROCESSING" && (
                              <Button onClick={() => handleCancelMyOrder(item)}>Hủy đơn</Button>
                            )}
                            <Button
                              onClick={() =>
                                setSelectedProductId(item.orderItems[0]?.product || null)
                              }
                            >
                              Mua lại
                            </Button>
                            <Button
                              type="link"
                              extraType="btntag"
                              className="btn-cart"
                              onClick={() => {
                                setActiveTabKey("orderdetail");
                                setSelectedOrder(item);
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </Space>
                        </div>
                      </Col>
                    </Row>
                  )}
                />
              </div>
              <div
                className={
                  activeTabKey !== "orderdetail" || !selectedOrder
                    ? "hidden"
                    : "orderdetail-container"
                }
              >
                {selectedOrder && (
                  <div className="order-item">
                    <PageHeader
                      backIcon={false}
                      onBack={() => {
                        setActiveTabKey("history");
                        setSelectedOrder(null);
                      }}
                      title={`Chi tiết đơn hàng #${selectedOrder._id}`}
                      extra={
                        <ChipTag icon={<span>Ngày đặt hàng</span>}>
                          {formatDate(selectedOrder.createdAt)}
                        </ChipTag>
                      }
                      tags={[
                        <Tag color={setColorByStatus(selectedOrder.orderStatus.value)}>
                          {selectedOrder.orderStatus.name}
                        </Tag>,
                        <PaymentInfoTag paymentInfo={selectedOrder.paymentInfo} />,
                      ]}
                      breadcrumb={
                        <Breadcrumb>
                          <Breadcrumb.Item
                            onClick={() => {
                              setActiveTabKey("history");
                              setSelectedOrder(null);
                            }}
                            className="breadcrumb"
                          >
                            Đơn hàng
                          </Breadcrumb.Item>
                          <Breadcrumb.Item onClick={() => ""}>{selectedOrder._id}</Breadcrumb.Item>
                        </Breadcrumb>
                      }
                      style={{ padding: 0, marginBottom: 24 }}
                    />
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <Card
                          size="small"
                          title={
                            <Space className="ant-space-center-items">
                              <span>THÔNG BÁO</span>
                              <BsArrowDown size={18} />
                            </Space>
                          }
                          bordered={false}
                          className="shadowed"
                        >
                          <div className="timeline-container">
                            {selectedOrder.orderLog.length && (
                              <Timeline
                                pending={!selectedOrder ? "Đang xử lý..." : false}
                                mode="left"
                              >
                                {selectedOrder.orderLog.map((stt) => (
                                  <Timeline.Item
                                    key={stt._id}
                                    label={
                                      <Typography.Text ellipsis>
                                        {formatDate(stt.createdAt, "DD-MM-YYYY HH:mm:ss")}
                                      </Typography.Text>
                                    }
                                    color="blue"
                                  >
                                    <Space direction="vertical">
                                      <Alert
                                        type="info"
                                        description={
                                          <Typography.Paragraph
                                            ellipsis={{
                                              rows: 2,
                                              expandable: true,
                                              symbol: "Xem thêm",
                                            }}
                                            style={{ maxWidth: 200, margin: 0 }}
                                          >
                                            {stt.content}
                                          </Typography.Paragraph>
                                        }
                                      />
                                      {stt.createdBy === user?._id ? (
                                        <ChipTag icon={<Avatar src={user.picture} size={16} />}>
                                          {user.name}
                                        </ChipTag>
                                      ) : (
                                        <ChipTag icon={<BsPersonCircle />}>
                                          {stt.createdBy.substring(0, 10) + "..."}
                                        </ChipTag>
                                      )}
                                    </Space>
                                  </Timeline.Item>
                                ))}
                              </Timeline>
                            )}
                          </div>
                        </Card>
                      </Col>
                      <Col span={24}>
                        <Card
                          size="small"
                          title="ĐỊA CHỈ NGƯỜI NHẬN"
                          bordered={false}
                          className="shadowed"
                        >
                          <Descriptions column={3} size="small">
                            <Descriptions.Item label="Tên người nhận" span={1}>
                              <Typography.Text ellipsis style={{ maxWidth: 168 }}>
                                {selectedOrder.shippingInfo.name}
                              </Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={1}>
                              {selectedOrder.shippingInfo.phoneNo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Quốc gia" span={1}>
                              {selectedOrder.shippingInfo.country}
                            </Descriptions.Item>
                            <Descriptions.Item label="Khu vực" span={1}>
                              {selectedOrder.shippingInfo.area}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tỉnh thành" span={1}>
                              {selectedOrder.shippingInfo.city}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã zip" span={1}>
                              {selectedOrder.shippingInfo.postalCode}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ cụ thể" span={3}>
                              <Typography.Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{ maxWidth: 740 }}
                              >
                                {selectedOrder.shippingInfo.address}
                              </Typography.Paragraph>
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Col>
                      <Col span={24}>
                        <UOrderDetailTable
                          className="shadowed"
                          dataSource={selectedOrder.orderItems}
                          getSelectedProductId={(p) => setSelectedProductId(p)}
                          footer={() => (
                            <div className="table-footer-container">
                              <Descriptions
                                size="small"
                                column={2}
                                style={{ width: "100%", maxWidth: 320 }}
                                layout="vertical"
                              >
                                <Descriptions.Item
                                  span={2}
                                  label="Ghi chú"
                                  contentStyle={{ textAlign: "justify" }}
                                >
                                  {selectedOrder.orderNote}
                                </Descriptions.Item>
                              </Descriptions>
                              <Space direction="vertical" size={4}>
                                <div className="item">
                                  <span>Tổng sản phẩm:</span>
                                  <span>
                                    <Statistic
                                      prefix="x"
                                      groupSeparator=","
                                      value={getTotalCount(selectedOrder.orderItems)}
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
                                      value={selectedOrder.itemsPrice}
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
                                      value={selectedOrder.shippingPrice}
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
                                      value={selectedOrder.totalPrice}
                                      valueStyle={{ fontSize: 16 }}
                                    />
                                  </span>
                                </div>
                              </Space>
                            </div>
                          )}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
              <div className={activeTabKey !== "wishlist" ? "hidden" : "wishlist-container"}>
                <MasonryLayout columns={3} gap={24}>
                  {myProductsWishlist
                    ? myProductsWishlist.map(({ modelId: item }) => {
                        const totalQuantity = getTotalInventoryQuantity(item.variants);
                        const totalSold = getTotalInventorySold(item.variants);
                        return (
                          <div className="wishlist-item" key={item._id}>
                            <div className="container">
                              <div className="avatar-wrapper">
                                <Avatar.Group maxCount={1}>
                                  {item.images.map((item, index) => (
                                    <Avatar
                                      size={72}
                                      style={
                                        index === 0
                                          ? {
                                              width: "100%",
                                              height: "100%",
                                            }
                                          : {}
                                      }
                                      shape="square"
                                      src={item.url}
                                      fallback={NOT_FOUND_IMG}
                                      key={`table_${item._id}`}
                                    />
                                  ))}
                                </Avatar.Group>

                                <div className="extra-content">
                                  <div className="progress-item">
                                    <Tooltip
                                      placement="bottomLeft"
                                      title={
                                        <Statistic
                                          prefix={
                                            <Typography.Text
                                              style={{ fontSize: 14, color: "#eee" }}
                                            >
                                              Đã bán:
                                            </Typography.Text>
                                          }
                                          groupSeparator="."
                                          value={totalSold}
                                          valueStyle={{ fontSize: 16, color: "#fff" }}
                                          suffix={
                                            <Typography.Text
                                              style={{ fontSize: 14, color: "#eee" }}
                                            >
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
                                  </div>
                                </div>
                                <div className="actions-cart">
                                  <Button
                                    type="link"
                                    extraType="btntag"
                                    size="large"
                                    icon={<BsCartPlus />}
                                    className="btn-cart"
                                    title="Thêm vào giỏ hàng"
                                    onClick={() => setSelectedProductId(item._id)}
                                  ></Button>
                                </div>
                                <div className="actions-wishlist">
                                  <button
                                    disabled={toggleProductWishlistLoading}
                                    className={classNames("btn-wishlist", {
                                      active: isWishlisted(item.wishlist, user?._id),
                                      loading: toggleProductWishlistLoading,
                                    })}
                                    onClick={() =>
                                      handleToggleWishlist(
                                        item._id,
                                        isWishlisted(item.wishlist, user?._id)
                                      )
                                    }
                                  >
                                    {isWishlisted(item.wishlist, user?._id) ? (
                                      <BsHeartFill />
                                    ) : (
                                      <BsHeart />
                                    )}
                                    ·<span>{item.wishlist.length}</span>
                                  </button>
                                </div>
                              </div>
                              <div className="product-detail">
                                <div className="product-detail-info">
                                  <Typography.Text
                                    ellipsis
                                    className="title"
                                    onClick={() => navigate(`/products/${item._id}`)}
                                  >
                                    {item.name}
                                  </Typography.Text>
                                  <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                                    {item.desc}
                                  </Typography.Paragraph>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </MasonryLayout>
              </div>
              <div className={activeTabKey !== "review" ? "hidden" : "review-container"}>
                <List
                  className="comment-list"
                  loading={!myProductReviews}
                  itemLayout="horizontal"
                  dataSource={myProductReviews}
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
                              icon={downvoteValue ? <BsHandThumbsDownFill /> : <BsHandThumbsDown />}
                              onClick={() => setDownvoteValue(1)}
                            >
                              {downvoteValue}
                            </ChipTag>
                            <ChipTag
                              icon={<Avatar size={15}>{item.modelId.name[0]}</Avatar>}
                              className="colorful rounded chiptag-product"
                              color={"#d9d9d9"}
                              onClick={() => navigate(`/products/${item.modelId._id}`)}
                            >
                              <Tooltip title="Đi đến sản phẩm">
                                <Typography.Text ellipsis style={{ maxWidth: 240 }}>
                                  {item.modelId.name}
                                </Typography.Text>
                              </Tooltip>
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
              </div>
              <div className={activeTabKey !== "address_list" ? "hidden" : "address-container"}>
                <List
                  dataSource={myAddressList}
                  rowKey={(item) => item._id}
                  itemLayout="horizontal"
                  renderItem={(item) => (
                    <div className="address-item" key={item._id}>
                      <div className="container">
                        <div className="image-wrapper">
                          <Badge
                            dot
                            status={user?.defaultAddress === item._id ? "success" : "default"}
                          >
                            <Avatar size={107} shape="square" icon={<BsPinMap />} />
                          </Badge>
                        </div>
                        <div className="content-wrapper">
                          <Descriptions column={3} size="small">
                            <Descriptions.Item label="Tên người nhận" span={1}>
                              <Typography.Text ellipsis style={{ maxWidth: 168 }}>
                                {item.name}
                              </Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={1}>
                              {item.phoneNo}
                            </Descriptions.Item>
                            <Descriptions.Item label="Quốc gia" span={1}>
                              {item.country}
                            </Descriptions.Item>
                            <Descriptions.Item label="Khu vực" span={1}>
                              {item.area}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tỉnh thành" span={1}>
                              {item.city}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã zip" span={1}>
                              {item.postalCode}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ cụ thể" span={3}>
                              <Typography.Paragraph
                                ellipsis={{ rows: 1 }}
                                style={{ maxWidth: 740 }}
                              >
                                {item.address}
                              </Typography.Paragraph>
                            </Descriptions.Item>
                          </Descriptions>
                        </div>
                      </div>
                      <div className="actions">
                        <Button
                          disabled={updateAddressVisible}
                          icon={<BsPencil />}
                          shape="circle"
                          type="dashed"
                          onClick={() => {
                            setSelectedAddress(item._id);
                            setUpdateAddressVisible(true);
                          }}
                        ></Button>
                        <Popconfirm
                          title={
                            <Typography.Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ maxWidth: 280, margin: 0 }}
                            >
                              Bạn chắc chắc muốn xóa <b>{item._id}</b>?
                            </Typography.Paragraph>
                          }
                          placement="bottomRight"
                          okText={<BsCheckLg />}
                          cancelText={<BsXLg />}
                          onConfirm={() => handleDeleteAddress(item)}
                        >
                          <Button
                            disabled={updateAddressVisible}
                            shape="circle"
                            type="dashed"
                            icon={<BsTrash />}
                          ></Button>
                        </Popconfirm>
                      </div>
                    </div>
                  )}
                />
                <Divider plain style={{ margin: "24px 0" }} />
                <Button
                  type="dashed"
                  icon={<BsPlusCircle />}
                  block
                  size="large"
                  onClick={() => {
                    setSelectedAddress(null);
                    setUpdateAddressVisible(true);
                  }}
                >
                  Thêm địa chỉ
                </Button>
              </div>
              <div className={activeTabKey !== "setting" ? "hidden" : "setting-container"}>
                <Divider plain orientation="left">
                  <Tag color={"processing"}>Cập nhật thông tin</Tag>
                </Divider>
                <div className="updateinfo-form">
                  <UpdateInfoForm />
                </div>
                <Divider plain orientation="left">
                  <Tag color={"error"}>Cập nhật mật khẩu</Tag>
                </Divider>
                <div className="password-form">
                  <UpdatePasswordForm />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </ProfileWrapper>
      <UpdateAddressDrawer
        updateAddressVisible={updateAddressVisible}
        setUpdateAddressVisible={setUpdateAddressVisible}
        selectedInitAddress={selectedAddress}
      />
      {selectedProductId && (
        <ProductDrawerDetail
          productId={selectedProductId || null}
          setSelectedProduct={(value) => setSelectedProductId(value)}
        />
      )}
      <ModalCancelOrder
        setSelectedOrder={setSelectedOrderToModal}
        selectedOrder={selectedOrderToModal}
      />
    </GalleryBgLayoutWithHeader>
  );
};
const ProfileWrapper = styled.div`
  padding: 24px 96px;
  min-height: 100vh;
  & > .profile-wrapper {
    height: 100%;
  }
  & .right {
    height: 100%;
  }
  & .profile-detail {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 24px;
    & .extra-container {
      width: 100%;
      position: relative;
      & .actions {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(0px, -42px);
      }
    }
  }
  & .avatar-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    & .name-container {
      margin-top: 24px;
    }
    & .info-container {
      width: 100%;
      overflow: hidden;
      justify-self: flex-start;
      & .address-container {
        margin-top: 0;
      }
    }
  }
  & .payment-tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    gap: 4px;
    overflow: hidden;
    transform: translateY(1.8px);
  }
  & .history-container {
    & .header-filter {
      margin-bottom: 16px;
      & .localsearch {
        margin-bottom: 2px;
      }
      & .header-filter-statuses {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: nowrap;
      }
    }
    & .order-item {
      position: relative;
      background: #fff;
      padding: 24px;
      border: 1px solid ${(props) => rgba(props.theme.generatedColors[1], 0.5)};
      box-shadow: 0 2px 8px #f0f1f2;
      &:hover {
        border-color: ${(props) => props.theme.generatedColors[1]};
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
          padding: 8px 0;
          & .ant-list-item-meta {
            margin: 0;
          }
        }
      }
    }
    & .order-item:not(:last-child) {
      margin-bottom: 24px;
    }
    & .order-item-bottom {
      display: flex;
      & .container {
        margin-top: 8px;
        margin-left: auto;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        flex-direction: column;
        gap: 4px;
        & .btn-cart {
          border: 1px solid ${(props) => props.theme.generatedColors[1]};
          &:hover {
            border-color: ${(props) => props.theme.generatedColors[2]};
          }
        }
      }
    }
  }
  & .orderdetail-container {
    & .breadcrumb {
      cursor: pointer;
      &:hover {
        color: #000;
        text-decoration: underline;
      }
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
    & .timeline-container {
      width: 100%;
      margin: 0 auto;
      padding: 12px 0;
    }
  }
  & .wishlist-container {
    & .wishlist-item {
      position: relative;
      max-width: 312px;
      height: 100%;
      & .container {
        display: flex;
        flex-direction: column;
      }
      & .avatar-wrapper {
        position: relative;
        width: 100%;
        height: 240px;
        & .ant-avatar-group {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          & > .ant-avatar-image {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }
          & > span.ant-avatar.ant-avatar-circle {
            position: absolute;
            bottom: 68px;
            right: 16px;
          }
        }

        & .actions-cart {
          position: absolute;
          bottom: 16px;
          right: 16px;
        }
        & .actions-wishlist {
          position: absolute;
          top: 16px;
          right: 16px;
        }
        & .btn-cart {
          border-radius: 1000px;
          border: 1px solid ${(props) => props.theme.generatedColors[0]};
          &:hover {
            border-color: ${(props) => props.theme.generatedColors[2]};
          }
        }
        & .btn-wishlist {
          width: 100%;
          height: 100%;
          background-color: transparent;
          color: #17024f;
          background: ${rgba("#f0f0f0", 0.25)};
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          flex-wrap: nowrap;
          border: none;
          outline: none;
          cursor: pointer;
          border-radius: 1000px;
          border: 1px solid transparent;
          padding: 4px 8px;
          &.loading {
            pointer-events: none;
            cursor: wait;
            color: #d9d9d9 !important;
            border: none !important;
            outline: none !important;
            background: transparent !important;
          }
          &.active {
            color: #ff0054;
            background: #ffccc7;
          }
          &:hover {
            color: #ff0054;
            background: #ffccc7;
            border: 1px solid #ff0054;
          }
        }
      }
      & .product-detail {
        &-info {
          max-width: 100%;
          display: flex;
          flex-direction: column;
          & .title {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
              color: ${(props) => props.theme.primaryColor} !important;
            }
          }
        }
      }

      & .extra-content {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(8px);
        padding: 8px 12px 12px;
        border-radius: 0 0 6px 0;
        & .progress-item {
          width: 96px;
          flex-shrink: 0;
        }
      }
    }
  }
  & .review-container .comment {
    &-list {
      position: relative;
      & .ant-comment-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      & .chiptag-product {
        cursor: pointer !important;
        &:hover {
          & .content .ant-typography {
            text-decoration: underline !important;
            color: ${(props) => props.theme.primaryColor} !important;
          }
        }
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
  & .address-container {
    & .address-item {
      position: relative;
      background: #fff;
      border: 1px solid #eee;
      box-shadow: 0 2px 8px #f0f1f2;
    }
    & .address-item:not(:last-child) {
      margin-bottom: 24px;
    }
    & .container {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      gap: 12px;
      padding: 12px 12px;
    }
    & .actions {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(16px, -50%);
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
    }
  }
`;

export default ProfilePage;
