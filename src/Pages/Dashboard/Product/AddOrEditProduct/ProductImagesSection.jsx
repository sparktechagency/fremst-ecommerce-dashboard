import React from "react";
import { Form, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

/**
 * Product images upload section
 */
const ProductImagesSection = ({
  id,
  fileList,
  featuredImageList,
  onFileListChange,
  onFeaturedImageListChange,
}) => {
  return (
    <>
      {/* Main Product Image */}
      <div className="flex-1 mb-5 bg-white p-5 rounded-2xl border-t-8 border-primary">
        <Form.Item
          name="image"
          label="Product Image"
          rules={[
            {
              required: !id || fileList.length === 0,
              message: "Please upload product image!",
            },
          ]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={onFileListChange}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      </div>

      {/* Featured Images */}
      <div className="flex-1 mb-5 bg-white p-5 rounded-2xl border-t-8 border-primary">
        <Form.Item
          name="featuredImage"
          label="Featured Images"
          rules={[
            {
              required: !id || featuredImageList.length === 0,
              message: "Please upload featured images!",
            },
          ]}
        >
          <Upload
            listType="picture-card"
            maxCount={5}
            fileList={featuredImageList}
            multiple={true}
            beforeUpload={() => false}
            onChange={onFeaturedImageListChange}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      </div>
    </>
  );
};

export default ProductImagesSection;
