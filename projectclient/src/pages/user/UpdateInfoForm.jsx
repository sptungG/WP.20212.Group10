import { Col, Form, Image, Input, message, Row } from "antd";
import { useEffect } from "react";
import { BsImage, BsPersonCircle } from "react-icons/bs";
import { NOT_FOUND_IMG } from "src/common/constant";
import { useAuth } from "src/common/useAuth";
import Button from "src/components/button/Button";
import ChipTag from "src/components/chip/ChipTag";
import { useUpdateMyInfoMutation } from "src/stores/user/user.query";
import styled from "styled-components";

const UpdateInfoForm = () => {
  const [form] = Form.useForm();
  const { user, isSignedIn, message401, refetchCurrentUser } = useAuth();
  const picture = Form.useWatch("picture", form);
  const [updateMyInfo, { isLoading }] = useUpdateMyInfoMutation();

  useEffect(() => {
    if (isSignedIn) {
      const { name, picture } = user;
      form.setFieldsValue({ name, picture });
    }
  }, [isSignedIn]);

  const handleUpdateInfo = async ({ name, picture }) => {
    try {
      message.loading("Đang xử lý ...");
      const updateMyInfoRes = await updateMyInfo({ name, picture }).unwrap();
      message.success("Cập nhật thông tin thành công");
      await refetchCurrentUser();
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <FormWrapper className="info-form">
      <Form
        form={form}
        layout="vertical"
        size="large"
        requiredMark={false}
        onFinish={handleUpdateInfo}
        disabled={isLoading}
      >
        <Form.Item
          name={"name"}
          label={
            <ChipTag fontSize={22} icon={<BsPersonCircle size={20} />}>
              Tên hiển thị
            </ChipTag>
          }
          validateTrigger={"onChange"}
          rules={[{ required: true, message: "Trường này không được để trống." }]}
        >
          <Input placeholder="Nhập tên mới của bạn..." />
        </Form.Item>

        <Row gutter={[24, 24]} wrap={false} className="row-picture">
          <Col flex="auto" className="hide-error">
            <Form.Item
              initialValue={user?.picture || ""}
              name="picture"
              rules={[{ type: "url" }]}
              label={
                <ChipTag fontSize={22} icon={<BsImage size={20} />}>
                  Ảnh đại diện
                </ChipTag>
              }
              tooltip="Đường dẫn ảnh"
            >
              <Input.TextArea
                rows={2}
                autoSize={{ minRows: 2, maxRows: 2 }}
                placeholder="Cập nhật đường dẫn ảnh đại diện..."
              />
            </Form.Item>
          </Col>
          <Col flex="136px">
            <Image
              src={picture}
              width="100%"
              height="100%"
              fallback={NOT_FOUND_IMG}
              onError={(e) => form.setFieldsValue({ picture: user?.picture || "" })}
            />
          </Col>
        </Row>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              htmlType="submit"
              block
              size="large"
              disabled={
                form.getFieldValue("name") === user?.name &&
                form.getFieldValue("picture") === user?.picture
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
  & .row-picture {
    margin-bottom: 24px;
  }
`;

export default UpdateInfoForm;
