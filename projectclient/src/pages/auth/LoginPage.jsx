import { Col, Divider, Form, Input, message, notification, Row, Space, Typography } from "antd";
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useEffect, useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleAuthProvider } from "src/common/firebase-config";
import { useAuth } from "src/common/useAuth";
import Button from "src/components/button/Button";
import ThemeButton from "src/components/button/ThemeButton";
import CarouselGallery from "src/components/images/CarouselGallery";
import AutocompleteEmailInput from "src/components/input/AutocompleteEmailInput";
import LogoAndText from "src/components/nav/LogoAndText";
import GalleryBgLayout from "src/layout/GalleryBgLayout";
import { useCreateOrUpdateUserMutation } from "src/stores/auth/auth.query";
import {
  setAuthtokenCredential,
  setEmailVerifiedValue,
  setRefreshToken,
} from "src/stores/auth/auth.reducer";
import { setDataRedirectStatus } from "src/stores/header/header.reducer";
import { setUser } from "src/stores/user/user.reducer";
import styled from "styled-components";

const FormWrapperStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  .carousel-wrapper {
    width: 100%;
    padding: 0 40px 24px 40px;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    @media screen and (max-width: 374.98px) {
      padding-bottom: 0;
    }
  }
  .from-container {
    width: 100%;
  }
`;

const LoginPage = (props) => {
  const mediaBelow480 = useMediaQuery({ maxWidth: 480 });
  const credential = useSelector((state) => state.auth);
  const [createOrUpdateUser] = useCreateOrUpdateUserMutation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({ email: credential.emailVerifiedValue });
  }, [credential.emailVerifiedValue, form]);

  const roleBasedRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (!user.emailVerified) throw new Error(`${user.email} hasn't verified yet!`);
      const idTokenResult = await user.getIdTokenResult();
      const res = await createOrUpdateUser(idTokenResult.token).unwrap();

      if (["deleted", "inactive"].includes(res.status)) {
        throw new Error(`${res.email} hiện đang khoá!`);
      } else {
        dispatch(setRefreshToken(user.refreshToken));
        dispatch(setAuthtokenCredential(idTokenResult.token));
        dispatch(setUser(res));
        dispatch(setEmailVerifiedValue(""));
        setLoading(false);
        roleBasedRedirect(res?.role);
      }
    } catch (error) {
      notification.error({
        message: error.message,
      });
      setLoading(false);
    }
  };

  // const googleLogin = () => {
  //   setLoading(true);
  //   signInWithPopup(auth, googleAuthProvider)
  //     .then(async (result) => {
  //       const { user } = result;
  //       const idTokenResult = await user.getIdTokenResult();
  //       const res = await createOrUpdateUser(idTokenResult.token).unwrap();
  //       dispatch(setAuthtokenCredential(idTokenResult.token));
  //       dispatch(setUser(res));
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       notification.error({ message: err.message });
  //       setLoading(false);
  //     });
  // };

  return (
    <GalleryBgLayout>
      <FormWrapperStyles>
        <div className="carousel-wrapper">
          <CarouselGallery size={"100%"} />
        </div>
        <div className="from-container">
          <Form
            form={form}
            name="formAuth"
            onFinish={handleSubmit}
            size="large"
            layout="vertical"
            requiredMark={false}
            autoComplete="off"
          >
            <Row justify="space-between" wrap={false}>
              <Typography.Title level={mediaBelow480 ? 2 : 1}>Welcome back</Typography.Title>
              <ThemeButton type="dropdown" btntype="dashed" shape="circle" size="large" />
            </Row>
            <Typography.Title level={5} type="secondary">
              Đăng nhập nhanh <LogoAndText fontSize={16} /> với:
            </Typography.Title>
            <Row gutter={16}>
              <Col span={8}>
                <Button
                  onClick={() => {
                    signInWithRedirect(auth, googleAuthProvider);
                    window.history.replaceState(null, "", "/");
                  }}
                  size="large"
                  block
                  disabled={loading}
                  loading={loading}
                >
                  <FcGoogle size={24} />
                </Button>
              </Col>
              <Col span={8}>
                <Button size="large" block disabled>
                  <FaFacebookSquare size={24} color="#85a5ff" />
                </Button>
              </Col>
              <Col span={8}>
                <Button size="large" block disabled>
                  <BsInstagram size={24} color="#ff85c0" />
                </Button>
              </Col>
            </Row>
            <Divider plain style={mediaBelow480 ? { margin: "8px 0" } : {}}>
              Hoặc
            </Divider>
            <Form.Item
              name="email"
              validateTrigger={"onChange"}
              rules={[
                { required: true, message: "Trường này không được để trống." },
                {
                  type: "email",
                  message: "Hãy nhập đúng định dạng email.",
                },
              ]}
            >
              {/* <Input prefix={<HiOutlineMail size={24} />} placeholder="Email..." /> */}
              <AutocompleteEmailInput placeholder="Email..." />
            </Form.Item>
            <Form.Item
              name="password"
              validateTrigger={"onKeyUp"}
              hasFeedback
              rules={[
                { required: true, message: "Trường này không được để trống." },
                { min: 6, message: "Mật khẩu cần tối thiểu 6 kí tự." },
              ]}
            >
              <Input.Password
                prefix={<HiOutlineLockClosed size={24} />}
                type="password"
                placeholder="Mật khẩu..."
              />
            </Form.Item>
            <Form.Item style={mediaBelow480 ? { marginBottom: 0 } : {}}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
                disabled={loading}
                block
              >
                Đăng nhập
              </Button>
              <p style={{ textAlign: "right" }}>
                <Link to="/forgot/password">Quên mật khẩu?</Link>
              </p>
            </Form.Item>
          </Form>
          <p style={{ textAlign: "center" }}>
            Bạn chưa có tài khoản? <Link to="/register">Đăng kí ngay</Link>
          </p>
        </div>
      </FormWrapperStyles>
    </GalleryBgLayout>
  );
};
export default LoginPage;
