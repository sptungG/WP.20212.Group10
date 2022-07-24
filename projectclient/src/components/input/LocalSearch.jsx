import React from "react";
import { Divider, Card, Button, Form, Input, Select, Space } from "antd";
import { BsSearch } from "react-icons/bs";
import styled from "styled-components";

const ContentWrapper = styled.div`
  border: 1px solid #eee;
  background: #fff;
  margin-bottom: 24px;
`;

const LocalSearch = ({ onFinish, onValuesChange, placeholder = "Tìm kiếm trong bảng..." }) => {
  const [form] = Form.useForm();

  return (
    <ContentWrapper className="localsearch">
      <Form form={form} size="middle" onFinish={onFinish} onValuesChange={onValuesChange}>
        <Form.Item name="keySearch" noStyle>
          <Input
            bordered={false}
            style={{ paddingRight: 6 }}
            placeholder={placeholder}
            allowClear
            suffix={
              <Button type="primary" htmlType="submit" size="middle">
                <BsSearch size={18} />
              </Button>
            }
          />
        </Form.Item>
      </Form>
    </ContentWrapper>
  );
};

export default LocalSearch;
