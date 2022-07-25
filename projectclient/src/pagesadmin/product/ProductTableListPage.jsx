import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Image,
  List,
  Popconfirm,
  Rate,
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
  BsCheckLg,
  BsEye,
  BsHeart,
  BsLayoutWtf,
  BsStar,
  BsThreeDots,
  BsXLg,
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
import styled from "styled-components";

const findImageById = (id, images) => {
  return images.find((item) => item._id === id);
};

const getTotalInventoryQuantity = (variants = []) =>
  variants.reduce((currentValue, nextValue) => {
    return currentValue + (nextValue?.quantity || 0);
  }, 0);
const getTotalInventorySold = (variants = []) =>
  variants.reduce((currentValue, nextValue) => {
    return currentValue + (nextValue?.sold || 0);
  }, 0);

const ProductTableListPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsFilterValue, setProductsFilterValue] = useState({ keyword: "", sort: "" });
  const { data: productsFilteredQuery, isSuccess: getProductsSuccess } =
    useGetAllProductsFilteredQuery(productsFilterValue);
  const handleLocalSearch = (values) => {
    setProductsFilterValue({ ...productsFilterValue, keyword: values.keySearch });
  };

  useEffect(() => {
    if (productsFilteredQuery?.data) {
      setSelectedProduct(productsFilteredQuery?.data[0]);
    }
  }, [productsFilteredQuery?.data]);

  const handleRemove = (productId) => {
    console.log("handleRemove ~ productId", productId);
  };
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => (
        <Space>
          <Avatar.Group maxCount={1}>
            {record.images.map((item) => (
              <Avatar size={48} src={item.url} fallback={NOT_FOUND_IMG} key={`table_${item._id}`} />
            ))}
          </Avatar.Group>
          <Space size={2} direction="vertical">
            <Typography.Text ellipsis>{text}</Typography.Text>
            <Typography.Text type="secondary" ellipsis>
              {record.desc}
            </Typography.Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => sorterByWords("name")(a, b),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      width: 160,
      ellipsis: true,
      render: (text, record) => <Typography.Text ellipsis>{text}</Typography.Text>,
      sorter: (a, b) => sorterByWords("brand")(a, b),
    },
    {
      title: "Bộ sưu tập",
      dataIndex: "combos",
      key: "combos",
      width: 160,
      render: (text, record) => (
        <Avatar.Group maxCount={2}>
          {text.map((c) => (
            <Link to={`/admin/combos/${c._id}`} key={`ProductCombos_${c._id}`}>
              <Avatar
                size={48}
                shape={"circle"}
                src={c.image.url}
                icon={<BsLayoutWtf />}
                title="Đi đến Bộ sưu tập"
              ></Avatar>
            </Link>
          ))}
        </Avatar.Group>
      ),
      sorter: (a, b) => a.combos.length - b.combos.length,
    },
    {
      title: "Giá hiển thị",
      dataIndex: "price",
      key: "price",
      width: 160,
      render: (text, record) => (
        <Statistic suffix="$" valueStyle={{ fontSize: 16 }} value={text}></Statistic>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Kho hàng",
      dataIndex: "variants",
      key: "variants",
      width: 125,
      render: (text, record) => {
        const totalQuantity = getTotalInventoryQuantity(text);
        const totalSold = getTotalInventorySold(text);
        return (
          <Tooltip
            color={"#fafafa"}
            overlayStyle={{ maxWidth: 120 }}
            title={
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Đã bán" span={2}>
                  {totalSold}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng kho" span={2}>
                  {totalQuantity}
                </Descriptions.Item>
                <Descriptions.Item label="Phiên bản" span={2}>
                  {text.length}
                </Descriptions.Item>
              </Descriptions>
            }
          >
            <Statistic
              suffix={`/${totalQuantity}/${text.length}`}
              valueStyle={{ fontSize: 16 }}
              value={totalSold}
            ></Statistic>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.variants.length - b.variants.length,
    },
    {
      title: <BsThreeDots size={24} />,
      dataIndex: "_id",
      key: "actions",
      width: 125,
      align: "center",
      render: (text, record) => (
        <Link to={`/admin/products/${text}`}>
          <Button type="link" icon={<BsBoxArrowUpRight />} style={{padding: 0}}>
            Xem chi tiết
          </Button>
        </Link>
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
              title="Danh sách sản phẩm"
              loading={!getProductsSuccess}
              extra={
                <Space>
                  <Link to={`/admin/products/create`}>
                    <Button
                      type="link"
                      extraType="btntag"
                      loading={!getProductsSuccess}
                      icon={<BsBoxArrowUpRight />}
                    >
                      Thêm sản phẩm
                    </Button>
                  </Link>
                </Space>
              }
            >
              {getProductsSuccess && (
                <Table
                  className="table-fixed-pagination"
                  rowKey={(record) => record._id}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        event.preventDefault();
                        setSelectedProduct(record);
                      }, // click row
                    };
                  }}
                  rowSelection={{
                    type: "radio",
                    selectedRowKeys: [selectedProduct?._id],
                    defaultSelectedRowKeys: [productsFilteredQuery.data[0]?._id],
                    onChange: (selectedRowKeys, selectedRows) => {
                      setSelectedProduct(selectedRows[0]);
                      console.log(
                        `selectedRowKeys: ${selectedRowKeys}`,
                        "selectedRows: ",
                        selectedRows
                      );
                    },
                  }}
                  columns={columns}
                  footer={() => ""}
                  dataSource={productsFilteredQuery.data}
                  size="default"
                  pagination={{
                    total: productsFilteredQuery.data.length,
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
          <Col flex="400px">
            <Card
              title="Thông tin"
              loading={selectedProduct == null}
              extra={
                <Space>
                  <Link to={`/admin/products/${selectedProduct?._id}`}>
                    <Button
                      type="link"
                      extraType="btntag"
                      loading={!getProductsSuccess}
                      disabled={selectedProduct == null}
                      icon={<BsBoxArrowUpRight />}
                    >
                      Chỉnh sửa
                    </Button>
                  </Link>
                  {/* <Popconfirm
                    title={
                      <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ maxWidth: 280, margin: 0 }}
                      >
                        Bạn chắc chắc muôn xóa <b>{selectedProduct?.name}</b> ?
                      </Typography.Paragraph>
                    }
                    placement="bottomRight"
                    okText={<BsCheckLg />}
                    cancelText={<BsXLg />}
                    onConfirm={() => handleRemove(selectedProduct)}
                  >
                    <Button
                      disabled={selectedProduct == null}
                      type="text"
                      extraType="btndanger"
                      className="btndanger"
                      loading={!getProductsSuccess}
                    >
                      Xóa
                    </Button>
                  </Popconfirm> */}
                </Space>
              }
            >
              {selectedProduct && (
                <>
                  <div className="card-reactions">
                    <div className="reaction">
                      <span>
                        <BsEye size={14} />
                      </span>
                      <h4>{selectedProduct.numOfViews}</h4>
                    </div>
                    <div className="reaction">
                      <span>
                        <BsChatLeftText size={14} />
                      </span>
                      <h4>{selectedProduct.numOfReviews}</h4>
                    </div>
                    <div className="reaction">
                      <span>
                        <BsStar size={14} />
                      </span>
                      <h4>{selectedProduct.avgRating}</h4>
                    </div>
                    <div className="reaction">
                      <span>
                        <BsHeart size={14} />
                      </span>
                      <h4>{selectedProduct.wishlist.length}</h4>
                    </div>
                  </div>
                  <Typography.Title
                    ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
                    level={4}
                  >
                    {selectedProduct.name}
                  </Typography.Title>
                  <Typography.Paragraph
                    type="secondary"
                    ellipsis={{ rows: 2, expandable: true, symbol: "Xem thêm" }}
                  >
                    {selectedProduct.desc}
                  </Typography.Paragraph>
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="Thương hiệu" span={2}>
                      {selectedProduct.brand}
                    </Descriptions.Item>
                    <Descriptions.Item label="Danh mục" span={2}>
                      <Typography.Text ellipsis style={{ maxWidth: 240 }}>
                        {selectedProduct.category?.name || "Không có"}
                      </Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá hiển thị" span={2}>
                      <Statistic
                        suffix="$"
                        valueStyle={{ fontSize: 14 }}
                        value={selectedProduct.price}
                      ></Statistic>
                    </Descriptions.Item>
                  </Descriptions>
                  <div className="product-combos">
                    <Divider orientation="left" plain>
                      Bộ sưu tập · {selectedProduct.combos.length}
                    </Divider>
                    {selectedProduct.combos.length > 0 ? (
                      <Avatar.Group>
                        {selectedProduct.combos.map((c) => (
                          <Link to={`/admin/combos/${c._id}`} key={`ProductCombos_${c._id}`}>
                            <Avatar
                              size={48}
                              shape={"square"}
                              src={c.image.url}
                              icon={<BsLayoutWtf />}
                              title="Đi đến Bộ sưu tập"
                            ></Avatar>
                          </Link>
                        ))}
                      </Avatar.Group>
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="bordered" />
                    )}
                  </div>
                  <div className="product-variants">
                    <Divider orientation="left" plain>
                      Phiên bản · {selectedProduct.variants.length}
                    </Divider>
                    <List
                      className="empty-bordered"
                      itemLayout="horizontal"
                      dataSource={selectedProduct.variants}
                      rowKey={(item) => `variant_${item._id}`}
                      renderItem={(item) => (
                        <List.Item>
                          <Space wrap={false} align="start">
                            <Avatar
                              size={48}
                              shape="square"
                              src={
                                selectedProduct.images.find((img) => img._id === item.image)?.url
                              }
                            />

                            <Descriptions column={2} size="small">
                              <Descriptions.Item label="Giá" span={2}>
                                <Statistic
                                  suffix="$"
                                  valueStyle={{ fontSize: 14 }}
                                  value={item.price}
                                ></Statistic>
                              </Descriptions.Item>
                              {item.options.map((o, index) => (
                                <Descriptions.Item
                                  label={o.name}
                                  span={2}
                                  key={`variant_options_${item._id}_${index}`}
                                >
                                  <Tag
                                    color={checkValidColor(o.value) ? o.value : "default"}
                                    className={"tag"}
                                  >
                                    {o.value}
                                  </Tag>
                                </Descriptions.Item>
                              ))}
                            </Descriptions>
                            <Tooltip
                              color={"#fafafa"}
                              overlayStyle={{ maxWidth: 120 }}
                              title={
                                <Descriptions column={2} size="small">
                                  <Descriptions.Item label="Đã bán" span={2}>
                                    {item.sold}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Số lượng" span={2}>
                                    {item.quantity}
                                  </Descriptions.Item>
                                </Descriptions>
                              }
                            >
                              <Space direction="vertical">
                                <Space size={2} split="·">
                                  <BsCartCheck size={16.5} />
                                  {item.sold}
                                </Space>
                                <Space size={2} split="·">
                                  <BsBoxSeam />
                                  {item.quantity}
                                </Space>
                              </Space>
                            </Tooltip>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </div>
                  <div className="product-images">
                    <Divider orientation="left" plain>
                      Hình ảnh · {selectedProduct.images.length}
                    </Divider>
                    <Image.PreviewGroup>
                      <MasonryLayout columns={2} gap={8}>
                        {selectedProduct.images.map((item) => (
                          <Image width={158} src={item.url} key={`right_${item._id}`} />
                        ))}
                      </MasonryLayout>
                    </Image.PreviewGroup>
                  </div>
                </>
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

export default ProductTableListPage;
