import {
  Badge,
  Cascader,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BsArrowLeft, BsPlusCircle, BsPlusCircleDotted } from "react-icons/bs";
import { useAuth } from "src/common/useAuth";
import { findImageById, vietnameseSlug } from "src/common/utils";
import {
  useAddToMyAddressListMutation,
  useGetMyAddressListQuery,
  useUpdateMyAddressMutation,
} from "src/stores/address/address.query";
import { useGetAllProvincesDistrictsQuery } from "src/stores/address/cascades.query";

import styled from "styled-components";
import Button from "../button/Button";
const validateMessages = {
  required: "Trường này chưa nhập giá trị!",
  // ...
};

const filter = (inputValue, path) =>
  path.some(
    (option) => vietnameseSlug(option.label, " ").indexOf(vietnameseSlug(inputValue, " ")) > -1
  );

const UpdateAddressDrawer = ({
  selectedInitAddress = "",
  updateAddressVisible = false,
  setUpdateAddressVisible,
}) => {
  const [formChangeAddress] = Form.useForm();
  const { user, refetchCurrentUser, message401 } = useAuth();
  const { data: getMyAddressListQuery, isSuccess: getMyAddressListSuccess } =
    useGetMyAddressListQuery({}, { skip: !updateAddressVisible });
  const { data: getAllProvincesDistrictsQuery, isSuccess: getAllProvincesDistrictsSuccess } =
    useGetAllProvincesDistrictsQuery({}, { skip: !updateAddressVisible });
  const [addToMyAddressList, { data: createAddressData, isLoading: createAddressLoading }] =
    useAddToMyAddressListMutation();
  const [updateMyAddress, { data: updateAddressData, isLoading: updateAddressLoading }] =
    useUpdateMyAddressMutation();
  const myAddressList = getMyAddressListSuccess ? getMyAddressListQuery?.data : [];
  const allProvincesDistrictsDataMapped = getAllProvincesDistrictsSuccess
    ? getAllProvincesDistrictsQuery.map((p) => ({
        disabled: ![1, 79].includes(p.code),
        label: p.name,
        value: p.name,
        children: p.districts.map((d) => ({
          value: d.name,
          label: d.name,
        })),
      }))
    : [];
  const [selectedAddress, setSelectedAddress] = useState(null);
  useEffect(() => {
    if (selectedInitAddress) {
      const foundAddress = findImageById(selectedInitAddress, myAddressList);
      if (foundAddress) {
        setSelectedAddress(selectedInitAddress);
        formChangeAddress.setFieldsValue({
          name: foundAddress.name,
          phoneNo: foundAddress.phoneNo,
          address: foundAddress.address,
          addressArea: [foundAddress.city, foundAddress.area],
          postalCode: foundAddress.postalCode,
        });
      }
    } else {
      setSelectedAddress(null);
      formChangeAddress.resetFields();
    }
  }, [selectedInitAddress, myAddressList]);

  useEffect(() => {
    if (selectedAddress) {
      const foundAddress = findImageById(selectedAddress, myAddressList);
      if (foundAddress) {
        formChangeAddress.setFieldsValue({
          name: foundAddress.name,
          phoneNo: foundAddress.phoneNo,
          address: foundAddress.address,
          addressArea: [foundAddress.city, foundAddress.area],
          postalCode: foundAddress.postalCode,
        });
      }
    } else {
      setSelectedAddress(null);
      formChangeAddress.resetFields();
    }
  }, [selectedAddress, myAddressList]);

  const handleUpdateAddress = async (addressId, values) => {
    try {
      const { addressArea, ...rest } = values;
      message.loading("Đang xử lý...", 3);
      const updatedAddressRes = await updateMyAddress({
        addressId,
        initdata: {
          ...rest,
          city: addressArea[0],
          area: addressArea[1],
          country: "Vietnam",
        },
      }).unwrap();
      message.success("Cập nhật địa chỉ thành công");
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleAddAddress = async (values) => {
    try {
      const { addressArea, ...rest } = values;
      message.loading("Đang xử lý...", 3);
      const updatedAddressRes = await addToMyAddressList({
        ...rest,
        city: addressArea[0],
        area: addressArea[1],
        country: "Vietnam",
      }).unwrap();
      message.success("Thêm địa chỉ thành công");
      refetchCurrentUser();
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleCancelUpdateAddress = (selectedAddress) => {
    if (selectedAddress) {
      const foundAddress = findImageById(selectedAddress, myAddressList);
      if (foundAddress) {
        formChangeAddress.setFieldsValue({
          name: foundAddress.name,
          phoneNo: foundAddress.phoneNo,
          address: foundAddress.address,
          addressArea: [foundAddress.city, foundAddress.area],
          postalCode: foundAddress.postalCode,
        });
      } else {
        formChangeAddress.resetFields();
        setUpdateAddressVisible(false);
      }
    } else {
      formChangeAddress.resetFields();
      setUpdateAddressVisible(false);
    }
  };

  const handleSelectAddress = (value, option) => {
    setSelectedAddress(value);
  };
  const handleAddClick = () => {
    setSelectedAddress(null);
    formChangeAddress.resetFields();
  };

  return (
    <Drawer
      closeIcon={<BsArrowLeft size={20} />}
      visible={updateAddressVisible}
      width={500}
      destroyOnClose
      onClose={() => {
        setUpdateAddressVisible(false);
      }}
      title={selectedAddress ? `Địa chỉ · ${selectedAddress}` : "Địa chỉ"}
      footerStyle={{
        display: "flex",
        justifyContent: "flex-end",
        flexWrap: "nowrap",
        padding: "10px 24px",
      }}
      getContainer={false}
      className="hide-scrollbar"
      footer={
        <Space split={<Divider type="vertical" />}>
          <Button
            type="text"
            form="formChangeAddress"
            htmlType="button"
            extraType="btndanger"
            className="btndanger"
            onClick={() => handleCancelUpdateAddress(selectedAddress)}
            disabled={createAddressLoading || updateAddressLoading}
          >
            Hủy
          </Button>
          <Button
            form="formChangeAddress"
            type="primary"
            htmlType="submit"
            loading={createAddressLoading || updateAddressLoading}
            disabled={createAddressLoading || updateAddressLoading}
          >
            {!!selectedAddress ? "Cập nhật Địa chỉ" : "Thêm Địa chỉ"}
          </Button>
        </Space>
      }
    >
      <BodyDrawerWrapper>
        <Typography.Text style={{ marginBottom: 8 }}>Chọn hoặc thêm địa chỉ mới</Typography.Text>
        <Select
          placeholder="Chọn địa chỉ..."
          size="large"
          value={selectedAddress || "Thêm địa chỉ"}
          defaultValue={user?.defaultAddress}
          onSelect={handleSelectAddress}
          style={{ width: "100%" }}
          optionLabelProp="children"
          dropdownRender={(menu) => (
            <>
              {menu}
              <FooterSelectWrapper>
                <Divider plain orientation="left" style={{ margin: "8px 0" }}>
                  Hoặc
                </Divider>
                <Button
                  type="dashed"
                  icon={<BsPlusCircle />}
                  block
                  size="large"
                  onClick={handleAddClick}
                >
                  Thêm địa chỉ
                </Button>
              </FooterSelectWrapper>
            </>
          )}
        >
          {myAddressList.map((item) => (
            <Select.Option value={item._id} key={item._id}>
              <Badge
                status={user?.defaultAddress === item._id ? "success" : "default"}
                text={
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Space size={0} wrap={false} split={<Divider type="vertical" />}>
                      <Typography.Text ellipsis>{item.name}</Typography.Text>
                      <Typography.Text ellipsis>{item.phoneNo}</Typography.Text>
                      <Typography.Text ellipsis>{item.area}</Typography.Text>
                      <Typography.Text ellipsis>{item.city}</Typography.Text>
                      <Typography.Text ellipsis>{item.postalCode}</Typography.Text>
                    </Space>
                    <Typography.Text ellipsis>{item.address}</Typography.Text>
                  </Space>
                }
              />
            </Select.Option>
          ))}
        </Select>
        <Divider plain style={{ margin: "24px 0 8px 0" }} />
        <Form
          id="formChangeAddress"
          name="changeAddressForm"
          form={formChangeAddress}
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
          <Form.Item label="Tên người nhận" rules={[{ required: true }]} name="name">
            <Input placeholder={`Nhập tên của bạn...`} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            rules={[
              { required: true },
              {
                pattern: new RegExp(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/),
                message: "Số điện thoại chưa đúng định dạng",
              },
            ]}
            name="phoneNo"
          >
            <Input type="tel" placeholder={`Nhập số điện thoại...`} />
          </Form.Item>
          <Form.Item
            label="Thành phố,Tỉnh/Quận,Huyện"
            rules={[{ required: true, type: "array" }]}
            name="addressArea"
          >
            <Cascader
              options={allProvincesDistrictsDataMapped}
              placeholder={`Chọn khu vực...`}
              showSearch={{
                filter,
              }}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ" rules={[{ required: true }]} name="address">
            <Input.TextArea
              rows={4}
              showCount
              autoSize={{ minRows: 4, maxRows: 4 }}
              placeholder="Nhập địa chỉ..."
            />
          </Form.Item>
          <Form.Item
            label="Mã vùng"
            name="postalCode"
            rules={[
              {
                required: true,
              },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (isNaN(value)) {
                    return Promise.reject("Mã vùng là một số.");
                  }
                  if (String(value).length !== 5) {
                    return Promise.reject("Số kí tự mã vùng lớn hơn hoặc bằng 5");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder={`Nhập mã vùng...`} />
          </Form.Item>
        </Form>
      </BodyDrawerWrapper>
    </Drawer>
  );
};

const BodyDrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterSelectWrapper = styled.div`
  padding: 0 4px;
`;

export default UpdateAddressDrawer;
