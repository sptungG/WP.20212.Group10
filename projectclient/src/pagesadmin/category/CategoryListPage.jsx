import {
  Avatar,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Image,
  Input,
  List,
  notification,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  BsArrowReturnRight,
  BsCheckLg,
  BsFillImageFill,
  BsThreeDots,
  BsTrash,
  BsXLg,
} from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  formatDate,
  formatFromNow,
  sorterByDate,
  sorterByWords,
  vietnameseSlug,
} from "src/common/utils";
import Button from "src/components/button/Button";
import AdminLayout from "src/layout/AdminLayout";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesFilteredQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "src/stores/category/category.query";
import styled from "styled-components";
import { useGetAllProductsFilteredQuery } from "src/stores/product/product.query";
import { NOT_FOUND_IMG } from "src/common/constant";

const CategoryListPage = () => {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const { categoryId } = useParams();
  const { data: categoriesFilteredQuery, isSuccess: getCategoriesSuccess } =
    useGetAllCategoriesFilteredQuery({ sort: "", keyword: "" });
  const { data: categoryQuery, isSuccess: getCategorySuccess } = useGetCategoryQuery(categoryId, {
    skip: !categoryId,
  });
  const [updateCategory, { data: updateCategoryData, isSuccess: updateCategorySuccess }] =
    useUpdateCategoryMutation();
  const [createCategory, { data: createCategoryData, isSuccess: createCategorySuccess }] =
    useCreateCategoryMutation();
  const [deleteCategory, { data: deleteCategoryData, isSuccess: deleteCategorySuccess }] =
    useDeleteCategoryMutation();
  const imageUrlValue = Form.useWatch("image", form);

  useEffect(() => {
    if (getCategorySuccess) {
      const { category, data: productList } = categoryQuery;
      form.setFieldsValue({
        image: category.image,
        name: category.name,
      });
    } else {
      form.resetFields();
    }
  }, [categoryQuery, form, getCategorySuccess]);

  const handleRemove = (categoryId) => {
    deleteCategory(categoryId);
    notification.error({
      message: "Xóa thành công",
      description: `${categoryId}`,
    });
    form.resetFields();
    navigate("/admin/categories", { replace: true });
  };

  const handleSubmit = (values) => {
    if (categoryId) {
      updateCategory({ id: categoryId, initdata: values });
      notification.success({
        message: "Cập nhật thành công",
        description: `${values.name}`,
      });
    } else {
      createCategory(values);
      form.resetFields();
      notification.success({
        message: "Thêm mới thành công",
        description: `${values.name}`,
      });
    }
  };

  const handleCancel = () => {
    if (categoryId) {
      const { category } = categoryQuery;
      form.setFieldsValue({
        image: category.image,
        name: category.name,
      });
    } else {
      form.resetFields();
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => (
        <Space>
          <Avatar size={48} src={record.image} />
          <Typography.Text ellipsis>{text}</Typography.Text>
        </Space>
      ),
      sorter: (a, b) => sorterByWords("name")(a, b),
    },
    {
      title: "Số sản phẩm",
      dataIndex: "products_count",
      key: "products_count",
      width: 140,
      align: "center",
      render: (text) => <Typography.Text>{text}</Typography.Text>,
      sorter: (a, b) => a.products_count - b.products_count,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 170,
      render: (text) => <Typography.Text>{formatFromNow(text)}</Typography.Text>,
      sorter: (a, b) => sorterByDate("updatedAt")(a, b),
    },
    {
      title: "Ngày thêm",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (text) => <Typography.Text>{formatDate(text)}</Typography.Text>,
      sorter: (a, b) => sorterByDate("createdAt")(a, b),
    },
    {
      title: <BsThreeDots size={24} />,
      dataIndex: "",
      key: "action",
      width: 170,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/admin/categories/${record._id}`}>
            <Button size="large" type="text" icon={<BiEdit />}></Button>
          </Link>
          <Popconfirm
            title={
              <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 280, margin: 0 }}>
                Bạn chắc chắc muôn xóa <b>{record.name}</b> ?
              </Typography.Paragraph>
            }
            placement="topRight"
            okText={<BsCheckLg />}
            cancelText={<BsXLg />}
            onConfirm={() => handleRemove(record._id)}
          >
            <Button size="large" type="text" danger icon={<BsTrash />}></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <ContentWrapper>
        <Row gutter={24} wrap={false}>
          <Col flex="auto">
            <Card
              title="Danh sách danh mục"
              extra={
                <Space>
                  <Link to={`/admin/categories`}>
                    <Button type="link" extraType="btntag" loading={!getCategoriesSuccess}>
                      Thêm danh mục
                    </Button>
                  </Link>
                </Space>
              }
              loading={!getCategoriesSuccess}
              bodyStyle={{ padding: 0 }}
            >
              {getCategoriesSuccess && (
                <Table
                  className="hide-title table-fixed-pagination"
                  columns={columns}
                  title={() => ""}
                  footer={() => ""}
                  rowKey={(record) => record._id}
                  dataSource={categoriesFilteredQuery.data}
                  pagination={{
                    total: categoriesFilteredQuery.data.length,
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
              title={getCategorySuccess ? "Sửa danh mục" : "Thêm mới"}
              extra={
                <Button
                  type="text"
                  extraType="btndanger"
                  className="btndanger"
                  loading={!getCategoriesSuccess}
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
              }
              loading={categoryId && !getCategorySuccess}
            >
              <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                requiredMark={false}
                size="large"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="name"
                  label={"Tên danh mục"}
                  rules={[{ required: true, message: "Trường này chưa nhập giá trị!" }]}
                >
                  <Input placeholder="Nhập tên danh mục..." />
                </Form.Item>
                {/* <Form.Item
                  name="productList"
                  label="Danh sách sản phẩm"
                  rules={[{ required: true }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Chọn sản phẩm..."
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      vietnameseSlug(option.children, " ").indexOf(vietnameseSlug(input, " ")) >= 0
                    }
                  >
                    {getProductsSuccess &&
                      productsFilteredQuery.data.map((p) => (
                        <Select.Option key={p._id} value={p._id}>
                          <Space align="center" style={{ height: "100%" }} wrap={false}>
                            <Avatar size="small" src={p.images[0].url}>
                              {p.name[0]}
                            </Avatar>
                            <Typography.Text ellipsis>{p.name}</Typography.Text>
                          </Space>
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item> */}
                <Form.Item
                  name="image"
                  label={"Hình ảnh"}
                  rules={[
                    { required: true, message: "Trường này chưa nhập giá trị!" },
                    {
                      type: "url",
                      message: "Đường dẫn sai định dạng!",
                    },
                  ]}
                >
                  <Input prefix={<BsFillImageFill />} placeholder="Nhập đường dẫn ảnh..." />
                </Form.Item>
                <div className="image-preview-wrapper">
                  {imageUrlValue || getCategorySuccess ? (
                    <div className="image-preview-container">
                      <Image height={160} src={imageUrlValue} fallback={NOT_FOUND_IMG} />
                    </div>
                  ) : null}
                </div>

                <Form.Item shouldUpdate>
                  {() => (
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      disabled={
                        !!form.getFieldsError().filter(({ errors }) => errors.length).length
                      }
                    >
                      {getCategorySuccess ? "Lưu thay đổi" : "Thêm danh mục"}
                    </Button>
                  )}
                </Form.Item>
              </Form>
              {getCategorySuccess && (
                <div className="productList-wrapper">
                  <Divider orientation="left" plain>
                    Sản phẩm · {categoryQuery?.data.length}
                  </Divider>
                  {categoryQuery?.data.length > 0 ? (
                    <Space size={8} wrap={true}>
                      {categoryQuery.data.map((product) => (
                        <Link
                          key={product._id}
                          to={`/admin/products/${product._id}`}
                          title={"Đi đến sản phẩm"}
                        >
                          <Tag style={{ margin: 0, padding: 4 }}>
                            <Space align="center">
                              <Avatar size="small" src={product.images[0].url}>
                                {product.name[0]}
                              </Avatar>
                              <Typography.Text ellipsis>{product.name}</Typography.Text>
                            </Space>
                          </Tag>
                        </Link>
                      ))}
                    </Space>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
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
  & .image-preview {
    &-wrapper {
      width: 100%;
      margin-bottom: 24px;
    }
  }
  & #productList-gallery {
    & .image-wrapper {
      border: 1px solid #eee;
      background-color: #eee;
    }
  }
`;

export default CategoryListPage;
