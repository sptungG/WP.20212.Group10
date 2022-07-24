import {
  Affix,
  Checkbox,
  Col,
  Empty,
  Form,
  Menu,
  Pagination,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Typography,
} from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import { BsArrowRepeat, BsCollection, BsCurrencyDollar, BsStar } from "react-icons/bs";
import { RiFilterFill, RiFilterOffLine } from "react-icons/ri";
import { useAuth } from "src/common/useAuth";
import { useDebounce } from "src/common/useDebounce";
import { isWishlisted } from "src/common/useToggleWishlist";
import Button from "src/components/button/Button";
import ProductCard, { ProductCardLoading } from "src/components/card/ProductCard";
import ProductDrawerDetail from "src/components/card/ProductDrawerDetail";
import LocalSearch from "src/components/input/LocalSearch";
import MainLayout from "src/layout/MainLayout";
import { useGetAllCategoriesFilteredQuery } from "src/stores/category/category.query";
import { useGetProductsFilteredQuery } from "src/stores/product/product.query";
import styled from "styled-components";

const initialFilterValue = { keyword: "", page: 1, limit: 16 };

const StorePage = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [affixed, setAffixed] = useState(false);
  const [currentSubMenu, setCurrentSubMenu] = useState("1");
  const [productsFilterValue, setProductsFilterValue] = useState(initialFilterValue);
  const debouncedProductsFilterValue = useDebounce(productsFilterValue, 500);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const {
    data: productsFilteredQuery,
    isFetching: productsFilteredFetching,
    isSuccess: productsFilteredSuccess,
  } = useGetProductsFilteredQuery(debouncedProductsFilterValue);
  const { data: categoriesFilteredQuery, isSuccess: categoriesFilteredSuccess } =
    useGetAllCategoriesFilteredQuery({});
  const categoriesData = categoriesFilteredSuccess ? categoriesFilteredQuery?.data : [];

  const handleFilterChange = (changedValue, values) => {
    let filter = {};
    const { price, category, rating } = values;
    if (price) {
      filter.price = price.join(",");
    }
    if (category) {
      filter.category = category.join(",");
    }
    if (rating) filter.rating = rating;
    setProductsFilterValue({ ...productsFilterValue, ...filter });
  };

  const handleResetFilter = () => {
    form.resetFields();
    setProductsFilterValue(initialFilterValue);
  };

  const handleLocalSearch = ({ keySearch }) => {
    setProductsFilterValue({ ...productsFilterValue, keyword: keySearch });
  };
  const handleSelectSort = (value) => {
    setProductsFilterValue({ ...productsFilterValue, sort: value });
  };

  return (
    <MainLayout hideSearch={true}>
      <StoreWrapper>
        <Row gutter={[24, 24]} wrap={false}>
          <Col flex="280px" className="left">
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFilterChange}
              size="large"
              id="formFilter"
            >
              <Affix offsetTop={affixed && 0.000001} onChange={(affixed) => setAffixed(affixed)}>
                <div className="menu-container">
                  <Menu
                    theme={"light"}
                    onClick={(e) => setCurrentSubMenu(e.key)}
                    style={{ width: "100%" }}
                    defaultOpenKeys={["1", "2", "3", "4", "5"]}
                    selectedKeys={[currentSubMenu]}
                    mode="inline"
                    items={[
                      getMenuItem(
                        <BsCurrencyDollar />,
                        "1",
                        <Typography.Text>Khoảng giá</Typography.Text>,
                        [
                          getMenuItem(
                            null,
                            "sub11",
                            <Form.Item name="price" noStyle>
                              <Slider step={10} tipFormatter={(v) => `$${v}`} range max="1999" />
                            </Form.Item>
                          ),
                        ]
                      ),
                      getMenuItem(
                        <BsStar />,
                        "2",
                        <Space split="·" wrap={false}>
                          <Typography.Text>Đánh giá</Typography.Text>
                          {productsFilterValue.rating && (
                            <span>
                              {productsFilterValue.rating < 5
                                ? `${productsFilterValue.rating} ~ ${
                                    productsFilterValue.rating + 1
                                  }`
                                : 5}
                            </span>
                          )}
                        </Space>,
                        [
                          getMenuItem(
                            null,
                            "sub21",
                            <Form.Item name="rating" noStyle>
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
                          ),
                        ]
                      ),
                      getMenuItem(
                        <BsCollection />,
                        "3",
                        <Typography.Text>Danh mục · {categoriesData.length}</Typography.Text>,
                        [
                          getMenuItem(
                            null,
                            "sub31",
                            <Form.Item name="category" noStyle>
                              <Checkbox.Group>
                                <Space direction="vertical" size={8}>
                                  {categoriesData?.map((item, index) => (
                                    <Checkbox value={item._id} key={`radio_star_${item._id}`}>
                                      {item.name} · {item.products_count}
                                    </Checkbox>
                                  )) || null}
                                </Space>
                              </Checkbox.Group>
                            </Form.Item>
                          ),
                        ]
                      ),
                    ]}
                  />
                </div>
              </Affix>
            </Form>
          </Col>
          <Col flex="auto" className="right">
            <Row className="header-filter-container" wrap={false} gutter={24}>
              <Col flex="auto">
                <LocalSearch
                  placeholder="Tìm kiếm sản phẩm theo Tên, mô tả ..."
                  onFinish={handleLocalSearch}
                  onValuesChange={(changedValue, values) => handleLocalSearch(values)}
                />
              </Col>
              <Col flex="256px">
                <Select
                  onSelect={handleSelectSort}
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Sắp xếp sản phẩm theo..."
                  defaultValue={""}
                >
                  <Select.Option value="">--Chọn sắp xếp--</Select.Option>
                  <Select.Option value="price_desc">Giá giảm dần</Select.Option>
                  <Select.Option value="price_asc">Giá tăng dần</Select.Option>
                  <Select.Option value="avgRating_desc">Đánh giá tốt</Select.Option>
                  <Select.Option value="numOfViews_desc">Lượt xem cao</Select.Option>
                  <Select.Option value="name_asc">{`Tên A->Z`}</Select.Option>
                  <Select.Option value="name_desc">{`Tên Z->A`}</Select.Option>
                  <Select.Option value="createdAt_desc">Ngày tạo mới nhất</Select.Option>
                  <Select.Option value="createdAt_asc">Ngày tạo cũ nhất</Select.Option>
                </Select>
              </Col>
            </Row>
            {!productsFilteredFetching && productsFilteredSuccess ? (
              productsFilteredQuery?.data.length > 0 ? (
                <div className="products-container">
                  {productsFilteredQuery?.data.map((p) => (
                    <ProductCard
                      width={300}
                      key={`ProductCard_${p._id}`}
                      product={p}
                      getSelectedProductId={(p) => setSelectedProductId(p)}
                      isWishlisted={isWishlisted(p.wishlist, user?._id)}
                      className="no-animate"
                    ></ProductCard>
                  ))}
                </div>
              ) : (
                <div className="products-empty">
                  <Empty className="bordered" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              )
            ) : (
              <div className="products-container">
                {Array(productsFilterValue.limit)
                  .fill(null)
                  .map((i, index) => (
                    <ProductCardLoading key={`ProductCardLoading_${index}`} width={300} />
                  ))}
              </div>
            )}
            <div className={classNames("bottom-pagination fixed")}>
              <div className="actions-button">
                <Button
                  htmlType="button"
                  block
                  icon={<RiFilterOffLine />}
                  onClick={handleResetFilter}
                >
                  Xóa bộ lọc
                </Button>
                {/* <Button form="formFilter" htmlType="submit" type="primary" icon={<RiFilterFill />}>
                  Lọc sản phẩm
                </Button> */}
              </div>
              <div className="pagination-container">
                <Pagination
                  showSizeChanger
                  defaultCurrent={1}
                  defaultPageSize={16}
                  pageSizeOptions={["8", "16", "24"]}
                  total={productsFilteredQuery?.pagination.total || 0}
                  pageSize={productsFilterValue.limit}
                  current={productsFilterValue.page}
                  showTotal={(total) => (
                    <p style={{ marginRight: 16 }}>
                      Tổng <b>{total}</b>
                    </p>
                  )}
                  onChange={(page, pageSize) =>
                    setProductsFilterValue({ ...productsFilterValue, page, limit: pageSize })
                  }
                />
              </div>
            </div>
          </Col>
        </Row>
      </StoreWrapper>
      {productsFilteredSuccess && (
        <ProductDrawerDetail
          productId={selectedProductId || null}
          setSelectedProduct={(value) => setSelectedProductId(value)}
        />
      )}
    </MainLayout>
  );
};

const getMenuItem = (icon, key, label, children, type) => {
  return {
    icon,
    key,
    label,
    children,
    type,
  };
};

const StoreWrapper = styled.div`
  padding-right: 24px;
  & .ant-menu-submenu-inline .ant-menu-inline .ant-menu-item {
    height: auto !important;
    padding: 4px 0px;
    padding-left: 44px !important;
    & > .ant-menu-title-content {
      padding-left: 4px;
    }
  }
  & .menu-container {
    height: 100vh;
    max-height: 100vh;
    overflow-y: scroll;
    padding-bottom: 64px;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    }
  }
  & .products-container {
    width: 100%;
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 300px);
    justify-content: center;
    align-items: start;
    grid-gap: 24px;
    padding-bottom: 72px;
    @media screen and (max-width: 1023.98px) {
      grid-gap: 24px 0;
    }
  }
  & .products-empty {
    height: 50%;
    & .ant-empty {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }
  & .bottom-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 24px;
    background-color: #fff;
    & .actions-button {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      column-gap: 8px;
    }
    &.fixed {
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      z-index: 20;
      box-shadow: 0px -1px 4px 0px rgba(153, 153, 153, 0.5);
    }
  }
`;

export default StorePage;
