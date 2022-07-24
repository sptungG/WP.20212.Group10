import { Tag } from "antd";
import React from "react";
import { BsCash, BsCreditCard2Front, BsXCircle } from "react-icons/bs";

const PaymentInfoTag = ({ paymentInfo }) => {
  const {
    id,
    status,
    payment_method_types: [payment_method_type],
  } = paymentInfo;
  if (payment_method_type === "card")
    return (
      <Tag color="green" icon={<BsCreditCard2Front />} className="payment-tag">
        Đã thanh toán
      </Tag>
    );
  if (status.toLowerCase() === "cod" && payment_method_type === "cash")
    return (
      <Tag color="orange" icon={<BsCash />} className="payment-tag">
        Thanh toán khi nhận hàng
      </Tag>
    );
  return (
    <Tag color="error" icon={<BsXCircle />} className="payment-tag">
      ERROR
    </Tag>
  );
};

export default PaymentInfoTag;
