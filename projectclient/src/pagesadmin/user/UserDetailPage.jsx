import {
  Alert,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  List,
  message,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import uniqBy from "lodash/uniqBy";
import { useEffect, useState } from "react";
import { AiOutlineInbox, AiOutlineMinus, AiOutlinePlusCircle } from "react-icons/ai";
import {
  BsArrowLeft,
  BsCheckLg,
  BsEye,
  BsPencil,
  BsSliders,
  BsTrash,
  BsUpload,
  BsXLg,
} from "react-icons/bs";
import Resizer from "react-image-file-resizer";
import { useNavigate, useParams } from "react-router-dom";
import { NOT_FOUND_IMG } from "src/common/constant";
import Button from "src/components/button/Button";
import MasonryLayout from "src/components/images/MasonryLayout";
import LogoCube from "src/components/nav/LogoCube";
import AdminLayout from "src/layout/AdminLayout";
import { useDeleteProductMutation } from "src/stores/product/product.query";
import styled from "styled-components";

import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "src/stores/user/user.query";
import { useGetAddressByUserIdQuery } from "src/stores/address/address.query";

const validateMessages = {
  required: "Trường này chưa nhập giá trị!",
  // ...
};

message.config({
  maxCount: 1,
});

const ProductCreateUpdateDetailPage = () => {
  const [form] = Form.useForm();
  const [formImageUrl] = Form.useForm();
  const [formAddAddress] = Form.useForm();
  let navigate = useNavigate();
  const { userId } = useParams();
  const [images, setImages] = useState([]);
  const [imageUrlVisible, setImageUrlVisible] = useState(false);
  const [addAddressVisible, setAddAddressVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [variantList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { data: usersFilteredQuery, isSuccess: getUsersSuccess } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  const { data: addressQuery, isSuccess: getAddressSuccess } = useGetAddressByUserIdQuery(userId, {
    skip: !userId,
  });
  const [updateUser, { data: updateUserData, isLoading: updateUserLoading }] =
    useUpdateUserMutation();
  const [deleteProduct, { data: deleteProductData, isLoading: deleteProductLoading }] =
    useDeleteProductMutation();
  const imageUrl = Form.useWatch("imageUrl", formImageUrl);

  useEffect(() => {
    if (getUsersSuccess) {
      const { name, email, role, status, picture, ...rest } = usersFilteredQuery.data;
      setImages([picture]);
      form.setFieldsValue({
        name,
        email,
        role,
        status,
      });
    }
  }, [userId, usersFilteredQuery, getUsersSuccess]);

  useEffect(() => {
    if (getAddressSuccess) {
      setAddressList(addressQuery.data);
    }
  }, [getAddressSuccess]);

  const handleCancel = () => {
    if (userId) {
      const { name, email, role, status, picture, ...rest } = usersFilteredQuery.data;
      setImages([picture]);
      setAddressList(addressQuery.data);
      form.setFieldsValue({
        name,
        email,
        role,
        status,
      });
    } else {
      form.resetFields();
    }
  };
  const handleUpdate = async (values) => {
    try {
      const { name, email, role, status } = values;
      const productUpdatedResData = await updateUser({
        userId: userId,
        initdata: {
          name,
          email,
          role,
          status,
        },
      }).unwrap();

      notification.success({ message: "Cập nhật người dùng thành công" });
      navigate("/admin/users", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = () => {
    let secondsToGo = 5;
    const modal = Modal.confirm({
      title: (
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 280, margin: 0 }}>
          Bạn chắc chắc muốn xóa người dùng <b>{userId}</b> ?
        </Typography.Paragraph>
      ),
      icon: null,
      content: null,
      okText: "Xác nhận",
      cancelText: "Hủy",
      cancelButtonProps: { size: "large" },
      okButtonProps: { size: "large", danger: true, icon: <BsTrash /> },
      onOk: async () => {
        try {
          const productUpdatedResData = await updateUser({
            userId: userId,
            initdata: {
              status: "deleted",
            },
          }).unwrap();
          notification.error({ message: "Xóa người dùng thành công" });
          navigate("/admin/users", { replace: true });
        } catch (err) {
          console.log("err", err);
        }
      },
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      modal.update({
        content: (
          <>
            This modal will be destroyed after {secondsToGo} second.
            <Progress
              status="active"
              strokeColor={{
                from: "#f5222d",
                to: "#ff7a45",
              }}
              percent={(secondsToGo / 5) * 100}
              showInfo={false}
            />
          </>
        ),
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000 - 1);
  };
  //
  const handleAddAddress = async (values) => {

  };
  const handleUpdateAddress = async (address, values) => {
    try {
 
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleDeleteAddress = async (address) => {
    try {

    } catch (err) {
      console.log("err", err);
    }
  };
  const handleCancelUpdateAddress = () => {
    if (selectedAddress) {
      formAddAddress.setFieldsValue(selectedAddress);
    } else {
      formAddAddress.resetFields();
    }
  };
  //
  const handleSelectImages = (value) => {
    console.log("handleSelectImages ~ value", value);
  };
  const handleDeselectImage = (value) => {
    setImages([]);
  };

  const handleURLUpload = async ({ imageUrl }) => {
    try {
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleFileUploadAndResize = ({ file, fileList }) => {};
  const handleImageRemove = async () => {
    try {
      const productUpdatedResData = await updateUser({
        userId: userId,
        initdata: {
          picture: "",
        },
      }).unwrap();
      setImages([]);
      form.setFieldsValue({
        images: [],
      });
      notification.error({ message: "Xóa ảnh thành công" });
    } catch (err) {
      console.log("err", err);
    }
  };
  return (
    <AdminLayout>
      <ContentWrapper>
        <Form
          form={form}
          disabled={(userId && !getUsersSuccess) || updateUserLoading || deleteProductLoading}
          id="form"
          name="form"
          layout="vertical"
          autoComplete="off"
          requiredMark={false}
          size="large"
          onFinish={handleUpdate}
          validateMessages={validateMessages}
        >
          <Row gutter={24} wrap={false}>
            <Col flex="auto" className="form-left-wrapper">
              <Card title="Chi tiết người dùng" loading={userId && !getUsersSuccess}>
                <Form.Item name="name" label={"Tên người dùng"} rules={[{ required: true }]}>
                  <Input placeholder="Nhập tên tên người dùng..." />
                </Form.Item>
                <Form.Item name="email" label={"Địa chỉ email"} rules={[{ required: true }]}>
                  <Input placeholder="Nhập địa chỉ email..." />
                </Form.Item>
              </Card>

              <Card
                title={`Địa chỉ · ${variantList?.length || 0}`}
                loading={userId && !getUsersSuccess}
              >
                {variantList.length > 0 && (
                  <List
                    dataSource={variantList}
                    rowKey={(item) => item._id}
                    itemLayout="horizontal"
                    renderItem={(item) => (
                      <VariantItemWrapper>
                        <div className="container">
                          <div className="content-wrapper">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Số điện thoại" span={1}>
                                {item.phoneNo}
                              </Descriptions.Item>
                              <Descriptions.Item label="Địa chỉ" span={1}>
                                {item.address}
                              </Descriptions.Item>
                              <Descriptions.Item label="Mã vùng" span={1}>
                                {item.postalCode}
                              </Descriptions.Item>
                            </Descriptions>
                          </div>
                        </div>
                        <div className="actions">
                          <Button
                            disabled={addAddressVisible}
                            icon={<BsPencil />}
                            shape="circle"
                            type="dashed"
                            onClick={() => {
                              setSelectedAddress(item);
                              formAddAddress.setFieldsValue(item);
                              setAddAddressVisible(true);
                            }}
                          ></Button>
                          <Popconfirm
                            title={
                              <Typography.Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{ maxWidth: 280, margin: 0 }}
                              >
                                Bạn chắc chắc muốn xóa <b>{item._id}</b>?
                              </Typography.Paragraph>
                            }
                            placement="bottomRight"
                            okText={<BsCheckLg />}
                            cancelText={<BsXLg />}
                            onConfirm={() => handleDeleteAddress(item)}
                          >
                            <Button
                              disabled={addAddressVisible}
                              shape="circle"
                              type="dashed"
                              icon={<AiOutlineMinus />}
                            ></Button>
                          </Popconfirm>
                        </div>
                      </VariantItemWrapper>
                    )}
                  />
                )}
                <Button
                  htmlType="button"
                  type="dashed"
                  onClick={() => {
                    formAddAddress.resetFields();
                    setSelectedAddress(null);
                    setAddAddressVisible(true);
                  }}
                  disabled={addAddressVisible}
                  size="large"
                  block
                  icon={<AiOutlinePlusCircle />}
                >
                  Thêm Địa chỉ
                </Button>
              </Card>
            </Col>
            <Col flex="400px" className="form-right-wrapper">
              <Card title={<BsSliders />} loading={userId && !getUsersSuccess}>
                <Form.Item name="status" label={"Trạng thái"} rules={[{ required: true }]}>
                  <Select placeholder="Chọn trạng thái" optionLabelProp="value">
                    <Select.Option key={1} value={"active"}>
                      <Space align="center" style={{ height: "100%" }} wrap={false}>
                        <Typography.Text ellipsis>{"Active"}</Typography.Text>
                      </Space>
                    </Select.Option>
                    <Select.Option key={2} value={"inactive"}>
                      <Space align="center" style={{ height: "100%" }} wrap={false}>
                        <Typography.Text ellipsis>{"InActive"}</Typography.Text>
                      </Space>
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="role" label={"Vai trò"} rules={[{ required: true }]}>
                  <Select placeholder="Chọn vai trò" optionLabelProp="value">
                    <Select.Option key={1} value={"user"}>
                      <Space align="center" style={{ height: "100%" }} wrap={false}>
                        <Typography.Text ellipsis>User</Typography.Text>
                      </Space>
                    </Select.Option>
                    <Select.Option key={2} value={"admin"}>
                      <Space align="center" style={{ height: "100%" }} wrap={false}>
                        <Typography.Text ellipsis>Admin</Typography.Text>
                      </Space>
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Card>
              <Card loading={userId && !getUsersSuccess} title={`Ảnh đại diện`}>
                <Form.Item name="images" noStyle>
                  <Upload.Dragger
                    accept="image/*"
                    disabled={true}
                    multiple={false}
                    listType="picture-card"
                    id="images"
                    fileList={[]}
                    beforeUpload={() => false}
                    onChange={handleFileUploadAndResize}
                    onRemove={(file) => handleImageRemove(file)}
                  >
                    {true ? (
                      <div className="ant-upload-drag-content">
                        <Spin size="large" indicator={<LogoCube loading size={28} />} />
                        <p className="ant-upload-text">Loading...</p>
                      </div>
                    ) : (
                      <>
                        <div className="ant-upload-drag-icon">
                          <AiOutlineInbox size={45} />
                        </div>
                        <p className="ant-upload-text">Thả file ảnh vào đây để thêm mới</p>
                      </>
                    )}
                  </Upload.Dragger>
                </Form.Item>
                {images.length > 0 && (
                  <MasonryLayout columns={3} gap={24}>
                    {images.map((item, index) => (
                      <div className="preview-wrapper" key={index}>
                        <div className="actions">
                          <Button
                            shape="circle"
                            type="dashed"
                            icon={<AiOutlineMinus />}
                            onClick={() => handleDeselectImage}
                          ></Button>
                        </div>
                        <Image
                          src={item}
                          fallback={NOT_FOUND_IMG}
                          preview={{
                            visible: previewVisible,
                            onVisibleChange: (value) => {
                              setPreviewVisible(value);
                            },
                            src: previewImage || NOT_FOUND_IMG,
                            mask: (
                              <Space size={16} style={{ zIndex: 10 }}>
                                <Tooltip title="Xem ảnh" color={"#434343"}>
                                  <Button
                                    type="dashed"
                                    ghost
                                    shape="circle"
                                    size="large"
                                    icon={<BsEye />}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setPreviewVisible(true);
                                      setPreviewImage(item);
                                    }}
                                  ></Button>
                                </Tooltip>
                                <Tooltip title="Xóa ảnh" color={"#434343"}>
                                  <Button
                                    type="dashed"
                                    shape="circle"
                                    ghost
                                    size="large"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setPreviewVisible(false);
                                      setPreviewImage(null);
                                      handleImageRemove(item);
                                    }}
                                    disabled={true}
                                    icon={<BsTrash />}
                                  ></Button>
                                </Tooltip>
                              </Space>
                            ),
                          }}
                        ></Image>
                      </div>
                    ))}
                  </MasonryLayout>
                )}
              </Card>
              {userId && (
                <div className="extra-actions">
                  <Alert
                    message={"Xóa người dùng"}
                    description={null}
                    type="error"
                    action={
                      <Button
                        type="dashed"
                        danger
                        htmlType="button"
                        onClick={handleDeleteUser}
                        icon={<BsTrash />}
                      >
                        Xóa
                      </Button>
                    }
                  />
                </div>
              )}
            </Col>
          </Row>
          <div className="content-footer-fixed">
            <Space split={<Divider type="vertical" />}>
              <Button
                type="text"
                htmlType="button"
                extraType="btndanger"
                className="btndanger"
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <Form.Item noStyle shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!!form.getFieldsError().filter(({ errors }) => errors.length).length}
                  >
                    {userId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                  </Button>
                )}
              </Form.Item>
            </Space>
          </div>
        </Form>
      </ContentWrapper>
      <Drawer
        closeIcon={<BsArrowLeft size={20} />}
        visible={addAddressVisible}
        width={500}
        onClose={() => {
          formAddAddress.resetFields();
          setSelectedAddress(null);
          setAddAddressVisible(false);
        }}
        title={selectedAddress?._id ? `Địa chỉ · ${selectedAddress._id}` : "Địa chỉ"}
        footerStyle={{
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "nowrap",
          padding: "10px 24px",
        }}
        // getContainer={false}
        className="hide-scrollbar"
        extra={
          selectedAddress ? (
            <Popconfirm
              title={
                <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 280, margin: 0 }}>
                  Bạn chắc chắc muốn xóa {selectedAddress?._id ? <b>{selectedAddress._id}</b> : ""}?
                </Typography.Paragraph>
              }
              placement="bottomRight"
              okText={<BsCheckLg />}
              cancelText={<BsXLg />}
              onConfirm={() => handleDeleteAddress(selectedAddress)}
            >
              <Button
                disabled={selectedAddress == null}
                type="text"
                extraType="btndanger"
                className="btndanger"
              >
                Xóa
              </Button>
            </Popconfirm>
          ) : null
        }
        footer={
          <Space split={<Divider type="vertical" />}>
            <Button
              type="text"
              form="formAddAddress"
              htmlType="button"
              extraType="btndanger"
              className="btndanger"
              onClick={handleCancelUpdateAddress}
              disabled={true}
            >
              Hủy
            </Button>
            <Button
              form="formAddAddress"
              type="primary"
              htmlType="submit"
              loading={true}
              disabled={true}
            >
              {!!selectedAddress ? "Cập nhật Địa chỉ" : "Thêm Địa chỉ"}
            </Button>
          </Space>
        }
      >
        <Form
          id="formAddAddress"
          name="variantForm"
          form={formAddAddress}
          layout="vertical"
          autoComplete="off"
          requiredMark={false}
          size="large"
          onFinish={(values) =>
            !!selectedAddress
              ? handleUpdateAddress(selectedAddress, values)
              : handleAddAddress(values)
          }
          validateMessages={validateMessages}
        >
          <Form.Item label="Số điện thoại" rules={[{ required: true }]} name="phoneNo">
            <Input autoFocus style={{ width: "100%" }} placeholder={`Nhập số điện thoại...`} />
          </Form.Item>
          <Form.Item label="Địa chỉ" rules={[{ required: true }]} name="address">
            <Input autoFocus style={{ width: "100%" }} placeholder={`Nhập số địa chỉ...`} />
          </Form.Item>
          <Form.Item label="Mã vùng" rules={[{ required: true }]} name="postalCode">
            <Input autoFocus style={{ width: "100%" }} placeholder={`Nhập số mã vùng...`} />
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        // getContainer={false}
        title={"Đường dẫn ảnh"}
        visible={imageUrlVisible}
        okText="Tải lên"
        cancelText="Hủy"
        onCancel={() => {
          formImageUrl.resetFields();
          setImageUrlVisible(false);
        }}
        okButtonProps={{
          loading: true,
          disabled: !imageUrl || imageUrl === NOT_FOUND_IMG,
          icon: <BsUpload />,
        }}
        onOk={() => {
          formImageUrl
            .validateFields()
            .then(({ imageUrl }) => {
              formImageUrl.resetFields();
              handleURLUpload({ imageUrl });
            })
            .catch((err) => {
              console.log("Validate Failed:", err);
            });
        }}
      >
        <Row gutter={[24, 24]} wrap={false}>
          <Col flex="124px">
            <Image
              src={imageUrl}
              width="100%"
              height={100}
              fallback={NOT_FOUND_IMG}
              onError={(e) => formImageUrl.resetFields()}
            />
          </Col>
          <Col flex="auto" className="hide-error">
            <Form form={formImageUrl} id="formImageUrl" name="formImageUrl" layout="vertical">
              <Form.Item initialValue="" name="imageUrl" rules={[{ type: "url" }]}>
                <Input.TextArea
                  rows={4}
                  autoSize={{ minRows: 4, maxRows: 4 }}
                  placeholder="Nhập đường dẫn ảnh..."
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </AdminLayout>
  );
};

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  margin-bottom: 68px;
  & .content-top {
    margin-bottom: 24px;
  }
  & .content-middle {
    background: #fff;
    padding: 24px;
  }
  & .form-left-wrapper,
  .form-right-wrapper {
    gap: 24px;
    display: flex;
    flex-direction: column;
  }
  & .content-footer-fixed {
    background: #fff;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    z-index: 1;
    background-color: #fff;
    box-shadow: 0px -1px 4px 0px rgba(153, 153, 153, 0.5);
    padding: 8px 24px;
  }
  & .ant-upload-drag-content p {
    margin-top: 12px !important;
  }
  & .vl {
    border-left: 2px solid #999;
    max-height: 500px;
    height: 100%;
  }
  & .preview-wrapper {
    position: relative;
    & .actions {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
      z-index: 1;
    }
  }
  & .extra-actions {
    padding-top: 24px;
    border-top: 1px solid #d9d9d9;
    & button {
      background-color: transparent;
    }
  }
`;

const FloatingWrapper = styled.div``;
const VariantItemWrapper = styled.div`
  position: relative;
  background: #fff;
  border: 1px solid #eee;
  margin-bottom: 24px;
  & .container {
    padding: 12px;
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
  }
  & .image-wrapper {
    flex-shrink: 0;
    width: 160px;
    height: 90px;
    & img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  & .content-wrapper {
    padding-left: 12px;
    border-left: 1px solid #eee;
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
  }
  & .actions {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(16px, -50%);
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
  }
`;

export default ProductCreateUpdateDetailPage;
