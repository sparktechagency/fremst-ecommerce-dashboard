import React from "react";
import { Form, Select, Tag } from "antd";
import { useGetCategoriesQuery } from "../../../../redux/apiSlices/productSlice";

const { Option } = Select;

const primaryTagRender = (props) => {
  const { label, closable, onClose } = props;
  return (
    <Tag
      color="primary"
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3, backgroundColor: "#007bff", color: "#fff" }}
    >
      {label}
    </Tag>
  );
};

/**
 * Product metadata section (category, brands, tags, availability)
 */
const ProductMetaSection = () => {
  const { data: categories } = useGetCategoriesQuery();

  return (
    <div className="flex-1 bg-white p-5 rounded-2xl border-t-8 border-primary">
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please select a category!" }]}
      >
        <Select placeholder="Select category" style={{ height: 40 }}>
          {categories?.data?.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.title}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="brands"
        label="Brands"
        rules={[{ required: true, message: "Please select the brands!" }]}
      >
        <Select
          mode="tags"
          style={{ width: "100%", height: 40 }}
          placeholder="Select brands"
          tagRender={primaryTagRender}
        />
      </Form.Item>

      <Form.Item
        name="tags"
        label="Tags"
        rules={[{ required: true, message: "Please select the tags!" }]}
      >
        <Select
          mode="tags"
          style={{ width: "100%", height: 40 }}
          placeholder="Select tags"
          tagRender={primaryTagRender}
        />
      </Form.Item>

      <Form.Item
        name="availability"
        label="Availability"
        rules={[{ required: true, message: "Please select availability!" }]}
      >
        <Select placeholder="Select availability" style={{ height: 40 }}>
          <Option value="isStock">In Stock</Option>
          <Option value="outOfStock">Out of Stock</Option>
        </Select>
      </Form.Item>
    </div>
  );
};

export default ProductMetaSection;
