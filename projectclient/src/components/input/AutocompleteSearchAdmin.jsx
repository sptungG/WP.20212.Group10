import {
  Avatar,
  Badge,
  Col,
  Dropdown,
  Empty,
  Input,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import uniqBy from "lodash/uniqBy";
import { useEffect, useRef, useState } from "react";
import {
  BsArrowUpRight,
  BsBoxSeam,
  BsChatLeftText,
  BsEye,
  BsHeart,
  BsSearch,
  BsStar,
  BsXLg,
  BsArrowClockwise,
} from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { useDebounce } from "src/common/useDebounce";
import { useOnClickOutside } from "src/common/useOnClickOutside";
import { useGetAllCategoriesFilteredQuery } from "src/stores/category/category.query";
import {
  useGetAllCombosFilteredQuery,
  useGetCombosFilteredQuery,
} from "src/stores/combo/combo.query";
import {
  useGetAllProductsFilteredQuery,
  useGetProductsFilteredQuery,
} from "src/stores/product/product.query";
import styled from "styled-components";
import Button from "../button/Button";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { setVisibleType } from "src/stores/header/header.reducer";
import { getBadgeColorByStatus } from "src/common/utils";
import { NOT_FOUND_IMG } from "src/common/constant";

const AutocompleteSearchAdmin = ({ width = 480, inputRounded = 1000 }) => {
  const mediaAbove1280 = useMediaQuery({ minWidth: 1280 });
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [text, setText] = useState("");
  const [placeholder, setPlaceholder] = useState("Tìm kiếm sản phẩm, danh mục, bộ sưu tập");
  const [activeKey, setActiveKey] = useState("product");
  const headerState = useSelector((state) => state.headerState);

  const [productsFilterValue, setProductsFilterValue] = useState({ keyword: "", sort: "" });
  const [combosFilterValue, setCombosFilterValue] = useState({ keyword: "", sort: "", status: "" });
  const [categoriesFilterValue, setCategoriesFilterValue] = useState({ sort: "", keyword: "" });

  const { data: productsFilteredQuery, isSuccess: getProductsSuccess } =
    useGetAllProductsFilteredQuery(productsFilterValue, {
      skip: headerState.visibletype !== "searchvisible",
    });
  const { data: combosFilteredQuery, isSuccess: getCombosSuccess } = useGetAllCombosFilteredQuery(
    combosFilterValue,
    { skip: headerState.visibletype !== "searchvisible" }
  );
  const { data: categoriesFilteredQuery, isSuccess: getCategoriesSuccess } =
    useGetAllCategoriesFilteredQuery(categoriesFilterValue, {
      skip: headerState.visibletype !== "searchvisible",
    });

  useEffect(() => {
    if (headerState.visibletype === "searchvisible") {
      switch (activeKey) {
        case "product": {
          setText(productsFilterValue.keyword);
          setPlaceholder("Tìm kiếm sản phẩm");
          break;
        }
        case "combo": {
          setText(combosFilterValue.keyword);
          setPlaceholder("Tìm kiếm bộ sưu tập");
          break;
        }
        case "category": {
          setText(categoriesFilterValue.keyword);
          setPlaceholder("Tìm kiếm danh mục");
          break;
        }
        default: {
          break;
        }
      }
    } else {
      setActiveKey("product");
      setPlaceholder("Tìm kiếm sản phẩm, danh mục, bộ sưu tập");
    }
  }, [
    headerState.visibletype === "searchvisible",
    activeKey,
    categoriesFilterValue.keyword,
    combosFilterValue.keyword,
    productsFilterValue.keyword,
  ]);

  const onChangeInput = (e) => {
    setText(e.target.value);
    setTimeout(() => {
      if (activeKey === "product")
        setProductsFilterValue({ ...productsFilterValue, page: 1, keyword: e.target.value });
      if (activeKey === "combo")
        setCombosFilterValue({ ...combosFilterValue, page: 1, keyword: e.target.value });
      if (activeKey === "category")
        setCategoriesFilterValue({ ...categoriesFilterValue, keyword: e.target.value });
    }, 300);
  };

  const onPressEnter = (e) => {
    setText(e.target.value);
    if (activeKey === "product")
      setProductsFilterValue({ ...productsFilterValue, page: 1, keyword: e.target.value });
    if (activeKey === "combo")
      setCombosFilterValue({ ...combosFilterValue, page: 1, keyword: e.target.value });
    if (activeKey === "category")
      setCategoriesFilterValue({ ...categoriesFilterValue, keyword: e.target.value });
  };

  const onClose = () => {
    dispatch(setVisibleType(""));
  };

  const onVisible = () => {
    dispatch(setVisibleType("searchvisible"));
  };

  return (
    <SearchWrapper
      visible={headerState.visibletype === "searchvisible"}
      inputRounded={inputRounded}
    >
      <Dropdown
        visible={headerState.visibletype === "searchvisible"}
        overlay={
          <DropdownWrapper width={width}>
            <Tabs
              defaultActiveKey="product"
              activeKey={activeKey}
              onChange={(key) => {
                setActiveKey(key);
                if (mediaAbove1280)
                  inputRef.current.focus({
                    cursor: "end",
                  });
              }}
              tabBarExtraContent={
                <Space size={4} wrap={false}>
                  <Button
                    icon={<BsXLg size={15} />}
                    shape={"circle"}
                    type="dashed"
                    onClick={onClose}
                  ></Button>
                </Space>
              }
            >
              <Tabs.TabPane tab="Sản phẩm" key="product"></Tabs.TabPane>
              <Tabs.TabPane tab="Danh mục" key="category"></Tabs.TabPane>
              <Tabs.TabPane tab="Bộ sưu tập" key="combo"></Tabs.TabPane>
            </Tabs>
            <div className={activeKey !== "product" ? "hidden" : ""}>
              {productsFilterValue.keyword && (
                <div className="dropdown-searchresult">
                  Có <b>{productsFilteredQuery?.data?.length || 0}</b> kết quả phù hợp với "
                  {productsFilterValue.keyword}"
                </div>
              )}
              {getProductsSuccess && (
                <div id="scrollableDivCategories">
                  {productsFilteredQuery?.data.length > 0 ? (
                    productsFilteredQuery?.data.map((p) => (
                      <Row gutter={16} key={p._id} className="dropdown-item" wrap={false}>
                        <Col flex="none" className="image">
                          {p.images.length > 0 ? (
                            <Avatar size="large" src={p.images[0]?.url || NOT_FOUND_IMG}>
                              {p.name[0]}
                            </Avatar>
                          ) : (
                            <Avatar size="large" src={NOT_FOUND_IMG}>
                              404
                            </Avatar>
                          )}
                        </Col>
                        <Col flex="auto" className="content">
                          <Typography.Title level={5} ellipsis className="title">
                            {p.name}
                          </Typography.Title>
                          <Typography.Paragraph type="secondary" ellipsis className="paragraph">
                            {p.brand}
                          </Typography.Paragraph>
                        </Col>
                        <Col flex="none" className="action">
                          <Button type="link" onClick={onClose}>
                            <Link to={`/admin/products/${p._id}`}>
                              <BsArrowUpRight />
                            </Link>
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
              )}
            </div>
            <div className={activeKey !== "category" ? "hidden" : ""}>
              {categoriesFilterValue.keyword && (
                <div className="dropdown-searchresult">
                  Có <b>{categoriesFilteredQuery?.data?.length || 0}</b> kết quả phù hợp với "
                  {categoriesFilterValue.keyword}"
                </div>
              )}
              {getCategoriesSuccess && (
                <div id="scrollableDivCategories">
                  {categoriesFilteredQuery?.data.length > 0 ? (
                    categoriesFilteredQuery?.data.map((c) => (
                      <Row key={c._id} className="dropdown-item" wrap={false} gutter={16}>
                        <Col flex="none" className="image">
                          <Avatar size="large" src={c.image}>
                            {c.name[0]}
                          </Avatar>
                        </Col>
                        <Col flex="auto" className="content">
                          <Typography.Title level={5} ellipsis className="title">
                            {c.name}
                          </Typography.Title>
                          <Space className="reaction-container">
                            <span>Sản phẩm: </span>
                            <Tag className="reaction-tag" color="default" icon={<BsBoxSeam />}>
                              {c.products_count}
                            </Tag>
                          </Space>
                        </Col>
                        <Col flex="none" className="action">
                          <Button type="link" onClick={onClose}>
                            <Link to={`/admin/categories/${c._id}`}>
                              <BsArrowUpRight />
                            </Link>
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
              )}
            </div>
            <div className={activeKey !== "combo" ? "hidden" : ""}>
              {combosFilterValue.keyword && (
                <div className="dropdown-searchresult">
                  Có <b>{combosFilteredQuery?.data?.length || 0}</b> kết quả phù hợp với "
                  {combosFilterValue.keyword}"
                </div>
              )}
              {getCombosSuccess && (
                <div id="scrollableDivCategories">
                  {combosFilteredQuery?.data.length > 0 ? (
                    combosFilteredQuery?.data.map((c) => (
                      <Row wrap={false} key={c._id} className="dropdown-item" gutter={16}>
                        <Col flex="none" className="image">
                          <Badge dot color={getBadgeColorByStatus(c.status)}>
                            <Avatar size="large" src={c.image.url} title={c.status}>
                              {c.name[0]}
                            </Avatar>
                          </Badge>
                        </Col>
                        <Col flex="auto" className="content">
                          <Typography.Title level={5} ellipsis className="title">
                            {c.name}
                          </Typography.Title>

                          <Typography.Paragraph type="secondary" ellipsis className="paragraph">
                            {c.desc}
                          </Typography.Paragraph>

                          <Space className="reaction-container" size={6}>
                            <Tag
                              className="reaction-tag"
                              color="default"
                              icon={<BsEye size={14} />}
                            >
                              {c.numOfViews}
                            </Tag>
                            <Tag
                              className="reaction-tag"
                              color="default"
                              icon={<BsChatLeftText size={14} />}
                            >
                              {c.numOfReviews}
                            </Tag>
                            <Tag
                              className="reaction-tag"
                              color="default"
                              icon={<BsStar size={14} />}
                            >
                              {c.avgRating}
                            </Tag>
                            <Tag className="reaction-tag" color="default" icon={<BsHeart />}>
                              {c.wishlist.length}
                            </Tag>
                            <Tag className="reaction-tag" color="default" icon={<BsBoxSeam />}>
                              {c.products.length}
                            </Tag>
                          </Space>
                        </Col>
                        <Col flex="none" className="action">
                          <Button type="link" onClick={onClose}>
                            <Link to={`/admin/combos/${c._id}`}>
                              <BsArrowUpRight />
                            </Link>
                          </Button>
                        </Col>
                      </Row>
                    ))
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
              )}
            </div>
          </DropdownWrapper>
        }
      >
        <Input
          // bordered={false}
          ref={inputRef}
          value={text}
          placeholder={placeholder}
          allowClear
          prefix={<BsSearch size={16} />}
          onChange={onChangeInput}
          onPressEnter={onPressEnter}
          onClick={onVisible}
          onFocus={onVisible}
          size="middle"
        />
      </Dropdown>
    </SearchWrapper>
  );
};

const SearchWrapper = styled.div`
  border-radius: ${(props) => (props.visible ? "10px 10px 0 0" : "")};
  overflow: ${(props) => (props.visible ? "hidden" : "")};
  .ant-input-clear-icon {
    font-size: 16px;
  }
  .ant-select-auto-complete {
    width: 100%;
  }
  .ant-input-affix-wrapper {
    padding-right: 10px;
    border-radius: ${(props) => props.inputRounded + "px"};
  }
  .ant-input-affix-wrapper.ant-dropdown-open {
    border-radius: 10px 10px 0 0;
  }
  input {
    margin-left: 10px;
    width: 100%;
  }
`;
const DropdownWrapper = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 2px 8px #f0f1f2;
  border-radius: 0 0 10px 10px;
  max-width: calc(${(props) => props.width + "px"});
  width: 100%;
  .ant-tabs {
    max-width: 100%;
  }
  .dropdown-item-loading {
    padding: 8px;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 16px;
    & .ant-skeleton-title {
      margin-top: 10px;
    }
    & .ant-skeleton-paragraph {
      margin-top: 10px !important;
    }
    & .ant-skeleton-header {
      vertical-align: middle;
    }
  }
  .dropdown-item {
    padding: 8px;
    width: 100%;
    margin: 0 !important;
    & .title {
      margin-bottom: 2px;
    }
    & .paragraph {
      margin-bottom: 0;
    }
    & .reaction-container {
      margin-top: 6px;
    }
    & .reaction-tag {
      padding: 2px 10px;
      border: 0;
      border-radius: 1000px;
      display: flex;
      align-items: center;
      gap: 4px;
      & span {
        font-size: 14px;
      }
    }
  }
  .dropdown-item:hover {
    background-color: ${(props) => props.theme.generatedColors[0]};
  }
  .dropdown-item:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  .dropdown-item:last-child {
    border-radius: 0 0 10px 10px;
  }
  .dropdown-searchresult {
    padding: 4px 8px;
    color: #adb5bd;
  }
  #scrollableDivProducts,
  #scrollableDivCombos,
  #scrollableDivCategories {
    max-width: 100%;
    max-height: 320px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #999;
      border-radius: 10px;
    }
  }
  .ant-tabs-nav {
    margin-bottom: 2px;
    padding: 0 8px;
  }
`;

export default AutocompleteSearchAdmin;
