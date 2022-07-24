import { Space, Tag, Typography } from "antd";
import { useLayoutEffect, useState } from "react";
import { BsSliders } from "react-icons/bs";
import { CONSTANT } from "src/common/constant";
import ChipTag from "src/components/chip/ChipTag";
import LocalSearch from "src/components/input/LocalSearch";
import AdminLayout from "src/layout/AdminLayout";
import { useGetAllOrdersQuery } from "src/stores/order/order.query";
import styled from "styled-components";
import OrderDrawerChangeStatus from "./OrderDrawerChangeStatus";
import OrderListTable from "./OrderListTable";

const OrderListPage = () => {
  const [selectedOrderToView, setSelectedOrderToView] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersFilterValue, setOrdersFilterValue] = useState({ sort: "" });
  const [selectedTag, setSelectedTag] = useState("");
  const {
    data: getAllOrdersQuery,
    isSuccess: getAllOrdersSuccess,
    refetch: getAllOrdersRefetch,
  } = useGetAllOrdersQuery(ordersFilterValue);
  const allOrdersRes = getAllOrdersSuccess ? getAllOrdersQuery : null;
  const [ordersList, setOrdersList] = useState([]);

  useLayoutEffect(() => {
    if (allOrdersRes?.data.length > 0) setOrdersList(allOrdersRes?.data);
  }, [allOrdersRes?.data]);

  const searched = (keyword) => (c) => c._id.includes(keyword);
  const handleLocalSearch = ({ keySearch = "" }) => {
    const newList = ordersList.filter(searched(keySearch));
    setOrdersList(newList);
  };
  const handleChangeChecked = (tag, checked) => {
    const nextSelectedTag = checked ? tag : "";
    const newList = nextSelectedTag
      ? allOrdersRes?.data.filter((o) => o.orderStatus.value === nextSelectedTag)
      : allOrdersRes?.data;
    setOrdersList(newList);
    setSelectedTag(nextSelectedTag);
  };
  const handleViewDetail = (orderId) => {
    setSelectedOrderToView(orderId);
  };
  const handleChangeStatus = (orderId) => {
    setSelectedOrder(orderId);
  };
  return (
    <AdminLayout>
      <ContentWrapper>
        <div className="content-top">
          <LocalSearch
            placeholder="Tìm kiếm đơn hàng theo Mã đơn hàng"
            onFinish={handleLocalSearch}
            onValuesChange={(changedValue, values) => handleLocalSearch(values)}
          />
          <div className="header-filter-statuses">
            <Typography.Text type="secondary">
              <ChipTag icon={<BsSliders />}>Trạng thái đơn hàng:</ChipTag>
            </Typography.Text>
            <Space>
              {CONSTANT.ORDER_STATUSES.map((item) => (
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
        <div className="content-middle">
          <OrderListTable
            data={ordersList}
            onClickShowDetail={(orderId) => handleViewDetail(orderId)}
            onClickChangeStatus={(orderId) => handleChangeStatus(orderId)}
          />
        </div>
      </ContentWrapper>
      <OrderDrawerChangeStatus
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
    </AdminLayout>
  );
};
const ContentWrapper = styled.div`
  & .content-top {
    margin-bottom: 24px;
    & .localsearch {
      margin-bottom: 12px;
    }
    & .header-filter-statuses {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: nowrap;
      gap: 8px;
    }
  }
  & .content-middle {
  }
`;
export default OrderListPage;
