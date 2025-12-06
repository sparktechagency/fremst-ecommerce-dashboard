import React, { useEffect, useMemo, useState } from "react";
import {
  Drawer,
  List,
  Avatar,
  Button,
  Space,
  Typography,
  Input,
  InputNumber,
  Tag,
  Divider,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";
import { readCart, writeCart, clearCart } from "../../utils/orderCart";
import { useCreateOrderMutation } from "../../redux/apiSlices/orderSlice";

const { Text, Title } = Typography;

export default function CartDrawer({
  open,
  onClose,
  products,
  companyId,
  employee,
}) {
  const [cart, setCart] = useState(null);
  const [createOrder, { isLoading: placing }] = useCreateOrderMutation();
  const { TextArea } = Input;

  const getEmployeeName = (emp) => {
    const user = emp?.user || {};
    if (user.name) return user.name;
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
    return name || "";
  };

  useEffect(() => {
    if (open) {
      const c = readCart();
      setCart(c || { item: [] });
    }
  }, [open]);

  const items = useMemo(
    () => (Array.isArray(cart?.item) ? cart.item : []),
    [cart]
  );
  const productMap = useMemo(() => {
    const map = new Map();
    (products || []).forEach((p) => map.set(p._id, p));
    return map;
  }, [products]);

  const getUnitPrice = (p) => {
    if (!p) return 0;
    const val = p.updatedPrice ?? p.price ?? 0;
    const num = typeof val === "string" ? parseFloat(val) : Number(val);
    return Number.isFinite(num) ? num : 0;
  };

  const formatCurrency = (n) => {
    const num = typeof n === "string" ? parseFloat(n) : Number(n);
    const safe = Number.isFinite(num) ? num : 0;
    return `$${safe.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const cartTotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const p = productMap.get(it.product);
      const unit = getUnitPrice(p);
      return sum + unit * (it.quantity || 0);
    }, 0);
  }, [items, productMap]);

  const updateQuantity = (index, qty) => {
    if (qty < 1) return;
    const next = { ...cart, item: [...items] };
    next.item[index] = { ...next.item[index], quantity: qty };
    setCart(next);
    writeCart(next);
  };

  const removeItem = (index) => {
    const next = { ...cart, item: items.filter((_, i) => i !== index) };
    setCart(next);
    writeCart(next);
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      message.warning("Your cart is empty");
      return;
    }
    const payload = {
      companyId,
      employeeId: cart?.employeeId || employee?._id,
      name: cart?.name || getEmployeeName(employee),
      additionalInfo: cart?.additionalInfo || "",
      address: cart?.address || {},
      items: items.map((i) => ({
        product: i.product,
        quantity: i.quantity,
        size: i.size,
      })),
    };
    try {
      await createOrder(payload).unwrap();
      message.success("Order placed successfully");
      clearCart();
      setCart({ item: [] });
      onClose?.();
    } catch (e) {
      message.error(e?.data?.message || "Failed to place order");
    }
  };

  return (
    <Drawer
      title={
        <Space
          align="center"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <Space>
            <ShoppingCartOutlined />
            <Title level={5} style={{ margin: 0 }}>
              Your Cart
            </Title>
          </Space>
          <Tag color="blue">{items.length} items</Tag>
        </Space>
      }
      placement="right"
      width={420}
      open={open}
      onClose={onClose}
      styles={{ body: { padding: 0 } }}
      extra={
        <Button type="text" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Text strong>Additional Info</Text>
          <TextArea
            value={cart?.additionalInfo || ""}
            onChange={(e) => {
              const next = { ...(cart || {}), additionalInfo: e.target.value };
              setCart(next);
              writeCart(next);
            }}
            placeholder="Notes or instructions for the order..."
            rows={3}
          />
        </div>

        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(it, idx) => {
            const p = productMap.get(it.product);
            const unitPrice = getUnitPrice(p);
            const subtotal = unitPrice * (it.quantity || 0);
            return (
              <List.Item
                actions={[
                  <Space key="qty" size={8}>
                    <Text type="secondary">Qty</Text>
                    <InputNumber
                      min={1}
                      value={it.quantity}
                      onChange={(v) => updateQuantity(idx, v || 1)}
                    />
                  </Space>,
                  <Popconfirm
                    key="del"
                    title="Remove this item?"
                    onConfirm={() => removeItem(idx)}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size={56}
                      src={p?.image ? `${imageUrl}/${p.image}` : undefined}
                    />
                  }
                  title={
                    <Space direction="vertical" size={2}>
                      <Text strong>{p?.name || "Product"}</Text>
                      <Space>
                        <Tag>{it.size}</Tag>
                      </Space>
                    </Space>
                  }
                  description={
                    <Space size={12} wrap>
                      {unitPrice ? (
                        <Text type="secondary">
                          Unit: {formatCurrency(unitPrice)}
                        </Text>
                      ) : (
                        <Text type="secondary">Price N/A</Text>
                      )}
                      <Text type="secondary">× {it.quantity}</Text>
                      <Text strong>= {formatCurrency(subtotal)}</Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />

        <Divider />

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Text type="secondary">Total items</Text>
          <Text strong>{items.length}</Text>
        </Space>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text type="secondary">Total amount</Text>
          <Text strong>{formatCurrency(cartTotal)}</Text>
        </Space>

        <Button
          type="primary"
          block
          size="large"
          style={{ marginTop: 16 }}
          loading={placing}
          disabled={!items.length}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </div>
    </Drawer>
  );
}
