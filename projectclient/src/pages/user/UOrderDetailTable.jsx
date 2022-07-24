import { Avatar, Descriptions, Space, Statistic, Table, Tag, Typography } from "antd";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { NOT_FOUND_IMG } from "src/common/constant";
import { checkValidColor } from "src/common/utils";
import Button from "src/components/button/Button";
import styled from "styled-components";

const UOrderDetailTable = ({
  dataSource = [],
  footer = () => "",
  getSelectedProductId = (p) => console.log(p),
  className = ""
}) => {
  let navigate = useNavigate();
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
      render: (text, { saved_name, saved_image, product }) => {
        return (
          <Space align="center" size={12}>
            <Avatar
              size={96}
              shape="square"
              src={saved_image}
              fallback={NOT_FOUND_IMG}
              key={`table_${text}`}
            />
            <Space size={12} direction="vertical" align="start">
              <Typography.Text ellipsis strong style={{ maxWidth: 320 }}>
                {saved_name}
              </Typography.Text>
              <Space size={12} wrap={false}>
                {/* <Button>Hủy đơn</Button> */}
                <Button onClick={() => navigate(`/products/${product}`, { replace: true })}>
                  Viết đánh giá
                </Button>
                <Button onClick={() => getSelectedProductId(product)}>Mua lại</Button>
              </Space>
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Đã chọn",
      dataIndex: "saved_variant",
      key: "saved_variant",
      ellipsis: true,
      width: 160,
      render: (text, { saved_variant, variant }) => {
        return (
          <Space>
            <Descriptions column={1} size="small">
              {saved_variant.map((o, index) => (
                <Descriptions.Item
                  label={o.name}
                  span={1}
                  key={`variant_options_${variant}_${index}`}
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
      dataIndex: "saved_price",
      key: "saved_price",
      width: 160,
      align: "center",
      render: (text) => <Statistic value={text} groupSeparator="." prefix="$"></Statistic>,

      sorter: (a, b) => a.saved_price - b.saved_price,
    },
    {
      title: "Số lượng",
      dataIndex: "saved_quantity",
      key: "saved_quantity",
      width: 160,
      align: "center",
      render: (text) => {
        return <Statistic value={text} groupSeparator="."></Statistic>;
      },

      sorter: (a, b) => a.saved_quantity - b.saved_quantity,
    },
  ];

  return (
    <TableWrapper>
      <Table
        className={classNames("hide-title", className)}
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
export default UOrderDetailTable;
