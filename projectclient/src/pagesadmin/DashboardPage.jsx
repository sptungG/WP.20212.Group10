import { TinyArea } from "@ant-design/plots";
import {
  Avatar,
  Badge,
  Card,
  Col,
  Divider,
  List,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import moment from "moment";
import VirtualList from "rc-virtual-list";
import { useEffect, useRef, useState } from "react";
import {
  BsArrowDownRight,
  BsArrowRight,
  BsArrowUpRight,
  BsBoxArrowUpRight,
  BsPeople,
  BsSliders,
} from "react-icons/bs";
import { FcAreaChart, FcDoughnutChart, FcLineChart, FcList } from "react-icons/fc";
import { Link } from "react-router-dom";
import { CONSTANT } from "src/common/constant";
import { getBadgeColorByStatus, getNameByValue } from "src/common/utils";
import Button from "src/components/button/Button";
import AreaChart from "src/components/chart/AreaChart";
import DonutPieChart from "src/components/chart/DonutPieChart";
import MultiLineChart from "src/components/chart/MultiLineChart";
import ChipTag from "src/components/chip/ChipTag";
import RangePicker, { dateFormat } from "src/components/picker/RangePicker";
import AdminLayout from "src/layout/AdminLayout";
import {
  useGetIncomeStatsQuery,
  useGetStatusStatsQuery,
  useGetUsersStatsQuery,
} from "src/stores/statistic/statistic.query";
import { useGetFilteredUsersQuery } from "src/stores/user/user.query";
import styled from "styled-components";

const findByDatetimeId = (datetime = "", arr = []) =>
  datetime ? arr.find((item) => item._id === datetime) : null;

export const getTotalByDatakey = (arr = [], datakey) => {
  return arr.reduce((currentValue, nextValue) => {
    return currentValue + nextValue[datakey];
  }, 0);
};

const DashboardPage = () => {
  const ref = useRef(null);
  const [rangeDateUser, setRangeDateUser] = useState([
    moment().startOf("week").format(dateFormat),
    moment().endOf("week").format(dateFormat),
  ]);
  const [rangeDateIncome, setRangeDateIncome] = useState([
    moment().startOf("week").format(dateFormat),
    moment().endOf("week").format(dateFormat),
  ]);
  const [selectedTags, setSelectedTags] = useState(["DELIVERED"]);
  const { data: usersStatQuery, isSuccess: usersStatSuccess } = useGetUsersStatsQuery({
    begin: rangeDateUser[0],
    end: rangeDateUser[1],
  });
  // const { data: variantsStatQuery, isSuccess: variantsStatSuccess } = useGetVariantsStatsQuery({
  //   begin: range[0],
  //   end: range[1],
  // });
  const { data: incomeStatQuery, isSuccess: incomeStatSuccess } = useGetIncomeStatsQuery({
    productId: null,
    orderStatus: selectedTags.length > 0 ? selectedTags.join(",") : "",
    begin: rangeDateIncome[0],
    end: rangeDateIncome[1],
  });
  const { data: orderStatusStatQuery, isSuccess: orderStatusStatSuccess } = useGetStatusStatsQuery({
    productId: null,
    begin: rangeDateIncome[0],
    end: rangeDateIncome[1],
  });
  const { data: getFilteredUsersQuery, isSuccess: getFilteredUsersSuccess } =
    useGetFilteredUsersQuery({});
  const userListData = getFilteredUsersSuccess ? getFilteredUsersQuery?.data : [];
  const orderStatusStatData = orderStatusStatSuccess ? orderStatusStatQuery?.data : [];
  const isLoading =
    !usersStatSuccess || !incomeStatSuccess || !orderStatusStatSuccess || !getFilteredUsersSuccess;
  const [userStatInRange, setUserStatInRange] = useState([]);
  const [incomeStatInRange, setIncomeStatInRange] = useState([]);
  const [containerHeight, setContainerHeight] = useState(400);
  useEffect(() => {
    if (!isLoading) {
      setContainerHeight(ref.current.getBoundingClientRect().height);
    }
  }, [isLoading]);

  useEffect(() => {
    if (usersStatSuccess) {
      const initialStatArr = getDateArrInRange(usersStatQuery.range[0], usersStatQuery.range[1]);
      let newUserStatInRange = initialStatArr.map((item) => {
        const foundData = findByDatetimeId(item, usersStatQuery.data);
        if (foundData) return foundData;
        return { _id: item, total: 0 };
      });
      setUserStatInRange(newUserStatInRange);
    }
  }, [usersStatSuccess, usersStatQuery]);

  useEffect(() => {
    if (incomeStatSuccess) {
      const initialStatArr = getDateArrInRange(incomeStatQuery.range[0], incomeStatQuery.range[1]);
      let newIncomeStatInRange = initialStatArr.map((item) => {
        const foundData = findByDatetimeId(item, incomeStatQuery.data);
        if (foundData) return foundData;
        return {
          _id: item,
          orderItemsPrice: 0,
          orderShippingPrice: 0,
          orderTotalPrice: 0,
          total: 0,
        };
      });
      setIncomeStatInRange(newIncomeStatInRange);
    }
  }, [incomeStatSuccess, incomeStatQuery]);

  const getDateArrInRange = (start, end) => {
    const dateArr = [];
    dateArr.unshift(moment(start).subtract(1, "day").format("YYYY-MM-DD"));
    while (moment(start).isBefore(moment(end))) {
      dateArr.push(moment(start).format("YYYY-MM-DD"));
      start = moment(start).add(1, "day");
    }
    // console.log(dateArr);
    return dateArr;
  };

  const handleChangeChecked = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };
  const dataColumnGroupedChart = (initdata = []) => {
    let data = [];
    initdata.map((item) => {
      data.push({ date: item._id, type: "Tổng giá sản phẩm", value: item.orderItemsPrice });
      data.push({ date: item._id, type: "Phí vận chuyển", value: item.orderShippingPrice });
      data.push({ date: item._id, type: "Tổng giá", value: item.orderTotalPrice });
    });
    return data.flat();
  };

  const onChangeRangeDateUser = (dates, dateStrings) => {
    setRangeDateUser(dateStrings);
  };
  const onChangeRangeDateIncome = (dates, dateStrings) => {
    setRangeDateIncome(dateStrings);
  };
  const onChange = (dates, dateStrings) => {
    setRangeDateUser(dateStrings);
    setRangeDateIncome(dateStrings);
  };

  const compareDatas = (arr = [], dataKey1) => {
    if (!arr || arr.length < 1) return 0;
    const prev = arr[0][dataKey1];
    const last = arr[arr.length - 1][dataKey1];
    if (prev > last) return -1;
    if (prev === last) return 0;
    return 1;
  };

  const TinyAreaChart = ({ arr, dataKey1 }) => {
    const data = arr.map((item) => item[dataKey1]);
    const config = {
      height: 60,
      autoFit: true,
      data,
      smooth: true,
      areaStyle: {
        fill: "#d6e3fd",
      },
    };
    return <TinyArea {...config} />;
  };

  const renderStatisticAmountCardSm = (arr = [], dataKey1, title) => {
    const compareStat = compareDatas(arr, dataKey1);
    return (
      <Col flex="auto">
        <Card>
          <Statistic
            title={
              <Space>
                <Typography.Text>{title}</Typography.Text>
                <div
                  style={{
                    color: compareStat === 0 ? "#8c8c8c" : compareStat === 1 ? "green" : "red",
                  }}
                >
                  {compareStat === 0 ? (
                    <BsArrowRight />
                  ) : compareStat === 1 ? (
                    <BsArrowUpRight />
                  ) : (
                    <BsArrowDownRight />
                  )}
                </div>
              </Space>
            }
            style={{ position: "absolute", width: "100%" }}
            valueStyle={{
              fontSize: 18,
              color: compareStat === 0 ? "#8c8c8c" : compareStat === 1 ? "green" : "red",
            }}
            suffix="$"
            value={getTotalByDatakey(arr, dataKey1)}
          />
          <Row justify="space-between" wrap={false}>
            <Col flex="auto"></Col>
            <Col flex="160px">
              <div>
                <TinyAreaChart arr={arr} dataKey1={dataKey1} />
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    );
  };

  return (
    <AdminLayout>
      <ContentWrapper>
        <div className="content-top">
          {isLoading ? (
            <Card loading size="small" title="___"></Card>
          ) : (
            <>
              <RangePicker onChange={onChange} bordered />
              <div className="header-filter-tags">
                <Typography.Text type="secondary">
                  <ChipTag icon={<BsSliders />}>Trạng thái đơn hàng:</ChipTag>
                </Typography.Text>
                <Space>
                  {CONSTANT.ORDER_STATUSES.map((item) => (
                    <Tag.CheckableTag
                      key={item.value}
                      checked={selectedTags.indexOf(item.value) > -1}
                      onChange={(checked) => handleChangeChecked(item.value, checked)}
                      style={{ fontSize: 14 }}
                    >
                      {item.name}
                    </Tag.CheckableTag>
                  ))}
                </Space>
              </div>
            </>
          )}
        </div>
        <Row className="content-middle" gutter={[24, 24]}>
          {!isLoading && (
            <Col span={24}>
              <Row justify="space-between" gutter={[24, 0]} wrap={false}>
                {renderStatisticAmountCardSm(incomeStatInRange, "orderTotalPrice", "Tổng giá")}
                {renderStatisticAmountCardSm(
                  incomeStatInRange,
                  "orderItemsPrice",
                  "Tổng giá sản phẩm"
                )}
                {renderStatisticAmountCardSm(
                  incomeStatInRange,
                  "orderShippingPrice",
                  "Phí vận chuyển"
                )}
              </Row>
            </Col>
          )}
          <Col span={16}>
            <Card
              loading={isLoading}
              title={<ChipTag icon={<FcLineChart size={22} />}>Thống kê Doanh thu</ChipTag>}
              size="small"
              extra={
                <RangePicker size="small" bordered={false} onChange={onChangeRangeDateIncome} />
              }
            >
              <MultiLineChart
                data={dataColumnGroupedChart(incomeStatInRange)}
                xField={"date"}
                yField={"value"}
                seriesField={"type"}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              loading={isLoading}
              size="small"
              title={
                <ChipTag icon={<FcDoughnutChart size={22} />}>Thống kê trạng thái đơn hàng</ChipTag>
              }
            >
              <DonutPieChart
                data={orderStatusStatData.map((o) => ({
                  type: getNameByValue(o._id, CONSTANT.ORDER_STATUSES),
                  value: o.total,
                }))}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card
              loading={isLoading}
              size="small"
              title={
                <ChipTag icon={<FcAreaChart size={22} />}>Thống kê người dùng đã đăng kí</ChipTag>
              }
              extra={<RangePicker size="small" bordered={false} onChange={onChangeRangeDateUser} />}
            >
              <AreaChart data={userStatInRange} />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              loading={isLoading}
              size="small"
              title={<ChipTag icon={<BsPeople size={22} />}>Danh sách người dùng</ChipTag>}
            >
              <div ref={ref} style={{ height: "100%" }}>
                <List>
                  <VirtualList
                    data={userListData}
                    height={containerHeight}
                    itemHeight={47}
                    itemKey="_id"
                  >
                    {(item) => (
                      <List.Item key={item._id}>
                        <List.Item.Meta
                          avatar={
                            <Badge dot color={getBadgeColorByStatus(item.status)}>
                              <Avatar size={40} src={item.picture} />
                            </Badge>
                          }
                          title={
                            <Space split="·" wrap={false} size={2}>
                              <Typography.Text ellipsis style={{ maxWidth: 240 }}>
                                {item.name}
                              </Typography.Text>
                              <Tag style={{ fontWeight: 400 }}>{item.role}</Tag>
                            </Space>
                          }
                          description={
                            <Typography.Paragraph
                              type="secondary"
                              ellipsis
                              className="paragraph"
                              style={{ marginBottom: 1 }}
                            >
                              {item.email}
                            </Typography.Paragraph>
                          }
                        />
                        <Space size={0} split={<Divider type="vertical" />}>
                          <Button type="link" disabled={item.role === "admin"}>
                            <Link to={`/admin/users/${item._id}`}>
                              <BsBoxArrowUpRight size={20} />
                            </Link>
                          </Button>
                        </Space>
                      </List.Item>
                    )}
                  </VirtualList>
                </List>
              </div>
            </Card>
          </Col>
        </Row>
      </ContentWrapper>
    </AdminLayout>
  );
};

const ContentWrapper = styled.div`
  & .content-top {
    margin-bottom: 24px;
  }
  & .content-middle {
    margin: 0 24px;
  }
  & .header-filter-tags {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    padding-left: 12px;
    margin-top: 12px;
  }
`;

export default DashboardPage;
