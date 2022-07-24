import { Avatar, Descriptions, Space, Statistic, Table, Tag, Typography } from "antd";
import React from "react";
import { NOT_FOUND_IMG } from "src/common/constant";
import { checkValidColor, findImageById } from "src/common/utils";
import InputNumberGroup from "src/components/input/InputNumberGroup";
import styled from "styled-components";

const OrderDetailTable = ({ dataSource = [], footer = () => "" }) => {
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
      render: (text, { product, variant }) => {
        const foundVariantImage = findImageById(variant.image, product.images);
        return (
          <Space>
            <Avatar
              size={48}
              src={foundVariantImage.url}
              fallback={NOT_FOUND_IMG}
              key={`table_${foundVariantImage._id}`}
            />
            <Space size={2} direction="vertical" style={{ maxWidth: 320, paddingRight: 16 }}>
              <Typography.Text ellipsis>{product.name}</Typography.Text>
              <Typography.Text type="secondary" ellipsis>
                {product.desc}
              </Typography.Text>
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Đã chọn",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
      width: 160,
      render: (text, { product, variant }) => {
        const foundVariantImage = findImageById(variant.image, product.images);
        return (
          <Space>
            <Descriptions column={1} size="small">
              {variant.options.map((o, index) => (
                <Descriptions.Item
                  label={o.name}
                  span={1}
                  key={`variant_options_${variant._id}_${index}`}
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
                    <Tag color={"default"} className={"tag"} style={{ maxWidth: 43, margin: 0 }}>
                      <Typography.Text ellipsis>{o.value}</Typography.Text>
                    </Tag>
                  )}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Space>
        );
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 160,
      align: "center",
      render: (text) => <Statistic value={text} groupSeparator="." prefix="$"></Statistic>,

      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
      width: 160,
      align: "center",
      render: (text, { product, variant }) => {
        return (
          <InputNumberGroup
            decrDisabled={true}
            incDisabled={true}
            inputDisabled={true}
            value={text}
          />
        );
      },

      sorter: (a, b) => a.count - b.count,
    },
  ];

  return (
    <TableWrapper>
      <Table
        className="hide-title"
        loading={!dataSource}
        columns={columns}
        rowKey={({ variant }) => variant._id}
        dataSource={dataSource}
        pagination={false}
        footer={footer}
      />
    </TableWrapper>
  );
};
const TableWrapper = styled.div``;
export default OrderDetailTable;
