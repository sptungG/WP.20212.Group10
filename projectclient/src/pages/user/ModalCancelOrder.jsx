import { async } from "@firebase/util";
import { Form, Input, message, Modal } from "antd";
import React from "react";
import { BsList } from "react-icons/bs";
import ChipTag from "src/components/chip/ChipTag";
import { useCancelMyOrderMutation } from "src/stores/order/order.query";
import { useRefundPaymentMutation } from "src/stores/stripe/stripe.query";
import styled from "styled-components";

const validateMessages = {
  required: "Trường này chưa nhập giá trị!",
};

const ModalCancelOrder = ({ selectedOrder = null, setSelectedOrder }) => {
  const [form] = Form.useForm();
  const [cancelMyOrder, { isLoading: cancelMyOrderLoading }] = useCancelMyOrderMutation();
  const isLoading = cancelMyOrderLoading;
  const handleCancelMyOrder = async (initorder, values) => {
    try {
      message.loading("Đang xử lý...");
      const { orderId, paymentInfo } = initorder;
      const { orderContentNote } = values;
      const cancelMyOrderRes = await cancelMyOrder({
        orderId,
        initdata: { orderContentNote },
      }).unwrap();
      message.success("Yêu cầu hủy đơn thành công! Tài khoản của bạn sẽ được hoàn tiền sớm nhất", 4);
      form.resetFields();
      setSelectedOrder(null);
    } catch (err) {
      console.log("err", err);
    }
  };
  return (
    <Modal
      visible={!!selectedOrder}
      destroyOnClose
      title={`Bạn muốn hủy đơn hàng #${String(selectedOrder?.orderId)}?`}
      cancelText={"Chưa phải lúc"}
      okText={"Xác nhận hủy"}
      afterClose={() => setSelectedOrder(null)}
      cancelButtonProps={{ disabled: isLoading }}
      okButtonProps={{ loading: isLoading, disabled: isLoading }}
      onCancel={() => {
        setSelectedOrder(null);
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            handleCancelMyOrder(selectedOrder, values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <ModalBodyWrapper>
        <Form
          form={form}
          id="formCancelOrder"
          requiredMark={false}
          validateMessages={validateMessages}
          size={"large"}
          layout={"vertical"}
          disabled={isLoading}
        >
          <Form.Item
            label={<ChipTag icon={<BsList size={20} />}>Lý do hủy đơn</ChipTag>}
            rules={[{ required: true, type: "string", whitespace: false }]}
            name="orderContentNote"
          >
            <Input.TextArea
              rows={4}
              maxLength={200}
              showCount
              placeholder="Nhập lý do hủy đơn ..."
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          </Form.Item>
        </Form>
      </ModalBodyWrapper>
    </Modal>
  );
};

const ModalBodyWrapper = styled.div``;

export default ModalCancelOrder;
