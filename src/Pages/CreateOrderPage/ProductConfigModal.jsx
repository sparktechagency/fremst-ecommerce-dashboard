import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Select,
  InputNumber,
  Space,
  Typography,
  Image,
  Tag,
  Divider,
} from "antd";
import { imageUrl } from "../../redux/api/baseApi";

const { Text } = Typography;

export default function ProductConfigModal({
  open,
  product,
  onClose,
  onAddToCart,
}) {
  const sizes = useMemo(
    () => (Array.isArray(product?.sizes) ? product.sizes : []),
    [product]
  );
  const unitPrice = useMemo(
    () => product?.updatedPrice ?? product?.price ?? undefined,
    [product]
  );

  const [size, setSize] = useState(sizes[0] || "Default");
  const [quantity, setQuantity] = useState(1);
  const availableStock =
    typeof product?.quantity === "number" ? product.quantity : 0;

  useEffect(() => {
    if (open) {
      setSize(sizes[0] || "Default");
      setQuantity(availableStock > 0 ? 1 : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?._id]);

  const handleOk = () => {
    if (!product?._id) return;
    if (availableStock <= 0) return;
    if (quantity < 1) return;
    onAddToCart?.({ productId: product._id, quantity, size });
  };

  return (
    <Modal
      title={product ? `Select Options: ${product.name}` : "Select Options"}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Add to Cart"
      okButtonProps={{ disabled: availableStock <= 0 }}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Space
          align="center"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <Space align="center">
            <Image
              src={product?.image ? `${imageUrl}/${product.image}` : undefined}
              alt={product?.name}
              fallback="https://via.placeholder.com/80x80?text=No+Image"
              width={72}
              height={72}
              style={{ objectFit: "cover", borderRadius: 8 }}
              preview={false}
            />
            <div>
              <Text strong style={{ display: "block" }}>
                {product?.name || "Selected Product"}
              </Text>
              {unitPrice !== undefined ? (
                <Text type="success">${unitPrice}</Text>
              ) : (
                <Text type="secondary">Price N/A</Text>
              )}
            </div>
          </Space>
          <Tag color={availableStock === 0 ? "red" : "green"}>
            Stock: {availableStock}
          </Tag>
        </Space>

        <Divider style={{ margin: "12px 0" }} />

        <Form layout="vertical">
          <Form.Item label={<Text strong>Size</Text>}>
            <Select
              value={size}
              onChange={setSize}
              options={(sizes.length ? sizes : ["Default"]).map((s) => ({
                value: s,
                label: s,
              }))}
            />
          </Form.Item>
          <Form.Item
            label={
              <Space>
                <Text strong>Quantity</Text>
                <Tag color={availableStock === 0 ? "red" : "green"}>
                  Available: {availableStock}
                </Tag>
              </Space>
            }
          >
            <InputNumber
              min={1}
              max={availableStock > 0 ? availableStock : undefined}
              value={quantity}
              onChange={(v) => setQuantity(v || 1)}
              disabled={availableStock === 0}
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
}
