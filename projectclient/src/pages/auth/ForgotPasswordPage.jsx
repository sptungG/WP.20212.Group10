import { Alert, Button, Form, Input, Typography, notification } from "antd";
import { auth } from "src/common/firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import GalleryBgLayout from "src/layout/GalleryBgLayout";
import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setEmailVerifiedValue } from "src/stores/auth/auth.reducer";
import { useMediaQuery } from "react-responsive";
import AutocompleteEmailInput from "src/components/input/AutocompleteEmailInput";

const FormWrapperStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  .carousel-wrapper {
    width: 100%;
    padding: 0 48px 24px 48px;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .from-container {
    width: 100%;
  }
`;

const ForgotPasswordPage = (props) => {
  const mediaBelow480 = useMediaQuery({ maxWidth: 480 });
  const dispatch = useDispatch();
  const [status, setStatus] = React.useState("");

  const [form] = Form.useForm();

  let navigate = useNavigate();

  const handleSubmit = ({ email }) => {
    setStatus("loading");
    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
      handleCodeInApp: true,
    };

    sendPasswordResetEmail(auth, email, config)
      .then(() => {
        form.resetFields();
        setStatus("success");
        notification.success({ message: "Check your email for password reset link" });
        dispatch(setEmailVerifiedValue(email));
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        setStatus("error");
        notification.error({ message: error.message });
        console.log("ERROR MSG IN FORGOT PASSWORD", error);
      });
  };

  return (
    <GalleryBgLayout>
      <FormWrapperStyles>
        <div className="carousel-wrapper">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/setup-store-v2.appspot.com/o/forgot-password-amicoo.svg?alt=media&token=8a085927-017c-47b1-8774-60edc4985f3f"
            alt="forgot-password-amico"
          />
        </div>
        <div className="from-container">
          <Form
            form={form}
            name="formAuth"
            onFinish={handleSubmit}
            size="large"
            layout="vertical"
            requiredMark={false}
          >
            <Typography.Title level={mediaBelow480 ? 2 : 1}>Quên mật khẩu?</Typography.Title>
            <Form.Item
              name="email"
              label={
                <Typography.Title level={5} type="secondary" style={{ marginBottom: 2 }}>
                  Hãy nhập địa chỉ email của bạn để khôi phục mật khẩu.
                </Typography.Title>
              }
              rules={[
                { required: true, message: "Trường này không được để trống." },
                {
                  type: "email",
                  message: "Hãy nhập đúng định dạng email.",
                },
              ]}
            >
              {/* <Input prefix={<HiOutlineMail size={24} />} placeholder="Email..." autoComplete="email"/> */}
              <AutocompleteEmailInput placeholder="Email..." />
            </Form.Item>
            <Form.Item style={{ marginTop: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="forgot-form-button"
                loading={status === "loading"}
                disabled={status === "loading"}
                block
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
          <p style={{ textAlign: "center" }}>
            Trở lại trang <Link to="/login">Đăng nhập</Link>
          </p>
          {status === "success" && (
            <Alert
              message={"Đường dẫn xác nhận đã được gửi đến email của bạn."}
              type="info"
              action={
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={"https://mail.google.com/mail/u/0/#inbox"}
                >
                  Đi đến hòm thư
                </a>
              }
            />
          )}
        </div>
      </FormWrapperStyles>
    </GalleryBgLayout>
  );
};
export default ForgotPasswordPage;
