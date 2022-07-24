import React from "react";
import AdminLayout from "src/layout/AdminLayout";
import styled from "styled-components";

const ContentWrapper = styled.div`
  & .content-top {
    margin-bottom: 24px;
  }
  & .content-middle {
    background: #fff;
    padding: 24px;
  }
`;

const OrderDetailPage = () => {
  return <AdminLayout>OrderDetailPage</AdminLayout>;
};

export default OrderDetailPage;
