import React from "react";
import { Breadcrumb as AntdBreadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  "/admin/categories": "Danh mục",
  "/admin/orders": "Đơn hàng",
  "/admin/products": "Sản phẩm",
  "/admin/products/create": "Thêm mới",
  "/admin/combos": "Bộ sưu tập",
  "/admin/reviews": "Đánh giá",
  "/admin/users": "Khách hàng",
  "/admin/setting": "Cài đặt",
};

const Breadcrumb = () => {
  const location = useLocation();
  if (location.pathname === "/admin/dashboard") return null;

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((item, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    if (url !== "/admin")
      return (
        <AntdBreadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[url] || pathSnippets[2]}</Link>
        </AntdBreadcrumb.Item>
      );
    return null;
  });

  const breadcrumbItems = [
    <AntdBreadcrumb.Item key="/admin/dashboard">
      <Link to="/admin/dashboard">Tổng quan</Link>
    </AntdBreadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return <AntdBreadcrumb style={{ marginBottom: 24 }}>{breadcrumbItems}</AntdBreadcrumb>;
};

export default Breadcrumb;
