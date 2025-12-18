import React from "react";
import { Form, Input, Select, InputNumber, Tag } from "antd";

const { TextArea } = Input;

const colorOptions = ["Red", "Blue", "Green", "Yellow", "Black", "White"];

const tagRender = (props) => {
  const { label, closable, onClose } = props;
  return (
    <Tag
      color={label.toLowerCase()}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3, border: "1px solid #4E4E4E", width: 60 }}
    >
      {label}
    </Tag>
  );
};

/**
 * Left side of the product form with basic details
 */
const ProductDetailsForm = () => {
  return (
    <div className="w-1/2 pr-5 bg-white p-5 rounded-2xl border-t-8 border-primary">
      <Form.Item
        name="name"
        label="Product Name"
        rules={[{ required: true, message: "Please input the product name!" }]}
      >
        <Input placeholder="Enter product name" style={{ height: 40 }} />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <TextArea
          rows={4}
          placeholder="Enter product description"
          style={{ height: 100 }}
        />
      </Form.Item>

      <Form.Item
        name="additionalInfo"
        label="Additional Information"
        rules={[
          {
            required: true,
            message: "Please input the additional information!",
          },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Enter additional information"
          style={{ height: 100 }}
        />
      </Form.Item>

      <Form.Item
        name="sizes"
        label="Sizes"
        rules={[{ required: true, message: "Please select the sizes!" }]}
      >
        <Select
          mode="tags"
          style={{ width: "100%", height: 40 }}
          placeholder="Select sizes"
        />
      </Form.Item>

      <Form.Item
        name="colors"
        label="Colors"
        rules={[{ required: true, message: "Please select the colors!" }]}
      >
        <Select
          mode="tags"
          style={{ width: "100%", height: 40 }}
          placeholder="Select colors"
          options={colorOptions.map((color) => ({ value: color }))}
          tagRender={tagRender}
        />
      </Form.Item>

      <Form.Item
        name="price"
        label="Regular Price"
        rules={[{ required: true, message: "Please input the regular price!" }]}
      >
        <InputNumber
          min={0}
          placeholder="Enter regular price"
          style={{ width: "100%", height: 40 }}
        />
      </Form.Item>

      <div className="flex flex-row justify-between w-full gap-5">
        <Form.Item
          name="salePrice"
          label="Sales Price"
          rules={[{ required: true, message: "Please input the sales price!" }]}
          className="w-1/2"
        >
          <InputNumber
            min={0}
            placeholder="Enter sales price"
            style={{ width: "100%", height: 40 }}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: "Please input the quantity!" }]}
          className="w-1/2"
        >
          <InputNumber
            min={0}
            placeholder="Enter quantity"
            style={{ width: "100%", height: 40 }}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default ProductDetailsForm;
