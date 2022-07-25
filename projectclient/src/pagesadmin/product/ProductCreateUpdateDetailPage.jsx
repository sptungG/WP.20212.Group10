import {
  Alert,
  Anchor,
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
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
  Statistic,
  Switch,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { AiOutlineInbox, AiOutlineMinus, AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import Button from "src/components/button/Button";
import AdminLayout from "src/layout/AdminLayout";
import Resizer from "react-image-file-resizer";
import styled from "styled-components";
import LogoCube from "src/components/nav/LogoCube";
import {
  BsArrowBarLeft,
  BsArrowLeft,
  BsBoxSeam,
  BsCartCheck,
  BsCheckLg,
  BsEye,
  BsPencil,
  BsSliders,
  BsTrash,
  BsUpload,
  BsXLg,
} from "react-icons/bs";
import { NOT_FOUND_IMG } from "src/common/constant";
import MasonryLayout from "src/components/images/MasonryLayout";
import { useDebounce } from "src/common/useDebounce";
import TextEditor from "src/components/form/TextEditor";
import { useGetAllCategoriesFilteredQuery } from "src/stores/category/category.query";
import { checkValidColor, vietnameseSlug } from "src/common/utils";
import lodash from "lodash";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useCreateVariantMutation,
  useDeleteVariantMutation,
  useUpdateVariantMutation,
} from "src/stores/product/product.query";

import {
  useCreateContentMutation,
  useUpdateContentByIdMutation,
} from "src/stores/content/content.query";
import {
  useGetImagesFilteredQuery,
  useRemoveAdminImageMutation,
  useUploadAdminImageMutation,
} from "src/stores/image/image.query";
import MdEditor from "src/components/form/MdEditor";

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
  const [formAddVariant] = Form.useForm();
  let navigate = useNavigate();
  const { productId } = useParams();
  const [images, setImages] = useState([]);
  const [imageUrlVisible, setImageUrlVisible] = useState(false);
  const [addVariantVisible, setAddVariantVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [variantList, setVariantList] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { data: categoriesFilteredQuery, isSuccess: getCategoriesSuccess } =
    useGetAllCategoriesFilteredQuery({ sort: "", keyword: "" });
  const {
    data: productQuery,
    isSuccess: getProductSuccess,
    refetch: productQueryRefetch,
  } = useGetProductQuery(productId, {
    skip: !productId,
  });
  const { data: imagesFilteredQuery, isSuccess: imagesFilteredSuccess } = useGetImagesFilteredQuery(
    { onModel: "Product", sort: "", status: "" }
  );
  const [createProduct, { data: createProductData, isLoading: createProductLoading }] =
    useCreateProductMutation();
  const [updateProduct, { data: updateProductData, isLoading: updateProductLoading }] =
    useUpdateProductMutation();
  const [deleteProduct, { data: deleteProductData, isLoading: deleteProductLoading }] =
    useDeleteProductMutation();
  const [createVariant, { data: createVariantData, isLoading: createVariantLoading }] =
    useCreateVariantMutation();
  const [updateVariant, { data: updateVariantData, isLoading: updateVariantLoading }] =
    useUpdateVariantMutation();
  const [deleteVariant, { data: deleteVariantData, isLoading: deleteVariantLoading }] =
    useDeleteVariantMutation();
  const [createContent, { data: createContentData, isLoading: createContentLoading }] =
    useCreateContentMutation();
  const [updateContentById, { data: updateContentData, isLoading: updateContentLoading }] =
    useUpdateContentByIdMutation();
  const [uploadAdminImage, { data: uploadAdminImageData, isLoading: uploadAdminImageLoading }] =
    useUploadAdminImageMutation();
  const [removeAdminImage, { data: removeAdminImageData, isLoading: removeAdminImageLoading }] =
    useRemoveAdminImageMutation();
  const imageUrl = Form.useWatch("imageUrl", formImageUrl);
  const foundVariantImage = (imageId) => imageId && images.find((img) => img._id === imageId);

  useEffect(() => {
    if (getProductSuccess) {
      const {
        name,
        desc,
        price,
        images,
        brand,
        category,
        content: productContent,
        variants,
        combos,
        wishlist,
        ...rest
      } = productQuery.data;
      setImages(images);
      setVariantList(variants);
      form.setFieldsValue({
        name,
        desc,
        price,
        images,
        brand,
        category: category?._id || null,
        contentTitle: productContent?.title || "",
        contentValue: productContent?.content || "",
      });
    }
  }, [productId, productQuery, getProductSuccess]);

  const handleCancel = () => {
    if (productId) {
      const {
        name,
        desc,
        price,
        images,
        brand,
        category,
        content: productContent,
        variants,
        combos,
        wishlist,
        ...rest
      } = productQuery.data;
      setImages(images);
      setVariantList(variants);
      form.setFieldsValue({
        name,
        desc,
        price,
        images,
        brand,
        category: category?._id || null,
        contentTitle: productContent?.title || "",
        contentValue: productContent?.content || "",
      });
    } else {
      form.resetFields();
    }
  };
  const handleUpdate = async (values) => {
    try {
      const { name, desc, price, images, brand, category, contentTitle, contentValue, variants } =
        values;
      const productUpdatedResData = await updateProduct({
        id: productId,
        initdata: {
          name,
          desc,
          price,
          images,
          brand,
          category,
        },
      }).unwrap();
      const contentCreatedResData = await updateContentById({
        contentId: productUpdatedResData.data.content,
        initdata: {
          title: contentTitle,
          content: contentValue,
          onModel: "Product",
          modelId: productId,
        },
      });
      notification.success({ message: "Cập nhật sản phẩm thành công" });
      navigate("/admin/products", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  const handleCreate = async (values) => {
    try {
      const { name, desc, price, images, brand, category, contentTitle, contentValue } = values;
      const productCreatedResData = await createProduct({
        name,
        desc,
        price,
        images,
        brand,
        category,
      }).unwrap();
      const contentCreatedResData = await createContent({
        title: contentTitle,
        content: contentValue,
        onModel: "Product",
        modelId: productCreatedResData.data._id,
      });
      const variantsCreatedResData = await Promise.all(
        variantList.map(
          async (v) =>
            await createVariant({ productId: productCreatedResData.data._id, initdata: v }).unwrap()
        )
      );
      form.resetFields();
      setImages([]);
      notification.success({ message: "Thêm sản phẩm thành công" });
      navigate("/admin/products", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteProduct = () => {
    let secondsToGo = 5;
    const modal = Modal.confirm({
      title: (
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 280, margin: 0 }}>
          Bạn chắc chắc muốn xóa sản phẩm <b>{productId}</b> ?
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
          const deletedProduct = await deleteProduct(productId).unwrap();
          notification.info({ message: "Xóa sản phẩm thành công" });
          navigate("/admin/products", { replace: true });
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
  const handleAddVariant = async (values) => {
    if (productId) {
      const addedVariant = await createVariant({
        productId: productId,
        initdata: values,
      }).unwrap();
      setVariantList([...variantList, addedVariant?.data]);
    } else {
      setVariantList([...variantList, { _id: Date.now(), ...values }]);
    }
    formAddVariant.resetFields();
    setSelectedVariant(null);
    setAddVariantVisible(false);
    notification.success({ message: "Thêm phiên bản thành công" });
  };
  const handleUpdateVariant = async ({ _id = null }, values) => {
    try {
      if (productId) {
        const updatedVariant = await updateVariant({
          variantId: _id,
          initdata: values,
        }).unwrap();
      }
      const newList = variantList.map((v) => {
        if (v._id === _id) return { ...v, ...values };
        return v;
      });
      setVariantList(newList);
      formAddVariant.resetFields();
      setSelectedVariant(null);
      setAddVariantVisible(false);
      notification.success({ message: "Cập nhật phiên bản thành công" });
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleDeleteVariant = async ({ _id = null }) => {
    try {
      const newList = variantList.filter((v) => v._id !== _id);
      if (productId) {
        const deletedVariant = await deleteVariant(_id).unwrap();
      }
      setVariantList(newList);
      formAddVariant.resetFields();
      setSelectedVariant(null);
      setAddVariantVisible(false);
      notification.info({ message: "Xóa phiên bản thành công" });
    } catch (err) {
      console.log("err", err);
    }
  };
  const handleCancelUpdateVariant = () => {
    if (selectedVariant) {
      formAddVariant.setFieldsValue(selectedVariant);
    } else {
      formAddVariant.resetFields();
    }
  };
  //
  const handleSelectImages = (value) => {
    const mappedValue = imagesFilteredQuery?.data.find((img) => img._id === value);
    const newImages = lodash.uniqBy([...images, mappedValue], "_id");
    setImages(newImages);
    form.setFieldsValue({ images: newImages });
  };
  const handleDeselectImage = (value) => {
    const filteredImages = images.filter((item) => item._id !== value);
    setImages(filteredImages);
    const newVariantList =
      variantList?.map((v) => ({
        ...v,
        image: filteredImages[0]?._id || undefined,
      })) || [];
    setVariantList(newVariantList);
    form.setFieldsValue({
      images: filteredImages,
    });
  };

  const handleURLUpload = async ({ imageUrl }) => {
    try {
      if (!imageUrl) throw new Error("Url ảnh không được trống");
      let allUploadedFiles = images;
      setImageUrlVisible(false);
      const uploadResData = await uploadAdminImage({
        onModel: "Product",
        imageUrl: imageUrl,
        image: "",
      }).unwrap();
      allUploadedFiles.push({ ...uploadResData.data, uid: uploadResData.data._id });
      setImages([...allUploadedFiles]);
      form.setFieldsValue({ images: allUploadedFiles });
      notification.success({ message: "Tải lên thành công" });
    } catch (err) {
      notification.error({ message: "Đã có lỗi xảy ra khi tải lên" });
      console.log("err", err);
    }
  };
  const handleFileUploadAndResize = ({ file, fileList }) => {
    if (file.status !== "removed") {
      let allUploadedFiles = images;
      if (fileList.length > 0) {
        Resizer.imageFileResizer(
          file,
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            uploadAdminImage({ onModel: "Product", image: uri, imageUrl: "" })
              .then(({ data: uploadResData }) => {
                if (uploadResData) {
                  allUploadedFiles.push({ ...uploadResData.data, uid: uploadResData.data._id });
                  setImages([...allUploadedFiles]);
                  form.setFieldsValue({ images: allUploadedFiles });
                  notification.success({ message: "Tải lên thành công" });
                }
              })
              .catch((err) => {
                notification.error({ message: "Đã có lỗi xảy ra khi tải lên" });
                console.log("err", err);
              });
          },
          "base64"
        );
      }
    }
  };
  const handleImageRemove = async ({ _id: imageId }) => {
    try {
      if (images.length > 1) {
        const removedImage = await removeAdminImage({ imageId }).unwrap();
        const filteredImages = images.filter((item) => item._id !== imageId);
        setImages(filteredImages);
        const newVariantList =
          variantList?.map((v) => {
            if (v.image === imageId)
              return {
                ...v,
                image: filteredImages[0]?._id || undefined,
              };
            return v;
          }) || [];
        setVariantList(newVariantList);
        if (productId) {
          const variantsUpdatedResData = await Promise.all(
            newVariantList.map(
              async ({ _id, image }) =>
                await updateVariant({ variantId: _id, initdata: { image } }).unwrap()
            )
          );
        }
        form.setFieldsValue({
          images: filteredImages,
        });
        notification.info({ message: "Xóa ảnh thành công" });
      } else {
        notification.error({ message: "Sản phẩm chỉ còn 1 ảnh" });
      }
    } catch (err) {
      notification.error({ message: "Đã có lỗi xảy ra khi xóa ảnh" });
      console.log("err", err);
    }
  };
  const handleVariantImageError = (e) => {};
  return (
    <AdminLayout>
      <ContentWrapper>
        <Form
          form={form}
          disabled={
            (productId && !getProductSuccess) ||
            createProductLoading ||
            updateProductLoading ||
            deleteProductLoading
          }
          id="form"
          name="form"
          layout="vertical"
          autoComplete="off"
          requiredMark={false}
          size="large"
          onFinish={productId ? handleUpdate : handleCreate}
          validateMessages={validateMessages}
        >
          <Row gutter={24} wrap={false}>
            <Col flex="auto" className="form-left-wrapper">
              <Card title="Chi tiết sản phẩm" loading={productId && !getProductSuccess}>
                <Form.Item name="name" label={"Tên sản phẩm"} rules={[{ required: true }]}>
                  <Input placeholder="Nhập tên sản phẩm..." />
                </Form.Item>
                <Form.Item name="desc" label={"Mô tả ngắn"} rules={[{ required: true }]}>
                  <Input.TextArea
                    rows={4}
                    showCount
                    autoSize={{ minRows: 4, maxRows: 4 }}
                    placeholder="Nhập mô tả sản phẩm..."
                  />
                </Form.Item>
              </Card>
              <Card title="Bài viết" loading={productId && !getProductSuccess}>
                <Form.Item name="contentTitle" rules={[{ required: true }]}>
                  <Input placeholder="Tiêu đề..." />
                </Form.Item>
                <Form.Item name="contentValue" rules={[{ required: true }]}>
                  <MdEditor placeholder="Bài viết sản phẩm..." />
                </Form.Item>
              </Card>
              <Card
                loading={productId && !getProductSuccess}
                title={`Hình ảnh · ${images.length}`}
                extra={
                  <Space split={<Divider type="vertical" />}>
                    <Form.Item noStyle>
                      <Select
                        loading={!imagesFilteredSuccess}
                        disabled={!imagesFilteredSuccess}
                        bordered={false}
                        value={null}
                        defaultValue={null}
                        placeholder="Chọn ảnh..."
                        size="small"
                        style={{
                          width: 200,
                        }}
                        showArrow
                        onSelect={handleSelectImages}
                        listHeight={250}
                      >
                        {imagesFilteredSuccess &&
                          imagesFilteredQuery?.data
                            .filter((o) => !images.find((item) => item._id === o._id))
                            .map((item) => (
                              <Select.Option key={item._id} value={item._id}>
                                <Space align="center" style={{ height: "100%" }} wrap={false}>
                                  <Avatar size="small" src={item.url}>
                                    {item._id}
                                  </Avatar>
                                  <Typography.Text ellipsis>{item._id}</Typography.Text>
                                </Space>
                              </Select.Option>
                            ))}
                      </Select>
                    </Form.Item>
                    <Space>
                      <Button
                        type="link"
                        htmlType="button"
                        onClick={() => setImageUrlVisible(true)}
                      >
                        Thêm ảnh từ URL
                      </Button>
                      <label htmlFor="images">
                        <Typography.Link>Thêm ảnh sản phẩm</Typography.Link>
                      </label>
                    </Space>
                  </Space>
                }
              >
                <Form.Item name="images" noStyle>
                  <Upload.Dragger
                    accept="image/*"
                    disabled={uploadAdminImageLoading || removeAdminImageLoading}
                    multiple={true}
                    maxCount={6}
                    listType="picture-card"
                    className={images.length > 0 ? "hidden" : ""}
                    id="images"
                    fileList={[]}
                    beforeUpload={() => false}
                    onChange={handleFileUploadAndResize}
                    onRemove={(file) => handleImageRemove(file)}
                  >
                    {uploadAdminImageLoading || removeAdminImageLoading ? (
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
                    {images.map((item) => (
                      <div className="preview-wrapper" key={item._id}>
                        <div className="actions">
                          <Button
                            shape="circle"
                            type="dashed"
                            icon={<AiOutlineMinus />}
                            onClick={() => handleDeselectImage(item._id)}
                          ></Button>
                        </div>
                        <Image
                          src={item.url}
                          fallback={NOT_FOUND_IMG}
                          preview={{
                            visible: previewVisible,
                            onVisibleChange: (value) => {
                              setPreviewVisible(value);
                            },
                            src: previewImage?.url || NOT_FOUND_IMG,
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
                                  <Popconfirm
                                    title={
                                      <Typography.Paragraph
                                        ellipsis={{ rows: 3 }}
                                        style={{ maxWidth: 280, margin: 0 }}
                                      >
                                        Bạn chắc chắc muốn xóa <b>{item._id}</b>?
                                        <br />
                                        {`(ảnh sẽ ko còn trong DB và cloud)`}
                                      </Typography.Paragraph>
                                    }
                                    placement="bottomRight"
                                    okText={<BsCheckLg />}
                                    cancelText={<BsXLg />}
                                    onConfirm={(event) => {
                                      event.stopPropagation();
                                      handleImageRemove(item);
                                    }}
                                  >
                                    <Button
                                      type="dashed"
                                      shape="circle"
                                      ghost
                                      size="large"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setPreviewVisible(false);
                                        setPreviewImage(null);
                                      }}
                                      disabled={uploadAdminImageLoading || removeAdminImageLoading}
                                      icon={<BsTrash />}
                                    ></Button>
                                  </Popconfirm>
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
              <Card
                title={`Phiên bản · ${variantList?.length || 0}`}
                loading={productId && !getProductSuccess}
              >
                {variantList.length > 0 && (
                  <List
                    dataSource={variantList}
                    rowKey={(item) => item._id}
                    itemLayout="horizontal"
                    renderItem={(item) => (
                      <VariantItemWrapper>
                        <div className="container">
                          <div className="image-wrapper">
                            <Image
                              preview={false}
                              alt={item._id}
                              src={foundVariantImage(item.image)?.url}
                              onError={handleVariantImageError}
                              fallback={NOT_FOUND_IMG}
                            />
                          </div>
                          <div className="content-wrapper">
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Giá" span={1}>
                                <Statistic
                                  suffix="$"
                                  valueStyle={{ fontSize: 14 }}
                                  value={item.price}
                                ></Statistic>
                              </Descriptions.Item>
                              <Descriptions.Item label="Đã bán" span={1}>
                                <Statistic
                                  valueStyle={{ fontSize: 14 }}
                                  value={item?.sold || 0}
                                ></Statistic>
                              </Descriptions.Item>
                              <Descriptions.Item label="Số lượng" span={1}>
                                <Statistic
                                  valueStyle={{ fontSize: 14 }}
                                  value={item.quantity}
                                ></Statistic>
                              </Descriptions.Item>
                            </Descriptions>
                            <Descriptions column={1} size="small">
                              {item.options.map((o, index) => (
                                <Descriptions.Item
                                  label={o.name}
                                  span={1}
                                  key={`variant_options_${item._id}_${index}`}
                                >
                                  <Tag
                                    color={checkValidColor(o.value) ? o.value : "default"}
                                    className={"tag"}
                                  >
                                    {o.value}
                                  </Tag>
                                </Descriptions.Item>
                              ))}
                            </Descriptions>
                          </div>
                        </div>
                        <div className="actions">
                          <Button
                            disabled={addVariantVisible}
                            icon={<BsPencil />}
                            shape="circle"
                            type="dashed"
                            onClick={() => {
                              setSelectedVariant(item);
                              formAddVariant.setFieldsValue(item);
                              setAddVariantVisible(true);
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
                            onConfirm={() => handleDeleteVariant(item)}
                          >
                            <Button
                              disabled={addVariantVisible}
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
                    formAddVariant.resetFields();
                    setSelectedVariant(null);
                    setAddVariantVisible(true);
                  }}
                  disabled={addVariantVisible}
                  size="large"
                  block
                  icon={<AiOutlinePlusCircle />}
                >
                  Thêm phiên bản
                </Button>
              </Card>
            </Col>
            <Col flex="400px" className="form-right-wrapper">
              <Card title={<BsSliders />} loading={productId && !getProductSuccess}>
                <Form.Item name="brand" label={"Thương hiệu"} rules={[{ required: true }]}>
                  <Input placeholder="Nhập thương hiệu..." />
                </Form.Item>
                <Form.Item
                  name="price"
                  label={"Giá hiển thị · USD"}
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    step={10}
                    placeholder="Nhập giá sản phẩm..."
                  />
                </Form.Item>
                <Divider />
                <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
                  <Select
                    placeholder="Chọn danh mục..."
                    showSearch
                    optionFilterProp="children"
                    onChange={(value) =>
                      form.setFieldsValue({
                        category: value,
                      })
                    }
                    filterOption={(input, option) =>
                      vietnameseSlug(option.children, " ").indexOf(vietnameseSlug(input, " ")) >= 0
                    }
                  >
                    {getCategoriesSuccess &&
                      categoriesFilteredQuery.data.map((c) => (
                        <Select.Option key={c._id} value={c._id}>
                          <Space align="center" style={{ height: "100%" }} wrap={false}>
                            <Avatar size="small" src={c.image}>
                              {c.name[0]}
                            </Avatar>
                            <Typography.Text ellipsis>{c.name}</Typography.Text>
                          </Space>
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Card>
              {productId && (
                <div className="extra-actions">
                  <Alert
                    message={"Xóa sản phẩm"}
                    description={null}
                    type="error"
                    action={
                      <Button
                        type="dashed"
                        danger
                        htmlType="button"
                        onClick={handleDeleteProduct}
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
                    {productId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                  </Button>
                )}
              </Form.Item>
            </Space>
          </div>
        </Form>
      </ContentWrapper>
      <Drawer
        closeIcon={<BsArrowLeft size={20} />}
        visible={addVariantVisible}
        width={500}
        onClose={() => {
          formAddVariant.resetFields();
          setSelectedVariant(null);
          setAddVariantVisible(false);
        }}
        title={selectedVariant?._id ? `Phiên bản · ${selectedVariant._id}` : "Phiên bản"}
        footerStyle={{
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "nowrap",
          padding: "10px 24px",
        }}
        getContainer={false}
        className="hide-scrollbar"
        extra={
          selectedVariant ? (
            <Popconfirm
              title={
                <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ maxWidth: 280, margin: 0 }}>
                  Bạn chắc chắc muốn xóa {selectedVariant?._id ? <b>{selectedVariant._id}</b> : ""}?
                </Typography.Paragraph>
              }
              placement="bottomRight"
              okText={<BsCheckLg />}
              cancelText={<BsXLg />}
              onConfirm={() => handleDeleteVariant(selectedVariant)}
            >
              <Button
                disabled={selectedVariant == null}
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
              form="formAddVariant"
              htmlType="button"
              extraType="btndanger"
              className="btndanger"
              onClick={handleCancelUpdateVariant}
              disabled={createVariantLoading || updateVariantLoading}
            >
              Hủy
            </Button>
            <Button
              form="formAddVariant"
              type="primary"
              htmlType="submit"
              loading={createVariantLoading || updateVariantLoading}
              disabled={createVariantLoading || updateVariantLoading}
            >
              {!!selectedVariant ? "Cập nhật phiên bản" : "Thêm phiên bản"}
            </Button>
          </Space>
        }
      >
        <Popover
          placement="leftTop"
          title={null}
          visible={!!selectedVariant && addVariantVisible}
          align={{ offset: [-24, -24] }}
          zIndex={1001}
          content={
            <FloatingWrapper>
              <Statistic
                title="Đã bán"
                value={selectedVariant?.sold || 0}
                prefix={<BsCartCheck />}
              />
            </FloatingWrapper>
          }
        >
          <Form
            id="formAddVariant"
            name="variantForm"
            form={formAddVariant}
            layout="vertical"
            autoComplete="off"
            requiredMark={false}
            size="large"
            onFinish={(values) =>
              !!selectedVariant
                ? handleUpdateVariant(selectedVariant, values)
                : handleAddVariant(values)
            }
            validateMessages={validateMessages}
          >
            <Form.Item label="Giá bán" rules={[{ required: true }]} name="price">
              <InputNumber
                autoFocus
                min={0}
                style={{ width: "100%" }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                step={10}
                placeholder={`Nhập giá phiên bản...`}
              />
            </Form.Item>
            <Form.Item label="Số lượng" rules={[{ required: true }]} name="quantity">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                step={1}
                placeholder={`Nhập số lượng sản phẩm...`}
              />
            </Form.Item>
            <Form.Item
              label="Hình ảnh"
              rules={[{ required: true }]}
              name="image"
              tooltip="Chọn từ hình ảnh sản phẩm"
            >
              <Select placeholder="Chọn ảnh..." optionLabelProp="value">
                {images.map((item) => (
                  <Select.Option key={item._id} value={item._id}>
                    <Space align="center" style={{ height: "100%" }} wrap={false}>
                      <Avatar size="small" src={item.url}>
                        {item._id}
                      </Avatar>
                      <Typography.Text ellipsis>{item._id}</Typography.Text>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Divider />
            <Form.List
              name="options"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      return Promise.reject(new Error("Phiên bản cần tối thiểu 1 thuộc tính"));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Form.Item
                      label={index === 0 ? `Danh sách thuộc tính · ${fields.length}` : ""}
                      required={false}
                      key={key}
                      style={{ width: "100%" }}
                    >
                      <Row
                        justify="space-between"
                        gutter={[12, 0]}
                        wrap={false}
                        className="hide-error"
                      >
                        <Col flex="auto">
                          <Row gutter={[12, 0]} wrap={false}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                validateTrigger={["onChange"]}
                                rules={[{ required: true }]}
                                name={[name, "name"]}
                              >
                                <Input
                                  autoFocus
                                  placeholder={`Nhập tên thuộc tính ${index + 1}...`}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                validateTrigger={["onChange"]}
                                rules={[{ required: true }]}
                                name={[name, "value"]}
                              >
                                <Input placeholder={`Nhập giá trị thuộc tính ${index + 1}...`} />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col flex="none">
                          {fields.length > 0 ? (
                            <Button
                              shape="circle"
                              danger
                              type="dashed"
                              icon={<AiOutlineMinus />}
                              onClick={() => remove(name)}
                            ></Button>
                          ) : null}
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  <Form.Item noStyle>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      size="large"
                      icon={<AiOutlinePlusCircle />}
                    >
                      Thêm thuộc tính
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </Popover>
      </Drawer>
      <Modal
        getContainer={false}
        title={"Đường dẫn ảnh"}
        visible={imageUrlVisible}
        okText="Tải lên"
        cancelText="Hủy"
        onCancel={() => {
          formImageUrl.resetFields();
          setImageUrlVisible(false);
        }}
        okButtonProps={{
          loading: uploadAdminImageLoading || removeAdminImageLoading,
          disabled: !imageUrl,
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
