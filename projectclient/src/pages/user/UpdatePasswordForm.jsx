import { Col, Form, Input, message, Modal, Progress, Row, Space, Typography } from "antd";
import { updatePassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { BsEnvelope } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineLockClosed } from "react-icons/hi";
import { auth } from "src/common/firebase-config";
import { useAuth } from "src/common/useAuth";
import Button from "src/components/button/Button";
import ChipTag from "src/components/chip/ChipTag";
import styled from "styled-components";

const UpdatePasswordForm = () => {
  const [form] = Form.useForm();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [, forceUpdate] = useState({});
  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const handleUpdatePassword = async ({ password }) => {
    setLoading(true);
    // console.log(password);
    message.loading("Đang xử lý...");
    await updatePassword(auth.currentUser, password)
      .then(() => {
        setLoading(false);
        form.resetFields();
        modalLogout();
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.message);
      });
  };

  const modalLogout = () => {
    let secondsToGo = 10;
    const modal = Modal.confirm({
      title: <Typography.Text type="success">Cập nhật mật khẩu thành công!</Typography.Text>,
      icon: null,
      content: null,
      centered: true,
      okText: "Đăng xuất ngay",
      cancelButtonProps: { className: "hidden" },
      okButtonProps: { size: "large", icon: <FiLogOut /> },
      onOk: () => logout(),
      afterClose: () => logout(),
      onCancel: () => logout(),
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: (
          <Row align="bottom" justify="center" gutter={[24, 24]}>
            <Col span={24}>
              Tài khoản sẽ được đăng xuất sau <b>{secondsToGo}</b> giây.
            </Col>
            <Col flex="160px">
              <Progress
                status="active"
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                type="circle"
                percent={(secondsToGo / 10) * 100}
                format={(percent) => `${percent / 10} s`}
              />
            </Col>
          </Row>
        ),
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      logout();
      modal.destroy();
    }, secondsToGo * 1000 - 1);
  };
  return (
    <FormWrapper className="password-form">
      <Form
        form={form}
        layout="vertical"
        size="large"
        requiredMark={false}
        onFinish={handleUpdatePassword}
        disabled={loading}
      >
        <Form.Item
          name={"email"}
          label={
            <ChipTag fontSize={22} icon={<BsEnvelope size={20} />}>
              Email
            </ChipTag>
          }
          validateTrigger={"onChange"}
          rules={[
            { required: true, message: "Trường này không được để trống." },
            {
              type: "email",
              message: "Hãy nhập đúng định dạng email.",
            },
            () => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject();
                }
                if (value !== user.email) {
                  return Promise.reject("Email chưa đúng.");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="Nhập email của bạn..." />
        </Form.Item>
        <Form.Item
          validateTrigger={"onKeyUp"}
          name="password"
          rules={[
            { required: true, message: "Trường này không được để trống." },
            { min: 6, message: "Mật khẩu cần tối thiểu 6 kí tự." },
          ]}
          label={
            <ChipTag fontSize={22} icon={<HiOutlineLockClosed size={20} />}>
              Mật khẩu mới
            </ChipTag>
          }
        >
          <Input.Password type="password" placeholder="Mật khẩu..." />
        </Form.Item>
        <Form.Item
          label={
            <ChipTag fontSize={22} icon={<HiOutlineLockClosed size={20} />}>
              Xác nhận mật khẩu
            </ChipTag>
          }
          validateTrigger={"onKeyUp"}
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Bạn chưa xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận chưa khớp!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu..." />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              htmlType="submit"
              block
              size="large"
              disabled={
                loading ||
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length).length
              }
            >
              Xác nhận thay đổi
            </Button>
          )}
        </Form.Item>
      </Form>
    </FormWrapper>
  );
};
const FormWrapper = styled.div`
  & .ant-form-item-control-input input,
  & .ant-input-password {
    background: transparent;
  }
  & .btnsubmit {
    color: #ff4d4f;
    background: #ffccc7;
    border: 1px solid transparent;
    &:hover {
      border-color: #ffa39e;
    }
  }
`;

export default UpdatePasswordForm;
