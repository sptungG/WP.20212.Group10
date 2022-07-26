import {
  Alert,
  Avatar,
  Badge,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Space,
  Tag,
  Timeline,
  Typography,
} from "antd";
import lodash from "lodash";
import { useEffect, useState } from "react";
import {
  BsArrowRight,
  BsChatLeftText,
  BsFileEarmarkRichtext,
  BsFileText,
  BsPersonCircle,
} from "react-icons/bs";
import { CONSTANT } from "src/common/constant";
import { useAuth } from "src/common/useAuth";
import { formatDate, setColorByStatus } from "src/common/utils";
import Button from "src/components/button/Button";
import ChipTag from "src/components/chip/ChipTag";
import { useGetOrderByIdQuery, useUpdateOrderMutation } from "src/stores/order/order.query";
import { useRefundPaymentMutation } from "src/stores/stripe/stripe.query";
import styled from "styled-components";

const validateMessages = {
  required: "Trường này chưa nhập giá trị!",
};

const OrderDrawerChangeStatus = ({ setSelectedOrder, selectedOrder = null }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [updateOrder, { isLoading: updateOrderLoading }] = useUpdateOrderMutation();
  const [refundPayment, { isLoading: refundPaymentLoading }] = useRefundPaymentMutation();

  const { data: getOrderQuery, isSuccess: getOrderSuccess } = useGetOrderByIdQuery(selectedOrder, {
    skip: !selectedOrder,
  });
  const statusValue = Form.useWatch("statusValue", form);
  const statusName = Form.useWatch("statusName", form);
  // const orderLogContent = Form.useWatch("orderLogContent", form);
  const [orderLog, setOrderLog] = useState([]);
  const foundOrderData = getOrderSuccess ? getOrderQuery?.data : null;

  useEffect(() => {
    if (getOrderSuccess) {
      const { orderStatus, orderLog } = getOrderQuery?.data;
      const reversedLog = lodash.reverse([...orderLog]);
      setOrderLog(reversedLog);
      form.setFieldsValue({
        statusValue: orderStatus?.value,
        statusName: orderStatus?.name,
        orderLogContent: "",
      });
    }
  }, [getOrderSuccess, getOrderQuery?.data]);

  // useEffect(() => {
  //   if(orderLogContent)
  // }, [orderLogContent])

  const handleValuesChange = (currentOrderLog, values) => {
    const { orderLogContent } = values;
    const newLog = lodash.uniqBy(
      [
        {
          _id: "newnewnew",
          content: orderLogContent || "",
          createdAt: undefined,
          createdBy: user,
        },
        ...currentOrderLog,
      ],
      "_id"
    );
    setOrderLog(newLog);
  };
  const handleCancelUpdateOrder = () => {
    const { orderStatus, orderLog } = foundOrderData;
    setOrderLog(orderLog);
    form.setFieldsValue({
      statusValue: orderStatus?.value,
      statusName: orderStatus?.name,
      orderLogContent: "",
    });
  };
  const handleUpdateOrderStatus = async (orderId, values) => {
    try {
      if (!orderId) throw new Error("Mã đơn sai định dạng");
      message.loading("Đang xử lý ...");
      const updateOrderRes = await updateOrder({ orderId, initdata: values });
      message.success("Cập nhật trạng thái đơn hàng thành công");
      setSelectedOrder(null);
    } catch (err) {
      message.error("Đã có lỗi xảy ra");
      console.log("err", err);
      setSelectedOrder(null);
    }
  };
  const handleCancelOrderStatus = async (orderId, values, orderPaymentStatus) => {
    try {
      if (!orderId) throw new Error("Mã đơn sai định dạng");
      message.loading("Đang xử lý ...");
      const updateOrderRes = await updateOrder({ orderId, initdata: values });
      if (values.statusValue === "CANCELLED" && String(orderPaymentStatus) !== "COD") {
        const refundRes = await refundPayment(orderId).unwrap();
        message.info("Hủy đơn hàng thành công. Xác nhận hoàn tiền về tài khoản khách hàng");
      }
      message.success("Cập nhật trạng thái đơn hàng thành công");
      setSelectedOrder(null);
    } catch (err) {
      message.error("Đã có lỗi xảy ra");
      console.log("err", err);
      setSelectedOrder(null);
    }
  };
  const handleChangeSelect = (selectedValue, selectedOption) => {
    const { key, value, label } = selectedOption;
    form.setFieldsValue({
      statusValue: value,
      statusName: label,
    });
  };
  return (
    <Drawer
      visible={!!selectedOrder}
      onClose={() => {
        setSelectedOrder(null);
      }}
      title={`Đơn hàng #${selectedOrder}`}
      destroyOnClose
      getContainer={false}
      width={480}
      footer={
        <DrawerFooterWrapper>
          <Space split={<Divider type="vertical" />}>
            <Button
              type="text"
              form="formChangeOrder"
              htmlType="button"
              extraType="btndanger"
              className="btndanger"
              onClick={() => handleCancelUpdateOrder()}
              disabled={updateOrderLoading}
            >
              Hủy
            </Button>
            <Button
              form="formChangeStatus"
              type="primary"
              htmlType="submit"
              loading={updateOrderLoading}
              disabled={statusValue === foundOrderData?.orderStatus.value || updateOrderLoading}
            >
              Cập nhật trạng thái đơn
            </Button>
          </Space>
        </DrawerFooterWrapper>
      }
    >
      <DrawerBodyWrapper>
        <Form
          id="formChangeStatus"
          name="changeStatusForm"
          form={form}
          size="large"
          layout="vertical"
          requiredMark={false}
          validateMessages={validateMessages}
          onFinish={(values) =>
            values.statusValue === "CANCELLED"
              ? handleCancelOrderStatus(selectedOrder, values, foundOrderData?.paymentInfo.status)
              : handleUpdateOrderStatus(selectedOrder, values)
          }
          onValuesChange={(changedValue, values) => handleValuesChange(orderLog, values)}
          disabled={["DELIVERED", "CANCELLED"].includes(foundOrderData?.orderStatus.value)}
        >
          <Form.Item
            label={
              <ChipTag fontSize={22} icon={<BsFileText size={20} />}>
                Trạng thái mới
              </ChipTag>
            }
            name={"statusValue"}
            rules={[{ required: true }, { enum: CONSTANT.ORDER_STATUSES }]}
          >
            <Select placeholder="Chọn trạng thái mới..." onChange={handleChangeSelect}>
              {CONSTANT.ORDER_STATUSES.map(({ value, name }) => (
                <Select.Option value={value} key={value} label={name}>
                  <Badge color={setColorByStatus(value)} text={name} />
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={"statusName"}
            label={
              <ChipTag fontSize={22} icon={<BsFileEarmarkRichtext size={20} />}>
                Tên trạng thái
              </ChipTag>
            }
            tooltip="Tên trạng thái hiển thị ở tag trạng thái"
          >
            <Input placeholder="Nhập tên trạng thái..." showCount />
          </Form.Item>
          <Form.Item
            name={"orderLogContent"}
            label={
              <ChipTag fontSize={22} icon={<BsChatLeftText size={20} />}>
                Ghi chú
              </ChipTag>
            }
            rules={[{ required: true }]}
          >
            <Input.TextArea
              rows={4}
              showCount
              autoSize={{ minRows: 4, maxRows: 4 }}
              placeholder="Nhập ghi chú trạng thái đến khách hàng..."
            />
          </Form.Item>
        </Form>
        <Divider plain orientation="left">
          Trạng thái mới
        </Divider>
        <div className="status-container">
          {foundOrderData?.orderStatus && (
            <Space
              wrap={false}
              size={16}
              split={<BsArrowRight size={20} />}
              className="ant-space-center-items"
            >
              <Tag color={setColorByStatus(foundOrderData.orderStatus.value)}>
                {foundOrderData.orderStatus.name}
              </Tag>
              {statusValue && statusValue !== foundOrderData.orderStatus.value ? (
                <Tag color={setColorByStatus(statusValue)}>{statusName}</Tag>
              ) : (
                <Tag>-------</Tag>
              )}
            </Space>
          )}
        </div>
        <Divider plain orientation="left">
          Timeline đơn hàng
        </Divider>
        <div className="timeline-container">
          {orderLog.length && (
            <Timeline pending={!orderLog ? "Đang xử lý..." : false} mode="left">
              {orderLog.map((stt) => (
                <Timeline.Item
                  key={stt._id}
                  label={
                    <Typography.Text ellipsis>
                      {formatDate(stt.createdAt, "DD-MM-YYYY HH:mm:ss")}
                    </Typography.Text>
                  }
                  color="blue"
                >
                  <Space direction="vertical">
                    <Alert
                      type="info"
                      description={
                        <Typography.Paragraph
                          ellipsis={{ rows: 3, expandable: true, symbol: "Xem thêm" }}
                          style={{ maxWidth: 160, margin: 0 }}
                        >
                          {stt.content}
                        </Typography.Paragraph>
                      }
                    />
                    <ChipTag
                      icon={
                        <Avatar
                          icon={<BsPersonCircle />}
                          src={stt.createdBy.picture}
                          size={16}
                        ></Avatar>
                      }
                    >
                      {stt.createdBy.name}
                    </ChipTag>
                  </Space>
                </Timeline.Item>
              ))}
            </Timeline>
          )}
        </div>
      </DrawerBodyWrapper>
    </Drawer>
  );
};
const DrawerBodyWrapper = styled.div`
  .status-container {
    display: flex;
    justify-content: center;
    align-items: center;
    & .ant-tag {
      margin-right: 0;
    }
  }
`;
const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default OrderDrawerChangeStatus;
