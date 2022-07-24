import { Form, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineInbox } from "react-icons/ai";
import {
  useRemoveAdminImageMutation,
  useUploadAdminImageMutation,
} from "src/stores/image/image.query";
import Resizer from "react-image-file-resizer";

const AdminUploadImage = ({ form, imagesList = [] }) => {
  const [uploadAdminImage, { data: uploadAdminImageData, isSuccess: uploadAdminImageSuccess }] =
    useUploadAdminImageMutation();
  const [removeAdminImage, { data: removeAdminImageData, isSuccess: removeAdminImageSuccess }] =
    useRemoveAdminImageMutation();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (imagesList.length > 0) {
      setImages(imagesList);
      form.setFieldsValue({ images: imagesList });
    }
  }, [form, imagesList]);

  const handleFileUploadAndResize = ({ file, fileList }) => {
    if (file.status !== "removed") {
      if (fileList.length > 0) {
        Resizer.imageFileResizer(
          file,
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log("handleFileUploadAndResize ~ uri", uri);
            uploadAdminImage({ onModel: "Product", image: uri });
          },
          "base64"
        );
      }
    }
  };
  const handleImageRemove = (image) => {
    console.log("handleImageRemove ~ image", image);
  };

  return (
    <Form.Item name="images" noStyle>
      <Upload.Dragger
        multiple={true}
        maxCount={6}
        fileList={[...images]}
        listType="picture-card"
        beforeUpload={() => false}
        onChange={handleFileUploadAndResize}
        onRemove={(image) => handleImageRemove(image)}
      >
        <p className="ant-upload-drag-icon">
          <AiOutlineInbox size={45} />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
      </Upload.Dragger>
    </Form.Item>
  );
};

export default AdminUploadImage;
