import React from "react";
import { Typography, Steps, Row, Card, Col } from "antd";
import { useAddToCart } from "src/common/useAddToCart";

const CheckoutSteps = ({ current }) => {
  const { cart } = useAddToCart();

  const renderDesc = () => (
    <p>
      <Typography.Link>{cart ? cart.products.length : 0}</Typography.Link> sản phẩm
    </p>
  );

  return (
    <Row style={{ marginBottom: 24 }}>
      <Col span={24}>
        <Card bordered={false}>
          <Steps current={current} style={{ marginBottom: -24 }}>
            <Steps.Step title="Cart" description={renderDesc()} />
            <Steps.Step title="Checkout" description={renderDesc()} />
          </Steps>
        </Card>
      </Col>
    </Row>
  );
};

export default CheckoutSteps;
